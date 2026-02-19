<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import MiddleLayout from '@/components/MiddleLayout.vue';
import SingleKey from '@/components/SingleKey.vue';
import TileHelpCard from '@/components/TileHelpCard.vue';
import { TileType } from '@/types/tileType';
</script>

<template>
  <MiddleLayout>
    <h1>
      帮助
      <BackButton />
    </h1>
    <el-card>
      <template #header>操作</template>
      <div class="help-main">
        <p>
          <b>向上走：</b>
          <SingleKey name="W" />
          <singleKey name="↑" />
          或点击屏幕下方的
          <font-awesome-icon icon="fas fa-arrow-up" />
        </p>
        <p>
          <b>向下走：</b>
          <SingleKey name="S" />
          <singleKey name="↓" />
          或点击屏幕下方的
          <font-awesome-icon icon="fas fa-arrow-down" />
        </p>
        <p>
          <b>向左走：</b>
          <SingleKey name="A" />
          <singleKey name="←" />
          或点击屏幕下方的
          <font-awesome-icon icon="fas fa-arrow-left" />
        </p>
        <p>
          <b>向右走：</b>
          <SingleKey name="D" />
          <singleKey name="→" />
          或点击屏幕下方的
          <font-awesome-icon icon="fas fa-arrow-right" />
        </p>
      </div>
    </el-card>
    <el-card>
      <template #header>图块</template>
      <el-space fill wrap direction="vertical" class="tile-help-container">
        <TileHelpCard :tile="TileType.Ground" name="地板" description="普普通通的地板，可以行走" />
        <TileHelpCard :tile="TileType.Wall" name="墙壁" description="普普通通的墙壁，不可行走" />
        <TileHelpCard :tile="TileType.Trap" name="陷阱" description="千万别碰到，不然会死" />
        <TileHelpCard :tile="TileType.Jump" name="跳跃块" description="往前跳跃 2 格" />
        <TileHelpCard :tile="TileType.Goal" name="终点" description="每个关卡的目标" />
        <TileHelpCard :tile="TileType.Void" name="虚空" description="掉下去就没了" />
        <TileHelpCard :tile="TileType.Portal" name="传送门图块" description="可以传送到其他地方，不过能传送的点不一定是传送门哦~" />
        <TileHelpCard :tile="TileType.Door" name="门" description="拿钥匙才能开，不过拿到钥匙之后可能就是另外一番景象了" />
        <TileHelpCard :tile="TileType.FakeWall" name="假墙" description="看起来是墙，其实可以走" />
        <TileHelpCard :tile="TileType.HiddenGround" name="假墙" description="看起来是虚空，其实可以走（此服务器未启用飞行（（（（（（" />
        <TileHelpCard :tile="TileType.LongJump" name="超级跳跃块" description="往前跳跃 4 格" />
        <TileHelpCard :tile="TileType.Barrier" name="屏障" description="看不见摸得着，就是不给走" />
      </el-space>
    </el-card>
  </MiddleLayout>
</template>

<style lang="scss" scoped>
.el-card {
  text-align: center
}

h1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tile-help-container {
  width: 100%
}

.help-main {
  text-align: left
}
</style>
