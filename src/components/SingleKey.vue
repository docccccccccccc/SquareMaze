<script setup lang="ts">
defineProps({
  name: String
})
</script>

<template>
  <span class="border-solid radius-sm">
    {{ name }}
  </span>
</template>

<style lang="scss" scoped>
span {
  min-width: 1em;
  box-sizing: border-box;
  padding: 4px;
  background-color: var(--el-fill-color);
  border-color: var(--el-border-color);
  margin-inline: 4px;
}
</style>
