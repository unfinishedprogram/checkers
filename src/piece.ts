import { Material, MathUtils, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from "three";
import { MeshHandler } from "./meshHandler";

export enum PieceColor {
	RED,
	WHITE
}

const mats:Material[] = [];
mats.push(new MeshPhysicalMaterial({color:"#F55"}));
mats.push(new MeshPhysicalMaterial({color:"#EEE"}));

export default class Piece extends Object3D {
	king:Boolean = false;
	hoverStatus:number = Math.random() * 20 + 10;

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

	hover(d:number) {
		this.hoverStatus += d/1000;
	}

	update(d:number){
		this.hoverStatus *= 0.97;
		this.position.setZ(this.hoverStatus);
	}
}