<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import {
  ecommercePageCount,
  ecommercePages,
  ecommercePlatformSummaries,
  ecommerceTerminalSummaries,
  getEcommercePagesByGroup,
  getEcommercePagesByPlatform,
  getEcommerceScenarioGroupsByTerminal
} from '@/utils/ecommerceCatalog'
import type { EcommercePlatformKey, EcommerceTerminalKey } from '@/utils/ecommerceCatalog'

const activeTerminal = ref<EcommerceTerminalKey | 'all'>('all')
const activePlatform = ref<EcommercePlatformKey | 'all'>('all')
const activeGroup = ref('all')

const terminalTabs = [
  { label: '全部端', value: 'all' },
  ...ecommerceTerminalSummaries.map(item => ({ label: item.label, value: item.key }))
]

const platformTabs = [
  { label: '全部', value: 'all' },
  ...ecommercePlatformSummaries.map(item => ({ label: item.shortLabel, value: item.key }))
]

const terminalCards = ecommerceTerminalSummaries

const scopedPlatformSummaries = computed(() => ecommercePlatformSummaries.map(item => ({
  ...item,
  count: getEcommercePagesByGroup('all', item.key, activeTerminal.value).length
})))

const groupTabs = computed(() => [
  { label: '全部场景', value: 'all' },
  ...getEcommerceScenarioGroupsByTerminal(activeTerminal.value).map(item => ({ label: item.label, value: item.key }))
])

watch(activeTerminal, () => {
  if (!groupTabs.value.some(item => item.value === activeGroup.value)) {
    activeGroup.value = 'all'
  }
})

const currentList = computed(() => {
  if (activeGroup.value === 'all') {
    return getEcommercePagesByPlatform(activePlatform.value)
      .filter(item => activeTerminal.value === 'all' || item.terminalKey === activeTerminal.value)
  }
  return getEcommercePagesByGroup(activeGroup.value, activePlatform.value, activeTerminal.value)
})

const featuredPages = computed(() => currentList.value.slice(0, 24))

function openRoute(url: string) {
  uni.navigateTo({ url })
}

function randomOpen() {
  const list = currentList.value.length ? currentList.value : ecommercePages
  const target = list[Math.floor(Math.random() * list.length)]
  if (target) openRoute(target.route)
}
</script>

<template>
  <PageShell title="电商专区" description="已批量铺开淘宝、京东、拼多多三大平台的浏览、下单、履约、售后、商家和营销场景页。">
    <view class="ecommerce-zone">
      <view class="hero-card">
        <view>
          <view class="hero-title">电商页面矩阵</view>
          <view class="hero-desc">当前已生成 {{ ecommercePageCount }} 个电商场景页，可直接从首页进入并继续点击浏览、下单、客服、支付等动作链路。</view>
        </view>
        <wd-button size="small" type="primary" @click="randomOpen">随机打开一个页面</wd-button>
      </view>

      <view class="platform-grid">
        <view
          v-for="item in terminalCards"
          :key="item.key"
          class="platform-card"
          :style="{ background: item.surface, borderColor: item.accent }"
        >
          <view class="platform-head">
            <view>
              <view class="platform-title">{{ item.label }}</view>
              <view class="platform-desc">{{ item.description }}</view>
            </view>
            <wd-tag plain>{{ item.count }} 页</wd-tag>
          </view>
          <view class="platform-actions">
            <wd-button size="small" type="primary" @click="activeTerminal = item.key">筛选该端</wd-button>
            <wd-button size="small" plain @click="openRoute(item.firstRoute)">打开一个页面</wd-button>
          </view>
        </view>

        <view
          v-for="item in scopedPlatformSummaries"
          :key="item.key"
          class="platform-card"
          :style="{ background: item.surface, borderColor: item.accent }"
        >
          <view class="platform-head">
            <view>
              <view class="platform-title">{{ item.label }}</view>
              <view class="platform-desc">{{ item.description }}</view>
            </view>
            <wd-tag plain>{{ item.count }} 页</wd-tag>
          </view>
          <view class="platform-actions">
            <wd-button size="small" type="primary" @click="openRoute(item.browseRoute)">去浏览</wd-button>
            <wd-button size="small" plain @click="openRoute(item.orderRoute)">去下单</wd-button>
          </view>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>平台筛选</text>
          <wd-tag plain>{{ currentList.length }} 页</wd-tag>
        </view>
        <view class="tab-row">
          <view
            v-for="item in terminalTabs"
            :key="item.value"
            :class="['tab-chip', { active: activeTerminal === item.value }]"
            @click="activeTerminal = item.value as EcommerceTerminalKey | 'all'"
          >
            {{ item.label }}
          </view>
        </view>
        <view class="tab-row">
          <view
            v-for="item in platformTabs"
            :key="item.value"
            :class="['tab-chip tab-chip--platform', { active: activePlatform === item.value }]"
            @click="activePlatform = item.value as EcommercePlatformKey | 'all'"
          >
            {{ item.label }}
          </view>
        </view>
        <view class="tab-row group-row">
          <view
            v-for="item in groupTabs"
            :key="item.value"
            :class="['tab-chip tab-chip--light', { active: activeGroup === item.value }]"
            @click="activeGroup = item.value"
          >
            {{ item.label }}
          </view>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>精选页面预览</text>
          <wd-tag type="success" plain>展示前 24 个</wd-tag>
        </view>
        <view class="scene-list">
          <view
            v-for="item in featuredPages"
            :key="item.id"
            class="scene-card"
            @click="openRoute(item.route)"
          >
            <view class="scene-meta">
              <wd-tag plain>{{ item.platform.shortLabel }}</wd-tag>
              <wd-tag type="success" plain>{{ item.terminalLabel }}</wd-tag>
              <wd-tag type="warning" plain>{{ item.groupLabel }}</wd-tag>
            </view>
            <view class="scene-title">{{ item.title }}</view>
            <view class="scene-desc">{{ item.summary }}</view>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.ecommerce-zone {
  display: grid;
  gap: 24rpx;
}

.hero-card,
.platform-card,
.panel-card,
.scene-card {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 24rpx;
}

.hero-card,
.panel-card {
  padding: 30rpx;
}

.hero-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.hero-title,
.platform-title,
.scene-title {
  color: var(--app-ink);
  font-weight: 700;
}

.hero-title {
  font-size: 38rpx;
}

.hero-desc,
.platform-desc,
.scene-desc {
  margin-top: 12rpx;
  color: var(--app-muted);
  font-size: 25rpx;
  line-height: 1.7;
}

.platform-grid,
.scene-list {
  display: grid;
  gap: 20rpx;
}

.platform-card,
.scene-card {
  padding: 24rpx;
}

.platform-head,
.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.platform-title,
.scene-title {
  font-size: 30rpx;
}

.platform-actions,
.tab-row,
.scene-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.platform-actions,
.tab-row {
  margin-top: 20rpx;
}

.group-row {
  margin-top: 16rpx;
}

.tab-chip {
  padding: 14rpx 22rpx;
  border-radius: 999rpx;
  background: var(--app-brand);
  color: #fff;
  font-size: 24rpx;
}

.tab-chip--light {
  background: #eef2ff;
  color: var(--app-brand);
}

.tab-chip--platform {
  background: #0f766e;
}

.tab-chip.active {
  box-shadow: 0 12rpx 30rpx rgba(30, 64, 175, 0.16);
}
</style>
