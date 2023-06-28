const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ipc = ipcMain;
const fs = require('fs')
// ------------------------------------------------------

// Crée une fenêtre
function createWindow() {
    const win = new BrowserWindow({
        width: 1920, // largeur
        height: 1080, // hauteur
        minWidth: 600, // largeur minimal
        minHeight: 900, // hauteur minimal
        closable: true, // définir si la fenetre peut etre fermer
        darkTheme: false, // définir lapplication en darkmode
        frame: false, // enlever la barre d'outils (supprime aussi les boutons redimenssioner et quitter natif du system d'exploitation)
        icon: path.join(__dirname, 'ico/ico.ico'), // mettre une icones a notre logiciel (barre de taches et EXE) (__dirname = chemin actuel du dossier)
        webPreferences: {
            nodeIntegration: true, // empécher l'ajout de nouveau module npm
            experimentalFeatures: true, // active l'import et l'export de modules
            contextIsolation: false, // empécher les information qui transit via internet de pénétrer sur l'application
            devTools: true, // autoriser l'affichage de la console developpeur de chrome
            preload: path.join(__dirname, "preload.js")
        },
    });
    win.loadFile("index.html");
    win.webContents.openDevTools(); //afficher la console developpeur de chrome

    //  Gestion des demandes IPC
    // Top menu
    ipc.on("reduceApp", () => {
    win.minimize();
    });
    ipc.on("sizeApp", () => {
        if(win.isMaximized()){
            win.restore();
        }
        else{
            win.maximize();
        }
        });
        ipc.on("closeApp", () => {
            win.close();
            });

    //  Manipulation de la base de donnée
    ipc.on("addLigneToDb", (e, data) => {
        var Datastore = require("nedb"),
            db = new Datastore({filename: "data.db",autoload: true});
            
            db.insert(data, function(err, newrec){
                if(err != null){
                    console.log("*** err = ", err)
                }
                console.log("*** created = ", newrec)
                win.reload();
            })
    });
}
    // Fin de la manipulation de la base de donnée

// quand electron est prêt !
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    });
});

// Gestion de la fermeture de toutes les fenêtres
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){  // si ce n'est pas un darwin(win,linux) donc un mac alors ferme l'applis lors du clique sur la croix
        app.quit()
    }
});
