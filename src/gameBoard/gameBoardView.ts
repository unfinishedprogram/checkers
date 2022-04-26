import { Group, Mesh } from "three";
import createMesh from "../assetHandling/createMesh";
import { createTile } from "../gameObjects/tile";

export class GameBoardView extends Group {
	static yOffset = -0.1;

	private hoverTile:Mesh;
	private selectTile:Mesh;
	
	private previewPieces:Mesh[] = [];
	private boardTiles: Mesh[] = [];

	constructor(){
		super();

		this.hoverTile = createMesh("tile", "hover");
		this.selectTile = createMesh("tile", "selected");

		this.hoverTile.position.setY(0.001 + GameBoardView.yOffset);
		this.selectTile.position.setY(0.002 + GameBoardView.yOffset);

		this.hoverTile.rotateX(-Math.PI/2);
		this.selectTile.rotateX(-Math.PI/2);

		this.initializeBoardTiles();
		this.initializePreviewPieces();
	}

	initializeBoardTiles():void {
		for(let x = 0; x < 8; x++) {
			for(let y = 0; y < 8; y++) {
				let tile = createTile(y, x);
				tile.position.setY(GameBoardView.yOffset)
				this.boardTiles.push(tile);
			}
		}
	}

	initializePreviewPieces():void {
		for(let i = 0; i < 4; i++){
			let mesh = createMesh("piece", "preview")
			mesh.scale.set(0.4, 0.4, 0.4);
			mesh.receiveShadow = false;
			this.previewPieces.push(mesh)
		}
	}
}