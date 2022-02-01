import { MeshPhysicalMaterial } from "three";
import createMesh from "../assetHandling/createMesh";

export function createTable() {
	let table = createMesh("table", "planks");
	(table.material as MeshPhysicalMaterial).roughness = 0.7;
	table.position.set(0, -0.6, 0);
	table.lookAt(table.up)
	table.rotateZ(Math.PI/2);
	table.receiveShadow=true;
	return table;
}