<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('hbx-toast')

const checklist = ref([
  { name: '检测 Node.js 版本环境', status: 'pending' },
  { name: '验证 pnpm-lock.yaml 依赖完整性', status: 'pending' },
  { name: '检查 vite.config.ts 编译选项', status: 'pending' },
  { name: '核对 easycom 自动匹配组件库', status: 'pending' },
  { name: '校验 .env 平台环境变量', status: 'pending' }
])

const commands = [
  'pnpm dev:h5',
  'pnpm dev:mp-weixin',
  'pnpm dev:mp-toutiao',
  'pnpm dev:app-harmony'
]

const activeCommand = ref('')
const terminalLogs = ref<string[]>([])
const runDiagnostic = ref(false)
const compilingCmd = ref(false)

function simulateCommand(cmd: string) {
  activeCommand.value = cmd
  compilingCmd.value = true
  terminalLogs.value = [
    `$ ${cmd}`,
    `[vite] version: 5.0.0 (vue3)`,
    `[vite] loading environment variables...`,
    `[uniapp] parsing pages.json manifest...`
  ]
  
  setTimeout(() => {
    terminalLogs.value.push(`[vite:vue] compiling components tree...`)
  }, 500)
  
  setTimeout(() => {
    terminalLogs.value.push(`[vite] bundling modules in development mode...`)
  }, 1000)

  setTimeout(() => {
    terminalLogs.value.push(`🟢 DONE  Build complete successfully.`)
    terminalLogs.value.push(`🌐 H5 Server running at: http://localhost:5173/`)
    terminalLogs.value.push(`👉 Press H to view local keyboard shortcuts in terminal`)
    compilingCmd.value = false
    toast.success(`${cmd} 编译调试成功`)
  }, 1800)
}

function startCheck() {
  runDiagnostic.value = true
  checklist.value.forEach((item) => {
    item.status = 'pending'
  })
  
  checklist.value.forEach((item, idx) => {
    setTimeout(() => {
      item.status = 'success'
      if (idx === checklist.value.length - 1) {
        runDiagnostic.value = false
        toast.success('工程编译环境自检全部通过！')
      }
    }, (idx + 1) * 600)
  })
}
</script>

<template>
  <PageShell title="HBX 兼命令行开发" description="保留 HBuilderX 快捷运行使用路径，亦无缝支持命令行 CLI 开发模式。">
    <view class="hbx-framework-page">
      <wd-toast selector="hbx-toast" />

      <!-- 1. Diagnostic Panel -->
      <view class="panel-section">
        <view class="section-head font-bold mb-2 flex justify-between items-center">
          <text>⚙️ 模版工程环境诊断自检</text>
          <wd-button size="small" type="primary" :loading="runDiagnostic" @click="startCheck">开始体检</wd-button>
        </view>
        <view class="share-desc-info text-muted mb-3">
          一键诊断当前 UniApp 项目的依赖树结构、Vite 配置及 easycom 自动匹配：
        </view>
        
        <wd-cell-group border class="checklist-group">
          <wd-cell
            v-for="item in checklist"
            :key="item.name"
            :title="item.name"
          >
            <template #value>
              <wd-tag v-if="item.status === 'pending'" type="neutral">未检测</wd-tag>
              <wd-tag v-else type="success">🟢 正常</wd-tag>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <!-- 2. Command list and Terminal Simulator -->
      <view class="panel-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>💻 CLI 命令模拟编译调试</text>
        </view>
        <view class="share-desc-info text-muted mb-3">
          点击下方指令，即可在黑色终端模拟器中展示真实的 Vite & UniApp 离屏热重载日志：
        </view>

        <view class="commands-grid flex-wrap gap-2 mb-3">
          <wd-button
            v-for="cmd in commands"
            :key="cmd"
            size="small"
            plain
            type="neutral"
            :class="{ active: activeCommand === cmd }"
            @click="simulateCommand(cmd)"
          >
            {{ cmd }}
          </wd-button>
        </view>

        <!-- Terminal Panel -->
        <view class="terminal-mock">
          <view class="terminal-header">
            <view class="dot red"></view>
            <view class="dot yellow"></view>
            <view class="dot green"></view>
            <text class="terminal-title">bash - terminal simulator</text>
          </view>
          <view class="terminal-body">
            <view v-if="terminalLogs.length === 0" class="code-line text-muted">
              // 请在上方点击需要模拟执行的项目构建命令...
            </view>
            <view v-for="(log, idx) in terminalLogs" :key="idx" class="code-line">
              {{ log }}
            </view>
            <view v-if="compilingCmd" class="loading-spin-line">
              <wd-loading size="12px" class="mr-1" />
              <text class="text-brand">compiling modules...</text>
            </view>
          </view>
        </view>
      </view>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.hbx-framework-page {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.panel-section {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 28rpx;
}

.share-desc-info {
  font-size: 21rpx;
  line-height: 1.5;
}

.commands-grid {
  display: flex;
  gap: 16rpx;
}

.terminal-mock {
  background: #0f172a;
  border-radius: 16rpx;
  overflow: hidden;
  border: 1rpx solid #334155;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.12);
}

.terminal-header {
  background: #1e293b;
  height: 50rpx;
  display: flex;
  align-items: center;
  padding: 0 18rpx;
  position: relative;
}

.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  margin-right: 10rpx;
  
  &.red { background: #ef4444; }
  &.yellow { background: #eab308; }
  &.green { background: #22c55e; }
}

.terminal-title {
  color: #94a3b8;
  font-size: 16rpx;
  font-family: monospace;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.terminal-body {
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  min-height: 220rpx;
  max-height: 380rpx;
  overflow-y: auto;
}

.code-line {
  font-family: monospace;
  font-size: 17rpx;
  color: #e2e8f0;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
}

.loading-spin-line {
  display: flex;
  align-items: center;
  font-family: monospace;
  font-size: 17rpx;
  margin-top: 6rpx;
}

.flex { display: flex; }
.flex-wrap { display: flex; flex-wrap: wrap; }
.flex-column { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-brand { color: var(--app-brand); }
.ml-2 { margin-left: 16rpx; }
.mr-1 { margin-right: 8rpx; }
.mt-3 { margin-top: 24rpx; }
.mb-2 { margin-bottom: 16rpx; }
.mb-3 { margin-bottom: 24rpx; }
</style>
