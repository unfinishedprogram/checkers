import { Mesh } from "three";
import { animateProperty } from "./animation/animate";
import easingsFunctions from "./animation/easingFunctions";
import createMesh from "./assetHandling/createMesh";

export enum PieceColor { RED, WHITE };

export default class Piece extends Mesh {
	king = false;

	constructor(public color: PieceColor) {
		super();
		this.add(createMesh("piece",	color == PieceColor.RED ? "piece_red" : "piece_white"));
		this.scale.set(0.4, 0.4, 0.4);
		this.children[0].rotateX(Math.PI);
		this.children[0].rotateY(color == PieceColor.RED ? Math.PI : 0);
		setTimeout(() => {
			animateProperty(Math.random() * 2 + 5, 0, (val:number) => this.children[0].position.setY(val), 500, easingsFunctions.easeOutBounce)
		}, 6000)
	}

	public makeKing():void {
		this.king = true;
		this.children[0].rotateX(Math.PI);
	}

	setHover(status:boolean) {}
	hover(d:number) {}
	update(){
	}
}