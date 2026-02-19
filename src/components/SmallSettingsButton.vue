<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { sfxPlayers } from '@/utils/sfxPlayers';
const handleMouseEnter = () => {
  try {
    sfxPlayers.play('hover')
  } catch (error) {
    console.log('发生错误：', error)
  }
}

const handleClick = () => {
  try {
    sfxPlayers.play('openUI')
  } catch (error) {
    console.log('发生错误：', error)
  }
}
</script>

<template>
  <el-tooltip placement="bottom" content="设置">
    <div class="go-to-settings-btn-main" @mouseenter="handleMouseEnter" @click="handleClick">
      <RouterLink to="/settings">
        <font-awesome-icon icon="fas fa-gear" />
      </RouterLink>
    </div>
  </el-tooltip>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/vars/radius.scss' as *;

.go-to-settings-btn-main {
  background-color: transparent;
  transition: .3s;
  border-radius: $radius-lg;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: center;

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
