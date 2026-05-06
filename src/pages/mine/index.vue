<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { useUserStore } from '@/store'
import { navigateTo } from '@/utils/router'

const userStore = useUserStore()

function goLogin() {
  navigateTo('/pages/auth/login')
}

function goRegister() {
  navigateTo('/pages/auth/register')
}

function logout() {
  userStore.logout()
  uni.showToast({
    title: '已退出登录',
    icon: 'none'
  })
}
</script>

<template>
  <PageShell title="我的" description="用户资料、登录状态和个人中心入口。">
    <view class="grid gap-3">
      <view class="panel flex items-center gap-3">
        <view class="h-14 w-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-6 font-700">
          {{ userStore.profile?.nickname?.slice(0, 1) || 'U' }}
        </view>
        <view class="min-w-0 flex-1">
          <view class="font-700">{{ userStore.profile?.nickname || '未登录用户' }}</view>
          <view class="muted-text mt-1">{{ userStore.profile?.role || '登录后体验账户中心、权限和业务入口' }}</view>
        </view>
        <wd-button v-if="!userStore.isLogin" size="small" type="primary" @click="goLogin">登录</wd-button>
        <wd-button v-else size="small" type="primary" plain @click="logout">退出</wd-button>
      </view>

      <wd-cell-group border>
        <wd-cell title="账号登录" :value="userStore.isLogin ? '已登录' : '未登录'" is-link clickable @click="goLogin" />
        <wd-cell title="注册账号" value="新用户入口" is-link clickable @click="goRegister" />
        <wd-cell title="个人资料" :value="userStore.profile?.phone || '完善'" is-link />
        <wd-cell title="消息通知" value="0" is-link />
        <wd-cell title="应用设置" is-link />
      </wd-cell-group>
    </view>
  </PageShell>
</template>
