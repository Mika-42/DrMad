<script setup>
import NavBar from '../components/NavBar.vue'
const links = [{ label: 'Login', to: '/shop/login' }]
</script>

<template>
  <section>
    <h2>Boutique</h2>
    <NavBar :links="links" aria-label="Navigation boutique" />
    <RouterView name="shopmain" />
  </section>
</template>
