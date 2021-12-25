import { PerspectiveCamera, Vector3 } from "three";

export class ControlledCamera extends PerspectiveCamera {
	private angle:number = 0;
	private offset = new Vector3();
	private dragging = false;
	constructor(
		fov:number, 
		ratio:number, 
		close:number, 
		far:number,
		private center:Vector3,
		private distance:number, 
		private height:number) {
		super(fov, ratio, close, far);

	}

	rotateCamera(radians:number){
		this.setAngle(this.angle+radians)
	}

	setDomElement(elm:HTMLElement){
		elm.addEventListener("mousedown", (e) => {
			if(e.button == 2 ) this.dragging = true;
		});

		elm.addEventListener("mouseup", (e) => {
			if(e.button == 2 ) this.dragging = false;
		});

		elm.addEventListener("mouseLeave", (e) => this.dragging = false);
		elm.addEventListener("mousemove", (e) => this.rotateCamera(e.movementX * -0.01));
	}

	setAngle(radians:number) {
		if(!this.dragging) return;

		this.angle = radians;
		this.offset.set(Math.sin(this.angle) * this.distance, this.height, Math.cos(this.angle) * this.distance);
		this.position.copy(this.center).add(this.offset);
		this.lookAt(this.center);
	}
}