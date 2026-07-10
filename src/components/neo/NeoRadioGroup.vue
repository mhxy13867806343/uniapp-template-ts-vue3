<script setup lang="ts">
interface RadioItem {
  label: string
  value: string
  description?: string
}

defineProps<{
  modelValue: string
  items: RadioItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function selectValue(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <view class="neo-radio-group">
    <view
      v-for="item in items"
      :key="item.value"
      :class="['neo-radio', { 'neo-radio--active': item.value === modelValue }]"
      @click="selectValue(item.value)"
    >
      <view class="neo-radio__main">
        <text class="neo-radio__label">{{ item.label }}</text>
        <text v-if="item.description" class="neo-radio__description">{{ item.description }}</text>
      </view>

      <view class="neo-radio__icon">
        <view v-if="item.value === modelValue" class="neo-radio__dot" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-radio-group {
  display: grid;
  gap: 16rpx;
}

.neo-radio {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  border: 1rpx solid #e1e8f4;
  border-radius: 24rpx;
  background: #fff;
  padding: 22rpx 24rpx;
}

.neo-radio--active {
  border-color: #91b0ff;
  background:
    radial-gradient(circle at top left, rgba(82, 121, 255, 0.1), transparent 36%),
    #f5f8ff;
}

.neo-radio__main {
  min-width: 0;
  flex: 1;
}

.neo-radio__label {
  display: block;
  color: #182235;
  font-size: 27rpx;
  font-weight: 800;
}

.neo-radio__description {
  display: block;
  margin-top: 8rpx;
  color: #6b7586;
  font-size: 23rpx;
  line-height: 1.6;
}

.neo-radio__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #b9c4d6;
  border-radius: 50%;
  background: #fff;
}

.neo-radio__dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: #486dff;
}
</style>
