<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { systemShare } from '@/utils/share'

const toast = useToast('system-share-toast')

// Configs
const shareText = ref('发现了一个高质量的跨端应用项目种子，推荐给你！')
const shareLink = ref('https://github.com/mhxy13867806343/uniapp-template-ts-vue3')

function handleSystemShare() {
  systemShare({
    title: shareText.value,
    path: shareLink.value
  })
}

function copyCodeSnippet() {
  uni.setClipboardData({
    data: `import { systemShare } from '@/utils/share'

// 唤起物理设备原生系统分享抽屉：
// 自动在 App 平台调起 iOS AirDrop/Android Intent 面板，而在其他端自动降级至 Clipboard 复制
systemShare({
  title: '${shareText.value}',
  path: '${shareLink.value}'
})`,
    success: () => {
      toast.success('调用代码段已复制')
    }
  })
}
</script>

<template>
  <PageShell title="OS 系统原生分享" description="直接调用底层智能操作系统的社交网络分享弹窗，适合 App 平台用户一键发送至第三方应用。">
    <view class="system-share-page">
      <wd-toast selector="system-share-toast" />

      <!-- 1. Compatibility Matrix -->
      <view class="compatibility-card-panel">
        <view class="panel-header font-bold text-ink">
          <text>⚙️ OS 系统分享跨端兼容矩阵</text>
        </view>
        <view class="compatibility-table-grid mt-2">
          <view class="table-row header-row">
            <text class="cell platform">目标运行平台</text>
            <text class="cell status">调用系统级原生分享</text>
          </view>
          
          <view class="table-row">
            <text class="cell platform font-bold text-ink">Android App (安卓)</text>
            <text class="cell status support">🟢 完美支持 (Intent.ACTION_SEND)</text>
          </view>

          <view class="table-row">
            <text class="cell platform font-bold text-ink">iOS App (苹果)</text>
            <text class="cell status support">🟢 完美支持 (UIActivityViewController)</text>
          </view>

          <view class="table-row">
            <text class="cell platform font-bold text-ink">微信小程序</text>
            <text class="cell status no-support">🟡 降级 (Clipboard 剪贴板复制)</text>
          </view>

          <view class="table-row">
            <text class="cell platform font-bold text-ink">移动端/桌面 H5 网页</text>
            <text class="cell status no-support">🟡 降级 (Clipboard 剪贴板复制)</text>
          </view>
        </view>
        <view class="table-legend-note mt-2">
          * 注：非 App 环境下受制于浏览器/宿主沙盒安全策略，本方法将自动把分享内容复制到系统剪贴板，并提示用户发给好友。
        </view>
      </view>

      <!-- 2. Test Center -->
      <view class="simulator-card-panel mt-3">
        <view class="panel-header font-bold text-ink mb-2">
          <text>📱 系统原生分享参数配置</text>
        </view>

        <view class="simulator-form-fields">
          <view class="form-row">
            <text class="row-label font-bold">分享文本描述</text>
            <textarea v-model="shareText" placeholder="请输入要分享的简短文本" class="custom-native-textarea mt-1" />
          </view>

          <view class="form-row mt-2">
            <text class="row-label font-bold">分享链接 (H5/App 对应链接)</text>
            <input v-model="shareLink" placeholder="例如: https://github.com/..." class="custom-native-input mt-1" />
          </view>
        </view>

        <!-- Simulated OS system tray trigger -->
        <view class="simulated-tray-trigger-box mt-3 p-3 text-center">
          <view class="tray-graphic-container flex justify-center items-center">
            <text class="tg-item">📱</text>
            <text class="tg-arrow">➡️</text>
            <text class="tg-item">💬/👥/📧</text>
          </view>
          <view class="tray-lbl mt-2 text-muted">一键将标题、描述与链接注入到手机内置的分享渠道中</view>
        </view>

        <!-- Trigger Button -->
        <view class="action-btn-row mt-3">
          <wd-button type="primary" block @click="handleSystemShare">一键唤起系统原生分享</wd-button>
        </view>
      </view>

      <!-- 3. Code snippet -->
      <view class="developer-panel mt-3">
        <view class="panel-header font-bold text-ink flex justify-between items-center mb-2">
          <text>🧑‍💻 外部开发者调用方法</text>
          <text class="copy-snippet-btn font-bold text-brand" @click="copyCodeSnippet">复制代码</text>
        </view>
        <view class="developer-code-box">
          <view class="code-line">// 导入系统级分享方法</view>
          <view class="code-line">import { systemShare } from '@/utils/share'</view>
          <view class="code-line"></view>
          <view class="code-line">// 直接触发跨端分享逻辑</view>
          <view class="code-line">systemShare({</view>
          <view class="code-line">  title: shareText,</view>
          <view class="code-line">  path: shareLink</view>
          <view class="code-line">})</view>
        </view>
      </view>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.system-share-page {
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

.simulated-tray-trigger-box {
  background: #f8fafc;
  border: 1rpx dashed var(--app-line);
  border-radius: 16rpx;
}

.tg-item {
  font-size: 48rpx;
}

.tg-arrow {
  font-size: 32rpx;
  margin: 0 16rpx;
  color: var(--app-brand);
}

.tray-lbl {
  font-size: 18rpx;
}

/* Forms */
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

/* Code Snippet */
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
