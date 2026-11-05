# Routes boutique — fiche Trello 12

App garde le router-view par défaut et les deux accès globaux. `/shop` monte ShopView, qui conserve le titre, une navigation visiteur Login et son router-view nommé **shopmain**.

| URL | Vue dans shopmain | Paramètre |
|---|---|---|
| `/shop/home`, alias `/shop` | ShopHome | aucun |
| `/shop/login` | ShopLogin | aucun |
| `/shop/buy` | ShopBuy | aucun |
| `/shop/pay/:orderId?` | ShopPay | mapping explicite `orderId` → props `orderUuid` |
| `/shop/orders` | ShopOrders | aucun |

Le paramètre optionnel est un choix technique nécessaire au menu Payer sans commande présélectionnée. Le nom de segment orderId est celui de l'export ; sa valeur reste un UUID public, jamais un `_id`. Le mapping porte sur la vue nommée `shopmain`, pas une prop appliquée à la mauvaise vue. Passer d'un UUID à l'autre met à jour la prop sans recréer le cadre.

## Limites

Les composants destinations existent pour tester le routage. Les formulaires/actions métier, navigation conditionnelle et gardes privés seront implémentés par leurs fiches dédiées après acquisition des données. Une simple destination affichant son titre n'est pas déclarée comme un login, un achat, un historique ou un paiement fonctionnel. En particulier aucun paiement simplifié ne finalise de commande.

La page de contrôle `/tests/routes.html` vérifie les sept variantes d'URL, les deux vues alias, les emplacements, les deux modes de paramètre et sa mise à jour. Elle utilise une seule instance réellement montée du routeur et force la visite des alias équivalents, que Vue Router déduplique autrement. Les résultats s'affichent dans la page, sans framework ni dépendance de test. La route `/bank` conserve pour l'instant son accueil simple ; le shell bancaire de la fiche 41 dépend du vrai store bancaire.
