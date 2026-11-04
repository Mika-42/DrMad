<script setup>
import NavBar from './components/NavBar.vue'
import bankIcon from './assets/bank.svg'

const links = [{ label: 'boutique', to: '/shop' }, { label: 'banque', to: '/bank' }]
</script>

<template>
  <NavBar :links="links">
    <template #nav-button="{ label }">
      <strong v-if="label === 'boutique'">boutique</strong>
      <img v-else :src="bankIcon" alt="Banque" width="24" height="24">
    </template>
  </NavBar>
  <main>
    <h1>DrMad</h1>
    <RouterView />
  </main>
</template>
