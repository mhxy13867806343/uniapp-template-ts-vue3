<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const colors = [
  { name: 'brand', value: '#1e88e5' },
  { name: 'ink', value: '#182230' },
  { name: 'muted', value: '#667085' },
  { name: 'line', value: '#e4e7ec' },
  { name: 'canvas', value: '#f6f8fb' }
]

const shortcuts = [
  'page-root',
  'page-section',
  'panel',
  'muted-text'
]
</script>

<template>
  <PageShell title="样式规范" description="统一 CSS 变量、UnoCSS theme 和快捷类，业务页保持轻量一致。">
    <view class="grid gap-3">
      <view class="panel">
        <view class="font-700 mb-3">主题色</view>
        <view class="color-grid">
          <view
            v-for="item in colors"
            :key="item.name"
            class="color-item"
          >
            <view class="color-swatch" :style="{ backgroundColor: item.value }" />
            <view>
              <view class="font-700">{{ item.name }}</view>
              <view class="muted-text">{{ item.value }}</view>
            </view>
          </view>
        </view>
      </view>

      <view class="panel">
        <view class="font-700 mb-3">UnoCSS 快捷类</view>
        <view class="tag-list">
          <wd-tag
            v-for="item in shortcuts"
            :key="item"
            plain
            type="primary"
          >
            {{ item }}
          </wd-tag>
        </view>
      </view>

      <view class="panel">
        <view class="font-700">页面结构建议</view>
        <view class="muted-text mt-2 leading-6">
          通用页面使用 PageShell 承载标题、内容区和自定义 Tabbar；业务卡片用 panel 或局部 scoped style 扩展，避免每页重复写基础布局。
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.color-grid,
.tag-list {
  display: grid;
  gap: 18rpx;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.color-swatch {
  width: 56rpx;
  height: 56rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
