<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
</script>

<template>
  <PageShell title="其他" description="放帮助、关于、协议和更多扩展页面入口。">
    <view class="grid gap-3">
      <wd-cell-group border>
        <wd-cell title="关于应用" value="0.1.0" is-link />
        <wd-cell title="帮助中心" is-link />
        <wd-cell title="隐私协议" is-link />
      </wd-cell-group>

      <view class="panel">
        <view class="font-700">后续扩展</view>
        <view class="muted-text mt-2 leading-6">
          可以继续添加请求模块、权限模块、主题模块、多端条件编译和业务组件库。
        </view>
      </view>
    </view>
  </PageShell>
</template>
