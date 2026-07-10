<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  actionLabel?: string
}>(), {
  placeholder: '请输入关键词',
  actionLabel: '搜索'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  clear: []
}>()

function handleInput(event: Event) {
  const detailValue = (event as { detail?: { value?: string } }).detail?.value
  const targetValue = (event.target as HTMLInputElement | null)?.value
  emit('update:modelValue', detailValue || targetValue || '')
}

function handleSearch() {
  emit('search', props.modelValue)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <view class="neo-search-bar">
    <view class="neo-search-bar__field">
      <text class="neo-search-bar__icon">⌕</text>
      <input
        class="neo-search-bar__input"
        :value="modelValue"
        :placeholder="placeholder"
        @input="handleInput"
        @confirm="handleSearch"
      />
      <text
        v-if="modelValue"
        class="neo-search-bar__clear"
        @click.stop="handleClear"
      >
        ×
      </text>
    </view>

    <view class="neo-search-bar__action" @click="handleSearch">
      <text>{{ actionLabel }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.neo-search-bar__field {
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-height: 84rpx;
  flex: 1;
  border: 1rpx solid #dfe6f1;
  border-radius: 999rpx;
  background: #f8fafc;
  padding: 0 24rpx;
}

.neo-search-bar__icon,
.neo-search-bar__clear {
  color: #8793a7;
  font-size: 28rpx;
  flex-shrink: 0;
}

.neo-search-bar__input {
  width: 100%;
  color: #182235;
  font-size: 26rpx;
  font-weight: 600;
}

.neo-search-bar__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 124rpx;
  min-height: 84rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #406cff 0%, #6f7cff 100%);
  color: #fff;
  font-size: 25rpx;
  font-weight: 800;
  box-shadow: 0 16rpx 32rpx rgba(50, 85, 205, 0.2);
}
</style>
