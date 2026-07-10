<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'sm'
  block?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  if (props.disabled) {
    return
  }

  emit('click')
}
</script>

<template>
  <view
    :class="[
      'neo-button',
      `neo-button--${variant}`,
      `neo-button--${size}`,
      { 'neo-button--block': block, 'neo-button--disabled': disabled }
    ]"
    @click="handleClick"
  >
    <text class="neo-button__label">{{ label }}</text>
  </view>
</template>

<style lang="scss" scoped>
.neo-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 176rpx;
  border: 1rpx solid transparent;
  border-radius: 999rpx;
  padding: 0 30rpx;
  transition: all 0.2s ease;
}

.neo-button--md {
  min-height: 84rpx;
}

.neo-button--sm {
  min-height: 64rpx;
  padding: 0 24rpx;
}

.neo-button--block {
  display: flex;
  width: 100%;
}

.neo-button__label {
  font-size: 26rpx;
  font-weight: 800;
  letter-spacing: 0.6rpx;
}

.neo-button--primary {
  background: linear-gradient(135deg, #2e61ff 0%, #6b7bff 100%);
  box-shadow: 0 16rpx 32rpx rgba(50, 85, 205, 0.22);
  color: #fff;
}

.neo-button--secondary {
  border-color: #d8e2f3;
  background: #f5f8fc;
  color: #21304c;
}

.neo-button--ghost {
  border-color: #cfd8ea;
  background: rgba(255, 255, 255, 0.4);
  color: #5670a5;
}

.neo-button--disabled {
  opacity: 0.46;
}
</style>
