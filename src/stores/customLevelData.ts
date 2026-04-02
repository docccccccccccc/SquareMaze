import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';
import type { LevelData } from '@/types/levelInterface';

const defaultCustomLevelData: LevelData = {
  id: 1000000, // 别问我为什么取这么高的数值
  name: '',
  width: 0,
  height: 0,
  mapData: {
    default: [],
  },
  startPosition: {
    x: 0,
    y: 0,
  },
};

export const useCustomLevelDataStore = defineStore('customLevelDataStore', () => {
  const savedCustomLevelData = localStorage.getItem('customLevelData'); // 从 localstorage 取出数据
  const savedCreationStatus = localStorage.getItem('isCustomLevelCreated'); // 以及状态
  // 然后 init，找不到就默认
  const initialCustomLevelData = savedCustomLevelData
    ? (JSON.parse(savedCustomLevelData) as LevelData)
    : defaultCustomLevelData;

  const initialCreationStatus = savedCreationStatus
    ? JSON.parse(savedCreationStatus)
    : { status: false };

  // 然后再设置
  const customLevelData = reactive(initialCustomLevelData);
  const creationStatus = ref(initialCreationStatus);

  // 监听变化
  watch(
    () => customLevelData,
    (newData) => {
      localStorage.setItem('customLevelData', JSON.stringify(newData));
    },
    { deep: true },
  );

  function clearCustomLevelData() {
    // 创建默认自定义关卡数据的深拷贝
    const freshCopy = JSON.parse(JSON.stringify(defaultCustomLevelData));

    // 清空现有 reactive 对象并重新填充
    Object.keys(customLevelData).forEach((key) => {
      delete customLevelData[key as keyof LevelData];
    });

    Object.assign(customLevelData, freshCopy);

    creationStatus.value.status = false;
  }

  return {
    customLevelData,
    clearCustomLevelData,
    creationStatus,
  };
});
