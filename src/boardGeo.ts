import { 
	Color, 
	Group, 
	Material, 
	Mesh, 
	MeshPhysicalMaterial, 
	PlaneBufferGeometry, 
	PlaneGeometry, 
	Raycaster, 
	Vector2
} from "three";

const mats:Material[] = [
	new MeshPhysicalMaterial({color:"#FAE9C5", roughness:0.3}),
	new MeshPhysicalMaterial({color:"#090909", roughness:0.3})
];

const materials = {
	hover: new MeshPhysicalMaterial({emissive:new Color("#FFF").convertSRGBToLinear(), emissiveIntensity:20}),
	select: new MeshPhysicalMaterial({emissive:new Color("#FF0").convertSRGBToLinear(), emissiveIntensity:20})
}


class TileGeo extends Mesh {
	constructor(x:number, y:number) {
		super(new PlaneGeometry(1, 1), mats[(x + y) % 2]);
		this.position.set(x-3.5, 0, y-3.5);
		this.rotateX(-Math.PI/2)
		this.receiveShadow = true;
	}
}

export class BoardGeo extends Group {
	private yOffset = -0.1;
	private tiles:TileGeo[] = [];
	private castPlane:Mesh = new Mesh(new PlaneBufferGeometry(8, 8));

	private hoverMesh:Mesh = new Mesh(new PlaneBufferGeometry(1, 1), materials.hover);
	private selectMesh:Mesh = new Mesh(new PlaneBufferGeometry(1, 1), materials.select);

	constructor() {
		super();
		this.selectMesh.position.setY(0.002 + this.yOffset);
		this.hoverMesh.position.setY(0.001 + this.yOffset);

		this.selectMesh.visible = false;
		this.hoverMesh.visible = false;

		this.castPlane.position.setY(this.yOffset*2);
		this.add(this.castPlane);
		this.castPlane.rotateX(-Math.PI/2)
		this.hoverMesh.rotateX(-Math.PI/2)
		this.selectMesh.rotateX(-Math.PI/2);

		for(let x = 0; x < 8; x++) {
			for(let y = 0; y < 8; y++) {
				let tile = new TileGeo(y, x);
				tile.position.setY(this.yOffset)
				this.tiles.push(tile);
			}
		}

		this.add(...this.tiles, this.selectMesh, this.hoverMesh)
	}

	castCursor (raycaster:Raycaster):Vector2 | undefined {
		var intersects = raycaster.intersectObject( this.castPlane );

		if(intersects.length >= 1) {
			return new Vector2(Math.floor(intersects[0].point.x + 4), Math.floor(intersects[0].point.z + 4));
		}
		return;
	}

	getTile(pos:Vector2): TileGeo {
		return this.tiles[pos.y * 8 + pos.x];
	}

	select(pos:Vector2|undefined){
		if(pos){
			let tile = this.getTile(pos);
			this.selectMesh.position.setX(tile.position.x);
			this.selectMesh.position.setZ(tile.position.z);
			this.selectMesh.visible = true;
		} else {
			this.selectMesh.visible = false;
		}
	}

	hover(pos:Vector2|undefined){
		if(pos){
			let tile = this.getTile(pos);
			this.hoverMesh.position.setX(tile.position.x);
			this.hoverMesh.position.setZ(tile.position.z);
			this.hoverMesh.visible = true;
		} else {
			this.hoverMesh.visible = false;
		}
	}
}