/*  
    Hochschule Osnabrück Sommersemester 2021
    Modul: Computergrafik Projekt
    Autoren: Maik Proba, Hafiyyan Teh

    genutzten Bibliotheken:
    dat.gui.min.js - GitHub vom Data Arts Team, dat.GUI, https://github.com/dataarts/dat.gui/blob/master/build/dat.gui.min.js, abgerufen am 06.09.2021
    OBJLoader.js - GitHub von mrdoob, OBJLoader, https://github.com/mrdoob/three.js/blob/dev/examples/js/loaders/OBJLoader.js, abgerufen am 06.09.2021
    OrbitControls - GitHub von mrdoob, OrbitControls, https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js, abgerufen am 06.09.2021
    three.js - GitHub von mrdoob, Three.js, https://raw.githubusercontent.com/mrdoob/three.js/dev/build/three.js, abgerufen am 11.09.2021.

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

/*Mit diesen Methoden wird der Raum mit Boden und Wänden generiert*/
function generateRoom(){
    var floor = generateFloor(10, 10);
    floor.rotation.x = Math.PI/2;
    floor.material = generatePhongMaterial(176, 143, 118); //holzfarbe für den Boden
    floor.material.map = generateTexture("holzboden.jpg"); //Lade Holzbodentexture
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
    //Zwei Löcher werden für die Fenster generiert
    var linkesFensterLoch = generateFensterLoch();
    linkesFensterLoch.position.x = 2;
    var rechtesFensterLoch = generateFensterLoch();
    rechtesFensterLoch.position.x = -2;
    //Rest der Wand
    var filledWall = fillWallOfTwoWindows();
    wall.add(linkesFensterLoch, rechtesFensterLoch, filledWall);
    wall.position.y=2.5; 
    return wall;
}