<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const products = ref([
  { id: 1, name: '跨端会员套餐', price: 199, stock: 128, count: 1, tag: '热销' },
  { id: 2, name: '小程序装修服务', price: 699, stock: 32, count: 0, tag: '推荐' },
  { id: 3, name: 'App 发布加速包', price: 399, stock: 56, count: 0, tag: '新品' }
])

const selectedCount = computed(() => products.value.reduce((sum, item) => sum + item.count, 0))
const totalAmount = computed(() => products.value.reduce((sum, item) => sum + item.count * item.price, 0))
</script>

<template>
  <PageShell title="初级示例" description="商品列表、数量选择、价格汇总和提交动作。">
    <view class="example-page">
      <view
        v-for="item in products"
        :key="item.id"
        class="product-card"
      >
        <view class="product-cover">{{ item.name.slice(0, 2) }}</view>
        <view class="product-body">
          <view class="product-head">
            <view class="product-name">{{ item.name }}</view>
            <wd-tag type="primary" plain>{{ item.tag }}</wd-tag>
          </view>
          <view class="product-meta">库存 {{ item.stock }} 件</view>
          <view class="product-bottom">
            <view class="product-price">¥{{ item.price }}</view>
            <wd-input-number v-model="item.count" />
          </view>
        </view>
      </view>

      <view class="checkout-card">
        <view>
          <view class="checkout-title">已选 {{ selectedCount }} 项</view>
          <view class="checkout-amount">合计 ¥{{ totalAmount }}</view>
        </view>
        <wd-button type="primary">提交订单</wd-button>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.example-page {
  display: grid;
  gap: 24rpx;
}

.product-card,
.checkout-card {
  display: flex;
  gap: 24rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  padding: 28rpx;
}

.product-cover {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  background: #e8f2ff;
  color: var(--app-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.product-body {
  min-width: 0;
  flex: 1;
}

.product-head,
.product-bottom,
.checkout-card {
  align-items: center;
  justify-content: space-between;
}

.product-head,
.product-bottom {
  display: flex;
  gap: 16rpx;
}

.product-name,
.checkout-title {
  color: var(--app-ink);
  font-weight: 700;
}

.product-meta {
  margin: 14rpx 0;
  color: var(--app-muted);
  font-size: 26rpx;
}

.product-price,
.checkout-amount {
  color: #f04438;
  font-size: 34rpx;
  font-weight: 700;
}
</style>
