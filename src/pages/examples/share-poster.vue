<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('share-toast')

// States
const showShareSheet = ref(false)
const showPosterModal = ref(false)
const generatingPoster = ref(false)

// Content to share
const shareContent = {
  title: 'Uni-App + TS + Vue3 移动端极速开发模板',
  description: '一套开箱即用的前端跨端架构方案，支持 H5、微信小程序和 APP 等。',
  price: '¥ 0.00',
  author: 'Antigravity Team',
  cover: '🚀'
}

// Share channels
const shareChannels = [
  { name: '微信好友', icon: 'chat', color: '#22c55e' },
  { name: '微信朋友圈', icon: 'time-out', color: '#10b981' },
  { name: '新浪微博', icon: 'share', color: '#ef4444' },
  { name: '复制链接', icon: 'file-paste', color: '#3b82f6' },
  { name: '生成卡片海报', icon: 'picture', color: '#a855f7' }
]

function openShare() {
  showShareSheet.value = true
}

function handleChannelClick(channelName: string) {
  showShareSheet.value = false
  
  if (channelName === '复制链接') {
    uni.setClipboardData({
      data: 'https://github.com/mhxy13867806343/uniapp-template-ts-vue3',
      success: () => {
        toast.success('链接已复制到剪贴板')
      }
    })
  } else if (channelName === '生成卡片海报') {
    triggerPosterGeneration()
  } else {
    toast.success(`已成功呼起并分享至：${channelName}`)
  }
}

function triggerPosterGeneration() {
  showPosterModal.value = true
  generatingPoster.value = true
  
  // Mock network rendering of poster image
  setTimeout(() => {
    generatingPoster.value = false
    toast.success('海报生成成功')
  }, 1500)
}

function savePoster() {
  toast.loading('正在保存图片到相册...')
  setTimeout(() => {
    toast.success('已保存到相册 (Mock)')
  }, 1000)
}

function sharePosterDirectly() {
  toast.success('已发送给好友')
  showPosterModal.value = false
}
</script>

<template>
  <PageShell title="分享海报与面板" description="底部弹出社交分享渠道，配合卡片渲染技术一键生成可保存的推广海报。">
    <view class="share-poster-page">
      <wd-toast selector="share-toast" />

      <!-- Page Content: Card to share -->
      <view class="main-card">
        <view class="card-badge">HOT</view>
        <view class="card-cover-art">
          <text class="art-emoji">{{ shareContent.cover }}</text>
          <view class="art-glow"></view>
        </view>
        <view class="card-body">
          <view class="card-title">{{ shareContent.title }}</view>
          <view class="card-desc">{{ shareContent.description }}</view>
          
          <view class="card-meta">
            <view class="price-box">
              <text class="price-val">{{ shareContent.price }}</text>
              <text class="price-tag">开源免费</text>
            </view>
            <view class="author-info">BY: {{ shareContent.author }}</view>
          </view>
        </view>

        <view class="card-actions">
          <wd-button type="primary" block size="large" @click="openShare">
            <view class="share-btn-content">
              <wd-icon name="share" size="20px" />
              <text class="ml-2 font-bold">分享给好友</text>
            </view>
          </wd-button>
        </view>
      </view>

      <!-- Bottom Sheet: Share Channels -->
      <wd-popup
        v-model="showShareSheet"
        position="bottom"
        safe-area-inset-bottom
        root-portal
        custom-class="share-sheet-popup"
        :z-index="1200"
      >
        <view class="share-sheet-container">
          <view class="sheet-header">
            <text class="sheet-title">分享至</text>
          </view>

          <view class="channels-grid">
            <view
              v-for="channel in shareChannels"
              :key="channel.name"
              class="channel-item"
              @click="handleChannelClick(channel.name)"
            >
              <view class="icon-circle" :style="{ backgroundColor: channel.color + '15', color: channel.color }">
                <wd-icon :name="channel.icon" size="28px" />
              </view>
              <text class="channel-name">{{ channel.name }}</text>
            </view>
          </view>

          <view class="sheet-cancel" @click="showShareSheet = false">取消</view>
        </view>
      </wd-popup>

      <!-- Center Modal: Poster Generation Preview -->
      <wd-popup
        v-model="showPosterModal"
        position="center"
        root-portal
        custom-class="poster-popup-modal"
        :z-index="1200"
      >
        <view class="poster-container">
          <!-- Close button -->
          <wd-icon name="close" size="20px" class="poster-close-btn" @click="showPosterModal = false" />

          <!-- Poster Loader -->
          <view v-if="generatingPoster" class="poster-loader">
            <wd-loading size="40px" />
            <view class="loader-text">海报正在生成中...</view>
            <view class="loader-sub">正在绘制二维码与画板元素</view>
          </view>

          <!-- Poster Complete View -->
          <view v-else class="poster-content">
            <view class="poster-header">
              <view class="poster-brand-logo">🍀 AGY TEMPLATE</view>
              <view class="poster-date">2026.07.07</view>
            </view>

            <view class="poster-graphic">
              <text class="graphic-emoji">💻</text>
              <view class="graphic-glow"></view>
            </view>

            <view class="poster-info">
              <view class="poster-title">{{ shareContent.title }}</view>
              <view class="poster-desc">{{ shareContent.description }}</view>
            </view>

            <view class="poster-divider"></view>

            <view class="poster-footer">
              <view class="footer-left">
                <view class="footer-hint">长按识别小程序码查看</view>
                <view class="footer-sub">源自 Github 热门开源模版</view>
              </view>
              <!-- Mock QR Code -->
              <view class="mock-qr-code">
                <view class="qr-dot-grid">
                  <view class="qr-square top-left"></view>
                  <view class="qr-square top-right"></view>
                  <view class="qr-square bottom-left"></view>
                  <view class="qr-center-dot"></view>
                </view>
              </view>
            </view>
          </view>

          <!-- Action Buttons (Only display after generation) -->
          <view v-if="!generatingPoster" class="poster-actions">
            <wd-button plain type="neutral" block size="medium" @click="sharePosterDirectly">发送给微信好友</wd-button>
            <wd-button type="primary" block size="medium" @click="savePoster" class="ml-2">保存海报到相册</wd-button>
          </view>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.share-poster-page {
  display: grid;
  gap: 24rpx;
}

.main-card {
  border: 1rpx solid var(--app-line);
  border-radius: 24rpx;
  background: #fff;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.03);
}

.card-badge {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  background: #ef4444;
  color: #fff;
  font-size: 22rpx;
  font-weight: 900;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  z-index: 10;
}

.card-cover-art {
  height: 380rpx;
  background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.art-emoji {
  font-size: 150rpx;
  z-index: 2;
  animation: bounce 3s infinite ease-in-out;
}

.art-glow {
  position: absolute;
  width: 250rpx;
  height: 250rpx;
  background: rgba(255, 255, 255, 0.2);
  filter: blur(60rpx);
  border-radius: 50%;
  top: 50rpx;
  left: 50rpx;
  z-index: 1;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15rpx); }
}

.card-body {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.card-title {
  font-size: 34rpx;
  font-weight: 900;
  color: var(--app-ink);
  line-height: 1.4;
}

.card-desc {
  font-size: 26rpx;
  color: var(--app-muted);
  line-height: 1.6;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10rpx;
  border-top: 1rpx solid var(--app-line);
  padding-top: 24rpx;
}

.price-box {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.price-val {
  font-size: 38rpx;
  font-weight: 900;
  color: #1e88e5;
}

.price-tag {
  font-size: 22rpx;
  background: #eff6ff;
  color: #1e88e5;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
  font-weight: 700;
}

.author-info {
  font-size: 24rpx;
  color: var(--app-muted);
  font-weight: 700;
}

.card-actions {
  padding: 0 32rpx 32rpx;
}

.share-btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ml-2 {
  margin-left: 12rpx;
}

.ml-1 {
  margin-left: 8rpx;
}

.font-bold {
  font-weight: 800;
}

/* Bottom Sheet Share Style */
:deep(.share-sheet-popup) {
  border-radius: 32rpx 32rpx 0 0;
  background: #fff;
  overflow: hidden;
}

.share-sheet-container {
  padding: 36rpx 36rpx calc(36rpx + env(safe-area-inset-bottom));
}

.sheet-header {
  text-align: center;
  margin-bottom: 36rpx;
}

.sheet-title {
  font-size: 30rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10rpx;
  margin-bottom: 30rpx;
}

.channel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.icon-circle {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.9);
  }
}

.channel-name {
  font-size: 22rpx;
  color: var(--app-muted);
  font-weight: 700;
  text-align: center;
}

.sheet-cancel {
  border-top: 1rpx solid var(--app-line);
  padding: 24rpx 0 10rpx;
  text-align: center;
  font-size: 28rpx;
  color: var(--app-ink);
  font-weight: 800;
}

/* Center Modal Poster Style */
:deep(.poster-popup-modal) {
  background: transparent;
  width: auto;
}

.poster-container {
  width: 600rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 40rpx;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.poster-close-btn {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  color: var(--app-muted);
  z-index: 10;
}

.poster-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 600rpx;
  gap: 20rpx;
}

.loader-text {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.loader-sub {
  font-size: 22rpx;
  color: var(--app-muted);
}

.poster-content {
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fdfdfd;
}

.poster-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #f8fafc;
  border-bottom: 1rpx solid var(--app-line);
}

.poster-brand-logo {
  font-size: 22rpx;
  font-weight: 900;
  color: #1e88e5;
}

.poster-date {
  font-size: 20rpx;
  color: var(--app-muted);
}

.poster-graphic {
  height: 280rpx;
  background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.graphic-emoji {
  font-size: 110rpx;
  z-index: 2;
}

.graphic-glow {
  position: absolute;
  width: 150rpx;
  height: 150rpx;
  background: rgba(255, 255, 255, 0.25);
  filter: blur(40rpx);
  border-radius: 50%;
}

.poster-info {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.poster-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.poster-desc {
  font-size: 22rpx;
  color: var(--app-muted);
  line-height: 1.5;
}

.poster-divider {
  border-top: 1rpx dashed var(--app-line);
  margin: 0 24rpx;
}

.poster-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background: #f8fafc;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.footer-hint {
  font-size: 22rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.footer-sub {
  font-size: 18rpx;
  color: var(--app-muted);
}

.mock-qr-code {
  width: 90rpx;
  height: 90rpx;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 8rpx;
  padding: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-dot-grid {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f1f5f9;
  border-radius: 4rpx;
}

.qr-square {
  width: 24rpx;
  height: 24rpx;
  border: 4rpx solid #334155;
  box-sizing: border-box;
  position: absolute;
}

.top-left { top: 0; left: 0; }
.top-right { top: 0; right: 0; }
.bottom-left { bottom: 0; left: 0; }

.qr-center-dot {
  width: 10rpx;
  height: 10rpx;
  background: #334155;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.poster-actions {
  display: flex;
  gap: 16rpx;
}
</style>
