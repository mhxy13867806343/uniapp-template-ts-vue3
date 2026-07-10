<script setup lang="ts">
import { ref, computed } from 'vue'
import PageShell from '@/components/PageShell.vue'
import { exampleScenarios, navigateToExample } from '@/utils/exampleScenarios'

const activeTab = ref('all')

const tabs = [
  { name: 'all', label: '全部' },
  { name: 'pages', label: '基础页面' },
  { name: 'forms', label: '基础表单' },
  { name: 'feedbacks', label: '反馈提示' },
  { name: 'layouts', label: '数据展示' },
  { name: 'animations', label: '交互动画' },
  { name: 'business', label: '中高级业务' }
]

const filteredScenarios = computed(() => {
  if (activeTab.value === 'all') {
    return exampleScenarios
  }
  if (activeTab.value === 'pages') {
    return exampleScenarios.filter(item => item.level === '页面')
  }
  if (activeTab.value === 'forms') {
    return exampleScenarios.filter(item => item.level === '表单')
  }
  if (activeTab.value === 'feedbacks') {
    return exampleScenarios.filter(item => item.level === '反馈')
  }
  if (activeTab.value === 'layouts') {
    return exampleScenarios.filter(item => item.level === '展示')
  }
  if (activeTab.value === 'animations') {
    return exampleScenarios.filter(item => item.level === '动效')
  }
  if (activeTab.value === 'business') {
    return exampleScenarios.filter(item => 
      ['初级', '中级', '高级', '复杂', '更新', '文件', '通讯', '消息'].includes(item.level)
    )
  }
  return exampleScenarios
})

function getLevelTagType(level: string) {
  if (level === '页面') return 'success'
  if (level === '表单') return 'primary'
  if (level === '反馈') return 'warning'
  if (level === '展示') return 'info'
  if (level === '动效') return 'danger'
  return 'neutral'
}
</script>

<template>
  <PageShell title="示例" description="按复杂度拆分的真实业务示例，覆盖常见跨端应用场景。">
    <view class="example-center">
      <view class="summary-card">
        <view>
          <view class="summary-title">业务示例中心</view>
          <view class="summary-desc">从基础表单到复杂订单工作台，逐级沉淀通用页面写法。</view>
        </view>
        <wd-tag type="primary">{{ filteredScenarios.length }} 个场景</wd-tag>
      </view>

      <!-- Filter Tabs -->
      <view class="tabs-container">
        <wd-tabs v-model="activeTab" custom-class="custom-tabs">
          <wd-tab v-for="tab in tabs" :key="tab.name" :name="tab.name" :title="tab.label" />
        </wd-tabs>
      </view>

      <view class="scenario-list">
        <view
          v-for="item in filteredScenarios"
          :key="item.path"
          class="scenario-card"
          @click="navigateToExample(item.path)"
        >
          <view class="scenario-main">
            <view class="scenario-level flex justify-between items-center">
              <wd-tag size="small" :type="getLevelTagType(item.level)" plain>{{ item.level }}</wd-tag>
            </view>
            <view class="scenario-title">{{ item.title }}</view>
            <view class="scenario-desc">{{ item.description }}</view>
            <view class="scenario-tags">
              <wd-tag
                v-for="tag in item.tags"
                :key="tag"
                plain
              >
                {{ tag }}
              </wd-tag>
            </view>
          </view>
          <wd-icon name="arrow-right" size="20px" custom-class="scenario-arrow" />
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.example-center {
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
.scenario-card {
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

.summary-desc,
.scenario-desc {
  margin-top: 12rpx;
  color: var(--app-muted);
  font-size: 26rpx;
  line-height: 1.6;
}

.scenario-list {
  display: grid;
  gap: 20rpx;
}

.scenario-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 30rpx 28rpx;
}

.scenario-main {
  min-width: 0;
  flex: 1;
}

.scenario-level {
  color: var(--app-brand);
  font-size: 24rpx;
  font-weight: 700;
}

.scenario-title {
  margin-top: 8rpx;
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 700;
}

.scenario-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 18rpx;
}

:deep(.scenario-arrow) {
  color: var(--app-muted);
}
</style>
