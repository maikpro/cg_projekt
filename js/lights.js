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

//Lichter
let pointLight, ambientLight, lampLight;

/*initialisiert das Punktlicht*/
function initPointLight(){
    pointLight = new THREE.PointLight(0xffffff, 0.9);
    pointLight.castShadow = true; //Lichtquelle soll Schatten werfen
    pointLight.position.set(0, 5, 1);
    pointLight.visible = false;
    scene.add(pointLight);
}

/*initialisiert das Lampenlicht als Spotlight*/
function initLampLight(){
    //SpotLight(color, intensity, distance, angle)
    lampLight = new THREE.SpotLight(0xffffff, 3, 7, 90);
    lampLight.castShadow = true;
    lampLight.position.set(4.2, 2.3, 1.8);

    //Quelle: https://stackoverflow.com/questions/32203806/three-js-spotlight-orientation-direction-issue
    lampLight.target.position.set(4, 0, 0);
    scene.add(lampLight);

    //HELPER SPOTLIGHT: Zeichnet Hilfslinien für das Lampenlicht in den Raum.
    spotlightHelper = new THREE.SpotLightHelper(lampLight);
    spotlightHelper.visible = false;
    scene.add(spotlightHelper);
}

function initAmbientLight(){
    ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    ambientLight.position.set(0, 5, 0);
    scene.add(ambientLight);
}