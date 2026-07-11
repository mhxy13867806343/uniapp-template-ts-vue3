<script setup lang="ts">
import { getUniErrorMessage, scanBarCode, scanCode, scanQrCode } from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('scan-toast')

const scanResult = ref('')
const logs = ref<string[]>([])

function log(message: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  logs.value = logs.value.slice(0, 30)
}

async function handleScan(mode: 'all' | 'qr' | 'bar') {
  try {
    const result = mode === 'qr'
      ? await scanQrCode()
      : mode === 'bar'
        ? await scanBarCode()
        : await scanCode()
    scanResult.value = JSON.stringify(result, null, 2)
    log(`扫码成功: ${mode}`)
    toast.success('扫码成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`扫码失败: ${message}`)
  }
}
</script>

<template>
  <PageShell title="扫码 APIs" description="统一测试 scanCode，并拆出二维码与条形码两种快捷入口。适合支付码、物流码、设备配网码等场景。">
    <view class="api-page">
      <wd-toast selector="scan-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">扫码实验室</view>
          <view class="hero-desc">这里把 `scanCode` 做成三种入口：通用扫码、只扫二维码、只扫条形码。移动端和小程序环境更适合直接测试。</view>
        </view>
        <wd-tag type="primary" plain>摄像头能力</wd-tag>
      </view>

      <view class="panel-card">
        <view class="section-title">扫码动作</view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleScan('all')">通用扫码</wd-button>
          <wd-button size="small" plain @click="handleScan('qr')">只扫二维码</wd-button>
          <wd-button size="small" plain @click="handleScan('bar')">只扫条形码</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">扫码结果</view>
        <view class="result-box">{{ scanResult || '执行扫码后，结果会显示在这里。' }}</view>
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
.result-box { min-height:180rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; }
.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.empty-card { padding:22rpx; }
</style>
