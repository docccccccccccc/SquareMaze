<script setup lang="ts">
import MainMenuButton from '@/components/MainMenuButton.vue';
import { GAME_INFO } from '@/utils/gameInfo';
import { nextTick, ref } from 'vue';
import router from '@/router';
import { sfxPlayers } from '@/utils/sfxPlayers';

const showNewGameConfirmDialog = ref(false)

const handleConfirmNewGame = () => {
  showNewGameConfirmDialog.value = false
  localStorage.removeItem('playerInfo')
  router.push({ path: '/play' }).then(async () => {
    await nextTick()
    sfxPlayers.play('openUI')
    location.reload()
  })
}
</script>

<template>
  <div>
    <div id="main-menu">
      <div id="game-title">
        <span id="game-title-text">{{ GAME_INFO.GAME_NAME }}</span>
        <span id="game-version">{{ GAME_INFO.GAME_VERSION }}</span>
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
    <el-dialog v-model="showNewGameConfirmDialog" title="警告">
      你已经有了游玩进度，开启新游戏将重置你的进度，确定开始新游戏吗？如果想继续游玩，请点击“继续游戏”。
      <template #footer>
        <el-button @click="showNewGameConfirmDialog = false">取消</el-button>
        <el-button type="danger" @click="handleConfirmNewGame">开始新游戏</el-button>
      </template>
    </el-dialog>
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
