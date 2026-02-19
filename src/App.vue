<script setup lang="ts">
// 先导入 Vue 的东西

// 然后是本地化
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 管 Element Plus 的组件的时间
import 'dayjs/locale/zh-cn'
import { onMounted, reactive } from 'vue';
import { useGlobalSettingsStore } from './stores/globalSettings';

// 然后是我自己瞎写的组件，放这里

// 以及一些杂七杂八的数据
const msgConfig = reactive({
  max: 5,
  duration: 1500,
  showClose: true
})

onMounted(() => {
  const currentTileColorTheme = useGlobalSettingsStore().globalSettings.appearance.tileColorTheme
  document.documentElement.setAttribute('data-theme', currentTileColorTheme)
})
</script>

<template>
  <el-config-provider :locale="zhCn" :message="msgConfig">
    <div style="margin: 8px">
      <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </el-config-provider>
</template>

<style scoped lang="scss">
.el-header {
  padding: 0;
}

.el-main {
  padding: 0px;
  margin: 20px
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  transition: opacity 0.5s ease;
  opacity: 0;
}
</style>
