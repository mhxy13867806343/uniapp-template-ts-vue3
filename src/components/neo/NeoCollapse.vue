<script setup lang="ts">
interface CollapseItem {
  title: string
  name: string
  content: string
  meta?: string
}

const props = defineProps<{
  modelValue: string[]
  items: CollapseItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

function togglePanel(name: string) {
  const nextValue = props.modelValue.includes(name)
    ? props.modelValue.filter(item => item !== name)
    : [...props.modelValue, name]

  emit('update:modelValue', nextValue)
}
</script>

<template>
  <view class="neo-collapse">
    <view
      v-for="item in items"
      :key="item.name"
      class="neo-collapse__item"
    >
      <view class="neo-collapse__head" @click="togglePanel(item.name)">
        <view class="neo-collapse__main">
          <text class="neo-collapse__title">{{ item.title }}</text>
          <text v-if="item.meta" class="neo-collapse__meta">{{ item.meta }}</text>
        </view>
        <text :class="['neo-collapse__arrow', { 'neo-collapse__arrow--open': modelValue.includes(item.name) }]">⌄</text>
      </view>

      <view v-if="modelValue.includes(item.name)" class="neo-collapse__body">
        <text class="neo-collapse__content">{{ item.content }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-collapse {
  display: grid;
  gap: 14rpx;
}

.neo-collapse__item {
  overflow: hidden;
  border: 1rpx solid #e1e8f4;
  border-radius: 22rpx;
  background: #fff;
}

.neo-collapse__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  padding: 22rpx 24rpx;
}

.neo-collapse__main {
  min-width: 0;
  flex: 1;
}

.neo-collapse__title {
  display: block;
  color: #182235;
  font-size: 27rpx;
  font-weight: 800;
}

.neo-collapse__meta {
  display: block;
  margin-top: 8rpx;
  color: #778397;
  font-size: 22rpx;
}

.neo-collapse__arrow {
  color: #7d8798;
  font-size: 28rpx;
  transition: transform 0.2s ease;
}

.neo-collapse__arrow--open {
  transform: rotate(180deg);
}

.neo-collapse__body {
  border-top: 1rpx solid #edf1f6;
  background: #f8fafc;
  padding: 22rpx 24rpx;
}

.neo-collapse__content {
  color: #687487;
  font-size: 24rpx;
  line-height: 1.8;
}
</style>
