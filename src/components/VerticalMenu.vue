<script setup>
import { useRouter } from 'vue-router'
import { useSlots } from 'vue'

/**
 * items: [{type:'title'|'link',label,to?,disabled?}]. Types inconnus ignorés.
 * disabled: blocage global des liens, jamais des titres.
 * menu-title({label}), fallback texte ; menu-link({label}), fallback bouton.
 * Les contenus de slot restent sous le contrôle de navigation de ce composant.
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  disabled: Boolean,
})
const slots = useSlots()
const router = useRouter()
const blocked = item => props.disabled || item.disabled || !item.to

function capture(event, item) {
  if (blocked(item)) {
    event.preventDefault()
    event.stopPropagation()
  }
}
function goTo(item) {
  if (!blocked(item)) return router.push(item.to)
}
</script>

<template>
  <nav class="vertical-menu" aria-label="Menu vertical">
    <template v-for="(item, index) in items" :key="index">
      <span v-if="item.type === 'title'">
        <slot name="menu-title" :label="item.label">{{ item.label }}</slot>
      </span>
      <span
        v-else-if="item.type === 'link'"
        :role="slots['menu-link'] ? 'link' : undefined"
        :aria-label="slots['menu-link'] ? item.label : undefined"
        :aria-disabled="Boolean(blocked(item))"
        :tabindex="slots['menu-link'] ? (blocked(item) ? -1 : 0) : undefined"
        @click.capture="capture($event, item)"
        @click="goTo(item)"
        @keydown.enter.prevent="goTo(item)"
        @keydown.space.prevent="goTo(item)"
      >
        <slot name="menu-link" :label="item.label">
          <button type="button" :disabled="Boolean(blocked(item))">{{ item.label }}</button>
        </slot>
      </span>
    </template>
  </nav>
</template>

<style scoped>
.vertical-menu { display: flex; flex-direction: column; align-items: flex-start; gap: .4rem; }
</style>
