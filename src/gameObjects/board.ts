import { MeshPhysicalMaterial } from "three";
import createMesh from "../assetHandling/createMesh";

export default function createBoard() {
	let board = createMesh("board", "table");
	(board.material as MeshPhysicalMaterial).displacementScale = 0;
	board.position.set(0, -0.549, 0);
	board.scale.set(0.55, 0.7, 0.55);
	return board;
}