import { CameraHelper, DirectionalLight } from "three";

export function createLightSphere (
	n: number, 
	d: number, 
	h:number, 
	intensity:number,
	resolution:number, 
): (DirectionalLight|CameraHelper)[] {
	let lights:(DirectionalLight|CameraHelper)[] = [];
	for(let i = 0;  i <= n; i++) {
		let l = new DirectionalLight();
		l.intensity = intensity/n;

		l.position.set(
			Math.sin(2 * Math.PI * (i / (n*4)) - Math.PI/4) * d, 
			Math.cos(2 * Math.PI * (i / (n*4)) - Math.PI/4) * d,
			h
		);
		let helper = new CameraHelper(l.shadow.camera);
		
		l.shadow.camera.left = - 10;
		l.shadow.camera.right = 10;
		l.shadow.camera.top = 10;
		l.shadow.camera.bottom = - 10;
		l.shadow.mapSize.width = resolution;
		l.shadow.mapSize.height = resolution;
		l.castShadow = true;
		l.shadow.radius = 5;
		lights.push(l, helper);
	}
	return lights;
}