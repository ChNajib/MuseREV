var Raycaster = function () {

	THREE.Raycaster.apply(this,arguments);

	var direction;
	var origin;
	var distance = 100;
	var endPoint = new THREE.Vector3();
	var lines = []

	this.set = function (origin, direction){
		this.direction = direction;
		this.origin	= origin;
		THREE.Raycaster.prototype.set.call(this, origin, direction)
	}
	this.cast = function (){
		var objs = [];
		var ret = null;
		var children = scene.children;
		for (var i in children) {
			if (children[i].name === 'PointerLockControls' || children[i].type === "Line") continue;
			objs.push(children[i]);
		}
		var result = raycaster.intersectObjects(objs, true);
		if (result.length > 0) {
			ret = result[0];
		}
		return ret;
	}
	this.remove
}

Raycaster.prototype = Object.create(THREE.Raycaster.prototype);
Raycaster.prototype.constructor = Raycaster;

function updateLastSeenObject(dt) {
	raycaster.setFromCamera(center, camera);
	var o = raycaster.cast()
	if (o ===null) return;
	if (o.object.id == lastObjectSeenID){
		lastObjectSeenTime += dt;
	} else {
		lastObjectSeenID = o.object.id;
		lastObjectSeenTime = 0
		info.style.opacity = 0;
	}
	// la on met la condition pour verifier que le visiteur a regarde l'oeuvre poendant 3 secondes, et que l'oeuvre possede la propriete comment.
	// focusTimeThreshold egale a 2 dans index.js
	if (lastObjectSeenTime > focusTimeThreshold && o.object.userData.hasOwnProperty('comment')){
		let info = document.getElementById('info')
		info.innerText = o.object.userData.comment;
		info.style.opacity = 1;
	}

}

function updateCloseByObject() {
	let camPos = new THREE.Vector3();
	camera.getWorldPosition(camPos);
	let nearestObjects = getNearestObjects(20, camPos);
	let obj;
	let intersect;
	nearbyObjectsId = [];
	for (var i in nearestObjects) {
		console.log("nearbyobj : ",i);
		obj = nearestObjects[i];
		direction.subVectors(obj.worldPosition, camPos).normalize();
		raycaster.set(camPos, direction);
		intersect = raycaster.cast();
		if (intersect === null) {
			continue;
		}
		if (intersect.object.id == obj.id){
			nearbyObjectsId.push(obj.id)
		}
	}
	displaymanager.updateNames(nearbyObjectsId);
}


function getNearestObjects(radius, camPos){
	const allowedObjectType = ["Mesh"];
	let meshPos = new THREE.Vector3();
	let meshInRange = [];
	for (var i in annuaire) {
		let mesh = annuaire[i];
		if (allowedObjectType.indexOf(mesh.type) >=0 && mesh.name !== "sol") {
			mesh.getWorldPosition(meshPos);
			if (camPos.distanceTo(meshPos) < radius) {
				meshInRange.push({"id": mesh.id, "worldPosition": meshPos.clone()});
			}
		}
	}
	return meshInRange

}
