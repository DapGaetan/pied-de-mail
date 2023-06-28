    // Récupérer la valeur du trieur pour la donner au "db.find" et qu'il nous retourne le tableau selectionner
    function getSelectValue() {
        var selectedValue = document.getElementById('list').value;
        console.log(selectedValue);

        return selectedValue;
    }
    // Nomée le tableau afficher comme suit : Tableau "Nom du service afficher"
    function nameTab() {
        var services = "Général"

        switch (getSelectValue()) {
            case "0":
                services = "Géneral"
                break;
            case "1":
                services = "Service Informatique"
                break;
            case "2":
                services = "Service Comptabilité"
                break;
            case "3":
                services = "Service Voirie"
                break;
            case "4":
                services = "Service Batiment"
                break;
            default:
                services = "Service Général"
        }
        var titleTable = document.getElementById("titleTable");
        titleTable.innerHTML = ("Tableau " + services)
    }
    // Génération du tableau sans triage et ses fonctionnalités
    function displayTab() {
        $(() => {
            // ----------------------------------Requires----------------------------------------------------------------------------------------------------
            var Datastore = require('nedb');
            // -----------------------------Rendre le bouton invisible-----------------
            document.getElementById("sendIfCheck").classList.add("hide");
            // ------------------------------------------------------------------------

            // Charger la BDD
            db = new Datastore({
                filename: "data.db",
                autoload: true
            });

            // Récupérer le contenu de la base de donnée
            db.find({}, function (err, docs) {
                console.log("*** docs = ", docs);

                var tableRegistre = document.getElementById("tableRegistre");
                var tableRows = tableRegistre.querySelectorAll("thead > tr");

                // On supprime le contenu du tableau
                tableRows.forEach((el, i) => {
                    if (i > 0)
                        el.parentNode.removeChild(el);
                });

                // On construit le contenu du tableau
                docs.forEach((el) => {
                    // Création d'une ligne
                    var row = tableRegistre.insertRow(1);
                    // Création des cellules
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    var cell7 = row.insertCell(6);
                    var cell8 = row.insertCell(7);
                    var cell9 = row.insertCell(8);
                    // Injecter le contenu des cellules
                    cell1.innerHTML = '<input type="checkbox" id="' + el._id + '">';
                    cell2.innerHTML = el.nom;
                    cell3.innerHTML = el.prenom;
                    cell4.innerHTML = el.adresse;
                    cell5.innerHTML = el.poste;
                    cell6.innerHTML = el.endroit;
                    cell7.innerHTML = el.tel;
                    cell8.innerHTML = el.chemin;
                    cell9.innerHTML = '<button id="' + el.service + '" class="btn-trash"><i class="fa-solid fa-trash"></i></button>';

                    // Supprimer une ligne de la bdd et du tableau en appuyant sur le bouton rouge trash
                    var btn = document.getElementById(el.service);
                    btn.addEventListener('click', () => {
                        // Poser la question etes vous sur puis confirmer ou annuler :
                        if (confirm("Etes-vous sur de vouloir supprimer définitivement " + el.nom + " " + el.prenom + " de la base de donnée ?") == true) {
                            console.log("*** Demande de supp de ", el._id);
                            db.remove({
                                nom: el.nom
                            }, function (err, nbRemoved) {
                                if (err != null) {
                                    console.log("*** err = ", err);
                                }
                                window.location.reload(true)
                                console.log(nbRemoved + " lines removed !");
                            })
                            alert(el.nom + " " + el.prenom + " Ne fait plus parti de la base de donnée et la sentence est irrévocable !")
                        } else {
                            alert("Aucun agents n'a était supprimer de la base de donnée")
                        }
                    });

                    // Créer un tableau vide pour stocker les ID des utilisateurs cochés
                    let usersChecked = [];

                    // Sélectionner toutes les cases à cocher dans la table
                    let checkboxes = document.querySelectorAll('input[type="checkbox"]');

                    // Ajouter un écouteur d'événements "change" à chaque case à cocher
                    checkboxes.forEach(function (checkbox) {
                        checkbox.addEventListener('change', function () {

                            if (this.checked) {
                                // Si la case est cochée, ajouter l'ID de l'utilisateur au tableau
                                usersChecked.push(this.id);

                                document.getElementById("sendIfCheck").classList.remove("hide");
                            } else {
                                // Si la case est décochée, supprimer l'ID de l'utilisateur du tableau
                                let index = usersChecked.indexOf(this.id);
                                if (index !== -1) {
                                    usersChecked.splice(index, 1);
                                }
                                do {
                                    document.getElementById("sendIfCheck").classList.add("hide");
                                    console.log('le tableau est vide')
                                } while (checkboxes.checked === 0)
                            }


                            // Si aucune case n'est cochée, exécuter le code

                            // Afficher le tableau des utilisateurs cochés dans la console pour vérification
                            console.log(usersChecked);
                        });
                    });

                    var send = document.getElementById("sendIfCheck")
                    send.addEventListener('click', () => {
                        let task = false;
                        let taskPromise = new Promise(function (resolve, reject) {
                            if (!task) {
                                console.log("Action effectuée !");
                                task = true;

                                // function generateOneSign() {
                                console.log(usersChecked.id)
                                // Connection a la BDD NeDB
                                db = new nedb({
                                    filename: "data.db",
                                    autoload: true
                                });

                                usersChecked.forEach(function (user) {
                                    // Rechercher TOUTES les donnée présente dans la BDD NeDB
                                    db.find({
                                        _id: {
                                            $in: usersChecked
                                        }
                                    }, (err, data) => {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            // Charger le template a remplir (template.hbs)
                                            const template = handlebars.compile(fs.readFileSync('template.hbs', 'utf8'));

                                            // Itérer sur les données et générer des fichiers HTML
                                            data.forEach(record => {
                                                // Remplir les champ record avec les données de la BDD 
                                                const htm = template(record);

                                                // Appeller le chemin présent dans la BDD et ajouter le nom du fichier, exemple : (//C:/desktop/signature/francois.html)
                                                const directory = `${record.chemin}/${record.nom}-${record.prenom} (${record.adresse}).htm`;
                                                // Enregistrer les fichiers html dans leurs chemins respectif avec leurs contenus respectif
                                                fs.writeFileSync(directory, htm)

                                                alert("les signature on étais envoyer a " + `${record.nom}` && `${record.prenom}`);

                                            });
                                        }
                                    });
                                })

                                resolve();
                            } else {
                                reject("L'action a déjà été effectuée !");
                            }
                        });

                        taskPromise.then(function () {
                            console.log("La promesse a été résolue avec succès !");
                        }).catch(function (erreur) {
                            console.log("La promesse a échoué : " + erreur);
                        });
                    });

                })
            })
        });
    }

    // Génération des tableau trier par services et leurs fonctionnalités
    function displayTabTrie() {
        console.log("la valeur du tieur est égal a " + getSelectValue())

        if (getSelectValue() == 0) {
            displayTab()
            nameTab()
        } else {
            nameTab()


            $(() => {
                // ----------------------------------Requires------------------------------
                var Datastore = require('nedb');
                // --------Rendre le bouton génération par choix invisible par défaut------
                document.getElementById("sendIfCheck").classList.add("hide");
                // ------------------------------------------------------------------------

                // Charger la BDD
                db = new Datastore({
                    filename: "data.db",
                    autoload: true
                });

                // Récupérer le contenu de la base de donnée en fonction du choix exprimé dans le trieur
                db.find({
                    service: getSelectValue()
                }, function (err, docs) {
                    console.log("*** docs = ", docs);

                    var tableRegistre = document.getElementById("tableRegistre");
                    var tableRows = tableRegistre.querySelectorAll("thead > tr");

                    // On supprime le contenu du tableau
                    tableRows.forEach((el, i) => {
                        if (i > 0)
                            el.parentNode.removeChild(el);
                    });

                    // On construit le contenu du tableau
                    docs.forEach((el) => {
                        // Création d'une ligne
                        var row = tableRegistre.insertRow(1);
                        // Création des cellules
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        var cell6 = row.insertCell(5);
                        var cell7 = row.insertCell(6);
                        var cell8 = row.insertCell(7);
                        var cell9 = row.insertCell(8);
                        // Injecter le contenu des cellules
                        cell1.innerHTML = '<input type="checkbox" name="personne" id="' + el._id + '">';
                        cell2.innerHTML = el.nom;
                        cell3.innerHTML = el.prenom;
                        cell4.innerHTML = el.adresse;
                        cell5.innerHTML = el.poste;
                        cell6.innerHTML = el.endroit;
                        cell7.innerHTML = el.tel;
                        cell8.innerHTML = el.chemin;
                        cell9.innerHTML = '<button id="' + el.service + '" class="btn-trash"><i class="fa-solid fa-trash"></i></button>';

                        // Supprimer une ligne de la bdd et du tableau en appuyant sur le bouton rouge trash
                        var btn = document.getElementById(el.service);
                        btn.addEventListener('click', () => {
                            // Poser la question etes vous sur puis confirmer ou annuler :
                            if (confirm("Etes-vous sur de vouloir supprimer définitivement " + el.nom + " " + el.prenom + " de la base de donnée ?") == true) {
                                console.log("*** Demande de supp de ", el._id);
                                db.remove({
                                    nom: el.nom
                                }, function (err, nbRemoved) {
                                    if (err != null) {
                                        console.log("*** err = ", err);
                                    }
                                    window.location.reload(true)
                                    console.log(nbRemoved + " lines removed !");
                                })
                                alert(el.nom + " " + el.prenom + " Ne fait plus parti de la base de donnée et la sentence est irrévocable !")
                            } else {
                                alert("Aucun agents n'a était supprimer de la base de donnée")
                            }
                        });
                        // Créer un tableau vide pour stocker les ID des utilisateurs cochés
                        let usersChecked = [];

                        // Sélectionner toutes les cases à cocher dans la table
                        let checkboxes = document.querySelectorAll('input[type="checkbox"]');

                        // Ajouter un écouteur d'événements "change" à chaque case à cocher
                        checkboxes.forEach(function (checkbox) {
                            checkbox.addEventListener('change', function () {

                                if (this.checked) {
                                    // Si la case est cochée, ajouter l'ID de l'utilisateur au tableau
                                    usersChecked.push(this.id);

                                    document.getElementById("sendIfCheck").classList.remove("hide");
                                } else {
                                    // Si la case est décochée, supprimer l'ID de l'utilisateur du tableau
                                    let index = usersChecked.indexOf(this.id);
                                    if (index !== -1) {
                                        usersChecked.splice(index, 1);
                                    }
                                    do {
                                        document.getElementById("sendIfCheck").classList.add("hide");
                                        console.log('le tableau est vide')
                                    } while (checkboxes.checked === 0)
                                }


                                // Si aucune case n'est cochée, exécuter le code

                                // Afficher le tableau des utilisateurs cochés dans la console pour vérification
                                console.log(usersChecked);
                            });
                        });

                        var send = document.getElementById("sendIfCheck")
                        send.addEventListener('click', () => {
                            let task = false;
                            let taskPromise = new Promise(function (resolve, reject) {
                                if (!task) {
                                    console.log("Action effectuée !");
                                    task = true;

                                    // function generateOneSign() {
                                    console.log(usersChecked.id)
                                    // Connection a la BDD NeDB
                                    db = new nedb({
                                        filename: "data.db",
                                        autoload: true
                                    });

                                    usersChecked.forEach(function (user) {
                                        // Rechercher TOUTES les donnée présente dans la BDD NeDB
                                        db.find({
                                            _id: {
                                                $in: usersChecked
                                            }
                                        }, (err, data) => {
                                            if (err) {
                                                console.error(err);
                                            } else {
                                                // Charger le template a remplir (template.hbs)
                                                const template = handlebars.compile(fs.readFileSync('template.hbs', 'utf8'));

                                                // Itérer sur les données et générer des fichiers HTML
                                                data.forEach(record => {
                                                    // Remplir les champ record avec les données de la BDD 
                                                    const htm = template(record);

                                                    // Appeller le chemin présent dans la BDD et ajouter le nom du fichier, exemple : (//C:/desktop/signature/francois.html)
                                                    const directory = `${record.chemin}/${record.nom}-${record.prenom} (${record.adresse}).htm`;
                                                    // Enregistrer les fichiers html dans leurs chemins respectif avec leurs contenus respectif
                                                    fs.writeFileSync(directory, htm)

                                                    alert("les signature on étais envoyer a " + `${record.nom}` && `${record.prenom}`);

                                                });
                                            }
                                        });
                                    })

                                    resolve();
                                } else {
                                    reject("L'action a déjà été effectuée !");
                                }
                            });

                            taskPromise.then(function () {
                                console.log("La promesse a été résolue avec succès !");
                            }).catch(function (erreur) {
                                console.log("La promesse a échoué : " + erreur);
                            });
                        });

                    })
                })
            })
        }
    }
    // Afficher le tableau générale au chargement de la page
    displayTab()