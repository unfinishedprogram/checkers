import { Material, Mesh, MeshStandardMaterial } from "three"
import { DRACOLoader } from "../node_modules/three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";


type MeshCache = {
	[index:string]:Promise<Mesh>;
}

export class MeshHandler {
	private static cache: MeshCache = {};
	private static dracoLoader = new DRACOLoader();
	private static loader = new GLTFLoader();
	
	public static init():void {
		MeshHandler.dracoLoader.setDecoderPath("./draco/");
		MeshHandler.loader.setResourcePath("./models/");
		MeshHandler.loader.setDRACOLoader(MeshHandler.dracoLoader);
	}

	public static async loadMesh (path: string, name: string):Promise<Mesh> {
		if(!!MeshHandler.cache[name]) {
			return MeshHandler.cache[name];
		}

		return MeshHandler.cache[name] = new Promise( async (res, rej) => {
			let group:any = await MeshHandler.loader.loadAsync(MeshHandler.loader.resourcePath + path);
			let mesh:Mesh = group.scene.children[0];
			mesh.scale.set(0.4, 0.4, 0.4);
			mesh.material = new MeshStandardMaterial();
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			res(mesh)
		});
	}

	public static getMesh(name:string):Promise<Mesh> {
		return MeshHandler.cache[name];
	}

	public static setMaterial(name:string, material:Material) {
		MeshHandler.cache[name].then( mesh => mesh.material = material);
	}
}