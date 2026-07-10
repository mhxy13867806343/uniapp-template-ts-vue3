<script setup lang="ts">
import { ref, computed } from 'vue'
import PageShell from '@/components/PageShell.vue'
import { exampleScenarios, navigateToExample } from '@/utils/exampleScenarios'

const activeTab = ref('all')

const tabs = [
  { name: 'all', label: '全部' },
  { name: 'junior', label: '基础/初级' },
  { name: 'intermediate', label: '中级业务' },
  { name: 'advanced', label: '高级/复杂' }
]

const filteredScenarios = computed(() => {
  if (activeTab.value === 'all') {
    return exampleScenarios
  }
  if (activeTab.value === 'junior') {
    return exampleScenarios.filter(item => 
      item.level === '初级' || item.level === '页面'
    )
  }
  if (activeTab.value === 'intermediate') {
    return exampleScenarios.filter(item => 
      item.level === '中级' || item.level === '表单' || item.level === '反馈' || item.level === '文件' || item.level === '通讯' || item.level === '消息'
    )
  }
  if (activeTab.value === 'advanced') {
    return exampleScenarios.filter(item => 
      item.level === '高级' || item.level === '复杂' || item.level === '动效' || item.level === '展示' || item.level === '更新'
    )
  }
  return exampleScenarios
})

function getLevelTagType(level: string) {
  if (level === '初级' || level === '页面') return 'success'
  if (level === '中级' || level === '表单' || level === '反馈' || level === '文件' || level === '通讯' || level === '消息') return 'primary'
  if (level === '高级' || level === '复杂' || level === '动效' || level === '展示' || level === '更新') return 'danger'
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
  background: #fff;
  border-radius: 12rpx;
  border: 1rpx solid var(--app-line);
  overflow: hidden;
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
