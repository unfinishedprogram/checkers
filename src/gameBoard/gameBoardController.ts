import { Vector2 } from "three";
import GameBoardModel from "./gameBoardModel";
import { GameBoardView } from "./gameBoardView";

export default class GameBoardController {
	public model:GameBoardModel = new GameBoardModel;
	public view:GameBoardView = new GameBoardView;
	
	constructor() {
		
	}

	click(pos?:Vector2) {
		console.log("Clicked: ", pos);
	}

	hover(pos?:Vector2) {
		console.log("Hover: ", pos);
	}
}