<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { feedCategories, formatCount, waterfallFeeds, type WaterfallFeed } from '@/utils/waterfallFeeds'

const activeCategory = ref('推荐')
const visibleCount = ref(6)

const filteredFeeds = computed(() => {
  if (activeCategory.value === '推荐') return waterfallFeeds
  return waterfallFeeds.filter((item) => item.category === activeCategory.value)
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

watch(activeCategory, () => {
  visibleCount.value = 6
})

onReachBottom(() => {
  loadMore()
})

function loadMore() {
  if (!hasMore.value) return
  visibleCount.value = Math.min(visibleCount.value + 4, filteredFeeds.value.length)
}

function openDetail(item: WaterfallFeed) {
  uni.navigateTo({
    url: `/pages/examples/waterfall-detail?id=${item.id}`
  })
}
</script>

<template>
  <PageShell title="瀑布流示例" description="短视频/本地生活内容流，支持分类筛选、动态加载和点击进入详情。">
    <view class="waterfall-page">
      <view class="category-scroll">
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

      <view class="waterfall-grid">
        <view
          v-for="(column, columnIndex) in columns"
          :key="columnIndex"
          class="waterfall-column"
        >
          <view
            v-for="item in column"
            :key="item.id"
            class="feed-card"
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

.category-scroll {
  position: sticky;
  top: 0;
  z-index: 2;
  margin-inline: -32rpx;
  background: var(--app-canvas);
  padding: 4rpx 32rpx 12rpx;
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

.waterfall-grid {
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

.feed-card {
  overflow: hidden;
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
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

.feed-body {
  padding: 18rpx;
}

.feed-title {
  display: -webkit-box;
  overflow: hidden;
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.feed-meta {
  display: flex;
  justify-content: space-between;
  gap: 12rpx;
  margin-top: 14rpx;
  color: var(--app-muted);
  font-size: 23rpx;
}

.feed-actions {
  display: flex;
  gap: 18rpx;
  margin-top: 14rpx;
  color: var(--app-muted);
  font-size: 23rpx;
}

.feed-actions > view {
  display: flex;
  align-items: center;
  gap: 6rpx;
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
