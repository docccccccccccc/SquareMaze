import type { Direction } from '@/types/directionType';
import type { PointOnMap } from '@/types/pointOnMap';
import { ref } from 'vue';

// 观察者位置
export const spectatorPosition = ref<PointOnMap>({
  x: 0,
  y: 0,
});

export class CustomLevelEditLogic {
  static moveSpectator(direction: Direction) {
    const dx =
      direction === 'up' || direction === 'down' // 是否是垂直方向
        ? 0 // 是的话水平位移就是 0
        : direction === 'left'
          ? -1
          : 1; // 不是的话就判断是左还是右

    // y 坐标变化量
    const dy =
      direction === 'left' || direction === 'right' // 是否是水平方向
        ? 0 // 是的话垂直位移就是 0
        : direction === 'up'
          ? -1
          : 1; // 不是的话就判断是上还是下

    // 算出下一个位置
    spectatorPosition.value = {
      x: spectatorPosition.value.x + dx,
      y: spectatorPosition.value.y + dy,
    };
  }
}
