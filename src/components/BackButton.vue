<script setup lang="ts">
import { useRouter } from 'vue-router';
import { sfxPlayers } from '@/utils/sfxPlayers';

const router = useRouter()

const handleMouseEnter = () => {
  try {
    sfxPlayers.play('hover')
  } catch (error) {
    console.log('发生错误：', error)
  }
}

const handleClick = () => {
  router.back()
}
</script>

<template>
  <div class="back-to-main-menu-btn-main" @mouseenter="handleMouseEnter" @click="handleClick">
    <span><font-awesome-icon icon="fas fa-arrow-left" />返回</span>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/vars/space.scss' as *;
@use '@/assets/styles/vars/radius.scss' as *;

.back-to-main-menu-btn-main {
  background-color: transparent;
  transition: .3s;
  border-radius: $radius-lg;
  font-size: 0.8em;

  & * {
    color: var(--el-text-color-primary);
    text-decoration: none;
  }

  &:hover {
    background-color: rgba(64, 158, 255, 0.5);
    color: var(--el-color-primary);
    cursor: pointer
  }

  &:active {
    background-color: rgba(64, 158, 255, 0.5);
    filter: brightness(1.5);
    color: var(--el-color-primary);
    cursor: pointer
  }
}
</style>
