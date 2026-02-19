import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';
interface Settings {
  media: {
    sfxEnabled: boolean;
    musicEnabled: boolean;
    sfxVolume: number;
    musicVolume: number;
  };
  appearance: {
    tileColorTheme: string;
    tilePatternTheme: string;
  };
  gamePlay: {
    dontNotifyOnExit: false;
  };
}

const defaultSettings: Settings = {
  media: {
    sfxEnabled: true,
    musicEnabled: true,
    sfxVolume: 50,
    musicVolume: 50,
  },
  appearance: {
    tileColorTheme: 'smooth',
    tilePatternTheme: 'classic',
  },
  gamePlay: {
    dontNotifyOnExit: false,
  },
};

export const useGlobalSettingsStore = defineStore('globalSettingsStore', () => {
  const savedSettings = localStorage.getItem('globalSettings');
  const initialSettings = savedSettings ? (JSON.parse(savedSettings) as Settings) : defaultSettings;
  const globalSettings = reactive(initialSettings);

  watch(
    () => globalSettings.appearance.tileColorTheme,
    (newTheme) => {
      if (newTheme) {
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    },
    { immediate: true },
  );

  watch(
    () => globalSettings,
    (newSettings) => {
      localStorage.setItem('globalSettings', JSON.stringify(newSettings));
    },
    { deep: true },
  );

  function resetSettings() {
    // 创建默认设置的深拷贝
    const freshCopy = JSON.parse(JSON.stringify(defaultSettings));

    // 清空现有 reactive 对象并重新填充
    Object.keys(globalSettings).forEach((key) => {
      delete globalSettings[key];
    });

    Object.assign(globalSettings, freshCopy);
  }

  return {
    globalSettings,
    resetSettings,
  };
});
