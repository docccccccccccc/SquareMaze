import type { LevelData } from '@/types/levelInterface';
import { ref } from 'vue';

interface LevelIndex {
  levels: string[];
}

let loadedLevels: LevelData[] = [];

// 加载关卡列表

export const loadLevels = async (): Promise<LevelData[]> => {
  try {
    // 先加载索引文件
    const indexResponse = await fetch('/levels/index.json');
    if (!indexResponse.ok) {
      loadingIsSuccessful.value = false;
      loadingErrorInfo.value = `加载关卡索引时出现错误：${indexResponse.status}`;
      throw new Error(`加载关卡索引时出现错误：${indexResponse.status}`);
    }

    const levelIndex: LevelIndex = await indexResponse.json();

    // 然后把所有关卡文件一起加载
    const levelPromises = levelIndex.levels.map(async (levelEntry) => {
      const levelResponse = await fetch(`/levels/${levelEntry}`);
      if (!levelResponse.ok) {
        loadingIsSuccessful.value = false;
        loadingErrorInfo.value = `加载关卡文件 ${levelEntry} 时出现错误：${levelResponse.status}`;
        throw new Error(`加载关卡文件 ${levelEntry} 时出现错误：${levelResponse.status}`);
      }

      const levelData: LevelData = await levelResponse.json();
      loadingIsSuccessful.value = true;
      return levelData;
    });

    loadedLevels = await Promise.all(levelPromises);
    return loadedLevels;
  } catch (error) {
    loadingIsSuccessful.value = false;
    console.error('加载关卡数据时出现错误：', error);
    loadingErrorInfo.value = error as string;
    return [];
  }
};

// 获取所有已加载的关卡

export const getLevels = (): LevelData[] => {
  return loadedLevels;
};

export const getLevelById = (id: number): LevelData | null => {
  const result = loadedLevels.find((level) => level.id === id);
  if (result) {
    return result;
  }
  return null;
};

export const loadingIsSuccessful = ref<boolean | null>(null);
export const loadingErrorInfo = ref<string>();
