<script setup lang="ts">
import {
  authenticateByFacial,
  authenticateByFingerprint,
  checkIsSoterEnrolledInDevice,
  checkIsSupportSoterAuthentication,
  getUniErrorMessage
} from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('biometrics-toast')

const supportModes = ref<string[]>([])
const enrolledState = ref('')
const authResult = ref('')
const logs = ref<string[]>([])

function log(message: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  logs.value = logs.value.slice(0, 30)
}

async function handleCheckSupport() {
  try {
    const result = await checkIsSupportSoterAuthentication()
    supportModes.value = result.supportMode || []
    authResult.value = JSON.stringify(result, null, 2)
    log(`支持模式: ${supportModes.value.join(', ') || '无'}`)
    toast.success('已检测生物认证支持情况')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`检测支持情况失败: ${message}`)
  }
}

async function handleCheckEnroll(mode: 'fingerPrint' | 'facial') {
  try {
    const result = await checkIsSoterEnrolledInDevice(mode)
    enrolledState.value = JSON.stringify(result, null, 2)
    log(`已检查 ${mode} 录入情况`)
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`检查录入情况失败: ${message}`)
  }
}

async function handleAuth(mode: 'fingerPrint' | 'facial') {
  try {
    const result = mode === 'fingerPrint'
      ? await authenticateByFingerprint()
      : await authenticateByFacial()
    authResult.value = JSON.stringify(result, null, 2)
    log(`${mode} 认证成功`)
    toast.success('认证通过')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`认证失败: ${message}`)
  }
}
</script>

<template>
  <PageShell title="生物认证 APIs" description="统一测试 Soter 生物认证支持检测、设备录入检查和指纹 / 人脸认证。适合支付、敏感设置、登录二次验证场景。">
    <view class="api-page">
      <wd-toast selector="biometrics-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">生物认证实验室</view>
          <view class="hero-desc">这里优先走 Soter 相关能力：检测支持模式、检查设备是否已录入、发起指纹和人脸认证。很多平台只在原生 App 或小程序环境可用。</view>
        </view>
        <wd-tag type="primary" plain>{{ supportModes.length ? supportModes.join(' / ') : '待检测' }}</wd-tag>
      </view>

      <view class="panel-card">
        <view class="section-title">支持与录入检查</view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleCheckSupport">检测支持模式</wd-button>
          <wd-button size="small" plain @click="handleCheckEnroll('fingerPrint')">检查指纹录入</wd-button>
          <wd-button size="small" plain @click="handleCheckEnroll('facial')">检查人脸录入</wd-button>
        </view>
        <view class="result-box">{{ enrolledState || '录入状态会显示在这里。' }}</view>
      </view>

      <view class="panel-card">
        <view class="section-title">发起认证</view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleAuth('fingerPrint')">指纹认证</wd-button>
          <wd-button size="small" type="success" plain @click="handleAuth('facial')">人脸认证</wd-button>
        </view>
        <view class="result-box">{{ authResult || '认证结果会显示在这里。' }}</view>
      </view>

      <view class="panel-card">
        <view class="section-title">调用日志</view>
        <view v-if="logs.length" class="log-list">
          <view v-for="item in logs" :key="item" class="log-item">{{ item }}</view>
        </view>
        <view v-else class="empty-card">还没有操作日志。</view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.api-page { display:grid; gap:24rpx; }
.hero-card,.panel-card,.empty-card { background:#fff; border:1rpx solid var(--app-line); border-radius:24rpx; }
.hero-card,.panel-card { padding:28rpx; }
.hero-card { display:flex; justify-content:space-between; gap:20rpx; }
.hero-title,.section-title { color:var(--app-ink); font-weight:800; }
.hero-title { font-size:38rpx; }
.section-title { font-size:30rpx; }
.hero-desc,.log-item,.result-box,.empty-card { margin-top:12rpx; color:var(--app-muted); font-size:25rpx; line-height:1.7; white-space:pre-wrap; word-break:break-all; }
.action-row { display:flex; flex-wrap:wrap; gap:14rpx; margin-top:18rpx; }
.result-box { min-height:160rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; }
.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.empty-card { padding:22rpx; }
</style>
