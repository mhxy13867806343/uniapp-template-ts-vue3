<script setup lang="ts">
interface CheckboxItem {
  label: string
  value: string
  description?: string
}

const props = defineProps<{
  modelValue: string[]
  items: CheckboxItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

function toggleValue(value: string) {
  const nextValue = props.modelValue.includes(value)
    ? props.modelValue.filter(item => item !== value)
    : [...props.modelValue, value]

  emit('update:modelValue', nextValue)
}
</script>

<template>
  <view class="neo-checkbox-group">
    <view
      v-for="item in items"
      :key="item.value"
      :class="['neo-checkbox', { 'neo-checkbox--active': modelValue.includes(item.value) }]"
      @click="toggleValue(item.value)"
    >
      <view class="neo-checkbox__main">
        <text class="neo-checkbox__label">{{ item.label }}</text>
        <text v-if="item.description" class="neo-checkbox__description">{{ item.description }}</text>
      </view>

      <view :class="['neo-checkbox__icon', { 'neo-checkbox__icon--active': modelValue.includes(item.value) }]">
        <text class="neo-checkbox__tick">✓</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-checkbox-group {
  display: grid;
  gap: 16rpx;
}

.neo-checkbox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  border: 1rpx solid #e1e8f4;
  border-radius: 24rpx;
  background: #fff;
  padding: 22rpx 24rpx;
}

.neo-checkbox--active {
  border-color: #91b0ff;
  background:
    radial-gradient(circle at top left, rgba(82, 121, 255, 0.1), transparent 36%),
    #f5f8ff;
}

.neo-checkbox__main {
  min-width: 0;
  flex: 1;
}

.neo-checkbox__label {
  display: block;
  color: #182235;
  font-size: 27rpx;
  font-weight: 800;
}

.neo-checkbox__description {
  display: block;
  margin-top: 8rpx;
  color: #6b7586;
  font-size: 23rpx;
  line-height: 1.6;
}

.neo-checkbox__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #b9c4d6;
  border-radius: 12rpx;
  background: #fff;
}

.neo-checkbox__icon--active {
  border-color: #486dff;
  background: #486dff;
}

.neo-checkbox__tick {
  color: #fff;
  font-size: 22rpx;
  font-weight: 800;
}
</style>
