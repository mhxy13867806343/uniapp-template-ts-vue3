<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  modelValue: string
  placeholder?: string
  hint?: string
  type?: 'text' | 'number'
}>(), {
  placeholder: '',
  hint: '',
  type: 'text'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: { detail?: { value?: string } }) {
  emit('update:modelValue', event.detail?.value || '')
}
</script>

<template>
  <view class="neo-field">
    <view class="neo-field__head">
      <text class="neo-field__label">{{ label }}</text>
      <text v-if="hint" class="neo-field__hint">{{ hint }}</text>
    </view>

    <view class="neo-field__box">
      <input
        class="neo-field__input"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        placeholder-class="neo-field__placeholder"
        @input="handleInput"
      >
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-field {
  display: grid;
  gap: 14rpx;
}

.neo-field__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.neo-field__label {
  color: #1b263d;
  font-size: 26rpx;
  font-weight: 700;
}

.neo-field__hint {
  color: #7a8597;
  font-size: 22rpx;
}

.neo-field__box {
  display: flex;
  align-items: center;
  min-height: 92rpx;
  border: 1rpx solid #dde5f0;
  border-radius: 24rpx;
  background:
    radial-gradient(circle at top left, rgba(88, 130, 255, 0.08), transparent 36%),
    #f8fafc;
  padding: 0 24rpx;
}

.neo-field__input {
  width: 100%;
  color: #1b263d;
  font-size: 28rpx;
  font-weight: 600;
}

:global(.neo-field__placeholder) {
  color: #9aa5b6;
  font-size: 26rpx;
}
</style>
