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
    title="自定义的组件"
    :description="`这里新增了 ${customCount} 个可直接使用的业务组合组件，同时保留 ${totalCount} 个 Wot UI 基础条目。`"
  >
    <view class="component-catalog">
      <view class="custom-section">
        <view class="custom-summary">
          <view>
            <view class="custom-title">自定义的组件</view>
            <view class="custom-desc">不和基础按钮、输入框重复，直接给你偏业务场景的组合式组件。</view>
          </view>
          <wd-tag type="primary">{{ customCount }} 个可用组件</wd-tag>
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
                <wd-tag
                  v-for="tag in item.tags"
                  :key="tag"
                  plain
                >
                  {{ tag }}
                </wd-tag>
              </view>
            </view>
            <wd-icon name="arrow-right" size="18px" custom-class="custom-arrow" />
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
