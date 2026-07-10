<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { getHardwareInfo, getNetworkDetails, pingHost, usePlatformPlugins } from '@/plugins'
import type { PaymentProvider, PluginResult } from '@/plugins'

const toast = useToast('plugins-toast')
const appStore = useAppStore()
const plugins = usePlatformPlugins()

const hardwareInfoResult = ref('')
const networkType = ref('未检测')
const networkIp = ref('未检测')
const pingTarget = ref('baidu.com')
const pingResult = ref('')
const pinging = ref(false)

const sliderVal = ref(60)
const customBrandColor = ref('#2756d8')
const themeColorOptions = ['#2756d8', '#22c55e', '#ef4444', '#a855f7', '#f59e0b']

const sharePayload = ref({
  title: '跨端插件演示页',
  content: '这里可以直接测试统一分享、支付、弹窗和定位能力。',
  url: 'https://example.com/plugin-demo'
})

const paymentPayload = ref<{
  orderNo: string
  amount: number
  provider: PaymentProvider
}>({
  orderNo: `DEMO-${Date.now()}`,
  amount: 199,
  provider: 'wechat'
})

const resultTitle = ref('最近一次操作结果')
const resultText = ref('点击下面的演示按钮后，这里会展示插件返回结果。')
const lastResultOk = ref<boolean | null>(null)

const pluginItems = [
  {
    name: '统一插件层',
    desc: '在 src/plugins 中按平台分发分享、支付、定位、弹窗和设备信息。'
  },
  {
    name: 'Pinia 状态管理',
    desc: '页面里可以直接演示全局状态联动，同时保留应用级状态管理能力。'
  },
  {
    name: 'Wot Design Uni',
    desc: '继续使用 easycom 和按需加载，页面交互型控件接入很轻。'
  },
  {
    name: 'UnoCSS / 样式体系',
    desc: '基础布局和样式变量仍然能作为页面实验场继续验证。'
  }
]

const pluginSteps = [
  '统一在 src/plugins 中定义跨端插件接口和平台分发逻辑',
  '业务页面只通过 usePlatformPlugins 调用，不直接判断平台',
  '真实支付签名和分享参数由后端或原生能力继续接入',
  '演示页作为联调入口，方便逐项验证返回结果'
]

function updateResult(title: string, result: unknown, ok?: boolean) {
  resultTitle.value = title
  resultText.value = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
  lastResultOk.value = typeof ok === 'boolean' ? ok : null
}

function handleActionResult(title: string, result: PluginResult) {
  updateResult(title, result, result.ok)
  if (result.ok) {
    toast.success(result.message)
  } else {
    toast.warning(result.message)
  }
}

function fetchHardwareInfo() {
  try {
    const res = getHardwareInfo()
    hardwareInfoResult.value = res
    updateResult('设备插件返回', res, true)
    toast.success('设备信息获取成功')
  } catch (e: any) {
    const message = `网桥调用失败: ${e?.message || e || 'unknown'}`
    hardwareInfoResult.value = message
    updateResult('设备插件返回', message, false)
    toast.error('设备信息获取失败')
  }
}

function fetchNetworkDetails() {
  try {
    const details = getNetworkDetails()
    networkType.value = details.type
    networkIp.value = details.ip
    updateResult('网络状态网桥返回', details, true)
    toast.success('网络状态获取成功')
  } catch (e: any) {
    const message = `网络网桥调用失败: ${e?.message || e || 'unknown'}`
    updateResult('网络状态网桥返回', message, false)
    toast.error('网络状态获取失败')
  }
}

async function runPingTest() {
  if (!pingTarget.value.trim()) {
    toast.error('请输入测试域名或 IP')
    return
  }
  pinging.value = true
  pingResult.value = '正在执行连通测试...'
  updateResult('Ping 延迟测试', '开始对目标：' + pingTarget.value + ' 发起延迟诊断...', true)
  try {
    const res = await pingHost(pingTarget.value, 3000)
    pingResult.value = res
    updateResult('Ping 延迟测试', res, true)
    toast.success('网络诊断完毕')
  } catch (e: any) {
    const message = `测试异常: ${e.message || e}`
    pingResult.value = message
    updateResult('Ping 延迟测试', message, false)
    toast.error('网络诊断超时或失败')
  } finally {
    pinging.value = false
  }
}

function toggleAppReadyState() {
  if (appStore.ready) {
    appStore.$patch({ ready: false })
    toast.warning('应用状态已切换为挂起')
    updateResult('Pinia 状态变更', { ready: false, message: '应用状态已切换为挂起' }, true)
  } else {
    appStore.markReady()
    toast.success('应用状态已切换为就绪')
    updateResult('Pinia 状态变更', { ready: true, message: '应用状态已切换为就绪' }, true)
  }
}

function handleSliderChange(val: number) {
  toast.success(`音量调节为 ${val}%`)
  updateResult('Wot 组件联动', { slider: val, message: `音量调节为 ${val}%` }, true)
}

function changeLocalBrandColor(color: string) {
  customBrandColor.value = color
  toast.success(`主题色切换为 ${color}`)
  updateResult('主题变量切换', { color }, true)
}

async function handleShare(mode: 'send' | 'system' | 'copy') {
  const payload = {
    ...sharePayload.value,
    provider: mode === 'copy' ? 'copy' as const : 'system' as const
  }

  const result = mode === 'send'
    ? await plugins.share.send(payload)
    : mode === 'system'
      ? await plugins.share.system(payload)
      : await plugins.share.copy(payload)

  handleActionResult(`分享演示 - ${mode}`, result)
}

async function handlePayment(provider: 'wechat' | 'alipay') {
  paymentPayload.value.provider = provider
  const result = await plugins.payment.request({
    provider,
    orderNo: paymentPayload.value.orderNo,
    amount: paymentPayload.value.amount,
    mock: true,
    mockDelay: 500
  })

  handleActionResult(`支付演示 - ${provider}`, result)
}

async function handleAlert() {
  const result = await plugins.modal.alert({
    title: '插件演示',
    content: '这是统一弹窗能力的提示框演示。'
  })
  handleActionResult('弹窗演示 - alert', result)
}

async function handleConfirm() {
  const result = await plugins.modal.confirm({
    title: '确认继续吗？',
    content: '这里演示统一 confirm 能力。'
  })
  updateResult('弹窗演示 - confirm', result, result.ok)
  toast.success(result.confirmed ? '你点击了确认' : '你取消了操作')
}

async function handleActionSheet() {
  const result = await plugins.modal.actionSheet({
    itemList: ['复制链接', '分享给同事', '保存草稿'],
    alertText: '选择下一步动作'
  })
  updateResult('弹窗演示 - actionSheet', result, result.ok)
  toast.success(result.ok ? `选择了第 ${result.tapIndex + 1} 项` : result.message)
}

async function handleCurrentLocation() {
  const result = await plugins.location.getCurrent({
    type: 'gcj02',
    isHighAccuracy: true,
    geocode: true
  })
  handleActionResult('定位演示 - 当前定位', result)
}

async function handleChooseLocation() {
  const result = await plugins.location.choose()
  handleActionResult('定位演示 - 选择位置', result)
}

async function handleOpenMap() {
  const result = await plugins.location.openMap({
    latitude: 31.2304,
    longitude: 121.4737,
    name: '人民广场',
    address: '上海市黄浦区人民广场',
    scale: 16
  })
  handleActionResult('定位演示 - 打开地图', result)
}
</script>

<template>
  <PageShell title="插件与核心包体系" description="这里不只是介绍插件，而是直接把统一分享、支付、弹窗、定位和设备能力做成可操作的演示台。">
    <view class="plugins-framework-page">
      <wd-toast selector="plugins-toast" />

      <view class="panel-section hero-panel">
        <view>
          <view class="hero-kicker">Plugin Playground</view>
          <view class="hero-title">跨端插件演示页</view>
          <view class="share-desc-info mt-1">
            当前平台：{{ plugins.platform }}，下面每个操作都会把返回结果直接显示出来，方便你联调插件层。
          </view>
        </view>
        <view class="hero-badges">
          <view class="hero-badge">分享</view>
          <view class="hero-badge">支付</view>
          <view class="hero-badge">弹窗</view>
          <view class="hero-badge">定位</view>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head font-bold mb-2">
          <text>设备与平台</text>
        </view>
        <view class="share-desc-info mb-3">
          先确认当前插件层分发到了哪个平台，并验证原生设备信息桥接是否正常。
        </view>

        <view class="grid-card">
          <view class="result-chip">当前平台：{{ plugins.platform }}</view>
          <wd-button size="small" type="primary" @click="fetchHardwareInfo">获取硬件详情</wd-button>
        </view>

        <view class="hardware-info-box p-2 mt-2">
          <text class="hardware-text">{{ hardwareInfoResult || '点击按钮后，这里会显示设备插件返回值。' }}</text>
        </view>
      </view>

      <!-- Network Diagnostics -->
      <view class="panel-section">
        <view class="section-head font-bold mb-2">
          <text>网络诊断网桥</text>
        </view>
        <view class="share-desc-info mb-3">
          演示跨平台网桥网络能力：Android调用Java接口，iOS调用ObjC接口，H5与小程序使用原生JS/Web网络请求自诊断。
        </view>

        <view class="grid-card flex justify-between items-center mb-2">
          <view class="flex-column">
            <text class="network-label">当前连接类型：<text class="font-bold text-brand">{{ networkType }}</text></text>
            <text class="network-label mt-1">本地 IP 地址：<text class="font-bold text-ink">{{ networkIp }}</text></text>
          </view>
          <wd-button size="small" type="primary" @click="fetchNetworkDetails">检测网络</wd-button>
        </view>

        <view class="ping-diagnostic-box p-3 mt-3">
          <view class="font-bold mb-1" style="font-size: 21rpx; color: var(--app-ink);">Ping 延迟诊断</view>
          <view class="flex mt-2 items-center">
            <input v-model="pingTarget" class="ping-native-input flex-1 mr-2" placeholder="请输入测试地址，例如 baidu.com" />
            <wd-button size="small" :loading="pinging" @click="runPingTest">测试延迟</wd-button>
          </view>
          <view class="ping-result-box p-2 mt-2">
            <text class="hardware-text">{{ pingResult || '等待执行诊断...' }}</text>
          </view>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head font-bold mb-2">
          <text>分享能力</text>
        </view>
        <view class="share-desc-info mb-3">
          演示统一分享、系统分享和复制分享内容。不同平台会自动走对应实现。
        </view>

        <view class="demo-card">
          <view class="demo-card__title">{{ sharePayload.title }}</view>
          <view class="demo-card__desc">{{ sharePayload.content }}</view>
          <view class="demo-card__meta">{{ sharePayload.url }}</view>
        </view>

        <view class="action-row mt-2">
          <wd-button size="small" type="primary" @click="handleShare('send')">统一分享</wd-button>
          <wd-button size="small" plain @click="handleShare('system')">系统分享</wd-button>
          <wd-button size="small" plain @click="handleShare('copy')">复制内容</wd-button>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head font-bold mb-2">
          <text>支付能力</text>
        </view>
        <view class="share-desc-info mb-3">
          这里先走模拟支付，方便联调前端流程；后续只要补真实签名参数就能继续接入。
        </view>

        <view class="demo-card">
          <view class="demo-card__title">订单号：{{ paymentPayload.orderNo }}</view>
          <view class="demo-card__desc">支付金额：¥{{ paymentPayload.amount }}</view>
          <view class="demo-card__meta">当前演示模式：mock</view>
        </view>

        <view class="action-row mt-2">
          <wd-button size="small" type="primary" @click="handlePayment('wechat')">模拟微信支付</wd-button>
          <wd-button size="small" plain @click="handlePayment('alipay')">模拟支付宝支付</wd-button>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head font-bold mb-2">
          <text>弹窗与动作面板</text>
        </view>
        <view class="share-desc-info mb-3">
          用统一 modal API 演示 alert、confirm 和 actionSheet。
        </view>

        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleAlert">提示框</wd-button>
          <wd-button size="small" plain @click="handleConfirm">确认框</wd-button>
          <wd-button size="small" plain @click="handleActionSheet">动作面板</wd-button>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head font-bold mb-2">
          <text>定位与地图</text>
        </view>
        <view class="share-desc-info mb-3">
          可以直接测试当前定位、位置选择和打开地图定位。真机环境下体验会更完整。
        </view>

        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleCurrentLocation">获取定位</wd-button>
          <wd-button size="small" plain @click="handleChooseLocation">选择位置</wd-button>
          <wd-button size="small" plain @click="handleOpenMap">打开地图</wd-button>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head font-bold mb-2">
          <text>最近一次结果</text>
        </view>
        <view class="result-card" :class="{
          'result-card--success': lastResultOk === true,
          'result-card--warning': lastResultOk === false
        }">
          <view class="demo-card__title">{{ resultTitle }}</view>
          <text class="result-text">{{ resultText }}</text>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head font-bold mb-2">
          <text>Pinia / Wot / UnoCSS 联动</text>
        </view>
        <view class="share-desc-info mb-3">
          这部分保留原来的底座演示，但一起收进同一个插件页里。
        </view>

        <view class="pinia-demo-card flex justify-between items-center p-3 mb-2">
          <view class="flex items-center">
            <view class="status-light-indicator" :class="{ active: appStore.ready }"></view>
            <view class="flex-column ml-2">
              <text class="font-bold text-ink">appStore.ready</text>
              <text class="text-muted sub-text">当前状态：{{ appStore.ready ? '运行就绪' : '系统挂起' }}</text>
            </view>
          </view>
          <wd-button size="small" type="primary" @click="toggleAppReadyState">切换状态</wd-button>
        </view>

        <view class="p-2 border-box mb-2">
          <text class="row-label font-bold text-ink">Wot Slider 联动：</text>
          <view class="mt-2">
            <wd-slider v-model="sliderVal" @change="handleSliderChange" />
          </view>
        </view>

        <view class="theme-card-preview p-3 flex items-center justify-between" :style="{ borderLeftColor: customBrandColor }">
          <view class="flex-column">
            <text class="font-bold theme-preview-text" :style="{ color: customBrandColor }">当前主题色</text>
            <text class="text-muted sub-text">点击右侧色块后会更新预览边框和文本颜色</text>
          </view>

          <view class="flex">
            <view
              v-for="color in themeColorOptions"
              :key="color"
              :class="['color-dot-cell ml-1', { active: customBrandColor === color }]"
              :style="{ backgroundColor: color }"
              @click="changeLocalBrandColor(color)"
            />
          </view>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head font-bold mb-3">
          <text>底座说明</text>
        </view>
        <view class="grid gap-2">
          <view
            v-for="item in pluginItems"
            :key="item.name"
            class="plugin-info-item p-2"
          >
            <view class="font-bold text-ink item-title">{{ item.name }}</view>
            <view class="text-muted mt-1 item-desc">{{ item.desc }}</view>
          </view>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head font-bold mb-3">
          <text>接入建议</text>
        </view>
        <wd-steps :active="2" vertical>
          <wd-step
            v-for="step in pluginSteps"
            :key="step"
            :title="step"
          />
        </wd-steps>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.plugins-framework-page {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.panel-section {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  padding: 28rpx;
}

.hero-panel {
  display: grid;
  gap: 20rpx;
  background:
    radial-gradient(circle at top left, rgba(82, 121, 255, 0.16), transparent 40%),
    linear-gradient(180deg, #ffffff 0%, #f6f8ff 100%);
}

.hero-kicker {
  color: #426cff;
  font-size: 22rpx;
  font-weight: 800;
  letter-spacing: 1rpx;
}

.hero-title {
  margin-top: 10rpx;
  color: #182235;
  font-size: 42rpx;
  font-weight: 800;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.hero-badge,
.result-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52rpx;
  border-radius: 999rpx;
  background: #eef3ff;
  padding: 0 18rpx;
  color: #426cff;
  font-size: 22rpx;
  font-weight: 700;
}

.share-desc-info {
  color: #607083;
  font-size: 22rpx;
  line-height: 1.7;
}

.grid-card,
.demo-card,
.result-card,
.pinia-demo-card,
.plugin-info-item,
.border-box,
.theme-card-preview {
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #f8fafc;
}

.grid-card,
.action-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14rpx;
}

.grid-card,
.demo-card,
.result-card {
  padding: 22rpx;
}

.action-row {
  gap: 16rpx;
}

.demo-card__title,
.item-title {
  color: #182235;
  font-size: 26rpx;
  font-weight: 800;
}

.demo-card__desc,
.item-desc,
.sub-text {
  color: #607083;
  font-size: 21rpx;
  line-height: 1.65;
}

.demo-card__meta {
  margin-top: 10rpx;
  color: #8a95a5;
  font-size: 20rpx;
}

.result-card {
  background: #0f172a;
  border-color: #1e293b;
}

.result-card--success {
  background: linear-gradient(180deg, #0f172a 0%, #0f2d1f 100%);
  border-color: #1c7c45;
}

.result-card--warning {
  background: linear-gradient(180deg, #0f172a 0%, #38230f 100%);
  border-color: #b26a16;
}

.result-text,
.hardware-text {
  margin-top: 12rpx;
  font-family: monospace;
  font-size: 20rpx;
  line-height: 1.7;
  color: #e2e8f0;
  word-break: break-all;
  white-space: pre-wrap;
}

.pinia-demo-card {
  padding: 24rpx;
}

.status-light-indicator {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: #cbd5e1;
  transition: all 0.3s ease;
  box-shadow: 0 0 8rpx rgba(203, 213, 225, 0.4);

  &.active {
    background: #22c55e;
    box-shadow: 0 0 16rpx rgba(34, 197, 94, 0.8);
  }
}

.theme-card-preview {
  border-left: 8rpx solid #2756d8;
  padding: 24rpx;
  transition: border-left-color 0.2s ease;
}

.theme-preview-text {
  font-size: 24rpx;
}

.color-dot-cell {
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  border: 3rpx solid transparent;
  transition: all 0.2s ease;

  &.active {
    border-color: #111827;
    transform: scale(1.08);
  }
}

.gap-2 {
  gap: 16rpx;
}

.hardware-info-box {
  background: #0f172a;
  border-radius: 16rpx;
  border: 1rpx dashed #334155;
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.ml-1 { margin-left: 8rpx; }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mb-2 { margin-bottom: 16rpx; }
.mb-3 { margin-bottom: 24rpx; }
.p-2 { padding: 16rpx; }
.p-3 { padding: 24rpx; }

.network-label {
  font-size: 24rpx;
  color: #475569;
}

.ping-diagnostic-box {
  background: #f8fafc;
  border-radius: 16rpx;
  border: 1rpx solid var(--app-line);
}

.ping-native-input {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 12rpx 20rpx;
  font-size: 20rpx;
  color: var(--app-ink);
}

.ping-result-box {
  background: #0f172a;
  border-radius: 12rpx;
  border: 1rpx dashed #334155;
  margin-top: 12rpx;
}
</style>
