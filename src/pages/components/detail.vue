<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import WotShowcaseRenderer from '@/components/wot/WotShowcaseRenderer.vue'
import { componentGroups, componentList, findComponent, getComponentApi, getComponentCode, getComponentDocUrl, getComponentEvents, getComponentScenes, getComponentSlots, getComponentSummary } from '@/utils/wotComponents'

const currentPath = ref('button')

const detail = computed(() => findComponent(currentPath.value) || componentList[0])
const apiRows = computed(() => getComponentApi(detail.value))
const eventRows = computed(() => getComponentEvents(detail.value))
const slotRows = computed(() => getComponentSlots(detail.value))
const sampleCode = computed(() => getComponentCode(detail.value))
const currentSummary = computed(() => getComponentSummary(detail.value))
const currentScenes = computed(() => getComponentScenes(detail.value))
const docUrl = computed(() => getComponentDocUrl(detail.value))
const docSections = [
  { id: 'wot-current-demo', label: '预览' },
  { id: 'wot-scenes', label: '场景' },
  { id: 'wot-code', label: '代码' },
  { id: 'wot-api', label: 'API' },
  { id: 'wot-events', label: '事件' },
  { id: 'wot-slots', label: '插槽' }
]
const componentMeta = computed(() => ([
  { label: '所属分组', value: detail.value.group },
  { label: '组件标识', value: detail.value.path },
  { label: '场景数量', value: `${currentScenes.value.length}` },
  { label: 'API 条数', value: `${apiRows.value.length}` },
  { label: '事件条数', value: `${eventRows.value.length}` },
  { label: '插槽条数', value: `${slotRows.value.length}` }
]))

const currentGroup = computed(() => {
  return componentGroups.find(group => group.title === detail.value.group)
})

const currentGroupItems = computed(() => currentGroup.value?.items || [])

const relatedItems = computed(() => {
  return currentGroupItems.value
    .filter(item => item.path !== currentPath.value)
    .slice(0, 10)
})

function scrollToCurrentDemo(duration = 280) {
  nextTick(() => {
    setTimeout(() => {
      uni.pageScrollTo({
        selector: '#wot-current-demo',
        duration
      })
    }, 40)
  })
}

onLoad((query) => {
  if (typeof query?.path === 'string') {
    currentPath.value = decodeURIComponent(query.path)
    scrollToCurrentDemo(0)
  }
})

watch(currentPath, () => {
  scrollToCurrentDemo()
})

function selectComponent(path: string) {
  if (currentPath.value === path) {
    scrollToCurrentDemo()
    return
  }

  currentPath.value = path
}

function copyDocLink() {
  uni.setClipboardData({
    data: docUrl.value,
    success: () => {
      uni.showToast({
        icon: 'none',
        title: '官方文档链接已复制'
      })
    }
  })
}

function scrollToSection(selector: string) {
  uni.pageScrollTo({
    selector: `#${selector}`,
    duration: 280
  })
}
</script>

<template>
  <PageShell
    :title="`${detail.name} ${detail.title}`"
    :description="`${detail.group} / ${currentSummary}`"
  >
    <view class="detail-page">
      <view class="intro-card">
        <view class="intro-kicker">Wot UI Showcase</view>
        <view class="intro-title">{{ detail.title }} 组件详情</view>
        <view class="intro-desc">
          这里把 Wot UI 组件也补成了完整示例页，除了基础预览，还能继续在同组组件之间快速切换。
        </view>
        <view class="intro-actions">
          <wd-button size="small" type="primary" @click="copyDocLink">复制官方文档链接</wd-button>
          <view class="intro-link">{{ docUrl }}</view>
        </view>
      </view>

      <view class="meta-card">
        <view class="section-title">组件信息</view>
        <view class="meta-grid">
          <view
            v-for="item in componentMeta"
            :key="item.label"
            class="meta-item"
          >
            <view class="meta-item__label">{{ item.label }}</view>
            <view class="meta-item__value">{{ item.value }}</view>
          </view>
        </view>
      </view>

      <view class="nav-card">
        <view class="section-title">文档导航</view>
        <view class="nav-chip-list">
          <view
            v-for="item in docSections"
            :key="item.id"
            class="nav-chip"
            @click="scrollToSection(item.id)"
          >
            {{ item.label }}
          </view>
        </view>
      </view>

      <view class="group-card">
        <view class="group-card__head">
          <view>
            <view class="section-title">同组组件</view>
            <view class="group-card__desc">
              当前分组：{{ detail.group }}，共 {{ currentGroupItems.length }} 个组件。
            </view>
          </view>
          <wd-tag type="primary" plain>{{ detail.group }}</wd-tag>
        </view>

        <view class="example-grid">
          <view
            v-for="item in currentGroupItems"
            :key="item.path"
            :class="['example-tile', { 'example-tile--active': item.path === currentPath }]"
            @click="selectComponent(item.path)"
          >
            <view class="example-tile__head">
              <view class="example-tile__title">{{ item.title }}</view>
              <view class="example-tile__name">{{ item.name }}</view>
            </view>
            <view class="example-tile__preview">
              <WotShowcaseRenderer :path="item.path" compact />
            </view>
            <view class="example-tile__summary">{{ getComponentSummary(item) }}</view>
          </view>
        </view>
      </view>

      <view id="wot-current-demo" class="demo-card">
        <view class="demo-card__head">
          <view>
            <view class="demo-title">{{ detail.title }}</view>
            <view class="demo-summary">{{ currentSummary }}</view>
          </view>
          <view class="demo-tags">
            <wd-tag type="primary">{{ detail.group }}</wd-tag>
            <wd-tag plain>{{ detail.name }}</wd-tag>
          </view>
        </view>

        <view class="demo-preview-label">真实预览</view>
        <WotShowcaseRenderer :path="currentPath" />
      </view>

      <view v-if="relatedItems.length" class="detail-card">
        <view class="section-title">同组更多示例</view>
        <view class="related-grid">
          <view
            v-for="item in relatedItems"
            :key="item.path"
            class="related-card"
            @click="selectComponent(item.path)"
          >
            <view class="related-card__title">{{ item.title }}</view>
            <view class="related-card__summary">{{ getComponentSummary(item) }}</view>
          </view>
        </view>
      </view>

      <view id="wot-scenes" class="detail-card">
        <view class="section-title">适用场景</view>
        <view class="scene-list">
          <view
            v-for="scene in currentScenes"
            :key="scene"
            class="scene-item"
          >
            <view class="scene-dot" />
            <text>{{ scene }}</text>
          </view>
        </view>
      </view>

      <view id="wot-code" class="detail-card">
        <view class="code-card__head">
          <view class="section-title">示例代码</view>
          <wd-tag type="success" plain>代码可查看</wd-tag>
        </view>
        <view class="code-box">
          <text>{{ sampleCode }}</text>
        </view>
      </view>

      <view id="wot-api" class="detail-card">
        <view class="section-title">API 方法</view>
        <view class="api-table">
          <view class="api-head api-row">
            <text>名称</text>
            <text>说明</text>
            <text>类型</text>
            <text>默认值</text>
          </view>
          <view
            v-for="row in apiRows"
            :key="row.name"
            class="api-row"
          >
            <text class="api-name">{{ row.name }}</text>
            <text>{{ row.description }}</text>
            <text>{{ row.type }}</text>
            <text>{{ row.defaultValue }}</text>
          </view>
        </view>
      </view>

      <view id="wot-events" class="detail-card">
        <view class="section-title">事件说明</view>
        <view class="event-table">
          <view class="event-head event-row">
            <text>事件名</text>
            <text>说明</text>
            <text>回调参数</text>
          </view>
          <view
            v-for="row in eventRows"
            :key="row.name"
            class="event-row"
          >
            <text class="api-name">{{ row.name }}</text>
            <text>{{ row.description }}</text>
            <text>{{ row.payload }}</text>
          </view>
        </view>
      </view>

      <view id="wot-slots" class="detail-card">
        <view class="section-title">插槽说明</view>
        <view class="slot-list">
          <view
            v-for="row in slotRows"
            :key="row.name"
            class="slot-item"
          >
            <view class="slot-item__name">{{ row.name }}</view>
            <view class="slot-item__desc">{{ row.description }}</view>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.detail-page {
  display: grid;
  gap: 24rpx;
}

.intro-card,
.meta-card,
.nav-card,
.group-card,
.demo-card,
.detail-card {
  overflow: hidden;
  border: 1rpx solid #dde4ef;
  border-radius: 22rpx;
  background: #fff;
}

.intro-card {
  background:
    radial-gradient(circle at top left, rgba(56, 110, 255, 0.12), transparent 36%),
    linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%);
  padding: 30rpx;
}

.intro-kicker {
  color: #2b5fe0;
  font-size: 22rpx;
  font-weight: 800;
  letter-spacing: 2rpx;
  text-transform: uppercase;
}

.intro-title,
.section-title,
.demo-title {
  color: #182235;
  font-size: 32rpx;
  font-weight: 800;
}

.intro-title {
  margin-top: 12rpx;
}

.intro-desc,
.group-card__desc,
.demo-summary,
.example-tile__summary,
.related-card__summary {
  color: #6a7485;
  font-size: 24rpx;
  line-height: 1.7;
}

.intro-desc {
  margin-top: 12rpx;
}

.intro-actions {
  display: grid;
  gap: 16rpx;
  margin-top: 22rpx;
}

.intro-link {
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.82);
  padding: 18rpx 20rpx;
  color: #55708d;
  font-size: 22rpx;
  line-height: 1.7;
  word-break: break-all;
}

.meta-card,
.nav-card,
.group-card,
.detail-card {
  padding: 28rpx;
}

.group-card__head,
.demo-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
}

.example-grid,
.related-grid {
  display: grid;
  gap: 16rpx;
  margin-top: 20rpx;
}

.example-tile,
.related-card {
  border: 1rpx solid #e4e9f3;
  border-radius: 18rpx;
  background: #fff;
  padding: 22rpx;
}

.example-tile--active {
  border-color: #8fb0ff;
  background:
    radial-gradient(circle at top left, rgba(82, 121, 255, 0.12), transparent 46%),
    #f4f8ff;
  box-shadow: 0 16rpx 40rpx rgba(61, 95, 192, 0.08);
}

.example-tile__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14rpx;
}

.example-tile__title,
.related-card__title {
  color: #182235;
  font-size: 27rpx;
  font-weight: 800;
}

.example-tile__name {
  flex-shrink: 0;
  color: #426cff;
  font-size: 21rpx;
  font-weight: 700;
}

.example-tile__preview {
  overflow: hidden;
  margin-top: 14rpx;
  border: 1rpx solid #edf1f6;
  border-radius: 16rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 16rpx;
  pointer-events: none;
}

.example-tile__summary,
.related-card__summary {
  margin-top: 10rpx;
}

.demo-card {
  padding: 28rpx;
}

.demo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.demo-preview-label {
  margin: 24rpx 0 18rpx;
  color: #426cff;
  font-size: 22rpx;
  font-weight: 800;
  letter-spacing: 1rpx;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 20rpx;
}

.meta-item {
  border: 1rpx solid #e6ecf5;
  border-radius: 18rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%);
  padding: 20rpx;
}

.meta-item__label {
  color: #6c7c91;
  font-size: 22rpx;
  line-height: 1.6;
}

.meta-item__value {
  margin-top: 8rpx;
  color: #182235;
  font-size: 26rpx;
  font-weight: 800;
  line-height: 1.6;
  word-break: break-all;
}

.nav-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 20rpx;
}

.nav-chip {
  border-radius: 999rpx;
  background: #edf3ff;
  padding: 14rpx 24rpx;
  color: #2d61e2;
  font-size: 23rpx;
  font-weight: 700;
  line-height: 1;
}

.code-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 18rpx;
}

.scene-list {
  display: grid;
  gap: 16rpx;
}

.scene-item {
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: #56657a;
  font-size: 25rpx;
  line-height: 1.7;
}

.scene-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 999rpx;
  background: #426cff;
  flex-shrink: 0;
}

.code-box {
  border-radius: 12rpx;
  background: #111827;
  padding: 24rpx;
  color: #e5e7eb;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 24rpx;
  line-height: 1.7;
  white-space: pre-wrap;
}

.api-table {
  overflow: hidden;
  border: 1rpx solid #e1e7f1;
  border-radius: 12rpx;
}

.api-row,
.event-row {
  display: grid;
  grid-template-columns: 1.1fr 1.8fr 1.3fr 0.8fr;
  gap: 16rpx;
  padding: 20rpx;
  border-bottom: 1rpx solid #edf1f6;
  color: #546377;
  font-size: 22rpx;
  line-height: 1.6;
}

.event-row {
  grid-template-columns: 1fr 1.8fr 1.2fr;
}

.api-row:last-child,
.event-row:last-child {
  border-bottom: none;
}

.api-head,
.event-head {
  background: #f7f9fc;
  color: #182235;
  font-weight: 700;
}

.api-name {
  color: #182235;
  font-weight: 700;
}

.event-table {
  overflow: hidden;
  border: 1rpx solid #e1e7f1;
  border-radius: 12rpx;
}

.slot-list {
  display: grid;
  gap: 16rpx;
}

.slot-item {
  border: 1rpx solid #e6ecf5;
  border-radius: 18rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%);
  padding: 20rpx;
}

.slot-item__name {
  color: #182235;
  font-size: 26rpx;
  font-weight: 800;
}

.slot-item__desc {
  margin-top: 8rpx;
  color: #6a7485;
  font-size: 23rpx;
  line-height: 1.7;
}
</style>
