<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const activeNames = ref<string[]>(['order'])
const orderSteps = [
  { label: '已下单', done: true },
  { label: '已支付', done: true },
  { label: '履约中', done: true },
  { label: '待验收', done: false }
]
</script>

<template>
  <PageShell title="复杂示例" description="订单工作台，组合客户信息、履约节点、费用和操作闭环。">
    <view class="example-page">
      <view class="order-hero">
        <view>
          <view class="order-no">ORD-20260506-001</view>
          <view class="order-desc">企业版多端应用交付订单</view>
        </view>
        <wd-tag type="warning">履约中</wd-tag>
      </view>

      <view class="step-card">
        <view
          v-for="step in orderSteps"
          :key="step.label"
          class="step-item"
        >
          <view :class="['step-dot', { done: step.done }]" />
          <text>{{ step.label }}</text>
        </view>
      </view>

      <wd-collapse v-model="activeNames">
        <wd-collapse-item name="order" title="订单信息">
          <wd-cell title="客户名称" value="星河科技有限公司" />
          <wd-cell title="交付范围" value="H5 / 小程序 / App" />
          <wd-cell title="合同金额" value="¥86,000" />
        </wd-collapse-item>
        <wd-collapse-item name="delivery" title="履约信息">
          <wd-cell title="产品负责人" value="陈产品" />
          <wd-cell title="当前节点" value="联调验收" />
          <wd-cell title="风险等级" value="中" />
        </wd-collapse-item>
      </wd-collapse>

      <view class="action-bar">
        <wd-button plain>联系客户</wd-button>
        <wd-button type="primary">推进验收</wd-button>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.example-page {
  display: grid;
  gap: 24rpx;
}

.order-hero,
.step-card,
.action-bar {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  padding: 28rpx;
}

.order-hero,
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.order-no {
  color: var(--app-ink);
  font-size: 34rpx;
  font-weight: 800;
}

.order-desc {
  margin-top: 10rpx;
  color: var(--app-muted);
  font-size: 26rpx;
}

.step-card {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14rpx;
}

.step-item {
  display: grid;
  justify-items: center;
  gap: 12rpx;
  color: var(--app-muted);
  font-size: 24rpx;
  text-align: center;
}

.step-dot {
  width: 22rpx;
  height: 22rpx;
  border-radius: 50%;
  background: #d0d5dd;
}

.step-dot.done {
  background: var(--app-brand);
}
</style>
