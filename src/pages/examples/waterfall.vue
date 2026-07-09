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

// Dynamic column count state
const colCount = ref(3) // 2 | 3 | 4 | 5
const columnOptions = [
  { label: '2列', value: 2 },
  { label: '3列(默认)', value: 3 },
  { label: '4列', value: 4 },
  { label: '5列', value: 5 }
]

const sceneDesc = computed(() => sceneTabs.find((item) => item.value === activeScene.value)?.desc || '')

const sceneFeeds = computed(() => getFeedsByScene(activeScene.value))

const filteredFeeds = computed(() => {
  if (activeScene.value !== 'life') return sceneFeeds.value
  if (activeCategory.value === '推荐') return sceneFeeds.value
  return sceneFeeds.value.filter((item) => item.category === activeCategory.value)
})

const visibleFeeds = computed(() => filteredFeeds.value.slice(0, visibleCount.value))

// Generalized N-Column Height Balancing Algorithm
const columns = computed(() => {
  // Initialize dynamic arrays of columns and heights
  const cols: WaterfallFeed[][] = Array.from({ length: colCount.value }, () => [])
  const heights = Array(colCount.value).fill(0)

  visibleFeeds.value.forEach((item) => {
    // Find the column index with the minimum accumulated height
    let minIndex = 0
    let minHeight = heights[0]
    for (let i = 1; i < colCount.value; i++) {
      if (heights[i] < minHeight) {
        minHeight = heights[i]
        minIndex = i
      }
    }
    // Push the item to that column and update its height
    cols[minIndex].push(item)
    heights[minIndex] += item.ratio
  })

  return cols
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
  visibleCount.value = Math.min(visibleCount.value + 6, filteredFeeds.value.length)
}

function openDetail(item: WaterfallFeed) {
  uni.navigateTo({
    url: `/pages/examples/waterfall-detail?id=${item.id}&type=${item.scene}`
  })
}
</script>

<template>
  <PageShell title="自适应瀑布流" :description="sceneDesc">
    <view :class="['waterfall-page', 'col-size-' + colCount]">
      
      <!-- Scene Selection tabs -->
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

      <!-- Life category pills -->
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

      <!-- COLUMN COUNT SELECTOR BAR (2, 3, 4, 5) -->
      <view class="column-count-selector flex items-center justify-between mt-1">
        <text class="col-lbl font-bold">排列视图调整：</text>
        <view class="col-btn-group flex">
          <view
            v-for="opt in columnOptions"
            :key="opt.value"
            :class="['col-btn', { active: colCount === opt.value }]"
            @click="colCount = opt.value"
          >
            {{ opt.label }}
          </view>
        </view>
      </view>

      <!-- ==========================================
           1. LIFE SHARING WATERFALL GRID (Dynamic N Columns)
           ========================================== -->
      <view
        v-if="activeScene === 'life'"
        class="waterfall-grid"
        :style="{ gridTemplateColumns: 'repeat(' + colCount + ', 1fr)' }"
      >
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
              <view class="feed-meta mt-1">
                <text class="author-name">{{ item.author }}</text>
                <text class="city-name">{{ item.city }}</text>
              </view>
              <view class="feed-actions mt-1">
                <view class="action-item">
                  <wd-icon name="heart" size="12px" />
                  <text class="action-val">{{ formatCount(item.likes) }}</text>
                </view>
                <view class="action-item">
                  <wd-icon name="chat" size="12px" />
                  <text class="action-val">{{ formatCount(item.comments) }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- ==========================================
           2. SHOPPING GRID (Dynamic N Grid columns)
           ========================================== -->
      <view
        v-if="activeScene === 'shop'"
        class="shop-grid"
        :style="{ gridTemplateColumns: 'repeat(' + colCount + ', 1fr)' }"
      >
        <view
          v-for="item in visibleFeeds"
          :key="item.id"
          class="shop-card"
          @click="openDetail(item)"
        >
          <image class="shop-cover" :src="item.cover" mode="aspectFill" />
          <view class="shop-body">
            <view class="feed-title">{{ item.title }}</view>
            <view class="shop-desc mt-1">{{ item.desc }}</view>
            <view class="price-row mt-1">
              <view class="price">¥{{ item.price }}</view>
              <view class="origin-price">¥{{ item.originPrice }}</view>
            </view>
            <view class="sales-line mt-1">已售 {{ formatCount(item.sales || 0) }}</view>
          </view>
        </view>
      </view>

      <!-- 3. NEWS FEED LIST -->
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

      <!-- 4. MOMENTS SOCIAL TIMELINE -->
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

      <!-- Load more button -->
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

/* Column adjustment selector bar */
.column-count-selector {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
}

.col-lbl {
  font-size: 20rpx;
  color: var(--app-ink);
}

.col-btn-group {
  gap: 8rpx;
}

.col-btn {
  background: #f1f5f9;
  border-radius: 8rpx;
  font-size: 18rpx;
  color: var(--app-muted);
  padding: 8rpx 16rpx;
  border: 1rpx solid var(--app-line);
  cursor: pointer;
  
  &.active {
    background: var(--app-brand);
    color: #fff;
    border-color: var(--app-brand);
    font-weight: 800;
  }
}

/* Waterfall and Shop Grid structures */
.waterfall-grid,
.shop-grid {
  display: grid;
  gap: 12rpx;
  align-items: start;
}

.waterfall-column {
  display: grid;
  gap: 12rpx;
  min-width: 0;
}

.life-card,
.shop-card,
.news-card,
.moment-card {
  border: 1rpx solid var(--app-line);
  background: #fff;
  overflow: hidden;
  border-radius: 14rpx;
}

.cover-wrap {
  position: relative;
  min-height: 100rpx;
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
  font-size: 16rpx;
  padding: 4rpx 10rpx;
}

.feed-body,
.shop-body {
  padding: 12rpx;
}

.feed-title {
  display: -webkit-box;
  overflow: hidden;
  color: var(--app-ink);
  font-weight: 700;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.feed-meta {
  display: flex;
  justify-content: space-between;
  gap: 8rpx;
}

.feed-actions {
  display: flex;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.shop-cover {
  display: block;
  width: 100%;
  height: 180rpx;
  background: #eef2f6;
}

.shop-desc {
  display: -webkit-box;
  overflow: hidden;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}

.price {
  color: #f04438;
  font-weight: 800;
}

.origin-price {
  color: #98a2b3;
  text-decoration: line-through;
}

/* ==========================================
   DYNAMIC RESPONSIVE CARD STYLES FOR N COLUMNS
   ========================================== */

/* 2 Columns sizes */
.col-size-2 {
  .feed-title { font-size: 24rpx; }
  .author-name, .city-name, .action-val, .shop-desc, .sales-line, .origin-price { font-size: 18rpx; }
  .feed-actions { gap: 16rpx; }
  .price { font-size: 28rpx; }
  .shop-cover { height: 260rpx; }
}

/* 3 Columns sizes */
.col-size-3 {
  .feed-title { font-size: 20rpx; }
  .author-name, .city-name, .action-val, .shop-desc, .sales-line, .origin-price { font-size: 16rpx; }
  .feed-actions { gap: 12rpx; }
  .price { font-size: 24rpx; }
  .shop-cover { height: 180rpx; }
}

/* 4 Columns sizes */
.col-size-4 {
  .feed-title { font-size: 18rpx; -webkit-line-clamp: 1; height: 25rpx; }
  .author-name, .city-name, .action-val, .shop-desc, .sales-line, .origin-price { font-size: 14rpx; }
  .feed-actions { gap: 8rpx; }
  .price { font-size: 21rpx; }
  .shop-cover { height: 130rpx; }
  .duration { font-size: 12rpx; padding: 2rpx 6rpx; }
  .feed-meta { flex-direction: column; gap: 2rpx; }
  .shop-desc { -webkit-line-clamp: 1; }
}

/* 5 Columns sizes */
.col-size-5 {
  .feed-title { font-size: 16rpx; -webkit-line-clamp: 1; height: 22rpx; }
  .author-name, .city-name, .action-val, .shop-desc, .sales-line, .origin-price { font-size: 12rpx; }
  .feed-actions { gap: 4rpx; }
  .price { font-size: 18rpx; }
  .shop-cover { height: 100rpx; }
  .duration { display: none; }
  .feed-meta { flex-direction: column; gap: 2rpx; }
  .shop-desc { -webkit-line-clamp: 1; }
}

/* Fallback lists */
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

.news-desc, .news-meta, .moment-text, .moment-actions {
  color: var(--app-muted);
  font-size: 23rpx;
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

.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
</style>
