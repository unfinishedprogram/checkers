import { ACESFilmicToneMapping, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "../node_modules/three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass";
import { SSAOPass } from "../node_modules/three/examples/jsm/postprocessing/SSAOPass"
import { SMAAPass } from "../node_modules/three/examples/jsm/postprocessing/SMAAPass"
import { TAARenderPass } from "../node_modules/three/examples/jsm/postprocessing/TAARenderPass"

export default class EffectRenderer extends WebGLRenderer {
	effectComposer: EffectComposer;
	renderScenePass: RenderPass;
	bloomPass: UnrealBloomPass;
	ssaoPass: SSAOPass;
	taaPass: TAARenderPass;
	smaaPass: SMAAPass;
	dimensions:Vector2 = new Vector2();

	constructor(private scene:Scene, private camera:PerspectiveCamera){
		super({ antialias: true, powerPreference:"high-performance" });
		this.shadowMap.enabled = true;
		// this.shadowMap.type = PCFSoftShadowMap;
		// this.outputEncoding = LinearEncoding;
		this.toneMapping = ACESFilmicToneMapping;
		this.toneMappingExposure = 2;
		this.physicallyCorrectLights=true;
		this.renderScenePass = new RenderPass(this.scene, this.camera);
		this.taaPass = new TAARenderPass(this.scene, this.camera)
		this.bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 0.8, 0.7, 0.9 );
		this.ssaoPass = new SSAOPass(this.scene, this.camera, window.innerWidth, window.innerHeight);
		this.effectComposer = new EffectComposer(this);
		this.smaaPass = new SMAAPass();

		this.ssaoPass.kernelRadius = 0.2;
		this.ssaoPass.minDistance = 0;
		this.ssaoPass.maxDistance = 2;

		this.effectComposer.addPass(this.ssaoPass);
		this.effectComposer.addPass(this.bloomPass);
		this.effectComposer.addPass(this.smaaPass);
		
		window.addEventListener("resize", () => this.fitWindow())
		this.fitWindow();
	}

	draw(): void {
		this.effectComposer.render();
	}

	fitWindow(){
		this.dimensions.set (
			Math.floor(window.innerWidth * window.devicePixelRatio),
			Math.floor(window.innerHeight * window.devicePixelRatio)
		)

		this.camera.aspect = this.dimensions.x/this.dimensions.y;
		this.camera.updateProjectionMatrix();
		this.setSize(this.dimensions.x, this.dimensions.y);
		this.bloomPass.setSize(this.dimensions.x, this.dimensions.y);
		this.effectComposer.setSize(this.dimensions.x, this.dimensions.y);
		this.ssaoPass.setSize(this.dimensions.x, this.dimensions.y);
	}
}