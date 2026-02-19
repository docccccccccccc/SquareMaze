<script setup lang="ts">
import { Direction } from '@/types/directionType';
import { GameLogic } from '@/utils/gameLogic';
import { computed } from 'vue';

const props = defineProps<{
  direction: Direction
}>()

const buttonIcon = computed(() => {
  return `fas fa-arrow-${props.direction}`
})
</script>

<template>
  <div class="control-button-main radius-lg" @click="GameLogic.move(props.direction)">
    <font-awesome-icon :icon="buttonIcon" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/vars/space.scss' as *;

.control-button-main {
  width: 32px;
  height: 32px;
  z-index: 800;
  backdrop-filter: blur(24px);
  padding: $space-sm;
  box-shadow: 0px 0px 16px white;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .3s;

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0px 0px 16px rgb(99, 99, 102)
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0px 0px 16px rgb(142, 142, 147)
  }
}
</style>
