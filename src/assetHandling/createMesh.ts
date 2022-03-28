import { Mesh } from "three";
import { geometryHandlerInstance, materialHandlerInstance } from "./assetCaches";

export default function createMesh (geoName:string, matName:string) {
	return new Mesh (
		geometryHandlerInstance.getAsset(geoName), 
		materialHandlerInstance.getAsset(matName)
	);
}