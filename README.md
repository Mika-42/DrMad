# DrMad

Projet pédagogique en JavaScript : Vue 3, Pinia, Vue Router, Vite, bcryptjs et CSS natif. Aucun TypeScript, Vuex, backend ou framework de tests ajouté.

## Démarrage

Dans le dossier du projet, avec Node.js 20.19+ ou une version LTS récente compatible avec Vite 7 :

```sh
npm ci
npm run dev
npm run build
```

Le serveur de développement utilise Vite. `npm run preview` sert le build pour une vérification locale. Le lockfile est versionné ; `node_modules` et `dist` sont générés et exclus de Git.

## État

Le socle démarre et compile. Les données métier officielles manquent : voir [l'audit des fixtures](docs/fixtures.md). Aucune donnée de substitution n'est livrée ; le démarrage du socle ne prouve pas le fonctionnement des parcours boutique/banque.

[Organisation des PR sans fusion automatique](docs/pull-requests.md).
