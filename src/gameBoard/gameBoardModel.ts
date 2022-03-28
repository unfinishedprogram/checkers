import { Vector2 } from "three";
import { PieceColor } from "../piece";

class Piece {
	constructor(public color:PieceColor, public position:Vector2) {};
}

export default class GameBoardModel {
	pieces:Piece[] = [];

	constructor() {
		
	}

	// Gets the piece at a given postiion
	getPiece( pos:Vector2 ) : Piece | undefined {
		let filtered = this.pieces.filter( p => p.position.equals(pos));
		return filtered ? filtered[0] : undefined;
	}

	// Swaps two pieces given there positions, 
	swap(a:Vector2, b:Vector2) {
		const pa = this.getPiece(a);
		const pb = this.getPiece(b);

		pa?.position.copy(b);
		pb?.position.copy(a);
	}

	addPiece( pos:Vector2, color:PieceColor ) {
		this.pieces.push(new Piece(color, pos));
	}
}