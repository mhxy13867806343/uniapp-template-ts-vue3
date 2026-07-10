<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { saveImageToAlbum } from '@/utils/share'

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
const shareChannels = ref([
  { id: '1', name: '微信好友', icon: 'chat', color: '#22c55e', toast: '已成功分享给微信好友' },
  { id: '2', name: '微信朋友圈', icon: 'time-out', color: '#10b981', toast: '已成功分享到微信朋友圈' },
  { id: '3', name: '新浪微博', icon: 'share', color: '#ef4444', toast: '已成功分享到新浪微博' },
  { id: '4', name: '复制链接', icon: 'file-paste', color: '#3b82f6', toast: '链接已复制到剪贴板' },
  { id: '5', name: '生成卡片海报', icon: 'picture', color: '#a855f7', toast: '正在为您生成卡片海报...' }
])

const newChannelForm = reactive({
  name: '',
  icon: 'star',
  color: '#fbbf24',
  toast: '触发自定义分享操作'
})

const presetIcons = ['star', 'share', 'chat', 'time-out', 'picture', 'file-paste', 'download', 'heart', 'flag', 'mail']
const presetColors = ['#fbbf24', '#22c55e', '#10b981', '#3b82f6', '#a855f7', '#ef4444', '#ec4899', '#6366f1']

function addCustomChannel() {
  if (!newChannelForm.name.trim()) {
    toast.warning('请输入渠道名称')
    return
  }
  
  shareChannels.value.push({
    id: `custom_${Date.now()}`,
    name: newChannelForm.name.trim(),
    icon: newChannelForm.icon,
    color: newChannelForm.color,
    toast: newChannelForm.toast.trim() || '触发分享'
  })
  
  toast.success(`成功添加分享渠道 [${newChannelForm.name}]`)
  newChannelForm.name = '' // Reset
}

function deleteChannel(id: string) {
  const index = shareChannels.value.findIndex(c => c.id === id)
  if (index !== -1) {
    const name = shareChannels.value[index].name
    shareChannels.value.splice(index, 1)
    toast.success(`已删除分享渠道 [${name}]`)
  }
}

function openShare() {
  showShareSheet.value = true
}

function handleChannelClick(channel: any) {
  showShareSheet.value = false
  
  if (channel.name === '复制链接') {
    uni.setClipboardData({
      data: 'https://github.com/mhxy13867806343/uniapp-template-ts-vue3',
      success: () => {
        toast.success(channel.toast || '链接已复制到剪贴板')
      }
    })
  } else if (channel.name === '生成卡片海报') {
    triggerPosterGeneration()
  } else {
    toast.success(channel.toast || `已成功呼起并分享至：${channel.name}`)
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
  toast.loading('准备保存图片...')
  setTimeout(() => {
    saveImageToAlbum('https://mhxy13867806343.github.io/uniapp-template-ts-vue3/logo.png')
  }, 500)
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

      <!-- 1. Platform Compatibility Chart -->
      <view class="compatibility-card-panel mt-3">
        <view class="panel-header font-bold text-ink">
          <text>🖼️ 海报生成与下载跨端兼容矩阵</text>
        </view>
        <view class="compatibility-table-grid mt-2">
          <view class="table-row header-row">
            <text class="cell platform">目标运行平台</text>
            <text class="cell status">海报卡片保存/下载方式</text>
          </view>
          
          <view class="table-row">
            <text class="cell platform font-bold text-ink">微信小程序</text>
            <text class="cell status support">🟢 完美支持 (授权直接写入系统相册)</text>
          </view>

          <view class="table-row">
            <text class="cell platform font-bold text-ink">iOS / Android App</text>
            <text class="cell status support">🟢 完美支持 (授权直接写入系统相册)</text>
          </view>

          <view class="table-row">
            <text class="cell platform font-bold text-ink">移动端/桌面 H5 网页</text>
            <text class="cell status support">🟢 支持 (长按保存 / 自动触发 Blob 文件下载)</text>
          </view>
        </view>
      </view>

      <!-- 2. Developer Code Section -->
      <view class="developer-panel mt-3">
        <view class="panel-header font-bold text-ink flex justify-between items-center mb-2">
          <text>🧑‍💻 外部开发者调用方法</text>
        </view>
        <view class="developer-code-box">
          <view class="code-line">// 导入保存到相册跨端封装方法</view>
          <view class="code-line">import { saveImageToAlbum } from '@/utils/share'</view>
          <view class="code-line"></view>
          <view class="code-line">// 一键保存离屏 Canvas 生成的临时海报图片路径</view>
          <view class="code-line">saveImageToAlbum(tempFilePath)</view>
        </view>
      </view>

      <!-- 3. Channel Manager Panel -->
      <view class="compatibility-card-panel mt-3">
        <view class="panel-header font-bold text-ink mb-2">
          <text>🛠️ 自定义分享渠道管理面板</text>
        </view>
        <view class="share-desc-info text-muted">
          您可以在下方实时添加、删除底部的分享动作渠道。修改后的渠道会立即在底部“分享给好友”弹窗中生效：
        </view>

        <!-- Current Channel Manager List -->
        <view class="current-channels-editor mt-3">
          <view class="editor-title font-bold text-ink">当前生效渠道：</view>
          <view class="editor-channels-list mt-2">
            <view
              v-for="channel in shareChannels"
              :key="channel.id"
              class="editor-channel-row flex justify-between items-center p-2 mb-2"
            >
              <view class="flex items-center">
                <view class="editor-channel-circle flex items-center justify-center" :style="{ backgroundColor: channel.color + '15', color: channel.color }">
                  <wd-icon :name="channel.icon" size="20px" />
                </view>
                <view class="editor-channel-meta ml-2">
                  <text class="font-bold text-ink" style="font-size: 20rpx;">{{ channel.name }}</text>
                  <text class="text-muted" style="font-size: 16rpx;">点击提示：{{ channel.toast }}</text>
                </view>
              </view>
              <wd-button size="small" type="error" plain @click="deleteChannel(channel.id)">删除</wd-button>
            </view>
          </view>
        </view>

        <view class="editor-divider my-3"></view>

        <!-- Add Channel Form -->
        <view class="add-channel-editor-form">
          <view class="editor-title font-bold text-ink mb-2">➕ 新增自定义渠道：</view>
          
          <view class="form-row">
            <text class="row-label font-bold">渠道显示名称</text>
            <input v-model="newChannelForm.name" placeholder="请输入渠道名称，如：QQ好友" class="custom-native-input mt-1" />
          </view>

          <view class="form-row mt-2">
            <text class="row-label font-bold">点击操作提示文案</text>
            <input v-model="newChannelForm.toast" placeholder="请输入点击后的 Toast 提示" class="custom-native-input mt-1" />
          </view>

          <view class="form-row mt-2">
            <text class="row-label font-bold">选择图标（Wot Design 内置图标）</text>
            <view class="preset-items-picker mt-1 flex">
              <view
                v-for="icon in presetIcons"
                :key="icon"
                :class="['preset-icon-cell flex items-center justify-center', { active: newChannelForm.icon === icon }]"
                @click="newChannelForm.icon = icon"
              >
                <wd-icon :name="icon" size="18px" />
              </view>
            </view>
          </view>

          <view class="form-row mt-2">
            <text class="row-label font-bold">选择渠道主题色</text>
            <view class="preset-items-picker mt-1 flex">
              <view
                v-for="col in presetColors"
                :key="col"
                :class="['preset-color-cell', { active: newChannelForm.color === col }]"
                :style="{ backgroundColor: col }"
                @click="newChannelForm.color = col"
              ></view>
            </view>
          </view>

          <view class="add-action-btn mt-3">
            <wd-button type="warning" block @click="addCustomChannel">添加该渠道至分享面板</wd-button>
          </view>
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
              :key="channel.id"
              class="channel-item"
              @click="handleChannelClick(channel)"
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

:deep(.share-sheet-popup),
:deep(.poster-popup-modal) {
  background: transparent;
  width: auto;
}

.compatibility-card-panel,
.developer-panel {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 28rpx;
  text-align: left;
}

/* Custom channel list editor styles */
.editor-channels-list {
  display: flex;
  flex-direction: column;
}

.editor-channel-row {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #f8fafc;
}

.editor-channel-circle {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
}

.editor-channel-meta {
  display: flex;
  flex-direction: column;
}

.editor-divider {
  border-top: 1rpx dashed var(--app-line);
}

.preset-items-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.preset-icon-cell {
  width: 54rpx;
  height: 54rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &.active {
    border-color: var(--app-brand);
    color: var(--app-brand);
    background: #fffbeb;
  }
}

.preset-color-cell {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  cursor: pointer;
  border: 4rpx solid transparent;
  transition: all 0.2s ease;
  
  &.active {
    border-color: #000;
    transform: scale(1.1);
  }
}

.my-3 {
  margin-top: 24rpx;
  margin-bottom: 24rpx;
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
  color: #16a34a;
}

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
