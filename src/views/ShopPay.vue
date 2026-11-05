<script setup>
/** Mapping route orderId → props orderUuid, toujours UUID public et non _id. */
defineProps({ orderUuid: { type: String, default: '' } })
</script>

<template>
  <h3>Payer une commande</h3>
  <p v-if="orderUuid">Référence de commande : {{ orderUuid }}</p>
</template>
