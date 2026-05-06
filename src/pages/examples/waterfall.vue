<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import {
  feedCategories,
  formatCount,
  getFeedsByScene,
  sceneTabs,
  type WaterfallFeed,
  type WaterfallScene
} from '@/utils/waterfallFeeds'

const activeScene = ref<WaterfallScene>('life')
const activeCategory = ref('推荐')
const visibleCount = ref(6)

const sceneDesc = computed(() => sceneTabs.find((item) => item.value === activeScene.value)?.desc || '')

const sceneFeeds = computed(() => getFeedsByScene(activeScene.value))

const filteredFeeds = computed(() => {
  if (activeScene.value !== 'life') return sceneFeeds.value
  if (activeCategory.value === '推荐') return sceneFeeds.value
  return sceneFeeds.value.filter((item) => item.category === activeCategory.value)
})

const visibleFeeds = computed(() => filteredFeeds.value.slice(0, visibleCount.value))

const columns = computed(() => {
  const left: WaterfallFeed[] = []
  const right: WaterfallFeed[] = []
  let leftHeight = 0
  let rightHeight = 0

  visibleFeeds.value.forEach((item) => {
    if (leftHeight <= rightHeight) {
      left.push(item)
      leftHeight += item.ratio
    } else {
      right.push(item)
      rightHeight += item.ratio
    }
  })

  return [left, right]
})

const hasMore = computed(() => visibleCount.value < filteredFeeds.value.length)

watch([activeScene, activeCategory], () => {
  visibleCount.value = activeScene.value === 'news' || activeScene.value === 'moments' ? 10 : 6
})

onReachBottom(() => {
  loadMore()
})

function switchScene(scene: WaterfallScene) {
  activeScene.value = scene
  activeCategory.value = '推荐'
}

function loadMore() {
  if (!hasMore.value) return
  visibleCount.value = Math.min(visibleCount.value + 4, filteredFeeds.value.length)
}

function openDetail(item: WaterfallFeed) {
  uni.navigateTo({
    url: `/pages/examples/waterfall-detail?id=${item.id}&type=${item.scene}`
  })
}
</script>

<template>
  <PageShell title="瀑布流示例" :description="sceneDesc">
    <view class="waterfall-page">
      <view class="scene-tabs">
        <view
          v-for="item in sceneTabs"
          :key="item.value"
          :class="['scene-tab', { active: activeScene === item.value }]"
          @click="switchScene(item.value)"
        >
          {{ item.label }}
        </view>
      </view>

      <view v-if="activeScene === 'life'" class="category-scroll">
        <scroll-view scroll-x>
          <view class="category-list">
            <view
              v-for="item in feedCategories"
              :key="item"
              :class="['category-pill', { active: activeCategory === item }]"
              @click="activeCategory = item"
            >
              {{ item }}
            </view>
          </view>
        </scroll-view>
      </view>

      <view v-if="activeScene === 'life'" class="waterfall-grid">
        <view
          v-for="(column, columnIndex) in columns"
          :key="columnIndex"
          class="waterfall-column"
        >
          <view
            v-for="item in column"
            :key="item.id"
            class="life-card"
            @click="openDetail(item)"
          >
            <view class="cover-wrap">
              <image class="cover-img" :src="item.cover" mode="widthFix" />
              <view class="duration">{{ item.duration }}</view>
            </view>
            <view class="feed-body">
              <view class="feed-title">{{ item.title }}</view>
              <view class="feed-meta">
                <text>{{ item.author }}</text>
                <text>{{ item.city }}</text>
              </view>
              <view class="feed-actions">
                <view>
                  <wd-icon name="heart" size="14px" />
                  <text>{{ formatCount(item.likes) }}</text>
                </view>
                <view>
                  <wd-icon name="chat" size="14px" />
                  <text>{{ formatCount(item.comments) }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="activeScene === 'shop'" class="shop-grid">
        <view
          v-for="item in visibleFeeds"
          :key="item.id"
          class="shop-card"
          @click="openDetail(item)"
        >
          <image class="shop-cover" :src="item.cover" mode="aspectFill" />
          <view class="shop-body">
            <view class="feed-title">{{ item.title }}</view>
            <view class="shop-desc">{{ item.desc }}</view>
            <view class="price-row">
              <view class="price">¥{{ item.price }}</view>
              <view class="origin-price">¥{{ item.originPrice }}</view>
            </view>
            <view class="sales-line">已售 {{ formatCount(item.sales || 0) }} · {{ item.author }}</view>
          </view>
        </view>
      </view>

      <view v-if="activeScene === 'news'" class="news-list">
        <view
          v-for="item in visibleFeeds"
          :key="item.id"
          class="news-card"
          @click="openDetail(item)"
        >
          <view class="news-main">
            <view class="news-title">{{ item.title }}</view>
            <view class="news-desc">{{ item.desc }}</view>
            <view class="news-meta">{{ item.source }} · {{ item.time }} · {{ formatCount(item.comments) }} 评论</view>
          </view>
          <image class="news-cover" :src="item.cover" mode="aspectFill" />
        </view>
      </view>

      <view v-if="activeScene === 'moments'" class="moments-list">
        <view
          v-for="item in visibleFeeds"
          :key="item.id"
          class="moment-card"
          @click="openDetail(item)"
        >
          <view class="avatar">{{ item.author.slice(0, 1) }}</view>
          <view class="moment-main">
            <view class="moment-head">
              <view class="font-700">{{ item.author }}</view>
              <view class="muted-text">{{ item.time }}</view>
            </view>
            <view class="moment-text">{{ item.desc }}</view>
            <view class="moment-images" :class="{ single: (item.images?.length || 0) === 1 }">
              <image
                v-for="image in item.images"
                :key="image"
                class="moment-image"
                :src="image"
                mode="aspectFill"
              />
            </view>
            <view class="moment-actions">
              <text>{{ formatCount(item.likes) }} 赞</text>
              <text>{{ formatCount(item.comments) }} 评论</text>
            </view>
          </view>
        </view>
      </view>

      <view class="load-more">
        <wd-button v-if="hasMore" plain block @click="loadMore">加载更多</wd-button>
        <view v-else class="end-line">已经到底了</view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.waterfall-page {
  display: grid;
  gap: 22rpx;
}

.scene-tabs,
.category-scroll {
  position: sticky;
  z-index: 3;
  margin-inline: -32rpx;
  background: var(--app-canvas);
  padding-inline: 32rpx;
}

.scene-tabs {
  top: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14rpx;
  padding-block: 4rpx 12rpx;
}

.scene-tab {
  border: 1rpx solid var(--app-line);
  border-radius: 999rpx;
  background: #fff;
  color: var(--app-muted);
  font-size: 27rpx;
  font-weight: 700;
  padding: 16rpx 8rpx;
  text-align: center;
}

.scene-tab.active {
  border-color: var(--app-brand);
  background: #eef6ff;
  color: var(--app-brand);
}

.category-scroll {
  top: 86rpx;
  padding-block: 0 12rpx;
}

.category-list {
  display: flex;
  gap: 16rpx;
  width: max-content;
}

.category-pill {
  border: 1rpx solid var(--app-line);
  border-radius: 999rpx;
  background: #fff;
  color: var(--app-muted);
  font-size: 26rpx;
  padding: 14rpx 28rpx;
}

.category-pill.active {
  border-color: var(--app-brand);
  background: #eef6ff;
  color: var(--app-brand);
  font-weight: 700;
}

.waterfall-grid,
.shop-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
  align-items: start;
}

.waterfall-column {
  display: grid;
  gap: 18rpx;
  min-width: 0;
}

.life-card,
.shop-card,
.news-card,
.moment-card {
  border: 1rpx solid var(--app-line);
  background: #fff;
}

.life-card,
.shop-card {
  overflow: hidden;
  border-radius: 14rpx;
}

.cover-wrap {
  position: relative;
  min-height: 220rpx;
  background: #eef2f6;
}

.cover-img {
  display: block;
  width: 100%;
}

.duration {
  position: absolute;
  right: 12rpx;
  bottom: 12rpx;
  border-radius: 999rpx;
  background: rgba(16, 24, 40, 0.72);
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 12rpx;
}

.feed-body,
.shop-body {
  padding: 18rpx;
}

.feed-title,
.news-title {
  display: -webkit-box;
  overflow: hidden;
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.feed-meta,
.feed-actions,
.shop-desc,
.sales-line,
.news-desc,
.news-meta,
.moment-text,
.moment-actions {
  color: var(--app-muted);
  font-size: 23rpx;
}

.feed-meta {
  display: flex;
  justify-content: space-between;
  gap: 12rpx;
  margin-top: 14rpx;
}

.feed-actions {
  display: flex;
  gap: 18rpx;
  margin-top: 14rpx;
}

.feed-actions > view {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.shop-cover {
  display: block;
  width: 100%;
  height: 260rpx;
  background: #eef2f6;
}

.shop-desc {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 10rpx;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
  margin-top: 14rpx;
}

.price {
  color: #f04438;
  font-size: 34rpx;
  font-weight: 800;
}

.origin-price {
  color: #98a2b3;
  font-size: 22rpx;
  text-decoration: line-through;
}

.sales-line {
  margin-top: 8rpx;
}

.news-list,
.moments-list {
  display: grid;
  gap: 18rpx;
}

.news-card {
  display: flex;
  gap: 20rpx;
  border-radius: 12rpx;
  padding: 22rpx;
}

.news-main {
  min-width: 0;
  flex: 1;
}

.news-desc {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 10rpx;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.news-meta {
  margin-top: 14rpx;
}

.news-cover {
  flex: 0 0 176rpx;
  width: 176rpx;
  height: 132rpx;
  border-radius: 10rpx;
  background: #eef2f6;
}

.moment-card {
  display: flex;
  gap: 18rpx;
  border-radius: 12rpx;
  padding: 24rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 72rpx;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #eef6ff;
  color: var(--app-brand);
  font-weight: 800;
}

.moment-main {
  min-width: 0;
  flex: 1;
}

.moment-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.moment-text {
  margin-top: 12rpx;
  color: var(--app-ink);
  line-height: 1.6;
}

.moment-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8rpx;
  margin-top: 16rpx;
}

.moment-images.single {
  grid-template-columns: 280rpx;
}

.moment-image {
  width: 100%;
  height: 150rpx;
  border-radius: 8rpx;
  background: #eef2f6;
}

.moment-images.single .moment-image {
  height: 220rpx;
}

.moment-actions {
  display: flex;
  gap: 24rpx;
  margin-top: 16rpx;
}

.load-more {
  margin-top: 8rpx;
}

.end-line {
  color: var(--app-muted);
  font-size: 25rpx;
  text-align: center;
  padding: 18rpx 0;
}
</style>
