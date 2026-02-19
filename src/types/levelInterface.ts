import type { PointOnMap } from '@/types/pointOnMap';
import type { PortalInfo } from '@/types/portalInfo';
import type { TileType } from '@/types/tileType';

export interface LevelData {
  id: number;
  name: string;
  width: number;
  height: number;
  mapData: {
    default: TileType[][];
    afterGettingKey?: TileType[][];
  };
  startPosition: PointOnMap;
  portalInfo?: PortalInfo[];
  keyPosition?: PointOnMap;
}
