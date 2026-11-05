/** Copies JSON métier : ne jamais exposer une référence mutable de la source. */
export function cloneData(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value))
}

/** Contrat des lectures : réponse indépendante de la fausse BDD en mémoire. */
export function success(data) {
  return { error: 0, status: 200, data: cloneData(data) }
}

/** Les échecs transportent un message, jamais un objet métier factice. */
export function failure(message, status = 400, error = 1) {
  return { error, status, data: message }
}
