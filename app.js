const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

const reduceBtn = document.getElementById("reduceBtn");
const sizeBtn = document.getElementById("sizeBtn");
const closeBtn = document.getElementById("closeBtn");

reduceBtn.addEventListener("click", () =>{
    ipc.send("reduceApp")
})
sizeBtn.addEventListener("click", () =>{
    ipc.send("sizeApp")
})
closeBtn.addEventListener("click", () =>{
    ipc.send("closeApp")
})

// Gestion ajout ligne dans registre + Prépa BDD
const btnAddLigne = document.getElementById("btnSaveLigne");
if(btnAddLigne != null){
    btnAddLigne.addEventListener('click', () => {
        // Les inputs du formulaire ajout d'une ligne
        const nomVal = document.getElementById("nomLigne");
        const prenomVal = document.getElementById("prenomLigne");
        const posteVal = document.getElementById("posteLigne");
        const serviceVal = document.getElementById("serviceLigne")
        const endroitVal = document.getElementById("endroitLigne")
        const telVal = document.getElementById("telLigne")
        const adresseVal = document.getElementById("adresseLigne");
        const cheminVal = document.getElementById("cheminLigne");
        // Préparer l'objet pour l'insert BDD
        var _myrec = {
            nom: nomVal.value,
            prenom: prenomVal.value,
            adresse: adresseVal.value,
            poste: posteVal.value,
            service: serviceVal.value,
            endroit: endroitVal.value,
            tel: telVal.value,
            chemin: cheminVal.value,
        };
        ipc.send("addLigneToDb", _myrec);
    })
}

// -------------------------------------------------------------------------------------------------------------------------------------
