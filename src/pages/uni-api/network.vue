<script setup lang="ts">
import { closeSocket, connectSocket, getUniErrorMessage, request as uniRequest, sendSocketMessage } from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('network-toast')

const httpBase = ref('http://127.0.0.1:8001')
const wsBase = ref('ws://127.0.0.1:8001')
const httpResult = ref('')
const socketLogs = ref<string[]>([])
const socketStatus = ref('未连接')
const socketDraft = ref(JSON.stringify({ type: 'hello', scene: 'uni-api-network', time: Date.now() }, null, 2))

let socketTask: UniApp.SocketTask | null = null

function logSocket(message: string) {
  socketLogs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  socketLogs.value = socketLogs.value.slice(0, 40)
}

async function handleHttpHealth() {
  try {
    const result = await uniRequest<Record<string, unknown>>({
      url: `${httpBase.value.replace(/\/$/, '')}/health`,
      method: 'GET'
    })
    httpResult.value = JSON.stringify(result, null, 2)
    toast.success('HTTP 请求成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    httpResult.value = message
  }
}

function handleConnectSocket() {
  try {
    if (socketTask) {
      handleCloseSocket()
    }

    socketStatus.value = '连接中'
    const task = connectSocket({
      url: `${wsBase.value.replace(/\/$/, '')}/ws/echo`
    })
    socketTask = task

    task.onOpen(() => {
      socketStatus.value = '已连接'
      logSocket('Socket 已连接')
      toast.success('Socket 已连接')
    })

    task.onMessage((res) => {
      logSocket(`收到消息: ${typeof res.data === 'string' ? res.data : JSON.stringify(res.data)}`)
    })

    task.onError((error) => {
      socketStatus.value = '异常'
      logSocket(`连接异常: ${JSON.stringify(error)}`)
    })

    task.onClose((res) => {
      socketStatus.value = '已关闭'
      socketTask = null
      logSocket(`连接关闭: ${JSON.stringify(res)}`)
    })
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    logSocket(`连接失败: ${message}`)
  }
}

async function handleSendSocket() {
  if (!socketTask) {
    toast.warning('请先建立 Socket 连接')
    return
  }
  try {
    await sendSocketMessage(socketDraft.value)
    logSocket(`发送消息: ${socketDraft.value}`)
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    logSocket(`发送失败: ${message}`)
  }
}

async function handleCloseSocket() {
  try {
    await closeSocket()
    socketStatus.value = '已关闭'
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    logSocket(`关闭失败: ${message}`)
  }
}
</script>

<template>
  <PageShell title="网络 APIs" description="统一测试 request 和 WebSocket 封装。这里直接复用本地 FastAPI 服务，方便你马上联调 HTTP 与长连接。">
    <view class="api-page">
      <wd-toast selector="network-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">网络实验室</view>
          <view class="hero-desc">这里先演示 HTTP 请求和 WebSocket 长连接。上传下载类能力已经在分片传输实验室里做了完整联调，这里保留最常用的网络入口。</view>
        </view>
        <wd-tag type="primary" plain>{{ socketStatus }}</wd-tag>
      </view>

      <view class="panel-card">
        <view class="section-title">HTTP 请求</view>
        <input v-model="httpBase" class="native-input" placeholder="例如 http://127.0.0.1:8001" />
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleHttpHealth">请求 /health</wd-button>
        </view>
        <view class="result-box">{{ httpResult || 'HTTP 请求结果会显示在这里。' }}</view>
      </view>

      <view class="panel-card">
        <view class="section-title">WebSocket</view>
        <input v-model="wsBase" class="native-input" placeholder="例如 ws://127.0.0.1:8001" />
        <textarea v-model="socketDraft" class="native-textarea" maxlength="-1" />
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleConnectSocket">建立连接</wd-button>
          <wd-button size="small" plain @click="handleSendSocket">发送消息</wd-button>
          <wd-button size="small" type="warning" plain @click="handleCloseSocket">关闭连接</wd-button>
        </view>
        <view v-if="socketLogs.length" class="log-list">
          <view v-for="item in socketLogs" :key="item" class="log-item">{{ item }}</view>
        </view>
        <view v-else class="empty-card">还没有 Socket 日志。</view>
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
.native-input,.native-textarea { width:100%; box-sizing:border-box; border:1rpx solid var(--app-line); border-radius:18rpx; background:#f8fafc; color:var(--app-ink); font-size:25rpx; }
.native-input { height:88rpx; margin-top:18rpx; padding:0 22rpx; }
.native-textarea { min-height:220rpx; margin-top:18rpx; padding:20rpx 22rpx; }
.action-row { display:flex; flex-wrap:wrap; gap:14rpx; margin-top:20rpx; }
.result-box { min-height:120rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; }
.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.empty-card { padding:22rpx; }
</style>
