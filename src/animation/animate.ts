import { Vector3 } from "three";

export function animateVector(vec: Vector3, goal:Vector3, t:number, easingFunction: (x:number) => number) {
	const start = vec.clone();
	let elapsed = 0;
	let lastFrame = performance.now();
	let diff = goal.clone().sub(start);

	function animate () {
		elapsed += performance.now()-lastFrame;
		lastFrame = performance.now();

		vec.copy(start.clone().add(diff.clone().multiplyScalar(easingFunction((elapsed/t)))));
		if(elapsed >= t){
			vec.copy(goal);
		} else {
			requestAnimationFrame(animate);
		}
	}
	requestAnimationFrame(animate);
}

export function animateProperty(start:number, goal:number, set:(val:number) => void, t:number, easingFunction: (x:number) => number):void {
	let lastFrame = performance.now();
	let elapsed = 0;
	const diff = goal-start;

	function animate () {
		elapsed += performance.now()-lastFrame;
		lastFrame = performance.now();
		set(start + diff * easingFunction((elapsed/t)));
		console.log("Animating")
		if(elapsed >= t){
			set(goal);
		} else {
			requestAnimationFrame(animate);
		}
	}
	requestAnimationFrame(animate);
}