<script setup lang="ts">
interface ActionSheetItem {
  label: string
  value: string
  description?: string
  tone?: 'default' | 'danger'
}

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  description?: string
  actions: ActionSheetItem[]
  cancelLabel?: string
}>(), {
  title: '',
  description: '',
  cancelLabel: '取消'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [value: string]
  cancel: []
}>()

function close() {
  emit('update:modelValue', false)
}

function handleCancel() {
  emit('cancel')
  close()
}

function handleSelect(value: string) {
  emit('select', value)
  close()
}
</script>

<template>
  <view v-if="modelValue" class="neo-action-sheet">
    <view class="neo-action-sheet__mask" @click="handleCancel" />
    <view class="neo-action-sheet__panel">
      <view v-if="title || description" class="neo-action-sheet__head">
        <text v-if="title" class="neo-action-sheet__title">{{ title }}</text>
        <text v-if="description" class="neo-action-sheet__description">{{ description }}</text>
      </view>

      <view class="neo-action-sheet__list">
        <view
          v-for="item in actions"
          :key="item.value"
          class="neo-action-sheet__item"
          @click="handleSelect(item.value)"
        >
          <text :class="['neo-action-sheet__label', { 'neo-action-sheet__label--danger': item.tone === 'danger' }]">
            {{ item.label }}
          </text>
          <text v-if="item.description" class="neo-action-sheet__item-desc">{{ item.description }}</text>
        </view>
      </view>

      <view class="neo-action-sheet__cancel" @click="handleCancel">
        <text>{{ cancelLabel }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-action-sheet {
  position: relative;
  min-height: 520rpx;
  border-radius: 28rpx;
  overflow: hidden;
}

.neo-action-sheet__mask {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.08);
}

.neo-action-sheet__panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  gap: 16rpx;
  padding: 24rpx;
}

.neo-action-sheet__head,
.neo-action-sheet__list,
.neo-action-sheet__cancel {
  border: 1rpx solid #e1e8f4;
  border-radius: 24rpx;
  background: #fff;
}

.neo-action-sheet__head {
  padding: 24rpx;
  text-align: center;
}

.neo-action-sheet__title {
  display: block;
  color: #182235;
  font-size: 28rpx;
  font-weight: 800;
}

.neo-action-sheet__description {
  display: block;
  margin-top: 10rpx;
  color: #738097;
  font-size: 23rpx;
  line-height: 1.6;
}

.neo-action-sheet__item {
  padding: 22rpx 24rpx;
  text-align: center;
  border-bottom: 1rpx solid #edf1f6;
}

.neo-action-sheet__item:last-child {
  border-bottom: 0;
}

.neo-action-sheet__label {
  display: block;
  color: #182235;
  font-size: 28rpx;
  font-weight: 700;
}

.neo-action-sheet__label--danger {
  color: #e25555;
}

.neo-action-sheet__item-desc {
  display: block;
  margin-top: 8rpx;
  color: #7b8799;
  font-size: 22rpx;
}

.neo-action-sheet__cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 88rpx;
  color: #182235;
  font-size: 27rpx;
  font-weight: 800;
}
</style>
