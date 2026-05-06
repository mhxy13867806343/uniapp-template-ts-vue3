<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { formatCount, getWaterfallFeed, waterfallFeeds, type WaterfallFeed } from '@/utils/waterfallFeeds'

const feed = ref<WaterfallFeed | undefined>()

const relatedFeeds = computed(() => {
  if (!feed.value) return []
  return waterfallFeeds.filter((item) => item.category === feed.value?.category && item.id !== feed.value?.id).slice(0, 3)
})

onLoad((query) => {
  feed.value = getWaterfallFeed(String(query?.id || '')) || waterfallFeeds[0]
})

function openDetail(item: WaterfallFeed) {
  uni.redirectTo({
    url: `/pages/examples/waterfall-detail?id=${item.id}`
  })
}
</script>

<template>
  <PageShell :title="feed?.title || '内容详情'" description="瀑布流卡片详情，可继续扩展视频播放、评论、收藏和商品/门店承接。">
    <view v-if="feed" class="detail-page">
      <view class="hero-card">
        <image class="hero-cover" :src="feed.cover" mode="widthFix" />
        <view class="hero-mask">
          <view class="duration">{{ feed.duration }}</view>
        </view>
      </view>

      <view class="panel detail-card">
        <view class="detail-title">{{ feed.title }}</view>
        <view class="author-row">
          <view class="avatar">{{ feed.author.slice(0, 1) }}</view>
          <view class="min-w-0 flex-1">
            <view class="font-700">{{ feed.author }}</view>
            <view class="muted-text mt-1">{{ feed.city }} · {{ feed.category }}</view>
          </view>
          <wd-button size="small" type="primary" plain>关注</wd-button>
        </view>
        <view class="detail-desc">{{ feed.desc }}</view>
        <view class="tag-list">
          <wd-tag
            v-for="tag in feed.tags"
            :key="tag"
            plain
            type="primary"
          >
            #{{ tag }}
          </wd-tag>
        </view>
      </view>

      <view class="stat-grid">
        <view class="stat-card">
          <view class="stat-value">{{ formatCount(feed.likes) }}</view>
          <view class="stat-label">点赞</view>
        </view>
        <view class="stat-card">
          <view class="stat-value">{{ formatCount(feed.comments) }}</view>
          <view class="stat-label">评论</view>
        </view>
        <view class="stat-card">
          <view class="stat-value">{{ formatCount(feed.saves) }}</view>
          <view class="stat-label">收藏</view>
        </view>
      </view>

      <view v-if="relatedFeeds.length" class="panel">
        <view class="related-title">同类推荐</view>
        <view class="related-list">
          <view
            v-for="item in relatedFeeds"
            :key="item.id"
            class="related-item"
            @click="openDetail(item)"
          >
            <image class="related-cover" :src="item.cover" mode="aspectFill" />
            <view class="min-w-0 flex-1">
              <view class="related-name">{{ item.title }}</view>
              <view class="muted-text mt-1">{{ item.author }} · {{ formatCount(item.likes) }} 赞</view>
            </view>
            <wd-icon name="arrow-right" size="18px" />
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.detail-page {
  display: grid;
  gap: 24rpx;
}

.hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 16rpx;
  background: #101828;
}

.hero-cover {
  display: block;
  width: 100%;
}

.hero-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 62%, rgba(16, 24, 40, 0.48));
}

.duration {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  border-radius: 999rpx;
  background: rgba(16, 24, 40, 0.72);
  color: #fff;
  font-size: 24rpx;
  padding: 8rpx 14rpx;
}

.detail-card {
  display: grid;
  gap: 22rpx;
}

.detail-title {
  color: var(--app-ink);
  font-size: 38rpx;
  font-weight: 800;
  line-height: 1.35;
}

.author-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  background: #eef6ff;
  color: var(--app-brand);
  font-weight: 800;
}

.detail-desc {
  color: var(--app-muted);
  font-size: 27rpx;
  line-height: 1.7;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.stat-card {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  padding: 24rpx 12rpx;
  text-align: center;
}

.stat-value {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 800;
}

.stat-label {
  margin-top: 8rpx;
  color: var(--app-muted);
  font-size: 24rpx;
}

.related-title {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 800;
  margin-bottom: 18rpx;
}

.related-list {
  display: grid;
  gap: 18rpx;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.related-cover {
  flex: 0 0 112rpx;
  width: 112rpx;
  height: 112rpx;
  border-radius: 10rpx;
  background: #eef2f6;
}

.related-name {
  overflow: hidden;
  color: var(--app-ink);
  font-size: 27rpx;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
