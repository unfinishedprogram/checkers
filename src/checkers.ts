import { Scene, Vector3 } from "three";
import GLTFGeometryHandler from "./assetHandling/GLTFGeometryHandler";
import MaterialHandler from "./assetHandling/PBRMaterialHandler";
import CheckersModel from "./checkersModel";
import CheckersView from "./checkersView";
import InputHandler from "./inputHandler";

export default class Checkers {
	private model:CheckersModel;
	private view:CheckersView;

	constructor(
		scene: Scene,
		geometries: GLTFGeometryHandler,
		materials: MaterialHandler,
		input: InputHandler
	) {
		this.model = new CheckersModel();
		this.view = new CheckersView(scene, geometries, materials, input);
	}

	private initScene() {
		
	}

	public update(dt: number) {

	}
}