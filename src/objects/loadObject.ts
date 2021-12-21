import { BufferGeometry, Mesh } from "three";
import loadPBRMaterial from "../loadPBRMaterial";

export async function loadObject(
	geometry:BufferGeometry, 
	materialPath:string, ): Promise<Mesh> {
	return new Mesh(geometry, await loadPBRMaterial(materialPath));
}