import { Audio } from 'ts-audio';
import { useGlobalSettingsStore } from '@/stores/globalSettings';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

class musicManager {
  private player: Record<string, any> = {};

  constructor() {
    // 初始化
    this.initPlayers();
    // 先转化成 ref
    const { globalSettings } = storeToRefs(useGlobalSettingsStore());
    // 然后监听变化
    watch(
      () => globalSettings.value.media.musicEnabled,
      () => {},
    );
  }

  private initPlayers() {
    // 先是音量
    const baseVolume = useGlobalSettingsStore().globalSettings.media.musicEnabled
      ? useGlobalSettingsStore().globalSettings.media.musicVolume / 100
      : 0;

    // 然后是播放器
    this.player = Audio({
      file: '/music/bgm.mp3',
      volume: baseVolume,
      loop: true,
      preload: true,
    });
  }

  get() {
    return this.player;
  }

  play() {
    const player = this.player;
    if (player && useGlobalSettingsStore().globalSettings.media.musicEnabled) {
      // 存在且开启音乐就播放
      player.play();
    }
  }

  stop() {
    if (this.player.isPlaying) {
      this.player.stop();
    }
  }

  updateMusicState() {
    const settings = useGlobalSettingsStore();
    const { globalSettings } = storeToRefs(settings);
    const volume = globalSettings.value.media.musicEnabled
      ? globalSettings.value.media.musicVolume / 100
      : 0;

    Object.values(this.player).forEach((player) => {
      if (player.volume !== undefined) {
        player.volume = volume;
      }
    });
  }
}

export const musicPlayer = new musicManager();
