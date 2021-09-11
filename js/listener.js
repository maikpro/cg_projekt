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

/*Wenn Größe Browserfensters sich verändert berechne das Bild neu: */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

/*Reagiere auf Keyboard-Eingaben vom Nutzer in diesem Fall bewege den Stuhl in X oder Z Richtung*/
function onKeyboardInteraction(event) {
    var stuhl = scene.getObjectByName("Stuhl");//Stuhl bewegen
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

/*schaltet Punktlicht an und aus -> Trigger über GUI möglich*/
function onChangedPointLightSwitch(){
    //Schalte das Punktlicht an, wenn die Checkbox in der GUI gesetzt ist.
    pointLight.visible = !pointLight.visible;
}

function onChangedSpotLightSwitch(){
    lampLight.visible = !lampLight.visible;
}

/*schaltet SpotlightHelper an und aus -> Trigger über GUI möglich*/
function onChangeSpotLightHelper(){
    spotlightHelper.visible = !spotlightHelper.visible;
}