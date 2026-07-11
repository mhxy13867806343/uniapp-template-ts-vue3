<script setup lang="ts">
import {
  authorize,
  getAppBaseInfo,
  getClipboardData,
  getDeviceInfo,
  getNetworkType,
  getSystemInfo,
  getSystemInfoSync,
  getUniErrorMessage,
  getWindowInfo,
  makePhoneCall,
  onNetworkStatusChange,
  openSetting,
  setClipboardData,
  vibrateLong,
  vibrateShort
} from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('device-toast')

const clipboardText = ref('UniApp Device API Demo')
const systemInfoText = ref('')
const windowInfoText = ref('')
const deviceInfoText = ref('')
const appBaseInfoText = ref('')
const networkInfoText = ref('')
const logs = ref<string[]>([])
const listenNetwork = ref(false)

function log(message: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  logs.value = logs.value.slice(0, 50)
}

function setResult(target: 'system' | 'window' | 'device' | 'app' | 'network', value: unknown) {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  if (target === 'system') systemInfoText.value = text
  if (target === 'window') windowInfoText.value = text
  if (target === 'device') deviceInfoText.value = text
  if (target === 'app') appBaseInfoText.value = text
  if (target === 'network') networkInfoText.value = text
}

async function handleGetSystemInfo() {
  try {
    const result = await getSystemInfo()
    setResult('system', result)
    log('getSystemInfo 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`getSystemInfo 失败: ${message}`)
  }
}

function handleGetSystemInfoSync() {
  try {
    const result = getSystemInfoSync()
    setResult('system', result)
    log('getSystemInfoSync 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`getSystemInfoSync 失败: ${message}`)
  }
}

function handleGetWindowInfo() {
  try {
    const result = getWindowInfo()
    setResult('window', result)
    log('getWindowInfo 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`getWindowInfo 失败: ${message}`)
  }
}

function handleGetDeviceInfo() {
  try {
    const result = getDeviceInfo()
    setResult('device', result)
    log('getDeviceInfo 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`getDeviceInfo 失败: ${message}`)
  }
}

function handleGetAppBaseInfo() {
  try {
    const result = getAppBaseInfo()
    setResult('app', result)
    log('getAppBaseInfo 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`getAppBaseInfo 失败: ${message}`)
  }
}

async function handleGetNetworkType() {
  try {
    const result = await getNetworkType()
    setResult('network', result)
    log(`getNetworkType 成功: ${result.networkType}`)
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`getNetworkType 失败: ${message}`)
  }
}

async function handleSetClipboard() {
  try {
    await setClipboardData(clipboardText.value)
    toast.success('已写入剪贴板')
    log(`setClipboardData 成功: ${clipboardText.value}`)
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`setClipboardData 失败: ${message}`)
  }
}

async function handleGetClipboard() {
  try {
    const result = await getClipboardData()
    clipboardText.value = result.data
    log(`getClipboardData 成功: ${result.data}`)
    toast.success('已读取剪贴板')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`getClipboardData 失败: ${message}`)
  }
}

async function handleMakePhoneCall() {
  try {
    await makePhoneCall('10086')
    log('makePhoneCall 已触发')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`makePhoneCall 失败: ${message}`)
  }
}

async function handleAuthorize() {
  try {
    await authorize('scope.writePhotosAlbum')
    toast.success('授权请求已触发')
    log('authorize(scope.writePhotosAlbum) 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`authorize 失败: ${message}`)
  }
}

async function handleOpenSetting() {
  try {
    const result = await openSetting()
    setResult('app', result)
    log('openSetting 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`openSetting 失败: ${message}`)
  }
}

async function handleVibrate(mode: 'short' | 'long') {
  try {
    if (mode === 'short') await vibrateShort()
    else await vibrateLong()
    toast.success(`已触发${mode === 'short' ? '短震动' : '长震动'}`)
    log(`vibrate${mode === 'short' ? 'Short' : 'Long'} 成功`)
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`震动失败: ${message}`)
  }
}

const handleNetworkChange = (result: Record<string, unknown>) => {
  setResult('network', result)
  log(`网络状态变化: ${JSON.stringify(result)}`)
}

function toggleNetworkListener() {
  if (listenNetwork.value) {
    ;(uni as any).offNetworkStatusChange?.(handleNetworkChange)
    listenNetwork.value = false
    log('已关闭网络变化监听')
    return
  }
  onNetworkStatusChange(handleNetworkChange)
  listenNetwork.value = true
  log('已开启网络变化监听')
}

onUnmounted(() => {
  if (listenNetwork.value) {
    ;(uni as any).offNetworkStatusChange?.(handleNetworkChange)
  }
})
</script>

<template>
  <PageShell title="设备 APIs" description="统一测试设备信息、窗口信息、网络类型、剪贴板、拨号、授权、设置页和震动。适合通用壳层与系统能力联调。">
    <view class="api-page">
      <wd-toast selector="device-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">设备实验室</view>
          <view class="hero-desc">这里把最常用的设备类能力统一到一个页面：系统信息、窗口信息、网络类型、剪贴板、拨号、授权、设置和震动反馈。</view>
        </view>
        <wd-tag :type="listenNetwork ? 'success' : 'primary'" plain>{{ listenNetwork ? '监听网络变化中' : '设备能力面板' }}</wd-tag>
      </view>

      <view class="panel-card">
        <view class="section-title">设备 / 系统信息</view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleGetSystemInfo">getSystemInfo</wd-button>
          <wd-button size="small" plain @click="handleGetSystemInfoSync">getSystemInfoSync</wd-button>
          <wd-button size="small" plain @click="handleGetWindowInfo">getWindowInfo</wd-button>
          <wd-button size="small" plain @click="handleGetDeviceInfo">getDeviceInfo</wd-button>
          <wd-button size="small" plain @click="handleGetAppBaseInfo">getAppBaseInfo</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">网络 / 系统交互</view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleGetNetworkType">getNetworkType</wd-button>
          <wd-button size="small" plain @click="toggleNetworkListener">{{ listenNetwork ? '关闭网络监听' : '开启网络监听' }}</wd-button>
          <wd-button size="small" plain @click="handleAuthorize">请求相册权限</wd-button>
          <wd-button size="small" plain @click="handleOpenSetting">openSetting</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">剪贴板 / 电话 / 震动</view>
        <input v-model="clipboardText" class="native-input" placeholder="输入要写入剪贴板的内容" />
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleSetClipboard">setClipboardData</wd-button>
          <wd-button size="small" plain @click="handleGetClipboard">getClipboardData</wd-button>
          <wd-button size="small" plain @click="handleMakePhoneCall">拨打 10086</wd-button>
          <wd-button size="small" plain @click="handleVibrate('short')">短震动</wd-button>
          <wd-button size="small" plain @click="handleVibrate('long')">长震动</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">系统信息结果</view>
        <view class="result-box">{{ systemInfoText || '这里显示系统信息结果' }}</view>
      </view>

      <view class="panel-card">
        <view class="section-title">窗口 / 设备 / App 信息</view>
        <view class="result-box">{{ windowInfoText || '这里显示窗口信息结果' }}</view>
        <view class="result-box">{{ deviceInfoText || '这里显示设备信息结果' }}</view>
        <view class="result-box">{{ appBaseInfoText || '这里显示 App 基础信息 / 设置页结果' }}</view>
      </view>

      <view class="panel-card">
        <view class="section-title">网络信息</view>
        <view class="result-box">{{ networkInfoText || '这里显示网络信息结果' }}</view>
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
.native-input { width:100%; height:88rpx; margin-top:18rpx; padding:0 22rpx; box-sizing:border-box; border:1rpx solid var(--app-line); border-radius:18rpx; background:#f8fafc; font-size:25rpx; color:var(--app-ink); }
.action-row { display:flex; flex-wrap:wrap; gap:14rpx; margin-top:20rpx; }
.result-box { min-height:120rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; margin-top:14rpx; }
.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.empty-card { padding:22rpx; }
</style>
