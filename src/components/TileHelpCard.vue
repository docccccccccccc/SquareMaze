<script setup lang="ts">
import { GameLogic } from '@/utils/gameLogic';
import type { TileType } from '@/types/tileType';
import { useGlobalSettingsStore } from '@/stores/globalSettings';
import { storeToRefs } from 'pinia';
import '@/assets/styles/tileColors.scss'

const { globalSettings } = storeToRefs(useGlobalSettingsStore())

const getTileBackgroundImage = (tileType: TileType) => {
  if (globalSettings.value.appearance.tilePatternTheme === 'pure') {
    return 'none'
  }

  const className = GameLogic.getTileClassName(tileType)
  const imageUrl = `/tiles/${className}.svg`

  return `url(${imageUrl})`
}

defineProps<{
  tile: TileType,
  name: string,
  description: string
}>()
</script>

<template>
  <!-- <div> -->
  <el-card>
    <div class="tile-help-main">
      <div class="tile" :class="GameLogic.getTileClassName(tile)" :style="{
        backgroundImage: getTileBackgroundImage(tile)
      }"></div>
      <div>
        <p style="font-size: 1.25em">{{ name }}</p>
        <p>{{ description }}</p>
      </div>
    </div>
  </el-card>
  <!-- </div> -->
</template>

<style lang="scss" scoped>
.tile {
  background-repeat: no-repeat;
  background-position: center;
}

.el-card {
  min-height: 240px;
  width: 100%;
}

.tile-help-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%
}
</style>
