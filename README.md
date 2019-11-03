# Template d'API NodeJS avec log et authentification

## Pour récupérer le code (sans avoir à cloner l'intégralité de ce git et son historique) :

Installer degit : `npm install -g degit`

Utiliser degit pour copier le dossier dans le dossier (vide) de destination souhaité : `degit victordelajarte/template_node_API`

Initialiser un nouveau projet git si souhaité : `git init`

## Avant le premier lancement :

Créer un fichier nodemon.json, y renseigner un objet "env" avec les clés suivantes (remplies avec les valeurs correspondantes évidemment) :

> MONGO_ATLAS_URL

> JWT_KEY

Puis lancer la commande suivante pour installer les modules node : `npm i`

## Au lancement :

`npm run dev` pour lancer via Nodemon en local
