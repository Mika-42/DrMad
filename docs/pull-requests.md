# Organisation des PR

Source de travail : [tableau Trello DrMad](https://trello.com/b/WUuoZaCD/drmad), export JSON fourni, 57 fiches. L'export est une spécification ; il ne prouve pas que les tâches sont réalisées. Les 48 fiches préparatoires précédentes ne remplacent pas cet export.

Une branche et une PR distinctes sont créées pour chaque fiche réalisable, dans l'ordre de ses dépendances. Les PR sont **empilées** : chaque PR cible la branche de la précédente, la première cible main. Le diff de chaque PR correspond ainsi à une seule fiche. Aucune PR n'est fusionnée automatiquement et main reste inchangée.

Les dépendances textuelles erronées sont résolues par les contrats réels : le store précède la navigation qui le consomme, le paiement final suit les services bancaires, et le filtre d'historique ne peut dépendre de lui-même. Une validation bloquée ou non exécutée est nommée explicitement dans la PR ; elle n'est jamais cochée comme réussie.

La remise et le courriel de la fiche 53 feront l'objet d'une préparation documentaire ; leur mention dans l'export n'autorise pas un envoi automatique à l'enseignant. Les bonus seront traités après conformité du périmètre obligatoire. Aucune nouvelle technologie ni TypeScript n'est introduit.
