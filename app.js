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

/*KONSTANTE Werte*/
const INTERACTION_SPEED = 0.0375; //Geschwindigkeit der Bewegung bei der Keyboard-Interaktion 
const HINTERGRUNDFARBE= "rgb(20, 20, 20)"; //dunkelgrauer Hintergrund

/*Hier werden alle Funktionen aufgerufen*/
function main(){
    //Scene initialisieren
    scene = new THREE.Scene(); 

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Kamera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-4, 10, -14);
    //camera.lookAt(new THREE.Vector3(0, 15, -5));
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    //Stuhl aus Objekt-Datei laden:
    //Quelle: Stuhl von mafradan (zuletzt abgerufen am 29-08-2021): https://free3d.com/de/3d-model/office-chair-swivel-133232.html
    generateChair();

    //Bett aus Objekt-Datei laden: 
    //Quelle: Bett von farow (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/bed-99092.html
    generateBed();

    //Lampe aus Objekt-Datei:
    //Quelle: Lampe von bebeto11 (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/desk-lamb-330686.html
    generateLamp();

    //braunen Tisch aus Objekt-Datei laden:
    //Quelle: Schreibtisch von farow (zuletzt abgerufen am 29-08-2021): https://free3d.com/3d-model/wood-desk-93009.html
    generateDesk();
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //LICHT
    initPointLight();

    initAmbientLight();

    //Lampenlicht
    initLampLight();
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //GUI einrichten: Nutze DAT GUI Bibliothek als General User Interface 
    initGUI();


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true; //Schatten einschalten
    renderer.setSize(window.innerWidth, window.innerHeight); //lege die Fenstergröße fest in diesem Fall Browserfenstergröße. (window liefert innere Fenstergröße vom Browser)
    renderer.setClearColor(HINTERGRUNDFARBE); //setzt die Hintergrundfarbe

    //hänge den Renderer an das HTML-Element mit der ID view dran:
    document.getElementById("view").appendChild(renderer.domElement);
    //renderer.render(scene, camera);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Controls für Kamerabewegung mit Maus aus der THREEJS Bibliothek
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //AnimationLoop wird hier aufgerufen:
    animate();
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

/*Anwendungsloop hier werden die Methoden wiederholt aufgerufen*/
function animate(){
    window.addEventListener( 'resize', onWindowResize ); //Größe ans Fenster anpassen

    //Keyboard Interaction
    window.addEventListener( "keydown", onKeyboardInteraction );

    renderer.render(scene, camera);
    controls.update();

    lampLight.target.updateMatrixWorld();
    spotlightHelper.update();

    //Führe animate rekursiv aus und erstelle eine flüssige Animation. Eine JavaScript Methode!
    requestAnimationFrame( animate );
}

//Hier muss main aufgrufen werden, damit das Programm ausgeführt werden kann!
main();