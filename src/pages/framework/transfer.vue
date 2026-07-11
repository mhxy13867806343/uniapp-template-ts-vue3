<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

interface TransferLogItem {
  id: number
  type: 'system' | 'send' | 'receive' | 'error'
  title: string
  content: string
  time: string
}

interface PreparedChunk {
  index: number
  data: string
  size: number
}

interface PreparedUploadResult {
  totalBytes: number
  totalChunks: number
  chunkSize: number
  checksum: number
  chunks: PreparedChunk[]
}

interface MergeDownloadResult {
  textLength: number
  checksum: number
  preview: string
  totalBytes: number
}

interface WorkerResponse {
  phase: 'progress' | 'complete' | 'error' | 'cancelled'
  taskId: number
  progress?: number
  message?: string
  result?: PreparedUploadResult | MergeDownloadResult
  error?: string
}

type WorkerPurpose = 'upload-prepare' | 'download-merge'

const toast = useToast('transfer-lab-toast')

const serverBase = ref('http://127.0.0.1:8001')
const demoFileSizeKb = ref(512)
const chunkSizeKb = ref(64)
const concurrency = ref(3)
const demoText = ref('')
const uploadProgress = ref(0)
const uploadStatusText = ref('等待上传')
const downloadProgress = ref(0)
const downloadStatusText = ref('等待下载')
const uploadSessionId = ref('')
const uploadChecksum = ref<number | null>(null)
const downloadChecksum = ref<number | null>(null)
const downloadPreview = ref('')
const logs = ref<TransferLogItem[]>([])
const workerMode = ref<'worker' | 'fallback'>('fallback')
const uploadRunning = ref(false)
const downloadRunning = ref(false)

let logSeed = 1
let workerTaskSeed = 1
let transferWorker: Worker | null = null
let activeWorkerTaskId: number | null = null
let activeWorkerPurpose: WorkerPurpose | null = null
let activeWorkerResolve: ((value: any) => void) | null = null
let activeWorkerReject: ((reason?: unknown) => void) | null = null
let uploadCancelRequested = false
let downloadCancelRequested = false

const normalizedServerBase = computed(() => serverBase.value.trim().replace(/\/$/, ''))
const transferStats = computed(() => [
  { label: '运行模式', value: workerMode.value === 'worker' ? '真实 Worker' : '主线程降级' },
  { label: '分片大小', value: `${chunkSizeKb.value} KB` },
  { label: '上传并发', value: `${concurrency.value} 路` },
  { label: '测试文件', value: demoText.value ? `${Math.ceil(demoText.value.length / 1024)} KB` : '未生成' }
])

function nowText() {
  const date = new Date()
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

function pushLog(type: TransferLogItem['type'], title: string, content: string) {
  logs.value.unshift({
    id: logSeed++,
    type,
    title,
    content,
    time: nowText()
  })
  logs.value = logs.value.slice(0, 80)
}

function clearLogs() {
  logs.value = []
}

function buildDemoContent() {
  const sizeKb = Math.max(128, demoFileSizeKb.value)
  const targetBytes = sizeKb * 1024
  const block = 'UniApp transfer worker demo | chunk upload | chunk download | concurrent requests | 这是用于测试分片上传下载的示例内容。\n'
  let result = ''
  while (result.length < targetBytes) {
    result += block
  }
  demoText.value = result.slice(0, targetBytes)
  pushLog('system', '生成测试文件', `已生成约 ${sizeKb} KB 的测试文本`)
  toast.success('测试文件已生成')
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ''
  const blockSize = 0x8000
  for (let index = 0; index < bytes.length; index += blockSize) {
    const block = bytes.subarray(index, index + blockSize)
    binary += String.fromCharCode(...block)
  }
  return btoa(binary)
}

function base64ToBytes(base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function checksum(bytes: Uint8Array) {
  let total = 0
  for (let index = 0; index < bytes.length; index += 1) {
    total = (total + bytes[index]) % 1000000007
  }
  return total
}

function initTransferWorker() {
  if (typeof Worker === 'undefined') {
    workerMode.value = 'fallback'
    return
  }

  if (transferWorker) return

  transferWorker = new Worker(new URL('../../workers/transfer.worker.ts', import.meta.url), { type: 'module' })
  workerMode.value = 'worker'

  transferWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const message = event.data
    if (message.taskId !== activeWorkerTaskId) return

    if (message.phase === 'progress') {
      if (activeWorkerPurpose === 'upload-prepare') {
        uploadProgress.value = Math.min(35, Math.round((message.progress || 0) * 0.35))
        uploadStatusText.value = message.message || '正在准备上传分片'
      } else if (activeWorkerPurpose === 'download-merge') {
        downloadProgress.value = 65 + Math.round((message.progress || 0) * 0.35)
        downloadStatusText.value = message.message || '正在合并下载分片'
      }
      return
    }

    activeWorkerTaskId = null
    activeWorkerPurpose = null

    if (message.phase === 'complete') {
      activeWorkerResolve?.(message.result)
      return
    }

    if (message.phase === 'cancelled') {
      activeWorkerReject?.(new Error(message.message || '任务已取消'))
      return
    }

    activeWorkerReject?.(new Error(message.error || 'Worker 执行失败'))
  }

  transferWorker.onerror = (error) => {
    activeWorkerReject?.(new Error(error.message || 'Transfer Worker 异常'))
    activeWorkerTaskId = null
    activeWorkerPurpose = null
  }
}

function cancelActiveWorkerTask() {
  if (!transferWorker || activeWorkerTaskId === null) return
  transferWorker.postMessage({
    action: 'cancel',
    taskId: activeWorkerTaskId
  })
}

function runWorkerTask<T>(purpose: WorkerPurpose, payload: Record<string, unknown>) {
  initTransferWorker()
  if (workerMode.value !== 'worker' || !transferWorker) {
    return Promise.reject(new Error('当前环境不支持真实 Worker'))
  }

  const taskId = workerTaskSeed++
  activeWorkerTaskId = taskId
  activeWorkerPurpose = purpose

  return new Promise<T>((resolve, reject) => {
    activeWorkerResolve = resolve
    activeWorkerReject = reject
    transferWorker!.postMessage({
      taskId,
      ...payload
    })
  })
}

async function prepareUploadChunksWithFallback(text: string, chunkSize: number) {
  const bytes = new TextEncoder().encode(text)
  const totalChunks = Math.max(1, Math.ceil(bytes.length / chunkSize))
  const chunks: PreparedChunk[] = []
  for (let index = 0; index < totalChunks; index += 1) {
    if (uploadCancelRequested) throw new Error('上传任务已取消')
    const start = index * chunkSize
    const end = Math.min(bytes.length, start + chunkSize)
    const chunk = bytes.subarray(start, end)
    chunks.push({
      index,
      data: bytesToBase64(chunk),
      size: chunk.length
    })
    uploadProgress.value = Math.min(35, Math.round(((index + 1) / totalChunks) * 35))
    uploadStatusText.value = `已切分 ${index + 1}/${totalChunks} 个上传分片`
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  return {
    totalBytes: bytes.length,
    totalChunks,
    chunkSize,
    checksum: checksum(bytes),
    chunks
  }
}

async function mergeDownloadChunksWithFallback(chunks: PreparedChunk[]) {
  const bytesList: number[] = []
  for (let index = 0; index < chunks.length; index += 1) {
    if (downloadCancelRequested) throw new Error('下载任务已取消')
    const bytes = base64ToBytes(chunks[index].data)
    bytesList.push(...bytes)
    downloadProgress.value = 65 + Math.round(((index + 1) / Math.max(1, chunks.length)) * 35)
    downloadStatusText.value = `已合并 ${index + 1}/${chunks.length} 个下载分片`
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  const merged = new Uint8Array(bytesList)
  const text = new TextDecoder().decode(merged)
  return {
    textLength: text.length,
    checksum: checksum(merged),
    preview: text.slice(0, 260),
    totalBytes: merged.length
  }
}

function requestJson<T = Record<string, any>>(options: UniApp.RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (res) => resolve(res.data as T),
      fail: reject
    })
  })
}

async function runConcurrent(total: number, runner: (index: number) => Promise<void>, shouldCancel: () => boolean) {
  let cursor = 0
  const maxConcurrency = Math.max(1, concurrency.value)

  const workers = Array.from({ length: Math.min(maxConcurrency, total) }, async () => {
    while (!shouldCancel()) {
      const current = cursor
      cursor += 1
      if (current >= total) return
      await runner(current)
    }
  })

  await Promise.all(workers)
}

async function startChunkUpload() {
  if (uploadRunning.value) {
    toast.warning('上传任务正在执行中')
    return
  }

  if (!demoText.value) buildDemoContent()

  uploadRunning.value = true
  uploadCancelRequested = false
  uploadProgress.value = 0
  uploadStatusText.value = '准备上传分片'
  uploadSessionId.value = ''
  uploadChecksum.value = null

  try {
    const chunkSize = Math.max(8 * 1024, chunkSizeKb.value * 1024)
    const prepared = workerMode.value === 'worker'
      ? await runWorkerTask<PreparedUploadResult>('upload-prepare', {
        action: 'prepare-upload',
        text: demoText.value,
        chunkSize
      })
      : await prepareUploadChunksWithFallback(demoText.value, chunkSize)

    uploadChecksum.value = prepared.checksum
    uploadStatusText.value = '已完成分片预处理，初始化上传会话'

    const initData = await requestJson<Record<string, any>>({
      url: `${normalizedServerBase.value}/transfer/upload/init`,
      method: 'POST',
      data: {
        filename: 'worker-chunk-demo.txt',
        size_bytes: prepared.totalBytes,
        chunk_size: prepared.chunkSize,
        total_chunks: prepared.totalChunks
      },
      header: {
        'Content-Type': 'application/json'
      }
    })

    uploadSessionId.value = initData.upload_id
    pushLog('system', '初始化上传会话', JSON.stringify(initData))

    let completed = 0
    await runConcurrent(prepared.totalChunks, async (index) => {
      if (uploadCancelRequested) return
      const chunk = prepared.chunks[index]
      const response = await requestJson<Record<string, any>>({
        url: `${normalizedServerBase.value}/transfer/upload/chunk`,
        method: 'POST',
        data: {
          upload_id: uploadSessionId.value,
          index: chunk.index,
          data: chunk.data
        },
        header: {
          'Content-Type': 'application/json'
        }
      })
      completed += 1
      uploadProgress.value = 35 + Math.round((completed / prepared.totalChunks) * 55)
      uploadStatusText.value = `上传中 ${completed}/${prepared.totalChunks}`
      if (completed <= 3 || completed === prepared.totalChunks) {
        pushLog('send', `上传分片 #${chunk.index}`, JSON.stringify(response))
      }
    }, () => uploadCancelRequested)

    if (uploadCancelRequested) {
      uploadStatusText.value = '上传已取消'
      toast.warning('上传任务已取消')
      return
    }

    const completeData = await requestJson<Record<string, any>>({
      url: `${normalizedServerBase.value}/transfer/upload/complete`,
      method: 'POST',
      data: {
        upload_id: uploadSessionId.value
      },
      header: {
        'Content-Type': 'application/json'
      }
    })

    uploadProgress.value = 100
    uploadStatusText.value = '分片上传完成'
    pushLog('receive', '完成上传合并', JSON.stringify(completeData))
    toast.success('分片上传完成')
  } catch (error) {
    uploadStatusText.value = error instanceof Error ? error.message : '上传失败'
    pushLog('error', '上传失败', JSON.stringify(error))
    toast.error('分片上传失败')
  } finally {
    uploadRunning.value = false
    uploadCancelRequested = false
  }
}

function cancelUploadTask() {
  if (!uploadRunning.value) {
    toast.warning('当前没有执行中的上传任务')
    return
  }
  uploadCancelRequested = true
  uploadStatusText.value = '正在取消上传任务'
  cancelActiveWorkerTask()
}

async function startChunkDownload() {
  if (downloadRunning.value) {
    toast.warning('下载任务正在执行中')
    return
  }

  downloadRunning.value = true
  downloadCancelRequested = false
  downloadProgress.value = 0
  downloadStatusText.value = '获取下载清单'
  downloadPreview.value = ''
  downloadChecksum.value = null

  try {
    const manifest = await requestJson<Record<string, any>>({
      url: `${normalizedServerBase.value}/transfer/manifest?chunk_size=${Math.max(8 * 1024, chunkSizeKb.value * 1024)}`,
      method: 'GET'
    })

    const totalChunks = Number(manifest.total_chunks || 1)
    const chunkSize = Number(manifest.chunk_size || chunkSizeKb.value * 1024)
    const chunks: PreparedChunk[] = new Array(totalChunks)
    let completed = 0

    await runConcurrent(totalChunks, async (index) => {
      if (downloadCancelRequested) return
      const response = await requestJson<Record<string, any>>({
        url: `${normalizedServerBase.value}/transfer/download-chunk?index=${index}&chunk_size=${chunkSize}`,
        method: 'GET'
      })
      if (!response.ok) {
        throw new Error(response.message || `下载分片 ${index} 失败`)
      }
      chunks[index] = {
        index: Number(response.index),
        data: String(response.data),
        size: Number(response.size)
      }
      completed += 1
      downloadProgress.value = Math.round((completed / totalChunks) * 65)
      downloadStatusText.value = `下载中 ${completed}/${totalChunks}`
      if (completed <= 3 || completed === totalChunks) {
        pushLog('receive', `下载分片 #${index}`, JSON.stringify({ size: response.size, totalChunks }))
      }
    }, () => downloadCancelRequested)

    if (downloadCancelRequested) {
      downloadStatusText.value = '下载已取消'
      toast.warning('下载任务已取消')
      return
    }

    downloadStatusText.value = '正在合并下载分片'
    const merged = workerMode.value === 'worker'
      ? await runWorkerTask<MergeDownloadResult>('download-merge', {
        action: 'merge-download',
        chunks
      })
      : await mergeDownloadChunksWithFallback(chunks)

    downloadProgress.value = 100
    downloadStatusText.value = '分片下载完成'
    downloadPreview.value = merged.preview
    downloadChecksum.value = merged.checksum
    pushLog('system', '下载合并完成', JSON.stringify(merged))
    toast.success('分片下载完成')
  } catch (error) {
    downloadStatusText.value = error instanceof Error ? error.message : '下载失败'
    pushLog('error', '下载失败', JSON.stringify(error))
    toast.error('分片下载失败')
  } finally {
    downloadRunning.value = false
    downloadCancelRequested = false
  }
}

function cancelDownloadTask() {
  if (!downloadRunning.value) {
    toast.warning('当前没有执行中的下载任务')
    return
  }
  downloadCancelRequested = true
  downloadStatusText.value = '正在取消下载任务'
  cancelActiveWorkerTask()
}

onMounted(() => {
  initTransferWorker()
  buildDemoContent()
})

onUnmounted(() => {
  transferWorker?.terminate()
  transferWorker = null
})
</script>

<template>
  <PageShell title="分片传输实验室" description="演示 Worker 预处理分片、并发上传、并发下载和下载合并。后端使用 FastAPI 提供真实分片接口，前端支持取消任务与进度回传。">
    <view class="transfer-page">
      <wd-toast selector="transfer-lab-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">Chunk Upload / Download Lab</view>
          <view class="hero-desc">把“分片上传、分片下载、Worker 预处理、多路并发”放在一个页面里联调。默认连本地 FastAPI 服务。</view>
        </view>
        <wd-tag type="primary" plain>{{ workerMode === 'worker' ? '真实 Worker' : '主线程降级' }}</wd-tag>
      </view>

      <view class="metric-grid">
        <view v-for="item in transferStats" :key="item.label" class="metric-card">
          <view class="metric-label">{{ item.label }}</view>
          <view class="metric-value">{{ item.value }}</view>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>基础设置</text>
          <wd-tag plain>本地联调</wd-tag>
        </view>
        <view class="input-label">后端地址</view>
        <input v-model="serverBase" class="native-input" placeholder="例如 http://127.0.0.1:8001" />
        <view class="form-grid">
          <view>
            <view class="input-label">测试文件大小 (KB)</view>
            <input v-model.number="demoFileSizeKb" class="native-input" type="number" />
          </view>
          <view>
            <view class="input-label">分片大小 (KB)</view>
            <input v-model.number="chunkSizeKb" class="native-input" type="number" />
          </view>
          <view>
            <view class="input-label">并发数</view>
            <input v-model.number="concurrency" class="native-input" type="number" />
          </view>
        </view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="buildDemoContent">重新生成测试文件</wd-button>
          <wd-button size="small" plain @click="clearLogs">清空日志</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>分片上传</text>
          <wd-tag type="warning" plain>{{ uploadSessionId || '未初始化会话' }}</wd-tag>
        </view>
        <view class="tips-line">流程：Worker 预处理分片 -> 初始化上传会话 -> 多路并发上传 -> 服务端合并校验。</view>
        <view class="progress-head">
          <text>上传进度</text>
          <text>{{ uploadProgress }}%</text>
        </view>
        <wd-progress :percentage="uploadProgress" />
        <view class="tips-line">{{ uploadStatusText }}</view>
        <view class="tips-line">上传校验码：{{ uploadChecksum ?? '-' }}</view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="startChunkUpload">开始分片上传</wd-button>
          <wd-button size="small" type="warning" plain @click="cancelUploadTask">取消上传</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>分片下载</text>
          <wd-tag type="success" plain>{{ downloadChecksum ?? '等待下载' }}</wd-tag>
        </view>
        <view class="tips-line">流程：获取下载清单 -> 多路并发下载分片 -> Worker 合并分片 -> 输出校验与预览。</view>
        <view class="progress-head">
          <text>下载进度</text>
          <text>{{ downloadProgress }}%</text>
        </view>
        <wd-progress :percentage="downloadProgress" />
        <view class="tips-line">{{ downloadStatusText }}</view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="startChunkDownload">开始分片下载</wd-button>
          <wd-button size="small" type="warning" plain @click="cancelDownloadTask">取消下载</wd-button>
        </view>
        <view v-if="downloadPreview" class="preview-card">
          <view class="preview-title">下载内容预览</view>
          <text class="preview-text">{{ downloadPreview }}</text>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>测试文件内容</text>
          <wd-tag plain>{{ Math.ceil(demoText.length / 1024) }} KB</wd-tag>
        </view>
        <textarea v-model="demoText" class="native-textarea" maxlength="-1" />
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>运行日志</text>
          <wd-tag plain>{{ logs.length }} 条</wd-tag>
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
        <view v-else class="empty-card">
          <view class="empty-title">还没有日志</view>
          <view class="empty-desc">你可以直接开始分片上传或下载，页面会记录 Worker 预处理、并发请求和完成结果。</view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.transfer-page {
  display: grid;
  gap: 24rpx;
}

.hero-card,
.metric-card,
.panel-card,
.preview-card,
.log-card,
.empty-card {
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
.tips-line,
.preview-text,
.log-content,
.empty-desc {
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

.section-head,
.progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  color: var(--app-ink);
  font-size: 30rpx;
  font-weight: 700;
}

.input-label,
.preview-title,
.log-title,
.empty-title {
  color: var(--app-ink);
  font-size: 27rpx;
  font-weight: 700;
}

.input-label {
  margin-top: 20rpx;
}

.native-input,
.native-textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1rpx solid var(--app-line);
  border-radius: 18rpx;
  background: #f8fafc;
  color: var(--app-ink);
  font-size: 25rpx;
}

.native-input {
  height: 88rpx;
  margin-top: 14rpx;
  padding: 0 22rpx;
}

.native-textarea {
  min-height: 260rpx;
  margin-top: 18rpx;
  padding: 20rpx 22rpx;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18rpx;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 20rpx;
}

.preview-card,
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
