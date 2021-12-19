const c4 = (2 * Math.PI) / 3;

export function easeOutElastic(x: number): number {
	return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

export function easeInOutCubic(x:number) {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeInCirc(x: number): number {
	return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

export function easeOutCirc(x: number): number {
	return Math.sqrt(1 - Math.pow(x - 1, 2));
}
