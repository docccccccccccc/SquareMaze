<script lang="ts" setup>
import MiddleLayout from '@/components/MiddleLayout.vue';
import BackButton from '@/components/BackButton.vue';
import LevelLink from '@/components/LevelLink.vue';
import { usePlayerInfoStore } from '@/stores/playerInfo';
import { storeToRefs } from 'pinia';

const { playerInfo } = storeToRefs(usePlayerInfoStore())
</script>

<template>
  <MiddleLayout>
    <h1>
      选择关卡
      <BackButton />
    </h1>
    <el-space fill direction="vertical" style="width: 100%">
      <LevelLink :id="levelId" v-for="levelId in playerInfo.highestLevel" :key="levelId" />
    </el-space>
  </MiddleLayout>
</template>

<style lang="scss" scoped>
h1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
