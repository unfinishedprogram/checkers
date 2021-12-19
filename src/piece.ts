import { Material, MeshPhysicalMaterial, Object3D } from "three";
import { MeshHandler } from "./meshHandler";

export enum PieceColor {
	RED,
	WHITE
}

const mats:Material[] = [
	new MeshPhysicalMaterial({color:"#F55"}),
	new MeshPhysicalMaterial({color:"#EEE"})
];

export default class Piece extends Object3D {
	king:Boolean = false;
	hoverHeight:number = Math.random() * 20 + 10;
	currentHeight:number = Math.random() * 20 + 10;
	hovering:boolean = false;

	constructor(public color: PieceColor) {
		super();
		MeshHandler.loadMesh("dracopiece.gltf", "piece").then((m) => {
			let mesh = m.clone();
			mesh.material = mats[color == PieceColor.RED ? 1 : 0];
			this.add(mesh);
			this.rotateX(Math.PI/2)
			this.children[0].rotateX(Math.PI);
		})
	}

	public makeKing():void {
		this.king = true;
		this.children[0].rotateX(Math.PI);
	}

	setHover(status:boolean) {
		if(this.hovering) {
			
		}
	}

	hover(d:number) {
		this.hoverHeight += d/1000;
	}

	update(d:number){
		this.hoverHeight *= 0.97;
		// this.position.setZ(this.hoverHeight);
	}
}