<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { customComponents } from '@/utils/customComponents'
import { componentGroups, type ComponentItem } from '@/utils/wotComponents'

const totalCount = computed(() => {
  return componentGroups.reduce((total, group) => total + group.items.length, 0)
})

const customCount = computed(() => customComponents.length)

function handleComponentTap(item: ComponentItem) {
  uni.navigateTo({
    url: `/pages/components/detail?path=${item.path}`
  })
}

function handleCustomTap(path: string) {
  uni.navigateTo({
    url: `/pages/components/custom?path=${path}`
  })
}
</script>

<template>
  <PageShell
    title="组件"
    :description="`这里新增了 ${customCount} 个独立封装的第三方组件，同时保留 ${totalCount} 个 Wot UI 基础条目。`"
  >
    <view class="component-catalog">
      <view class="custom-section">
        <view class="custom-summary">
          <view>
            <view class="custom-title">第三方组件</view>
            <view class="custom-desc">这部分是我们自己封装的本地组件，内部不依赖 `wd-*`，和原来的组件库完全分开。</view>
          </view>
          <view class="custom-count">{{ customCount }} 个组件</view>
        </view>

        <view class="custom-list">
          <view
            v-for="item in customComponents"
            :key="item.path"
            class="custom-card"
            @click="handleCustomTap(item.path)"
          >
            <view class="custom-card-main">
              <view class="custom-card-name">{{ item.title }}</view>
              <view class="custom-card-summary">{{ item.summary }}</view>
              <view class="custom-tags">
                <view
                  v-for="tag in item.tags"
                  :key="tag"
                >
                  {{ tag }}
                </view>
              </view>
            </view>
            <text class="custom-arrow">&gt;</text>
          </view>
        </view>
      </view>

      <view class="catalog-label">Wot UI 原始组件目录</view>

      <view
        v-for="group in componentGroups"
        :key="group.title"
        class="catalog-section"
      >
        <view class="catalog-header">
          <text class="catalog-title">{{ group.title }}</text>
          <wd-icon name="arrow-down" size="16px" custom-class="catalog-arrow" />
        </view>

        <wd-cell-group border>
          <wd-cell
            v-for="item in group.items"
            :key="item.path"
            :title="`${item.name} ${item.title}`"
            is-link
            clickable
            @click="handleComponentTap(item)"
          />
        </wd-cell-group>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.component-catalog {
  display: grid;
  gap: 28rpx;
}

.custom-section,
.catalog-section {
  overflow: hidden;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
}

.custom-summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
  padding: 32rpx;
  border-bottom: 1rpx solid var(--app-line);
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
}

.catalog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid var(--app-line);
}

.custom-title,
.catalog-title {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 700;
}

.custom-desc {
  margin-top: 12rpx;
  color: var(--app-muted);
  font-size: 26rpx;
  line-height: 1.6;
}

.custom-count {
  flex-shrink: 0;
  border-radius: 999rpx;
  background: #eef4ff;
  padding: 12rpx 20rpx;
  color: #2756d8;
  font-size: 22rpx;
  font-weight: 700;
}

.custom-list {
  display: grid;
  gap: 20rpx;
  padding: 24rpx;
}

.custom-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  border: 1rpx solid #e9eef6;
  border-radius: 12rpx;
  background: #f9fbff;
  padding: 26rpx;
}

.custom-card-main {
  min-width: 0;
  flex: 1;
}

.custom-card-name {
  color: var(--app-ink);
  font-size: 30rpx;
  font-weight: 700;
}

.custom-card-summary {
  margin-top: 10rpx;
  color: var(--app-muted);
  font-size: 25rpx;
  line-height: 1.6;
}

.custom-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 18rpx;
}

.custom-tags view {
  border: 1rpx solid #dde5f2;
  border-radius: 999rpx;
  background: #fff;
  padding: 8rpx 16rpx;
  color: #5f6b7a;
  font-size: 22rpx;
  font-weight: 700;
}

.catalog-label {
  padding-left: 8rpx;
  color: var(--app-muted);
  font-size: 24rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

:deep(.custom-arrow),
:deep(.catalog-arrow) {
  color: var(--app-muted);
}
</style>
