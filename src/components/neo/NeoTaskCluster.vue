<script setup lang="ts">
import NeoPill from './NeoPill.vue'

interface TaskItem {
  id: number | string
  title: string
  owner: string
  deadline: string
  level: string
}

defineProps<{
  title: string
  subtitle: string
  summaryLabel: string
  completionValue: string
  completionHint: string
  tasks: TaskItem[]
  primaryAction: string
  secondaryAction: string
}>()
</script>

<template>
  <view class="neo-task">
    <view class="neo-task__head">
      <view>
        <view class="neo-task__title">{{ title }}</view>
        <view class="neo-task__subtitle">{{ subtitle }}</view>
      </view>
      <NeoPill :label="summaryLabel" tone="warning" />
    </view>

    <view class="neo-task__list">
      <view
        v-for="task in tasks"
        :key="task.id"
        class="neo-task__item"
      >
        <view class="neo-task__item-main">
          <view class="neo-task__item-title">{{ task.title }}</view>
          <view class="neo-task__item-meta">{{ task.owner }} · 截止 {{ task.deadline }}</view>
        </view>
        <NeoPill :label="task.level" tone="primary" />
      </view>
    </view>

    <view class="neo-task__footer">
      <view>
        <view class="neo-task__footer-value">{{ completionValue }}</view>
        <view class="neo-task__footer-hint">{{ completionHint }}</view>
      </view>

      <view class="neo-task__actions">
        <view class="neo-task__button neo-task__button--primary">{{ primaryAction }}</view>
        <view class="neo-task__button neo-task__button--secondary">{{ secondaryAction }}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-task {
  display: grid;
  gap: 22rpx;
  border: 1rpx solid #e2d9cd;
  border-radius: 28rpx;
  background:
    radial-gradient(circle at top right, rgba(255, 196, 117, 0.18), transparent 30%),
    linear-gradient(180deg, #fffdfa 0%, #fff7ef 100%);
  padding: 28rpx;
  box-shadow: 0 18rpx 50rpx rgba(109, 66, 20, 0.08);
}

.neo-task__head,
.neo-task__footer,
.neo-task__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
}

.neo-task__title {
  color: #3d2508;
  font-size: 34rpx;
  font-weight: 800;
}

.neo-task__subtitle,
.neo-task__item-meta,
.neo-task__footer-hint {
  margin-top: 10rpx;
  color: #8a6a46;
  font-size: 24rpx;
  line-height: 1.65;
}

.neo-task__list {
  display: grid;
  gap: 14rpx;
}

.neo-task__item {
  border: 1rpx solid #f1dfc9;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.7);
  padding: 22rpx;
}

.neo-task__item-main {
  min-width: 0;
  flex: 1;
}

.neo-task__item-title,
.neo-task__footer-value {
  color: #3d2508;
  font-size: 28rpx;
  font-weight: 700;
}

.neo-task__footer {
  border-radius: 22rpx;
  background: rgba(255, 244, 230, 0.9);
  padding: 22rpx;
}

.neo-task__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12rpx;
}

.neo-task__button {
  border-radius: 999rpx;
  padding: 16rpx 24rpx;
  font-size: 24rpx;
  font-weight: 700;
}

.neo-task__button--primary {
  background: #cf6f13;
  color: #fff;
}

.neo-task__button--secondary {
  border: 1rpx solid #e9c9a6;
  background: #fff;
  color: #a45d13;
}
</style>
