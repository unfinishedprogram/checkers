import { PerspectiveCamera, Vector3 } from "three";
import InputHandler from "./inputHandler";

export class ControlledCamera extends PerspectiveCamera {
	private angle:number = 0;
	private offset = new Vector3();
	private dragging = false;
	constructor(
		private inputHandler:InputHandler,
		fov:number, 
		ratio:number, 
		close:number, 
		far:number,
		private center:Vector3,
		private distance:number, 
		private height:number) {
		super(fov, ratio, close, far);
		this.setupMouseEvents();
	}

	setupMouseEvents() {
		this.inputHandler.addOn("mousedown", e => {
			if(e.button == 2 ) this.dragging = true;
		})

		this.inputHandler.addOn("mouseup", e => {
			if(e.button == 2 ) this.dragging = false;
		})
		
		this.inputHandler.addOn("mouseleave", e => {
			if(e.button == 2 ) this.dragging = false;
		})

		this.inputHandler.addOn("mouseleave", e => this.dragging = false);

		this.inputHandler.addOn("mousemove", e => {
			if(this.dragging){
				this.rotateCamera(e.movementX * -0.01)
			}
		})
	}

	rotateCamera(radians:number){
		this.setAngle(this.angle+radians)
	}

	getAngle(){
		return this.angle;
	}

	setAngle(radians:number) {
		this.angle = radians;
		this.offset.set(Math.sin(this.angle) * this.distance, this.height, Math.cos(this.angle) * this.distance);
		this.position.copy(this.center).add(this.offset);
		this.lookAt(this.center);
	}
}