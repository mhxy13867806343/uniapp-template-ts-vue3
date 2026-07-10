<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { TASK_CANCELLED_MESSAGE, executeTask } from '@/workers/labRuntime'

type WorkerExampleKey = 'prime' | 'fibonacci' | 'sort' | 'json' | 'chunk' | 'word'
type WorkerStatus = 'idle' | 'ready' | 'running' | 'done' | 'error' | 'cancelled'
type WorkerLogType = 'system' | 'send' | 'receive' | 'error'

interface WorkerExampleItem {
  key: WorkerExampleKey
  title: string
  subtitle: string
  description: string
  payload: string
  actionLabel: string
}

interface WorkerLogItem {
  id: number
  type: WorkerLogType
  title: string
  content: string
  time: string
}

interface WorkerResponse {
  id: number
  phase: 'progress' | 'complete' | 'error' | 'cancelled'
  ok?: boolean
  type?: WorkerExampleKey
  duration: number
  progress?: number
  message?: string
  result?: Record<string, unknown>
  error?: string
}

const toast = useToast('worker-lab-toast')

const examples: WorkerExampleItem[] = [
  {
    key: 'prime',
    title: '素数统计',
    subtitle: 'CPU 密集型计算',
    description: '把计算放到 Worker 线程里，避免主线程在较大数字范围下卡顿。',
    payload: '12000',
    actionLabel: '统计素数'
  },
  {
    key: 'fibonacci',
    title: '斐波那契',
    subtitle: '递推数列演示',
    description: '演示适合放进 Worker 的计算任务，避免页面交互阻塞。',
    payload: '42',
    actionLabel: '计算 Fibonacci'
  },
  {
    key: 'sort',
    title: '大数组排序',
    subtitle: '排序与数据清洗',
    description: '模拟把一段大数据字符串交给 Worker 去解析、清洗并排序。',
    payload: '12,45,3,908,77,16,4,88,29,300,6,17,90',
    actionLabel: '执行排序'
  },
  {
    key: 'json',
    title: 'JSON 格式化',
    subtitle: '结构化数据处理',
    description: '适合把大 JSON 的格式化和结构分析放到 Worker 中执行。',
    payload: JSON.stringify({ orderNo: 'DEMO-1001', amount: 299, items: [{ sku: 'SKU-1', qty: 2 }, { sku: 'SKU-8', qty: 1 }] }),
    actionLabel: '格式化 JSON'
  },
  {
    key: 'chunk',
    title: '分块求和',
    subtitle: '批处理演示',
    description: '模拟把一批数字按块聚合，用于报表统计或导入预处理。',
    payload: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15',
    actionLabel: '执行分块统计'
  },
  {
    key: 'word',
    title: '词频统计',
    subtitle: '文本分析演示',
    description: '把长文本的分词、词频统计放到 Worker 中做，适合搜索和内容分析场景。',
    payload: 'uni app worker demo worker demo tabs tabs websocket udp worker page demo content analysis',
    actionLabel: '统计词频'
  }
]

const activeTab = ref<WorkerExampleKey>('prime')
const payload = ref(examples[0].payload)
const status = ref<WorkerStatus>('idle')
const logs = ref<WorkerLogItem[]>([])
const resultText = ref('')
const taskCount = ref(0)
const lastDuration = ref(0)
const progress = ref(0)
const progressText = ref('等待执行')
const activeTaskId = ref<number | null>(null)
const workerMode = ref<'worker' | 'fallback'>('fallback')
const cancelledTaskIds = new Set<number>()

let worker: Worker | null = null
let logSeed = 1
let taskSeed = 1

const currentExample = computed(() => examples.find(item => item.key === activeTab.value) || examples[0])

const statusText = computed(() => {
  const map: Record<WorkerStatus, string> = {
    idle: '未初始化',
    ready: '可执行',
    running: '执行中',
    done: '已完成',
    error: '执行失败',
    cancelled: '已取消'
  }
  return map[status.value]
})

const statusTagType = computed(() => {
  const map: Record<WorkerStatus, 'primary' | 'success' | 'warning' | 'danger'> = {
    idle: 'primary',
    ready: 'success',
    running: 'warning',
    done: 'success',
    error: 'danger',
    cancelled: 'warning'
  }
  return map[status.value]
})

const statItems = computed(() => [
  { label: '执行状态', value: statusText.value },
  { label: '运行模式', value: workerMode.value === 'worker' ? '真实 Worker' : '主线程降级' },
  { label: '已执行任务', value: `${taskCount.value} 次` },
  { label: '最近耗时', value: lastDuration.value ? `${lastDuration.value} ms` : '-' }
])

function nowText() {
  const date = new Date()
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

function pushLog(type: WorkerLogType, title: string, content: string) {
  logs.value.unshift({
    id: logSeed++,
    type,
    title,
    content,
    time: nowText()
  })
  logs.value = logs.value.slice(0, 60)
}

function clearLogs() {
  logs.value = []
}

async function fallbackExecute(id: number, type: WorkerExampleKey, rawPayload: string) {
  const startedAt = Date.now()
  try {
    const result = await executeTask(type, rawPayload, {
      onProgress(nextProgress, message) {
        if (cancelledTaskIds.has(id)) return
        progress.value = nextProgress
        progressText.value = message || `已完成 ${nextProgress}%`
      },
      isCancelled() {
        return cancelledTaskIds.has(id)
      }
    })
    return {
      id,
      phase: 'complete' as const,
      ok: true,
      type,
      duration: Date.now() - startedAt,
      result
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '当前平台不支持真实 Worker，且降级执行失败'
    if (message === TASK_CANCELLED_MESSAGE || cancelledTaskIds.has(id)) {
      return {
        id,
        phase: 'cancelled' as const,
        type,
        duration: Date.now() - startedAt,
        message: '任务已取消'
      }
    }
    return {
      id,
      phase: 'error' as const,
      ok: false,
      type,
      duration: Date.now() - startedAt,
      error: message
    }
  }
}

function resetTaskView() {
  resultText.value = ''
  progress.value = 0
  progressText.value = '等待执行'
}

function applyTaskResponse(message: WorkerResponse, sourceTitle: string) {
  if (activeTaskId.value !== message.id) return

  lastDuration.value = message.duration

  if (message.phase === 'progress') {
    progress.value = message.progress || 0
    progressText.value = message.message || `已完成 ${message.progress || 0}%`
    pushLog('system', `${sourceTitle}进度`, `${progress.value}% ${progressText.value}`)
    return
  }

  activeTaskId.value = null
  taskCount.value += 1
  cancelledTaskIds.delete(message.id)

  if (message.phase === 'cancelled') {
    status.value = 'cancelled'
    progressText.value = message.message || '任务已取消'
    pushLog('system', `${sourceTitle}已取消`, progressText.value)
    toast.warning('任务已取消')
    return
  }

  if (message.phase === 'error') {
    status.value = 'error'
    resultText.value = JSON.stringify({ error: message.error }, null, 2)
    pushLog('error', `${sourceTitle}失败`, resultText.value)
    toast.error('任务执行失败')
    return
  }

  status.value = 'done'
  progress.value = 100
  progressText.value = '任务执行完成'
  resultText.value = JSON.stringify(message.result, null, 2)
  pushLog('receive', `${sourceTitle}完成`, resultText.value)
}

function initWorker() {
  if (typeof Worker === 'undefined') {
    workerMode.value = 'fallback'
    status.value = 'ready'
    pushLog('system', '初始化 Worker', '当前环境不支持真实 Worker，已切换为主线程降级模式')
    return
  }

  if (worker) return

  worker = new Worker(new URL('../../workers/lab.worker.ts', import.meta.url), { type: 'module' })
  workerMode.value = 'worker'
  status.value = 'ready'
  pushLog('system', '初始化 Worker', '真实 Worker 已就绪')

  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    applyTaskResponse(event.data, 'Worker')
  }

  worker.onerror = (error) => {
    status.value = 'error'
    pushLog('error', 'Worker 异常', error.message)
    toast.error('Worker 执行异常')
  }
}

async function runTask() {
  if (status.value === 'running' && activeTaskId.value !== null) {
    toast.warning('当前已有任务在执行，请先取消或等待完成')
    return
  }

  const currentPayload = payload.value.trim()
  if (!currentPayload) {
    toast.error('请输入任务数据')
    return
  }

  initWorker()
  status.value = 'running'
  resetTaskView()
  const id = taskSeed++
  activeTaskId.value = id
  progressText.value = '任务已投递，等待开始'
  cancelledTaskIds.delete(id)

  pushLog('send', `发送任务 - ${currentExample.value.title}`, currentPayload)

  if (workerMode.value === 'worker' && worker) {
    worker.postMessage({
      action: 'run',
      id,
      type: activeTab.value,
      payload: currentPayload
    })
    return
  }

  const response = await fallbackExecute(id, activeTab.value, currentPayload)
  applyTaskResponse(response, '降级执行')
}

function cancelCurrentTask() {
  if (activeTaskId.value === null || status.value !== 'running') {
    toast.warning('当前没有执行中的任务')
    return
  }

  const id = activeTaskId.value
  cancelledTaskIds.add(id)
  progressText.value = '正在取消任务'
  pushLog('system', '发送取消请求', `任务 #${id}`)

  if (workerMode.value === 'worker' && worker) {
    worker.postMessage({
      action: 'cancel',
      id
    })
    return
  }

  setTimeout(() => {
    if (activeTaskId.value === id) {
      applyTaskResponse({
        id,
        phase: 'cancelled',
        duration: lastDuration.value,
        message: '任务已取消'
      }, '降级执行')
    }
  }, 0)
}

function terminateWorker() {
  if (worker) {
    if (activeTaskId.value !== null) {
      cancelledTaskIds.add(activeTaskId.value)
    }
    worker.terminate()
    worker = null
    workerMode.value = 'fallback'
    status.value = 'idle'
    activeTaskId.value = null
    resetTaskView()
    pushLog('system', '终止 Worker', '真实 Worker 已终止')
    toast.success('Worker 已终止')
    return
  }

  status.value = 'idle'
  activeTaskId.value = null
  resetTaskView()
  pushLog('system', '重置状态', '当前没有运行中的真实 Worker，已重置示例状态')
}

watch(activeTab, () => {
  payload.value = currentExample.value.payload
  resetTaskView()
  pushLog('system', '切换示例', `当前示例：${currentExample.value.title}`)
})

onMounted(() => {
  initWorker()
})

onUnmounted(() => {
  worker?.terminate()
  worker = null
})
</script>

<template>
  <PageShell title="Worker 示例中心" description="演示把计算密集型任务交给 Worker 执行，避免主线程阻塞。页面内提供 6 种不同任务，并对不支持 Worker 的环境给出降级执行。">
    <view class="worker-page">
      <wd-toast selector="worker-lab-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">Worker 任务实验室</view>
          <view class="hero-desc">默认优先使用真实 Web Worker；如果当前端不支持，就切换为主线程降级执行，并补上进度回传和取消任务能力。</view>
        </view>
        <wd-tag :type="statusTagType" plain>{{ statusText }}</wd-tag>
      </view>

      <view class="metric-grid">
        <view v-for="item in statItems" :key="item.label" class="metric-card">
          <view class="metric-label">{{ item.label }}</view>
          <view class="metric-value">{{ item.value }}</view>
        </view>
      </view>

      <view class="panel-card tabs-card">
        <wd-tabs v-model="activeTab">
          <wd-tab v-for="item in examples" :key="item.key" :name="item.key" :title="item.title" />
        </wd-tabs>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>{{ currentExample.title }}</text>
          <wd-tag plain>{{ currentExample.subtitle }}</wd-tag>
        </view>
        <view class="desc-text">{{ currentExample.description }}</view>
        <view class="tips-card">
          <view class="tips-title">运行说明</view>
          <view class="tips-line">真实 Worker：适合 H5 调试和浏览器运行。</view>
          <view class="tips-line">降级执行：适合当前端环境不支持 Worker 时继续看输入输出、进度更新与取消逻辑。</view>
        </view>
        <view class="progress-wrap">
          <view class="progress-head">
            <text>任务进度</text>
            <text>{{ progress }}%</text>
          </view>
          <wd-progress :percentage="progress" />
          <view class="progress-text">{{ progressText }}</view>
        </view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="runTask">{{ currentExample.actionLabel }}</wd-button>
          <wd-button size="small" type="warning" plain @click="cancelCurrentTask">取消当前任务</wd-button>
          <wd-button size="small" plain @click="initWorker">初始化 Worker</wd-button>
          <wd-button size="small" plain @click="terminateWorker">终止 / 重置</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>任务数据</text>
          <wd-tag type="warning" plain>可编辑</wd-tag>
        </view>
        <textarea v-model="payload" class="native-textarea" maxlength="-1" />
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>执行结果</text>
          <wd-tag plain>{{ lastDuration ? `${lastDuration} ms` : '未执行' }}</wd-tag>
        </view>
        <view v-if="resultText" class="result-card">
          <text class="result-text">{{ resultText }}</text>
        </view>
        <view v-else class="empty-card">
          <view class="empty-title">还没有结果</view>
          <view class="empty-desc">先运行一个任务，看看 Worker 如何把结果返回给页面。</view>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>任务日志</text>
          <wd-tag plain>{{ logs.length }} 条</wd-tag>
        </view>
        <view class="action-row">
          <wd-button size="small" plain @click="clearLogs">清空日志</wd-button>
        </view>
        <view v-if="logs.length" class="log-list">
          <view v-for="item in logs" :key="item.id" :class="['log-card', `log-card--${item.type}`]">
            <view class="log-head">
              <text class="log-title">{{ item.title }}</text>
              <text class="log-time">{{ item.time }}</text>
            </view>
            <text class="log-content">{{ item.content }}</text>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.worker-page {
  display: grid;
  gap: 24rpx;
}

.hero-card,
.metric-card,
.panel-card,
.result-card,
.log-card,
.empty-card,
.tips-card {
  border: 1rpx solid var(--app-line);
  border-radius: 24rpx;
  background: #fff;
}

.hero-card,
.panel-card {
  padding: 28rpx;
}

.hero-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.hero-title {
  color: var(--app-ink);
  font-size: 38rpx;
  font-weight: 800;
}

.hero-desc,
.desc-text,
.empty-desc,
.tips-line,
.log-content,
.result-text {
  margin-top: 12rpx;
  color: var(--app-muted);
  font-size: 25rpx;
  line-height: 1.7;
  white-space: pre-wrap;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.metric-card {
  padding: 24rpx;
}

.metric-label {
  color: var(--app-muted);
  font-size: 24rpx;
}

.metric-value {
  margin-top: 10rpx;
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 800;
}

.tabs-card {
  padding-top: 12rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  color: var(--app-ink);
  font-size: 30rpx;
  font-weight: 700;
}

.tips-title,
.empty-title,
.log-title {
  color: var(--app-ink);
  font-size: 27rpx;
  font-weight: 700;
}

.native-textarea {
  width: 100%;
  min-height: 260rpx;
  box-sizing: border-box;
  margin-top: 18rpx;
  padding: 20rpx 22rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 18rpx;
  background: #f8fafc;
  color: var(--app-ink);
  font-size: 25rpx;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 20rpx;
}

.tips-card,
.result-card,
.empty-card,
.log-card {
  margin-top: 20rpx;
  padding: 22rpx;
}

.log-list {
  display: grid;
  gap: 16rpx;
  margin-top: 18rpx;
}

.log-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
}

.log-time {
  color: #94a3b8;
  font-size: 22rpx;
}

.log-card--send {
  background: #eff6ff;
}

.log-card--receive {
  background: #ecfdf5;
}

.log-card--error {
  background: #fff1f2;
}

.log-card--system {
  background: #f8fafc;
}
</style>
