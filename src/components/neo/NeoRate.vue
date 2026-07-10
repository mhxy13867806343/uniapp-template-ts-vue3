<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: number
  count?: number
  label?: string
  hint?: string
}>(), {
  count: 5,
  label: '',
  hint: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const rateItems = computed(() => Array.from({ length: props.count }, (_, index) => index + 1))

function selectRate(value: number) {
  emit('update:modelValue', value)
}
</script>

<template>
  <view class="neo-rate">
    <view class="neo-rate__head">
      <text v-if="label" class="neo-rate__label">{{ label }}</text>
      <text class="neo-rate__value">{{ modelValue }}/{{ count }}</text>
    </view>

    <view class="neo-rate__stars">
      <text
        v-for="item in rateItems"
        :key="item"
        :class="['neo-rate__star', { 'neo-rate__star--active': item <= modelValue }]"
        @click="selectRate(item)"
      >
        ★
      </text>
    </view>

    <text v-if="hint" class="neo-rate__hint">{{ hint }}</text>
  </view>
</template>

<style lang="scss" scoped>
.neo-rate {
  display: grid;
  gap: 14rpx;
}

.neo-rate__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.neo-rate__label {
  color: #182235;
  font-size: 27rpx;
  font-weight: 800;
}

.neo-rate__value,
.neo-rate__hint {
  color: #79859a;
  font-size: 23rpx;
}

.neo-rate__stars {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.neo-rate__star {
  color: #d7ddea;
  font-size: 48rpx;
  line-height: 1;
}

.neo-rate__star--active {
  color: #ffbf3c;
  text-shadow: 0 10rpx 18rpx rgba(255, 191, 60, 0.24);
}
</style>
