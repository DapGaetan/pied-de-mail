const handlebars = require('handlebars');
const fs = require('fs');

// Lire le contenu du fichier "template.hbs" (le model de signature actuelement en vogue)
const templateContent = fs.readFileSync('template.hbs', 'utf8');

// Compilez le contenu du fichier avec Handlebars
const template = handlebars.compile(templateContent);

// Créer un objet contenant les informations par défaut (qui possède un champ dans le fichier .hbs)
const defaultData = {
  nom: "Michel",
  prenom: "Frigo",
  poste: "Frigo",
  endroit: "Rue Jean Monnet, 62490 Vitry-en-Artois",
  tel: "0676027923",
  adresse: "michel.frigo@cc-om.com"
};

// Obtenir le HTML généré avec les données par défaut de "defautltData"
const html = template(defaultData);
// Afficher un exemple de rendue du template de signature actuelle avec les info par defaut de l'objet "defaultData" 
document.getElementById('displaySign').innerHTML = html;