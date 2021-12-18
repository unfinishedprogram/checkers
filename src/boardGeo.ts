import { Color, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial,  PlaneBufferGeometry, Raycaster, Vector2 } from "three";

const mats:MeshStandardMaterial[] = [
	new MeshPhysicalMaterial({color:"white"}),
	new MeshPhysicalMaterial({color:"black"})
];

function genMat(i : number) {
	return i ? new MeshPhysicalMaterial({color:"white"}) : new MeshPhysicalMaterial({color:"black"});
}

class TileGeo extends Mesh {
	private hovering:boolean = false;
	private selected:boolean = false;
	private pos:Vector2;
	constructor(private x:number, private y:number) {
		super(new PlaneBufferGeometry(1, 1), genMat((x + y) % 2));
		this.position.set(x-3.5, y-3.5, 0);
		this.pos = new Vector2(x, y);
		this.receiveShadow = true;
	}

	startSelect(){
		(this.material as MeshPhysicalMaterial).emissive = new Color("#FF6");
		this.selected = true;
	}

	endSelect() {
		(this.material as MeshPhysicalMaterial).emissive = new Color(this.hovering ? "#FFF" : "#000" );
		this.selected = false;
	}

	startHover() {
		this.hovering = true;
		if(!this.selected)
			(this.material as MeshPhysicalMaterial).emissive = new Color("#FFF");
	}

	endHover() {
		this.hovering = false;
		if(!this.selected)(this.material as MeshPhysicalMaterial).emissive = new Color("#000");
	}

	getPos () {
		return this.pos;
	}
}

export class BoardGeo extends Group {
	tiles:TileGeo[] = [];
	constructor() {
		super();
		for(let x = 0; x < 8; x++) {
			for(let y = 0; y < 8; y++) {
				let tile = new TileGeo(y, x);
				this.add(tile);
				this.tiles.push(tile);
			}
		}
	}

	castCursor (raycaster:Raycaster):Vector2 | undefined {
		var intersects = raycaster.intersectObjects( this.tiles );
		if(intersects.length >= 1) {
			return (intersects[0].object as TileGeo).getPos();
		}
		return;
	}

	getTile(x:number, y:number): TileGeo {
		return this.tiles[y * 8 + x];
	}

	update(d:number){
	}
}