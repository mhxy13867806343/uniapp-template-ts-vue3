<script setup lang="ts">
import { ref, computed } from 'vue'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('bubble-toast')

// Interactive values
const progressVal = ref(75)
const animSpeed = ref(2.5) // in seconds
const activeColor = ref('#2756d8')
const activeStyle = ref('classic')

const colorPresets = ['#2756d8', '#22c55e', '#ef4444', '#a855f7', '#fbbf24', '#06b6d4']

// Warning threshold controls
const enableWarning = ref(true)
const warningThreshold = ref(80)

const isExceeded = computed(() => {
  if (activeStyle.value === 'gaming-hp-mp' || activeStyle.value === 'crystal-heart' || activeStyle.value === 'heartbeat') {
    return false // Gaming bars use Low Health warning instead of High Limit warning
  }
  return enableWarning.value && progressVal.value >= warningThreshold.value
})

const isLowHealth = computed(() => {
  return progressVal.value <= 25
})

const displayColor = computed(() => {
  if (activeStyle.value === 'gaming-hp-mp' || activeStyle.value === 'crystal-heart' || activeStyle.value === 'heartbeat') {
    return isLowHealth.value ? '#ef4444' : '#22c55e' // HP/Heart defaults to Green, warning turns Red!
  }
  return isExceeded.value ? '#ef4444' : activeColor.value // regular style turns Red if exceeded
})

const stylesList = [
  { id: 'classic', name: '01. 经典极简圆环', desc: '纯净的 SVG 环形进度线' },
  { id: 'gradient', name: '02. 极光渐变圆环', desc: '极光色锥形高光轮廓环' },
  { id: 'liquid-wave', name: '03. 液态起伏水泡', desc: '双层余弦波液态水波纹' },
  { id: 'glow-neon', name: '04. 赛博发光霓虹', desc: '赛博霓虹投影发光外层环' },
  { id: 'dotted-gauge', name: '05. 虚线刻度表盘', desc: '汽车虚线测速刻度仪盘' },
  { id: 'concentric', name: '06. 同心双重限额', desc: 'Gemini同心多限额对比环' },
  { id: 'glass-wave', name: '07. 磨砂毛玻璃舱', desc: '毛玻璃滤镜与内部起伏水波' },
  { id: 'teardrop', name: '08. 重力感应水滴', desc: '水滴外形轮廓起伏水位' },
  { id: 'pulse-ripple', name: '09. 脉冲雷达波纹', desc: '向外扩散的广播声呐波纹' },
  { id: 'particles', name: '10. 粒子浮动气泡', desc: '浮动上升小气泡颗粒特效' },
  { id: 'doughnut', name: '11. 多色三段圆环', desc: '代表多种不同配额的分段环' },
  { id: 'countdown', name: '12. 扫光秒针时盘', desc: '周期性时钟扫光扫盘' },
  { id: 'retro-pixel', name: '13. 复古像素能量', desc: '8Bit 像素复古方块能量环' },
  { id: 'metallic-3d', name: '14. 金属三维浮雕', desc: '金色金属拉丝光泽反射' },
  { id: 'semi-circle', name: '15. 半圆指针仪表', desc: '180度半圆指针速度仪盘' },
  { id: 'double-helix', name: '16. 双螺旋DNA环', desc: '对向旋转交错的双螺旋波' },
  { id: 'heartbeat', name: '17. 心率跳动红环', desc: '居中爱心随节律缩放红环' },
  { id: 'fire-energy', name: '18. 熔岩烈焰能量', desc: '红黄相间烈焰外焰呼吸灯' },
  { id: 'spinning-gear', name: '19. 工业旋转齿轮', desc: '咬合转动的蒸汽朋克齿轮' },
  { id: 'interactive-drag', name: '20. 手势拖拽水位', desc: '上下手势划动实时改变百分比' },
  { id: 'gaming-hp-mp', name: '21. 双轨血魔值球', desc: '红绿双色HP血量舱与蓝色MP法力舱' },
  { id: 'crystal-heart', name: '22. 水晶生命红心', desc: '经典暗黑RPG游戏生命红心容器' }
]

// Drag states for style 20
const isDragging = ref(false)

function handleTouchStart(e: TouchEvent) {
  if (activeStyle.value !== 'interactive-drag') return
  isDragging.value = true
  updateProgressFromTouch(e.touches[0].clientY)
}

function handleTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  updateProgressFromTouch(e.touches[0].clientY)
}

function handleTouchEnd() {
  isDragging.value = false
}

function updateProgressFromTouch(clientY: number) {
  uni.createSelectorQuery()
    .select('.active-demo-wrapper')
    .boundingClientRect((rect: any) => {
      if (rect) {
        const top = rect.top
        const height = rect.height
        const relativeY = clientY - top
        let percentage = Math.round((1 - relativeY / height) * 100)
        percentage = Math.max(0, Math.min(100, percentage))
        progressVal.value = percentage
      }
    })
    .exec()
}

// Computes stroke dash-offset for classic SVG circle
const strokeDashoffset = computed(() => {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  return circumference - (progressVal.value / 100) * circumference
})

function selectStyle(id: string) {
  activeStyle.value = id
  if (id === 'concentric') {
    toast.success('双限额同心环已加载 (还原/升华限制示意图)')
  } else if (id === 'interactive-drag') {
    toast.success('手势控制已激活：请在下方圆盒中上下滑动手指！')
  } else if (id === 'gaming-hp-mp' || id === 'crystal-heart') {
    toast.success('游戏角色血魔池已激活！低于25%时将闪烁红色警报！')
  } else {
    toast.success(`效果 ${id} 切换成功`)
  }
}

function randomizeValue() {
  progressVal.value = Math.floor(Math.random() * 101)
  toast.success(`数值随机变更为: ${progressVal.value}%`)
}
</script>

<template>
  <PageShell title="水泡与环形进度画廊" description="收集了20种各异的圆形指示器、液态水泡与赛博发光刻度，提供高水准的动效模版。">
    <view class="bubble-gallery-page">
      <wd-toast selector="bubble-toast" />

      <!-- 1. Active Showcase Box -->
      <view class="active-demo-container">
        <view class="active-demo-header">
          <text class="style-title">{{ stylesList.find(s => s.id === activeStyle)?.name }}</text>
          <wd-tag size="small" :type="isExceeded || ((activeStyle === 'gaming-hp-mp' || activeStyle === 'crystal-heart') && isLowHealth) ? 'danger' : 'primary'" plain>{{ progressVal }}%</wd-tag>
        </view>

        <!-- Warning Alert Banner -->
        <view v-if="isExceeded" class="alarm-banner">
          <text class="alarm-text">⚠️ 警告：当前进度 ({{ progressVal }}%) 已超载限额 (>= {{ warningThreshold }}%)！</text>
        </view>
        <view v-if="(activeStyle === 'gaming-hp-mp' || activeStyle === 'crystal-heart') && isLowHealth" class="alarm-banner flashing-red">
          <text class="alarm-text">🩸 警告：角色处于濒血状态！HP: {{ progressVal }}%！请及时补药！</text>
        </view>

        <view
          class="active-demo-wrapper"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- 01. Classic Circle -->
          <view v-if="activeStyle === 'classic'" class="demo-wrapper">
            <svg class="svg-ring" viewBox="0 0 120 120">
              <circle class="svg-bg" cx="60" cy="60" r="50" />
              <circle
                class="svg-fill"
                cx="60"
                cy="60"
                r="50"
                :style="{
                  stroke: displayColor,
                  strokeDashoffset: strokeDashoffset,
                  transition: `stroke-dashoffset ${animSpeed}s ease-in-out`
                }"
              />
            </svg>
            <view class="center-text" :style="{ color: displayColor }">{{ progressVal }}%</view>
          </view>

          <!-- 02. Conic Gradient -->
          <view v-else-if="activeStyle === 'gradient'" class="demo-wrapper">
            <view class="conic-ring" :style="{ '--brand': displayColor, '--pct': `${progressVal}%` }">
              <view class="inner-cut"></view>
            </view>
            <view class="center-text" :style="{ color: displayColor }">{{ progressVal }}%</view>
          </view>

          <!-- 03. Liquid Wave Bubble -->
          <view v-else-if="activeStyle === 'liquid-wave'" class="demo-wrapper">
            <view class="wave-bubble-box" :style="{ '--brand': displayColor }">
              <view class="wave-wave-layer" :style="{ bottom: `${progressVal}%`, animationDuration: `${animSpeed}s` }"></view>
              <view class="wave-wave-second" :style="{ bottom: `${progressVal}%`, animationDuration: `${animSpeed * 1.5}s` }"></view>
              <view class="center-text-on-wave">{{ progressVal }}%</view>
            </view>
          </view>

          <!-- 04. Glow Neon -->
          <view v-else-if="activeStyle === 'glow-neon'" class="demo-wrapper">
            <view class="neon-glow-ring" :style="{ '--brand': displayColor, '--pct': `${progressVal}%` }">
              <view class="neon-inner"></view>
            </view>
            <view class="center-text neon-text" :style="{ textShadow: `0 0 10rpx ${displayColor}`, color: displayColor }">{{ progressVal }}%</view>
          </view>

          <!-- 05. Dotted Gauge -->
          <view v-else-if="activeStyle === 'dotted-gauge'" class="demo-wrapper">
            <svg class="svg-ring dotted-svg" viewBox="0 0 120 120">
              <circle class="svg-bg dotted" cx="60" cy="60" r="50" />
              <circle
                class="svg-fill dotted"
                cx="60"
                cy="60"
                r="50"
                :style="{
                  stroke: displayColor,
                  strokeDashoffset: strokeDashoffset,
                  transition: `stroke-dashoffset ${animSpeed}s ease-in-out`
                }"
              />
            </svg>
            <view class="center-text" :style="{ color: displayColor }">{{ progressVal }}%</view>
          </view>

          <!-- 06. Gemini Concentric limit rings -->
          <view v-else-if="activeStyle === 'concentric'" class="demo-wrapper concentric-view">
            <view class="concentric-ring-box">
              <view class="concentric-ring outer" :style="{ '--brand': displayColor, '--pct': `${progressVal}%` }">
                <view class="inner-cut"></view>
              </view>
              <view class="concentric-ring inner" :style="{ '--brand': '#ef4444', '--pct': '8%' }">
                <view class="inner-cut"></view>
              </view>
            </view>
            <view class="concentric-labels flex-column">
              <text class="lbl-row" :style="{ color: displayColor }">5-Hour Limit: {{ progressVal }}%</text>
              <text class="lbl-row text-red">Weekly Limit: 8%</text>
            </view>
          </view>

          <!-- 07. Glass Wave -->
          <view v-else-if="activeStyle === 'glass-wave'" class="demo-wrapper">
            <view class="glass-bubble-card">
              <view class="wave-bubble-box glass-interior" :style="{ '--brand': displayColor }">
                <view class="wave-wave-layer" :style="{ bottom: `${progressVal}%`, opacity: 0.6 }"></view>
                <view class="wave-wave-second" :style="{ bottom: `${progressVal}%`, opacity: 0.4 }"></view>
                <view class="center-text-on-wave">{{ progressVal }}%</view>
              </view>
            </view>
          </view>

          <!-- 08. Teardrop shape -->
          <view v-else-if="activeStyle === 'teardrop'" class="demo-wrapper">
            <view class="teardrop-bubble-box" :style="{ '--brand': displayColor }">
              <view class="wave-wave-layer teardrop-wave" :style="{ bottom: `${progressVal}%` }"></view>
              <view class="center-text-on-wave text-white">{{ progressVal }}%</view>
            </view>
          </view>

          <!-- 09. Pulse Ripple -->
          <view v-else-if="activeStyle === 'pulse-ripple'" class="demo-wrapper">
            <view class="ripple-outer-glow">
              <view class="ripple-ring anim-r1" :style="{ borderColor: displayColor }"></view>
              <view class="ripple-ring anim-r2" :style="{ borderColor: displayColor }"></view>
              <svg class="svg-ring scale-down" viewBox="0 0 120 120">
                <circle class="svg-bg" cx="60" cy="60" r="50" />
                <circle
                  class="svg-fill"
                  cx="60"
                  cy="60"
                  r="50"
                  :style="{
                    stroke: displayColor,
                    strokeDashoffset: strokeDashoffset
                  }"
                />
              </svg>
              <view class="center-text" :style="{ color: displayColor }">{{ progressVal }}%</view>
            </view>
          </view>

          <!-- 10. Particles Bubble -->
          <view v-else-if="activeStyle === 'particles'" class="demo-wrapper">
            <view class="wave-bubble-box overflow-visible" :style="{ '--brand': activeColor }">
              <view class="wave-wave-layer" :style="{ bottom: `${progressVal}%` }"></view>
              <view class="particle p1" :style="{ backgroundColor: activeColor }"></view>
              <view class="particle p2" :style="{ backgroundColor: activeColor }"></view>
              <view class="particle p3" :style="{ backgroundColor: activeColor }"></view>
              <view class="particle p4" :style="{ backgroundColor: activeColor }"></view>
              <view class="center-text-on-wave">{{ progressVal }}%</view>
            </view>
          </view>

          <!-- 11. Doughnut Multi-Segment -->
          <view v-else-if="activeStyle === 'doughnut'" class="demo-wrapper">
            <view class="segment-ring">
              <view class="seg seg-1"></view>
              <view class="seg seg-2"></view>
              <view class="seg seg-3"></view>
              <view class="inner-cut"></view>
            </view>
            <view class="center-text text-sm" style="color: #64748b;">分段指标</view>
          </view>

          <!-- 12. Countdown Dial Sweep -->
          <view v-else-if="activeStyle === 'countdown'" class="demo-wrapper">
            <view class="countdown-dial-box">
              <view class="dial-sweeper" :style="{ animationDuration: `${animSpeed}s` }"></view>
              <view class="dial-cover"></view>
            </view>
            <view class="center-text font-mono text-cyan">{{ progressVal }}s</view>
          </view>

          <!-- 13. Retro 8-Bit Pixel -->
          <view v-else-if="activeStyle === 'retro-pixel'" class="demo-wrapper">
            <view class="retro-pixel-ring" :style="{ '--brand': activeColor, '--pct': `${progressVal}%` }">
              <view class="pixel-inner"></view>
            </view>
            <view class="center-text font-mono text-green font-bold">{{ progressVal }}%</view>
          </view>

          <!-- 14. Metallic 3D -->
          <view v-else-if="activeStyle === 'metallic-3d'" class="demo-wrapper">
            <view class="metallic-ring">
              <view class="metal-fill" :style="{ '--pct': `${progressVal}%` }">
                <view class="metal-inner"></view>
              </view>
            </view>
            <view class="center-text text-metal" style="color: #d4af37;">{{ progressVal }}%</view>
          </view>

          <!-- 15. Semi-Circle Pointer Dial -->
          <view v-else-if="activeStyle === 'semi-circle'" class="demo-wrapper semi-circle-view">
            <view class="semi-circle-gauge" :style="{ '--brand': activeColor }">
              <view class="semi-fill" :style="{ transform: `rotate(${(progressVal / 100) * 180}deg)` }"></view>
              <view class="semi-cover"></view>
              <view class="semi-pointer" :style="{ transform: `rotate(${-90 + (progressVal / 100) * 180}deg)` }"></view>
            </view>
            <view class="semi-value">{{ progressVal }} km/h</view>
          </view>

          <!-- 16. DNA Double Helix -->
          <view v-else-if="activeStyle === 'double-helix'" class="demo-wrapper">
            <view class="wave-bubble-box" :style="{ '--brand': activeColor }">
              <view class="wave-wave-layer helix-wave-1" :style="{ bottom: `${progressVal}%` }"></view>
              <view class="wave-wave-layer helix-wave-2" :style="{ bottom: `${progressVal}%` }"></view>
              <view class="center-text-on-wave">{{ progressVal }}%</view>
            </view>
          </view>

          <!-- 17. Heartbeat Rhythm -->
          <view v-else-if="activeStyle === 'heartbeat'" class="demo-wrapper">
            <view class="heart-pulse-box">
              <svg class="svg-ring" viewBox="0 0 120 120">
                <circle class="svg-bg" cx="60" cy="60" r="50" />
                <circle
                  class="svg-fill"
                  cx="60"
                  cy="60"
                  r="50"
                  :style="{
                    stroke: '#ef4444',
                    strokeDashoffset: strokeDashoffset
                  }"
                />
              </svg>
              <view class="heart-icon-beat">❤️</view>
            </view>
          </view>

          <!-- 18. Fire Energy Lava -->
          <view v-else-if="activeStyle === 'fire-energy'" class="demo-wrapper">
            <view class="lava-energy-ring">
              <view class="lava-inner"></view>
            </view>
            <view class="center-text text-orange font-bold">{{ progressVal }}%</view>
          </view>

          <!-- 19. Industrial Gear -->
          <view v-else-if="activeStyle === 'spinning-gear'" class="demo-wrapper">
            <view class="gear-ring-box">
              <view class="gear-teeth-rotate" :style="{ animationDuration: `${animSpeed}s` }"></view>
              <view class="gear-core"></view>
            </view>
            <view class="center-text text-amber" style="color: #d97706;">{{ progressVal }}%</view>
          </view>

          <!-- 20. Interactive Draggable Water -->
          <view v-else-if="activeStyle === 'interactive-drag'" class="demo-wrapper flex-column items-center justify-between">
            <view class="wave-bubble-box interactive-bubble" :style="{ '--brand': displayColor }">
              <view
                class="wave-wave-layer"
                :class="{ 'wave-agitated': isDragging }"
                :style="{ bottom: `${progressVal}%` }"
              ></view>
              <view
                class="wave-wave-second"
                :class="{ 'wave-agitated-second': isDragging }"
                :style="{ bottom: `${progressVal}%` }"
              ></view>
              <view class="center-text-on-wave drag-hud">
                <text class="hud-pct">{{ progressVal }}%</text>
                <text class="hud-sub">{{ isDragging ? '↕️ 拖动中' : '↕️ 上下滑动' }}</text>
              </view>
            </view>
          </view>

          <!-- 21. Gaming HP & MP Bubbles -->
          <view v-else-if="activeStyle === 'gaming-hp-mp'" class="demo-wrapper hp-mp-view">
            <!-- HP Bubble (Red / Green) -->
            <view class="hp-mp-column">
              <view class="wave-bubble-box hp-orb" :style="{ '--brand': displayColor }">
                <view class="wave-wave-layer" :style="{ bottom: `${progressVal}%` }"></view>
                <view class="wave-wave-second" :style="{ bottom: `${progressVal}%` }"></view>
                <view class="center-text-on-wave text-xs font-bold">{{ progressVal }}%</view>
              </view>
              <text class="hp-mp-label text-red">HP (生命值)</text>
            </view>

            <!-- MP Bubble (Blue) -->
            <view class="hp-mp-column">
              <view class="wave-bubble-box mp-orb" :style="{ '--brand': '#2563eb' }">
                <view class="wave-wave-layer" :style="{ bottom: '85%' }"></view>
                <view class="wave-wave-second" :style="{ bottom: '85%' }"></view>
                <view class="center-text-on-wave text-xs font-bold">85%</view>
              </view>
              <text class="hp-mp-label text-blue">MP (魔法值)</text>
            </view>
          </view>

          <!-- 22. RPG Crystal Heart HP -->
          <view v-else-if="activeStyle === 'crystal-heart'" class="demo-wrapper">
            <view class="crystal-heart-box" :style="{ '--brand': displayColor }">
              <svg class="heart-mask-svg" viewBox="0 0 100 100">
                <path d="M50 88.25 C-3.6 57.6 -3.6 23.4 32.4 12.6 C43.2 9 50 19.8 50 19.8 C50 19.8 56.8 9 67.6 12.6 C103.6 23.4 103.6 57.6 50 88.25 Z" />
              </svg>
              <view class="wave-wave-layer" :style="{ bottom: `${progressVal}%` }"></view>
              <view class="wave-wave-second" :style="{ bottom: `${progressVal}%`, opacity: 0.4 }"></view>
              <view class="center-text-on-wave font-bold text-xs" style="margin-top: -10rpx;">HP {{ progressVal }}%</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 2. Styles Selector List (Horizontal Swipe) -->
      <view class="style-selector-section mt-3">
        <view class="section-head font-bold text-white mb-2 flex justify-between items-center">
          <text>🔮 22 种极客特效切选 (左右滑动)</text>
          <text class="text-muted text-xs">← 左右滑动浏览 →</text>
        </view>
        <scroll-view class="horizontal-style-scroll" scroll-x="true" show-scrollbar="false">
          <view class="horizontal-scroll-content">
            <view
              v-for="item in stylesList"
              :key="item.id"
              :class="['style-card-item-horizontal', { active: activeStyle === item.id }]"
              @click="selectStyle(item.id)"
            >
              <view class="style-card-name font-bold">{{ item.name }}</view>
              <view class="style-card-desc">{{ item.desc }}</view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 3. Controls Panel -->
      <view class="control-panel-section mt-3">
        <view class="flex justify-between items-center mb-3">
          <text class="control-label font-bold text-white">🎛️ 调试控制面板</text>
          <wd-button size="small" plain type="primary" @click="randomizeValue">随机数值</wd-button>
        </view>

        <!-- Progress Value -->
        <view class="control-slider-row mb-3">
          <view class="flex justify-between text-muted text-xs mb-1">
            <text>进度百分比 (Progress)</text>
            <text class="text-brand">{{ progressVal }}%</text>
          </view>
          <wd-slider v-model="progressVal" />
        </view>

        <!-- Speed -->
        <view class="control-slider-row mb-3">
          <view class="flex justify-between text-muted text-xs mb-1">
            <text>动画速度 (Animation Duration)</text>
            <text class="text-brand">{{ animSpeed }}s</text>
          </view>
          <wd-slider v-model="animSpeed" :min="0.5" :max="5.0" :step="0.1" />
        </view>

        <!-- Color preset -->
        <view class="control-slider-row mb-3">
          <view class="text-muted text-xs mb-1">自定义主题颜色 (Theme Color)</view>
          <view class="flex mt-1">
            <view
              v-for="color in colorPresets"
              :key="color"
              :class="['color-preset-dot mr-2', { active: activeColor === color }]"
              :style="{ backgroundColor: color }"
              @click="activeColor = color"
            ></view>
          </view>
        </view>

        <!-- Warning Threshold Settings -->
        <view class="control-slider-row mb-3 flex items-center justify-between border-top-gray pt-2">
          <view class="flex-column" style="flex: 1; margin-right: 20rpx;">
            <text class="text-white text-xs font-bold">⚠️ 启用高额报警变色 (Enable Red Alert)</text>
            <text class="text-muted" style="font-size: 18rpx; line-height: 1.4; display: block;">开启后数值超过设定的临界阈值，进度圆环与水泡会自动变为警示红色并展示报警横幅</text>
          </view>
          <wd-switch v-model="enableWarning" />
        </view>

        <view v-if="enableWarning" class="control-slider-row">
          <view class="flex justify-between text-muted text-xs mb-1">
            <text>报警临界值 (Alarm Threshold)</text>
            <text class="text-red font-bold">{{ warningThreshold }}%</text>
          </view>
          <wd-slider v-model="warningThreshold" :min="10" :max="95" />
        </view>
      </view>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.bubble-gallery-page {
  display: flex;
  flex-direction: column;
  background-color: #0f172a;
  min-height: 100vh;
  padding: 24rpx;
  padding-bottom: 60rpx;
}

.active-demo-container {
  background: #1e293b;
  border-radius: 20rpx;
  border: 1rpx solid #334155;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.active-demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.style-title {
  color: #fff;
  font-size: 28rpx;
  font-weight: 800;
}

.active-demo-wrapper {
  height: 380rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #0f172a;
  border-radius: 16rpx;
  border: 1rpx solid #1e293b;
  overflow: hidden;
}

.demo-wrapper {
  position: relative;
  width: 240rpx;
  height: 240rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SVG ring styling */
.svg-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.svg-bg {
  fill: none;
  stroke: #1e293b;
  stroke-width: 8;
}

.svg-fill {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 314.159; /* 2 * PI * r(50) = 314.159 */
}

.center-text {
  position: absolute;
  font-size: 34rpx;
  font-weight: 900;
  color: #fff;
}

/* Conic gradient */
.conic-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(var(--brand) 0%, var(--brand) var(--pct), #1e293b var(--pct), #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.inner-cut {
  width: 84%;
  height: 84%;
  background: #0f172a;
  border-radius: 50%;
}

/* Wave Bubble */
.wave-bubble-box {
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  border: 4rpx solid var(--brand);
  position: relative;
  overflow: hidden;
  background: #1e293b;
}

.wave-wave-layer {
  position: absolute;
  width: 500rpx;
  height: 500rpx;
  background: var(--brand);
  border-radius: 42%;
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
  animation: waveRotation 3s infinite linear;
  transition: bottom 0.5s ease-out;
  opacity: 0.8;
}

.wave-wave-second {
  position: absolute;
  width: 520rpx;
  height: 520rpx;
  background: var(--brand);
  border-radius: 40%;
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
  animation: waveRotationSecond 5s infinite linear;
  transition: bottom 0.5s ease-out;
  opacity: 0.4;
}

@keyframes waveRotation {
  from { transform: translateX(-50%) rotate(0deg); }
  to { transform: translateX(-50%) rotate(360deg); }
}

@keyframes waveRotationSecond {
  from { transform: translateX(-50%) rotate(360deg); }
  to { transform: translateX(-50%) rotate(0deg); }
}

.center-text-on-wave {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 32rpx;
  font-weight: 900;
  color: #fff;
  z-index: 10;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.5);
}

/* Neon Glow */
.neon-glow-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(var(--brand) var(--pct), transparent var(--pct));
  box-shadow: 0 0 20rpx var(--brand);
  display: flex;
  align-items: center;
  justify-content: center;
}

.neon-inner {
  width: 90%;
  height: 90%;
  background: #0f172a;
  border-radius: 50%;
  border: 1rpx solid var(--brand);
}

.neon-text {
  font-size: 36rpx;
}

/* Dotted Gauge */
.svg-bg.dotted,
.svg-fill.dotted {
  stroke-dasharray: 4 4;
}

/* Concentric */
.concentric-view {
  width: 100%;
  padding: 0 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 24rpx;
}

.concentric-ring-box {
  position: relative;
  width: 200rpx;
  height: 200rpx;
}

.concentric-ring {
  position: absolute;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.outer {
    width: 200rpx;
    height: 200rpx;
    background: conic-gradient(var(--brand) var(--pct), #1e293b var(--pct));
  }
  
  &.inner {
    width: 150rpx;
    height: 150rpx;
    top: 25rpx;
    left: 25rpx;
    background: conic-gradient(var(--brand) var(--pct), #1e293b var(--pct));
  }
}

.concentric-labels {
  display: flex;
  gap: 12rpx;
}

.lbl-row {
  font-size: 24rpx;
  font-weight: 800;
}

/* Glass Wave */
.glass-bubble-card {
  width: 260rpx;
  height: 260rpx;
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-interior {
  width: 210rpx;
  height: 210rpx;
  border: none;
  background: rgba(255, 255, 255, 0.03);
}

/* Teardrop shape */
.teardrop-bubble-box {
  width: 210rpx;
  height: 210rpx;
  border-radius: 0 50% 50% 50%;
  transform: rotate(-135deg);
  border: 4rpx solid var(--brand);
  position: relative;
  overflow: hidden;
  background: #1e293b;
}

.teardrop-wave {
  transform: translateX(-50%) rotate(0deg);
  border-radius: 38%;
}

/* Pulse Ripple */
.ripple-outer-glow {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scale-down {
  width: 180rpx;
  height: 180rpx;
}

.ripple-ring {
  position: absolute;
  width: 180rpx;
  height: 180rpx;
  border: 2rpx solid transparent;
  border-radius: 50%;
  animation: pulseExpansion 2.5s infinite linear;
}

.anim-r1 { animation-delay: 0s; }
.anim-r2 { animation-delay: 1.2s; }

@keyframes pulseExpansion {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}

/* Particle bubble */
.overflow-visible {
  overflow: visible;
}

.particle {
  position: absolute;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  bottom: 0;
  opacity: 0;
  animation: riseAndFade 4s infinite ease-in;
}

.p1 { left: 40rpx; animation-delay: 0s; }
.p2 { left: 100rpx; animation-delay: 1.2s; }
.p3 { left: 150rpx; animation-delay: 2.3s; }
.p4 { left: 180rpx; animation-delay: 0.7s; }

@keyframes riseAndFade {
  0% { transform: translateY(0) scale(0.6); opacity: 0; }
  30% { opacity: 0.6; }
  90% { opacity: 0.3; }
  100% { transform: translateY(-240rpx) scale(1.2); opacity: 0; }
}

/* Segmented Ring */
.segment-ring {
  width: 220rpx;
  height: 220rpx;
  border-radius: 50%;
  position: relative;
  background: #1e293b;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  
  &.seg-1 {
    background: conic-gradient(#ef4444 0%, #ef4444 35%, transparent 35%);
  }
  &.seg-2 {
    background: conic-gradient(transparent 35%, #22c55e 35%, #22c55e 75%, transparent 75%);
  }
  &.seg-3 {
    background: conic-gradient(transparent 75%, #3b82f6 75%, #3b82f6 90%, transparent 90%);
  }
}

/* Countdown dial */
.countdown-dial-box {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  border: 4rpx solid #334155;
  position: relative;
  background: #0f172a;
  overflow: hidden;
}

.dial-sweeper {
  position: absolute;
  width: 100%;
  height: 100%;
  background: conic-gradient(rgba(6, 182, 212, 0.4) 0%, transparent 40%);
  animation: dialSpin 3s infinite linear;
}

@keyframes dialSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.dial-cover {
  position: absolute;
  width: 92%;
  height: 92%;
  top: 4%;
  left: 4%;
  background: #0f172a;
  border-radius: 50%;
}

/* Retro 8-Bit Pixel */
.retro-pixel-ring {
  width: 200rpx;
  height: 200rpx;
  background: repeating-conic-gradient(var(--brand) 0% var(--pct), #1e293b var(--pct) 100%);
  border: 8rpx dashed #334155;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pixel-inner {
  width: 82%;
  height: 82%;
  background: #0f172a;
}

/* Metallic 3D */
.metallic-ring {
  width: 230rpx;
  height: 230rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37 0%, #aa7c11 50%, #d4af37 100%);
  box-shadow: inset 0 2rpx 8rpx rgba(255,255,255,0.4), 0 8rpx 16rpx rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metal-fill {
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background: conic-gradient(#fff5cc var(--pct), #5a4205 var(--pct));
  display: flex;
  align-items: center;
  justify-content: center;
}

.metal-inner {
  width: 86%;
  height: 86%;
  background: radial-gradient(circle, #2c1e02 0%, #0f172a 100%);
  border-radius: 50%;
}

/* Semi circle pointer */
.semi-circle-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.semi-circle-gauge {
  width: 260rpx;
  height: 130rpx;
  border-radius: 130rpx 130rpx 0 0;
  background: #1e293b;
  position: relative;
  overflow: hidden;
}

.semi-fill {
  position: absolute;
  width: 260rpx;
  height: 260rpx;
  border-radius: 50%;
  background: var(--brand);
  transform-origin: 50% 50%;
  top: 0;
}

.semi-cover {
  position: absolute;
  width: 210rpx;
  height: 105rpx;
  border-radius: 105rpx 105rpx 0 0;
  background: #0f172a;
  bottom: 0;
  left: 25rpx;
}

.semi-pointer {
  position: absolute;
  width: 8rpx;
  height: 110rpx;
  background: #ef4444;
  bottom: 0;
  left: 126rpx;
  transform-origin: 50% 100%;
  transition: transform 0.4s ease-out;
}

.semi-value {
  color: #fff;
  font-size: 26rpx;
  margin-top: 14rpx;
  font-weight: 800;
}

/* Heartbeat Rhythm */
.heart-pulse-box {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart-icon-beat {
  position: absolute;
  font-size: 60rpx;
  animation: heartScale 0.8s infinite alternate ease-in-out;
}

@keyframes heartScale {
  from { transform: scale(0.9); }
  to { transform: scale(1.15); }
}

/* Lava Energy Flame */
.lava-energy-ring {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: radial-gradient(circle, #f59e0b 0%, #ef4444 80%);
  filter: blur(2rpx);
  animation: lavaPulse 1.8s infinite alternate ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes lavaPulse {
  0% { transform: scale(1); box-shadow: 0 0 10rpx #f97316; }
  100% { transform: scale(1.08); box-shadow: 0 0 35rpx #ef4444; }
}

.lava-inner {
  width: 82%;
  height: 82%;
  background: #0f172a;
  border-radius: 50%;
}

/* Industrial Gear */
.gear-ring-box {
  width: 200rpx;
  height: 200rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gear-teeth-rotate {
  position: absolute;
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  border: 12rpx dashed #d97706;
  animation: gearSpin 6s infinite linear;
}

@keyframes gearSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

.gear-core {
  position: absolute;
  width: 140rpx;
  height: 140rpx;
  background: #0f172a;
  border-radius: 50%;
  border: 4rpx solid #d97706;
}

/* Draggable Touch Wave Bubble */
.interactive-bubble {
  width: 260rpx;
  height: 260rpx;
  box-shadow: 0 0 30rpx rgba(255,255,255,0.06);
}

.wave-agitated {
  animation: waveRotation 1.5s infinite linear !important;
  border-radius: 38% !important;
}

.wave-agitated-second {
  animation: waveRotationSecond 2.5s infinite linear !important;
  border-radius: 35% !important;
}

.drag-hud {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hud-pct {
  font-size: 38rpx;
  font-weight: 900;
}

.hud-sub {
  font-size: 16rpx;
  opacity: 0.6;
  margin-top: 4rpx;
}

/* Control Panel Section */
.control-panel-section {
  background: #1e293b;
  border-radius: 20rpx;
  border: 1rpx solid #334155;
  padding: 30rpx;
}

.control-label {
  font-size: 26rpx;
}

.color-preset-dot {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  cursor: pointer;
  border: 4rpx solid transparent;
  transition: all 0.2s ease;
  
  &.active {
    border-color: #fff;
    transform: scale(1.15);
  }
}

/* Styles Selector Section */
.style-selector-section {
  background: #1e293b;
  border-radius: 20rpx;
  border: 1rpx solid #334155;
  padding: 30rpx;
}

.horizontal-style-scroll {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
}

.horizontal-scroll-content {
  display: flex;
  flex-direction: row;
  padding: 10rpx 4rpx;
  gap: 16rpx;
}

.style-card-item-horizontal {
  flex-shrink: 0;
  width: 290rpx;
  border: 1rpx solid #334155;
  border-radius: 12rpx;
  background: #0f172a;
  padding: 18rpx;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: normal;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  &.active {
    border-color: var(--app-brand);
    background: rgba(39, 86, 216, 0.15);
    box-shadow: 0 0 12rpx rgba(39, 86, 216, 0.25);
    
    .style-card-name {
      color: var(--app-brand);
    }
  }
}

.style-card-name {
  color: #fff;
  font-size: 23rpx;
}

.style-card-desc {
  margin-top: 6rpx;
  color: #64748b;
  font-size: 17rpx;
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-white { color: #fff; }
.text-muted { color: #64748b; }
.text-brand { color: var(--app-brand); }
.text-sm { font-size: 24rpx; }
.text-xs { font-size: 20rpx; }
.mr-2 { margin-right: 16rpx; }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mb-1 { margin-bottom: 8rpx; }
.mb-2 { margin-bottom: 16rpx; }
.mb-3 { margin-bottom: 24rpx; }
.p-2 { padding: 16rpx; }
.p-3 { padding: 24rpx; }

/* Gaming HP & MP styling */
.hp-mp-view {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.hp-mp-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.hp-mp-label {
  font-size: 22rpx;
  font-weight: 800;
  margin-top: 10rpx;
}

.hp-orb {
  box-shadow: 0 0 16rpx rgba(34, 197, 94, 0.2);
}

.mp-orb {
  box-shadow: 0 0 16rpx rgba(37, 99, 235, 0.2);
}

/* RPG Crystal Heart */
.crystal-heart-box {
  width: 200rpx;
  height: 200rpx;
  position: relative;
  overflow: hidden;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid var(--brand);
  
  -webkit-clip-path: path("M50,88.25 C-3.6,57.6 -3.6,23.4 32.4,12.6 C43.2,9 50,19.8 50,19.8 C50,19.8 56.8,9 67.6,12.6 C103.6,23.4 103.6,57.6 50,88.25 Z");
  clip-path: path("M50,88.25 C-3.6,57.6 -3.6,23.4 32.4,12.6 C43.2,9 50,19.8 50,19.8 C50,19.8 56.8,9 67.6,12.6 C103.6,23.4 103.6,57.6 50,88.25 Z");
}

.heart-mask-svg {
  position: absolute;
  width: 100rpx;
  height: 100rpx;
  fill: none;
  stroke: var(--brand);
  stroke-width: 4;
  z-index: 12;
  pointer-events: none;
}

/* Warning Alerts styling */
.alarm-banner {
  background: rgba(239, 68, 68, 0.15);
  border: 1rpx solid rgba(239, 68, 68, 0.4);
  border-radius: 10rpx;
  padding: 14rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10rpx;
  
  &.flashing-red {
    background: rgba(239, 68, 68, 0.25);
    border-color: #ef4444;
    animation: dangerFlash 1s infinite alternate ease-in-out;
  }
}

@keyframes dangerFlash {
  0% { box-shadow: 0 0 4rpx rgba(239,68,68,0.3); opacity: 0.8; }
  100% { box-shadow: 0 0 16rpx rgba(239,68,68,0.7); opacity: 1; }
}

.alarm-text {
  color: #ef4444;
  font-size: 21rpx;
  font-weight: 800;
  text-align: center;
}

.border-top-gray {
  border-top: 1rpx solid #334155;
}

.text-red {
  color: #ef4444;
}

.text-green {
  color: #22c55e;
}

.text-blue {
  color: #2563eb;
}

.text-xxs {
  font-size: 16rpx;
}
</style>
