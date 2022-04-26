// export const inputListners = {
// 	"mouseDown" : MouseEvent,
// 	"mouseUp" : MouseEvent,
// 	"mouseMove" : MouseEvent,
// }

import { getKeys } from "./util";

export const inputListners = {
	"mouseDown" : [],
	"mouseUp" : [],
	"mouseMove" : []
}

type IHandlers = {
	"mouseDown": Function
	"mouseUp": Function
	"mouseMove": Function
	"keyDown": Function
}


type inputListnerKeys = keyof typeof inputListners;

export default class InputHandler {
	private static listeners:{[key in inputListnerKeys]:Function[]} = inputListners;
	private static keyboardListeners:{[index:string]:Function[]} = {};
	public static element:HTMLElement;

	private static handlers:IHandlers = {
		"mouseDown" : (e:InputEvent) => this.execute(e, "mouseDown"),
		"mouseUp" : (e:InputEvent) => this.execute(e, "mouseUp"),
		"mouseMove" : (e:InputEvent) => this.execute(e, "mouseMove"),
		"keyDown" : (e:KeyboardEvent) => this.keyDown(e)
	}

	private static keyDown(e:KeyboardEvent) {
		const keyListeners = this.keyboardListeners[e.key];
		if(!keyListeners) return;
		keyListeners.forEach(handler => handler());
	}

	public static addOnKey(key:string, handler:Function){
		if(!this.keyboardListeners[key]) {
			this.keyboardListeners[key] = [];
		}

		this.keyboardListeners[key].push(handler)
	}

	public static removeOnKey(key:string, handler:Function){
		let index = this.keyboardListeners[key].indexOf(handler);
		this.keyboardListeners[key].splice(index, 1);
	}

	private static execute(e:InputEvent, key:inputListnerKeys){
		this.listeners[key].forEach(handler => handler(e));
	}

	public static setElement(element:HTMLElement) {
		
	}

	public addEventListener(event:inputListnerKeys, handler:Function) {
		InputHandler.listeners[event].push(handler);
	}

	public removeEventListener(event:inputListnerKeys, handler:Function) {
		let index = InputHandler.listeners[event].indexOf(handler);
		InputHandler.listeners[event].splice(index, 1);
	}

	private static clearListeners(){
		if(this.element){
			for(let event in this.handlers) {
				this.element.removeEventListener(event, this.handlers[event as keyof IHandlers])
			}
			this.handlers
			this.element.removeEventListener()
		}
	}
}