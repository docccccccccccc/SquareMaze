<script setup lang="ts">
import MiddleLayout from '@/components/MiddleLayout.vue';
import BackButton from '@/components/BackButton.vue';
import { useGlobalSettingsStore } from '@/stores/globalSettings';
import { storeToRefs } from 'pinia';
import { tileColorThemes } from '@/utils/tileColorThemes';
import { tilePatternThemes } from '@/utils/tilePatternThemes';
import { nextTick, ref } from 'vue';
import { sfxPlayers } from '@/utils/sfxPlayers';
import { usePlayerInfoStore } from '@/stores/playerInfo';
import { useRouter } from 'vue-router';

const globalSettingsStore = useGlobalSettingsStore()
const { globalSettings } = storeToRefs(globalSettingsStore)
const router = useRouter()

const showResetSaveDialog = ref(false)
const showResetSettingsDialog = ref(false)

const handleResetSaveButtonClick = () => {
  try {
    sfxPlayers.play('openUI')
  } catch (error) {
    console.error('发生错误：', error)
  }
  showResetSaveDialog.value = true
}

const handleResetSettingsButtonClick = () => {
  try {
    sfxPlayers.play('openUI')
  } catch (error) {
    console.error('发生错误：', error)
  }
  showResetSettingsDialog.value = true
}

const handleResetSave = () => {
  showResetSaveDialog.value = false
  usePlayerInfoStore().resetSave()
  router.push({ path: '/' }).then(async () => {
    await nextTick()
    location.reload()
  })
}

const handleResetSettings = () => {
  showResetSettingsDialog.value = false
  globalSettingsStore.resetSettings()
  // router.replace({ path: '/' })
}
</script>

<template>
  <MiddleLayout>
    <h1>
      设置
      <BackButton />
    </h1>
    <el-space direction="vertical" fill wrap class="settings-main">
      <el-card>
        <template #header>外观</template>
        <el-form>
          <el-form-item label="颜色主题">
            <el-select v-model="globalSettings.appearance.tileColorTheme">
              <el-option v-for="tileColorTheme in tileColorThemes" :key="tileColorTheme.id" :label="tileColorTheme.name"
                :value="tileColorTheme.id" style="display: flex; align-items: center; justify-content: space-between;">
                <span>{{ tileColorTheme.name }}</span>
                <el-space>
                  <div class="color-theme-show" :data-theme="tileColorTheme.id"
                    style="background-color: var(--tile-ground-color);"></div>
                  <div class="color-theme-show" :data-theme="tileColorTheme.id"
                    style="background-color: var(--tile-wall-color);"></div>
                  <div class="color-theme-show" :data-theme="tileColorTheme.id"
                    style="background-color: var(--tile-trap-color);"></div>
                </el-space>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图块图案主题">
            <el-select v-model="globalSettings.appearance.tilePatternTheme">
              <el-option v-for="tilePatternTheme in tilePatternThemes" :key="tilePatternTheme.id"
                :label="tilePatternTheme.name" :value="tilePatternTheme.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <template #header>音乐与音效</template>
        <el-form>
          <el-form-item label="启用音乐">
            <el-switch v-model="globalSettings.media.musicEnabled" />
          </el-form-item>
          <el-form-item label="启用音效">
            <el-switch v-model="globalSettings.media.sfxEnabled" />
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <template #header>游戏体验</template>
        <el-form>
          <el-form-item label="不要在退出游戏时向我确认">
            <el-switch v-model="globalSettings.gamePlay.dontNotifyOnExit" />
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <template #header>危险区域</template>
        <el-button type="danger" @click="handleResetSaveButtonClick">重置存档</el-button>
        <el-button type="danger" @click="handleResetSettingsButtonClick">重置设置</el-button>
      </el-card>
    </el-space>
    <el-dialog v-model="showResetSaveDialog" title="警告">
      <p>你确定要重置你的存档吗？此操作不可逆！</p>
      <p>（重置存档将刷新页面）</p>
      <template #footer>
        <el-button @click="showResetSaveDialog = false">取消</el-button>
        <el-button type="danger" @click="handleResetSave">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="showResetSettingsDialog" title="警告">
      <p>你确定要重置你的设置吗？此操作不可逆！</p>
      <template #footer>
        <el-button @click="showResetSettingsDialog = false">取消</el-button>
        <el-button type="danger" @click="handleResetSettings">确定</el-button>
      </template>
    </el-dialog>
  </MiddleLayout>
</template>

<style lang="scss" scoped>
h1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-main {
  width: 100%;
}

.color-theme-show {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.el-select {
  width: min(300px, 100%)
}
</style>
