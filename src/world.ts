import { ACESFilmicToneMapping, DirectionalLight, Object3D, PCFSoftShadowMap, PerspectiveCamera, Plane, PlaneGeometry, PointLight, Raycaster, RGB_ETC1_Format, Scene, Vector2, Vector3, WebGLRenderer } from "three";
import { Board } from "./board";
import { createLightSphere } from "./lightSphere";
import Piece, { PieceColor } from "./piece";
import StatsScreen from "./statsScreen";

export default class World {
	private renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
	private camera: PerspectiveCamera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	private scene: Scene;
	private statsScreen: StatsScreen;
	constructor() {
		this.scene = new Scene();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
		this.camera.position.y = 7;
		this.camera.lookAt(0, 0, 0);

		this.statsScreen = new StatsScreen(this.renderer);
		document.body.appendChild(this.statsScreen.getElm());
		let board = new Board()
		let boardMesh = board.getGroup();

		boardMesh.rotateX(-Math.PI/2)
		boardMesh.position.set(0, 0, 0);
		this.addObject(boardMesh);

		let raycaster = new Raycaster();

		let mousePlane = new PlaneGeometry(10, 10);

		let light = new PointLight();
		light.castShadow = true;
		this.scene.add(light)
		light.intensity = 0.5;
		light.shadow.mapSize.width = 2048*2
		light.shadow.mapSize.height = 2048*2
		this.renderer.shadowMap.type= PCFSoftShadowMap;
		this.renderer.domElement.addEventListener("mousemove", (e) => {
			let mouse = new Vector2();
			mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera(mouse, this.camera);
			board.update(raycaster);
			let v = new Vector3(
				((e.x/window.innerWidth) * 2 -1) * 30 , 
				-((e.y/window.innerHeight) * 2 -1) * 30 ,
				0
			);
			v.unproject(this.camera);
			v.setY(2);
				light.position.copy(v);
		})

		createLightSphere(10, 5, 5, 0.2, 512).forEach( l => this.scene.add(l));

		this.renderer.toneMapping = ACESFilmicToneMapping;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type= PCFSoftShadowMap;
		
		for(let x = 0; x < 8; x++){
			for(let z = 0; z < 8; z++){
				let obj = new Piece(PieceColor.RED);
				this.addObject(obj);
				obj.position.set(x-3.5, 0, z-3.5);
			}
		}
	}

	getCamera():PerspectiveCamera {
		return this.camera;
	}

	getRenderer():WebGLRenderer{
		return this.renderer;
	}

	render():void {
		requestAnimationFrame(() => this.render());
		let d = performance.now();
    this.renderer.render( this.scene, this.camera );
		this.statsScreen.update(performance.now() - d);
	}

	addObject(obj:Object3D){
		this.scene.add(obj);
	}
}