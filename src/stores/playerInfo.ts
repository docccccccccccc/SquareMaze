import { Direction } from '@/types/directionType';
import type { PointOnMap } from '@/types/pointOnMap';
import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';

interface PlayerInfo {
  highestLevel: number;
  currentLevel: number;
  position: PointOnMap;
  hasKey: boolean;
  deaths: number;
  direction: Direction;
}

const defaultPlayerInfo: PlayerInfo = {
  highestLevel: 1,
  currentLevel: 1,
  position: {
    x: 0,
    y: 0,
  },
  hasKey: false,
  deaths: 0,
  direction: Direction.Up,
};

export const usePlayerInfoStore = defineStore('playerInfoStore', () => {
  const savedPlayerInfo = localStorage.getItem('playerInfo');
  const parsedPlayerInfo = savedPlayerInfo ? JSON.parse(savedPlayerInfo) : defaultPlayerInfo;
  if (!savedPlayerInfo) {
    localStorage.setItem('playerInfo', JSON.stringify(parsedPlayerInfo));
  }
  const playerInfo = reactive(parsedPlayerInfo);

  function tpByNumber(x: number, y: number) {
    playerInfo.position.x = x;
    playerInfo.position.y = y;
  }

  function tpByPoint(point: PointOnMap) {
    playerInfo.position = point;
  }

  function resetSave() {
    localStorage.removeItem('playerInfo');
  }

  watch(
    () => playerInfo,
    (newInfo) => {
      localStorage.setItem('playerInfo', JSON.stringify(newInfo));
    },
    { deep: true },
  );

  return {
    playerInfo,
    resetSave,
    tpByNumber,
    tpByPoint,
  };
});
