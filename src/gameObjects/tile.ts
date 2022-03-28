import { Mesh } from "three";
import { geometryHandlerInstance, materialHandlerInstance } from "../assetHandling/assetCaches";

export function createTile(x:number, y:number){ 
	let m = new Mesh(geometryHandlerInstance.getAsset("tile").clone(), materialHandlerInstance.getAsset((x+y) % 2 ? "tile_white" : "tile_black"));	m
	m.position.set(x-3.5, 0, y-3.5);
	m.rotateX(-Math.PI/2);
	m.receiveShadow = true;
	return m;
}