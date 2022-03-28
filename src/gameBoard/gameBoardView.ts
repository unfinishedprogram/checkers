import { Euler, Group, Mesh, PlaneBufferGeometry, Raycaster, Vector2, Vector3 } from "three";
import createMesh from "../assetHandling/createMesh";
import { createTile } from "../gameObjects/tile";
import Piece, { PieceColor } from "../piece";

export class GameBoardView extends Group {
	static yOffset = -0.1;

	private hoverTile:Mesh;
	private selectTile:Mesh;
	
	private whitePieces: Mesh[] = [];
	private redPieces: Mesh[] = [];
	private previewPieces:Mesh[] = [];
	private boardTiles: Mesh[] = [];

	private castPlane:Mesh;

	private whiteTakenPile = new Vector3(3, -0.65, -5);
	private redTakenPile = new Vector3(-3, -0.65, 5);

	constructor() {
		super();

		this.castPlane = new Mesh(new PlaneBufferGeometry(8, 8));

		this.hoverTile = createMesh("tile", "hover");
		this.selectTile = createMesh("tile", "selected");

		this.hoverTile.position.setY(0.001 + GameBoardView.yOffset);
		this.selectTile.position.setY(0.002 + GameBoardView.yOffset);
		this.castPlane.position.setY(GameBoardView.yOffset*2);

		this.castPlane.rotateX(-Math.PI/2);
		this.hoverTile.rotateX(-Math.PI/2);
		this.selectTile.rotateX(-Math.PI/2);

		this.selectTile.visible = false;
		this.hoverTile.visible = false;

		this.initializeBoardTiles();
		this.initializePreviewPieces();
		this.initializePieceMeshes();

		this.add(...this.previewPieces, ...this.boardTiles, this.castPlane, this.hoverTile, this.selectTile);
	}

	castCursor(raycaster:Raycaster){
		// TODO Do this
	}

	private initializeBoardTiles():void {
		for(let x = 0; x < 8; x++) {
			for(let y = 0; y < 8; y++) {
				let tile = createTile(y, x);
				tile.position.setY(GameBoardView.yOffset)
				this.boardTiles.push(tile);
			}
		}
	}

	private initializePieceMeshes():void {
		for(let i = 0; i < 12; i++){
			this.whitePieces.push(new Piece(PieceColor.WHITE));
			this.redPieces.push(new Piece(PieceColor.RED));
		}
	}

	private initializePreviewPieces():void {
		for(let i = 0; i < 4; i++){
			let mesh = createMesh("piece", "preview")
			mesh.scale.set(0.4, 0.4, 0.4);
			mesh.receiveShadow = false;
			this.previewPieces.push(mesh)
		}
	}

	private getTile(pos:Vector2): Mesh {
		return this.boardTiles[pos.y * 8 + pos.x];
	}

	public showPreviews(places:Vector2[], king:boolean){
		this.previewPieces.forEach(p => p.visible = false);
		places.forEach((v, i) => {
			this.previewPieces[i].position.copy(this.getTile(v).position);
			this.previewPieces[i].setRotationFromEuler(new Euler());
			if (king) this.previewPieces[i].rotateX(Math.PI/2);
		});
	}

	public getCastLocation(raycaster:Raycaster): Vector2 | undefined {
		let intersects = raycaster.intersectObject( this.castPlane );
		if (intersects ) {
			const x = Math.floor(intersects[0].point.x + 4);
			const y = Math.floor(intersects[0].point.z + 4);
			return new Vector2(x, y);
		}
	}

	moveToPos(mesh:Mesh, pos:Vector2) {
		const tile = this.getTile(pos);
		mesh.position.setX(tile.position.x);
		mesh.position.setZ(tile.position.z);
	}

	select ( pos?:Vector2 ) {
		if (pos) this.moveToPos(this.selectTile, pos);
		this.selectTile.visible = !!pos;
	}

	hover(pos?:Vector2) {
		if (pos) this.moveToPos(this.hoverTile, pos);
		this.hoverTile.visible = !!pos;
	}
}