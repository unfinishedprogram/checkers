import { Color, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial,  PlaneBufferGeometry, Raycaster, Vector2 } from "three";

const mats:MeshStandardMaterial[] = [
	new MeshPhysicalMaterial({color:"white"}),
	new MeshPhysicalMaterial({color:"black"})
];
const materials = {
	hover: new MeshPhysicalMaterial({emissive:new Color("#FFF")}),
	select: new MeshPhysicalMaterial({emissive:new Color("#FF0")})
}


class TileGeo extends Mesh {
	private pos:Vector2;

	constructor(private x:number, private y:number) {
		super(new PlaneBufferGeometry(1, 1), mats[(x + y) % 2]);
		this.position.set(x-3.5, y-3.5, 0);
		this.pos = new Vector2(x, y);
		this.receiveShadow = true;
	}

	getPos () {
		return this.pos;
	}
}

export class BoardGeo extends Group {
	private zOffset = -0.1;
	private tiles:TileGeo[] = [];
	private castPlane:Mesh = new Mesh(new PlaneBufferGeometry(8, 8));

	private hoverMesh:Mesh = new Mesh(new PlaneBufferGeometry(1, 1), materials.hover);
	private selectMesh:Mesh = new Mesh(new PlaneBufferGeometry(1, 1), materials.select);

	constructor() {
		super();

		this.selectMesh.position.setZ(0.002 + this.zOffset);
		this.hoverMesh.position.setZ(0.001 + this.zOffset);

		this.selectMesh.visible = false;
		this.hoverMesh.visible = false;

		this.castPlane.position.setZ(this.zOffset);

		for(let x = 0; x < 8; x++) {
			for(let y = 0; y < 8; y++) {
				let tile = new TileGeo(y, x);
				tile.position.setZ(this.zOffset)
				this.tiles.push(tile);
			}
		}

		this.add(...this.tiles, this.selectMesh, this.hoverMesh)
	}

	castCursor (raycaster:Raycaster):Vector2 | undefined {
		var intersects = raycaster.intersectObject( this.castPlane );
		if(intersects.length >= 1) {
			return new Vector2(Math.floor(intersects[0].point.x + 4), Math.floor(intersects[0].point.y + 4));
		}
		return;
	}

	getTile(pos:Vector2): TileGeo {
		return this.tiles[pos.y * 8 + pos.x];
	}

	update(d:number){

	}

	select(pos:Vector2|undefined){
		if(pos){
			let tile = this.getTile(pos);
			this.selectMesh.position.setX(tile.position.x);
			this.selectMesh.position.setY(tile.position.y);
			this.selectMesh.visible = true;
		} else {
			this.selectMesh.visible = false;
		}
	}

	hover(pos:Vector2|undefined){
		if(pos){
			let tile = this.getTile(pos);
			this.hoverMesh.position.setX(tile.position.x);
			this.hoverMesh.position.setY(tile.position.y);
			this.hoverMesh.visible = true;
		} else {
			this.hoverMesh.visible = false;
		}
	}
}