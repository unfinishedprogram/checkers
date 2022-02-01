import { 
	Group, 
	Mesh, 
	PlaneBufferGeometry, 
	Raycaster, 
	Vector2
} from "three";
import createMesh from "./assetHandling/createMesh";
import { createTile } from "./gameObjects/tile";
import Piece, { PieceColor } from "./piece";

export class BoardGeo extends Group {
	private yOffset = -0.1;
	private tiles:Mesh[] = [];
	private castPlane:Mesh = new Mesh(new PlaneBufferGeometry(8, 8));

	private hoverMesh:Mesh = createMesh("tile", "hover");
	private selectMesh:Mesh = createMesh("tile", "selected");
	private previewMeshes:Mesh[] = [];

	constructor() {
		super();
		this.selectMesh.position.setY(0.002 + this.yOffset);
		this.hoverMesh.position.setY(0.001 + this.yOffset);

		this.selectMesh.visible = false;
		this.hoverMesh.visible = false;

		this.castPlane.position.setY(this.yOffset*2);
		this.add(this.castPlane);
		this.castPlane.rotateX(-Math.PI/2);
		this.hoverMesh.rotateX(-Math.PI/2);
		this.selectMesh.rotateX(-Math.PI/2);

		for(let i = 0; i < 4; i++){
			let mesh = createMesh("piece", "preview")
			mesh.scale.set(0.4, 0.4, 0.4);
			this.previewMeshes.push(mesh)
			mesh.receiveShadow = false;
		}

		for(let x = 0; x < 8; x++) {
			for(let y = 0; y < 8; y++) {
				let tile = createTile(y, x);
				tile.position.setY(this.yOffset)
				this.tiles.push(tile);
			}
		}

		this.add(...this.tiles, this.selectMesh, this.hoverMesh)
	}

	castCursor (raycaster:Raycaster):Vector2 | undefined {
		var intersects = raycaster.intersectObject( this.castPlane );

		if(intersects.length >= 1) {
			return new Vector2(Math.floor(intersects[0].point.x + 4), Math.floor(intersects[0].point.z + 4));
		}
		return;
	}

	getTile(pos:Vector2): Mesh {
		return this.tiles[pos.y * 8 + pos.x];
	}

	select(pos:Vector2|undefined){
		if(pos){
			let tile = this.getTile(pos);
			this.selectMesh.position.setX(tile.position.x);
			this.selectMesh.position.setZ(tile.position.z);
			this.selectMesh.visible = true;
		} else {
			this.selectMesh.visible = false;
		}
	}

	hover(pos:Vector2|undefined){
		if(pos){
			let tile = this.getTile(pos);
			this.hoverMesh.position.setX(tile.position.x);
			this.hoverMesh.position.setZ(tile.position.z);
			this.hoverMesh.visible = true;
		} else {
			this.hoverMesh.visible = false;
		}
	}

	setPreview(pos:Vector2, mesh:Mesh, piece:Piece) {
		mesh.position.copy(this.getTile(pos).position);
		this.add(mesh);
		mesh.rotation.set(0, 0, 0);

		if(piece.color == PieceColor.RED){
			mesh.rotateY(Math.PI);
		}
		
		if(!piece.king){
			mesh.rotateX(Math.PI);
		}

		mesh.receiveShadow = false;
		this.previewMeshes.push(mesh);
	}

	clearPreview():void{
		this.previewMeshes.forEach(mesh => {
			this.remove(mesh);
		})
	}

	showPreviews(places:Vector2[], piece:Piece){
		places.forEach((place, i) => this.setPreview(place, this.previewMeshes[i], piece));
	}
}