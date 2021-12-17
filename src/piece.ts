import { Material, MathUtils, Mesh, MeshStandardMaterial, Object3D } from "three";
import { MeshHandler } from "./meshHandler";

export enum PieceColor {
	RED,
	WHITE
}

const mats:Material[] = [];
mats.push(new MeshStandardMaterial({color:"red"}));
mats.push(new MeshStandardMaterial({color:"white"}));

export default class Piece extends Object3D {
	constructor(public color: PieceColor) {
		super();
		MeshHandler.loadMesh("./models/checker.gltf", "piece").then((m) => {
			let mesh = m.clone();
			mesh.material = mats[color == PieceColor.RED ? 1 : 0];
			this.add(mesh);
		})
	}
}