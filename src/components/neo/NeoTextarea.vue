<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  maxlength?: number
}>(), {
  label: '',
  placeholder: '',
  maxlength: 200
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const currentLength = computed(() => props.modelValue.length)

function handleInput(event: Event) {
  const detailValue = (event as { detail?: { value?: string } }).detail?.value
  emit('update:modelValue', detailValue || '')
}
</script>

<template>
  <view class="neo-textarea">
    <view class="neo-textarea__head">
      <text v-if="label" class="neo-textarea__label">{{ label }}</text>
      <text class="neo-textarea__count">{{ currentLength }}/{{ maxlength }}</text>
    </view>

    <view class="neo-textarea__box">
      <textarea
        class="neo-textarea__input"
        :value="modelValue"
        :maxlength="maxlength"
        :placeholder="placeholder"
        @input="handleInput"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-textarea {
  display: grid;
  gap: 14rpx;
}

.neo-textarea__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.neo-textarea__label {
  color: #182235;
  font-size: 27rpx;
  font-weight: 800;
}

.neo-textarea__count {
  color: #8793a7;
  font-size: 22rpx;
}

.neo-textarea__box {
  border: 1rpx solid #dfe6f1;
  border-radius: 24rpx;
  background: #f8fafc;
  padding: 22rpx;
}

.neo-textarea__input {
  width: 100%;
  min-height: 180rpx;
  color: #182235;
  font-size: 26rpx;
  line-height: 1.7;
}
</style>
