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

//Kontrolle und General User Interface
let gui, controls;

//Options: Licht kann aus bzw. angeschaltet werden über GUI.
let options = {
    pointLightSwitch: false, //Licht an / aus => Am Anfang ist das Licht an!
    spotLightSwitch: true,
    spotLightHelper: false,
};

//HELPER
let spotlightHelper;

function initGUI(){
    //GUI = Graphical User Interface
    gui = new dat.GUI(); //GUI initialisieren
    addPointLightMenu(); //Fügt das Punktlicht-Menu ins GUI ein.
    addAmbientLightMenu() //Fügt das Ambientlicht-Menu ins GUI ein.
    addLampLightMenu();
}

function addPointLightMenu(){
    //Punktlicht------------------------------------------------------------------------------------------------------------------------
    //Füge das Punktlicht als Option in die GUI ein:
    const pointLightFolder = gui.addFolder("Punktlicht");
    //Punktlicht Lichtintensität über UI verändern.
    pointLightFolder.add(pointLight, 'intensity', 0, 20).name("Lichtintensität"); 
    //Füge einen Schalter für das Punktlicht in die GUI ein:
    pointLightFolder.add(options, "pointLightSwitch").name("Lichtmodus").listen().onChange( onChangedPointLightSwitch );
    //Punktlicht bewegen
    pointLightFolder.add(pointLight.position, 'x', -20, 20); // X-Achse
    pointLightFolder.add(pointLight.position, 'y', -20, 20); // Y-Achse
    pointLightFolder.add(pointLight.position, 'z', -20, 20); // Z-Achse
    pointLightFolder.open(); //Öffnet die GUI am Anfang
}

function addAmbientLightMenu(){
    //Dropdown Ordner in der GUI für Ambientlicht
    const ambientLightFolder = gui.addFolder("Ambientlicht");
    //Lichtintensität vom Ambientlicht über GUI verändern:
    ambientLightFolder.add(ambientLight, 'intensity', 0, 20).name("Lichtintensität");
    ambientLightFolder.open();
}

function addLampLightMenu(){
    const lampLightFolder = gui.addFolder("Lampenlicht");
    lampLightFolder.add(lampLight, 'distance', 0, 10).name("Distanz");
    lampLightFolder.add(lampLight, 'intensity', 0, 90).name("Intensität");
    lampLightFolder.add(options, "spotLightSwitch").name("Lichtmodus").listen().onChange( onChangedSpotLightSwitch );
    lampLightFolder.add(options, "spotLightHelper").name("Helper").listen().onChange( onChangeSpotLightHelper );
    lampLightFolder.open();
}