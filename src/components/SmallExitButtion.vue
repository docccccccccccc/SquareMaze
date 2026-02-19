<script setup lang="ts">
import { useRouter } from 'vue-router';
import { sfxPlayers } from '@/utils/sfxPlayers';
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useGlobalSettingsStore } from '@/stores/globalSettings';
const router = useRouter()
const { globalSettings } = storeToRefs(useGlobalSettingsStore())
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
  if (!globalSettings.value.gamePlay.dontNotifyOnExit) {
    showExitDialog.value = true
  } else {
    router.replace({ path: '/' })
  }
}

const showExitDialog = ref(false)

const handleExit = () => {
  showExitDialog.value = false
  router.replace({ path: '/' })
}
</script>

<template>
  <el-tooltip placement="bottom" content="退出">
    <div class="exit-btn-main" @mouseenter="handleMouseEnter" @click="handleClick">
      <font-awesome-icon icon="fas fa-right-from-bracket" />
    </div>
  </el-tooltip>
  <el-dialog v-model="showExitDialog" title="提示" append-to-body>
    <p>确定退出游戏吗？（游戏进度已自动保存）</p>
    <p><el-checkbox v-model="globalSettings.gamePlay.dontNotifyOnExit" label="下次不要向我确认" /></p>
    <template #footer>
      <el-button @click="showExitDialog = false">取消</el-button>
      <el-button @click="handleExit" type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/vars/radius.scss' as *;

.exit-btn-main {
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
