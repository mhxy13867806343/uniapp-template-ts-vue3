<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const checklist = [
  '使用 HBuilderX 打开项目根目录',
  '执行 pnpm install 安装依赖',
  'H5 调试可使用 pnpm dev:h5',
  '小程序/App 发行使用对应 build 脚本后进入 unpackage',
  '本地私有配置写入 .env.local 或 .env.*.local'
]

const commands = [
  'pnpm dev:h5',
  'pnpm dev:mp-weixin',
  'pnpm dev:mp-toutiao',
  'pnpm dev:app-harmony'
]
</script>

<template>
  <PageShell title="HBX 模板" description="保留 HBuilderX 使用路径，也兼容纯命令行开发。">
    <view class="grid gap-3">
      <view class="panel">
        <view class="font-700 mb-3">使用清单</view>
        <wd-cell-group border>
          <wd-cell
            v-for="item in checklist"
            :key="item"
            :title="item"
          />
        </wd-cell-group>
      </view>

      <view class="panel">
        <view class="font-700 mb-3">常用命令</view>
        <view class="command-list">
          <view
            v-for="item in commands"
            :key="item"
            class="command-item"
          >
            {{ item }}
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.command-list {
  display: grid;
  gap: 14rpx;
}

.command-item {
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
  background: #f8fafc;
  color: var(--app-ink);
  font-family: monospace;
  font-size: 25rpx;
  padding: 18rpx 20rpx;
}
</style>
