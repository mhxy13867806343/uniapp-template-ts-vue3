<script setup lang="ts">
import NeoButton from './NeoButton.vue'

const props = withDefaults(defineProps<{
  title: string
  message: string
  actionLabel?: string
  tone?: 'primary' | 'warning'
}>(), {
  actionLabel: '',
  tone: 'primary'
})

const emit = defineEmits<{
  action: []
}>()

function handleAction() {
  emit('action')
}
</script>

<template>
  <view :class="['neo-notice', `neo-notice--${tone}`]">
    <view class="neo-notice__dot" />

    <view class="neo-notice__main">
      <view class="neo-notice__title">{{ title }}</view>
      <view class="neo-notice__message">{{ message }}</view>
    </view>

    <NeoButton
      v-if="actionLabel"
      :label="actionLabel"
      size="sm"
      variant="ghost"
      @click="handleAction"
    />
  </view>
</template>

<style lang="scss" scoped>
.neo-notice {
  display: flex;
  align-items: center;
  gap: 18rpx;
  border: 1rpx solid transparent;
  border-radius: 24rpx;
  padding: 22rpx;
}

.neo-notice__dot {
  flex-shrink: 0;
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
}

.neo-notice__main {
  min-width: 0;
  flex: 1;
}

.neo-notice__title {
  font-size: 28rpx;
  font-weight: 800;
}

.neo-notice__message {
  margin-top: 8rpx;
  font-size: 24rpx;
  line-height: 1.65;
}

.neo-notice--primary {
  border-color: #d6e1fb;
  background: linear-gradient(180deg, #f7faff 0%, #eef4ff 100%);
  color: #1f3f88;
}

.neo-notice--primary .neo-notice__dot {
  background: #3e6cff;
  box-shadow: 0 0 0 8rpx rgba(62, 108, 255, 0.14);
}

.neo-notice--warning {
  border-color: #f0d7af;
  background: linear-gradient(180deg, #fffaf2 0%, #fff1dc 100%);
  color: #8a4b10;
}

.neo-notice--warning .neo-notice__dot {
  background: #d17a1a;
  box-shadow: 0 0 0 8rpx rgba(209, 122, 26, 0.14);
}
</style>
