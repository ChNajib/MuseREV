function creerGroupe(nom){
	var groupe  = new THREE.Group() ; 
	groupe.name = nom ; 
	return groupe ; 
}


function creerAxes(l){
    return new THREE.AxisHelper(l) ; 
}

function creerBanc(hauteur,largeur, profondeur, materiau){
	var bancPiedAD   = new THREE.BoxGeometry(0.1, hauteur/2, 0.1) ;
	var bancPiedAG   = new THREE.BoxGeometry(0.1, hauteur/2, 0.1) ;
	var bancPiedArD   = new THREE.BoxGeometry(0.1, hauteur/2, 0.1) ;
	var bancPiedArG   = new THREE.BoxGeometry(0.1, hauteur/2, 0.1) ;
	var bancSoutient1   = new THREE.BoxGeometry(0.1, hauteur/2, 0.1) ;
	var bancSoutient2   = new THREE.BoxGeometry(0.1, hauteur/2, 0.1) ;
	var bancBase  = new THREE.BoxGeometry(largeur, 0.1, profondeur) ;
	var bancDossier  = new THREE.BoxGeometry(largeur, hauteur/2, 0.1) ;

	var meshPiedAD = new THREE.Mesh(bancPiedAD, materiau) ; 
	var meshPiedAG = new THREE.Mesh(bancPiedAG, materiau) ; 
	var meshPiedArD = new THREE.Mesh(bancPiedArD, materiau) ; 
	var meshPiedArG = new THREE.Mesh(bancPiedArG, materiau) ; 
	var meshSoutient1 = new THREE.Mesh(bancSoutient1, materiau) ; 
	var meshSoutient2 = new THREE.Mesh(bancSoutient2, materiau) ; 
	var meshBase = new THREE.Mesh(bancBase, materiau) ; 
	var meshDossier = new THREE.Mesh(bancDossier, materiau) ; 

	placerXYZ(meshPiedAD,largeur/2-0.1,-hauteur/4,profondeur/2-0.1);
	placerXYZ(meshPiedAG,-largeur/2+0.1,-hauteur/4,profondeur/2-0.1);
	placerXYZ(meshPiedArD,largeur/2-0.1,-hauteur/4,-profondeur/2+0.1);
	placerXYZ(meshPiedArG,-largeur/2+0.1,-hauteur/4,-profondeur/2+0.1);
	placerXYZ(meshSoutient1,largeur/4,hauteur/4,profondeur/2);
	placerXYZ(meshSoutient2,-largeur/4,hauteur/4,profondeur/2);
	placerXYZ(meshBase,0.0,0.0,0.0);
	placerXYZ(meshDossier,0.0,hauteur/2,profondeur/2);
	orienterX(meshDossier,0.4);

	var groupe = new THREE.Group() ; 
	groupe.name = "banc" ;

	groupe.add(meshPiedAD) ; 
	groupe.add(meshPiedAG) ; 
	groupe.add(meshPiedArD) ; 
	groupe.add(meshPiedArG) ; 
	groupe.add(meshSoutient1) ; 
	groupe.add(meshSoutient2) ; 
	groupe.add(meshBase) ; 
	groupe.add(meshDossier) ; 
	
	return groupe ;   
}
	

function creerSol(nom,largeur,hauteur,materiau){
	var geo   = new THREE.PlaneGeometry(
					largeur,hauteur,
					Math.floor(largeur/10.0)+1, Math.floor(hauteur/10)+1) ; 
	var mesh  = new THREE.Mesh(geo,materiau) ; 
	mesh.name = nom ;
	mesh.rotation.x = - Math.PI / 2 ;
	return mesh ;   
}

function creerCloison(nom,largeur, hauteur, epaisseur, nx, ny, nz, materiau){
	var geo  = new THREE.BoxGeometry(largeur, hauteur, epaisseur, nx, ny, nz) ; 
	var mesh = new THREE.Mesh(geo, materiau) ;
	var groupe = new THREE.Group() ; 
	groupe.name = nom ;
	groupe.add(mesh) ; 
	mesh.position.set(0,hauteur/2.0,0) ;  
	return groupe ;  	
}


function creerSphere(nom,rayon, subdivisions, materiau){
	var geo  = new THREE.SphereGeometry(rayon, subdivisions, subdivisions) ; 
	var mesh = new THREE.Mesh(geo, materiau) ; 
	mesh.name = nom ; 
	return mesh ;  
}


function creerPoster(nom,largeur, hauteur, nomImage){
	var geo   = new THREE.PlaneGeometry(largeur, hauteur) ; 
	var mat   = creerLambertTexture(nomImage, 0xffffff) ; 
	var mesh  = new THREE.Mesh(geo, mat) ; 
	mesh.name = nom ;
	return mesh ;   
}

function creerPoster2(nom,largeur, hauteur, nomImage){
	var geo   = new THREE.PlaneGeometry(largeur, hauteur) ; 
	var mat   = creerLambertTexture(nomImage, 0xffffff) ; 
	var mesh  = new THREE.Mesh(geo, mat) ; 
	mesh.name = nom ;
	return mesh ;   
}

function creerCube(nom,largeur,hauteur,epaisseur, materiau){
	var geo  = new THREE.BoxGeometry(largeur, hauteur, epaisseur) ; 
	var mesh = new THREE.Mesh(geo, materiau) ; 
	mesh.name = nom ; 
	return mesh ;  
}

function creerPoster1(nom,largeur, hauteur, nomImage){
	var geo    = new THREE.PlaneGeometry(largeur, hauteur) ; 
	var mat    = creerLambertTexture(nomImage, 0xffffff) ; 
	var mesh   = new THREE.Mesh(geo, mat) ; 
	mesh.name = "poster_"+nom ;
	var dos    = new THREE.Mesh(geo, materiauBlanc) ; 
	dos.rotation.y = Math.PI ; 
	dos.position.z = -0.01 ; 
	mesh.position.z = 0.01 ; 

	var groupe = new THREE.Group() ; 
	groupe.add(mesh) ; 
	groupe.add(dos) ;  
	groupe.name  = nom ;
	return groupe ;   
}

function creerText(description,largeur,hauteur){
	canvas = document.createElement('canvas')
	context = canvas.getContext('2d');
	canvas.width=1000
	canvas.heigth=5
	context.font = '80pt Arial';
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width - 0, canvas.height - 0);
	context.fillStyle = 'black';
    	context.textAlign = "center";
    	context.textBaseline = "middle";
    	context.fillText(description, canvas.width / 2, canvas.height / 2);

	var geometry = new THREE.PlaneGeometry(largeur*0.9, hauteur*0.1) ; 
	texture = new THREE.CanvasTexture(canvas);
	var material = new THREE.MeshLambertMaterial({color:0xffffff,map:texture}) ;
	var mesh = new THREE.Mesh(geometry,material)
    return mesh;
}




// ===================
// Création de sources
// ===================

function creerSourcePonctuelle(couleur, intensite, portee, attenuation){
	var light = new THREE.PointLight(couleur,intensite,portee,attenuation) ; 
	return light ; 
}

function creerSoleil(){
	var h = new THREE.HemisphereLight(0xffffff,0xffffff,1) ; 
	return h ; 
}

function creerSourceAudio3d(listener, fileName, loop, volume, distance){
	var sound = new THREE.PositionalAudio(listener) ; 
	var audioLoader = new THREE.AudioLoader() ; 
	audioLoader.load(
				fileName,
   				function(buffer){
					//var _loop     = params["loop"]     || false ; 
					//var _volume   = params["volume"]   || 1.0 ;
					//var _distance = params["distance"] || 20 ;
					sound.setBuffer(buffer) ; 
					sound.setLoop(loop) ; 
					sound.setVolume(volume) ;
					sound.setRefDistance(distance) ;  
					sound.play() ; 
				}) ;
	return sound ;
}



// =====================
// Création de matériaux
// =====================

var textureLoader = new THREE.TextureLoader() ; 

var materiauBlanc  = creerLambert(0xffffff) ; 
var materiauRouge  = creerLambert(0xff0000) ;

function creerWireframe(couleur){
	var mat = new THREE.MeshBasicMaterial({color:couleur,wireframe:true}) ; 
	return mat ;
}

function creerLambert(couleur){
  	var mat = new THREE.MeshLambertMaterial({color:couleur}) ; 
	return mat ; 
}

function creerLambertTexture(nomImage,couleur,nx,ny){
	var texture = textureLoader.load(nomImage) ; 
	var mat = new THREE.MeshLambertMaterial({color:couleur,map:texture}) ; 
	nx = nx ||   1 ; 
	ny = ny ||   1 ; 
	mat.map.wrapS = THREE.RepeatWrapping ;
	mat.map.wrapT = THREE.RepeatWrapping ;
	mat.map.repeat.set(nx,ny) ; 
	return mat ; 
}

function creerPhong(couleur){
  	var mat = new THREE.MeshPhongMaterial({color:couleur}) ; 
	return mat ; 
}

function creerPhongTexture(nomImage,couleur,nx,ny){
	var texture = textureLoader.load(nomImage) ; 
	var mat = new THREE.MeshPhongMaterial({color:couleur,map:texture}) ; 
	nx = nx ||   1 ; 
	ny = ny ||   1 ; 
	mat.map.wrapS = THREE.RepeatWrapping ;
	mat.map.wrapT = THREE.RepeatWrapping ;
	mat.map.repeat.set(nx,ny) ; 
	return mat ; 
}

function creerStandard(couleur){
  	var mat = new THREE.MeshStandardMaterial({color:couleur}) ; 
	return mat ; 
}

function creerStandardTexture(nomImage,couleur,nx,ny){
	var texture = textureLoader.load(nomImage) ; 
	var mat = new THREE.MeshStandardMaterial({color:couleur,map:texture}) ; 
	nx = nx ||   1 ; 
	ny = ny ||   1 ; 
	mat.map.wrapS = THREE.RepeatWrapping ;
	mat.map.wrapT = THREE.RepeatWrapping ;
	mat.map.repeat.set(nx,ny) ; 
	return mat ; 
}


// ======================
// Traitements des meshes
// ======================

function placerXYZ(mesh,x,y,z){
	mesh.translateX(x) ; 
	mesh.translateY(y) ; 
	mesh.translateZ(z) ; 
}

function orienterY(mesh,y){
	mesh.rotateY(y) ; 
}

function parentDe(pere,fils){
	pere.add(fils) ; 
}




