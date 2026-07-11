<script setup lang="ts">
import {
  getBluetoothAdapterState,
  getBluetoothDevices,
  getUniErrorMessage,
  openBluetoothAdapter,
  startBluetoothDevicesDiscovery,
  stopBluetoothDevicesDiscovery
} from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('bluetooth-toast')

const devices = ref<Array<Record<string, any>>>([])
const adapterState = ref('')
const logs = ref<string[]>([])
const discovering = ref(false)

function log(message: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  logs.value = logs.value.slice(0, 40)
}

async function handleOpenAdapter() {
  try {
    await openBluetoothAdapter()
    toast.success('蓝牙适配器已打开')
    log('openBluetoothAdapter 成功')
    await handleGetAdapterState()
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`打开蓝牙失败: ${message}`)
  }
}

async function handleGetAdapterState() {
  try {
    const result = await getBluetoothAdapterState()
    adapterState.value = JSON.stringify(result, null, 2)
    log('getBluetoothAdapterState 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`读取蓝牙状态失败: ${message}`)
  }
}

async function handleStartDiscovery() {
  try {
    await startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false
    })
    discovering.value = true
    toast.success('开始扫描附近蓝牙设备')
    log('startBluetoothDevicesDiscovery 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`开始扫描失败: ${message}`)
  }
}

async function handleStopDiscovery() {
  try {
    await stopBluetoothDevicesDiscovery()
    discovering.value = false
    toast.success('已停止扫描')
    log('stopBluetoothDevicesDiscovery 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`停止扫描失败: ${message}`)
  }
}

async function handleGetDevices() {
  try {
    const result = await getBluetoothDevices()
    devices.value = result.devices || []
    log(`getBluetoothDevices 成功，共 ${devices.value.length} 台`)
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`读取设备列表失败: ${message}`)
  }
}
</script>

<template>
  <PageShell title="蓝牙 APIs" description="统一测试蓝牙适配器、设备扫描和设备列表读取。适合后面继续扩展 BLE 连接、服务读取和特征值订阅。">
    <view class="api-page">
      <wd-toast selector="bluetooth-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">蓝牙调试台</view>
          <view class="hero-desc">这里先做蓝牙基础能力测试：打开适配器、查看状态、开始扫描、停止扫描、读取设备列表。BLE 连接类接口已经在统一封装里可继续往下接。</view>
        </view>
        <wd-tag :type="discovering ? 'warning' : 'primary'" plain>{{ discovering ? '扫描中' : '空闲' }}</wd-tag>
      </view>

      <view class="panel-card">
        <view class="section-title">基础操作</view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleOpenAdapter">打开蓝牙</wd-button>
          <wd-button size="small" plain @click="handleGetAdapterState">读取状态</wd-button>
          <wd-button size="small" type="success" plain @click="handleStartDiscovery">开始扫描</wd-button>
          <wd-button size="small" type="warning" plain @click="handleStopDiscovery">停止扫描</wd-button>
          <wd-button size="small" plain @click="handleGetDevices">设备列表</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">适配器状态</view>
        <view class="result-box">{{ adapterState || '点击“读取状态”后会显示蓝牙适配器状态' }}</view>
      </view>

      <view class="panel-card">
        <view class="section-title">扫描到的设备</view>
        <view v-if="devices.length" class="device-list">
          <view v-for="(item, index) in devices" :key="index" class="device-card">
            <view class="device-name">{{ item.name || item.localName || '未命名设备' }}</view>
            <view class="device-meta">deviceId: {{ item.deviceId || '-' }}</view>
            <view class="device-meta">RSSI: {{ item.RSSI ?? '-' }}</view>
          </view>
        </view>
        <view v-else class="empty-card">当前还没有设备数据。很多平台要求先打开系统蓝牙和定位权限。</view>
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
.hero-card,.panel-card,.device-card,.empty-card { background:#fff; border:1rpx solid var(--app-line); border-radius:24rpx; }
.hero-card,.panel-card { padding:28rpx; }
.hero-card { display:flex; justify-content:space-between; gap:20rpx; }
.hero-title,.section-title,.device-name { color:var(--app-ink); font-weight:800; }
.hero-title { font-size:38rpx; }
.section-title { font-size:30rpx; }
.hero-desc,.device-meta,.log-item,.result-box,.empty-card { margin-top:12rpx; color:var(--app-muted); font-size:25rpx; line-height:1.7; white-space:pre-wrap; word-break:break-all; }
.action-row { display:flex; flex-wrap:wrap; gap:14rpx; margin-top:18rpx; }
.device-list,.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.device-card { padding:22rpx; }
.result-box { min-height:140rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; }
.empty-card { padding:22rpx; }
</style>
