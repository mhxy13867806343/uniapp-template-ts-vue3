<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { componentList, findComponent, getComponentApi, getComponentCode } from '@/utils/wotComponents'

const currentPath = ref('button')
const inputValue = ref('Wot UI')
const searchValue = ref('')
const numberValue = ref(1)
const switchValue = ref(true)
const rateValue = ref(3)
const sliderValue = ref(40)
const activeTab = ref(0)
const checkedNames = ref<string[]>(['a'])
const radioValue = ref('a')

const detail = computed(() => findComponent(currentPath.value) || componentList[0])
const apiRows = computed(() => getComponentApi(detail.value))
const sampleCode = computed(() => getComponentCode(detail.value))

onLoad((query) => {
  if (typeof query?.path === 'string') {
    currentPath.value = decodeURIComponent(query.path)
  }
})

function handleApiDemo() {
  uni.showToast({
    icon: 'none',
    title: `${detail.value.name} API`
  })
}
</script>

<template>
  <PageShell
    :title="`${detail.name} ${detail.title}`"
    :description="`${detail.group} / ${detail.title} 的基础示例与 API 方法。`"
  >
    <view class="detail-page">
      <view class="detail-card">
        <view class="section-title">基础示例</view>

        <view v-if="detail.path === 'button'" class="demo-row">
          <wd-button type="primary">主要按钮</wd-button>
          <wd-button type="success">成功按钮</wd-button>
          <wd-button type="warning">警告按钮</wd-button>
          <wd-button disabled>禁用按钮</wd-button>
        </view>

        <view v-else-if="detail.path === 'icon'" class="demo-row">
          <wd-icon name="home" size="28px" />
          <wd-icon name="user" size="28px" />
          <wd-icon name="setting" size="28px" />
        </view>

        <view v-else-if="detail.path === 'cell'" class="demo-block">
          <wd-cell-group border>
            <wd-cell title="单元格" value="内容" is-link />
            <wd-cell title="描述信息" label="辅助说明" value="详情" />
          </wd-cell-group>
        </view>

        <view v-else-if="detail.path === 'tabbar'" class="demo-block">
          <wd-tabbar v-model="activeTab">
            <wd-tabbar-item :name="0" title="首页" icon="home" />
            <wd-tabbar-item :name="1" title="组件" icon="app" />
            <wd-tabbar-item :name="2" title="我的" icon="user" />
          </wd-tabbar>
        </view>

        <view v-else-if="detail.path === 'tabs'" class="demo-block">
          <wd-tabs v-model="activeTab">
            <wd-tab title="标签一">内容一</wd-tab>
            <wd-tab title="标签二">内容二</wd-tab>
          </wd-tabs>
        </view>

        <view v-else-if="detail.path === 'input'" class="demo-block">
          <wd-input v-model="inputValue" label="名称" placeholder="请输入" clearable />
        </view>

        <view v-else-if="detail.path === 'search'" class="demo-block">
          <wd-search v-model="searchValue" placeholder="搜索组件" />
        </view>

        <view v-else-if="detail.path === 'input-number'" class="demo-row">
          <wd-input-number v-model="numberValue" />
        </view>

        <view v-else-if="detail.path === 'switch'" class="demo-row">
          <wd-switch v-model="switchValue" />
        </view>

        <view v-else-if="detail.path === 'checkbox'" class="demo-block">
          <wd-checkbox-group v-model="checkedNames">
            <wd-checkbox model-value="a">选项一</wd-checkbox>
            <wd-checkbox model-value="b">选项二</wd-checkbox>
          </wd-checkbox-group>
        </view>

        <view v-else-if="detail.path === 'radio'" class="demo-block">
          <wd-radio-group v-model="radioValue">
            <wd-radio value="a">选项一</wd-radio>
            <wd-radio value="b">选项二</wd-radio>
          </wd-radio-group>
        </view>

        <view v-else-if="detail.path === 'rate'" class="demo-row">
          <wd-rate v-model="rateValue" />
        </view>

        <view v-else-if="detail.path === 'slider'" class="demo-block">
          <wd-slider v-model="sliderValue" />
        </view>

        <view v-else-if="detail.path === 'tag'" class="demo-row">
          <wd-tag type="primary">标签</wd-tag>
          <wd-tag type="success">成功</wd-tag>
          <wd-tag type="warning">警告</wd-tag>
        </view>

        <view v-else-if="detail.path === 'badge'" class="demo-row">
          <wd-badge :model-value="8">
            <wd-button size="small">消息</wd-button>
          </wd-badge>
          <wd-badge is-dot>
            <wd-button size="small">提醒</wd-button>
          </wd-badge>
        </view>

        <view v-else-if="detail.path === 'avatar'" class="demo-row">
          <wd-avatar>W</wd-avatar>
          <wd-avatar shape="square">UI</wd-avatar>
        </view>

        <view v-else-if="detail.path === 'card'" class="demo-block">
          <wd-card title="卡片标题">
            <view class="muted-text">这里是卡片内容。</view>
          </wd-card>
        </view>

        <view v-else-if="detail.path === 'loading'" class="demo-row">
          <wd-loading />
          <wd-loading type="ring" />
        </view>

        <view v-else-if="detail.path === 'progress'" class="demo-block">
          <wd-progress :percentage="60" />
        </view>

        <view v-else-if="detail.path === 'notice-bar'" class="demo-block">
          <wd-notice-bar text="这是一条通知栏内容" />
        </view>

        <view v-else-if="detail.path.startsWith('use-') || ['toast', 'notify', 'dialog'].includes(detail.path)" class="demo-row">
          <wd-button type="primary" @click="handleApiDemo">调用 API 方法</wd-button>
        </view>

        <view v-else class="demo-empty">
          <wd-icon name="app" size="32px" />
          <text>{{ detail.name }} 示例页已接入，后续可以在这里补充更完整的业务 demo。</text>
        </view>
      </view>

      <view class="detail-card">
        <view class="section-title">示例代码</view>
        <view class="code-box">
          <text>{{ sampleCode }}</text>
        </view>
      </view>

      <view class="detail-card">
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
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.detail-page {
  display: grid;
  gap: 28rpx;
}

.detail-card {
  overflow: hidden;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  padding: 28rpx;
}

.section-title {
  margin-bottom: 24rpx;
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 700;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20rpx;
}

.demo-block {
  width: 100%;
}

.demo-empty {
  display: grid;
  justify-items: center;
  gap: 16rpx;
  padding: 32rpx;
  color: var(--app-muted);
  text-align: center;
  font-size: 26rpx;
  line-height: 1.6;
}

.code-box {
  border-radius: 8rpx;
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
  border: 1rpx solid var(--app-line);
  border-radius: 8rpx;
}

.api-row {
  display: grid;
  grid-template-columns: 1.1fr 1.8fr 1.3fr 0.8fr;
  gap: 16rpx;
  padding: 20rpx;
  border-top: 1rpx solid var(--app-line);
  color: var(--app-muted);
  font-size: 24rpx;
  line-height: 1.45;
}

.api-row:first-child {
  border-top: 0;
}

.api-head {
  background: #f8fafc;
  color: var(--app-ink);
  font-weight: 700;
}

.api-name {
  color: var(--app-ink);
  font-weight: 600;
}
</style>
