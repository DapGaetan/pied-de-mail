
const fs = require('fs');

const fileInput = document.getElementById('fileInput');
const submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', (event) => {
  event.preventDefault(); // empêche le rechargement de la page
  const file = fileInput.files[0]; // récupère le premier fichier sélectionné
  const destination = "C://Users/gaetan.dapvril/Desktop/signature versions/Signature v8"; // chemin de la racine de l'application
  fs.copyFile(file.path, `${destination}/${file.name}`, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Fichier copié avec succès dans la racine de l\'application');
    }
  });
});