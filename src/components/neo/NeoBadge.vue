<script setup lang="ts">
withDefaults(defineProps<{
  value?: string
  dot?: boolean
  tone?: 'primary' | 'danger' | 'success'
}>(), {
  value: '',
  dot: false,
  tone: 'primary'
})
</script>

<template>
  <view :class="['neo-badge', `neo-badge--${tone}`, { 'neo-badge--dot': dot }]">
    <text v-if="!dot" class="neo-badge__text">{{ value }}</text>
  </view>
</template>

<style lang="scss" scoped>
.neo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38rpx;
  height: 38rpx;
  border-radius: 999rpx;
  padding: 0 12rpx;
}

.neo-badge--dot {
  min-width: 18rpx;
  width: 18rpx;
  height: 18rpx;
  padding: 0;
}

.neo-badge__text {
  color: #fff;
  font-size: 20rpx;
  font-weight: 800;
}

.neo-badge--primary {
  background: linear-gradient(135deg, #4a72ff 0%, #6f7bff 100%);
}

.neo-badge--danger {
  background: linear-gradient(135deg, #ff5c7a 0%, #ff7b5c 100%);
}

.neo-badge--success {
  background: linear-gradient(135deg, #19a15f 0%, #4dc46e 100%);
}
</style>
