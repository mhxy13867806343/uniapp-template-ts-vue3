<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { useAppEnv } from '@/hooks/useAppEnv'
import { usePlatform } from '@/hooks/usePlatform'
import { useAppStore } from '@/store'
import { navigateToExample } from '@/utils/exampleScenarios'

const appStore = useAppStore()
const { appEnv } = useAppEnv()
const { platform } = usePlatform()

const metrics = [
  { label: '今日订单', value: '128', trend: '+18%' },
  { label: '待处理', value: '24', trend: '-6%' },
  { label: '成交额', value: '¥56.8k', trend: '+12%' },
  { label: '活跃用户', value: '8,642', trend: '+9%' }
]

const shortcuts = [
  { title: '客户录入', path: 'basic', icon: 'edit-outline' },
  { title: '商品下单', path: 'junior', icon: 'cart' },
  { title: '审批中心', path: 'intermediate', icon: 'check' },
  { title: '运营看板', path: 'advanced', icon: 'chart' }
]

const tasks = [
  { title: '小程序审核资料待确认', value: '2 小时内', type: 'warning' },
  { title: 'App 端异常日志待复盘', value: '进行中', type: 'primary' },
  { title: 'H5 活动页数据待归档', value: '今天', type: 'success' }
] as const

const channels = [
  { name: 'H5', progress: 92 },
  { name: '微信小程序', progress: 86 },
  { name: '抖音小程序', progress: 74 },
  { name: '鸿蒙 App', progress: 68 }
]

appStore.markReady()
</script>

<template>
  <PageShell title="工作台" description="面向多端业务应用的首页模板，集中展示经营数据、任务和快捷入口。">
    <view class="home-dashboard">
      <view class="hero-card">
        <view>
          <view class="hero-title">{{ appStore.title }}</view>
          <view class="hero-desc">{{ platform.name }} / {{ appEnv.mode }} / {{ appEnv.apiBaseUrl }}</view>
        </view>
        <wd-tag type="primary">运行中</wd-tag>
      </view>

      <view class="metric-grid">
        <view
          v-for="item in metrics"
          :key="item.label"
          class="metric-card"
        >
          <view class="metric-label">{{ item.label }}</view>
          <view class="metric-value">{{ item.value }}</view>
          <wd-tag :type="item.trend.startsWith('+') ? 'success' : 'danger'" plain>{{ item.trend }}</wd-tag>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head">
          <text>快捷入口</text>
          <wd-button size="small" type="primary" plain @click="navigateToExample('complex')">复杂场景</wd-button>
        </view>
        <view class="shortcut-grid">
          <view
            v-for="item in shortcuts"
            :key="item.title"
            class="shortcut-item"
            @click="navigateToExample(item.path)"
          >
            <wd-icon :name="item.icon" size="24px" custom-class="shortcut-icon" />
            <text>{{ item.title }}</text>
          </view>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head">
          <text>多端健康度</text>
          <wd-tag plain>{{ channels.length }} 端</wd-tag>
        </view>
        <view
          v-for="item in channels"
          :key="item.name"
          class="channel-row"
        >
          <view class="channel-title">
            <text>{{ item.name }}</text>
            <text>{{ item.progress }}%</text>
          </view>
          <wd-progress :percentage="item.progress" />
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head">
          <text>今日待办</text>
          <wd-tag type="warning" plain>{{ tasks.length }}</wd-tag>
        </view>
        <wd-cell-group border>
          <wd-cell
            v-for="task in tasks"
            :key="task.title"
            :title="task.title"
            :value="task.value"
            is-link
          >
            <template #icon>
              <wd-tag :type="task.type" custom-class="task-tag">待办</wd-tag>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.home-dashboard {
  display: grid;
  gap: 24rpx;
}

.hero-card,
.metric-card,
.panel-section {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
}

.hero-card {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  padding: 32rpx;
}

.hero-title,
.section-head {
  color: var(--app-ink);
  font-weight: 700;
}

.hero-title {
  font-size: 38rpx;
}

.hero-desc {
  margin-top: 12rpx;
  color: var(--app-muted);
  font-size: 24rpx;
  line-height: 1.6;
}

.metric-grid,
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.metric-card,
.panel-section {
  padding: 28rpx;
}

.metric-label,
.channel-title {
  color: var(--app-muted);
  font-size: 26rpx;
}

.metric-value {
  margin: 12rpx 0;
  color: var(--app-ink);
  font-size: 38rpx;
  font-weight: 800;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-size: 32rpx;
}

.shortcut-item {
  display: grid;
  justify-items: center;
  gap: 12rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
  padding: 24rpx 12rpx;
  color: var(--app-ink);
  font-size: 26rpx;
}

:deep(.shortcut-icon) {
  color: var(--app-brand);
}

.channel-row {
  display: grid;
  gap: 12rpx;
  margin-top: 22rpx;
}

.channel-title {
  display: flex;
  justify-content: space-between;
}

:deep(.task-tag) {
  margin-right: 12rpx;
}
</style>
