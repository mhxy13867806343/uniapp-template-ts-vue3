<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { exampleScenarios, navigateToExample } from '@/utils/exampleScenarios'
</script>

<template>
  <PageShell title="示例" description="按复杂度拆分的真实业务示例，覆盖常见跨端应用场景。">
    <view class="example-center">
      <view class="summary-card">
        <view>
          <view class="summary-title">业务示例中心</view>
          <view class="summary-desc">从基础表单到复杂订单工作台，逐级沉淀通用页面写法。</view>
        </view>
        <wd-tag type="primary">{{ exampleScenarios.length }} 个场景</wd-tag>
      </view>

      <view class="scenario-list">
        <view
          v-for="item in exampleScenarios"
          :key="item.path"
          class="scenario-card"
          @click="navigateToExample(item.path)"
        >
          <view class="scenario-main">
            <view class="scenario-level">{{ item.level }}</view>
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
