// Require :
const nedb = require('nedb');
const handlebars = require('handlebars');
const fs = require('fs');
const selectedCheckboxes = require('./generateTab');

// ------------------------------------------ Généré toutes les signatures pour tout les agents ----------------------------------------------

function generateAllSign() {

    // Connection a la BDD NeDB
    db = new nedb({ filename: "data.db", autoload: true });

    // Rechercher TOUTES les donnée présente dans la BDD NeDB
    db.find({}, (err, data) => {
    if (err) {
        console.error(err);
    } else {
        // Charger le template a remplir (template.hbs)
        const template = handlebars.compile(fs.readFileSync('template.hbs', 'utf8'));

        // Itérer sur les données et générer des fichiers HTML
        data.forEach(record => {
        // Remplir les champ record avec les données de la BDD 
        const html = template(record);

        // Appeller le chemin présent dans la BDD et ajouter le nom du fichier, exemple : (//C:/desktop/signature/francois.html)
        const cheminEtNomFichier = `${record.chemin}/${record.nom}-${record.prenom}.html`;
        // Enregistrer les fichiers html dans leurs chemins respectif avec leurs contenus respectif
        fs.writeFileSync(cheminEtNomFichier, html)
        });
    }});
    alert("les signature on étais envoyer a tout les agents ");
}