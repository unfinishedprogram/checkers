import { ACESFilmicToneMapping, Camera, Event, Object3D, PCFSoftShadowMap, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "../node_modules/three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass";

export default class EffectRenderer extends WebGLRenderer {
	effectComposer: EffectComposer;
	renderScenePass: RenderPass;
	bloomPass: UnrealBloomPass;
	dimensions:Vector2 = new Vector2();

	constructor(private scene:Scene, private camera:PerspectiveCamera){
		super({ antialias:true });
		window.devicePixelRatio = 1;

		this.toneMapping = ACESFilmicToneMapping;
		this.shadowMap.enabled = true;
		this.shadowMap.type= PCFSoftShadowMap;

		this.renderScenePass = new RenderPass(this.scene, this.camera);
		this.bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 0.8, 0.7, 0.7 );
		
		this.effectComposer = new EffectComposer(this);
		this.effectComposer.addPass(this.renderScenePass);
		this.effectComposer.addPass(this.bloomPass);

		window.addEventListener("resize", () => this.fitWindow())

		this.fitWindow();
	}

	draw(): void {
		this.effectComposer.render();
	}

	fitWindow(){
		this.dimensions.set(
			window.innerWidth*window.devicePixelRatio, 
			window.innerHeight*window.devicePixelRatio
		)

		this.camera.updateProjectionMatrix();
		this.setSize(this.dimensions.x, this.dimensions.y);
		this.bloomPass.setSize(this.dimensions.x, this.dimensions.y);
		this.effectComposer.setSize(this.dimensions.x, this.dimensions.y);
	}
}