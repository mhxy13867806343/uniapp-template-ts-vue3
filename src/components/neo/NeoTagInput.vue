<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string[]
  label?: string
  placeholder?: string
  addLabel?: string
}>(), {
  label: '',
  placeholder: '输入标签后点击添加',
  addLabel: '添加'
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const draftValue = ref('')

function handleInput(event: Event) {
  const detailValue = (event as { detail?: { value?: string } }).detail?.value
  const targetValue = (event.target as HTMLInputElement | null)?.value
  draftValue.value = detailValue || targetValue || ''
}

function addTag() {
  const nextTag = draftValue.value.trim()
  if (!nextTag || props.modelValue.includes(nextTag)) {
    return
  }

  emit('update:modelValue', [...props.modelValue, nextTag])
  draftValue.value = ''
}

function removeTag(tag: string) {
  emit('update:modelValue', props.modelValue.filter(item => item !== tag))
}
</script>

<template>
  <view class="neo-tag-input">
    <text v-if="label" class="neo-tag-input__label">{{ label }}</text>

    <view class="neo-tag-input__box">
      <view class="neo-tag-input__editor">
        <input
          class="neo-tag-input__input"
          :value="draftValue"
          :placeholder="placeholder"
          @input="handleInput"
          @confirm="addTag"
        />
        <view class="neo-tag-input__add" @click="addTag">
          <text>{{ addLabel }}</text>
        </view>
      </view>

      <view v-if="modelValue.length" class="neo-tag-input__list">
        <view
          v-for="tag in modelValue"
          :key="tag"
          class="neo-tag-input__tag"
        >
          <text class="neo-tag-input__tag-text">{{ tag }}</text>
          <text class="neo-tag-input__tag-remove" @click="removeTag(tag)">×</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-tag-input {
  display: grid;
  gap: 14rpx;
}

.neo-tag-input__label {
  color: #182235;
  font-size: 27rpx;
  font-weight: 800;
}

.neo-tag-input__box {
  display: grid;
  gap: 16rpx;
  border: 1rpx solid #dfe6f1;
  border-radius: 24rpx;
  background: #f8fafc;
  padding: 20rpx;
}

.neo-tag-input__editor {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.neo-tag-input__input {
  flex: 1;
  min-height: 78rpx;
  border-radius: 18rpx;
  background: #fff;
  padding: 0 22rpx;
  color: #182235;
  font-size: 25rpx;
}

.neo-tag-input__add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 112rpx;
  min-height: 78rpx;
  border-radius: 18rpx;
  background: linear-gradient(135deg, #406cff 0%, #6f7cff 100%);
  color: #fff;
  font-size: 24rpx;
  font-weight: 800;
}

.neo-tag-input__list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.neo-tag-input__tag {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  border-radius: 999rpx;
  background: #e9efff;
  padding: 12rpx 18rpx;
}

.neo-tag-input__tag-text {
  color: #3756c8;
  font-size: 23rpx;
  font-weight: 700;
}

.neo-tag-input__tag-remove {
  color: #6d7c96;
  font-size: 24rpx;
}
</style>
