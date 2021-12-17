import Piece from "./piece";

export default class Tile {
	piece : Piece | undefined ;
	constructor(public x: number, public y:number) {

	}
	click():void {
		return;
	}
}