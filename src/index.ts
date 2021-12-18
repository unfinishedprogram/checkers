window.THREE = require("three");
import World from "./world";
import { MeshHandler } from "./meshHandler";
MeshHandler.init();
const world = new World();

world.render();
