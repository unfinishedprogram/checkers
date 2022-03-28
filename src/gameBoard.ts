import { Group, Mesh, Vector2, Vector3 } from "three";
import { animateProperty, animateVector } from "./animation/animate";
import Piece, { PieceColor } from "./piece";
import easingFunctions from "./animation/easingFunctions";
import easingsFunctions from "./animation/easingFunctions";

type Tile = Piece | undefined;

export default class GameBoard {
	whiteTakenPile = new Vector3(3, -0.65, -5);
	redTakenPile = new Vector3(-3, -0.65, 5);

	hovering: Vector2|undefined;
	selected: Vector2|undefined;

	geometry = new BoardGeo();

	previewMeshes:Mesh[] = [];
	private pieces:Group = new Group();

	currentTurn = PieceColor.WHITE;
	tiles: Tile[] = [];

	jumpChain:boolean = false;

	private width : number = 8;
	private height : number = 8;

	constructor(private setTurn:(turn:PieceColor) => void){
		setTurn(this.currentTurn);
	};

	set(pos:Vector2, piece: Tile) {
		this.tiles[this.width * pos.y + pos.x] = piece;
		if(piece) {
			piece.position.copy(this.geometry.getTile(pos).position);
			piece.position.setY(0);
		}
	}

	takePiece(pos:Vector2){	
		const piece = this.get(pos) as Piece;
		let pile = piece.color == PieceColor.RED ? this.redTakenPile : this.whiteTakenPile;

		setTimeout(() => {
			pile.add(new Vector3(0, 0.1, 0));
			animateVector(piece!.position, pile , 500, easingsFunctions.easeInOutCubic);
		}, 250)

		this.set(pos, undefined)
	}

	nextTurn(){
		this.currentTurn = this.currentTurn == PieceColor.RED ? PieceColor.WHITE : PieceColor.RED;
		this.setTurn(this.currentTurn);
	}

	move(from:Vector2, to:Vector2) {
		const piece = this.get(from);
		const goal = this.geometry.getTile(to);

		if(piece){
			if(Math.abs(from.clone().sub(to).x) > 1){ 
				this.jumpChain = true;
				const midDiff = (to.clone().sub(from)).multiplyScalar(0.5);
				const jumpedPos = from.clone().add(midDiff);
				const jumpedPiece = this.get(jumpedPos);

				if(jumpedPiece){
					this.takePiece(jumpedPos);
				}
			}

			animateVector(piece.position, goal.position, 500, easingFunctions.easeInOutCubic);
			
			setTimeout(() => {
				animateProperty(piece!.position.y, 0, (val:number) => piece?.position.setY(val), 250, easingFunctions.easeInCubic);
			}, 250);

			animateProperty(piece!.position.y, 0.5, (val:number) => piece?.position.setY(val), 250, easingFunctions.easeOutCubic);

			this.set(to, piece);

			console.log("This should exist we are setting on the previous line", this.get(to))

			this.set(from, undefined);

			if(to.y == 7 || to.y == 0) {
				piece.makeKing();
			}

			if(this.jumpChain){
				if(this.getValidMoves(to).length) {
					console.log("chaining jumps", to);
					this.click(to);
				} else {
					this.jumpChain = false;
					this.nextTurn();
				}
			} else {
				this.nextTurn();
			}
		}
	}

	clearPreview():void {
		this.geometry.clearPreview();
	}

	showPreviews(places:Vector2[], piece:Piece) {
		this.geometry.showPreviews(places, piece);
	}

	get(pos:Vector2): Tile {
		return this.tiles[this.width * pos.y + pos.x];
	}

	click(pos:Vector2) {
		if(this.selected){
			if(this.getValidMoves(this.selected).filter(move => move.equals(pos)).length) {
				this.move(this.selected, pos);
				this.geometry.select(undefined);
				this.selected = undefined;
				this.clearPreview();
				return;
			}
		}

		if(this.selected && this.get(pos)){
			if(this.selected.equals(pos)){
				this.geometry.select(undefined);
				this.clearPreview();
				this.selected = undefined;
				return;
			}
		}

		if (this.get(pos)){
			if(this.get(pos)!.color == this.currentTurn){
				this.selected = pos;
				this.geometry.select(pos);
				this.clearPreview();
				this.showPreviews(this.getValidMoves(pos), this.get(pos)!);
			}
		}
	}

	hover(pos:Vector2) {
		this.geometry.hover(pos);
		this.hovering = pos;
		return;
	}

	initalizePieces():void {
		for(let x = 0; x < 8; x++) {
			for(let y = 0; y < 3; y++) {
				if(!((x+y) % 2)) {
					let piece = new Piece(PieceColor.RED);
					this.pieces.add(piece);
					this.set(new Vector2(x, y), piece)
				};
			}
		}

		for(let x = 0; x < 8; x++) {
			for(let y = 5; y < 8; y++) {
				if(!((x+y) % 2)){
					let piece = new Piece(PieceColor.WHITE);
					this.pieces.add(piece);
					this.set(new Vector2(x, y), piece);
				} 
			}
		}
	}

	getGeometry() {
		return this.geometry;
	}

	getPieces():Group {
		return this.pieces;
	}

	isValidPos(pos:Vector2):boolean{
		if(pos.x >= 8) return false;
		if(pos.y >= 8) return false;
		if(pos.x < 0) return false;
		if(pos.y < 0) return false;
		return true;
	}

	getJumpingMoves(pos:Vector2):Vector2[] {
		this.getValidMoves(pos).forEach(move => {
			console.log(Math.abs(move.x - pos.x))
		})

		return this.getValidMoves(pos).filter(move => Math.abs(move.x - pos.x) == 2);
	}

	getValidMoves(pos:Vector2):Vector2[] {
		let pieceColor = this.get(pos)!.color;
		let king = this.get(pos)!.king;

		let arr:Vector2[] = [];
		[ new Vector2(1, 1), 
			new Vector2(-1, -1), 
			new Vector2(1, -1), 
			new Vector2(-1, 1)]
		.forEach(dir => {
			let dp = pos.clone().add(dir);
			let jp = dp.clone().add(dir);

			if(!this.get(dp)){
				if(!this.jumpChain) arr.push(dp);
			} else if(!this.get(jp) && pieceColor != this.get(dp)?.color){
				arr.push(jp);
			}
		})

		arr = arr.filter(this.isValidPos);

		if(!king){
			arr = arr.filter(loc => {
				let diff = loc.clone().sub(pos);
				return pieceColor == PieceColor.RED ? diff.y > 0 : diff.y < 0;
			})
		}

		return arr;
	}

	update(d:number) {
		this.pieces.children.forEach( p => {
			(p as Piece).update();
		})
	}
}