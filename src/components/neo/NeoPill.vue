<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  tone?: 'neutral' | 'primary' | 'success' | 'warning'
}>(), {
  tone: 'neutral'
})
</script>

<template>
  <view :class="['neo-pill', `neo-pill--${tone}`]">
    <text class="neo-pill__label">{{ label }}</text>
  </view>
</template>

<style lang="scss" scoped>
.neo-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44rpx;
  border: 1rpx solid transparent;
  border-radius: 999rpx;
  padding: 0 18rpx;
}

.neo-pill__label {
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 0.5rpx;
}

.neo-pill--neutral {
  border-color: #d9e0ea;
  background: #f5f7fb;
  color: #5f6b7a;
}

.neo-pill--primary {
  border-color: #bfd1ff;
  background: #eef4ff;
  color: #2352cc;
}

.neo-pill--success {
  border-color: #cdebd9;
  background: #edf9f1;
  color: #1f7a45;
}

.neo-pill--warning {
  border-color: #ffd8b0;
  background: #fff4e8;
  color: #bc5b00;
}
</style>
