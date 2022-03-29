import { PCFShadowMap, Vector2 } from "three";

interface IPieceModel {
	color:"white" | "black"
}

// 2D array of pieces
type IBoardModel = (IPieceModel|null)[][]


export default class CheckersModel {
	board:IBoardModel = [];

	takenPieces = { white:0, black:0 };

	private currentTurn: "white" | "black" = "white";

	constructor() {
		// Initialize an empty board
		for(let i = 0; i < 8; i++){
			this.board.push([]);
			for(let j = 0; j < 8; j++){
				this.board[i][j] = null;
			}
		}
	}

	public getTurn(){
		return this.currentTurn;
	}

	// Gets a piece at a given position
	getPiece(pos:Vector2) {
		return this.board[pos.y][pos.x];
	}
	
	// Sets a given location to a piece value
	setPiece(pos:Vector2, piece:IPieceModel) {
		return this.board[pos.y][pos.x] = piece;
	}

	
	// Swaps the values of two board locations, 
	// Perfect for moving a piece, should almost always be prefered to removing and then adding
	swap(aPos:Vector2, bPos:Vector2) {
		[this.board[aPos.y][aPos.x], this.board[bPos.y][bPos.x]] = 
			[this.board[bPos.y][bPos.x], this.board[aPos.y][aPos.x]];
	}
	
	pieceTaken(pieceColor:"white" | "black"){
		this.takenPieces[pieceColor]++;
	}
}