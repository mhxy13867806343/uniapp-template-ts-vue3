<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type UdpExampleKey = 'echo' | 'device' | 'heartbeat' | 'telemetry' | 'log' | 'discover'
type StreamStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'
type UdpLogType = 'system' | 'send' | 'receive' | 'error'

interface UdpExampleItem {
  key: UdpExampleKey
  title: string
  subtitle: string
  description: string
  draft: string
}

interface UdpLogItem {
  id: number
  type: UdpLogType
  title: string
  content: string
  time: string
}

interface UdpStatusInfo {
  host: string
  port: number
  event_count: number
  events_path: string
  stream_path: string
  time: string
}

const toast = useToast('udp-lab-toast')

const examples: UdpExampleItem[] = [
  {
    key: 'echo',
    title: '基础回声',
    subtitle: '最小 UDP 收发闭环',
    description: '通过后端 HTTP 触发一次 UDP 发送，再由后端监听到数据后回包，适合先跑通链路。',
    draft: JSON.stringify({ type: 'echo', text: 'hello udp', scene: 'udp-basic' }, null, 2)
  },
  {
    key: 'device',
    title: '设备指令',
    subtitle: '模拟终端控制指令',
    description: '适合 IoT、门店设备、POS 机等通过 UDP 接收控制命令的场景。',
    draft: JSON.stringify({ type: 'device', deviceId: 'dev-1001', command: 'reboot', operator: 'demo-admin' }, null, 2)
  },
  {
    key: 'heartbeat',
    title: '保活心跳',
    subtitle: '模拟设备上报在线状态',
    description: '适合网关、硬件盒子、摄像头等设备周期性上报在线状态。',
    draft: JSON.stringify({ type: 'heartbeat', deviceId: 'gw-01', online: true, ts: Date.now() }, null, 2)
  },
  {
    key: 'telemetry',
    title: '遥测数据',
    subtitle: '模拟高频状态上报',
    description: '适合传感器、物流温控、机房监控等轻量状态上报。',
    draft: JSON.stringify({ type: 'telemetry', sensorId: 'temp-01', temp: 23.8, humidity: 61, ts: Date.now() }, null, 2)
  },
  {
    key: 'log',
    title: '日志上报',
    subtitle: '模拟设备运行日志',
    description: '适合设备报警、运行日志和轻量告警广播。',
    draft: JSON.stringify({ type: 'log', level: 'warning', message: 'device packet dropped', code: 'UDP-301' }, null, 2)
  },
  {
    key: 'discover',
    title: '发现广播',
    subtitle: '模拟局域网发现报文',
    description: '适合局域网发现、网关探测和设备注册这类弱连接场景。',
    draft: JSON.stringify({ type: 'discover', service: 'udp-lab', from: 'client-a', ts: Date.now() }, null, 2)
  }
]

const activeTab = ref<UdpExampleKey>('echo')
const httpBase = ref('http://127.0.0.1:8001')
const udpHost = ref('127.0.0.1')
const udpPort = ref(9999)
const customMessage = ref(examples[0].draft)
const status = ref<StreamStatus>('idle')
const logs = ref<UdpLogItem[]>([])
const streamConnectedAt = ref('')
const sentCount = ref(0)
const receivedCount = ref(0)
const serverInfo = ref<UdpStatusInfo | null>(null)

let socketTask: UniApp.SocketTask | null = null
let logSeed = 1

const currentExample = computed(() => examples.find(item => item.key === activeTab.value) || examples[0])
const normalizedHttpBase = computed(() => httpBase.value.trim().replace(/\/$/, ''))
const wsBase = computed(() => normalizedHttpBase.value.replace(/^http/, 'ws'))
const udpStreamUrl = computed(() => `${wsBase.value}/ws/udp-events`)

const statusText = computed(() => {
  const map: Record<StreamStatus, string> = {
    idle: '未连接',
    connecting: '连接中',
    open: '已订阅',
    closed: '已关闭',
    error: '异常'
  }
  return map[status.value]
})

const statusTagType = computed(() => {
  const map: Record<StreamStatus, 'primary' | 'success' | 'warning' | 'danger'> = {
    idle: 'primary',
    connecting: 'warning',
    open: 'success',
    closed: 'primary',
    error: 'danger'
  }
  return map[status.value]
})

const statItems = computed(() => [
  { label: '事件流状态', value: statusText.value },
  { label: '已发送', value: `${sentCount.value} 次` },
  { label: '已接收', value: `${receivedCount.value} 条` },
  { label: 'UDP 目标', value: `${udpHost.value}:${udpPort.value}` }
])

function nowText() {
  const date = new Date()
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

function pushLog(type: UdpLogType, title: string, content: string) {
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

function connectStream() {
  if (!wsBase.value) {
    toast.error('请先填写 HTTP 服务地址')
    return
  }

  if (socketTask) {
    disconnectStream(false)
  }

  status.value = 'connecting'
  pushLog('system', '连接事件流', udpStreamUrl.value)

  const task = uni.connectSocket({
    url: udpStreamUrl.value,
    complete: () => {}
  })

  socketTask = task

  task.onOpen(() => {
    if (socketTask !== task) return
    status.value = 'open'
    streamConnectedAt.value = nowText()
    pushLog('system', '订阅成功', `已连接 ${udpStreamUrl.value}`)
    toast.success('UDP 事件流已连接')
  })

  task.onMessage((res) => {
    if (socketTask !== task) return
    const data = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
    receivedCount.value += 1
    pushLog('receive', '收到 UDP 事件', data)
  })

  task.onError((res) => {
    if (socketTask !== task) return
    status.value = 'error'
    pushLog('error', '事件流异常', JSON.stringify(res))
    toast.warning('UDP 事件流连接异常')
  })

  task.onClose((res) => {
    if (socketTask === task) {
      socketTask = null
    }
    status.value = 'closed'
    pushLog('system', '事件流关闭', JSON.stringify(res))
  })
}

function disconnectStream(showToast = true) {
  if (!socketTask) {
    status.value = 'closed'
    return
  }

  const current = socketTask
  socketTask = null
  current.close({
    code: 1000,
    reason: 'udp-stream-close',
    complete: () => {
      status.value = 'closed'
      pushLog('system', '手动断开', 'UDP 事件流已断开')
      if (showToast) toast.success('已断开 UDP 事件流')
    }
  })
}

function requestPromise<T = Record<string, any>>(options: UniApp.RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (res) => resolve(res.data as T),
      fail: reject
    })
  })
}

async function refreshStatus() {
  try {
    const data = await requestPromise<UdpStatusInfo>({
      url: `${normalizedHttpBase.value}/udp/status`,
      method: 'GET'
    })
    serverInfo.value = data
    pushLog('system', '刷新状态', JSON.stringify(data))
  } catch (error) {
    pushLog('error', '状态获取失败', JSON.stringify(error))
    toast.error('获取 UDP 服务状态失败')
  }
}

async function sendUdpPacket() {
  const message = customMessage.value.trim()
  if (!message) {
    toast.error('请输入要发送的 UDP 报文')
    return
  }

  try {
    const data = await requestPromise<Record<string, any>>({
      url: `${normalizedHttpBase.value}/udp/send`,
      method: 'POST',
      data: {
        host: udpHost.value.trim(),
        port: Number(udpPort.value),
        message,
        timeout_ms: 1500,
        expect_response: true
      },
      header: {
        'Content-Type': 'application/json'
      }
    })
    sentCount.value += 1
    pushLog('send', '发送 UDP 报文', JSON.stringify(data))
    toast.success(data.timeout ? 'UDP 已发送，响应超时' : 'UDP 已发送并收到回包')
    refreshStatus()
  } catch (error) {
    pushLog('error', '发送失败', JSON.stringify(error))
    toast.error('UDP 发送失败')
  }
}

watch(activeTab, () => {
  customMessage.value = currentExample.value.draft
  pushLog('system', '切换示例', `当前示例：${currentExample.value.title}`)
})

onMounted(() => {
  refreshStatus()
})

onUnmounted(() => {
  disconnectStream(false)
})
</script>

<template>
  <PageShell title="UDP 调试台" description="浏览器和 H5 本身不能直接发原生 UDP，所以这里使用 FastAPI 做桥接：前端发 HTTP 触发 UDP 发送，用 WebSocket 订阅后端收到的 UDP 事件。">
    <view class="udp-page">
      <wd-toast selector="udp-lab-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">UDP 前后端联调示例</view>
          <view class="hero-desc">后端真实监听 `127.0.0.1:9999`，前端可以发送 UDP 报文、查看回包，并通过实时事件流观察后端接收情况。</view>
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

        <view class="input-label">后端 HTTP 地址</view>
        <input v-model="httpBase" class="native-input" placeholder="例如 http://127.0.0.1:8001" />

        <view class="server-grid">
          <view class="server-item">
            <view class="input-label">UDP Host</view>
            <input v-model="udpHost" class="native-input" placeholder="127.0.0.1" />
          </view>
          <view class="server-item">
            <view class="input-label">UDP Port</view>
            <input v-model.number="udpPort" class="native-input" type="number" placeholder="9999" />
          </view>
        </view>

        <view class="tips-card">
          <view class="tips-title">连接信息</view>
          <view class="tips-line">HTTP 状态接口：{{ normalizedHttpBase }}/udp/status</view>
          <view class="tips-line">UDP 发送接口：{{ normalizedHttpBase }}/udp/send</view>
          <view class="tips-line">事件流订阅：{{ udpStreamUrl }}</view>
          <view class="tips-line">事件流连接时间：{{ streamConnectedAt || '尚未连接' }}</view>
        </view>

        <view class="action-row">
          <wd-button size="small" type="primary" @click="connectStream">连接事件流</wd-button>
          <wd-button size="small" plain @click="disconnectStream()">断开事件流</wd-button>
          <wd-button size="small" plain @click="refreshStatus">刷新状态</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>UDP 报文</text>
          <wd-tag type="warning" plain>通过后端桥接发送</wd-tag>
        </view>
        <textarea v-model="customMessage" class="native-textarea" maxlength="-1" />
        <view class="action-row">
          <wd-button size="small" type="primary" @click="sendUdpPacket">发送 UDP 报文</wd-button>
          <wd-button size="small" plain @click="customMessage = currentExample.draft">恢复示例消息</wd-button>
          <wd-button size="small" plain @click="clearLogs">清空日志</wd-button>
        </view>
      </view>

      <view v-if="serverInfo" class="panel-card">
        <view class="section-head">
          <text>后端状态</text>
          <wd-tag plain>{{ serverInfo.event_count }} 条事件</wd-tag>
        </view>
        <view class="tips-line">UDP 监听：{{ serverInfo.host }}:{{ serverInfo.port }}</view>
        <view class="tips-line">事件接口：{{ serverInfo.events_path }}</view>
        <view class="tips-line">流地址：{{ serverInfo.stream_path }}</view>
        <view class="tips-line">服务时间：{{ serverInfo.time }}</view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>收发日志</text>
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
          <view class="empty-title">还没有 UDP 日志</view>
          <view class="empty-desc">先连接事件流，再发送一个 UDP 报文，就能看到后端收到的 UDP 事件和回包结果。</view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.udp-page {
  display: grid;
  gap: 24rpx;
}

.hero-card,
.metric-card,
.panel-card,
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
.log-content {
  margin-top: 12rpx;
  color: var(--app-muted);
  font-size: 25rpx;
  line-height: 1.7;
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

.server-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.input-label,
.tips-title,
.empty-title,
.log-title {
  color: var(--app-ink);
  font-size: 27rpx;
  font-weight: 700;
}

.input-label {
  margin-top: 22rpx;
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

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 20rpx;
}

.tips-card {
  margin-top: 22rpx;
  padding: 22rpx;
  background: #f8fbff;
}

.log-list {
  display: grid;
  gap: 16rpx;
  margin-top: 20rpx;
}

.log-card,
.empty-card {
  padding: 22rpx;
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
