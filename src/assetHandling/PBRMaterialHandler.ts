import { Material, TextureLoader } from "three";
import loadPBRMaterial from "../loadPBRMaterial";
import AssetHandler from "./assetHandler";

export default class MaterialHandler extends AssetHandler<Material> {
	constructor(loader = new TextureLoader()) {
		super((path) => loadPBRMaterial(path, loader));
	}

	addMaterial(material:Material, name:string){
		this.cache[name] = new Promise( () => material );
		this.loaded[name] = material;
	}
}