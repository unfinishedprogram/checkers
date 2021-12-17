import { Group, Material, Mesh, MeshStandardMaterial } from "three"
// import { DRACOLoader } from "../node_modules/three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";


type MeshCache = {
	[index:string]:Promise<Mesh>;
}

export class MeshHandler {
	private static cache: MeshCache = {};
	// private static loader = new DRACOLoader();
	private static loader = new GLTFLoader();
	
	public static async loadMesh (path: string, name: string):Promise<Mesh> {
		console.log(path);
		if(!!MeshHandler.cache[name]) {
			return MeshHandler.cache[name];
		}
		
		return MeshHandler.cache[name] = new Promise( async (res, rej) => {
			// MeshHandler.loader.setDecoderPath("./draco/");
			let group:any = await MeshHandler.loader.loadAsync(path);
			let mesh:Mesh = group.scene.children[0].children[0];
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