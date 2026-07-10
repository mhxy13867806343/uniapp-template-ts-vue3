<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import type { EcommerceScenePage } from '@/utils/ecommerceCatalog'
import { getRelatedEcommercePages } from '@/utils/ecommerceCatalog'

const props = defineProps<{
  page: EcommerceScenePage
}>()

const toast = useToast('ecommerce-scene-toast')

const relatedPages = computed(() => getRelatedEcommercePages(props.page, 6))

function openRoute(url: string) {
  uni.navigateTo({ url })
}

function handleAction(action: string) {
  toast.success(`${props.page.platform.shortLabel} · ${action}`)
}
</script>

<template>
  <PageShell :title="page.title" :description="page.summary">
    <view class="scene-page">
      <wd-toast selector="ecommerce-scene-toast" />

      <view class="hero-card" :style="{ background: page.platform.gradient }">
        <view class="hero-main">
          <view class="hero-kicker">{{ page.platform.label }}</view>
          <view class="hero-title">{{ page.title }}</view>
          <view class="hero-subtitle">{{ page.subtitle }}</view>
        </view>
        <view class="hero-badges">
          <view v-for="tag in page.tags" :key="tag" class="hero-badge">{{ tag }}</view>
        </view>
      </view>

      <view class="metric-grid">
        <view v-for="item in page.metrics" :key="item.label" class="metric-card">
          <view class="metric-label">{{ item.label }}</view>
          <view class="metric-value">{{ item.value }}</view>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>页面定位</text>
          <wd-tag plain>{{ page.groupLabel }}</wd-tag>
        </view>
        <view class="summary-text">{{ page.groupDescription }}</view>
        <view class="highlight-list">
          <view v-for="item in page.highlights" :key="item" class="highlight-item">
            <text class="highlight-dot" />
            <text>{{ item }}</text>
          </view>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>高频动作</text>
          <wd-tag type="success" plain>可直接点击</wd-tag>
        </view>
        <view class="action-grid">
          <wd-button
            v-for="item in page.actions"
            :key="item"
            size="small"
            type="primary"
            plain
            @click="handleAction(item)"
          >
            {{ item }}
          </wd-button>
        </view>

        <view class="jump-grid">
          <view class="jump-card" @click="openRoute(page.browseRoute)">
            <view class="jump-title">去浏览会场</view>
            <view class="jump-desc">快速回到 {{ page.platform.shortLabel }} 浏览链路</view>
          </view>
          <view class="jump-card" @click="openRoute(page.orderRoute)">
            <view class="jump-title">去下单支付</view>
            <view class="jump-desc">快速进入 {{ page.platform.shortLabel }} 收银台页</view>
          </view>
          <view class="jump-card" @click="openRoute(page.serviceRoute)">
            <view class="jump-title">去客服服务</view>
            <view class="jump-desc">继续联调客服和售后链路</view>
          </view>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>同平台更多页面</text>
          <wd-tag type="warning" plain>{{ relatedPages.length }} 个推荐</wd-tag>
        </view>
        <view class="related-list">
          <view
            v-for="item in relatedPages"
            :key="item.id"
            class="related-card"
            @click="openRoute(item.route)"
          >
            <view class="related-title">{{ item.title }}</view>
            <view class="related-desc">{{ item.summary }}</view>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.scene-page {
  display: grid;
  gap: 24rpx;
}

.hero-card,
.panel-card,
.metric-card,
.related-card,
.jump-card {
  border-radius: 24rpx;
}

.hero-card {
  padding: 32rpx;
  color: #fff;
}

.hero-main {
  display: grid;
  gap: 10rpx;
}

.hero-kicker {
  font-size: 22rpx;
  opacity: 0.88;
}

.hero-title {
  font-size: 40rpx;
  font-weight: 800;
}

.hero-subtitle {
  font-size: 25rpx;
  line-height: 1.6;
  opacity: 0.92;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 24rpx;
}

.hero-badge {
  padding: 10rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.18);
  font-size: 22rpx;
}

.metric-grid,
.jump-grid,
.related-list {
  display: grid;
  gap: 20rpx;
}

.metric-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.metric-card,
.panel-card,
.related-card,
.jump-card {
  background: #fff;
  border: 1rpx solid var(--app-line);
}

.metric-card {
  padding: 24rpx;
}

.metric-label {
  color: var(--app-muted);
  font-size: 24rpx;
}

.metric-value {
  margin-top: 12rpx;
  color: var(--app-ink);
  font-size: 34rpx;
  font-weight: 700;
}

.panel-card {
  padding: 28rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: var(--app-ink);
}

.summary-text,
.related-desc,
.jump-desc {
  margin-top: 14rpx;
  color: var(--app-muted);
  font-size: 25rpx;
  line-height: 1.7;
}

.highlight-list {
  display: grid;
  gap: 16rpx;
  margin-top: 24rpx;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 14rpx;
  color: var(--app-ink);
  font-size: 26rpx;
  line-height: 1.7;
}

.highlight-dot {
  width: 12rpx;
  height: 12rpx;
  margin-top: 12rpx;
  border-radius: 50%;
  background: var(--app-brand);
}

.action-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 24rpx;
}

.jump-grid {
  margin-top: 24rpx;
}

.jump-card,
.related-card {
  padding: 24rpx;
}

.jump-title,
.related-title {
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 700;
}
</style>
