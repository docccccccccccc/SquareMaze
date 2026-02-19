import { Audio } from 'ts-audio';
import { useGlobalSettingsStore } from '@/stores/globalSettings';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

class SFXManager {
  private players: Record<string, any> = {};

  constructor() {
    // 初始化
    this.initPlayers();
    // 先转化成 ref
    const { globalSettings } = storeToRefs(useGlobalSettingsStore());
    // 然后监听变化
    watch(
      () => globalSettings.value.media.sfxVolume,
      () => {},
    );
  }

  private initPlayers() {
    // 先是音量
    const baseVolume = useGlobalSettingsStore().globalSettings.media.sfxEnabled
      ? useGlobalSettingsStore().globalSettings.media.sfxVolume / 100
      : 0;

    // 然后是各个播放器
    this.players = {
      hover: Audio({
        file: '/sfx/hover.mp3',
        volume: baseVolume,
        loop: false,
        preload: true,
      }),
      openUI: Audio({
        file: '/sfx/openUI.mp3',
        volume: baseVolume,
        loop: false,
        preload: true,
      }),
      warp: Audio({
        file: '/sfx/warp.mp3',
        volume: baseVolume,
        loop: false,
        preload: true,
      }),
      nextLevel: Audio({
        file: '/sfx/nextLevel.mp3',
        volume: baseVolume,
        loop: false,
        preload: true,
      }),
      error: Audio({
        file: '/sfx/error.mp3',
        volume: baseVolume,
        loop: false,
        preload: true,
      }),
      dead: Audio({
        file: '/sfx/dead.mp3',
        volume: baseVolume,
        loop: false,
        preload: true,
      }),
      door: Audio({
        file: '/sfx/door.mp3',
        volume: baseVolume,
        loop: false,
        preload: true,
      }),
      jump: Audio({
        file: '/sfx/jump.mp3',
        volume: baseVolume,
        loop: false,
        preload: true,
      }),
    };
  }

  get(name: string) {
    return this.players[name];
  }

  play(name: string) {
    const player = this.players[name];
    if (player && useGlobalSettingsStore().globalSettings.media.sfxEnabled) {
      // 存在且开启音效就播放
      player.play();
    }
  }

  updateSFXState() {
    const settings = useGlobalSettingsStore();
    const { globalSettings } = storeToRefs(settings);
    const volume = globalSettings.value.media.sfxEnabled
      ? globalSettings.value.media.sfxVolume / 100
      : 0;

    Object.values(this.players).forEach((player) => {
      if (player.volume !== undefined) {
        player.volume = volume;
      }
    });
  }
}

export const sfxPlayers = new SFXManager();
