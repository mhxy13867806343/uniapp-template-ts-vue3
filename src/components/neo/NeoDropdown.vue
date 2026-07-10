<script setup lang="ts">
interface DropdownItem {
  label: string
  value: string
}

const props = defineProps<{
  modelValue: string
  label: string
  items: DropdownItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const expanded = ref(false)

const activeLabel = computed(() => {
  return props.items.find(item => item.value === props.modelValue)?.label || props.label
})

function toggleExpand() {
  expanded.value = !expanded.value
}

function selectItem(value: string) {
  emit('update:modelValue', value)
  expanded.value = false
}
</script>

<template>
  <view class="neo-dropdown">
    <view class="neo-dropdown__trigger" @click="toggleExpand">
      <text class="neo-dropdown__label">{{ activeLabel }}</text>
      <text :class="['neo-dropdown__arrow', { 'neo-dropdown__arrow--up': expanded }]">⌄</text>
    </view>

    <view v-if="expanded" class="neo-dropdown__panel">
      <view
        v-for="item in items"
        :key="item.value"
        :class="['neo-dropdown__item', { 'neo-dropdown__item--active': item.value === modelValue }]"
        @click="selectItem(item.value)"
      >
        <text>{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-dropdown {
  display: grid;
  gap: 12rpx;
}

.neo-dropdown__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  min-height: 84rpx;
  border: 1rpx solid #dfe6f1;
  border-radius: 22rpx;
  background: #f8fafc;
  padding: 0 24rpx;
}

.neo-dropdown__label {
  color: #182235;
  font-size: 26rpx;
  font-weight: 700;
}

.neo-dropdown__arrow {
  color: #738097;
  font-size: 28rpx;
  transition: transform 0.2s ease;
}

.neo-dropdown__arrow--up {
  transform: rotate(180deg);
}

.neo-dropdown__panel {
  overflow: hidden;
  border: 1rpx solid #e1e7f2;
  border-radius: 22rpx;
  background: #fff;
  box-shadow: 0 18rpx 42rpx rgba(36, 51, 92, 0.1);
}

.neo-dropdown__item {
  padding: 22rpx 24rpx;
  color: #667088;
  font-size: 25rpx;
  font-weight: 600;
  border-bottom: 1rpx solid #edf1f6;
}

.neo-dropdown__item:last-child {
  border-bottom: 0;
}

.neo-dropdown__item--active {
  background: #f3f7ff;
  color: #3f61d9;
}
</style>
