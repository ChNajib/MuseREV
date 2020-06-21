		var temps = 0.0 ; 
		var dt ; 
		var chrono = null ; 
		var annuaire = null ; 
		var scene = null;
		var renderer = null;
		var camera = null;
		var camControls = null;

		var listener = null ;
		var sound  = null ; 
		var sound1 = null ; 
 
		var controls = null ; 
		var windowHalfX = window.innerWidth  / 2.0 ; 
		var windowHalfY = window.innerHeight / 2.0 ; 

		var pointeur ;

		var mouseX = mouseY = 0.0 ; 

		var data ; 
		var center = new THREE.Vector2(0,0);
		var raycaster = new Raycaster();        
		var direction = new THREE.Vector3();            
		var displaymanager;         
		var focusTimeThreshold = 2;
		const debugRayCast = false;      
		var ray = null;
		var lastObjectSeenID;    
		var lastObjectSeenTime;

		var params = {
			shadows: false
		};
		
		var previousShadowMap = false;
		//#endregion
		function init(){
			displaymanager = new DisplayManager();
			chrono = new THREE.Clock() ; 
		
			annuaire = {} ; 

			renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(renderer.domElement);

			scene = new THREE.Scene() ; 
			enregistrerDansAnnuaire("scene",scene) ; 

			camera = new THREE.PerspectiveCamera(70.0, window.innerWidth/window.innerHeight, 0.1, 1000.0) ; 
			camera.position.set(0,1.7,5.0) ; 
			camera.lookAt(new THREE.Vector3(0.0,1.7,0.0)) ; 

			listener = new THREE.AudioListener() ; 
			camera.add(listener) ;
			var reticle = new THREE.Mesh(
				new THREE.RingBufferGeometry(0.001, 0.01, 32),
				new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
			);
			reticle.position.z = -1;
			reticle.lookAt(camera.position)
		
			camera.add(reticle);
			scene.add(camera);
			
			window.addEventListener('resize', function(){
				windowHalfX = window.innerWidth  / 2.0 ; 
				windowHalfY = window.innerHeight / 2.0 ; 
				camera.aspect = window.innerWidth / window.innerHeight ;
				camera.updateProjectionMatrix() ; 
				renderer.setSize(window.innerWidth , window.innerHeight) ; 
				
			}) ; 



			controls = new KeyboardControls(camera) ; 
			var blocker = document.getElementById('blocker');
			var instructions = document.getElementById('instructions');
			instructions.addEventListener('click', function () {
				controls.lock();
			}, false);
			controls.addEventListener('lock', function () {
				instructions.style.display = 'none';
				blocker.style.display = 'none';
			});
			controls.addEventListener('unlock', function () {
				blocker.style.display = 'block';
				instructions.style.display = '';
			});
			console.log(controls) ; 

			window.addEventListener('keydown',   keyDown   ,    false) ;
			window.addEventListener('keyup',     keyUp     ,    false) ;
			window.addEventListener('mousedown', mouseDown ,    false) ;

			chrono.start() ; 

		} ; 

		function enregistrerDansAnnuaire(nom,objet){
			annuaire[nom] = objet ; 
		}

		function chercherDansAnnuaire(nom,defaut){
			return (annuaire[nom] || defaut) ; 
		}

		function creerScene(){


			//scene.add(creerSoleil()) ; 
			pointeur = creerSphere("pointeur",0.05,16,materiauRouge) ; 
			scene.add(pointeur) ; 

			//parser() ;
			chargerDocument() ;  
			console.log("Fin de création de la scène") ; 
		}


		function animate(){

			dt = chrono.getDelta();
			temps += dt;
			requestAnimationFrame(animate);
			updateLastSeenObject(dt);
			updateCloseByObject();
			controls.update(dt);
			renderer.render(scene, camera);
		}

