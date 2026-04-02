<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia';
// import router from '@/router';
import { usePlayerInfoStore } from '@/stores/playerInfo';
import { useGlobalSettingsStore } from '@/stores/globalSettings';
import { useCustomLevelDataStore } from '@/stores/customLevelData';
import { GameLogic } from '@/utils/gameLogic';
import { CustomLevelEditLogic, spectatorPosition } from '@/utils/customLevelEditLogic';
import { musicPlayer } from '@/utils/musicPlayer';
import { Direction } from '@/types/directionType';
import type { TileType } from '@/types/tileType';
// import type { LevelData } from '@/types/levelInterface';
// import type { PointOnMap } from '@/types/pointOnMap';
import SmallExitButton from '@/components/SmallExitButtion.vue';
import MiddleLayout from '@/components/MiddleLayout.vue';
import ControlButton from '@/components/ControlButton.vue';
import BackButton from '@/components/BackButton.vue';
import '@/assets/styles/tileColors.scss'
import type { FormRules, FormInstance } from 'element-plus';

// 方向枚举
const directions = Direction

// 玩家信息和全局设置
const { playerInfo } = storeToRefs(usePlayerInfoStore())
const { globalSettings } = storeToRefs(useGlobalSettingsStore())
const { customLevelData, creationStatus } = storeToRefs(useCustomLevelDataStore())
const isKeyGotten = ref(false)

// 当前地图数据
const thisMap = computed(() => {
  return isKeyGotten.value
    ? customLevelData.value.mapData.afterGettingKey
    : customLevelData.value.mapData.default
})

// 获取窗口尺寸
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

// 计算地图偏移
const mapOffset = computed(() => {
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
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeyDown)
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
    CustomLevelEditLogic.moveSpectator(direction)
  }
}

// 获取图块背景图片
const getTileBackgroundImage = (tileType: TileType) => {
  if (globalSettings.value.appearance.tilePatternTheme === 'pure') {
    return 'none'
  }

  const className = GameLogic.getTileClassName(tileType)
  const imageUrl = `/tiles/${className}.svg`

  return `url(${imageUrl})`
}

const keyItemImageLink = computed(() => {
  let result: string = ''
  switch (globalSettings.value.appearance.tileColorTheme) {
    case 'classic':
      result = 'keyClassic.svg'
      break
    case 'smooth':
      result = 'keySmooth.svg'
      break
    default:
      result = 'none'
      break
  }

  return result === 'none'
    ? result
    : `/${result}`
})

// 创建自定义关卡的表单
interface CreationForm {
  name: string,
  width: number,
  height: number
}

const creationForm = reactive<CreationForm>({
  name: '新关卡',
  width: 12,
  height: 12
})

const creationFormRef = ref<FormInstance>()

const formRules = reactive<FormRules<CreationForm>>(
  {
    name: [
      { required: true, message: "请输入关卡名称", trigger: 'change' },
      { max: 50, message: "关卡名称不能超过 50 个字符", trigger: 'change' },
    ],
    width: [
      { required: true, message: "请输入地图宽度", trigger: 'blur' },
    ],
    height: [
      { required: true, message: "请输入地图高度", trigger: 'blur' },
    ],
  }
)

const creationConfirmationDialogVisible = ref(false)
</script>

<template>
  <div v-if="creationStatus.status">
    <div id="game-topbar" class="radius-lg">
      <span>自定义关卡：{{ customLevelData.name }}&nbsp;</span>
      <span>
        <font-awesome-icon icon="fas fa-location-dot" />
        ({{ spectatorPosition.x }}, {{ spectatorPosition.y }})
      </span>
      <el-space :size="4">
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
    <div id="game-key-item" :style="{
      transform: `translate(${mapOffset.x + 64 * (customLevelData?.keyPosition?.x || 0)}px, ${mapOffset.y + 64 * (customLevelData?.keyPosition?.y || 0)}px)`,
      transition: '0.2s ease-out',
      position: 'fixed'
    }" v-if="!playerInfo.hasKey && customLevelData?.keyPosition">
      <img :src="keyItemImageLink" width="48px" height="48px" />
    </div>

    <div id="game-hero">
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
  <div v-else class="create">
    <MiddleLayout>
      <h1>
        创建新的自定义关卡
        <BackButton />
      </h1>
      <el-form :ref="creationFormRef" :model="creationForm" :rules="formRules" label-width="auto">
        <el-form-item label="关卡名称" prop="name">
          <el-input v-model="creationForm.name" style="max-width: 300px" />
        </el-form-item>
        <el-form-item prop="width" label="地图宽度" required>
          <el-input-number v-model="creationForm.width" :min="2" :max="100" />
        </el-form-item>
        <el-form-item prop="height" label="地图高度" required>
          <el-input-number v-model="creationForm.height" :min="2" :max="100" />
        </el-form-item>
      </el-form>
      <el-rol>
        <el-button type="primary" @click="creationConfirmationDialogVisible = true">创建</el-button>
      </el-rol>
    </MiddleLayout>
  </div>
  <el-dialog v-model="creationConfirmationDialogVisible" title="警告" width="70%">
    <p>地图大小一旦确定，无法更改！只能通过重建新地图修改大小！</p>
    <p>你选择的地图大小：<b>{{ creationForm.width }} × {{ creationForm.height }}</b></p>
    <p><b>这是最后的警告，你确定要创建吗？</b></p>
    <template #footer>
      <el-button @click="creationConfirmationDialogVisible = false">取消</el-button>
      <el-button>确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/vars/space.scss' as *;

h1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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

#game-hero {
  left: 50%;
  top: 50%;
  position: fixed;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px
}
</style>
