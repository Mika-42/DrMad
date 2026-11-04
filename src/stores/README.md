# Stores Pinia

Les futurs modules `shop.js` et `bank.js` gèrent respectivement l'utilisateur/panier boutique et le compte/transactions bancaires. Ils n'importent pas data.js : les actions passent par les services.

L'état sans session est distinct d'une erreur et d'un objet trouvé. Les actions ne publient un nouvel état qu'après un succès de service, nettoient les données périmées au changement de contexte, et renvoient les erreurs aux vues. Le logout bancaire n'efface pas l'utilisateur boutique et inversement. Les valeurs initiales des comptes et produits ne sont pas inventées en attendant les données officielles.
