<script setup lang="ts">
import { canvasToTempFilePath, createCanvasContext, createOffscreenCanvas, getCanvasImageInfo, getUniErrorMessage } from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('canvas-toast')

const exportResult = ref('')
const offscreenState = ref('未检测')
const logs = ref<string[]>([])

function log(message: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  logs.value = logs.value.slice(0, 30)
}

function drawCanvas() {
  const ctx = createCanvasContext('demoApiCanvas') as any
  ctx.setFillStyle('#eff6ff')
  ctx.fillRect(0, 0, 320, 220)
  ctx.setFillStyle('#2563eb')
  ctx.fillRect(24, 24, 120, 64)
  ctx.setFillStyle('#0f172a')
  ctx.setFontSize?.(18)
  ctx.fillText('Uni Canvas Demo', 24, 118)
  ctx.setStrokeStyle?.('#22c55e')
  ctx.setLineWidth?.(4)
  ctx.beginPath?.()
  ctx.arc?.(240, 78, 34, 0, Math.PI * 2)
  ctx.stroke?.()
  ctx.setFillStyle('#16a34a')
  ctx.fillText('Export Ready', 178, 176)
  ctx.draw?.()
  log('已重新绘制示例画布')
}

async function handleExportCanvas() {
  try {
    const result = await canvasToTempFilePath({
      canvasId: 'demoApiCanvas',
      fileType: 'png',
      quality: 1
    })
    exportResult.value = JSON.stringify(result, null, 2)
    log('canvasToTempFilePath 成功')
    toast.success('导出成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`导出失败: ${message}`)
  }
}

async function handleGetImageInfo() {
  try {
    const parsed = exportResult.value ? JSON.parse(exportResult.value) : null
    const tempFilePath = parsed?.tempFilePath
    if (!tempFilePath) {
      toast.warning('请先导出 canvas 图片')
      return
    }
    const result = await getCanvasImageInfo(tempFilePath)
    exportResult.value = JSON.stringify(result, null, 2)
    log('getCanvasImageInfo 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`读取图片信息失败: ${message}`)
  }
}

function handleCheckOffscreen() {
  try {
    const canvas = createOffscreenCanvas({
      type: '2d',
      width: 300,
      height: 150
    })
    offscreenState.value = `支持: ${Object.keys(canvas || {}).slice(0, 6).join(', ')}`
    log('createOffscreenCanvas 可用')
  } catch (error) {
    offscreenState.value = getUniErrorMessage(error)
    log(`OffscreenCanvas 不可用: ${offscreenState.value}`)
  }
}

onMounted(() => {
  nextTick(() => {
    drawCanvas()
  })
})
</script>

<template>
  <PageShell title="画布 APIs" description="统一测试 createCanvasContext、canvasToTempFilePath、createOffscreenCanvas 和图片信息读取，适合签名、海报、图表快照场景。">
    <view class="api-page">
      <wd-toast selector="canvas-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">Canvas 实验室</view>
          <view class="hero-desc">页面加载后会直接绘制一块示例画布。你可以重新绘制、导出图片，再读取导出的图片信息，同时检测 OffscreenCanvas 是否可用。</view>
        </view>
        <wd-tag type="primary" plain>图形渲染</wd-tag>
      </view>

      <view class="panel-card">
        <canvas canvas-id="demoApiCanvas" id="demoApiCanvas" class="demo-canvas" />
        <view class="action-row">
          <wd-button size="small" type="primary" @click="drawCanvas">重新绘制</wd-button>
          <wd-button size="small" plain @click="handleExportCanvas">导出图片</wd-button>
          <wd-button size="small" plain @click="handleGetImageInfo">读取图片信息</wd-button>
          <wd-button size="small" plain @click="handleCheckOffscreen">检测 OffscreenCanvas</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">导出 / 检测结果</view>
        <view class="tip-text">OffscreenCanvas: {{ offscreenState }}</view>
        <view class="result-box">{{ exportResult || '点击操作按钮后，结果会显示在这里。' }}</view>
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
.hero-desc,.tip-text,.log-item,.result-box,.empty-card { margin-top:12rpx; color:var(--app-muted); font-size:25rpx; line-height:1.7; white-space:pre-wrap; word-break:break-all; }
.demo-canvas { width:640rpx; height:440rpx; background:#f8fafc; border-radius:18rpx; }
.action-row { display:flex; flex-wrap:wrap; gap:14rpx; margin-top:20rpx; }
.result-box { min-height:180rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; }
.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.empty-card { padding:22rpx; }
</style>
