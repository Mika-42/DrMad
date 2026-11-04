# Architecture et contrats — fiche Trello 3

```text
vue/composant → store Pinia (état partagé) → service public
vue (opération sans état partagé) ────────→ service public
service public → fonction FromLocalSource → localsource.service.js → data.js
```

- `src/main.js` installe Pinia et le routeur avant le montage de Vue.
- `src/router/index.js` compose les vues ; App conserve l'emplacement global, ShopView `shopmain`, BankView `bankmain`.
- `src/views` porte les scénarios. `src/components` porte les contrats génériques réutilisables.
- `src/stores/shop.js` et `bank.js` porteront leurs états séparés ; aucune mutation directe de la source depuis une vue/store.
- `src/services/shop.service.js` et `bankaccount.service.js` seront les façades du modèle local, pas des clients d'une API inventée.
- `src/datasource/localsource.service.js` sera le seul endroit où effectuer les mutations de la fausse BDD. Le vrai `data.js` n'est pas encore disponible : voir [l'audit](fixtures.md).
- `src/datasource/response.js` fournit `success(data)`, `failure(message,status,error)` et `cloneData(value)`. Le clonage JSON préserve le format documentaire des dates `{$date:...}`.

## Réponses

Succès : `{error:0,status:200,data:<copie de la valeur>}`. Erreur : `{error:entier positif,status:<code d'échec>,data:<message>}`. Le code d'erreur positif et le message ne doivent pas être perdus par les façades. La factory d'erreur propose 400/1 par défaut ; les fonctions métier fixeront les codes cohérents avec la source récupérée, sans prétendre que le cours a fixé un code absent.

Le JSON reçu par le front ne partage pas ses objets/tableaux imbriqués avec la source. Une mise à jour traverse une fonction de mutation dédiée ; modifier une copie de lecture n'est pas une persistance. Le stockage est en mémoire : recharger l'application réinitialise les ajouts. Il n'y a ni Mongoose, serveur, localStorage, API distante ou gestionnaire d'état alternatif.

## Validation

Les tests natifs Node de `tests/response.test.js` vérifient l'indépendance des copies imbriquées et les enveloppes. Ils n'ajoutent aucun framework ni package de test. Le chemin métier complet reste non exécuté tant que data.js manque ; les noms de dossiers réservés ne sont pas présentés comme des fonctions implémentées.
