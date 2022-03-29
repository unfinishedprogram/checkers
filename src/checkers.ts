import { Scene, Vector3 } from "three";
import GLTFGeometryHandler from "./assetHandling/GLTFGeometryHandler";
import MaterialHandler from "./assetHandling/PBRMaterialHandler";
import InputHandler from "./inputHandler";

export default class Checkers {
	constructor(
		private scene: Scene,
		private geometries: GLTFGeometryHandler,
		private materials: MaterialHandler,
		private input: InputHandler
	) {
		
	}

	private initScene() {
		
	}

	public update(dt: number) {

	}
}