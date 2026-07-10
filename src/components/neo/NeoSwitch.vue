<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  label?: string
  description?: string
}>(), {
  label: '',
  description: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle(currentValue: boolean) {
  emit('update:modelValue', !currentValue)
}
</script>

<template>
  <view class="neo-switch" @click="toggle(modelValue)">
    <view class="neo-switch__main">
      <text v-if="label" class="neo-switch__label">{{ label }}</text>
      <text v-if="description" class="neo-switch__description">{{ description }}</text>
    </view>

    <view :class="['neo-switch__track', { 'neo-switch__track--active': modelValue }]">
      <view :class="['neo-switch__thumb', { 'neo-switch__thumb--active': modelValue }]" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  border: 1rpx solid #e1e8f4;
  border-radius: 24rpx;
  background: #fff;
  padding: 22rpx 24rpx;
}

.neo-switch__main {
  min-width: 0;
  flex: 1;
}

.neo-switch__label {
  display: block;
  color: #182235;
  font-size: 28rpx;
  font-weight: 800;
}

.neo-switch__description {
  display: block;
  margin-top: 8rpx;
  color: #6b7586;
  font-size: 24rpx;
  line-height: 1.6;
}

.neo-switch__track {
  position: relative;
  flex-shrink: 0;
  width: 104rpx;
  height: 60rpx;
  border-radius: 999rpx;
  background: #d7deeb;
  transition: background 0.2s ease;
}

.neo-switch__track--active {
  background: linear-gradient(135deg, #406cff 0%, #6f7cff 100%);
}

.neo-switch__thumb {
  position: absolute;
  top: 6rpx;
  left: 6rpx;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 10rpx 24rpx rgba(30, 41, 59, 0.16);
  transition: transform 0.2s ease;
}

.neo-switch__thumb--active {
  transform: translateX(44rpx);
}
</style>
