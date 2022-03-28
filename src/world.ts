import { 
	EquirectangularReflectionMapping,
	Object3D,
	Raycaster,
	Scene,
	Vector2,
	Vector3,
} from "three";

import GameBoardController from "./gameBoard/gameBoardController";
import StatsScreen from "./statsScreen";
import EffectRenderer from "./effectRenderer";
import { RGBELoader } from "../node_modules/three/examples/jsm/loaders/RGBELoader";
import { ControlledCamera } from "./controlledCamera";
import { createTable } from "./gameObjects/table";
import createBoard from "./gameObjects/board";

export default class World {
	private deltaT: number = 0;
	private camera: ControlledCamera;
	private scene: Scene;
	private statsScreen: StatsScreen;
	private raycaster: Raycaster = new Raycaster();
	private renderer: EffectRenderer;
	private boardController: GameBoardController;

	constructor() {
		this.scene = new Scene();
		this.camera = new ControlledCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100, new Vector3(0, 0, 0), 7, 7);
		this.renderer = new EffectRenderer(this.scene, this.camera);

		this.statsScreen = new StatsScreen(this.renderer);

		this.camera.setDomElement(this.renderer.domElement);

		document.body.appendChild(this.statsScreen.getElm());
		document.body.appendChild(this.renderer.domElement);

		this.boardController = new GameBoardController();

		this.addObject(this.boardController.view);

		window.addEventListener("keypress", () => this.camera.rotateCamera(0.01));

		let loader = new RGBELoader();

		loader.loadAsync("./textures/peppermint_powerplant_1k.hdr").then(tex => {
			tex.mapping = EquirectangularReflectionMapping;
			this.scene.environment = tex;
			this.scene.background = tex;
		});

		this.addObject(createTable());
		this.addObject(createBoard());
		this.setupMouseHandler();
	}

	getCamera() {
		return this.camera;
	}

	setupMouseHandler() {
		this.renderer.domElement.addEventListener("mousedown", (e) => {
			let res = this.boardController.view.castCursor(this.createCursorCast(e));

			if (res) this.boardController.click(res);
		})

		this.renderer.domElement.addEventListener("mousemove", (e) => {
			let res = this.board.geometry.castCursor(this.createCursorCast(e));
			if (res) this.board.hover(res);
		})

		this.renderer.domElement.addEventListener('contextmenu', e => {
			e.preventDefault();
		});
	}

	render():void {
		requestAnimationFrame(() => this.render());

		let delta = performance.now() - this.deltaT;
		this.deltaT = performance.now();
		let d = performance.now();

		this.board.update(delta);
		this.renderer.draw();
		this.statsScreen.update(performance.now() - d);
	}

	addObject(obj:Object3D) {
		this.scene.add(obj);
	}

	createCursorCast(e:MouseEvent): Raycaster { 
		let mouse = new Vector2 (
			( e.clientX / window.innerWidth ) * 2 - 1,
			-( e.clientY / window.innerHeight ) * 2 + 1
		);

		this.raycaster.setFromCamera(mouse, this.camera);
		return this.raycaster;
	}
}