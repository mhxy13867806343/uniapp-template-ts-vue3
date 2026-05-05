<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const active = ref(0)
const progress = ref(66)
const approvals = [
  { title: '合同审批', owner: '王经理', status: '待复核', type: 'warning' },
  { title: '费用报销', owner: '李会计', status: '处理中', type: 'primary' },
  { title: '上线申请', owner: '产品组', status: '已通过', type: 'success' }
] as const
</script>

<template>
  <PageShell title="中级示例" description="审批工作流，包含分组、进度和任务状态。">
    <view class="example-page">
      <view class="business-card">
        <wd-tabs v-model="active">
          <wd-tab title="待处理" />
          <wd-tab title="我发起" />
          <wd-tab title="已完成" />
        </wd-tabs>
      </view>

      <view class="business-card">
        <view class="section-title">本周审批进度</view>
        <wd-progress :percentage="progress" />
      </view>

      <view class="approval-list">
        <view
          v-for="item in approvals"
          :key="item.title"
          class="approval-card"
        >
          <view>
            <view class="approval-title">{{ item.title }}</view>
            <view class="approval-owner">负责人：{{ item.owner }}</view>
          </view>
          <wd-tag :type="item.type">{{ item.status }}</wd-tag>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.example-page,
.approval-list {
  display: grid;
  gap: 24rpx;
}

.business-card,
.approval-card {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  padding: 28rpx;
}

.section-title,
.approval-title {
  color: var(--app-ink);
  font-weight: 700;
}

.section-title {
  margin-bottom: 24rpx;
  font-size: 32rpx;
}

.approval-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.approval-owner {
  margin-top: 10rpx;
  color: var(--app-muted);
  font-size: 26rpx;
}
</style>
