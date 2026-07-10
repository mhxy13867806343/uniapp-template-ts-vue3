<script setup lang="ts">
import NeoButton from './NeoButton.vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  description: string
  primaryLabel?: string
  secondaryLabel?: string
}>(), {
  primaryLabel: '确认',
  secondaryLabel: '取消'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  primary: []
  secondary: []
}>()

function close() {
  emit('update:modelValue', false)
}

function handlePrimary() {
  emit('primary')
  close()
}

function handleSecondary() {
  emit('secondary')
  close()
}
</script>

<template>
  <view v-if="modelValue" class="neo-dialog-mask">
    <view class="neo-dialog">
      <view class="neo-dialog__title">{{ title }}</view>
      <view class="neo-dialog__desc">{{ description }}</view>

      <view class="neo-dialog__actions">
        <NeoButton
          :label="secondaryLabel"
          variant="secondary"
          size="sm"
          @click="handleSecondary"
        />
        <NeoButton
          :label="primaryLabel"
          size="sm"
          @click="handlePrimary"
        />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-dialog-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 360rpx;
  border-radius: 28rpx;
  background: rgba(18, 24, 39, 0.08);
  padding: 24rpx;
}

.neo-dialog {
  width: 100%;
  max-width: 560rpx;
  border: 1rpx solid #dfe6f3;
  border-radius: 28rpx;
  background: #fff;
  padding: 28rpx;
  box-shadow: 0 24rpx 60rpx rgba(20, 30, 60, 0.16);
}

.neo-dialog__title {
  color: #182235;
  font-size: 32rpx;
  font-weight: 800;
}

.neo-dialog__desc {
  margin-top: 12rpx;
  color: #6b7586;
  font-size: 25rpx;
  line-height: 1.7;
}

.neo-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 14rpx;
  margin-top: 28rpx;
}
</style>
