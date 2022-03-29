type HF = ((e:KeyboardEvent | MouseEvent) => void);
interface IListeners {[index:string]:HF[]};
interface IKeyboardListeners {[index:`key${any}`]:IListeners};

export default class InputHandler {
	private listeners:IKeyboardListeners & IListeners = {};
	private element?:HTMLElement;

	public setElement(element:HTMLElement){
		this.element = element;
		
		element.addEventListener("mousedown", e => this.dispatchEvent(e.type, e));
		element.addEventListener("mouseup", e => this.dispatchEvent(e.type, e));
		element.addEventListener("mousemove", e => this.dispatchEvent(e.type, e));
		element.addEventListener("mouseleave", e => this.dispatchEvent(e.type, e));
		element.addEventListener("mouseenter", e => this.dispatchEvent(e.type, e));
		element.addEventListener("keydown", e => this.dispatchEvent(e.type, e));
	}

	private dispatchKeypress(key:string, e:KeyboardEvent) {
		e = e as KeyboardEvent;

		if(!this.listeners[e.type]){
			(this.listeners as IKeyboardListeners)[e.type as `key${string}`] = {};
		}

		if(!this.listeners[e.type as `key${string}`][e.key]){
			this.listeners[e.type as `key${string}`][e.key] = [];
		}

		this.listeners[e.type as `key${string}`][e.key].forEach(handler => handler(e));
	}

	private dispatchEvent(eventType:string, e: MouseEvent | KeyboardEvent){
		if(eventType.includes("key")) {
			e = e as KeyboardEvent;
			this.dispatchKeypress(e.key, e);
		} else {
			if(this.listeners[eventType]){
				this.listeners[eventType].forEach(handler => handler(e))
			}
		}
	}

	public addOnKey(key:string, handler:(e:KeyboardEvent) => void) {
		if(!this.listeners["keydown"])
			this.listeners["keydown"] = {};
		
		if(!this.listeners["keydown"][key])
			this.listeners["keydown"][key] = [];
		
		this.listeners["keydown"][key].push(handler as unknown as any);
	}

	public addOn(event:string, handler:(e:MouseEvent) => void) {
		if(!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(handler as unknown as any)
	}
}