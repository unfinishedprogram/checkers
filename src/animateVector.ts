import { Vector3 } from "three";

export default function animateVector(vec:Vector3, goal:Vector3, t:number){
	let start = vec.clone();
	let diff = goal.clone().sub(start);
	let elapsed = 0;
	let lastFrame = performance.now();

	function animate(){
		let delta = performance.now()-lastFrame;
		elapsed += delta;
		lastFrame = performance.now();
		console.log(elapsed);
		vec.add(diff.clone().multiplyScalar(delta/t));
		if(elapsed >= t){
			vec.copy(goal);
		} else {
			requestAnimationFrame(animate);
		}
	}

	requestAnimationFrame(animate);
}