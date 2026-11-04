# Modèle et invariants — fiche Trello 4

Ce document décrit les contrats prescrits par TP4/TP5, pas un inventaire des fixtures. Les clés et exemples effectifs restent à relever depuis le vrai `data.js` ([blocage](fixtures.md)). Aucun champ de solde supposé ni exemple artificiel n'est introduit dans l'application.

## Références et objets

| Objet | Contrat documentaire | Invariant |
|---|---|---|
| Utilisateur boutique | identité, login, hash, `basket`, `orders` | L'utilisateur courant et ses copies sont distincts de la source ; changer d'utilisateur ne montre pas le panier précédent. |
| Produit | `_id`, `name`, `description`, `price`, `promotion`, `object` selon la source | `stock` et état de vente sont à relever réellement, pas à déduire de l'affichage. |
| Panier | `{items:[{item:<_id>,amount:<nombre>}]}` | Vide = `{items:[]}` ; un produit n'a qu'une entrée dont l'ajout augmente la quantité. |
| Commande | `{items:[{item:{name,description,price,promotion,object},amount}],date,total,status,uuid}` | Les produits sont des snapshots complets, pas seulement leurs IDs. Le panier transmis est celui du front à l'instant du clic. |
| Compte | `_id`, `number`, champ de solde réel inconnu | Le numéro public n'est ni `_id` ni un UUID de transaction. |
| Transaction | `{uuid,account,amount,date:{$date:<ISO>},destination?}` | `account` et `destination` réfèrent des `_id` de comptes. |

Les types primitifs exacts des `_id` et champs hérités doivent être vérifiés. Ne pas importer Mongoose parce qu'un sujet illustre sa syntaxe. La source est une fausse BDD en mémoire ; elle n'est pas persistée dans un serveur ou dans le navigateur.

## Commandes et transitions

Création → `waiting_payment`. Seules les commandes en attente peuvent devenir `cancelled` ou `finalized`. Les états finaux ne retournent pas en attente et le propriétaire est contrôlé à chaque accès/mutation. La lecture sans commande retourne `[]` et renvoie des clones si des commandes existent.

Le paiement doit trouver la commande de l'utilisateur et une transaction existante dont le montant est **exactement `-order.total`**, avec `destination === '65d721c44399ae9c8321832c'`. Un crédit positif, un retrait sans destination, un mauvais destinataire, une mauvaise somme ou un UUID inconnu ne paient rien. La vérification ne fait aucun mouvement bancaire supplémentaire. Le sujet ne définit pas une identité commune client/compte ni la consommation unique d'un UUID : ne pas inventer ces règles.

## Banque

Un retrait crée un débit (montant négatif) et diminue le solde. Un virement crée un débit source avec destination et un crédit destinataire sans destination : même date, UUID distincts, montants opposés. Sa réponse porte l'UUID du **débit** et le **nouveau solde source**, pas le montant saisi. Les comptes et montants doivent être validés avant toute mutation ; une erreur ne laisse pas une écriture ou un solde partiellement modifié.

Les règles de découvert et d'auto-virement seront confirmées depuis la source. Les PDF prévoient un solde négatif en rouge : aucun refus systématique pour insuffisance de provision n'est ajouté sans contrat réel. Le relevé lit les transactions dont `account` est le compte courant : le crédit propre au destinataire représente déjà son virement entrant, sans ajouter aussi le débit d'un tiers.

## Montants, dates et UUID

Quantités d'achat entières strictement positives ; montants d'opération numériques finis strictement positifs, selon les fiches de l'export. Unité monétaire, précision, paliers/cumul et formule de promotion restent à confirmer : `promotion:[{discount,amount}]` ne définit pas à lui seul un algorithme. Ne pas convertir durablement les montants ni appliquer une remise arbitraire. Le total panier, le total snapshot et le montant vérifié doivent suivre la même convention.

Lire la date réelle via `date.$date` et non `date.date` (coquille du TP5). Préserver la même enveloppe à la création. Les comparaisons et le tri utilisent un instant, jamais le texte formaté. Le format TP2 est `MM/JJ/AAAA at HH:MM:SS` ; le fuseau reste à documenter. Pour des filtres de jours, convention proposée : bornes inclusives, toute la journée Au comprise.

Utiliser un UUID nouveau pour chaque commande/débit/crédit, avec l'API native JavaScript plutôt qu'un package supplémentaire ; ne pas confondre UUID public et `_id` de référence. Les lectures sont indépendantes grâce au clonage, les mutations traversent la source locale.

## État de validation

Les invariants et ambiguïtés documentaires sont consignés. Exemples numériques, hash, export exact et clé réelle du solde : **non vérifiés**, dépendants de la source officielle. Ces points ne sont pas déclarés terminés par la seule présence de ce document.
