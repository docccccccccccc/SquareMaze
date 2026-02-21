<script setup lang="ts">
import type { LevelData } from '@/types/levelInterface';
import { GameLogic } from '@/utils/gameLogic';
import { getLevelById, loadLevels } from '@/utils/loadLevel';
import { sfxPlayers } from '@/utils/sfxPlayers';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

const thisLevelData = ref<LevelData | null>(null)

onMounted(async () => {
  await loadLevels();
  thisLevelData.value = getLevelById(props.id)
})

const handleGoToLevel = () => {
  try {
    sfxPlayers.play('openUI')
  } catch (error) {
    console.log('发生错误：', error)
  }
  GameLogic.goToLevel(props.id);
  router.push({ path: '/play' })
}

const handleMouseEnter = () => {
  try {
    sfxPlayers.play('hover')
  } catch (error) {
    console.log('发生错误：', error)
  }
}
</script>

<template>
  <el-card v-if="thisLevelData" class="level-link" @click="handleGoToLevel" @mouseenter="handleMouseEnter">
    <span><font-awesome-icon icon="fas fa-arrow-right" />Level {{ id }} {{ thisLevelData.name }}</span>
  </el-card>
  <el-card v-else class="level-link-loading">
    <span>加载中……</span>
  </el-card>
</template>

<style lang="scss" scoped>
.level-link,
.level-link-loading {
  height: 64px;
  text-align: left;
}

.level-link:hover {
  background-color: var(--el-color-primary-light-7);
  color: var(--el-color-primary-dark-2);
  cursor: pointer;
}
</style>
