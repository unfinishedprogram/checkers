import { DirectionalLight } from "three";

export function createLightSphere (
	n: number, 
	d: number, 
	h:number, 
	intensity:number,
	resolution:number, 
): DirectionalLight[] {
	let lights:DirectionalLight[] = [];
	
	for(let i = 0;  i < n; i++) {
		let l = new DirectionalLight();
		l.intensity = intensity/n;
		l.position.set(
			Math.sin(2 * Math.PI * (i / n)) * d, 
			h, 
			Math.cos(2 * Math.PI * (i / n)) * d
		);
		l.shadow.mapSize.width = resolution;
		l.shadow.mapSize.height = resolution;
		l.castShadow = true;
		lights.push(l);
	}
	return lights;
}