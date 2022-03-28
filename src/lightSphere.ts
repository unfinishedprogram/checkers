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
		const shadow = l.shadow;
		const camera = shadow.camera;
		camera.left = - 10;
		camera.right = 10;
		camera.top = 10;
		camera.bottom = - 10;

		shadow.mapSize.width = resolution;
		shadow.mapSize.height = resolution;
		shadow.radius = 5;

		l.castShadow = true;
		lights.push(l, helper);
	}
	
	return lights;
}