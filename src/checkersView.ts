import {Scene} from "three"
import createMesh from "./assetHandling/createMesh";
import GLTFGeometryHandler from "./assetHandling/GLTFGeometryHandler";
import MaterialHandler from "./assetHandling/PBRMaterialHandler";
import createBoard from "./gameObjects/board";
import { createTable } from "./gameObjects/table";
import { createTile } from "./gameObjects/tile";
import InputHandler from "./inputHandler";


export default class CheckersView {
	constructor(
		private scene: Scene,
		private geometries: GLTFGeometryHandler,
		private materials: MaterialHandler,
		private input: InputHandler
	) {
		gameObjects: {
			previewPieces: [
				createMesh("piece", "preview"),
				createMesh("piece", "preview"),
				createMesh("piece", "preview"),
				createMesh("piece", "preview")
			]
			tiles: createTile
			board: createBoard(),
			table: createTable(),
			pieces: []
		}
	}
}