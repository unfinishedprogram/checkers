import { Color, MeshPhysicalMaterial, PlaneBufferGeometry, Scene, Vector3 } from "three";
import GLTFGeometryHandler from "./assetHandling/GLTFGeometryHandler";
import PBRMaterialHandler from "./assetHandling/PBRMaterialHandler";
import Checkers from "./checkers";
import { ControlledCamera } from "./controlledCamera";
import EffectRenderer from "./effectRenderer";

import InputHandler from "./inputHandler"
import StatsScreen from "./statsScreen";

export default class Game {
	private geometryHandlerInstance = new GLTFGeometryHandler();
	private materialHandlerInstance = new PBRMaterialHandler();

	private statsScreen: StatsScreen;

	public inputHandler: InputHandler;
	public domElement: HTMLElement;

	private camera: ControlledCamera;
	private renderer: EffectRenderer;
	private checkers: Checkers;

	private scene: Scene;

	constructor() {
		const screenRatio = window.innerWidth / window.innerHeight;
		this.inputHandler = new InputHandler();

		// Initalizing scene/renderer
		this.camera = new ControlledCamera(this.inputHandler, 75, screenRatio, 0.1, 100, new Vector3(0, 0, 0), 7, 7);
		this.scene = new Scene();
		this.renderer = new EffectRenderer(this.scene, this.camera);
		this.statsScreen = new StatsScreen(this.renderer);

		this.domElement = this.renderer.domElement;
		this.inputHandler.setElement(this.domElement);

		this.checkers = new Checkers(this.scene, this.geometryHandlerInstance, this.materialHandlerInstance, this.inputHandler);
	}

	async loadAssets() {
		await Promise.all([
			this.geometryHandlerInstance.loadAsset("models/dracoboard.gltf", "board"),
			this.geometryHandlerInstance.loadAsset("models/dracopiece.gltf", "piece"),
			this.geometryHandlerInstance.addGeometry(new PlaneBufferGeometry(20, 20), "table"),
			this.geometryHandlerInstance.addGeometry(new PlaneBufferGeometry(1, 1), "tile"),

			this.materialHandlerInstance.loadAsset("planks.png", "planks"),
			this.materialHandlerInstance.loadAsset("table.png", "table"),
			this.materialHandlerInstance.loadAsset("plywood.png", "plywood"),

			this.materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({ color: "#FAE9C5", roughness: 0.3 }), "tile_white"),
			this.materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({ color: "#090909", roughness: 0.3 }), "tile_black"),
			this.materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({ color: "#880000", roughness: .25 }), "piece_red"),
			this.materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({ color: "#FFEEEE", roughness: .25 }), "piece_white"),
			this.materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({ emissive: new Color("#0F0").convertSRGBToLinear(), emissiveIntensity: 0.75 }), "preview"),
			this.materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({ emissive: new Color("#FFF").convertSRGBToLinear(), emissiveIntensity: 20 }), "hover"),
			this.materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({ emissive: new Color("#FF0").convertSRGBToLinear(), emissiveIntensity: 20 }), "selected")
		])
	}

	public render(t: number): void {
		const now = performance.now();
		const dt = t - now;
		this.checkers.update(dt);
		requestAnimationFrame(() => this.render(now));
	}
}