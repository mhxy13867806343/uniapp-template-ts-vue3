<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  meta?: string
  tone?: 'default' | 'brand'
}>(), {
  subtitle: '',
  meta: '',
  tone: 'default'
})
</script>

<template>
  <view :class="['neo-card', `neo-card--${tone}`]">
    <view class="neo-card__head">
      <view class="neo-card__main">
        <text class="neo-card__title">{{ title }}</text>
        <text v-if="subtitle" class="neo-card__subtitle">{{ subtitle }}</text>
      </view>
      <text v-if="meta" class="neo-card__meta">{{ meta }}</text>
    </view>

    <view class="neo-card__body">
      <slot />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.neo-card {
  display: grid;
  gap: 18rpx;
  border: 1rpx solid #e2e8f4;
  border-radius: 26rpx;
  background: #fff;
  padding: 24rpx;
}

.neo-card--brand {
  background:
    radial-gradient(circle at top left, rgba(82, 121, 255, 0.12), transparent 40%),
    linear-gradient(180deg, #ffffff 0%, #f5f8ff 100%);
}

.neo-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
}

.neo-card__main {
  min-width: 0;
  flex: 1;
}

.neo-card__title {
  color: #182235;
  font-size: 30rpx;
  font-weight: 800;
}

.neo-card__subtitle {
  margin-top: 10rpx;
  color: #6a7485;
  font-size: 24rpx;
  line-height: 1.65;
}

.neo-card__meta {
  flex-shrink: 0;
  color: #4a68d8;
  font-size: 22rpx;
  font-weight: 700;
}
</style>
