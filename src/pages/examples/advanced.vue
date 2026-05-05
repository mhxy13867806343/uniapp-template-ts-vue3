<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const metrics = [
  { label: '成交额', value: '¥128.6k', change: '+12.8%' },
  { label: '新增客户', value: '326', change: '+8.1%' },
  { label: '转化率', value: '24.6%', change: '+3.4%' },
  { label: '待办事项', value: '18', change: '-5.0%' }
]

const tasks = [
  { title: '复盘 H5 活动转化', value: '今天 15:00' },
  { title: '确认小程序审核材料', value: '明天 10:30' },
  { title: 'App 端崩溃日志归档', value: '进行中' }
]
</script>

<template>
  <PageShell title="高级示例" description="运营看板，适合首页、数据中心和管理后台移动端。">
    <view class="example-page">
      <view class="metric-grid">
        <view
          v-for="item in metrics"
          :key="item.label"
          class="metric-card"
        >
          <view class="metric-label">{{ item.label }}</view>
          <view class="metric-value">{{ item.value }}</view>
          <wd-tag :type="item.change.startsWith('+') ? 'success' : 'danger'" plain>{{ item.change }}</wd-tag>
        </view>
      </view>

      <view class="business-card">
        <view class="section-title">渠道健康度</view>
        <view class="health-row">
          <text>H5</text>
          <wd-progress :percentage="82" />
        </view>
        <view class="health-row">
          <text>微信小程序</text>
          <wd-progress :percentage="76" />
        </view>
        <view class="health-row">
          <text>App</text>
          <wd-progress :percentage="68" />
        </view>
      </view>

      <wd-cell-group border>
        <wd-cell
          v-for="task in tasks"
          :key="task.title"
          :title="task.title"
          :value="task.value"
          is-link
        />
      </wd-cell-group>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.example-page {
  display: grid;
  gap: 24rpx;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.metric-card,
.business-card {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  padding: 28rpx;
}

.metric-label,
.health-row {
  color: var(--app-muted);
  font-size: 26rpx;
}

.metric-value {
  margin: 12rpx 0;
  color: var(--app-ink);
  font-size: 40rpx;
  font-weight: 800;
}

.section-title {
  margin-bottom: 24rpx;
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 700;
}

.health-row {
  display: grid;
  gap: 12rpx;
  margin-top: 20rpx;
}
</style>
