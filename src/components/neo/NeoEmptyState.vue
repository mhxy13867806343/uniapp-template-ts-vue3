<script setup lang="ts">
import NeoButton from './NeoButton.vue'

withDefaults(defineProps<{
  title: string
  description: string
  actionLabel?: string
}>(), {
  actionLabel: ''
})
</script>

<template>
  <view class="neo-empty">
    <view class="neo-empty__art">
      <view class="neo-empty__orb neo-empty__orb--large" />
      <view class="neo-empty__orb neo-empty__orb--small" />
      <view class="neo-empty__core">
        <text class="neo-empty__glyph">0</text>
      </view>
    </view>

    <view class="neo-empty__title">{{ title }}</view>
    <view class="neo-empty__description">{{ description }}</view>

    <NeoButton
      v-if="actionLabel"
      :label="actionLabel"
      variant="secondary"
      size="sm"
    />
  </view>
</template>

<style lang="scss" scoped>
.neo-empty {
  display: grid;
  justify-items: center;
  gap: 18rpx;
  border: 1rpx solid #e2e8f4;
  border-radius: 28rpx;
  background:
    radial-gradient(circle at top left, rgba(109, 131, 255, 0.12), transparent 36%),
    linear-gradient(180deg, #ffffff 0%, #f8f9fd 100%);
  padding: 36rpx 28rpx;
  text-align: center;
}

.neo-empty__art {
  position: relative;
  width: 180rpx;
  height: 140rpx;
}

.neo-empty__orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #dce6ff 0%, #eef3ff 100%);
}

.neo-empty__orb--large {
  left: 10rpx;
  top: 14rpx;
  width: 110rpx;
  height: 110rpx;
}

.neo-empty__orb--small {
  right: 18rpx;
  bottom: 12rpx;
  width: 64rpx;
  height: 64rpx;
}

.neo-empty__core {
  position: absolute;
  left: 52rpx;
  top: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92rpx;
  height: 92rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #456dff 0%, #7a73ff 100%);
  box-shadow: 0 18rpx 36rpx rgba(78, 97, 223, 0.24);
}

.neo-empty__glyph {
  color: #fff;
  font-size: 44rpx;
  font-weight: 800;
}

.neo-empty__title {
  color: #1d2942;
  font-size: 30rpx;
  font-weight: 800;
}

.neo-empty__description {
  max-width: 460rpx;
  color: #748094;
  font-size: 24rpx;
  line-height: 1.7;
}
</style>
