<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number
  showAvatar?: boolean
}>(), {
  rows: 3,
  showAvatar: false
})
</script>

<template>
  <view class="neo-skeleton">
    <view v-if="showAvatar" class="neo-skeleton__head">
      <view class="neo-skeleton__avatar" />
      <view class="neo-skeleton__head-lines">
        <view class="neo-skeleton__line neo-skeleton__line--title" />
        <view class="neo-skeleton__line neo-skeleton__line--short" />
      </view>
    </view>

    <view
      v-for="row in rows"
      :key="row"
      :class="[
        'neo-skeleton__line',
        { 'neo-skeleton__line--short': row === rows }
      ]"
    />
  </view>
</template>

<style lang="scss" scoped>
.neo-skeleton {
  display: grid;
  gap: 16rpx;
  border: 1rpx solid #e4e9f3;
  border-radius: 24rpx;
  background: #fff;
  padding: 24rpx;
}

.neo-skeleton__head {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.neo-skeleton__avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 24rpx;
  background: linear-gradient(90deg, #edf1f6 0%, #f7f9fb 50%, #edf1f6 100%);
}

.neo-skeleton__head-lines {
  display: grid;
  gap: 12rpx;
  flex: 1;
}

.neo-skeleton__line {
  height: 24rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #edf1f6 0%, #f7f9fb 50%, #edf1f6 100%);
}

.neo-skeleton__line--title {
  width: 58%;
}

.neo-skeleton__line--short {
  width: 72%;
}
</style>
