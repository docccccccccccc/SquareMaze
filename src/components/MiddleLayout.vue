<template>
  <div class="middle-layout-main">
    <div class="middle-layout-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/vars/space.scss' as *;

.middle-layout-main {
  // width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-md;

  .middle-layout-wrapper {
    width: min(100vw - 2 * $space-md, 1200px)
  }
}
</style>
