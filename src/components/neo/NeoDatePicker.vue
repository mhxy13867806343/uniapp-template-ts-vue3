<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
  start?: string
  end?: string
}>(), {
  label: '',
  start: '2024-01-01',
  end: '2030-12-31'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleChange(event: { detail?: { value?: string } }) {
  emit('update:modelValue', event.detail?.value || '')
}
</script>

<template>
  <view class="neo-date-picker">
    <text v-if="label" class="neo-date-picker__label">{{ label }}</text>

    <picker
      mode="date"
      :value="modelValue"
      :start="start"
      :end="end"
      @change="handleChange"
    >
      <view class="neo-date-picker__field">
        <text :class="['neo-date-picker__value', { 'neo-date-picker__value--placeholder': !modelValue }]">
          {{ modelValue || '请选择日期' }}
        </text>
        <text class="neo-date-picker__icon">⌄</text>
      </view>
    </picker>
  </view>
</template>

<style lang="scss" scoped>
.neo-date-picker {
  display: grid;
  gap: 14rpx;
}

.neo-date-picker__label {
  color: #182235;
  font-size: 27rpx;
  font-weight: 800;
}

.neo-date-picker__field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  min-height: 88rpx;
  border: 1rpx solid #dfe6f1;
  border-radius: 22rpx;
  background: #f8fafc;
  padding: 0 24rpx;
}

.neo-date-picker__value {
  color: #182235;
  font-size: 26rpx;
  font-weight: 700;
}

.neo-date-picker__value--placeholder {
  color: #96a2b4;
}

.neo-date-picker__icon {
  color: #738097;
  font-size: 28rpx;
}
</style>
