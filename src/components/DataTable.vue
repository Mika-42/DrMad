<script setup>
import { watch } from 'vue'
import { useFilteredSelection } from './useFilteredSelection.js'

/**
 * items: objets complets ; headers: [{label,name}] dans l'ordre de projection.
 * itemCheck/itemButton/tableButton : colonnes et bouton final facultatifs.
 * Slots choisis : item-button et table-button (labels seulement).
 * itemClicked(item complet), tableClicked(tableau des objets cochés visibles).
 * Aucune prop mutée et aucun dialogue métier dans le composant générique.
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  headers: { type: Array, default: () => [] },
  itemCheck: Boolean,
  itemButton: Boolean,
  tableButton: Boolean,
})
const emit = defineEmits(['itemClicked', 'tableClicked'])
const { checked, toggle, selectedItems, clear } = useFilteredSelection(() => props.items)
watch(() => props.itemCheck, enabled => { if (!enabled) clear() })
function tableClicked() { emit('tableClicked', props.itemCheck ? selectedItems.value : []) }
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-if="itemCheck" scope="col">select.</th>
          <th v-for="header in headers" :key="header.name" scope="col">{{ header.label }}</th>
          <th v-if="itemButton" scope="col">actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="item._id ?? item.uuid ?? index">
          <td v-if="itemCheck">
            <input
              type="checkbox"
              :aria-label="`Sélectionner la ligne ${index + 1}`"
              :checked="checked[index]"
              @change="toggle(index)"
            >
          </td>
          <td v-for="header in headers" :key="header.name">{{ item[header.name] }}</td>
          <td v-if="itemButton">
            <button type="button" @click="emit('itemClicked', item)"><slot name="item-button">Action</slot></button>
          </td>
        </tr>
      </tbody>
    </table>
    <button v-if="tableButton" type="button" @click="tableClicked"><slot name="table-button">Sélection</slot></button>
  </div>
</template>
