import { Object3D, Vector3 } from "three";
import createMesh from "../assetHandling/createMesh";

export enum PieceColor { RED, WHITE };

export default class Piece extends Object3D {
	king = false;
	
	constructor(public color: PieceColor) {
		super();
		this.add(createMesh("piece",	color == PieceColor.RED ? "piece_red" : "piece_white"));
		this.scale.set(0.4, 0.4, 0.4);
		this.children[0].rotateX(Math.PI);
		this.children[0].rotateY(color == PieceColor.RED ? Math.PI : 0);
	}

	public makeKing():void {
		this.king = true;
		this.children[0].rotateX(Math.PI);
	}
}