<script setup lang="ts">
import { GAME_INFO } from '@/utils/gameInfo';
import MiddleLayout from '@/components/MiddleLayout.vue';
import gameIcon from '@/assets/images/icon.svg'
import { ref, onMounted } from 'vue'
import PageTopBar from '@/components/PageTopBar.vue';

const GAME_VERSION = ref('')

onMounted(() => {
  GAME_VERSION.value = __GAME_VERSION__
})
</script>

<template>
  <MiddleLayout>
    <PageTopBar>
      关于
    </PageTopBar>
    <el-card>
      <el-image style="height: 128px; width: 128px" :src="gameIcon" />
      <h2>{{ GAME_INFO.GAME_NAME }}</h2>
      <h3>{{ GAME_VERSION }}</h3>
      <p>By doctypehtml</p>
      <p>GitHub 仓库链接：<el-link href="https://github.com/docccccccccccc/SquareMaze">这里</el-link></p>
      <p>作者 B 站主页：<el-link href="https://space.bilibili.com/3546694681626801/">这里</el-link></p>
      <p>作者 GitHub 主页：<el-link href="https://github.com/docccccccccccc">这里</el-link></p>
      <p>作者爱发电主页：<el-link href="https://afdian.com/a/doctypehtml">这里</el-link></p>
    </el-card>
  </MiddleLayout>
</template>

<style lang="scss" scoped>
.el-card {
  text-align: center
}

h1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
