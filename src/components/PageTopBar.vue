<script setup lang="ts">
import BackButton from './BackButton.vue';
</script>

<template>
  <h1>
    <slot></slot>
    <BackButton />
  </h1>
</template>

<style lang="scss" scoped>
h1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
