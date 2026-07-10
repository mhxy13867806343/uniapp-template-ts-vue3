<script setup lang="ts">
interface TimelineItem {
  title: string
  time: string
  description?: string
  status?: 'done' | 'active' | 'pending'
}

defineProps<{
  items: TimelineItem[]
}>()
</script>

<template>
  <view class="neo-timeline">
    <view
      v-for="(item, index) in items"
      :key="`${item.title}-${index}`"
      class="neo-timeline__item"
    >
      <view class="neo-timeline__rail">
        <view :class="['neo-timeline__dot', `neo-timeline__dot--${item.status || 'pending'}`]" />
        <view
          v-if="index !== items.length - 1"
          class="neo-timeline__line"
        />
      </view>

      <view class="neo-timeline__content">
        <view class="neo-timeline__row">
          <text class="neo-timeline__title">{{ item.title }}</text>
          <text class="neo-timeline__time">{{ item.time }}</text>
        </view>
        <text v-if="item.description" class="neo-timeline__description">{{ item.description }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-timeline {
  display: grid;
  gap: 0;
}

.neo-timeline__item {
  display: flex;
  gap: 18rpx;
}

.neo-timeline__rail {
  display: grid;
  justify-items: center;
  width: 30rpx;
}

.neo-timeline__dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  margin-top: 8rpx;
}

.neo-timeline__dot--done {
  background: #35b46c;
}

.neo-timeline__dot--active {
  background: #4a72ff;
  box-shadow: 0 0 0 8rpx rgba(74, 114, 255, 0.14);
}

.neo-timeline__dot--pending {
  background: #d7deea;
}

.neo-timeline__line {
  width: 2rpx;
  flex: 1;
  min-height: 68rpx;
  background: #e5ebf4;
}

.neo-timeline__content {
  flex: 1;
  padding-bottom: 24rpx;
}

.neo-timeline__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.neo-timeline__title {
  color: #182235;
  font-size: 27rpx;
  font-weight: 800;
}

.neo-timeline__time {
  flex-shrink: 0;
  color: #7d8798;
  font-size: 22rpx;
}

.neo-timeline__description {
  display: block;
  margin-top: 10rpx;
  color: #687487;
  font-size: 23rpx;
  line-height: 1.7;
}
</style>
