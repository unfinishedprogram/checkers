import { Material, MeshPhysicalMaterialParameters, MeshStandardMaterial, RepeatWrapping, Texture, TextureLoader, Vector2 } from "three";

export default async function loadPBRMaterial(name:string, loader:TextureLoader):Promise<Material> {
	async function loadAndApply(path:string):Promise<Texture> {
		let asset = await loader.loadAsync(path);
		asset.repeat.set(2, 2);
		asset.wrapS = RepeatWrapping;
		asset.wrapT = RepeatWrapping;
		return asset;
	}

	let perams:MeshPhysicalMaterialParameters = {
		normalScale: new Vector2(0.5, 0.5), 
		// displacementScale: 0.5,
		normalMap: await loadAndApply(`./textures/n_${name}`),
		roughnessMap: await loadAndApply(`./textures/r_${name}`),
		map: await loadAndApply(`./textures/d_${name}`),
		aoMap: await loadAndApply(`./textures/a_${name}`),
		// displacementMap: await loadAndApply(`./textures/p_${name}`)
	};

	return new MeshStandardMaterial(perams);
}