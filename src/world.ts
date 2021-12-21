import { 
	Color, 
	DirectionalLight, 
	EquirectangularReflectionMapping, 
	Mesh, 
	MeshPhysicalMaterial, 
	Object3D, 
	PerspectiveCamera, 
	PlaneBufferGeometry, 
	Raycaster, 
	Scene, 
	Vector2, 
	Vector3
} from "three";

import GameBoard from "./gameBoard";
import StatsScreen from "./statsScreen";
import EffectRenderer from "./effectRenderer";
import { MeshHandler } from "./meshHandler";
import loadPBRMaterial from "./loadPBRMaterial";
import { RGBELoader } from "../node_modules/three/examples/jsm/loaders/RGBELoader"
import { loadObject } from "./objects/loadObject";

export default class World {
	private deltaT: number = 0;
	private camera: PerspectiveCamera;
	private scene: Scene;
	private statsScreen: StatsScreen;
	private raycaster: Raycaster = new Raycaster();
	private board: GameBoard = new GameBoard();
	private renderer: EffectRenderer;

	constructor() {
		this.scene = new Scene();
		this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.renderer = new EffectRenderer(this.scene, this.camera);
		document.body.appendChild( this.renderer.domElement );

		this.camera.position.set(0, 6, -6);
		this.camera.lookAt(0, 0, 0);

		this.statsScreen = new StatsScreen(this.renderer);

		document.body.appendChild(this.statsScreen.getElm());

		this.board.initalizePieces();

		this.addObject(this.board.getGeometry());
		this.addObject(this.board.getPieces());

		this.renderer.domElement.addEventListener("mousedown", (e) => {
			let res = this.board.geometry.castCursor(this.createCursorCast(e));
			if (res) this.board.click(res);
		})

		this.renderer.domElement.addEventListener("mousemove", (e) => {
			let res = this.board.geometry.castCursor(this.createCursorCast(e));
			if (res) this.board.hover(res);
		})

		const light = new DirectionalLight(new Color("white").convertSRGBToLinear(), 2);
		const lightSize = 8;

		light.shadow.camera.top = lightSize;
		light.shadow.camera.bottom = -lightSize;
		light.shadow.camera.left = -lightSize;
		light.shadow.camera.right = lightSize;

		light.shadow.mapSize = new Vector2(1024, 1024);

		light.position.set(5, 5, 5);
		light.lookAt(0, 0, 0);
		light.castShadow = true;
		light.shadow.radius = 10;

		this.scene.add(light);

		let loader = new RGBELoader();

		loader.loadAsync("./textures/peppermint_powerplant_1k.hdr").then(tex => {
			tex.rotation = 2;
			tex.mapping = EquirectangularReflectionMapping;
			this.scene.environment = tex;
			this.scene.background = tex;
		});

		loadObject(new PlaneBufferGeometry(20, 20, 1, 1), "planks.png").then(table => {
			table.lookAt(table.up);
			(table.material as MeshPhysicalMaterial).roughness = 0.7;
			this.addObject(table);
			table.position.setY(-0.45);
			table.position.setY(-0.6);
			table.rotateZ(Math.PI/2);
			table.receiveShadow=true;
		})


		MeshHandler.loadMesh("dracoboard.gltf", "board").then((mesh) => {
			loadObject(mesh.geometry, "table.png").then(obj => {
				obj.position.set(0, -0.50, 0);
				obj.scale.set(0.55, 0.7, 0.55);
				this.addObject(obj);
				obj.position.add(new Vector3(0, 0.049, 0));

				(obj.material as MeshPhysicalMaterial).displacementScale = 0;
			
			})
		})
	}

	getCamera():PerspectiveCamera {
		return this.camera;
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