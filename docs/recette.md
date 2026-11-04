# Protocole de recette et définition de terminé — fiche Trello 5

## Préconditions et méthode

Utiliser les données officielles, sans remplacer produits, comptes, prix ou hashes. Noter le commit, les versions Node/npm, le navigateur, les utilisateurs/comptes de recette et les valeurs initiales. Un rechargement restaure la source initiale en mémoire : isoler les scénarios qui mutent les données et noter leur ordre. Ne pas modifier la source pour fabriquer un résultat réussi.

Lancer `npm ci`, `npm run dev`, vérifier les résultats dans le navigateur et la console. `npm run build` complète les vérifications, mais une compilation seule ne prouve pas les parcours. Les tests JS natifs peuvent se lancer avec `node --test --test-isolation=none tests/*.test.js`, sans package de test. Les contrôles de composants purement visuels utilisent le navigateur, pas des transactions inventées dans data.js.

Pour chaque cas, consigner **préconditions, action, attendu, observé, statut, preuve**. Statuts distincts : réussi, échec, non exécuté, bloqué par prérequis. Une case reste décochée si non exécutée. Un écran temporaire ou un bouton désactivé faute d'implémentation n'est pas une réussite métier.

## Scénarios

| Cas | Préconditions / action | Résultat attendu | État initial de recette |
|---|---|---|---|
| Accueil global | Ouvrir `/` | Bienvenue, Boutique et Banque | À vérifier à la fiche navigation |
| Routage | Passer global → boutique → banque | Bon contenu, cadres et vues nommées préservés | À vérifier |
| Login nominal | Utilisateur réel, bon mot de passe | Session, panier propre, redirection acheter | Bloqué : fixtures |
| Login refusé | Mauvais login ou mot de passe | Dialogue, aucune session/panier précédent | Bloqué : fixtures |
| URLs privées | Sans session, ouvrir un achat/compte privé | Accès contrôlé et aucun état périmé | À vérifier avec gardes |
| Catalogue | Activer prix, nom, stock seuls puis ensemble | Intersection correcte, prix strictement inférieur, sous-chaîne et stock | Bloqué : catalogue |
| Filtre désactivé | Garder un seuil restrictif puis décocher | Aucune restriction de ce filtre | Bloqué : catalogue |
| Sélection filtrée | Sélectionner puis masquer/réafficher un item | Aucun décalage, item masqué purgé | Contrôle générique possible |
| Quantités | Vide, 0, négatif, fraction, non fini puis entier positif | Invalides refusés, quantité de la bonne ligne émise | Contrôle générique possible |
| Panier individuel | Ajouter deux fois le même produit | Une ligne, quantité cumulée | Bloqué : source |
| Panier groupé | Sélectionner plusieurs articles/quantités puis ajouter | Bons items, bonnes quantités, désélection | Bloqué : source |
| Supprimer/vider | Supprimer une ligne puis vider | Source et store cohérents, pas de sélection exigée pour vider | Bloqué : source |
| Session A/B/A | Ajouter dans A, logout, B, puis A | Deux paniers isolés ; A restauré depuis mémoire source | Bloqué : source |
| Promotions | Sous seuil, au seuil, au-delà, plusieurs paliers | Même formule confirmée panier et commande | Bloqué : règle absente |
| Création commande | Panier courant non vide, créer | Snapshot, date, UUID, waiting_payment ; vider seulement après succès | Bloqué : source |
| Création refusée | Panier invalide ou erreur service | Panier conservé, erreur visible | Bloqué : source |
| Historique commandes | Propriétaire puis autre utilisateur | Seulement ses commandes, copies indépendantes | Bloqué : source |
| Annulation | Commande en attente puis déjà finale | Première annule, seconde refuse sans mutation | Bloqué : source |
| Sélection compte | Numéro réel puis saisie invalide | Solde correct puis aucune information fausse/périmée | Bloqué : source |
| Retrait | Montant positif puis invalide | Débit et nouveau solde ; échec sans mutation | Bloqué : source |
| Virement | Deux comptes réels | Deux écritures, même date, UUID distincts, soldes opposés | Bloqué : source |
| Virement refusé | Source/destinataire inconnu | Aucun solde ni transaction partiellement modifié | Bloqué : source |
| Message opération | Opération valide | UUID débit visible 5 secondes puis effacé | Bloqué : opération |
| Solde | Cas positif/négatif réel | Champ readonly vert/rouge via scoped-slot | Contrôle de slot possible |
| Historique bancaire | Compte source puis destinataire | Débits S/crédits D, plus récents d'abord | Bloqué : source |
| Période | Du seul, Au seul, deux dates, dates égales | Borne(s) inclusive(s), tri préservé | Contrôle générique possible |
| Bornes inversées | Saisir Au<Du puis Du>Au | Seule la borne nouvellement invalide est vidée | Contrôle générique possible |
| Détails/Voir | Cliquer une ligne, sélectionner plusieurs | UUID exact(s), jamais d'index ou de ligne masquée | Contrôle générique possible |
| Paiement valide | Commande T et débit -T vers boutique | Finalized, historique rafraîchi, aucun double débit | Bloqué : source |
| Paiement refusé | Mauvaise somme/destination, crédit +T, UUID inconnu | Commande reste en attente, erreur visible | Bloqué : source |
| Statut final | Payer/annuler une commande déjà finale | Refus sans changement de statut | Bloqué : source |
| Logout banque | Cliquer Déconnexion | Message, 1 seconde puis purge et accueil, session boutique intacte | Bloqué : store |
| Rechargement | Mutations en mémoire puis reload complet | Retour aux données initiales ; aucune persistance durable promise | Bloqué : source |
| Livraison | Extraire archive sans node_modules puis installer/build | Projet reproductible avec les seuls outils prescrits | À effectuer en fin de projet |

## Définition commune de terminé

- Contrat de la fiche, props/events/slots et retours de service documentés et conformes.
- Cas nominal, erreurs et limites exécutés ; aucun faux succès, mutation partielle ou donnée périmée.
- Clone aux lectures et passage par services/stores, sans mutation des réponses dans les vues.
- Interfaces réactives, route et paramètres corrects, console sans erreur JavaScript.
- Uniquement Vue3, Pinia, Vue Router, Vite, bcryptjs et JavaScript/CSS natifs. Aucun TypeScript, Vuex, serveur ou package additionnel.
- Build réussi et recette pertinente passée ; limitations et tests non exécutés déclarés.
- Une branche/PR pour la fiche ; aucune fusion automatique. L'indisponibilité d'écriture GitHub ne vaut pas création de PR.

La recette globale n'a pas encore été exécutée. Ce protocole rend les validations futures reproductibles, il ne coche pas les critères métier en l'absence de leurs prérequis.
