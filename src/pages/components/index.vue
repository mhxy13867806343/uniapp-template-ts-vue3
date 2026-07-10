<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { customComponents } from '@/utils/customComponents'
import { componentGroups, type ComponentItem } from '@/utils/wotComponents'

const activeTab = ref('all')

const tabs = [
  { name: 'all', label: '全部' },
  { name: 'custom', label: '第三方组件' },
  { name: '基础', label: '基础' },
  { name: '导航', label: '导航' },
  { name: '录入', label: '录入' },
  { name: '反馈', label: '反馈' },
  { name: '展示', label: '展示' },
  { name: '组合式API', label: '组合式API' }
]

const totalCount = computed(() => {
  return componentGroups.reduce((total, group) => total + group.items.length, 0)
})

const customCount = computed(() => customComponents.length)

const filteredCustomComponents = computed(() => {
  if (activeTab.value === 'all' || activeTab.value === 'custom') {
    return customComponents
  }

  return []
})

const filteredComponentGroups = computed(() => {
  if (activeTab.value === 'all') {
    return componentGroups
  }

  if (activeTab.value === 'custom') {
    return []
  }

  return componentGroups.filter(group => group.title === activeTab.value)
})

const visibleCount = computed(() => {
  const groupCount = filteredComponentGroups.value.reduce((total, group) => total + group.items.length, 0)
  return filteredCustomComponents.value.length + groupCount
})

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
      <view class="summary-card">
        <view>
          <view class="summary-title">组件中心</view>
          <view class="summary-desc">用 tabs 快速切换第三方组件和 Wot 原始组件分类，找组件会更顺手。</view>
        </view>
        <wd-tag type="primary">{{ visibleCount }} 个条目</wd-tag>
      </view>

      <view class="tabs-container">
        <wd-tabs v-model="activeTab" custom-class="custom-tabs">
          <wd-tab
            v-for="tab in tabs"
            :key="tab.name"
            :name="tab.name"
            :title="tab.label"
          />
        </wd-tabs>
      </view>

      <view
        v-if="activeTab === 'all' || activeTab === 'custom'"
        class="custom-section"
      >
        <view class="catalog-label">第三方组件目录</view>

        <view class="custom-summary">
          <view>
            <view class="custom-title">第三方组件</view>
            <view class="custom-desc">这部分是我们自己封装的本地组件，内部不依赖 `wd-*`，和原来的组件库完全分开。</view>
          </view>
          <view class="custom-count">{{ customCount }} 个组件</view>
        </view>

        <view v-if="filteredCustomComponents.length" class="custom-list">
          <view
            v-for="item in filteredCustomComponents"
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

        <view v-else class="empty-tip">当前标签下没有第三方组件条目。</view>
      </view>

      <view v-if="filteredComponentGroups.length" class="catalog-label">Wot UI 原始组件目录</view>

      <view
        v-for="group in filteredComponentGroups"
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

      <view
        v-if="!filteredComponentGroups.length && !filteredCustomComponents.length"
        class="empty-panel"
      >
        <view class="empty-panel__title">当前分类没有组件</view>
        <view class="empty-panel__desc">可以切换到其他 tabs 继续查看。</view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.component-catalog {
  display: grid;
  gap: 24rpx;
}

.tabs-container {
  position: sticky;
  top: var(--window-top);
  z-index: 100;
  background: #fff;
  border-bottom: 1rpx solid var(--app-line);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
}

.summary-card,
.custom-section,
.catalog-section {
  overflow: hidden;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
}

.summary-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
  padding: 32rpx;
}

.summary-title {
  color: var(--app-ink);
  font-size: 34rpx;
  font-weight: 700;
}

.summary-desc {
  margin-top: 12rpx;
  color: var(--app-muted);
  font-size: 26rpx;
  line-height: 1.6;
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

.empty-tip,
.empty-panel {
  padding: 28rpx;
  color: var(--app-muted);
  font-size: 25rpx;
}

.empty-panel {
  border: 1rpx dashed #d8e0ec;
  border-radius: 12rpx;
  background: #fafcff;
}

.empty-panel__title {
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 700;
}

.empty-panel__desc {
  margin-top: 10rpx;
  font-size: 24rpx;
  line-height: 1.6;
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
