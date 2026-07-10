<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('storage-toast')

// States
const storageKey = ref('user_session')
const storageVal = ref('{"uid":8892,"role":"premium"}')
const queryKey = ref('user_session')
const queryResult = ref('')
const dbLogs = ref<string[]>([])
const storageDetails = ref({
  keys: [] as string[],
  currentSize: 0,
  limitSize: 0
})

function logCommand(command: string, success: boolean, result: string) {
  const time = new Date().toLocaleTimeString()
  dbLogs.value.unshift(`[${time}] ${success ? '🟢' : '🔴'} ${command} -> ${result}`)
  // Refresh storage info automatically
  refreshStorageInfo()
}

function handleSetStorageAsync() {
  if (!storageKey.value.trim()) {
    toast.warning('请输入 Key')
    return
  }
  uni.setStorage({
    key: storageKey.value.trim(),
    data: storageVal.value,
    success: () => {
      toast.success('异步写入成功')
      logCommand(`uni.setStorage({ key: "${storageKey.value}", data: ... })`, true, 'Success')
    },
    fail: (err) => {
      toast.error('写入失败')
      logCommand('uni.setStorage', false, err.errMsg)
    }
  })
}

function handleSetStorageSync() {
  if (!storageKey.value.trim()) {
    toast.warning('请输入 Key')
    return
  }
  try {
    uni.setStorageSync(storageKey.value.trim(), storageVal.value)
    toast.success('同步写入成功')
    logCommand(`uni.setStorageSync("${storageKey.value}", ...)`, true, 'Success')
  } catch (e: any) {
    toast.error('写入失败')
    logCommand('uni.setStorageSync', false, e.message || 'Error')
  }
}

function handleGetStorageAsync() {
  if (!queryKey.value.trim()) {
    toast.warning('请输入查询 Key')
    return
  }
  uni.getStorage({
    key: queryKey.value.trim(),
    success: (res) => {
      queryResult.value = typeof res.data === 'object' ? JSON.stringify(res.data) : String(res.data)
      toast.success('异步获取成功')
      logCommand(`uni.getStorage({ key: "${queryKey.value}" })`, true, `Data: ${queryResult.value}`)
    },
    fail: (err) => {
      queryResult.value = '(未命中或已失效)'
      toast.warning('未找到对应数据')
      logCommand(`uni.getStorage({ key: "${queryKey.value}" })`, false, err.errMsg)
    }
  })
}

function handleGetStorageSync() {
  if (!queryKey.value.trim()) {
    toast.warning('请输入查询 Key')
    return
  }
  try {
    const val = uni.getStorageSync(queryKey.value.trim())
    if (val !== undefined && val !== null && val !== '') {
      queryResult.value = typeof val === 'object' ? JSON.stringify(val) : String(val)
      toast.success('同步获取成功')
      logCommand(`uni.getStorageSync("${queryKey.value}")`, true, `Data: ${queryResult.value}`)
    } else {
      queryResult.value = '(未命中或为空)'
      toast.warning('未找到对应数据')
      logCommand(`uni.getStorageSync("${queryKey.value}")`, false, 'Empty/Not Found')
    }
  } catch (e: any) {
    queryResult.value = 'Error reading'
    logCommand(`uni.getStorageSync("${queryKey.value}")`, false, e.message || 'Error')
  }
}

function handleRemoveStorage() {
  if (!queryKey.value.trim()) {
    toast.warning('请输入要移除的 Key')
    return
  }
  try {
    uni.removeStorageSync(queryKey.value.trim())
    toast.success('移除成功')
    logCommand(`uni.removeStorageSync("${queryKey.value}")`, true, 'Removed')
  } catch (e: any) {
    logCommand('uni.removeStorageSync', false, e.message || 'Error')
  }
}

function refreshStorageInfo() {
  try {
    const info = uni.getStorageInfoSync()
    storageDetails.value = {
      keys: info.keys,
      currentSize: info.currentSize,
      limitSize: info.limitSize
    }
  } catch (e) {
    // Fail-safe async fallback
    uni.getStorageInfo({
      success: (res) => {
        storageDetails.value = {
          keys: res.keys,
          currentSize: res.currentSize,
          limitSize: res.limitSize
        }
      }
    })
  }
}

function handleClearStorage() {
  uni.showModal({
    title: '确认清空',
    content: '此操作将彻底清除该项目在当前端所占用的所有本地缓存数据，确认继续吗？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        toast.success('缓存彻底清空')
        logCommand('uni.clearStorageSync()', true, 'Cleared All')
      }
    }
  })
}

onMounted(() => {
  refreshStorageInfo()
})
</script>

<template>
  <PageShell title="本地数据缓存 APIs" description="UniApp 跨端轻量级 Key-Value 缓存，提供数据异步/同步写入、读取、局部移除以及一键清空等功能。">
    <view class="storage-api-page">
      <wd-toast selector="storage-toast" />

      <!-- 1. Current Storage details statistics -->
      <view class="statistics-card-panel flex items-center justify-between">
        <view class="stat-left">
          <view class="stat-lbl font-bold text-ink">当前缓存已用空间</view>
          <view class="stat-val font-bold text-brand mt-1">{{ storageDetails.currentSize }} KB <text class="text-muted" style="font-weight: normal; font-size: 18rpx;">/ {{ storageDetails.limitSize }} KB</text></view>
        </view>
        <view class="stat-right text-right">
          <view class="stat-lbl font-bold text-ink">已存 Key 数量</view>
          <view class="stat-val font-bold text-ink mt-1">{{ storageDetails.keys.length }} 个</view>
        </view>
      </view>

      <!-- 2. Write Storage Card -->
      <view class="api-card-panel mt-3">
        <view class="panel-header font-bold text-ink mb-2">
          <text>📥 缓存数据写入 (setStorage)</text>
        </view>
        
        <view class="form-row">
          <text class="row-label font-bold">键值名称 (Key)</text>
          <input v-model="storageKey" placeholder="例如: user_token" class="custom-native-input mt-1" />
        </view>

        <view class="form-row mt-2">
          <text class="row-label font-bold">存储值 (Value)</text>
          <input v-model="storageVal" placeholder="例如: abc123xyz" class="custom-native-input mt-1" />
        </view>

        <view class="api-actions-grid gap-2 mt-3 flex">
          <wd-button type="primary" class="flex-1" @click="handleSetStorageAsync">异步写入</wd-button>
          <wd-button type="success" class="flex-1 ml-2" @click="handleSetStorageSync">同步写入 Sync</wd-button>
        </view>
      </view>

      <!-- 3. Read & Manage Storage Card -->
      <view class="api-card-panel mt-3">
        <view class="panel-header font-bold text-ink mb-2">
          <text>🔍 缓存数据读取与删除 (get/remove/clear)</text>
        </view>

        <view class="form-row">
          <text class="row-label font-bold">目标 Key</text>
          <input v-model="queryKey" placeholder="请输入查询/删除的目标 Key" class="custom-native-input mt-1" />
        </view>

        <!-- Result Box -->
        <view class="read-result-box mt-2 p-2">
          <text class="result-lbl font-bold text-muted">查询结果：</text>
          <view class="result-body font-bold text-ink mt-1">{{ queryResult || '(尚未发起查询)' }}</view>
        </view>

        <view class="api-actions-grid gap-2 mt-3 flex-wrap">
          <wd-button type="primary" plain size="medium" @click="handleGetStorageAsync">异步读取</wd-button>
          <wd-button type="success" plain size="medium" class="ml-2" @click="handleGetStorageSync">同步读取 Sync</wd-button>
          <wd-button type="error" plain size="medium" class="ml-2" @click="handleRemoveStorage">局部移除</wd-button>
          <wd-button type="error" size="medium" class="ml-2" @click="handleClearStorage">🔥 一键清空</wd-button>
        </view>
      </view>

      <!-- 4. Storage Logger Console -->
      <view class="developer-panel mt-3">
        <view class="panel-header font-bold text-ink flex justify-between items-center mb-2">
          <text>💻 API 实时执行日志</text>
          <text class="clear-logs-btn font-bold text-brand" @click="dbLogs = []">清空日志</text>
        </view>
        <view class="developer-code-box">
          <view v-if="dbLogs.length === 0" class="code-line text-muted">// 暂无本地 API 交互日志，执行上方命令后将在此记录</view>
          <view v-for="log in dbLogs" :key="log" class="code-line">{{ log }}</view>
        </view>
      </view>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.storage-api-page {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.statistics-card-panel {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1rpx solid #fde68a;
  border-radius: 16rpx;
  padding: 32rpx;
}

.stat-lbl {
  font-size: 21rpx;
}

.stat-val {
  font-size: 38rpx;
}

.api-card-panel,
.developer-panel {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 28rpx;
}

.form-row {
  display: flex;
  flex-direction: column;
}

.custom-native-input {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  font-size: 20rpx;
  color: var(--app-ink);
}

.read-result-box {
  background: #f1f5f9;
  border-radius: 12rpx;
  min-height: 100rpx;
  box-sizing: border-box;
}

.result-lbl {
  font-size: 17rpx;
}

.result-body {
  font-size: 21rpx;
  word-break: break-all;
}

.developer-code-box {
  background: #0f172a;
  border-radius: 14rpx;
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  max-height: 300rpx;
  overflow-y: auto;
}

.code-line {
  font-family: monospace;
  font-size: 16rpx;
  color: #cbd5e1;
  white-space: pre-wrap;
  word-break: break-all;
}

.clear-logs-btn {
  font-size: 19rpx;
  cursor: pointer;
  
  &:active {
    opacity: 0.8;
  }
}

.gap-2 {
  gap: 16rpx;
}

.flex { display: flex; }
.flex-wrap { display: flex; flex-wrap: wrap; }
.flex-column { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-brand { color: var(--app-brand); }
.text-right { text-align: right; }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.p-2 { padding: 16rpx; }
</style>
