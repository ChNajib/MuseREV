var couleurs = {
	"noir":0x000000,
	"gris":0xaaaaaa,
	"blanc":0xffffff,
	"rouge":0xff0000,
	"vert":0x00ff00,
	"bleu":0x0000ff
	} ; 
function colorier(coul){
return (couleurs[coul] || 0xffffff) ; 
}

function chargerDocument(){
var oReq = new XMLHttpRequest() ; 
oReq.onload = parser ; 
oReq.open("get","scene.json",true) ; 
oReq.send() ; 
}

function parser(){

var obj = JSON.parse(this.responseText) ; 
data = obj ; 

var objets    = data.objets ; 
var actions   = data.actions ; 
var relations = data.relations ;  

var _obj, obj ; 
var _act ; 

for(var i=0; i<objets.length; i++){
	_obj = objets[i] ; 
	var nom    = _obj.nom ; 
	var params = _obj.params ; 
	var finalObject;

	if(_obj.type == "groupe" ){
		finalObject        = creerGroupe(nom) ;
		
	} else
	if(_obj.type == "sol" ){
		var largeur    = params.largeur ;
		var profondeur = params.profondeur ; 
		var materiau   = chercherDansAnnuaire(params.materiau) ; 
		finalObject       = creerSol(nom,largeur,profondeur,materiau) ;
		
	} else
	if(_obj.type == "sphere"){
		var rayon    = params.rayon ; 
		var subdiv   = params.subdivisions ;   
		var materiau = chercherDansAnnuaire(params.materiau) ;   
		finalObject   = creerSphere(nom,rayon,subdiv,materiau) ; 
	} else 
	if(_obj.type == "cloison"){
		var largeur   = params.largeur ;
		var hauteur   = params.hauteur ; 
		var epaisseur = params.epaisseur ;
					var nx        = params.nl || 1 ; 
		var ny	      = params.nh || 1 ; 
		var nz 	      = params.ne || 1 ;
		var materiau  = chercherDansAnnuaire(params.materiau) || materiauBlanc ;
		finalObject   = creerCloison(nom,largeur,hauteur,epaisseur, nx, ny, nz,materiau) ; 
	} else
	if(_obj.type == "poster"){
		var largeur = params.largeur ;
		var hauteur = params.hauteur ; 
		var url     = params.url ; 
		finalObject  = creerPoster(nom,largeur,hauteur,url) ;  
	} else
	if (_obj.type == "cube") {
		var materiau  = chercherDansAnnuaire(params.materiau) || materiauBlanc ;
		finalObject = creerCube(nom,params.largeur,params.hauteur,params.epaisseur,materiau);
	} else
	if(_obj.type == "banc"){
		var largeur   = 2.0 ;
		var hauteur   = 1.0 ;
		var profondeur= 0.65 ;
		var materiau  = chercherDansAnnuaire(params.materiau) || materiauBlanc ;
		finalObject   = creerBanc(hauteur, largeur, profondeur, materiau);
	} else 
	if(_obj.type == "texte"){
		var largeur = params.largeur ;
		var hauteur = params.hauteur ; 
		var desc    = params.texte ; 
		finalObject   = creerText(desc,largeur,hauteur) ;  
	} else
	if(_obj.type == "axes"){
		var longueur = params.longueur || 1 ; 
		finalObject     = creerAxes(longueur) ;  
	} else
	if(_obj.type == "wireframe"){
		finalObject = creerWireframe(colorier(params.couleur)) ; 
	} else 
	if(_obj.type == "lambert"){
		finalObject = creerLambert(colorier(params.couleur)) ; 
	} else 
	if(_obj.type == "lambertTexture"){
		var nx = params.nx || 1 ; 
		var ny = params.ny || 1 ; 
		finalObject = creerLambertTexture(params.image,colorier(params.couleur),nx, ny) ; 
	} else
	if(_obj.type == "standard"){
		finalObject = creerStandard(colorier(params.couleur)) ; 
	} else 
	if(_obj.type == "standardTexture"){
		var nx = params.nx || 1 ; 
		var ny = params.ny || 1 ; 
		finalObject = creerStandardTexture(params.image,colorier(params.couleur),nx, ny) ; 
	} else
	if(_obj.type == "soleil"){
		finalObject = creerSoleil() ; 
	} else
	if(_obj.type == "ampoule"){
		var couleur     = colorier(params.couleur) || 0xffffff ; 
		var intensite   = params.intensite || 1.0 ; 
		var portee      = params.portee || 3.0 ; 
		var attenuation = params.attenuation || 1.0 ;   
		finalObject = creerSourcePonctuelle(couleur, intensite, portee, attenuation) ; 
	} else 
	if(_obj.type == "audio"){
		var loop        = params.loop     || false ; 
		var volume      = params.volume   || 1.0 ;
		var distance    = params.distance || 20.0 ;
		var url         = params.url      || "" ; 
		finalObject = creerSourceAudio3d(listener,url,loop, volume, distance) ;   
		 
	}		
	if (params.hasOwnProperty('description')) {
		finalObject.userData.description = params.description;
	}

	if (params.hasOwnProperty('posterName')) {
		finalObject.userData.posterName = params.posterName;
	}		

	enregistrerDansAnnuaire(nom,finalObject) ;
} ; 


for(var i=0; i<actions.length; i++){
	_act = actions[i] ;
	var objet  = chercherDansAnnuaire(_act.objet) ;
	var fonc   = _act.fonc ;
	var params = _act.params ; 

	if(fonc == "placerXYZ"){
		objet.position.set(params.x, params.y, params.z) ; 
	} else
	if(fonc == "orienterY"){
		objet.rotation.y = params.angle ; 
	}
}


for(var i=0; i<relations.length; i++){
	_rel = relations[i] ; 
	var sujet = chercherDansAnnuaire(_rel.sujet) ; 
	var objet = chercherDansAnnuaire(_rel.objet) ; 
	if(_rel.rel == "parentDe"){
		sujet.add(objet) ; 
	}
}



}


