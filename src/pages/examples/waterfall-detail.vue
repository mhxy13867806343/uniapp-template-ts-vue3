<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { formatCount, getWaterfallFeed, getFeedsByScene, type WaterfallFeed, type WaterfallScene } from '@/utils/waterfallFeeds'

const feed = ref<WaterfallFeed | undefined>()
const scene = ref<WaterfallScene>('life')

const relatedFeeds = computed(() => {
  if (!feed.value) return []
  return getFeedsByScene(scene.value).filter((item) => item.id !== feed.value?.id).slice(0, 3)
})

onLoad((query) => {
  const current = getWaterfallFeed(String(query?.id || ''))
  feed.value = current
  scene.value = (String(query?.type || current?.scene || 'life') as WaterfallScene)
})

function openDetail(item: WaterfallFeed) {
  uni.redirectTo({
    url: `/pages/examples/waterfall-detail?id=${item.id}&type=${item.scene}`
  })
}
</script>

<template>
  <PageShell :title="feed?.title || '内容详情'" description="瀑布流详情承接页，按生活、电商、新闻和朋友圈自动切换详情结构。">
    <view v-if="feed" class="detail-page">
      <view v-if="scene === 'shop'" class="shop-detail">
        <image class="shop-hero" :src="feed.cover" mode="widthFix" />
        <view class="panel shop-info">
          <view class="price-row">
            <view class="price">¥{{ feed.price }}</view>
            <view class="origin-price">¥{{ feed.originPrice }}</view>
            <wd-tag type="error" plain>限时优惠</wd-tag>
          </view>
          <view class="detail-title">{{ feed.title }}</view>
          <view class="detail-desc">{{ feed.desc }}</view>
          <view class="service-row">
            <view>已售 {{ formatCount(feed.sales || 0) }}</view>
            <view>48 小时发货</view>
            <view>7 天无理由</view>
          </view>
        </view>

        <view class="panel">
          <view class="section-title">规格服务</view>
          <wd-cell-group border>
            <wd-cell title="规格" value="标准款 / 升级款" is-link />
            <wd-cell title="配送" value="顺丰包邮" is-link />
            <wd-cell title="保障" value="退换无忧" is-link />
          </wd-cell-group>
        </view>

        <view class="buy-bar">
          <wd-button plain>加入购物车</wd-button>
          <wd-button type="primary">立即购买</wd-button>
        </view>
      </view>

      <template v-else>
        <view class="hero-card">
          <image class="hero-cover" :src="feed.cover" mode="widthFix" />
          <view v-if="feed.duration" class="hero-mask">
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
            <wd-button size="small" type="primary" plain>{{ scene === 'moments' ? '加好友' : '关注' }}</wd-button>
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

        <view v-if="scene === 'moments' && feed.images?.length" class="panel">
          <view class="section-title">朋友圈图片</view>
          <view class="moment-images">
            <image
              v-for="image in feed.images"
              :key="image"
              class="moment-image"
              :src="image"
              mode="aspectFill"
            />
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
      </template>

      <view v-if="relatedFeeds.length" class="panel">
        <view class="section-title">相关推荐</view>
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
.detail-page,
.shop-detail {
  display: grid;
  gap: 24rpx;
}

.hero-card,
.shop-hero {
  overflow: hidden;
  border-radius: 16rpx;
  background: #101828;
}

.hero-card {
  position: relative;
}

.hero-cover,
.shop-hero {
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

.detail-card,
.shop-info {
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

.detail-desc,
.service-row {
  color: var(--app-muted);
  font-size: 27rpx;
  line-height: 1.7;
}

.tag-list,
.service-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.price {
  color: #f04438;
  font-size: 46rpx;
  font-weight: 900;
}

.origin-price {
  color: #98a2b3;
  font-size: 24rpx;
  text-decoration: line-through;
}

.section-title {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 800;
  margin-bottom: 18rpx;
}

.buy-bar {
  position: sticky;
  bottom: 120rpx;
  z-index: 4;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #fff;
  padding: 18rpx;
}

.moment-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10rpx;
}

.moment-image {
  width: 100%;
  height: 180rpx;
  border-radius: 10rpx;
  background: #eef2f6;
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
