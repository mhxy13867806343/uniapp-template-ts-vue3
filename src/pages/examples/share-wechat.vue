<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { getAppMessageShare, getTimelineShare } from '@/utils/share'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

const toast = useToast('wechat-share-toast')

// Share configurations
const shareTitle = ref('快来看看这个超好用的 UniApp 极速开发模板！')
const sharePath = ref('/pages/home/index?channel=wechat_column')
const shareImgUrl = ref('https://mhxy13867806343.github.io/uniapp-template-ts-vue3/logo.png')
const shareDesc = ref('一套集成了 TS + Vue3 + Wot Design Uni 的跨端架构高保真模板，帮您快速上线业务。')

const shareConfig = computed(() => ({
  title: shareTitle.value,
  path: sharePath.value,
  imageUrl: shareImgUrl.value,
  desc: shareDesc.value
}))

// Mini Program Page Sharing Hook
onShareAppMessage(() => {
  return getAppMessageShare(shareConfig.value)
})

onShareTimeline(() => {
  return getTimelineShare(shareConfig.value)
})

// Handlers for buttons
function handleShareToFriend() {
  const action = getAppMessageShare(shareConfig.value)
  if (typeof action === 'function') {
    action()
  } else {
    // If WeChat Mini Program, tell user to use system menu
    uni.showModal({
      title: '转发指引',
      content: '请点击小程序右上角“...”面板，选择“发送给朋友”进行分享。',
      showCancel: false
    })
  }
}

function handleShareToTimeline() {
  const action = getTimelineShare(shareConfig.value)
  if (typeof action === 'function') {
    action()
  } else {
    // If WeChat Mini Program, tell user to use system menu
    uni.showModal({
      title: '转发指引',
      content: '请点击小程序右上角“...”面板，选择“分享到朋友圈”进行分享。',
      showCancel: false
    })
  }
}

// Copy dev snippet helper
function copyCodeSnippet() {
  uni.setClipboardData({
    data: `import { getAppMessageShare, getTimelineShare } from '@/utils/share'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

// 1. 小程序微信原生分享挂载：
onShareAppMessage(() => getAppMessageShare({
  title: '${shareTitle.value}',
  path: '${sharePath.value}',
  imageUrl: '${shareImgUrl.value}'
}))

onShareTimeline(() => getTimelineShare({
  title: '${shareTitle.value}',
  path: '${sharePath.value}'
}))

// 2. App / H5 微信 SDK 一键唤起分享：
// 直接在按钮点击事件中调用触发即可：
const triggerFriend = getAppMessageShare(config)
triggerFriend() // 跨端自动适配 (H5复制，App调起原生微信，小程序提示右上角)`,
    success: () => {
      toast.success('调用代码段已复制')
    }
  })
}
</script>

<template>
  <PageShell title="微信社交生态分享" description="针对微信体系深度适配，支持微信小程序卡片、朋友圈定制、App端原生微信SDK唤起及H5网页复制降级。">
    <view class="wechat-share-page">
      <wd-toast selector="wechat-share-toast" />

      <!-- 1. Platform Compatibility Chart -->
      <view class="compatibility-card-panel">
        <view class="panel-header font-bold text-ink">
          <text>📱 微信生态跨端兼容矩阵</text>
        </view>
        <view class="compatibility-table-grid mt-2">
          <view class="table-row header-row">
            <text class="cell platform">目标运行平台</text>
            <text class="cell status">微信好友分享</text>
            <text class="cell status">微信朋友圈分享</text>
          </view>
          
          <view class="table-row">
            <text class="cell platform font-bold text-ink">微信小程序</text>
            <text class="cell status support">🟢 完美支持</text>
            <text class="cell status support">🟢 完美支持</text>
          </view>

          <view class="table-row">
            <text class="cell platform font-bold text-ink">iOS / Android App</text>
            <text class="cell status support">🟢 支持 (微信SDK)</text>
            <text class="cell status support">🟢 支持 (微信SDK)</text>
          </view>

          <view class="table-row">
            <text class="cell platform font-bold text-ink">微信 H5 浏览器</text>
            <text class="cell status support">🟢 支持 (JSSDK签名)</text>
            <text class="cell status support">🟢 支持 (JSSDK签名)</text>
          </view>

          <view class="table-row">
            <text class="cell platform font-bold text-ink">普通手机 H5 网页</text>
            <text class="cell status no-support">🟡 降级 (复制链接)</text>
            <text class="cell status no-support">🟡 降级 (复制链接)</text>
          </view>
        </view>
        <view class="table-legend-note mt-2">
          * 注：非微信浏览器环境下，本组件会自动触发 `Clipboard` 剪贴板将标题与链接写入粘贴板，最大程度挽留流失用户。
        </view>
      </view>

      <!-- 2. Interactive Simulator -->
      <view class="simulator-card-panel mt-3">
        <view class="panel-header font-bold text-ink mb-2">
          <text>💬 微信分享卡片动态模拟器</text>
        </view>
        
        <!-- Live Preview of WeChat Chat Bubble -->
        <view class="wechat-preview-bubble-box p-3">
          <view class="bubble-header flex items-center">
            <view class="user-avatar-placeholder">👤</view>
            <text class="user-name-lbl ml-2">项目经理 (张工)</text>
          </view>
          <view class="wechat-msg-bubble mt-2">
            <view class="bubble-title font-bold text-ink">{{ shareTitle || '快来看看这个超好用的 UniApp 极速开发模板！' }}</view>
            <view class="bubble-body-content mt-1 flex justify-between">
              <text class="bubble-desc-text text-muted">{{ shareDesc || '一套集成了 TS + Vue3 + Wot Design Uni 的跨端架构高保真模板，帮您快速上线业务。' }}</text>
              <image :src="shareImgUrl" class="bubble-thumbnail-img ml-2" mode="aspectFill" />
            </view>
            <view class="bubble-footer-lbl mt-2 flex justify-between items-center">
              <text class="footer-app-name">💬 小程序 / 网页分享</text>
            </view>
          </view>
        </view>

        <!-- Form fields to customize -->
        <view class="simulator-form-fields mt-3">
          <view class="form-row">
            <text class="row-label font-bold">分享标题</text>
            <input v-model="shareTitle" placeholder="在此自定义分享卡片主标题" class="custom-native-input mt-1" />
          </view>

          <view class="form-row mt-2">
            <text class="row-label font-bold">分享描述</text>
            <textarea v-model="shareDesc" placeholder="在此自定义分享卡片描述" class="custom-native-textarea mt-1" />
          </view>

          <view class="form-row mt-2">
            <text class="row-label font-bold">分享跳转路径</text>
            <input v-model="sharePath" placeholder="例如: /pages/home/index" class="custom-native-input mt-1" />
          </view>
        </view>

        <!-- Try Action Buttons -->
        <view class="simulator-actions-row mt-3 flex">
          <wd-button type="primary" class="flex-1" @click="handleShareToFriend">模拟发送微信好友</wd-button>
          <wd-button type="success" class="flex-1 ml-2" @click="handleShareToTimeline">模拟分享到朋友圈</wd-button>
        </view>
      </view>

      <!-- 3. Dev Code Section -->
      <view class="developer-panel mt-3">
        <view class="panel-header font-bold text-ink flex justify-between items-center mb-2">
          <text>🧑‍💻 外部使用者调用封装</text>
          <text class="copy-snippet-btn font-bold text-brand" @click="copyCodeSnippet">复制代码</text>
        </view>
        <view class="developer-code-box">
          <view class="code-line">// 导入封装好的跨平台分享辅助方法</view>
          <view class="code-line">import { getAppMessageShare, getTimelineShare } from '@/utils/share'</view>
          <view class="code-line">import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'</view>
          <view class="code-line"></view>
          <view class="code-line">// 原生小程序钩子一键挂载</view>
          <view class="code-line">onShareAppMessage(() => getAppMessageShare(config))</view>
          <view class="code-line">onShareTimeline(() => getTimelineShare(config))</view>
        </view>
      </view>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.wechat-share-page {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.compatibility-card-panel,
.simulator-card-panel,
.developer-panel {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 28rpx;
}

.compatibility-table-grid {
  display: flex;
  flex-direction: column;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  overflow: hidden;
}

.table-row {
  display: flex;
  border-bottom: 1rpx solid var(--app-line);
  
  &:last-child {
    border-bottom: none;
  }
  
  &.header-row {
    background: #f8fafc;
    font-weight: 800;
  }
}

.cell {
  flex: 1;
  padding: 16rpx 12rpx;
  font-size: 19rpx;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.platform {
    border-right: 1rpx solid var(--app-line);
    text-align: left;
    justify-content: flex-start;
  }
}

.cell.status {
  font-size: 17rpx;
  
  &.support {
    color: #16a34a;
  }
  
  &.no-support {
    color: #d97706;
  }
}

.table-legend-note {
  font-size: 17rpx;
  color: var(--app-muted);
}

/* Chat bubble preview */
.wechat-preview-bubble-box {
  background: #ededed;
  border-radius: 16rpx;
}

.user-avatar-placeholder {
  width: 50rpx;
  height: 50rpx;
  border-radius: 8rpx;
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.user-name-lbl {
  font-size: 19rpx;
  color: #666;
}

.wechat-msg-bubble {
  background: #fff;
  border-radius: 8rpx;
  padding: 16rpx;
  width: 80%;
  box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.05);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 14rpx;
    left: -12rpx;
    border-width: 6rpx;
    border-style: solid;
    border-color: transparent #fff transparent transparent;
  }
}

.bubble-title {
  font-size: 21rpx;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.bubble-desc-text {
  font-size: 17rpx;
  color: var(--app-muted);
  line-height: 1.4;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.bubble-thumbnail-img {
  width: 90rpx;
  height: 90rpx;
  border-radius: 6rpx;
  background: #f1f5f9;
}

.bubble-footer-lbl {
  border-top: 1rpx solid #f1f5f9;
  padding-top: 10rpx;
}

.footer-app-name {
  font-size: 14rpx;
  color: #999;
}

/* Custom fields input */
.custom-native-input {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  font-size: 20rpx;
  color: var(--app-ink);
}

.custom-native-textarea {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  font-size: 20rpx;
  color: var(--app-ink);
  height: 120rpx;
  width: 100%;
  box-sizing: border-box;
}

/* Developer panel styles */
.developer-code-box {
  background: #0f172a;
  border-radius: 14rpx;
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.code-line {
  font-family: monospace;
  font-size: 16rpx;
  color: #cbd5e1;
  white-space: pre-wrap;
  word-break: break-all;
}

.copy-snippet-btn {
  font-size: 19rpx;
  cursor: pointer;
  
  &:active {
    opacity: 0.8;
  }
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-brand { color: var(--app-brand); }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.p-3 { padding: 24rpx; }
</style>
