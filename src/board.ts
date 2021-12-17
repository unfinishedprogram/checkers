import { Group, Mesh, MeshStandardMaterial,  PlaneGeometry, Raycaster, Vector2 } from "three";

export class Board {
	group:Group = new Group();
	planes:Mesh[] = [];
	constructor() {
		const mats:MeshStandardMaterial[] = [
			new MeshStandardMaterial({color:"white"}),
			new MeshStandardMaterial({color:"black"})
		];

		const geo = new PlaneGeometry(1, 1);
		for(let x = 0; x < 8; x++){
			for(let z = 0; z < 8; z++){
				let plane = new Mesh(geo, mats[(x + z) % 2]);
				plane.position.set(x-3.5, z-3.5, 0);
				plane.receiveShadow = true;
				this.group.add(plane);
				this.planes.push(plane);
			}
		}
	}
	getGroup() {
		return this.group;
	}

	update(raycaster:Raycaster) {
		var intersects = raycaster.intersectObjects( this.planes );
		if(intersects.length > 1){
			console.error("More than 1 square returned");
		} else if(intersects.length == 1){
			console.log(intersects[0]);
			(intersects[0].object as Mesh).material = new MeshStandardMaterial({color:"red"});
		}
	}
}