<script setup lang="ts">
import NeoPill from './NeoPill.vue'

interface StatItem {
  label: string
  value: string
}

defineProps<{
  name: string
  role: string
  status: string
  company: string
  phone: string
  email: string
  stats: StatItem[]
  records: string[]
}>()
</script>

<template>
  <view class="neo-profile">
    <view class="neo-profile__head">
      <view class="neo-profile__avatar">
        <text>{{ name.slice(0, 1) }}</text>
      </view>

      <view class="neo-profile__main">
        <view class="neo-profile__name-row">
          <text class="neo-profile__name">{{ name }}</text>
          <NeoPill :label="status" tone="primary" />
        </view>
        <view class="neo-profile__role">{{ role }}</view>
      </view>
    </view>

    <view class="neo-profile__stats">
      <view
        v-for="stat in stats"
        :key="stat.label"
        class="neo-profile__stat"
      >
        <text class="neo-profile__stat-value">{{ stat.value }}</text>
        <text class="neo-profile__stat-label">{{ stat.label }}</text>
      </view>
    </view>

    <view class="neo-profile__info">
      <view class="neo-profile__info-row">
        <text class="neo-profile__info-label">公司</text>
        <text class="neo-profile__info-value">{{ company }}</text>
      </view>
      <view class="neo-profile__info-row">
        <text class="neo-profile__info-label">手机</text>
        <text class="neo-profile__info-value">{{ phone }}</text>
      </view>
      <view class="neo-profile__info-row">
        <text class="neo-profile__info-label">邮箱</text>
        <text class="neo-profile__info-value">{{ email }}</text>
      </view>
    </view>

    <view class="neo-profile__timeline">
      <view class="neo-profile__timeline-title">最近跟进</view>
      <view
        v-for="item in records"
        :key="item"
        class="neo-profile__timeline-item"
      >
        {{ item }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-profile {
  display: grid;
  gap: 22rpx;
  border: 1rpx solid #dce1f3;
  border-radius: 28rpx;
  background:
    radial-gradient(circle at top left, rgba(111, 128, 255, 0.14), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f6f7ff 100%);
  padding: 28rpx;
  box-shadow: 0 18rpx 50rpx rgba(42, 54, 116, 0.08);
}

.neo-profile__head,
.neo-profile__name-row,
.neo-profile__info-row {
  display: flex;
  align-items: center;
}

.neo-profile__head {
  gap: 18rpx;
}

.neo-profile__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 84rpx;
  height: 84rpx;
  border-radius: 26rpx;
  background: linear-gradient(135deg, #324bff 0%, #8b6bff 100%);
  color: #fff;
  font-size: 34rpx;
  font-weight: 800;
  box-shadow: 0 12rpx 30rpx rgba(67, 86, 193, 0.2);
}

.neo-profile__main {
  min-width: 0;
  flex: 1;
}

.neo-profile__name-row {
  gap: 12rpx;
  flex-wrap: wrap;
}

.neo-profile__name {
  color: #1d2440;
  font-size: 32rpx;
  font-weight: 800;
}

.neo-profile__role,
.neo-profile__info-label,
.neo-profile__timeline-item,
.neo-profile__stat-label {
  color: #667088;
  font-size: 24rpx;
  line-height: 1.65;
}

.neo-profile__role {
  margin-top: 10rpx;
}

.neo-profile__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
}

.neo-profile__stat,
.neo-profile__info,
.neo-profile__timeline {
  border: 1rpx solid #e4e8f6;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.84);
}

.neo-profile__stat {
  display: grid;
  gap: 8rpx;
  padding: 20rpx;
}

.neo-profile__stat-value,
.neo-profile__info-value,
.neo-profile__timeline-title {
  color: #1d2440;
  font-size: 26rpx;
  font-weight: 700;
}

.neo-profile__info {
  padding: 10rpx 20rpx;
}

.neo-profile__info-row {
  justify-content: space-between;
  gap: 20rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #e7ebf7;
}

.neo-profile__info-row:last-child {
  border-bottom: 0;
}

.neo-profile__timeline {
  padding: 22rpx;
}

.neo-profile__timeline-item {
  padding: 16rpx 0;
  border-bottom: 1rpx solid #e7ebf7;
}

.neo-profile__timeline-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}
</style>
