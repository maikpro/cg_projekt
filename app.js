//Quelle: https://www.youtube.com/watch?v=b6sft8PEs5o&list=PLNmsVeXQZj7rrmmZEVGA4GfLLNLlGipWo&index=5

let scene, camera, renderer; //Globale Variablen für alle Funktionen zugängig!
let gui, controls, pointLight;

let lichtmodus = {
    switch: true //Licht an / aus => Am Anfang ist das Licht an!
};

const INTERACTION_SPEED = 0.0375; 

function main(){
    //Scene
    scene = new THREE.Scene();

    //GUI = Graphical User Interface
    gui = new dat.GUI();

    //////////////////////////////////////////////
    //RAUM LADEN
    //floor
    var floor = generateFloor(10, 10);
    floor.rotation.x = Math.PI/2;
    scene.add(floor);

    //linke Wand
    var leftWall = generateWall(5, 0, -2.5);
    leftWall.rotation.y = Math.PI/2;
    floor.add(leftWall);

    //rechte Wand
    var rightWall = generateWall(-5, 0, -2.5);
    rightWall.rotation.y = -Math.PI/2;
    floor.add(rightWall);

    //hinten Wand
    var backWall = generateWall(0, 5, -2.5);
    backWall.rotation.set(-Math.PI/2, 0, Math.PI/2);
    floor.add(backWall);
    //////////////////////////////////////////////

    //////////////////////////////////////////////
    //OBJEKTE LADEN
    
    //roten Würfel laden:
    /*var box = generateBox(1, 1, 2) //0 0 0
    box.position.z = -1;
    floor.add( box );*/

    //braunen Tisch aus Objekt-Datei laden:
    generateDesk();

    //Stuhl aus Objekt-Datei laden:
    generateChair();

    /////////////////////////////////////////

    //////////////////////////////////////////////
    //LICHT
    pointLight = generatePointLight(0xffffff, 2);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    //////////////////////////////////////////////
    //GUI Einstellungen

    //Punktlicht-------------------------------------------------------------------------------------------------------------------
    //Füge das Punktlicht als Option in die GUI ein:
    const pointLightFolder = gui.addFolder("Punktlicht");
    pointLightFolder.add(pointLight, 'intensity', 0, 20).name("Lichtintensität"); //Punktlicht Lichtintensität über UI verändern.

    //Füge einen Schalter für das Punktlicht in die GUI ein:
    pointLightFolder.add(lichtmodus, "switch").name("Lichtmodus");
    //gui.open();

    //Punktlicht bewegen
    pointLightFolder.add(pointLight.position, 'x', -20, 20); // X-Achse
    pointLightFolder.add(pointLight.position, 'y', -20, 20); // Y-Achse
    pointLightFolder.add(pointLight.position, 'z', -20, 20); // Z-Achse
    //---------------------------------------------------------------------------------------------------------------------------------

    //Keyboard Interaktionen Legende
    //... TODO
    ///////////////////////////////////////////////////////

    
    
    //Kamera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-4, 6, -14);
    camera.lookAt(new THREE.Vector3(0, 0, -5));

    

    //Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true; //Schatten einschalten
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("rgb(60, 60, 60)");
    document.getElementById("view").appendChild(renderer.domElement);
    //renderer.render(scene, camera);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    animate();
}

/*Wenn Größe Browserfensters sich verändert berechne das Bild neu: */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onKeyboardInteraction(event) {
    console.log(event);
    
    //Stuhl bewegen
    var stuhl = scene.getObjectByName("Stuhl");
    
    switch (event.key) {
        //Bewegen
        case "ArrowDown":
            stuhl.position.z -= INTERACTION_SPEED;
            break;
        case "ArrowUp":
            stuhl.position.z += INTERACTION_SPEED;
            break;
        case "ArrowLeft":
            stuhl.position.x += INTERACTION_SPEED;
            break;
        case "ArrowRight":
            stuhl.position.x -= INTERACTION_SPEED;
            break;

        //Drehen
        case "s":
            stuhl.rotation.y -= INTERACTION_SPEED;
            break;
        case "w":
            stuhl.rotation.y += INTERACTION_SPEED;
            break;

        default:
            return; // Exit
    }
}

/*Erstellt einen roten Würfel im Raum zum Testen*/
function generateBox(width, height, depth){
    var geo = new THREE.BoxGeometry(width, height, depth);
    /*var material = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });*/
    var material = new THREE.MeshPhongMaterial({
        color: "rgb(100, 0, 0)"
    });
    var mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true //Box soll Schatten werfen!
    return mesh;
}

/* Erstellt den Boden für den Raum und gibt diesen zurück */
function generateFloor(width, depth){
    var geo = new THREE.PlaneGeometry(width, depth);
    /*var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide
    });*/
    //Farbe des Bodens mit Phong Shading:
    var material = new THREE.MeshPhongMaterial({
        color: "rgb(0, 50, 100)",
        side: THREE.DoubleSide //Boden soll von oben und unten einsehbar sein.
    });
    var mesh = new THREE.Mesh(geo, material); //Mesh: triangular polygon mesh based objects
    mesh.receiveShadow = true; //Boden soll Schatten empfangen
    return mesh;
}

/* Erstellt eine Wand und gibt diese zurück */
function generateWall(x, y, z){
    var wall = generateFloor(5, 10);
    wall.position.set(x, y, z);
    return wall;
}

/* Erstellt ein Punktlicht und gibt dieses zurück */
function generatePointLight(color, intensity){
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true; //Lichtquelle soll Schatten werfen
    return light;
}


/*Erstellt ein neues Objekt als Tisch und stellt diesen in den Raum*/
//Schreibtisch Quelle: https://free3d.com/3d-model/wood-desk-93009.html
function generateDesk(){
    var objLoader = new THREE.OBJLoader();
    objLoader.load("./objects/Desk.obj", function(obj){
        //console.log(obj); //alle Childs in der Console anzusehen vom Objekt.

        //Tisch außen Farbe von Schränken
        var deskBaseMaterial = new THREE.MeshPhongMaterial({
            color: "rgb(38, 16, 5)"
        });

        //Tischplattenfarbe
        var deskTopMaterial = new THREE.MeshPhongMaterial({
            color: "rgb(107, 70, 0)"
        });

        //Durchlaufe alle Children und färbe...
        obj.traverse(function(child){
            //Falls child nicht bekannt console verwenden (Zeile 136)!
            
            //Tisch Schränke außen färben
            if( child.name.includes("Desk Base") || child.name.includes("Tiroir") ){
                child.material = deskBaseMaterial;
            } else{
                //Tischplatte und Schubladenknauf färben
                child.material = deskTopMaterial;
            }
            /*Tisch empfängt schatten und wirft Schatten*/
            child.receiveShadow = true;
            child.castShadow = true;
        });

        obj.scale.set(0.0075, 0.0075, 0.0075); //Tisch herunterskalieren
        obj.rotation.y = -Math.PI/2;
        obj.position.x = 4.25;
        obj.name = "Tisch";
        scene.add(obj);
    });
}

/* Erstellt einen Stuhl als neues Objekt und stellt diesen in den Raum */
//Stuhl Quelle: https://free3d.com/3d-model/low-poly-wood-cair-8450.html
function generateChair(){
    var objLoader = new THREE.OBJLoader();
    objLoader.load("./objects/Chair.obj", function(obj){
        console.log(obj);

        //Farben definieren
        var chairLegsMaterial = new THREE.MeshPhongMaterial({
            color: "rgb(38, 16, 5)"
        });

        var coverMaterial = new THREE.MeshPhongMaterial({
            color: "rgb(94, 11, 0)"
        });

        console.log( obj.children[2] )
        

        //Durchlaufe alle Children und färbe...
        obj.traverse(function(child){
            //Falls child nicht bekannt console verwenden (Zeile 192)!
            
            //Objekt Stuhl enthält "Studio" hier entfernen da es weißen Hintergrund einfügt, der nicht benötigt wird
            if( child.name.includes("Studio") ){
                child.visible = false;
            }

            if( child.name.includes("Legs") ){
                child.material = chairLegsMaterial;
            }

            if( child.name.includes("Cover") ){
                child.material = coverMaterial;
            }

            /*Stuhl empfängt und wirft Schatten*/
            child.receiveShadow = true;
            child.castShadow = true;
        });
        
        //Platzieren
        obj.scale.set(0.0075, 0.0075, 0.0075); //Tisch herunterskalieren
        obj.position.set(9, 0, 1.45);
        obj.rotation.y = 0;
        obj.name = "Stuhl"; //Namen definieren um später Operationen auf dem Objekt auszuüben
        scene.add(obj);
        scene.remove( obj.children[2] );
        console.log(scene);
    });
}



/*Anwendungsloop hier werden die Methoden wiederholt*/
function animate(){
    window.addEventListener( 'resize', onWindowResize ); //Größe ans Fenster anpassen

    //Keyboard Interaction
    window.addEventListener( "keydown", onKeyboardInteraction );

    renderer.render(scene, camera);
    controls.update();

    //Schalte das Licht an wenn der Tick in der GUI gesetzt ist.
    if( lichtmodus.switch ) {
        pointLight.visible = true;
    } else{
        pointLight.visible = false;
    }

    //Führe animate rekursiv aus und erstelle eine flüssige Animation. Eine JavaScript Methode!
    requestAnimationFrame( animate );
}

main();