import { WebGLInfo, WebGLRenderer } from "three";

export default class StatsScreen {
	elm = document.createElement("div");
	renderer:WebGLRenderer;
	constructor(renderer:WebGLRenderer) {
		this.elm.id = "statsScreen";
		this.renderer = renderer;
		this.renderer.domElement.appendChild(this.elm);
	}

	update(delta : number) {
		type RenderInfoProp = "calls" | "frame" | "lines" | "points" | "triangles";
		type MemoryInfoProp = "geometries" | "textures";
		this.elm.innerHTML = "";

		for(let prop in this.renderer.info.render){
			let info = document.createElement("span");
			info.textContent = `${prop} : ${this.renderer.info.render[prop as RenderInfoProp]}`
			this.elm.appendChild(info);
		}

		for(let prop in this.renderer.info.memory){
			let info = document.createElement("span");
			info.textContent = `${prop} : ${this.renderer.info.memory[prop as MemoryInfoProp]}`
			this.elm.appendChild(info);
		}
		
		let info = document.createElement("span");
		info.textContent = `frameTime : ${delta.toPrecision(2)}`;
		this.elm.appendChild(info);
	}

	getElm() {
		return this.elm;
	}
}