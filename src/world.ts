import { ACESFilmicToneMapping, ArrowHelper, Object3D, PCFSoftShadowMap, PerspectiveCamera, PointLight, Raycaster, Scene, Vector2, Vector3, WebGLRenderer } from "three";
import GameBoard from "./gameBoard";
import { createLightSphere } from "./lightSphere";
import StatsScreen from "./statsScreen";
import {UnrealBloomPass} from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass"
import {EffectComposer} from "../node_modules/three/examples/jsm/postprocessing/EffectComposer"
import {RenderPass} from "../node_modules/three/examples/jsm/postprocessing/RenderPass"

export default class World {
	private deltaT: number = 0;
	private renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
	private effectComposer: EffectComposer;
	private camera: PerspectiveCamera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	private scene: Scene;
	private statsScreen: StatsScreen;
	private raycaster: Raycaster = new Raycaster();
	private board: GameBoard = new GameBoard();
	
	constructor() {
		window.devicePixelRatio = 1;
		this.scene = new Scene();
		this.effectComposer = new EffectComposer(this.renderer);
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
		this.camera.position.z = 6;
		this.camera.position.y = -4;
		this.camera.lookAt(0, 0, 0);

		this.statsScreen = new StatsScreen(this.renderer);
		document.body.appendChild(this.statsScreen.getElm());

		this.board.initalizePieces();
		this.addObject(this.board.getGeometry());
		this.addObject(this.board.getPieces());

		this.renderer.shadowMap.type = PCFSoftShadowMap;

		this.renderer.domElement.addEventListener("mousedown", (e) => {
			let res = this.board.geometry.castCursor(this.createCursorCast(e));
			if (res) this.board.click(res);
		})

		this.renderer.domElement.addEventListener("mousemove", (e) => {
			let res = this.board.geometry.castCursor(this.createCursorCast(e));
			if (res) this.board.hover(res);
		})

		this.renderer.domElement.addEventListener("mouseup", (e) => {
			let res = this.board.geometry.castCursor(this.createCursorCast(e));
			if (res) this.board.release(res);
		})

		createLightSphere(10, 5, 5, 2, 512).forEach( l => this.scene.add(l));

		this.renderer.toneMapping = ACESFilmicToneMapping;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type= PCFSoftShadowMap;

		const renderScene = new RenderPass(this.scene, this.camera);
		// const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
		const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 0.8, 0.7, 0.6 );
		this.effectComposer.addPass(renderScene);
		this.effectComposer.addPass(bloomPass);
		this.effectComposer.setSize(window.innerWidth, window.innerHeight);
	}

	getCamera():PerspectiveCamera {
		return this.camera;
	}

	getRenderer():WebGLRenderer{
		return this.renderer;
	}

	render():void {
		requestAnimationFrame(() => this.render());
		let delta = performance.now() - this.deltaT;
		this.deltaT = performance.now();
		let d = performance.now();
		this.board.update(delta);
		this.effectComposer.render();
		this.statsScreen.update(performance.now() - d);
	}

	addObject(obj:Object3D){
		this.scene.add(obj);
	}

	createCursorCast(e:MouseEvent): Raycaster { 
		let mouse = new Vector2(
			( e.clientX / window.innerWidth ) * 2 - 1, 
			-( e.clientY / window.innerHeight ) * 2 + 1
		);

		this.raycaster.setFromCamera(mouse, this.camera);
		return this.raycaster;
	}
}