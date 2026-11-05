import test from 'node:test'
import assert from 'node:assert/strict'
import { ref, effectScope, nextTick } from 'vue'
import { useFilteredSelection } from '../src/components/useFilteredSelection.js'

test('filtrer purge la sélection masquée sans décaler la sélection restante', async () => {
  const scope = effectScope()
  await scope.run(async () => {
    const all = [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }]
    const visible = ref(all)
    const selection = useFilteredSelection(visible)
    selection.toggle(0); selection.toggle(2)
    visible.value = [all[2], all[1]]
    await nextTick()
    assert.deepEqual(selection.checked.value, [true, false])
    visible.value = all
    await nextTick()
    assert.deepEqual(selection.checked.value, [false, false, true])
    assert.deepEqual(selection.selectedItems.value, [all[2]])
    selection.toggle(2)
    assert.deepEqual(selection.selected.value, [])
  })
  scope.stop()
})

test('les identités restent correctes au tri et au renouvellement des objets', async () => {
  const scope = effectScope()
  await scope.run(async () => {
    const visible = ref([{ _id: 'a' }, { _id: 'b' }])
    const selection = useFilteredSelection(visible)
    selection.toggle(1)
    visible.value = [{ _id: 'b' }, { _id: 'a' }]
    await nextTick()
    assert.deepEqual(selection.checked.value, [true, false])
    selection.toggle(-1); selection.toggle(50); selection.toggle(0.5)
    assert.deepEqual(selection.selected.value, ['b'])
    selection.clearItems([{ _id: 'b' }])
    assert.deepEqual(selection.selected.value, [])
  })
  scope.stop()
})

test('sans _id, la référence unique reste utilisable et clear vide la sélection', async () => {
  const scope = effectScope()
  await scope.run(async () => {
    const visible = ref([{ label: 'premier' }, { label: 'second' }])
    const selection = useFilteredSelection(visible)
    selection.toggle(0)
    visible.value.reverse()
    await nextTick()
    assert.deepEqual(selection.checked.value, [false, true])
    selection.clear()
    assert.deepEqual(selection.checked.value, [false, false])
  })
  scope.stop()
})

test('clearItems retire aussi les identités brutes fournies par un getter', () => {
  const scope = effectScope()
  scope.run(() => {
    const rows = [{ label: 'objet brut' }]
    const selection = useFilteredSelection(() => rows)
    selection.toggle(0)
    assert.deepEqual(selection.checked.value, [true])
    selection.clearItems(rows)
    assert.equal(selection.selected.value.length, 0)
    assert.deepEqual(selection.checked.value, [false])
  })
  scope.stop()
})

test('un UUID présent stabilise une ligne sans _id renouvelée', async () => {
  const scope = effectScope()
  await scope.run(async () => {
    const rows = ref([{ uuid: 'reference-a' }])
    const selection = useFilteredSelection(rows)
    selection.toggle(0)
    rows.value = [{ uuid: 'reference-a' }]
    await nextTick()
    assert.deepEqual(selection.checked.value, [true])
    selection.clearItems([{ uuid: 'reference-a' }])
    assert.equal(selection.selected.value.length, 0)
  })
  scope.stop()
})
