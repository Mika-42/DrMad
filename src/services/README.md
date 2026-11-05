# Façades de services

`shop.service.js` et `bankaccount.service.js` contiendront les méthodes publiques et leurs variantes `*FromLocalSource`. Chaque méthode publique appelle sa variante qui invoque `datasource/localsource.service.js`, puis renvoie l'enveloppe `{error,status,data}` entière.

Les vues n'importent pas data.js. Une vue utilise le store pour les états partagés, ou la façade pour une opération locale à la vue (création/lecture d'une commande). Aucune requête HTTP, bibliothèque réseau ni backend ne doit être ajouté. Les signatures métier seront fixées contre le vrai data.js ; aucune façade factice ne renvoie actuellement un faux succès.
