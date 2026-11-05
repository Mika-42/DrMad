<script setup>
import { computed, reactive, toRaw, watch } from 'vue'

/**
 * Projection des champs dans l'ordre fields ; checked reste contrôlé par le parent.
 * checked-changed(index affiché).
 * item-button-clicked(index), ou {index, amount} si itemAmount.
 * list-button-clicked(indices cochés), ou [{index,amount}] si itemAmount.
 * Le bouton final est utilisable sans sélection (ex. vider un panier).
 * Quantités internes, entières >0 ; défaut 1. Aucune prop n'est modifiée.
 */
const props = defineProps({
  data: { type: Array, default: () => [] },
  fields: { type: Array, default: () => [] },
  itemCheck: Boolean,
  checked: { type: Array, default: () => [] },
  itemButton: { type: Object, default: () => ({ show: false, text: '' }) },
  listButton: { type: Object, default: () => ({ show: false, text: '' }) },
  itemAmount: Boolean,
})
const emit = defineEmits(['checked-changed', 'item-button-clicked', 'list-button-clicked'])
const amounts = reactive(new Map())
const identity = item => item._id ?? item.uuid ?? toRaw(item)
const quantity = item => amounts.get(identity(item)) ?? 1
const valid = item => quantity(item) !== '' && Number.isSafeInteger(Number(quantity(item))) && Number(quantity(item)) > 0
const selected = computed(() => props.data.flatMap((_, index) => props.itemCheck && props.checked[index] ? [index] : []))
const groupInvalid = computed(() => props.itemAmount && selected.value.some(index => !valid(props.data[index])))

watch(() => props.data.map(identity), keys => {
  const visible = new Set(keys)
  for (const key of amounts.keys()) if (!visible.has(toRaw(key))) amounts.delete(key)
})

function itemClicked(index) {
  if (props.itemAmount && !valid(props.data[index])) return
  emit('item-button-clicked', props.itemAmount ? { index, amount: Number(quantity(props.data[index])) } : index)
}
function listClicked() {
  if (groupInvalid.value) return
  emit('list-button-clicked', selected.value.map(index => props.itemAmount
    ? { index, amount: Number(quantity(props.data[index])) } : index))
}
</script>

<template>
  <div>
    <ul>
      <li v-for="(item, index) in data" :key="item._id ?? index">
        <input
          v-if="itemCheck"
          type="checkbox"
          :aria-label="`Sélectionner la ligne ${index + 1}`"
          :checked="Boolean(checked[index])"
          @change="emit('checked-changed', index)"
        >
        <span v-for="field in fields" :key="field" class="field">{{ item[field] }}</span>
        <template v-if="itemButton.show">
          <input
            v-if="itemAmount"
            type="number"
            min="1"
            step="1"
            :aria-label="`Quantité de la ligne ${index + 1}`"
            :value="quantity(item)"
            @input="amounts.set(identity(item), $event.target.value)"
          >
          <button type="button" :disabled="itemAmount && !valid(item)" @click="itemClicked(index)">{{ itemButton.text }}</button>
        </template>
      </li>
    </ul>
    <button v-if="listButton.show" type="button" :disabled="groupInvalid" @click="listClicked">{{ listButton.text }}</button>
  </div>
</template>

<style scoped>
.field { margin-inline-end: .4rem; }
</style>
