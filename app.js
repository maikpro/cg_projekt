/*  
    Computergrafik Projekt von Hafiyyan Teh, Maik Proba
    Autoren: Maik Proba, Hafiyyan Teh

    Objekt-Quellen:
    Stuhl von mafradan (zuletzt abgerufen am 29-08-2021): https://free3d.com/de/3d-model/office-chair-swivel-133232.html
    Schreibtisch von farow (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/wood-desk-93009.html
    Fenster von printable_models (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/-pane-casement-windowwhite-v1--447400.html
    Bett von farow (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/bed-99092.html

    Texture-Quellen:
    Boden: Foto von FWStudio von Pexels (zuletzt abgerufen am 29-08-2021): https://www.pexels.com/de-de/foto/brauner-parkettboden-aus-holz-129731/
    Tischholz, Bettholz: Foto von FWStudio von Pexels (zuletzt abgerufen am 29-08-2021): https://www.pexels.com/de-de/foto/braune-holzoberflache-129733/
    Bettmatraze: Foto von Arina Krasnikova von Pexels (zuletzt abgerufen am 29-08-2021): https://www.pexels.com/de-de/foto/licht-trocken-textur-tisch-7002964/
    Lampe von bebeto11 (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/desk-lamb-330686.html

    Die Grundlagen für den Code lieferte YouTube Tutorialreihe von The Morpheus Tutorials: https://www.youtube.com/playlist?list=PLNmsVeXQZj7rrmmZEVGA4GfLLNLlGipWo

*/

//Globale Variablen für alle Funktionen zugängig!
let scene, camera, renderer; //Scene, Kamera und Renderer für WebGL

//Kontrolle und General User Interface
let gui, controls;

//Lichter
let pointLight, ambientLight;

//Punktlicht Modus: Licht kann aus bzw. angeschaltet werden über GUI.
let pointLightModus = {
    switch: true //Licht an / aus => Am Anfang ist das Licht an!
};

/*KONSTANTE Werte*/
const INTERACTION_SPEED = 0.0375; //Geschwindigkeit der Bewegung bei der Keyboard-Interaktion 
const HINTERGRUNDFARBE= "rgb(20, 20, 20)"; //dunkelgrauer Hintergrund

/*Hier werden alle Funktionen aufgerufen*/
function main(){
    //Scene initialisieren
    scene = new THREE.Scene(); 

    //GUI = Graphical User Interface
    gui = new dat.GUI(); //GUI initialisieren

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //RAUM LADEN:
    //BODEN unten erstellen:
    var floor = generateFloor(10, 10);
    floor.rotation.x = Math.PI/2;
    //holzfarbe für den Boden
    floor.material = generatePhongMaterial(176, 143, 118);
    //Lade Holzbodentexture
    floor.material.map = generateTexture("holzboden.jpg");

    scene.add(floor);

    //Fensterwand hinten mit zwei Fensterlöchern erstellen:
    var backWindowWall = generateTwoWindowsWall();
    backWindowWall.position.z = 5;
    scene.add(backWindowWall);

    //zwei Fenster in die hintere Wand einfügen:
    //Quelle: Fenster von printable_models (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/-pane-casement-windowwhite-v1--447400.html
    generateWindowObject(2, 3, 5, Math.PI/2, 0, 0);
    generateWindowObject(-2, 3, 5, Math.PI/2, 0, 0);

    //Fensterwand links mit zwei Fensterlöchern
    var leftWindowWall = generateTwoWindowsWall();
    leftWindowWall.rotation.y = Math.PI/2;
    leftWindowWall.position.x = 5;
    scene.add(leftWindowWall);

    //zwei Fenster in die linke Wand einfügen:
    //Quelle: Fenster von printable_models (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/-pane-casement-windowwhite-v1--447400.html
    generateWindowObject(5, 3, 2, Math.PI/2, 0, -Math.PI/2);
    generateWindowObject(5, 3, -2, Math.PI/2, 0, -Math.PI/2);

    //Fensterwand rechts mit einem Fensterloch:
    var rightWindowWall = generateOneWindowWall();
    rightWindowWall.position.x = -5;
    rightWindowWall.rotation.y = -Math.PI/2;
    scene.add(rightWindowWall);

    //ein Fenster in die rechte Wand einfügen:
    generateWindowObject(-5, 3, 0, Math.PI/2, 0, Math.PI/2);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //OBJEKTE LADEN
    //braunen Tisch aus Objekt-Datei laden:
    //Quelle: Schreibtisch von farow (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/wood-desk-93009.html
    generateDesk();

    //Stuhl aus Objekt-Datei laden:
    //Quelle: Stuhl von mafradan (zuletzt abgerufen am 29-08-2021): https://free3d.com/de/3d-model/office-chair-swivel-133232.html
    generateChair();

    //Bett aus Objekt-Datei laden: 
    //Quelle: Bett von farow (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/bed-99092.html
    generateBed();

    //Lampe aus Objekt-Datei:
    //Quelle: Lampe von bebeto11 (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/desk-lamb-330686.html
    generateLamp();
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //LICHT
    pointLight = generatePointLight(0xffffff, 2);
    pointLight.position.set(0, 5, 1);
    scene.add(pointLight);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    ambientLight.position.set(0, 5, 0);
    scene.add(ambientLight);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //GUI Einstellungen
    //Punktlicht-------------------------------------------------------------------------------------------------------------------
    //Füge das Punktlicht als Option in die GUI ein:
    const pointLightFolder = gui.addFolder("Punktlicht");
    //Punktlicht Lichtintensität über UI verändern.
    pointLightFolder.add(pointLight, 'intensity', 0, 20).name("Lichtintensität"); 
    //Füge einen Schalter für das Punktlicht in die GUI ein:
    pointLightFolder.add(pointLightModus, "switch").name("Lichtmodus");
    //Punktlicht bewegen
    pointLightFolder.add(pointLight.position, 'x', -20, 20); // X-Achse
    pointLightFolder.add(pointLight.position, 'y', -20, 20); // Y-Achse
    pointLightFolder.add(pointLight.position, 'z', -20, 20); // Z-Achse
    pointLightFolder.open(); //Öffnet die GUI am Anfang
    //---------------------------------------------------------------------------------------------------------------------------------

    //AmbientLight-------------------------------------------------------------------------------------------------------------------
    //Dropdown Ordner in der GUI für Ambientlicht
    const ambientLightFolder = gui.addFolder("Ambientlicht");
    //Lichtintensität vom Ambientlicht über GUI verändern:
    ambientLightFolder.add(ambientLight, 'intensity', 0, 20).name("Lichtintensität");
    //---------------------------------------------------------------------------------------------------------------------------------
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Kamera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-4, 6, -14);
    camera.lookAt(new THREE.Vector3(0, 0, -5));
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true; //Schatten einschalten
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(HINTERGRUNDFARBE);
    document.getElementById("view").appendChild(renderer.domElement);
    //renderer.render(scene, camera);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Controls für Kamerabewegung mit Maus
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //AnimationLoop wird hier aufgerufen:
    animate();
}



/*Wenn Größe Browserfensters sich verändert berechne das Bild neu: */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

/*Reagiere auf Keyboard-Eingaben vom Nutzer in diesem Fall bewege den Stuhl in X oder Z Richtung*/
function onKeyboardInteraction(event) {
    //console.log(event);
    
    //Stuhl bewegen
    var stuhl = scene.getObjectByName("Stuhl");
    
    switch (event.key) {
        //Bewegen
        case "ArrowDown":
            //Nach Unten Z-Achse
            stuhl.position.z -= INTERACTION_SPEED;
            break;
        case "ArrowUp":
            //Nach Oben Z-Achse
            stuhl.position.z += INTERACTION_SPEED;
            break;
        case "ArrowLeft":
            //Nach Links X-Achse
            stuhl.position.x += INTERACTION_SPEED;
            break;
        case "ArrowRight":
            //Nach Rechts X-Achse
            stuhl.position.x -= INTERACTION_SPEED;
            break;

        //Drehen
        case "a":
            //Dreht den Stuhl nach links um Y-Achse
            stuhl.rotation.y -= INTERACTION_SPEED;
            break;
        case "d":
            //Dreht den Stuhl nach rechts um Y-Achse
            stuhl.rotation.y += INTERACTION_SPEED;
            break;

        default:
            return; // Exit
    }
}


/*Erstellt das Material/Farbe für ein Objekt, wechles mit Object.Material gesetzt werden kann.*/
function generatePhongMaterial(r, g, b){
    var rgb = "rgb(" + r + "," + g + "," + b + ")"
    var phongMaterial = new THREE.MeshPhongMaterial({
        color: rgb,
        side: THREE.DoubleSide //Beidseitig einfärben
    }); 
    return phongMaterial;
}

function generateTexture(sourcename){
    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load("./textures/" + sourcename);
    return map;
}

/* Erstellt den Boden für den Raum und gibt diesen zurück */
function generateFloor(width, depth){
    var geo = new THREE.PlaneGeometry(width, depth);
    //Farbe des Bodens mit Phong Shading:
    var material = generatePhongMaterial(0, 50, 100);
    var mesh = new THREE.Mesh(geo, material); //Mesh: triangular polygon mesh based objects
    mesh.receiveShadow = true; //Boden soll Schatten empfangen
    return mesh;
}

/* Erstellt ein Fensterobjekt aus der .obj-Datei */
function generateWindowObject(x, y, z, rotX, rotY, rotZ){
    var objLoader = new THREE.OBJLoader();
    objLoader.load("./objects/Window.obj", async function(obj){
        //console.log(obj);

        //Durchlaufe alle Kindelemente des Objekts
        obj.traverse(function(child){
            //Graues Phong durchsichtiges Material
            var fensterMaterial = new THREE.MeshPhongMaterial({
                color: "rgb(10, 10, 10)",
                opacity: 0.15,
                transparent: true,
            });

            //Nur Kindelemente mit dem Namen Box einfärben:
            if( child.name.includes("Box") ){
                child.material = fensterMaterial;
            }
        });

        obj.name = "Fenster"; //Objekt benennen
        obj.scale.set(0.05, 0.05, 0.05); //herunterskalieren
        obj.rotation.set(rotX, rotY, rotZ); //Drehen
        obj.position.set(x, y, z); //Position festlegen
        obj.castShadow = true;  //Schatten werfen
        obj.receiveShadow = true; //Schatten empfangen

        scene.add(obj); //Fenster in die Scene einfügen
    });
}

/*Erstellt ein Wandstück mit Loch für das Fenster und gibt dieses Wandstück zurück:*/
function generateFensterLoch(){
    var fensterLoch=new THREE.Mesh();
    
    //Fensterstück unten Fenster
    var part1 = generateFloor(2, 2.1);
    part1.position.y=-1.45;

    //Fensterstück oben Fenster
    var part2 = generateFloor(2, 1);
    part2.position.y=2;
    fensterLoch.add(part1, part2);
    return fensterLoch;
}

/*Zusammengesetzte Wand aus Rechteck-Teilen mit EINEM Fensterloch*/
function generateOneWindowWall(){
    var wall=new THREE.Mesh();
    //Wandstück mit Fensterloch
    var fensterLoch = generateFensterLoch();

    //Rest der Wand ausfüllen
    var part1 = generateFloor(4,5);
    part1.position.x = 3;
    var part2 = generateFloor(4,5);
    part2.position.x = -3;
    
    wall.add(fensterLoch, part1, part2);
    wall.position.y=2.5;
    return wall;
}

/*füllt den Rest der Wand mit zwei Fenstern und gibt die Wand zurück:*/
function fillWallOfTwoWindows(){
    var filledWall = new THREE.Mesh(); //erstellt neues Wandobjekt
    var xPos = -4; //verschiebung der Wandstücke
    //erstellt 3 Wandstücke
    for( var i = 0; i < 3; i++ ){
        var part = generateFloor(2,5);
        part.position.x = xPos;
        xPos += 4;
        filledWall.add(part);
    }
    return filledWall;
}

/*Zusammengesetzte Wand aus Rechteck-Teilen mit ZWEI Fensterlöchern*/
function generateTwoWindowsWall(){
    var wall=new THREE.Mesh();

    var linkesFensterLoch = generateFensterLoch();
    linkesFensterLoch.position.x = 2;
    
    var rechtesFensterLoch = generateFensterLoch();
    rechtesFensterLoch.position.x = -2;
    
    //Rest der Wand
    var filledWall = fillWallOfTwoWindows();

    wall.add(linkesFensterLoch, rechtesFensterLoch, filledWall);
    
    //wall.merge(linkesFensterLoch, rechtesFensterLoch, filledWall);
    
    wall.position.y=2.5; 
    
    console.log(wall);

    /*wall.traverse(function(child){
        child.material = generatePhongMaterial(100, 100, 100);
        child.material.map = generateTexture("wall.jpg"); 
        child.material.side = THREE.DoubleSide;
        console.log(child);
    });*/
    
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
        console.log(obj); //alle Childs in der Console anzusehen vom Objekt.

        //Tisch außen Farbe von Schränken
        var deskBaseMaterial = generatePhongMaterial(30, 16, 5);

        //Tischplattenfarbe
        var deskTopMaterial = generatePhongMaterial(107, 70, 0);

        //Durchlaufe alle Children und färbe...
        obj.traverse(function(child){
            //Tisch Schränke außen färben
            if( child.name.includes("Desk Base") || child.name.includes("Tiroir") ){
                child.material = deskBaseMaterial;
            } else{
                //Tischplatte und Schubladenknauf färben
                child.material = deskTopMaterial;
                child.material.map = generateTexture("wood.jpg");
            }
            /*Tisch empfängt schatten und wirft Schatten*/
            child.receiveShadow = true;
            child.castShadow = true;
        });

        obj.scale.set(0.0075, 0.0075, 0.0075); //Tisch herunterskalieren
        obj.rotation.y = -Math.PI/2; //Drehung um PI/2 auf Y-Achse
        obj.position.x = 4.2; //Position auf der X-Achse
        obj.name = "Tisch"; //Objektnamen fetslegen
        scene.add(obj); //Tisch in die Scene einfügen
    });
}

/* Erstellt einen Stuhl als neues Objekt und stellt diesen in den Raum */
//Stuhl Quelle: https://free3d.com/3d-model/office-chair-swivel-133232.html
function generateChair(){
    var objLoader = new THREE.OBJLoader();
    objLoader.load("./objects/Chair.obj", function(obj){
        //console.log(obj);

        //Farben definieren
        //Schwarze Farbe für Metall
        var chairBlackMaterial = generatePhongMaterial(0, 0, 0);
        //Braune Farbe für Sesselstoff
        var chairBrownMaterial = generatePhongMaterial(38, 16, 5);

        //Durchlaufe alle Children und färbe...
        obj.traverse(function(child){
            //Falls child nicht bekannt console verwenden (Zeile 192)!

            //Rollen und Metal schwarz färben
            if( child.name.includes("Chair_Black_Metal") || child.name.includes("Chair_Plastic")){
                child.material = chairBlackMaterial;
            } else {
                //Rest Braun färben
                child.material = chairBrownMaterial;
            }
            
            //Stuhl empfängt und wirft Schatten
            child.receiveShadow = true;
            child.castShadow = true;
        });
        
        //Platzieren
        obj.scale.set(2.25, 2.25, 2.25); //Tisch herunterskalieren
        obj.position.set(2.5, 0, 1);
        obj.rotation.y = 2.25;
        obj.name = "Stuhl"; //Namen definieren um später Operationen auf dem Objekt auszuüben
        scene.add(obj); //Stuhl in die Scene einfügen
    });
}

function generateBed(){
    var objLoader = new THREE.OBJLoader(); //initialisiert OBJLoader
    var cover = generatePhongMaterial(50, 50, 50);
    var brown = generatePhongMaterial(117, 77, 47);

    objLoader.load("./objects/Bed.obj", function(obj){
        //console.log(obj);

        //Durchlaufe alle Kindelemente
        obj.traverse(function(child){
            
            //Matratze ist grün sonst alles Holzbraun
            if( child.name.includes("Bed mattress") ){
                child.material = cover;
                child.material.map = generateTexture("muster.jpg");
            } else{
                child.material = brown;
                child.material.map = generateTexture("wood.jpg");
            }
        });

        //Bett herunterskalieren
        obj.scale.set(0.0007, 0.0007, 0.0007);
        obj.position.set(-3.7, 0, 2.9);
        obj.rotation.y = Math.PI/2;
        scene.add(obj);

    });
}

function generateLamp(){
    var objLoader = new THREE.OBJLoader();
    objLoader.load("./objects/lamp.obj", function(obj){
        obj.traverse(function(child){
            child.material = generatePhongMaterial(100, 0, 0);
        });

        obj.scale.set(0.002, 0.002, 0.002);
        obj.rotation.y = Math.PI;
        obj.position.set(4.2, 1.55, 2);

        //Lampenlicht
        var lampLight = new THREE.SpotLight(0xffffff);
        //lampLight.lookAt(0, 0, 0);
        lampLight.position.set(4.2, 3, 2);
        scene.add(lampLight);


        scene.add(obj);
    });
}

/*Anwendungsloop hier werden die Methoden wiederholt aufgerufen*/
function animate(){
    window.addEventListener( 'resize', onWindowResize ); //Größe ans Fenster anpassen

    //Keyboard Interaction
    window.addEventListener( "keydown", onKeyboardInteraction );

    renderer.render(scene, camera);
    controls.update();

    //Schalte das Punktlicht an, wenn die Checkbox in der GUI gesetzt ist.
    if( pointLightModus ) {
        pointLight.visible = true;
    } else{
        pointLight.visible = false;
    }

    //Führe animate rekursiv aus und erstelle eine flüssige Animation. Eine JavaScript Methode!
    requestAnimationFrame( animate );
}

//Hier muss main aufgrufen werden, damit das Programm ausgeführt werden kann!
main();