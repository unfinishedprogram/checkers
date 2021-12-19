import { Mesh, MeshPhysicalMaterial, Object3D, PerspectiveCamera, PlaneBufferGeometry, Raycaster, Scene, Vector2, Vector3 } from "three";
import GameBoard from "./gameBoard";
import { createLightSphere } from "./lightSphere";
import StatsScreen from "./statsScreen";
import EffectRenderer from "./effectRenderer";
import { MeshHandler } from "./meshHandler";

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
		this.camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100 );

		this.renderer = new EffectRenderer(this.scene, this.camera);

		document.body.appendChild( this.renderer.domElement );

		this.camera.position.set(0, -6, 6);
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

		this.scene.add(...createLightSphere(10, 5, 5, 5, 512));
		
		let table = new Mesh(new PlaneBufferGeometry(20, 20), new MeshPhysicalMaterial());
		this.addObject(table);
		table.position.setZ(-0.45);
		table.receiveShadow=true;
		MeshHandler.loadMesh("dracoboard.gltf", "board").then((mesh) => {
			mesh.position.set(0, 0, -0.5);
			mesh.rotateX(Math.PI/2);
			mesh.scale.set(0.55, 0.7, 0.55);
			mesh.material
			this.addObject(mesh);
			mesh.position.add(new Vector3(0, 0, 0.049))

			document.addEventListener("keydown", () => {
				table.position.add(new Vector3(0, 0, 0.001))
				console.log(table.position.z);
			});
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