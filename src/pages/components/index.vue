<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { componentGroups, type ComponentItem } from '@/utils/wotComponents'

const totalCount = computed(() => {
  return componentGroups.reduce((total, group) => total + group.items.length, 0)
})

function handleComponentTap(item: ComponentItem) {
  uni.navigateTo({
    url: `/pages/components/detail?path=${item.path}`
  })
}
</script>

<template>
  <PageShell title="组件" :description="`Wot UI 组件总览，共 ${totalCount} 个条目。`">
    <view class="component-catalog">
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

.catalog-section {
  overflow: hidden;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
}

.catalog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid var(--app-line);
}

.catalog-title {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 700;
}

:deep(.catalog-arrow) {
  color: var(--app-muted);
}
</style>
