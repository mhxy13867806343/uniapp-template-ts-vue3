<script setup lang="ts">
import { createUniWorker, getUniErrorMessage, hasUniWorkerSupport } from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('uni-worker-toast')

const support = computed(() => hasUniWorkerSupport())
const scriptPath = ref('/static/workers/uni-demo-worker.js')
const draft = ref(JSON.stringify({ text: 'uni worker demo', repeat: 3 }, null, 2))
const resultText = ref('')
const logs = ref<string[]>([])
const status = ref<'idle' | 'ready' | 'running' | 'closed' | 'error'>('idle')

let workerTask: any = null

function log(message: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  logs.value = logs.value.slice(0, 40)
}

function updateStatus(next: typeof status.value) {
  status.value = next
}

function createWorkerInstance() {
  if (workerTask) return workerTask
  const instance = createUniWorker(scriptPath.value.trim())
  workerTask = instance
  updateStatus('ready')

  if (typeof instance.onMessage === 'function') {
    instance.onMessage((message: any) => {
      resultText.value = JSON.stringify(message, null, 2)
      if (message?.phase === 'complete') {
        updateStatus('ready')
      } else if (message?.phase === 'progress') {
        updateStatus('running')
      }
      log(`收到 Worker 消息: ${JSON.stringify(message)}`)
    })
  }

  if (typeof instance.onError === 'function') {
    instance.onError((error: any) => {
      updateStatus('error')
      log(`Worker 错误: ${JSON.stringify(error)}`)
    })
  }

  return instance
}

function handleCreateWorker() {
  try {
    createWorkerInstance()
    toast.success('Worker 已创建')
    log(`createWorker 成功: ${scriptPath.value}`)
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    updateStatus('error')
    log(`创建 Worker 失败: ${message}`)
  }
}

function handleSendMessage() {
  try {
    const instance = createWorkerInstance()
    const payload = JSON.parse(draft.value)
    updateStatus('running')
    instance.postMessage(payload)
    log(`发送消息: ${draft.value}`)
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    updateStatus('error')
    log(`发送消息失败: ${message}`)
  }
}

function handleTerminateWorker() {
  try {
    if (workerTask && typeof workerTask.terminate === 'function') {
      workerTask.terminate()
      log('Worker 已终止')
    }
    workerTask = null
    updateStatus('closed')
    toast.success('Worker 已终止')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`终止 Worker 失败: ${message}`)
  }
}

function openFrameworkWorkerPage() {
  uni.navigateTo({
    url: '/pages/framework/worker'
  })
}

onUnmounted(() => {
  if (workerTask && typeof workerTask.terminate === 'function') {
    workerTask.terminate()
  }
})
</script>

<template>
  <PageShell title="Worker APIs" description="统一测试 uni.createWorker 的能力检测、创建、消息发送和线程终止。同时保留通往现有 Worker 实验室的入口。">
    <view class="api-page">
      <wd-toast selector="uni-worker-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">uni Worker 实验室</view>
          <view class="hero-desc">这个页面测试的是 `uni.createWorker` 封装；而更完整的 H5 Worker 任务实验室仍然保留在框架专区。这里默认使用 `/static/workers/uni-demo-worker.js` 做最小消息收发。</view>
        </view>
        <wd-tag :type="support ? 'success' : 'warning'" plain>{{ support ? '支持 uni.createWorker' : '当前端不支持' }}</wd-tag>
      </view>

      <view class="panel-card">
        <view class="section-title">Worker 配置</view>
        <input v-model="scriptPath" class="native-input" placeholder="Worker 脚本路径" />
        <textarea v-model="draft" class="native-textarea" maxlength="-1" />
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleCreateWorker">创建 Worker</wd-button>
          <wd-button size="small" plain @click="handleSendMessage">发送消息</wd-button>
          <wd-button size="small" type="warning" plain @click="handleTerminateWorker">终止 Worker</wd-button>
          <wd-button size="small" plain @click="openFrameworkWorkerPage">打开框架 Worker 实验室</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">当前状态</view>
        <view class="result-box">status: {{ status }}</view>
        <view class="result-box">{{ resultText || '收到 Worker 的消息后会显示在这里。' }}</view>
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
.native-input,.native-textarea { width:100%; box-sizing:border-box; border:1rpx solid var(--app-line); border-radius:18rpx; background:#f8fafc; color:var(--app-ink); font-size:25rpx; }
.native-input { height:88rpx; margin-top:18rpx; padding:0 22rpx; }
.native-textarea { min-height:220rpx; margin-top:18rpx; padding:20rpx 22rpx; }
.action-row { display:flex; flex-wrap:wrap; gap:14rpx; margin-top:20rpx; }
.result-box { min-height:100rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; }
.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.empty-card { padding:22rpx; }
</style>
