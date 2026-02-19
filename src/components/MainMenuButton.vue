<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { sfxPlayers } from '@/utils/sfxPlayers';
import { ElMessage } from 'element-plus';
// import { onUnmounted } from 'vue';

const props = defineProps({
  href: String,
  text: String,
  icon: String
})

const handleButtonClick = () => {
  if (props.href === '/') {
    ElMessage({
      type: 'primary',
      message: '敬请期待！'
    })
  } else {
    try {
      sfxPlayers.play('openUI')
    } catch (error) {
      console.log('发生错误：', error)
    }
  }
}

const handleMouseEnter = () => {
  try {
    sfxPlayers.play('hover')
  } catch (error) {
    console.log('发生错误：', error)
  }
}

// onUnmounted(() => {
//   sfxPlayers.openUI.destroy()
//   sfxPlayers.hover.destroy()
// })
</script>

<template>
  <RouterLink :to="href ?? '/'" style="text-decoration: none;" @click="handleButtonClick"
    @mouseenter="handleMouseEnter">
    <div class="main-menu-btn-main">
      <span>{{ text }}<font-awesome-icon :icon="icon ?? ''" /></span>
    </div>
  </RouterLink>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/vars/space.scss' as *;
@use '@/assets/styles/vars/radius.scss' as *;

.main-menu-btn-main {
  background-color: transparent;
  transition: .3s;
  font-size: 2em;
  padding: $space-xs $space-md;
  margin: $space-xs;
  border-radius: $radius-lg;
  border-left: 4px solid var(--el-color-primary);

  &>span {
    color: var(--el-text-color-primary);
  }

  &:hover {
    cursor: pointer;
    border-color: var(--el-color-success);
  }
}
</style>
