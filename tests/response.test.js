import test from 'node:test'
import assert from 'node:assert/strict'
import { success, failure } from '../src/datasource/response.js'

test('une lecture ne laisse modifier ni ses objets imbriqués ni la source', () => {
  const source = { values: [{ date: { $date: '2026-01-01T12:00:00Z' } }] }
  const response = success(source)
  response.data.values[0].date.$date = 'modifiée'
  response.data.values.push({})
  assert.equal(source.values.length, 1)
  assert.equal(source.values[0].date.$date, '2026-01-01T12:00:00Z')
  assert.deepEqual({ error: response.error, status: response.status }, { error: 0, status: 200 })
})

test('une erreur conserve le message et les codes de la source appelante', () => {
  assert.deepEqual(failure('introuvable', 404, 2), { error: 2, status: 404, data: 'introuvable' })
})
