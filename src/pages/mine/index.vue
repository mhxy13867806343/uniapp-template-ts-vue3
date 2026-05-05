<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
</script>

<template>
  <PageShell title="我的" description="用户资料、登录状态和个人中心入口。">
    <view class="grid gap-3">
      <view class="panel flex items-center gap-3">
        <view class="h-14 w-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-6 font-700">
          U
        </view>
        <view class="min-w-0 flex-1">
          <view class="font-700">模板用户</view>
          <view class="muted-text mt-1">跨端账户中心占位</view>
        </view>
        <wd-button size="small" type="primary" plain>编辑</wd-button>
      </view>

      <wd-cell-group border>
        <wd-cell title="个人资料" value="完善" is-link />
        <wd-cell title="消息通知" value="0" is-link />
        <wd-cell title="应用设置" is-link />
      </wd-cell-group>
    </view>
  </PageShell>
</template>
