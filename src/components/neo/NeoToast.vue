<script setup lang="ts">
withDefaults(defineProps<{
  message: string
  tone?: 'primary' | 'success' | 'warning'
}>(), {
  tone: 'primary'
})
</script>

<template>
  <view :class="['neo-toast', `neo-toast--${tone}`]">
    <view class="neo-toast__dot" />
    <text class="neo-toast__message">{{ message }}</text>
  </view>
</template>

<style lang="scss" scoped>
.neo-toast {
  display: inline-flex;
  align-items: center;
  gap: 14rpx;
  min-height: 74rpx;
  border-radius: 999rpx;
  padding: 0 24rpx;
  box-shadow: 0 18rpx 36rpx rgba(18, 24, 39, 0.16);
}

.neo-toast__dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: currentColor;
}

.neo-toast__message {
  font-size: 24rpx;
  font-weight: 700;
}

.neo-toast--primary {
  background: rgba(18, 24, 39, 0.92);
  color: #fff;
}

.neo-toast--success {
  background: rgba(15, 113, 59, 0.94);
  color: #fff;
}

.neo-toast--warning {
  background: rgba(163, 87, 16, 0.94);
  color: #fff7ed;
}
</style>
