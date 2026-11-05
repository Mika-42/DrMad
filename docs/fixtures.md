# Audit des données officielles — fiche Trello 1

Le dépôt au commit de départ `3e312b30384b9c72702a9db506a9be355e454b84` ne contient qu'un README. Aucun TP1, `src`, `data.js`, archive ou jeu de données réel n'est présent dans les sept pièces de cours (six PDF et une vidéo).

## Ressource officielle retrouvée et blocage

L'annotation du PDF « TP n°2 : DrMad's first steps — solution », page 2, donne le lien authentique :

<https://cours-info.iut-bm.univ-fcomte.fr/upload/supports/S3/Vuejs/TP/tp2/vuejs-tp2-solus.tgz>

Le sujet annonce une archive contenant uniquement `src`. Les tentatives HTTPS, avec le proxy existant et la vérification TLS conservée, reçoivent HTTP 403 ; le diagnostic montre un tunnel CONNECT refusé par le proxy. La page officielle est également refusée. Cela ne prouve pas l'absence de l'archive. Aucun contournement réseau ni extraction de données tierces n'a été effectué. Les PDF ne contiennent aucun fichier embarqué.

Pour lever le blocage, fournir cette archive, le starter TP1 ou son vrai `datasource/data.js`, ou rétablir l'accès du proxy au domaine officiel. Aucun secret n'est nécessaire à inventer ou saisir dans le code.

## Connaissances documentaires, non inventaire vérifié

| Domaine | Contrat décrit par les sujets | Vérification sur données réelles |
|---|---|---|
| Utilisateurs | collection appelée `shopuser`, login, mot de passe haché, basket, orders | Bloquée : exports, IDs et hashes absents |
| Catalogue | objets produits avec name, price, promotion et référence d'item | Bloquée : nom d'export, stock, valeurs et promotions absents |
| Panier | `{items:[{item:<_id produit>,amount:<quantité>}]}` | Schéma documentaire uniquement |
| Commande | items complets, date, total, status, uuid | Commande initiale drmad non disponible |
| Banque | `bankaccounts`, `_id`, `number`, clé réelle du solde à relever | Numéros et soldes initiaux inconnus |
| Transactions | `transactions`, uuid, account, amount, `date:{$date:...}`, destination éventuelle | Écritures réelles absentes |

Références certaines : `account` et `destination` sont des `_id` de compte, jamais `number` ; le compte boutique est `65d721c44399ae9c8321832c` (TP5 p3). TP4 p5 donne `drmad/drmad`, mais son utilisateur et son hash bcrypt restent à vérifier. Ces éléments documentaires ne justifient pas de créer des enregistrements.

## Contrôles à effectuer dès réception

- Relever les exports réels et le schéma de chaque collection sans les renommer arbitrairement.
- Vérifier l'existence du compte boutique et son numéro public.
- Vérifier `bcrypt.compareSync` pour l'utilisateur de démonstration ; ne pas substituer un mot de passe clair.
- Relever les promotions et leur règle exacte, les prix et l'unité monétaire, les stocks et états de vente.
- Vérifier les références produits/paniers, comptes/transactions, dates imbriquées et commande initiale.
- Confirmer que les lectures renvoient des clones et que la persistance reste en mémoire, perdue au rechargement.

L'audit est documenté ; les validations dépendant des vraies données restent non exécutées. Aucun `data.js` artificiel ni aucune fixture de remplacement n'est livré. Les composants génériques, le socle et les routes peuvent avancer indépendamment.
