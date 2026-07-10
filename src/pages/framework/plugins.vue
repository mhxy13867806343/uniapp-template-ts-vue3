<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { getHardwareInfo } from '@/plugins'

const toast = useToast('plugins-toast')
const appStore = useAppStore()

// Native Bridge state
const hardwareInfoResult = ref('')

function fetchHardwareInfo() {
  try {
    const res = getHardwareInfo()
    hardwareInfoResult.value = res
    toast.success('原生硬件网桥调用成功！')
  } catch (e: any) {
    hardwareInfoResult.value = `网桥调用失败: ${e.message || e}`
    toast.error('网桥调用失败')
  }
}

// Wot & UnoCSS Sandbox states
const sliderVal = ref(60)
const customBrandColor = ref('#2756d8')
const themeColorOptions = ['#2756d8', '#22c55e', '#ef4444', '#a855f7', '#fbbf24']

const pluginItems = [
  {
    name: 'Pinia (应用状态管理)',
    desc: '全局状态总线管理，当前已拆分 appStore / userStore。已接通持久化存储插件。'
  },
  {
    name: 'Wot Design Uni (组件 easycom)',
    desc: '组件及样式按需全自动打包加载，无需手动 import 注册引入，开箱即用。'
  },
  {
    name: 'UnoCSS (原子级样式库)',
    desc: '支持通过纯类名编写快速多端适配的响应式样式，减小打包 CSS 体积。'
  },
  {
    name: 'Auto Import (API 自动导入)',
    desc: 'Vue 组合式 API (ref, computed, watch)、UniApp 生命周期钩子及 Wot Toast 全自动导入。'
  }
]

const pluginSteps = [
  '在 src/plugins 中集中挂载 Pinia 等基础服务',
  '在 vite.config.ts 中安装配置 unplugin-auto-import 插件',
  '页面通过 Easycom 语法直接编写组件名称',
  '使用 UnoCSS 进行精细化布局，多端一处编写随处兼容'
]

function toggleAppReadyState() {
  // Toggle ready state in appStore
  if (appStore.isReady) {
    appStore.$patch({ isReady: false })
    toast.warning('应用就绪状态已变更为：挂起 (Pending)')
  } else {
    appStore.markReady()
    toast.success('应用就绪状态已变更为：就绪 (Ready)')
  }
}

function handleSliderChange(val: number) {
  toast.success(`Wot Slider 数值变更为: ${val}%`)
}

function changeLocalBrandColor(color: string) {
  customBrandColor.value = color
  toast.success(`主题色变更为: ${color}`)
}
</script>

<template>
  <PageShell title="插件与核心包体系" description="参考现代化应用的最佳实践，集中挂载 Pinia 状态树、Easycom 自动解析及 UnoCSS 预设。">
    <view class="plugins-framework-page">
      <wd-toast selector="plugins-toast" />

      <!-- 0. Native Bridge Hardware Tester -->
      <view class="panel-section">
        <view class="section-head font-bold mb-2">
          <text>⚡️ 1. 跨端统一原生硬件网桥测试</text>
        </view>
        <view class="share-desc-info text-muted mb-3">
          自动根据当前平台环境分发给对应的原生扩展：在 Android 下调用 Java 插件，在 iOS 下调用 Objective-C 插件，在 H5/小程序下调用平台 API：
        </view>

        <view class="pinia-demo-card p-3 mb-2 flex-column">
          <view class="flex justify-between items-center mb-2">
            <text class="font-bold text-ink">当前硬件网桥返回：</text>
            <wd-button size="small" type="primary" @click="fetchHardwareInfo">获取硬件详情</wd-button>
          </view>
          <view class="hardware-info-box p-2 mt-1">
            <text class="hardware-text">{{ hardwareInfoResult || '点击右上方按钮开始调用网桥...' }}</text>
          </view>
        </view>
      </view>

      <!-- 1. Pinia Store Sandbox -->
      <view class="panel-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>🍍 2. Pinia 全局状态联动演示</text>
        </view>
        <view class="share-desc-info text-muted mb-3">
          点击按钮修改 AppStore 里的全局变量，可即时响应界面上绑定的灯光状态：
        </view>

        <view class="pinia-demo-card flex justify-between items-center p-3 mb-2">
          <view class="flex items-center">
            <view class="status-light-indicator" :class="{ active: appStore.isReady }"></view>
            <view class="flex-column ml-2">
              <text class="font-bold text-ink">appStore.isReady</text>
              <text class="text-muted" style="font-size: 17rpx;">当前状态：{{ appStore.isReady ? '🟢 运行就绪 (Ready)' : '🔴 系统挂起 (Pending)' }}</text>
            </view>
          </view>
          <wd-button size="small" type="primary" @click="toggleAppReadyState">切换就绪状态</wd-button>
        </view>
      </view>

      <!-- 2. Wot Easycom Sandbox -->
      <view class="panel-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>📦 3. Wot Design Easycom 按需加载</text>
        </view>
        <view class="share-desc-info text-muted mb-3">
          以下 Wot 基础组件直接在 Template 处使用，无需写 any import，打生产包时会自动进行 Tree Shaking 剔除多余组件：
        </view>

        <view class="p-2 border-box">
          <text class="row-label font-bold text-ink" style="font-size: 19rpx;">滑动选择音量大小 (wd-slider)：</text>
          <view class="mt-2">
            <wd-slider v-model="sliderVal" @change="handleSliderChange" />
          </view>
        </view>
      </view>

      <!-- 3. UnoCSS Theme Variables Customizer -->
      <view class="panel-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>🎨 4. UnoCSS 跨端主题变量自适应</text>
        </view>
        <view class="share-desc-info text-muted mb-3">
          点击下方色块即时改变 CSS 变量（演示 UnoCSS 样式的即时重绘）：
        </view>

        <view class="theme-card-preview p-3 mb-2 flex items-center justify-between" :style="{ borderLeftColor: customBrandColor }">
          <view class="flex-column">
            <text class="font-bold theme-preview-text" :style="{ color: customBrandColor }">当前演示主题包</text>
            <text class="text-muted" style="font-size: 16rpx;">边框与文本正在应用选中色值</text>
          </view>
          
          <view class="flex">
            <view
              v-for="color in themeColorOptions"
              :key="color"
              :class="['color-dot-cell ml-1', { active: customBrandColor === color }]"
              :style="{ backgroundColor: color }"
              @click="changeLocalBrandColor(color)"
            ></view>
          </view>
        </view>
      </view>

      <!-- 4. Plugins Info Cards -->
      <view class="panel-section mt-3">
        <view class="section-head font-bold mb-3">
          <text>📋 核心集成的开源底座库</text>
        </view>
        <view class="grid gap-2">
          <view
            v-for="item in pluginItems"
            :key="item.name"
            class="plugin-info-item p-2"
          >
            <view class="font-bold text-ink" style="font-size: 21rpx;">{{ item.name }}</view>
            <view class="text-muted mt-1 leading-6" style="font-size: 18rpx;">{{ item.desc }}</view>
          </view>
        </view>
      </view>

      <!-- 5. Step Checklist -->
      <view class="panel-section mt-3">
        <view class="section-head font-bold mb-3">
          <text>🛠️ 接入与定制化指引</text>
        </view>
        <wd-steps :active="2" vertical>
          <wd-step
            v-for="step in pluginSteps"
            :key="step"
            :title="step"
          />
        </wd-steps>
      </view>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.plugins-framework-page {
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

.pinia-demo-card {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #f8fafc;
}

.status-light-indicator {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: #cbd5e1;
  transition: all 0.3s ease;
  box-shadow: 0 0 8rpx rgba(203, 213, 225, 0.4);
  
  &.active {
    background: #22c55e;
    box-shadow: 0 0 16rpx rgba(34, 197, 94, 0.8);
    animation: pulseGlow 2s infinite ease-in-out;
  }
}

@keyframes pulseGlow {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.theme-card-preview {
  border: 1rpx solid var(--app-line);
  border-left: 8rpx solid #2756d8;
  border-radius: 12rpx;
  background: #f8fafc;
  transition: border-left-color 0.2s ease;
}

.theme-preview-text {
  font-size: 22rpx;
}

.color-dot-cell {
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  cursor: pointer;
  border: 3rpx solid transparent;
  transition: all 0.2s ease;
  
  &.active {
    border-color: #000;
    transform: scale(1.1);
  }
}

.plugin-info-item {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #f8fafc;
}

.gap-2 {
  gap: 16rpx;
}

.border-box {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #f8fafc;
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.ml-1 { margin-left: 8rpx; }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mb-2 { margin-bottom: 16rpx; }
.mb-3 { margin-bottom: 24rpx; }
.p-2 { padding: 16rpx; }
.p-3 { padding: 24rpx; }

.hardware-info-box {
  background: #f1f5f9;
  border-radius: 12rpx;
  border: 1rpx dashed #cbd5e1;
}

.hardware-text {
  font-family: monospace;
  font-size: 19rpx;
  color: #334155;
  word-break: break-all;
}
</style>
