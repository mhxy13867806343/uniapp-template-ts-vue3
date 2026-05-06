<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type PlatformKey = 'app' | 'mini' | 'h5' | 'harmony'

interface PlatformUpdate {
  key: PlatformKey
  label: string
  title: string
  version: string
  status: string
  strategy: string
  percent: number
  color: string
  packageName: string
  size: string
  publish: string
  checks: string[]
  steps: string[]
  risks: string[]
}

const toast = useToast('app-update-toast')
const activePlatform = ref<PlatformKey>('app')
const forceUpdate = ref(true)
const grayRelease = ref(true)
const silentDownload = ref(false)

const platforms: PlatformUpdate[] = [
  {
    key: 'app',
    label: 'App',
    title: 'App 原生包更新',
    version: '2.6.0',
    status: '强更待确认',
    strategy: '整包 + wgt 热更新',
    percent: 72,
    color: '#1e88e5',
    packageName: 'uni-template-app-2.6.0.apk',
    size: '86.4 MB',
    publish: '应用商店 + 站内下载',
    checks: ['版本号大于本地版本', '最低兼容版本 2.4.0', '弱网下断点续传', '安装包 MD5 校验'],
    steps: ['检测线上版本', '展示更新弹窗', '后台下载新包', '安装或跳转商店'],
    risks: ['强更需要保留取消策略', 'Android 安装权限要提前引导', 'iOS 只能跳转 App Store']
  },
  {
    key: 'mini',
    label: '小程序',
    title: '小程序版本更新',
    version: '1.8.3',
    status: '灰度发布中',
    strategy: '平台审核 + UpdateManager',
    percent: 48,
    color: '#12b76a',
    packageName: 'mp-weixin release 1.8.3',
    size: '主包 1.7 MB',
    publish: '微信/支付宝/抖音后台',
    checks: ['调用 getUpdateManager', '监听 updateReady', '提示用户重启', '灰度用户命中校验'],
    steps: ['上传审核包', '配置体验版', '灰度发布', '提示重启应用'],
    risks: ['不同小程序平台 API 有差异', '分包大小要持续检查', '审核失败要保留上一版']
  },
  {
    key: 'h5',
    label: 'H5',
    title: 'H5 静态资源更新',
    version: '2026.05.06',
    status: '可回滚',
    strategy: 'CDN 增量发布',
    percent: 88,
    color: '#f97316',
    packageName: 'dist/build/h5',
    size: '12.8 MB',
    publish: 'CDN + 前端网页托管',
    checks: ['index.html 禁用长缓存', '静态资源带 hash', '接口版本兼容', '灰度域名冒烟'],
    steps: ['构建 H5 产物', '上传 CDN', '刷新入口缓存', '监控错误率'],
    risks: ['入口缓存未刷新会读旧资源', '接口字段变更需要兼容', '回滚要保留上一个版本目录']
  },
  {
    key: 'harmony',
    label: '鸿蒙',
    title: '鸿蒙 App 更新',
    version: '1.2.0',
    status: '待上架审核',
    strategy: 'AppGallery Connect 发布',
    percent: 36,
    color: '#7c3aed',
    packageName: 'uni-template-harmony-1.2.0.app',
    size: '64.1 MB',
    publish: '华为应用市场',
    checks: ['签名证书有效', '目标 API 兼容', '隐私权限描述完整', '多设备尺寸检查'],
    steps: ['生成鸿蒙安装包', '提交审核资料', '配置阶段发布', '监控安装反馈'],
    risks: ['证书和包名必须一致', '权限文案需要匹配实际能力', '阶段发布需要观察崩溃率']
  }
]

const activeData = computed(() => platforms.find((item) => item.key === activePlatform.value) || platforms[0])

function switchPlatform(key: PlatformKey) {
  activePlatform.value = key
}

function simulateUpdate() {
  const mode = forceUpdate.value ? '强制更新' : '普通提醒'
  toast.success(`${activeData.value.label} 已生成${mode}方案`)
}
</script>

<template>
  <PageShell title="应用更新" description="按 App、小程序、H5、鸿蒙四类端展示版本检测、灰度发布、强更和回滚策略。">
    <view class="update-page">
      <wd-toast selector="app-update-toast" />

      <view class="platform-tabs">
        <view
          v-for="item in platforms"
          :key="item.key"
          :class="['platform-tab', { active: activePlatform === item.key }]"
          @click="switchPlatform(item.key)"
        >
          {{ item.label }}
        </view>
      </view>

      <view class="status-card" :style="{ '--platform-color': activeData.color }">
        <view class="status-head">
          <view>
            <view class="status-title">{{ activeData.title }}</view>
            <view class="status-desc">{{ activeData.strategy }}</view>
          </view>
          <wd-tag type="primary" plain>{{ activeData.status }}</wd-tag>
        </view>

        <view class="version-row">
          <view>
            <text>目标版本</text>
            <view>{{ activeData.version }}</view>
          </view>
          <view>
            <text>发布渠道</text>
            <view>{{ activeData.publish }}</view>
          </view>
        </view>

        <view class="progress-box">
          <view class="progress-head">
            <text>发布进度</text>
            <text>{{ activeData.percent }}%</text>
          </view>
          <wd-progress :percentage="activeData.percent" :color="activeData.color" />
        </view>
      </view>

      <view class="config-card">
        <view class="card-title">更新配置</view>
        <view class="switch-list">
          <view class="switch-row">
            <view>
              <view class="switch-title">强制更新</view>
              <view class="switch-desc">低版本用户必须更新后才能继续使用</view>
            </view>
            <wd-switch v-model="forceUpdate" />
          </view>
          <view class="switch-row">
            <view>
              <view class="switch-title">灰度发布</view>
              <view class="switch-desc">先命中部分用户，再逐步扩大比例</view>
            </view>
            <wd-switch v-model="grayRelease" />
          </view>
          <view class="switch-row">
            <view>
              <view class="switch-title">静默下载</view>
              <view class="switch-desc">适合 App 热更新包或资源预加载</view>
            </view>
            <wd-switch v-model="silentDownload" />
          </view>
        </view>
      </view>

      <view class="package-card">
        <view class="card-title">更新包信息</view>
        <view class="package-row">
          <wd-icon name="file" size="24px" custom-class="package-icon" />
          <view class="min-w-0 flex-1">
            <view class="package-name">{{ activeData.packageName }}</view>
            <view class="package-meta">{{ activeData.size }} · {{ activeData.publish }}</view>
          </view>
        </view>
      </view>

      <view class="grid-section">
        <view class="info-card">
          <view class="card-title">检测项</view>
          <view class="check-list">
            <view v-for="item in activeData.checks" :key="item" class="check-item">
              <wd-icon name="check" size="16px" custom-class="check-icon" />
              <text>{{ item }}</text>
            </view>
          </view>
        </view>

        <view class="info-card">
          <view class="card-title">更新流程</view>
          <view class="step-list">
            <view v-for="(item, index) in activeData.steps" :key="item" class="step-item">
              <view class="step-index">{{ index + 1 }}</view>
              <text>{{ item }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="risk-card">
        <view class="card-title">注意事项</view>
        <view class="risk-list">
          <view v-for="item in activeData.risks" :key="item" class="risk-item">{{ item }}</view>
        </view>
      </view>

      <view class="preview-card">
        <view class="preview-head">
          <view>
            <view class="card-title">用户弹窗预览</view>
            <view class="preview-desc">更新应用时可以直接套这个结构做弹窗内容。</view>
          </view>
          <wd-tag :type="forceUpdate ? 'danger' : 'primary'" plain>{{ forceUpdate ? '强更' : '可跳过' }}</wd-tag>
        </view>
        <view class="update-modal">
          <view class="modal-version">{{ activeData.label }} {{ activeData.version }}</view>
          <view class="modal-title">发现新版本</view>
          <view class="modal-desc">{{ activeData.strategy }}，本次更新将提升多端稳定性和页面加载速度。</view>
          <view class="modal-actions">
            <wd-button v-if="!forceUpdate" plain>稍后再说</wd-button>
            <wd-button type="primary" @click="simulateUpdate">立即更新</wd-button>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.update-page {
  display: grid;
  gap: 22rpx;
}

.platform-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12rpx;
}

.platform-tab {
  border: 1rpx solid var(--app-line);
  border-radius: 999rpx;
  background: #fff;
  color: var(--app-muted);
  font-size: 27rpx;
  font-weight: 800;
  padding: 16rpx 6rpx;
  text-align: center;
}

.platform-tab.active {
  border-color: var(--app-brand);
  background: #eef6ff;
  color: var(--app-brand);
}

.status-card,
.config-card,
.package-card,
.info-card,
.risk-card,
.preview-card {
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
  padding: 26rpx;
}

.status-card {
  background: linear-gradient(135deg, #f8fbff, #fff 58%);
  box-shadow: inset 8rpx 0 0 var(--platform-color);
}

.status-head,
.preview-head,
.switch-row,
.package-row,
.progress-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.status-title {
  color: var(--app-ink);
  font-size: 36rpx;
  font-weight: 900;
}

.status-desc,
.switch-desc,
.package-meta,
.preview-desc,
.modal-desc {
  color: var(--app-muted);
  font-size: 24rpx;
  line-height: 1.55;
}

.status-desc,
.preview-desc,
.package-meta {
  margin-top: 8rpx;
}

.version-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 28rpx;
}

.version-row > view {
  border-radius: 12rpx;
  background: rgb(255 255 255 / 76%);
  padding: 20rpx;
}

.version-row text,
.progress-head,
.switch-title {
  color: var(--app-muted);
  font-size: 24rpx;
}

.version-row view view {
  margin-top: 8rpx;
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 900;
}

.progress-box {
  margin-top: 24rpx;
}

.progress-head {
  margin-bottom: 12rpx;
}

.card-title {
  color: var(--app-ink);
  font-size: 31rpx;
  font-weight: 900;
}

.switch-list,
.check-list,
.step-list,
.risk-list {
  display: grid;
  gap: 16rpx;
  margin-top: 20rpx;
}

.switch-row {
  align-items: center;
  border-bottom: 1rpx solid #eef2f7;
  padding-bottom: 16rpx;
}

.switch-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.switch-title {
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 800;
}

.package-row {
  align-items: center;
  margin-top: 20rpx;
}

:deep(.package-icon) {
  flex: 0 0 auto;
  color: var(--app-brand);
}

.package-name {
  overflow: hidden;
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.grid-section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.check-item,
.step-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  color: #344054;
  font-size: 25rpx;
  line-height: 1.45;
}

:deep(.check-icon) {
  color: #12b76a;
}

.step-index {
  display: grid;
  flex: 0 0 38rpx;
  width: 38rpx;
  height: 38rpx;
  place-items: center;
  border-radius: 50%;
  background: #eef6ff;
  color: var(--app-brand);
  font-size: 22rpx;
  font-weight: 900;
}

.risk-item {
  border-left: 6rpx solid #f59e0b;
  border-radius: 8rpx;
  background: #fffbeb;
  color: #7a4d00;
  font-size: 25rpx;
  line-height: 1.5;
  padding: 14rpx 18rpx;
}

.update-modal {
  margin-top: 22rpx;
  border-radius: 18rpx;
  background: #101828;
  padding: 28rpx;
}

.modal-version {
  color: #93c5fd;
  font-size: 24rpx;
  font-weight: 800;
}

.modal-title {
  margin-top: 10rpx;
  color: #fff;
  font-size: 36rpx;
  font-weight: 900;
}

.modal-desc {
  margin-top: 12rpx;
  color: rgb(255 255 255 / 74%);
}

.modal-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14rpx;
  margin-top: 24rpx;
}

.modal-actions :deep(.wd-button:only-child) {
  grid-column: 1 / -1;
}

@media (max-width: 360px) {
  .grid-section {
    grid-template-columns: 1fr;
  }
}
</style>
