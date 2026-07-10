<script setup lang="ts">
interface TabItem {
  label: string
  value: string
  badge?: string
}

const props = defineProps<{
  modelValue: string
  items: TabItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function selectTab(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <view class="neo-tabs">
    <view
      v-for="item in items"
      :key="item.value"
      :class="['neo-tabs__item', { 'neo-tabs__item--active': item.value === modelValue }]"
      @click="selectTab(item.value)"
    >
      <text class="neo-tabs__label">{{ item.label }}</text>
      <text v-if="item.badge" class="neo-tabs__badge">{{ item.badge }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  border: 1rpx solid #e3e8f3;
  border-radius: 999rpx;
  background: #f6f8fb;
  padding: 8rpx;
}

.neo-tabs__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  min-height: 64rpx;
  border-radius: 999rpx;
  padding: 0 22rpx;
}

.neo-tabs__item--active {
  background: #fff;
  box-shadow: 0 12rpx 26rpx rgba(54, 79, 157, 0.1);
}

.neo-tabs__label {
  color: #5f6b7a;
  font-size: 24rpx;
  font-weight: 700;
}

.neo-tabs__item--active .neo-tabs__label {
  color: #20304f;
}

.neo-tabs__badge {
  min-width: 34rpx;
  height: 34rpx;
  border-radius: 999rpx;
  background: #e9efff;
  padding: 0 10rpx;
  color: #3f61d9;
  font-size: 20rpx;
  font-weight: 800;
  line-height: 34rpx;
  text-align: center;
}
</style>
