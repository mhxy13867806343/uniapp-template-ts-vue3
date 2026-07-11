<script setup lang="ts">
import { hideKeyboard, offKeyboardHeightChange, onKeyboardHeightChange, getUniErrorMessage } from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('keyboard-toast')

const inputValue = ref('')
const keyboardState = ref('等待键盘事件')
const keyboardLogs = ref<string[]>([])
const listening = ref(false)

function log(message: string) {
  keyboardLogs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  keyboardLogs.value = keyboardLogs.value.slice(0, 40)
}

const handleKeyboardChange = (result: { height: number; duration: number }) => {
  keyboardState.value = JSON.stringify(result, null, 2)
  log(`键盘高度变化: height=${result.height}, duration=${result.duration}`)
}

function startListen() {
  if (listening.value) return
  onKeyboardHeightChange(handleKeyboardChange)
  listening.value = true
  log('已开始监听键盘高度变化')
}

function stopListen() {
  offKeyboardHeightChange(handleKeyboardChange)
  listening.value = false
  log('已停止监听键盘高度变化')
}

async function handleHideKeyboard() {
  try {
    await hideKeyboard()
    toast.success('已尝试收起键盘')
    log('hideKeyboard 已触发')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`收起键盘失败: ${message}`)
  }
}

onMounted(() => {
  startListen()
})

onUnmounted(() => {
  stopListen()
})
</script>

<template>
  <PageShell title="键盘 APIs" description="统一测试 hideKeyboard 和键盘高度监听。适合自定义安全键盘、聊天输入框、底部表单吸附场景。">
    <view class="api-page">
      <wd-toast selector="keyboard-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">键盘实验室</view>
          <view class="hero-desc">点击下方输入框唤起系统键盘，就能看到键盘高度事件。页面同时支持手动隐藏键盘和监听开关控制。</view>
        </view>
        <wd-tag :type="listening ? 'success' : 'warning'" plain>{{ listening ? '监听中' : '未监听' }}</wd-tag>
      </view>

      <view class="panel-card">
        <view class="section-title">输入区</view>
        <input v-model="inputValue" class="native-input" placeholder="点我唤起键盘，观察高度变化事件" />
        <textarea v-model="inputValue" class="native-textarea" maxlength="-1" placeholder="多行输入也能触发键盘事件" />
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleHideKeyboard">hideKeyboard</wd-button>
          <wd-button size="small" plain @click="startListen">开始监听</wd-button>
          <wd-button size="small" type="warning" plain @click="stopListen">停止监听</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">最近键盘状态</view>
        <view class="result-box">{{ keyboardState }}</view>
      </view>

      <view class="panel-card">
        <view class="section-title">调用日志</view>
        <view v-if="keyboardLogs.length" class="log-list">
          <view v-for="item in keyboardLogs" :key="item" class="log-item">{{ item }}</view>
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
.result-box { min-height:140rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; }
.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.empty-card { padding:22rpx; }
</style>
