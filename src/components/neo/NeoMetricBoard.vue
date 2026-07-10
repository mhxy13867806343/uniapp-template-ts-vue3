<script setup lang="ts">
import NeoPill from './NeoPill.vue'

interface MetricItem {
  label: string
  value: string
  meta?: string
}

interface ActionItem {
  label: string
  detail: string
}

interface ProgressItem {
  name: string
  percent: number
}

const props = defineProps<{
  title: string
  subtitle: string
  statusLabel?: string
  metrics: MetricItem[]
  actions: ActionItem[]
  channels: ProgressItem[]
}>()

const safeChannels = computed(() => {
  return props.channels.map(item => ({
    ...item,
    percent: Math.max(0, Math.min(100, Number(item.percent) || 0))
  }))
})
</script>

<template>
  <view class="neo-board">
    <view class="neo-board__head">
      <view>
        <view class="neo-board__title">{{ title }}</view>
        <view class="neo-board__subtitle">{{ subtitle }}</view>
      </view>
      <NeoPill v-if="statusLabel" :label="statusLabel" tone="success" />
    </view>

    <view class="neo-board__metrics">
      <view
        v-for="metric in metrics"
        :key="metric.label"
        class="neo-board__metric"
      >
        <text class="neo-board__metric-value">{{ metric.value }}</text>
        <text class="neo-board__metric-label">{{ metric.label }}</text>
        <text v-if="metric.meta" class="neo-board__metric-meta">{{ metric.meta }}</text>
      </view>
    </view>

    <view class="neo-board__panel">
      <view class="neo-board__panel-title">渠道进度</view>
      <view
        v-for="channel in safeChannels"
        :key="channel.name"
        class="neo-board__progress-row"
      >
        <text class="neo-board__progress-name">{{ channel.name }}</text>
        <view class="neo-board__progress-track">
          <view
            class="neo-board__progress-bar"
            :style="{ width: `${channel.percent}%` }"
          />
        </view>
        <text class="neo-board__progress-value">{{ channel.percent }}%</text>
      </view>
    </view>

    <view class="neo-board__actions">
      <view
        v-for="action in actions"
        :key="action.label"
        class="neo-board__action"
      >
        <text class="neo-board__action-name">{{ action.label }}</text>
        <text class="neo-board__action-detail">{{ action.detail }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-board {
  display: grid;
  gap: 22rpx;
  border: 1rpx solid #d9e1ec;
  border-radius: 28rpx;
  background:
    radial-gradient(circle at top left, rgba(71, 120, 255, 0.12), transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f6f9fc 100%);
  padding: 28rpx;
  box-shadow: 0 18rpx 50rpx rgba(25, 40, 78, 0.08);
}

.neo-board__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.neo-board__title {
  color: #162033;
  font-size: 34rpx;
  font-weight: 800;
  line-height: 1.25;
}

.neo-board__subtitle {
  margin-top: 10rpx;
  color: #6a7485;
  font-size: 24rpx;
  line-height: 1.65;
}

.neo-board__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.neo-board__metric,
.neo-board__panel,
.neo-board__action {
  border: 1rpx solid #e3eaf3;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.86);
}

.neo-board__metric {
  display: grid;
  gap: 8rpx;
  padding: 22rpx;
}

.neo-board__metric-value {
  color: #162033;
  font-size: 34rpx;
  font-weight: 800;
}

.neo-board__metric-label,
.neo-board__metric-meta,
.neo-board__progress-name,
.neo-board__progress-value,
.neo-board__action-detail {
  color: #6a7485;
  font-size: 23rpx;
}

.neo-board__panel {
  padding: 24rpx;
}

.neo-board__panel-title,
.neo-board__action-name {
  color: #162033;
  font-size: 26rpx;
  font-weight: 700;
}

.neo-board__progress-row {
  display: grid;
  grid-template-columns: 96rpx minmax(0, 1fr) 72rpx;
  align-items: center;
  gap: 14rpx;
  margin-top: 18rpx;
}

.neo-board__progress-track {
  overflow: hidden;
  height: 14rpx;
  border-radius: 999rpx;
  background: #e8eef6;
}

.neo-board__progress-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #295dff 0%, #4d89ff 100%);
}

.neo-board__actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
}

.neo-board__action {
  display: grid;
  gap: 8rpx;
  padding: 20rpx 18rpx;
}
</style>
