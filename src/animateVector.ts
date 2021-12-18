import { Vector3 } from "three";

function easeInOutCubic(x:number) {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export default function animateVector(vec:Vector3, goal:Vector3, t:number){
	let start = vec.clone();
	let diff = goal.clone().sub(start);
	let elapsed = 0;
	let lastFrame = performance.now();

	function animate(){
		let delta = performance.now()-lastFrame;
		elapsed += delta;
		lastFrame = performance.now();
		// console.log("res: " + easeInOutCubic((elapsed/t)))
		vec.copy(start.clone().add(diff.clone().multiplyScalar(easeInOutCubic((elapsed/t)))))
		if(elapsed >= t){
			vec.copy(goal);
		} else {
			requestAnimationFrame(animate);
		}
	}

	requestAnimationFrame(animate);
}