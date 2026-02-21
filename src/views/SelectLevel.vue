<script lang="ts" setup>
import MiddleLayout from '@/components/MiddleLayout.vue';
import BackButton from '@/components/BackButton.vue';
import LevelLink from '@/components/LevelLink.vue';
import { usePlayerInfoStore } from '@/stores/playerInfo';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';

const { playerInfo } = storeToRefs(usePlayerInfoStore())

const currentPage = ref(1)

// 每页显示的关卡数量
const pageSize = 10

// 关卡范围
const currentLevelRange = computed(() => {
  const startLevel = (currentPage.value - 1) * pageSize + 1
  const endLevel = Math.min(currentPage.value * pageSize, playerInfo.value.highestLevel)

  // 关卡 ID 数组
  const levels: number[] = []
  for (let i = startLevel; i <= endLevel; i++) {
    levels.push(i)
  }

  return levels
})
</script>

<template>
  <MiddleLayout>
    <h1>
      选择关卡
      <BackButton />
    </h1>
    <el-space fill direction="vertical" style="width: 100%">
      <LevelLink :id="levelId" v-for="levelId in currentLevelRange" :key="levelId" />
    </el-space>
    <el-pagination v-model:current-page="currentPage" :total="playerInfo.highestLevel" layout="prev, pager, next"
      :page-size="pageSize" hide-on-single-page />
  </MiddleLayout>
</template>

<style lang="scss" scoped>
h1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
