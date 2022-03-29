import { BufferGeometry } from "three"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import AssetHandler from "./assetHandler";

export default class GLTFGeometryHandler extends AssetHandler<BufferGeometry> {
	private loader = new GLTFLoader();
	
	constructor(){
		super(async (path:string) => {
			let data:any = await this.loader.loadAsync(path);
			let geo:BufferGeometry = data.scene.children[0].geometry;
			return geo;
		});

		const dracoLoader = new DRACOLoader();
		
		dracoLoader.setDecoderPath("./draco/"); 
		this.loader.setResourcePath("./models/");
		this.loader.setDRACOLoader(dracoLoader);
	}

	addGeometry(geometry:BufferGeometry, name:string){
		this.cache[name] = new Promise( () => geometry );
		this.loaded[name] = geometry;
	}
}