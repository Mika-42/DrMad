# Sélection filtrée — fiche Trello 10

`useFilteredSelection(visibleItems)` est un composable Vue créé **dans le parent** de CheckedList. `visibleItems` accepte une ref, une computed ou un getter retournant la liste affichée. Il ne connaît pas les virus ni les paniers.

- `selected` conserve les `_id` lorsqu'ils existent, sinon les UUID présents (par exemple une transaction), sinon les références brutes d'objets uniques. La shallowRef évite de mélanger les proxies Vue avec les identités brutes. Aucune sélection par position affichée n'est conservée durablement.
- `checked` est recalculé dans l'ordre courant pour la prop CheckedList ; sa longueur est celle de la liste affichée.
- `toggle(index)` reçoit `checked-changed` et retrouve l'identité de la ligne affichée. Les indices hors liste sont ignorés.
- Un changement de liste purge les identités invisibles au cycle de mise à jour Vue. Le traitement est regroupé pour ne pas confondre les états intermédiaires d'un tri en place avec un filtre réel. Réafficher un élément après un rendu filtré ne le resélectionne pas.
- `selectedItems` fournit les objets visibles actuellement cochés.
- Après un ajout groupé réussi, `clearItems(objetsAjoutés)` désélectionne les objets réellement envoyés même si le filtre a changé pendant l'opération ; `clear()` vide tout. Un échec métier ne doit pas être présenté comme un ajout réussi.

Les objets sans `_id` ni UUID doivent conserver leur référence pour une identité stable ; une copie sans clé n'est pas supposée représenter le même item. Le composable n'écrit dans aucune prop, source locale ou objet métier.

Les tests natifs vérifient filtrage, purge, restauration, tri, renouvellement d'objets avec `_id`, indices invalides et vidage. L'intégration réelle au catalogue sera effectuée à la fiche ItemsList après acquisition des produits officiels ; elle n'est pas déclarée exécutée par ces tests génériques.
