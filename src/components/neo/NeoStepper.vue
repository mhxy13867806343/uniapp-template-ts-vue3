<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
}>(), {
  min: 0,
  max: 999,
  step: 1
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function updateValue(nextValue: number) {
  const safeValue = Math.max(props.min, Math.min(props.max, nextValue))
  emit('update:modelValue', safeValue)
}

function minus() {
  updateValue(props.modelValue - props.step)
}

function plus() {
  updateValue(props.modelValue + props.step)
}
</script>

<template>
  <view class="neo-stepper">
    <view
      :class="['neo-stepper__button', { 'neo-stepper__button--disabled': modelValue <= min }]"
      @click="minus"
    >
      <text>-</text>
    </view>

    <view class="neo-stepper__value">
      <text>{{ modelValue }}</text>
    </view>

    <view
      :class="['neo-stepper__button', { 'neo-stepper__button--disabled': modelValue >= max }]"
      @click="plus"
    >
      <text>+</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-stepper {
  display: inline-flex;
  align-items: center;
  gap: 14rpx;
  border: 1rpx solid #e2e8f3;
  border-radius: 999rpx;
  background: #fff;
  padding: 8rpx;
}

.neo-stepper__button,
.neo-stepper__value {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 64rpx;
  height: 64rpx;
  border-radius: 999rpx;
}

.neo-stepper__button {
  background: #f4f7fb;
  color: #30415f;
  font-size: 34rpx;
  font-weight: 700;
}

.neo-stepper__button--disabled {
  opacity: 0.36;
}

.neo-stepper__value {
  min-width: 84rpx;
  color: #182235;
  font-size: 26rpx;
  font-weight: 800;
}
</style>
