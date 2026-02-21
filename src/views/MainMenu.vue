<script setup lang="ts">
import MainMenuButton from '@/components/MainMenuButton.vue';
import { onMounted, ref } from 'vue'

const GAME_VERSION = ref('')
const GAME_NAME = ref('')

onMounted(() => {
  GAME_VERSION.value = __GAME_VERSION__
  GAME_NAME.value = __GAME_NAME__
})
</script>

<template>
  <div>
    <div id="main-menu">
      <div id="game-title">
        <span id="game-title-text">{{ GAME_NAME }}</span>
        <span id="game-version">V{{ GAME_VERSION }}</span>
      </div>
      <div id="main-menu-buttons">
        <MainMenuButton href="/select" text="选择关卡" icon="fas fa-list" />
        <MainMenuButton href="/settings" text="设置" icon="fas fa-cog" />
        <MainMenuButton href="/about" text="关于" icon="fas fa-info-circle" />
        <MainMenuButton href="/help" text="帮助" icon="fas fa-question" />
        <MainMenuButton href="/" text="创建自定义关卡" icon="fas fa-add" />
        <MainMenuButton href="/" text="游玩自定义关卡" icon="fas fa-paintbrush" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#main-menu {
  width: 100vw;
  height: 100vh;
}

#game-title-text {
  font-size: 8em;
}

#game-version {
  font-size: 2em
}

#game-title {
  position: fixed;
  left: 128px;
  top: 64px;
}

#main-menu-buttons {
  text-align: right;
  position: fixed;
  right: 128px;
  bottom: 128px;
}

@media screen and (max-width: 80vh) {
  #game-title {
    left: 50%;
    transform: translateX(-50%);
  }

  #game-title-text {
    font-size: 4em;
  }

  #main-menu-buttons {
    right: 50%;
    transform: translateX(50%)
  }
}
</style>
