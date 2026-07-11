<script setup lang="ts">
import { getSavedFileInfo, getSavedFileList, getUniErrorMessage, hasFileSystemManagerSupport, openDocument, removeSavedFile, saveFile } from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('file-system-toast')

const supportText = computed(() => hasFileSystemManagerSupport() ? '支持 FileSystemManager' : '当前端不支持 FileSystemManager')
const tempFilePath = ref('')
const selectedFilePath = ref('')
const savedFiles = ref<Array<Record<string, any>>>([])
const lastResult = ref('')
const logs = ref<string[]>([])

function log(message: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  logs.value = logs.value.slice(0, 40)
}

function formatResult(result: unknown) {
  lastResult.value = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
}

async function refreshSavedFiles() {
  try {
    const result = await getSavedFileList()
    savedFiles.value = result.fileList || []
    if (!selectedFilePath.value && savedFiles.value.length) {
      selectedFilePath.value = String(savedFiles.value[0].filePath || '')
    }
    formatResult(result)
    log(`已读取已保存文件列表，共 ${savedFiles.value.length} 个`)
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`读取文件列表失败: ${message}`)
  }
}

async function handleSaveFile() {
  if (!tempFilePath.value.trim()) {
    toast.warning('请输入临时文件路径')
    return
  }
  try {
    const result = await saveFile(tempFilePath.value.trim())
    selectedFilePath.value = result.savedFilePath
    formatResult(result)
    log(`临时文件已转存: ${result.savedFilePath}`)
    toast.success('转存成功')
    await refreshSavedFiles()
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`转存文件失败: ${message}`)
  }
}

async function handleGetFileInfo() {
  if (!selectedFilePath.value.trim()) {
    toast.warning('请选择已保存文件')
    return
  }
  try {
    const result = await getSavedFileInfo(selectedFilePath.value.trim())
    formatResult(result)
    log(`已读取文件详情: ${selectedFilePath.value}`)
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`读取文件详情失败: ${message}`)
  }
}

async function handleRemoveFile() {
  if (!selectedFilePath.value.trim()) {
    toast.warning('请选择要删除的文件')
    return
  }
  try {
    await removeSavedFile(selectedFilePath.value.trim())
    log(`已删除文件: ${selectedFilePath.value}`)
    toast.success('删除成功')
    selectedFilePath.value = ''
    await refreshSavedFiles()
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`删除文件失败: ${message}`)
  }
}

async function handleOpenDocument() {
  if (!selectedFilePath.value.trim()) {
    toast.warning('请选择要打开的文件')
    return
  }
  try {
    await openDocument(selectedFilePath.value.trim())
    log(`已尝试打开文档: ${selectedFilePath.value}`)
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`打开文档失败: ${message}`)
  }
}

onMounted(() => {
  refreshSavedFiles()
})
</script>

<template>
  <PageShell title="文件系统 APIs" description="统一测试 saveFile、getSavedFileList、getSavedFileInfo、removeSavedFile 和 openDocument，适合接上传下载完成后的文件落地场景。">
    <view class="api-page">
      <wd-toast selector="file-system-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">文件系统实验室</view>
          <view class="hero-desc">当前重点封装了保存文件、查询文件列表、读取文件信息和打开文档。更底层的 FileSystemManager 也已经统一到了 `src/apis/uni/fileSystem.ts`。</view>
        </view>
        <wd-tag :type="hasFileSystemManagerSupport() ? 'success' : 'warning'" plain>{{ supportText }}</wd-tag>
      </view>

      <view class="panel-card">
        <view class="section-title">临时文件转存</view>
        <input v-model="tempFilePath" class="native-input" placeholder="请输入 tempFilePath，例如下载完成后的临时文件路径" />
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleSaveFile">saveFile 转存</wd-button>
          <wd-button size="small" plain @click="refreshSavedFiles">刷新文件列表</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">已保存文件</view>
        <view class="tip-text">当前已保存 {{ savedFiles.length }} 个文件。点击某一项后可以查看详情、打开文档或删除。</view>
        <view v-if="savedFiles.length" class="file-list">
          <view
            v-for="item in savedFiles"
            :key="item.filePath"
            :class="['file-card', selectedFilePath === item.filePath ? 'file-card--active' : '']"
            @click="selectedFilePath = String(item.filePath || '')"
          >
            <view class="file-name">{{ item.filePath }}</view>
            <view class="file-meta">createTime: {{ item.createTime || '-' }} / size: {{ item.size || '-' }}</view>
          </view>
        </view>
        <view v-else class="empty-card">当前没有已保存文件，可以先输入临时路径后尝试转存。</view>
        <view class="action-row">
          <wd-button size="small" plain @click="handleGetFileInfo">读取详情</wd-button>
          <wd-button size="small" plain @click="handleOpenDocument">打开文档</wd-button>
          <wd-button size="small" type="danger" plain @click="handleRemoveFile">删除文件</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">最近结果</view>
        <view class="result-box">{{ lastResult || '执行 API 后会把返回结果显示在这里' }}</view>
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
.api-page { display: grid; gap: 24rpx; }
.hero-card,.panel-card,.file-card,.empty-card { background:#fff; border:1rpx solid var(--app-line); border-radius:24rpx; }
.hero-card,.panel-card { padding:28rpx; }
.hero-card { display:flex; justify-content:space-between; gap:20rpx; }
.hero-title,.section-title,.file-name { color:var(--app-ink); font-weight:800; }
.hero-title { font-size:38rpx; }
.section-title { font-size:30rpx; }
.hero-desc,.tip-text,.file-meta,.log-item,.result-box,.empty-card { margin-top:12rpx; color:var(--app-muted); font-size:25rpx; line-height:1.7; white-space:pre-wrap; word-break:break-all; }
.native-input { width:100%; height:88rpx; margin-top:18rpx; padding:0 22rpx; box-sizing:border-box; border:1rpx solid var(--app-line); border-radius:18rpx; background:#f8fafc; font-size:25rpx; color:var(--app-ink); }
.action-row { display:flex; flex-wrap:wrap; gap:14rpx; margin-top:20rpx; }
.file-list,.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.file-card { padding:22rpx; }
.file-card--active { border-color:#2563eb; background:#eff6ff; }
.result-box { min-height:140rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; }
.empty-card { padding:22rpx; }
</style>
