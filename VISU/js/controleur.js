var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var mouseClicked = false;
var world = null;
var origin = new THREE.Vector3();
var ext = new THREE.Vector3();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3(1, 0, 0);
var enAvance = false;
var enArriere = false;
var aGauche = false;
var aDroite = false;

var KeyboardControls = function (object) {
	this.object = object;

	this.position = new THREE.Vector3(1, 1.7, 5);

	this.angle = 0.0;

	this.cible = new THREE.Vector3(2, 1.7, 5);

	this.plusHaut = false;
	this.plusBas = false;

	this.domElement = document.body;
	this.isLocked = false;

	var scope = this;

	var changeEvent = { type: 'change' };
	var lockEvent = { type: 'lock' };
	var unlockEvent = { type: 'unlock' };

	var euler = new THREE.Euler(0, 0, 0, 'YXZ');

	var PI_2 = Math.PI / 2;

	var vec = new THREE.Vector3();

	function onMouseMove(event) {
		if (scope.isLocked === false) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		euler.setFromQuaternion(camera.quaternion);

		euler.y -= movementX * 0.002;
		euler.x -= movementY * 0.002;

		euler.x = Math.max(- PI_2, Math.min(PI_2, euler.x));

		camera.quaternion.setFromEuler(euler);

		scope.dispatchEvent(changeEvent);
	}

	function onPointerlockChange() {

		if (document.pointerLockElement === scope.domElement) {

			scope.dispatchEvent(lockEvent);

			scope.isLocked = true;

		} else {

			scope.dispatchEvent(unlockEvent);

			scope.isLocked = false;

		}

	}

	function onPointerlockError() {

		console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');

	}

	this.connect = function () {

		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('pointerlockchange', onPointerlockChange, false);
		document.addEventListener('pointerlockerror', onPointerlockError, false);

	};

	this.disconnect = function () {

		document.removeEventListener('mousemove', onMouseMove, false);
		document.removeEventListener('pointerlockchange', onPointerlockChange, false);
		document.removeEventListener('pointerlockerror', onPointerlockError, false);

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.getObject = function () { 

		return camera;

	};

	this.getDirection = function () {

		var direction = new THREE.Vector3(0, 0, - 1);

		return function (v) {

			return v.copy(direction).applyQuaternion(camera.quaternion);

		};

	}();

	this.enAvance = function (distance) {

		vec.setFromMatrixColumn(camera.matrix, 0);

		vec.crossVectors(camera.up, vec);

		camera.position.addScaledVector(vec, distance);

	};

	this.aDroite = function (distance) {

		vec.setFromMatrixColumn(camera.matrix, 0);

		camera.position.addScaledVector(vec, distance);

	};

	this.lock = function () {

		this.domElement.requestPointerLock();

	};

	this.unlock = function () {

		document.exitPointerLock();

	};

	this.connect();
};

KeyboardControls.prototype = Object.create(THREE.EventDispatcher.prototype);
KeyboardControls.prototype.constructor = KeyboardControls;

KeyboardControls.prototype.update = function (dt) {

	if (mouseClicked) {
		this.isLocked = false;

		direction.set(origin.x - ext.x, origin.y - ext.y, origin.z - ext.z);
		direction.normalize();
		velocity.z = direction.z * 300.0 * dt;
		velocity.x = direction.x * 300.0 * dt;
		controls.aDroite(- velocity.x * dt);
		controls.enAvance(- velocity.z * dt);

		var pos = camera.position;

		if ((pos.x > ext.x - 3.5 && pos.x < ext.x + 3.5) && (pos.z > ext.z - 3.5 && pos.z < ext.z + 3.5)) {
			mouseClicked = false;
			this.isLocked = true;
		}
	}
	else {
		raycaster.ray.origin.copy(controls.getObject().position);
		raycaster.ray.origin.y -= 10;
		velocity.x -= velocity.x * 30.0 * dt;
		velocity.z -= velocity.z * 30.0 * dt;
		velocity.y -= 9.8 * 100.0 * dt; 
		direction.z = Number(enAvance) - Number(enArriere);
		direction.x = Number(aDroite) - Number(aGauche);
		direction.normalize();
		if (enAvance || enArriere) velocity.z -= direction.z * 300.0 * dt;
		if (aGauche || aDroite) velocity.x -= direction.x * 300.0 * dt;
		controls.aDroite(- velocity.x * dt);
		controls.enAvance(- velocity.z * dt);
	}

}

function keyUp(event) {
	switch (event.keyCode) {
		case 38: 
		case 90: 
			enAvance = false;
			break;
		case 37: 
		case 81: 
			aGauche = false;
			break;
		case 40: 
		case 83: 
			enArriere = false;
			break;
		case 39: 
		case 68: 
			aDroite = false;
			break;
	}
}


function keyDown(event) {
	switch (event.keyCode) {
		case 38: 
		case 90: 
			enAvance = true;
			break;
		case 37: 
		case 81:
			aGauche = true;
			break;
		case 40: 
		case 83: 
			enArriere = true;
			break;
		case 39: 
		case 68: 
			aDroite = true;
			break;
	}
}



function mouseDown(event) {
	//event.preventDefault();
	mouse.x = 0;
	mouse.y = 0;
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(scene.children, true);
	if (intersects.length > 0) {
		if (intersects[0].object.geometry.type == "SphereGeometry" ) {
			pointeur.position.set(intersects[0].point.x, intersects[0].point.y, +intersects[0].point.z);
			mouseClicked = true;
			world = intersects[0].object.matrixWorld;
			origin = new THREE.Vector3(0, 0, 0);
			ext = new THREE.Vector3(0, 0, 2);
			origin.applyMatrix4(world);
			ext.applyMatrix4(world);
		}
	}
}

