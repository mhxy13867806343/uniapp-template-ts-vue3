<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type WsExampleKey = 'echo' | 'chat' | 'heartbeat' | 'orders' | 'ticker' | 'presence'
type WsStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'
type WsLogType = 'system' | 'send' | 'receive' | 'error'

interface WsExampleItem {
  key: WsExampleKey
  title: string
  subtitle: string
  description: string
  sampleAction: string
  draft: string
  autoMode?: 'heartbeat' | 'orders' | 'ticker' | 'presence'
}

interface WsLogItem {
  id: number
  type: WsLogType
  title: string
  content: string
  time: string
}

const toast = useToast('ws-lab-toast')

const examples: WsExampleItem[] = [
  {
    key: 'echo',
    title: '基础连接',
    subtitle: '最小可运行的 Echo 演示',
    description: '验证连接、发送、接收和断开流程，适合先跑通 WebSocket 基础链路。',
    sampleAction: '发送基础握手包',
    draft: JSON.stringify({ type: 'hello', scene: 'echo', client: 'uni-app', time: Date.now() }, null, 2)
  },
  {
    key: 'chat',
    title: '聊天室消息',
    subtitle: '模拟群聊与客服会话',
    description: '演示文本消息结构、用户标识和会话 ID，适合 IM 或客服消息场景。',
    sampleAction: '发送一条聊天消息',
    draft: JSON.stringify({ type: 'chat', roomId: 'support-room-01', sender: 'demo-user', text: '你好，帮我查一下订单进度。' }, null, 2)
  },
  {
    key: 'heartbeat',
    title: '心跳保活',
    subtitle: '每隔几秒发送 ping',
    description: '演示保活、超时检测和长连接在线状态维护。',
    sampleAction: '发送一次心跳',
    draft: JSON.stringify({ type: 'ping', scene: 'heartbeat', ts: Date.now() }, null, 2),
    autoMode: 'heartbeat'
  },
  {
    key: 'orders',
    title: '订单状态流',
    subtitle: '模拟下单后的实时状态更新',
    description: '适合订单支付、发货、售后等需要持续推送状态的业务。',
    sampleAction: '查询订单状态',
    draft: JSON.stringify({ type: 'orderStatus', orderNo: 'DEMO-ORDER-20260711', step: 'paid' }, null, 2),
    autoMode: 'orders'
  },
  {
    key: 'ticker',
    title: '行情/价格推送',
    subtitle: '模拟商品价格与库存波动',
    description: '适合金融行情、库存变更、秒杀价变化等高频推送场景。',
    sampleAction: '订阅价格流',
    draft: JSON.stringify({ type: 'tickerSubscribe', skuId: 'SKU-8801', price: 199, stock: 86 }, null, 2),
    autoMode: 'ticker'
  },
  {
    key: 'presence',
    title: '在线状态同步',
    subtitle: '模拟多人协作与在线人数',
    description: '适合协同编辑、在线客服、直播房间在线人数同步。',
    sampleAction: '同步在线状态',
    draft: JSON.stringify({ type: 'presence', roomId: 'collab-board', online: 12, user: 'operator-a' }, null, 2),
    autoMode: 'presence'
  }
]

const activeTab = ref<WsExampleKey>('echo')
const serverBase = ref('ws://127.0.0.1:8001')
const customMessage = ref(examples[0].draft)
const status = ref<WsStatus>('idle')
const logs = ref<WsLogItem[]>([])
const sentCount = ref(0)
const receivedCount = ref(0)
const reconnectCount = ref(0)
const connectedAt = ref('')

let socketTask: UniApp.SocketTask | null = null
let autoTimer: ReturnType<typeof setInterval> | null = null
let logSeed = 1

const currentExample = computed(() => examples.find(item => item.key === activeTab.value) || examples[0])
const normalizedServerBase = computed(() => serverBase.value.trim().replace(/\/$/, ''))
const endpoint = computed(() => `${normalizedServerBase.value}/ws/${activeTab.value}`)
const docsBase = computed(() => normalizedServerBase.value.replace(/^ws/, 'http'))

const statusText = computed(() => {
  const map: Record<WsStatus, string> = {
    idle: '未连接',
    connecting: '连接中',
    open: '已连接',
    closed: '已关闭',
    error: '连接异常'
  }
  return map[status.value]
})

const statusTagType = computed(() => {
  const map: Record<WsStatus, 'primary' | 'success' | 'warning' | 'danger'> = {
    idle: 'primary',
    connecting: 'warning',
    open: 'success',
    closed: 'primary',
    error: 'danger'
  }
  return map[status.value]
})

const statItems = computed(() => [
  { label: '连接状态', value: statusText.value },
  { label: '已发送', value: `${sentCount.value} 条` },
  { label: '已接收', value: `${receivedCount.value} 条` },
  { label: '重连次数', value: `${reconnectCount.value} 次` }
])

function nowText() {
  const date = new Date()
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

function pushLog(type: WsLogType, title: string, content: string) {
  logs.value.unshift({
    id: logSeed++,
    type,
    title,
    content,
    time: nowText()
  })
  logs.value = logs.value.slice(0, 60)
}

function clearAutoTimer() {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }
}

function clearLogs() {
  logs.value = []
}

function handleSocketOpen() {
  status.value = 'open'
  connectedAt.value = nowText()
  pushLog('system', '连接成功', `已连接到 ${endpoint.value}`)
  toast.success(`${currentExample.value.title} 已连接`)
  startAutoMode()
}

function handleSocketMessage(data: string) {
  receivedCount.value += 1
  pushLog('receive', '收到消息', data)
}

function handleSocketClose(reason = '连接已关闭') {
  status.value = 'closed'
  clearAutoTimer()
  pushLog('system', '连接关闭', reason)
}

function handleSocketError(error: unknown) {
  status.value = 'error'
  clearAutoTimer()
  pushLog('error', '连接异常', typeof error === 'string' ? error : JSON.stringify(error))
  toast.warning('WebSocket 连接异常')
}

function disconnectSocket(showToast = true) {
  clearAutoTimer()
  if (!socketTask) {
    status.value = 'closed'
    return
  }

  const current = socketTask
  socketTask = null
  current.close({
    code: 1000,
    reason: 'manual-close',
    complete: () => {
      handleSocketClose('手动断开连接')
      if (showToast) toast.success('已断开连接')
    }
  })
}

function connectSocket(isReconnect = false) {
  if (!normalizedServerBase.value) {
    toast.error('请先填写 WebSocket 服务地址')
    return
  }

  if (socketTask) {
    disconnectSocket(false)
  }

  if (isReconnect) reconnectCount.value += 1
  status.value = 'connecting'
  pushLog('system', isReconnect ? '重新连接' : '开始连接', endpoint.value)

  const task = uni.connectSocket({
    url: endpoint.value,
    complete: () => {}
  })

  socketTask = task

  task.onOpen(() => {
    if (socketTask !== task) return
    handleSocketOpen()
  })

  task.onMessage((res) => {
    if (socketTask !== task) return
    const data = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
    handleSocketMessage(data)
  })

  task.onError((res) => {
    if (socketTask !== task) return
    handleSocketError(res)
  })

  task.onClose((res) => {
    if (socketTask === task) {
      socketTask = null
    }
    handleSocketClose(JSON.stringify(res))
  })
}

function sendPayload(payload: string, title: string) {
  if (!socketTask || status.value !== 'open') {
    toast.warning('请先建立连接')
    return
  }

  socketTask.send({
    data: payload,
    success: () => {
      sentCount.value += 1
      pushLog('send', title, payload)
    },
    fail: (res) => {
      pushLog('error', '发送失败', JSON.stringify(res))
      toast.error('消息发送失败')
    }
  })
}

function sendExamplePayload() {
  sendPayload(currentExample.value.draft, currentExample.value.sampleAction)
}

function sendCustomPayload() {
  const payload = customMessage.value.trim()
  if (!payload) {
    toast.error('请输入自定义消息体')
    return
  }
  sendPayload(payload, '发送自定义消息')
}

function startAutoMode() {
  clearAutoTimer()
  if (status.value !== 'open') return

  const mode = currentExample.value.autoMode
  if (!mode) return

  autoTimer = setInterval(() => {
    if (mode === 'heartbeat') {
      sendPayload(JSON.stringify({ type: 'ping', ts: Date.now(), scene: activeTab.value }), '自动心跳')
      return
    }

    if (mode === 'orders') {
      sendPayload(JSON.stringify({
        type: 'orderStatus',
        orderNo: 'DEMO-ORDER-20260711',
        step: ['paid', 'packed', 'shipping', 'signed'][Math.floor(Math.random() * 4)],
        ts: Date.now()
      }), '自动订单状态推送')
      return
    }

    if (mode === 'ticker') {
      sendPayload(JSON.stringify({
        type: 'ticker',
        skuId: 'SKU-8801',
        price: 180 + Math.floor(Math.random() * 40),
        stock: 60 + Math.floor(Math.random() * 30),
        ts: Date.now()
      }), '自动价格推送')
      return
    }

    if (mode === 'presence') {
      sendPayload(JSON.stringify({
        type: 'presence',
        roomId: 'collab-board',
        online: 8 + Math.floor(Math.random() * 12),
        ts: Date.now()
      }), '自动在线状态同步')
    }
  }, 5000)
}

watch(activeTab, () => {
  customMessage.value = currentExample.value.draft
  pushLog('system', '切换示例', `当前示例：${currentExample.value.title}`)
  if (status.value === 'open') {
    connectSocket(true)
    return
  }
  startAutoMode()
})

onUnmounted(() => {
  disconnectSocket(false)
})
</script>

<template>
  <PageShell title="WebSocket 示例中心" description="从首页进入后通过 tabs 切换 6 种不同的 WebSocket 场景，覆盖连接、聊天、心跳、订单、价格流和在线状态同步。">
    <view class="ws-page">
      <wd-toast selector="ws-lab-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">6 种 WebSocket 示例</view>
          <view class="hero-desc">默认指向本地 FastAPI WebSocket 服务，你可以直接改服务基地址，然后切 tabs 观察 6 条不同 ws 路由的收发日志。</view>
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

        <view class="input-label">WebSocket 服务基地址</view>
        <input v-model="serverBase" class="native-input" placeholder="例如 ws://127.0.0.1:8001" />
        <view class="tips-line">当前连接地址：{{ endpoint }}</view>
        <view class="tips-line">健康检查：{{ docsBase }}/health</view>
        <view class="tips-line">接口文档：{{ docsBase }}/docs</view>

        <view class="action-row">
          <wd-button size="small" type="primary" @click="connectSocket(false)">连接</wd-button>
          <wd-button size="small" plain @click="connectSocket(true)">重连</wd-button>
          <wd-button size="small" plain @click="disconnectSocket()">断开</wd-button>
          <wd-button size="small" plain @click="sendExamplePayload">{{ currentExample.sampleAction }}</wd-button>
        </view>

        <view class="tips-card">
          <view class="tips-title">连接信息</view>
          <view class="tips-line">当前状态：{{ statusText }}</view>
          <view class="tips-line">连接时间：{{ connectedAt || '尚未建立连接' }}</view>
          <view class="tips-line">当前示例：{{ currentExample.title }}</view>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>自定义消息体</text>
          <wd-tag type="warning" plain>可编辑</wd-tag>
        </view>
        <textarea v-model="customMessage" class="native-textarea" maxlength="-1" />
        <view class="action-row">
          <wd-button size="small" type="primary" @click="sendCustomPayload">发送自定义消息</wd-button>
          <wd-button size="small" plain @click="customMessage = currentExample.draft">恢复示例消息</wd-button>
          <wd-button size="small" plain @click="clearLogs">清空日志</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <text>消息日志</text>
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
          <view class="empty-desc">先连接，再切换 tabs 和发送消息，就能看到 6 种不同示例的消息流。</view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.ws-page {
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
