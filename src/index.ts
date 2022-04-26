import World from "./world";

import { geoHandlerInstance, materialHandlerInstance } from "./assetHandling/assetCaches";
import { Color, MeshPhysicalMaterial, PlaneBufferGeometry } from "three";

Promise.all ([
	geoHandlerInstance.loadAsset("models/dracoboard.gltf", "board"),
	geoHandlerInstance.loadAsset("models/dracopiece.gltf", "piece"),
	geoHandlerInstance.addGeometry(new PlaneBufferGeometry(20, 20), "table"),
	geoHandlerInstance.addGeometry(new PlaneBufferGeometry(1, 1), "tile"),

	materialHandlerInstance.loadAsset("planks.png", "planks"),
	materialHandlerInstance.loadAsset("table.png", "table"),
	// materialHandlerInstance.loadAsset("plywood.png", "plywood"),
	materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({color:"#FAE9C5", roughness:0.3}), "tile_white"),
	materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({color:"#090909", roughness:0.3}), "tile_black"),
	materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({color:"#880000", roughness:.25}), "piece_red"),
	materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({color:"#FFEEEE", roughness:.25}), "piece_white"),
	materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({emissive:new Color("#0F0").convertSRGBToLinear(), emissiveIntensity:0.75}), "preview"),
	materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({emissive:new Color("#FFF").convertSRGBToLinear(), emissiveIntensity: 20}), "hover"),
	materialHandlerInstance.addMaterial(new MeshPhysicalMaterial({emissive:new Color("#FF0").convertSRGBToLinear(), emissiveIntensity: 20}), "selected")
]).then(() => {
	let world = new World();
	world.render()
});





