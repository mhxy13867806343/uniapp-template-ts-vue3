<script setup lang="ts">
import { chooseLocation, getLocation, getUniErrorMessage, openLocation, startLocationUpdate, stopLocationUpdate } from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('location-toast')

const currentLocation = ref('')
const chosenLocation = ref('')
const logs = ref<string[]>([])
const updating = ref(false)

const demoLocation = reactive({
  latitude: 31.2304,
  longitude: 121.4737,
  name: '上海市人民广场',
  address: '上海市黄浦区人民大道'
})

function log(message: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  logs.value = logs.value.slice(0, 40)
}

async function handleGetLocation() {
  try {
    const result = await getLocation({
      type: 'gcj02'
    })
    currentLocation.value = JSON.stringify(result, null, 2)
    log('getLocation 成功')
    toast.success('已获取当前位置')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`获取定位失败: ${message}`)
  }
}

async function handleChooseLocation() {
  try {
    const result = await chooseLocation()
    chosenLocation.value = JSON.stringify(result, null, 2)
    log('chooseLocation 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`选择位置失败: ${message}`)
  }
}

async function handleOpenLocation() {
  try {
    await openLocation({ ...demoLocation })
    log('openLocation 已触发')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`打开地图失败: ${message}`)
  }
}

async function handleStartUpdate() {
  try {
    await startLocationUpdate()
    updating.value = true
    log('startLocationUpdate 成功')
    toast.success('已开始持续定位')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`持续定位启动失败: ${message}`)
  }
}

async function handleStopUpdate() {
  try {
    await stopLocationUpdate()
    updating.value = false
    log('stopLocationUpdate 成功')
    toast.success('已停止持续定位')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`持续定位停止失败: ${message}`)
  }
}
</script>

<template>
  <PageShell title="位置 APIs" description="统一测试当前位置、地图选点、打开地图和持续定位。适合签到打卡、门店导航、骑手定位、配送轨迹等场景。">
    <view class="api-page">
      <wd-toast selector="location-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">位置实验室</view>
          <view class="hero-desc">这里把 `getLocation / chooseLocation / openLocation / startLocationUpdate / stopLocationUpdate` 放在一起测试。真机环境更适合直接联调。</view>
        </view>
        <wd-tag :type="updating ? 'warning' : 'primary'" plain>{{ updating ? '持续定位中' : '空闲' }}</wd-tag>
      </view>

      <view class="panel-card">
        <view class="section-title">位置操作</view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleGetLocation">getLocation</wd-button>
          <wd-button size="small" plain @click="handleChooseLocation">chooseLocation</wd-button>
          <wd-button size="small" plain @click="handleOpenLocation">openLocation</wd-button>
          <wd-button size="small" type="success" plain @click="handleStartUpdate">startUpdate</wd-button>
          <wd-button size="small" type="warning" plain @click="handleStopUpdate">stopUpdate</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">当前位置</view>
        <view class="result-box">{{ currentLocation || '还没有当前位置结果。' }}</view>
      </view>

      <view class="panel-card">
        <view class="section-title">地图选点结果</view>
        <view class="result-box">{{ chosenLocation || '还没有地图选点结果。' }}</view>
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
.action-row { display:flex; flex-wrap:wrap; gap:14rpx; margin-top:18rpx; }
.result-box { min-height:160rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; }
.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.empty-card { padding:22rpx; }
</style>
