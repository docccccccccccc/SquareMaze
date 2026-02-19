<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerInfoStore } from '@/stores/playerInfo';
import { useGlobalSettingsStore } from '@/stores/globalSettings';
import { GameLogic } from '@/utils/gameLogic';
import '@/assets/styles/tileColors.scss'
import { storeToRefs } from 'pinia';
import { Direction } from '@/types/directionType';
import SmallSettingsButton from '@/components/SmallSettingsButton.vue';
import SmallExitButton from '@/components/SmallExitButtion.vue';
import ControlButton from '@/components/ControlButton.vue';
import type { TileType } from '@/types/tileType';
import { getLevelById, loadingErrorInfo, loadingIsSuccessful, loadLevels } from '@/utils/loadLevel';
import type { LevelData } from '@/types/levelInterface';
import { musicPlayer } from '@/utils/musicPlayer';
import router from '@/router';
import MiddleLayout from '@/components/MiddleLayout.vue';

const directions = Direction

const { playerInfo } = storeToRefs(usePlayerInfoStore())
const { globalSettings } = storeToRefs(useGlobalSettingsStore())

const levels = ref<LevelData[]>([])
const levelsLoaded = ref(false)

const thisLevel = computed(() => {
  if (!levelsLoaded.value) return null
  return getLevelById(playerInfo.value.currentLevel)
})

const thisMap = computed(() => {
  if (!thisLevel.value) {
    return []
  }

  const mapData = thisLevel.value
    ? (playerInfo.value.hasKey
      ? thisLevel.value.mapData.afterGettingKey
      : thisLevel.value.mapData.default
    )
    : []
  return mapData
})
// 获取窗口尺寸
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

// 计算地图偏移
const mapOffset = computed(() => {
  if (!levelsLoaded.value) {
    return { x: 0, y: 0 }
  }

  const screenWidthInTiles = windowWidth.value / 64
  const screenHeightInTiles = windowHeight.value / 64

  const offsetX = playerInfo.value.position.x - screenWidthInTiles / 2
  const offsetY = playerInfo.value.position.y - screenHeightInTiles / 2

  return {
    x: -offsetX * 64 - 32,
    y: -offsetY * 64 - 32
  }
})

// 处理尺寸调节
const handleResize = () => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
}

// 监听事件
onMounted(async () => {
  levels.value = await loadLevels()
  levelsLoaded.value = levels.value.length > 0

  if (levelsLoaded.value) {
    if (!getLevelById(playerInfo.value.currentLevel)) {
      // 当前关卡不存在就重置为第一关
      playerInfo.value.currentLevel = 1
    }
  }
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeyDown)

  musicPlayer.play()
})

// 取消监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeyDown)

  musicPlayer.stop()
})

// 处理按键按下
const handleKeyDown = (event: KeyboardEvent) => {
  let direction: Direction | null = null // 先设置为空
  const key = event.key // 事件对应的按键
  switch (key) {
    // 上下左右四个方向都要有
    case 'ArrowUp':
    case 'w':
      direction = Direction.Up
      break
    case 'ArrowLeft':
    case 'a':
      direction = Direction.Left
      break
    case 'ArrowDown':
    case 's':
      direction = Direction.Down
      break
    case 'ArrowRight':
    case 'd':
      direction = Direction.Right
      break
    default:
      // 都不是就不设置
      break;
  }
  if (direction !== null) {
    // 如果设置了方向
    GameLogic.move(direction)
  }
}

const getTileBackgroundImage = (tileType: TileType) => {
  if (globalSettings.value.appearance.tilePatternTheme === 'pure') {
    return 'none'
  }

  const className = GameLogic.getTileClassName(tileType)
  const imageUrl = `/tiles/${className}.svg`

  return `url(${imageUrl})`
}

const reloadPage = () => {
  location.reload()
}

const backToMainMenuOnError = () => {
  router.push({ path: '/' })
  reloadPage()
}
</script>

<template>
  <div v-if="levelsLoaded">
    <div id="game-topbar" class="radius-lg">
      <span>Level {{ thisLevel?.id }} {{ thisLevel?.name }}&nbsp;</span>
      <span>
        <font-awesome-icon icon="fas fa-location-dot" />
        ({{ playerInfo.position.x }}, {{ playerInfo.position.y }})
      </span>
      <span>
        <font-awesome-icon icon="fas fa-skull-crossbones" />
        {{ playerInfo.deaths }}
      </span>
      <el-space :size="4">
        <SmallSettingsButton />
        <SmallExitButton />
      </el-space>
    </div>
    <div id="game-map">
      <div class="tile-line" v-for="(mapLine, yIndex) in thisMap" :key="`tile-line-${yIndex}`" :style="{
        transform: `translate(${mapOffset.x}px, ${mapOffset.y}px)`
      }">
        <div class="tile" v-for="(mapTile, xIndex) in mapLine" :key="`tile-${xIndex}-${yIndex}`"
          :class="GameLogic.getTileClassName(mapTile)" :style="{
            left: `${xIndex * 64}px`,
            top: `${yIndex * 64}px`,
            backgroundImage: getTileBackgroundImage(mapTile)
          }">
        </div>
      </div>
    </div>
    <div id="game-hero"
      style="left: 50%; top: 50%; position: fixed; transform: translate(-50%, -50%); width: 48px; height: 48px">
      <img src="/heroes/hero1.svg" width="48px" height="48px" />
    </div>
    <el-space id="game-controls" direction="vertical">
      <ControlButton :direction="directions.Up" />
      <el-space>
        <ControlButton :direction="directions.Left" />
        <ControlButton :direction="directions.Down" />
        <ControlButton :direction="directions.Right" />
      </el-space>
    </el-space>
  </div>
  <div v-else class="loading">
    <div v-if="!loadingIsSuccessful && typeof loadingIsSuccessful === 'boolean'">
      <MiddleLayout>
        <p>
          加载失败
        </p>
        <p style="font-size: 16px">
          <span>将下方的错误信息汇报给作者：</span>
          <br>
          <span>{{ loadingErrorInfo }}</span>
        </p>
        <el-button @click="reloadPage">刷新页面</el-button>
        <el-button @click="backToMainMenuOnError">回到主页</el-button>
      </MiddleLayout>
    </div>
    <div v-if="loadingIsSuccessful === null">
      加载中……
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/vars/space.scss' as *;

.tile-line {
  display: flex;
}

#game-topbar {
  position: fixed;
  top: $space-md;
  z-index: 800;
  backdrop-filter: blur(24px);
  padding: $space-sm;
  box-shadow: 0px 0px 16px white;
  background-color: rgba(255, 255, 255, 0.3);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  transition: .3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0px 0px 16px rgb(142, 142, 147)
  }
}

#game-map {
  position: fixed;
  left: 0;
  top: 0;

  & .tile-line {
    transition: 0.2s ease-out;
  }
}

#game-controls {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
}

#game-hero {
  position: fixed;
  z-index: 500
}

.tile {
  position: absolute;
  background-repeat: no-repeat;
  background-position: center;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
}
</style>
