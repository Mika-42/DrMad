import { computed, shallowRef, toRaw, toValue, watch } from 'vue'

/**
 * À créer dans le parent de CheckedList/DataTable, avec ref/computed/getter de
 * la liste affichée. selected contient _id, puis uuid s'il existe, sinon les
 * références brutes. Les indices d'événements désignent la liste affichée.
 */
export function useFilteredSelection(visibleItems) {
  const selected = shallowRef([])
  const identity = item => item._id ?? item.uuid ?? toRaw(item)
  const keys = computed(() => toValue(visibleItems).map(identity))
  const checked = computed(() => keys.value.map(key => selected.value.includes(key)))
  const selectedItems = computed(() => toValue(visibleItems).filter((_, index) => checked.value[index]))

  watch(keys, currentKeys => {
    const visible = new Set(currentKeys)
    selected.value = selected.value.filter(key => visible.has(key))
  }) // Batch Vue : un tri en place ne doit pas purger ses états intermédiaires.

  function toggle(index) {
    if (!Number.isInteger(index) || index < 0 || index >= keys.value.length) return
    const key = keys.value[index]
    selected.value = selected.value.includes(key)
      ? selected.value.filter(value => value !== key)
      : [...selected.value, key]
  }
  function clear() { selected.value = [] }
  function clearItems(items) {
    const removed = new Set(items.map(identity))
    selected.value = selected.value.filter(key => !removed.has(key))
  }

  return { selected, checked, selectedItems, toggle, clear, clearItems }
}
