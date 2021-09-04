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

/* Erstellt ein Fensterobjekt aus der .obj-Datei */
function generateWindowObject(x, y, z, rotX, rotY, rotZ){
    var objLoader = new THREE.OBJLoader();
    objLoader.load("./objects/Window.obj", function(obj){
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

/*Erstellt ein neues Objekt als Tisch und stellt diesen in den Raum*/
//Schreibtisch Quelle: https://free3d.com/3d-model/wood-desk-93009.html
function generateDesk(){
    var objLoader = new THREE.OBJLoader();
    objLoader.load("./objects/Desk.obj", function(obj){
        //Tisch außen Farbe von Schränken
        var deskBaseMaterial = generatePhongMaterial(30, 16, 5);
        //Tischplattenfarbe
        var deskTopMaterial = generatePhongMaterial(107, 70, 0);
        //Durchlaufe alle Kindelemente und färbe...
        obj.traverse(function(child){
            //Tisch Schränke außen färben
            if( child.name.includes("Desk Base") || child.name.includes("Tiroir") ){
                child.material = deskBaseMaterial;
            } else{
                //Tischplatte und Schubladenknauf färben
                child.material = deskTopMaterial;
                child.material.map = generateTexture("wood.jpg");
            }
            //einzelne Tischelemente werfen Schatten
            child.castShadow = true;
        });
        obj.receiveShadow = true; //Der gesamte Tisch empfängt Schatten
        obj.scale.set(0.0075, 0.0075, 0.0075); //Tisch herunterskalieren
        obj.rotation.y = -Math.PI/2; //Drehung um PI/2 auf Y-Achse
        obj.position.x = 4.2; //Position auf der X-Achse
        obj.name = "Tisch"; //Objektnamen fetslegen
        scene.add(obj); //Tisch in die Scene einfügen
    });
}

/* erstellt das Lampen-Objekt */
function generateLamp(){
    var objLoader = new THREE.OBJLoader();
    objLoader.load("./objects/lamp.obj", function(obj){
        //Durchlaufe alle Kind-Objekte
        obj.traverse(function(child){

            //Färbe die Glühbirne ein:
            if( child.name.includes("bombilla") ){
                child.material = new THREE.MeshPhongMaterial({
                    color: "rgb(10, 10, 10)",
                    opacity: 0.15,
                    transparent: true
                });
            
            } else{
                child.material = generatePhongMaterial(100, 0, 0); //rote Farbe
            }
            

            //Bett empfängt und wirft Schatten
            child.receiveShadow = true;
            child.castShadow = true;
        });

        obj.scale.set(0.002, 0.002, 0.002);
        obj.rotation.y = Math.PI;
        obj.position.set(4.2, 1.55, 2);
        scene.add(obj);
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
        
        //obj.receiveShadow = true;

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

            //Bett empfängt und wirft Schatten
            child.receiveShadow = true;
            child.castShadow = true;
        });

        //Bett herunterskalieren
        obj.scale.set(0.0007, 0.0007, 0.0007);
        obj.position.set(-3.7, 0, 2.9);
        obj.rotation.y = Math.PI/2;
        scene.add(obj);

    });
}