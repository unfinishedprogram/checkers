import { Color, Group, Mesh, MeshLambertMaterial, MeshPhysicalMaterial, Vector2 } from "three";
import animateVector from "./animateVector";
import { BoardGeo } from "./boardGeo";
import { MeshHandler } from "./meshHandler";
import Piece, { PieceColor } from "./piece";

type Tile = Piece | undefined;
const previewMat:MeshPhysicalMaterial  = new MeshPhysicalMaterial({emissive:new Color("#0F0"), emissiveIntensity:0.25});
export default class GameBoard {
	hovering:Vector2|undefined;
	selected:Vector2|undefined;
	geometry = new BoardGeo();
	previewMeshes:Mesh[] = [];
	private pieces:Group = new Group();

	tiles: Tile[] = [];

	private width : number = 8;
	private height : number = 8;

	set(pos:Vector2, piece: Tile) {
		this.tiles[this.width * pos.y + pos.x] = piece;
		if(piece) {
			piece.position.copy(this.geometry.getTile(pos.x, pos.y).position);
		}
	}

	move(from:Vector2, to:Vector2) {
		let p = this.get(from);
		let goal = this.geometry.getTile(to.x, to.y);

		if(p){
			animateVector(p.position, goal.position, 250);
			this.tiles[this.width * to.y + to.x] = p;
			this.set(from, undefined);
		}
	}

	setPreview(pos:Vector2, mesh:Mesh) {
		mesh.position.copy(this.geometry.getTile(pos.x, pos.y).position);
		mesh.rotateX(Math.PI/2)
		this.geometry.add(mesh);
		mesh.castShadow=false;
		mesh.receiveShadow=false;
		this.previewMeshes.push(mesh);
	}

	clearPreview():void{
		this.previewMeshes.forEach(mesh => {
			this.geometry.remove(mesh);
		})

		this.previewMeshes = [];
	}

	showPreviews(places:Vector2[]){
		MeshHandler.getMesh("piece").then((mesh) => {
			mesh.material = previewMat;
			places.forEach(place => this.setPreview(place, mesh.clone()))
		})
	}

	get(pos:Vector2): Tile {
		return this.tiles[this.width * pos.y + pos.x];
	}

	click(pos:Vector2) {
		if(this.selected){
			let valid = false;

			this.getValidMoves(this.selected).forEach(move => {
				if(move.equals(pos)) valid = true;
			})

			if(valid){
				this.move(this.selected, pos)
				this.geometry.getTile(this.selected.x, this.selected.y).endSelect();
				this.selected = undefined;
				this.clearPreview();
				return;
			}
		}

		if(this.selected && this.get(pos)){
			this.geometry.getTile(this.selected.x, this.selected.y).endSelect();
			this.clearPreview();

			if(this.selected.x == pos.x && this.selected.y == pos.y){
				this.geometry.getTile(this.selected.x, this.selected.y).endSelect();
				this.clearPreview();
				this.selected = undefined;
				return;
			}
		}

		if (this.get(pos)){
			this.selected = pos;
			this.geometry.getTile(pos.x, pos.y).startSelect();
			this.clearPreview();
			this.showPreviews(this.getValidMoves(pos));
		}
	}

	hover(pos:Vector2) {
		if (!this.hovering){
			this.hovering = pos;
			this.geometry.getTile(pos.x, pos.y).startHover();
			return;
		} 

		if(pos.x != this.hovering.x || pos.y != this.hovering.y){
			let tile = this.geometry.getTile(this.hovering.x, this.hovering.y);
			tile.endHover();
		}

		this.hovering = pos;
		this.geometry.getTile(pos.x, pos.y).startHover();
	}

	release(pos:Vector2) {

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
		console.log(this.pieces.children.length);
		return this.pieces;
	}

	isValidPos(pos:Vector2):boolean{
		if(pos.x >= 8) return false;
		if(pos.y >= 8) return false;
		if(pos.x < 0) return false;
		if(pos.y < 0) return false;
		return true;
	}

	getValidMoves(pos:Vector2):Vector2[] {
		let arr:Vector2[] = [];
		for(let dir of [
			new Vector2(1, 1), 
			new Vector2(-1, -1), 
			new Vector2(1, -1), 
			new Vector2(-1, 1)]){
			//close
			if(this.get(pos.clone().add(dir))){
				if(!this.get(pos.clone().add(dir.clone().multiplyScalar(2)))){
					arr.push(pos.clone().add(dir.clone().multiplyScalar(2)));
				}
			} else {
				if(pos.clone().add(dir)){
					arr.push(pos.clone().add(dir));
				}
			}
		}

		return arr.filter(this.isValidPos);
	}

	update(d:number) {
		this.geometry.update(d);
		if(this.hovering){
			let h = this.get(this.hovering);
			if(h){
				h.hover(d);
			}
		}
		
		this.pieces.children.forEach((p) => {
			let piece = (p as Piece);
			piece.update(d);
		})
	}
}