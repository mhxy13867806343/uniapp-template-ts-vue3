<script setup lang="ts">
import { chooseImage, chooseVideo, getImageInfo, getUniErrorMessage, previewImage, previewMedia } from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('media-toast')

const imagePaths = ref<string[]>([])
const videoPath = ref('')
const resultText = ref('')
const logs = ref<string[]>([])

function log(message: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  logs.value = logs.value.slice(0, 40)
}

async function handleChooseImage() {
  try {
    const result = await chooseImage({
      count: 3,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera']
    })
    imagePaths.value = (result.tempFilePaths as string[]) || []
    resultText.value = JSON.stringify(result, null, 2)
    log(`chooseImage 成功，共 ${imagePaths.value.length} 张`)
    toast.success('已选择图片')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`选择图片失败: ${message}`)
  }
}

async function handlePreviewImage() {
  if (!imagePaths.value.length) {
    toast.warning('请先选择图片')
    return
  }
  try {
    await previewImage({
      urls: imagePaths.value,
      current: imagePaths.value[0]
    })
    log('previewImage 已触发')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`预览图片失败: ${message}`)
  }
}

async function handleGetImageInfo() {
  if (!imagePaths.value.length) {
    toast.warning('请先选择图片')
    return
  }
  try {
    const result = await getImageInfo(imagePaths.value[0])
    resultText.value = JSON.stringify(result, null, 2)
    log('getImageInfo 成功')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`读取图片信息失败: ${message}`)
  }
}

async function handleChooseVideo() {
  try {
    const result = await chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 30
    })
    videoPath.value = String(result.tempFilePath || '')
    resultText.value = JSON.stringify(result, null, 2)
    log('chooseVideo 成功')
    toast.success('已选择视频')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`选择视频失败: ${message}`)
  }
}

async function handlePreviewVideo() {
  if (!videoPath.value) {
    toast.warning('请先选择视频')
    return
  }
  try {
    await previewMedia({
      sources: [{ url: videoPath.value, type: 'video' }]
    })
    log('previewMedia 已触发')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`预览视频失败: ${message}`)
  }
}
</script>

<template>
  <PageShell title="媒体 APIs" description="统一测试图片与视频选择、预览和图片信息读取。适合头像上传、商品图采集、短视频发布等场景。">
    <view class="api-page">
      <wd-toast selector="media-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">媒体实验室</view>
          <view class="hero-desc">这里先把常用媒体动作收成一个页面：选图、图像预览、图像信息读取、选视频、视频预览。后面可以继续接拍照、录音和压缩流程。</view>
        </view>
        <wd-tag type="primary" plain>图片 / 视频</wd-tag>
      </view>

      <view class="panel-card">
        <view class="section-title">图片能力</view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleChooseImage">chooseImage</wd-button>
          <wd-button size="small" plain @click="handlePreviewImage">previewImage</wd-button>
          <wd-button size="small" plain @click="handleGetImageInfo">getImageInfo</wd-button>
        </view>
        <view v-if="imagePaths.length" class="media-list">
          <view v-for="item in imagePaths" :key="item" class="media-item">{{ item }}</view>
        </view>
        <view v-else class="empty-card">还没有选中的图片。</view>
      </view>

      <view class="panel-card">
        <view class="section-title">视频能力</view>
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleChooseVideo">chooseVideo</wd-button>
          <wd-button size="small" plain @click="handlePreviewVideo">previewMedia</wd-button>
        </view>
        <view class="result-box">{{ videoPath || '还没有选中的视频。' }}</view>
      </view>

      <view class="panel-card">
        <view class="section-title">最近结果</view>
        <view class="result-box">{{ resultText || '执行 API 后结果会显示在这里。' }}</view>
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
.hero-card,.panel-card,.media-item,.empty-card { background:#fff; border:1rpx solid var(--app-line); border-radius:24rpx; }
.hero-card,.panel-card { padding:28rpx; }
.hero-card { display:flex; justify-content:space-between; gap:20rpx; }
.hero-title,.section-title { color:var(--app-ink); font-weight:800; }
.hero-title { font-size:38rpx; }
.section-title { font-size:30rpx; }
.hero-desc,.log-item,.result-box,.empty-card,.media-item { margin-top:12rpx; color:var(--app-muted); font-size:25rpx; line-height:1.7; white-space:pre-wrap; word-break:break-all; }
.action-row { display:flex; flex-wrap:wrap; gap:14rpx; margin-top:18rpx; }
.media-list,.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.media-item,.empty-card { padding:22rpx; }
.result-box { min-height:140rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; }
</style>
