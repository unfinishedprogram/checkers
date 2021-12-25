import { Object3D } from "three";
import createMesh from "./assetHandling/createMesh";

export enum PieceColor {
	RED,
	WHITE
}

export default class Piece extends Object3D {
	king:Boolean = false;
	hoverHeight:number = Math.random() * 20 + 10;
	currentHeight:number = Math.random() * 20 + 10;
	hovering:boolean = false;

	constructor(public color: PieceColor) {
		super();
		this.add(createMesh("piece",	color == PieceColor.RED ? "piece_red" : "piece_white"));
		this.scale.set(0.4, 0.4, 0.4);
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