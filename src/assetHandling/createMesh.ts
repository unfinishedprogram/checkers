import { Mesh } from "three";
import { geoHandlerInstance, materialHandlerInstance } from "./assetCaches";

export default function createMesh (geoName:string, matName:string) {
	return new Mesh (
		geoHandlerInstance.getAsset(geoName), 
		materialHandlerInstance.getAsset(matName)
	);
}