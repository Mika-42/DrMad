<script setup>
import { useRouter } from 'vue-router'

/**
 * links: [{label, to, disabled?}]. disabled est une extension explicite du contrat.
 * Slot nav-button({label}), fallback label. Aucun événement menu-clicked.
 * Les boutons natifs conservent activation clavier et sémantique disabled.
 */
defineProps({ links: { type: Array, default: () => [] } })
const router = useRouter()

function goTo(link) {
  if (!link.disabled && typeof link.to === 'string' && link.to.length) {
    return router.push(link.to)
  }
}
</script>

<template>
  <nav aria-label="Navigation">
    <button
      v-for="(link, index) in links"
      :key="index"
      type="button"
      :disabled="Boolean(link.disabled) || !link.to"
      @click="goTo(link)"
    >
      <slot name="nav-button" :label="link.label">{{ link.label }}</slot>
    </button>
  </nav>
</template>
