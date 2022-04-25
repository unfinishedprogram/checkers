import { Object3D, Vector3 } from "three";
import createMesh from "../assetHandling/createMesh";


export default class Piece extends Object3D {
	king = false;
	constructor(public color: "red"|"white") {
		super();
		this.add(createMesh("piece", `piece_${color}`))
		this.scale.set(0.4, 0.4, 0.4);
		this.children[0].rotateX(Math.PI);
		this.children[0].rotateY(color == "red" ? Math.PI : 0);
	}

	public makeKing():void {
		this.king = true;
		this.children[0].rotateX(Math.PI);
	}
}