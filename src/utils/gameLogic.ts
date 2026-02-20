// 几个破逻辑就 import 了这么多东西……
import type { LevelData } from '@/types/levelInterface'; // 关卡数据接口
import { TileType } from '@/types/tileType'; // 图块类型
import { getLevels, getLevelById } from './loadLevel';
import type { PointOnMap } from '@/types/pointOnMap'; // 坐标接口
import { sfxPlayers } from './sfxPlayers'; // 播放音效
// 玩家信息
import { storeToRefs } from 'pinia';
import { usePlayerInfoStore } from '@/stores/playerInfo';
import type { Direction } from '@/types/directionType';
import { ElMessageBox } from 'element-plus';
import router from '@/router';
import { nextTick } from 'vue';
const playerInfoStore = usePlayerInfoStore();
const { playerInfo } = storeToRefs(playerInfoStore);

/**
 * 兄弟们，
 * 真没招了……
 * 既然要开源的话，
 * 我也不用多想着怎么反作弊了，
 * 反正总有人能找到破解方法.
 * 不说了，
 * 你们自己看着办吧，
 * 跳关啥的我也管不了了.
 * 话虽如此，
 * 我还是希望你们享受游戏的乐趣.
 */

export class GameLogic {
  // 获取当前地图信息
  static getCurrentMap() {
    const level = this.getCurrentLevel();
    if (!level) {
      console.warn('获取 id 为', playerInfo.value.currentLevel, '的关卡地图时出错：关卡不存在');
      return null;
    }

    if (level.mapData.afterGettingKey && playerInfo.value.hasKey) {
      // 拿到钥匙且有对应地图就返回拿到钥匙对应的地图
      return level.mapData.afterGettingKey;
    }
    return level.mapData.default;
  }

  // 获取图块类型
  static getTileType(position: PointOnMap): number | null {
    const level = this.getCurrentLevel();

    if (!level) {
      console.warn('获取 id 为 ', playerInfo.value.currentLevel, ' 的关卡数据时出错：关卡不存在');
      return null;
    }

    const levelMap = this.getCurrentMap();

    if (!levelMap) {
      console.warn(
        '获取 id 为 ',
        playerInfo.value.currentLevel,
        ' 的关卡地图的图块数据时出错：地图不存在',
      );
      return null;
    }

    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x >= level.width ||
      position.y >= level.height
    ) {
      console.warn(
        `获取 id 为 ${playerInfo.value.currentLevel} 的地图的图块数据时出错：坐标 (${position.x}, ${position.y}) 越界（也可能是你碰到边界了）`,
      );
      return null;
    }

    if ((levelMap[position.y] as TileType[])[position.x] === undefined) {
      return null;
    } else {
      return (levelMap[position.y] as TileType[])[position.x] as number;
    }
  }

  // 获取当前关卡信息
  static getCurrentLevel(): LevelData | null {
    const allLevels = getLevels();
    const result = allLevels.find((level) => level.id === playerInfo.value.currentLevel);
    if (result === undefined) {
      return null;
    }
    return result;
  }

  // 按关卡 ID 获取关卡信息
  static getLevelById(levelId: number): LevelData | null {
    const level = getLevelById(levelId);
    return level ?? null;
  }

  // 根据图块类型获取其对应的 className
  static getTileClassName(tileType: TileType) {
    let result: string = '';
    switch (tileType) {
      case TileType.Ground:
        result = 'ground';
        break;
      case TileType.Wall:
        result = 'wall';
        break;
      case TileType.Trap:
        result = 'trap';
        break;
      case TileType.Jump:
        result = 'jump';
        break;
      case TileType.Goal:
        result = 'goal';
        break;
      case TileType.Void:
        result = 'void';
        break;
      case TileType.Portal:
        result = 'portal';
        break;
      case TileType.Door:
        result = 'door';
        break;
      case TileType.FakeWall:
        result = 'fake-wall';
        break;
      case TileType.HiddenGround:
        result = 'hidden-ground';
        break;
      case TileType.LongJump:
        result = 'long-jump';
        break;
      case TileType.Barrier:
        result = 'barrier';
        break;
      default:
        result = 'ground';
        break;
    }
    return `tile-${result}`;
  }

  // 传送到某个关卡
  static goToLevel(levelId: number) {
    const levelData = getLevelById(levelId);

    if (levelData) {
      playerInfoStore.playerInfo.currentLevel = levelId;
      // 传送到下一关的起始点
      playerInfoStore.tpByPoint((this.getLevelById(levelId) as LevelData).startPosition);
      // 如果当前关卡数超过最高关卡就同步
      if (playerInfo.value.currentLevel > playerInfo.value.highestLevel) {
        playerInfo.value.highestLevel = playerInfo.value.currentLevel;
      }
      // 重置钥匙状态
      playerInfo.value.hasKey = false;
    }
  }

  static move(direction: Direction, distance?: number) {
    // 发送一个移动请求
    // 可能整个游戏的逻辑都在这里了 (((
    // 先算坐标
    // x 坐标变化量
    const dis = distance ?? 1;
    const dx =
      direction === 'up' || direction === 'down' // 是否是垂直方向
        ? 0 // 是的话水平位移就是 0
        : direction === 'left'
          ? -dis
          : dis; // 不是的话就判断是左还是右

    // y 坐标变化量
    const dy =
      direction === 'left' || direction === 'right' // 是否是水平方向
        ? 0 // 是的话垂直位移就是 0
        : direction === 'up'
          ? -dis
          : dis; // 不是的话就判断是上还是下

    // 算出下一个图块的位置
    const nextTilePosition: PointOnMap = {
      x: playerInfo.value.position.x + dx,
      y: playerInfo.value.position.y + dy,
    };

    // 然后获取下一个图块的 ID
    const nextTileType = this.getTileType(nextTilePosition);
    // 如果下一个图块存在
    if (nextTileType !== null) {
      // 处理逻辑
      if (
        // 如果前面可移动
        // 不可前进至墙、屏障、门
        nextTileType !== TileType.Wall &&
        nextTileType !== TileType.Barrier &&
        nextTileType !== TileType.Door
      ) {
        // 设置方向
        playerInfo.value.direction = direction;
        playerInfo.value.position = nextTilePosition;
        // 处理移动事件
        this.handleMovement(nextTileType);
      }
    }
  }

  static handleMovement(tileType: TileType) {
    // 碰到陷阱或虚空
    if (tileType === TileType.Trap || tileType === TileType.Void) {
      // 快速回城
      playerInfoStore.tpByPoint((this.getCurrentLevel() as LevelData).startPosition);
      sfxPlayers.play('dead');
      // 死亡次数加一
      playerInfo.value.deaths += 1;
      playerInfo.value.hasKey = false;
    }

    // 碰到终点
    if (tileType === TileType.Goal) {
      // 关卡数 + 1
      const allLevels = getLevels();
      if (playerInfo.value.currentLevel < allLevels.length) {
        playerInfo.value.currentLevel += 1;
        this.goToLevel(playerInfo.value.currentLevel);
        sfxPlayers.play('nextLevel');
      } else {
        ElMessageBox.alert('你已通关游戏！请等待后续更新', '恭喜通关！', {
          confirmButtonText: '确定',
          callback: () => {
            router.push({ path: '/' }).then(async () => {
              await nextTick();
              playerInfo.value.isNewSave = false;
              playerInfo.value.position.x = this.getCurrentLevel()?.startPosition.x;
              playerInfo.value.position.y = this.getCurrentLevel()?.startPosition.y;
              playerInfo.value.hasKey = false;
              location.reload();
            });
          },
        });
      }
    }

    // 碰到传送门
    // 获取传送门信息
    const portalInfo = this.getCurrentLevel()?.portalInfo;
    if (portalInfo) {
      // 当前碰到的传送门
      const currentPortal = portalInfo.find(
        (portal) =>
          portal.from.x === playerInfo.value.position.x &&
          portal.from.y === playerInfo.value.position.y,
      );
      // 如果传送门存在
      if (currentPortal) {
        // 传送
        playerInfoStore.tpByPoint(currentPortal.to);
        const currentTileType = this.getTileType(playerInfo.value.position);
        if (
          currentTileType &&
          !portalInfo.find((portal) => portal.from === playerInfo.value.position)
        ) {
          // 还有递归，但是不给无限循环！
          this.handleMovement(currentTileType);
        }
        // 播放音效
        sfxPlayers.play('warp');
      }
    }

    // 碰到跳跃块
    if (tileType === TileType.Jump) {
      this.move(playerInfo.value.direction, 2);
      sfxPlayers.play('jump');
    }

    // 碰到超级跳跃块
    if (tileType === TileType.LongJump) {
      this.move(playerInfo.value.direction, 4);
      sfxPlayers.play('jump');
    }

    // 处理钥匙逻辑
    const keyPosition = this.getCurrentLevel()?.keyPosition;
    // 如果真的有钥匙，并且碰到了钥匙
    if (
      keyPosition &&
      playerInfo.value.position.x === keyPosition.x &&
      playerInfo.value.position.y === keyPosition.y &&
      !playerInfo.value.hasKey
    ) {
      playerInfo.value.hasKey = true;
      sfxPlayers.play('door');
    }
  }
}

// 先注释掉，万一以后用得上呢？
// export class GameValidator {
//   static isValidMove(from: PointOnMap, to: PointOnMap, levelId: number): boolean {
//     const level = GameLogic.getLevelById(levelId);
//     const levelMap = GameLogic.getCurrentMapById(levelId);

//     if (!level) {
//       console.warn('判断移动合法性时出错：关卡不存在');
//       return false;
//     }

//     if (!levelMap) {
//       console.warn('判断移动合法性时出错：地图不存在');
//       return false;
//     }

//     // 检测是否越界
//     if (to.x < 0 || to.x >= level.width || to.y < 0 || to.y >= level.height) {
//       return false;
//     }

//     // 检测目标位置是否为墙壁
//     const target = (levelMap[to.y] as TileType[])[to.x];
//     if (target === TileType.Barrier || target === TileType.Wall || target === TileType.Door) {
//       return false;
//     }

//     const dx = Math.abs(from.x - to.x);
//     const dy = Math.abs(from.y - to.y);
//     return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
//   }

//   static isLevelCompleted(levelId: number): boolean {
//     return (
//       GameLogic.getTileValue(levelId, playerInfo.value.position.x, playerInfo.value.position.y) ===
//       TileType.Goal
//     );
//   }
// }
