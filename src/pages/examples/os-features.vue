<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('os-toast')

// Active OS feature ID (0 is catalog/lobby, 1-8 is specific simulators)
const activeId = ref(0)

onLoad((query) => {
  if (typeof query?.id === 'string') {
    activeId.value = parseInt(query.id) || 0
  }
})

function goBackToCatalog() {
  activeId.value = 0
  uni.redirectTo({
    url: '/pages/examples/os-features'
  })
}

function selectTemplate(id: number) {
  activeId.value = id
  uni.navigateTo({
    url: `/pages/examples/os-features?id=${id}`
  })
}

// 8 interactive OS modules list
const templatesList = [
  { id: 1, title: 'iOS 阻尼回弹 vs Android 边界发光', desc: '果冻物理拉伸回弹与 Android 触顶淡蓝色发光弧线对比。', tag: '滚动物理' },
  { id: 2, title: 'iOS 灵动岛弹性展开通知', desc: '药丸顶部胶囊非线性拉伸动画，展示音乐、下载及来电通知。', tag: '灵动岛' },
  { id: 3, title: 'iOS 3D Touch 快捷毛玻璃菜单', desc: '重压图标触发微颤，淡出磨砂毛玻璃快捷功能层。', tag: '手势按压' },
  { id: 4, title: '苹果非线性弹簧物理弹窗', desc: '利用三次贝塞尔曲线模拟弹性过冲回弹的 Spring 弹窗。', tag: '动画物理' },
  { id: 5, title: 'Android 分屏多窗口上下拉伸', desc: '模拟分屏，自由拖动中间横杆调节两层虚拟应用高度。', tag: '多窗口' },
  { id: 6, title: 'Android 马达震感与波形测试', desc: '微调马达震动阶梯强度，配合声波波幅的震感可视化。', tag: '多端触感' },
  { id: 7, title: 'iOS 毛玻璃磨砂 vs 传统半透明', desc: '实时滑块对比 CSS backdrop-filter 与传统半透明遮罩的视觉差距。', tag: '视觉差异' },
  { id: 8, title: 'iOS 侧滑阻尼返回手势模拟', desc: '模拟 iOS 从边缘划出新页面的阴影跟随与回弹返回逻辑。', tag: '侧滑返回' }
]

// ==========================================
// 各个交互场景的物理状态变量与函数
// ==========================================

// 1. Jelly Scroll vs Android Glow
const scrollType = ref<'ios' | 'android'>('ios')
const scrollOffset = ref(0)
const isDraggingScroll = ref(false)
const glowOpacity = ref(0)
const glowScale = ref(1.0)
let scrollStartY = 0

function handleScrollTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  scrollStartY = touch.clientY
  isDraggingScroll.value = true
}

function handleScrollTouchMove(e: TouchEvent) {
  if (!isDraggingScroll.value) return
  const touch = e.touches[0]
  const deltaY = touch.clientY - scrollStartY
  
  if (deltaY > 0) {
    if (scrollType.value === 'ios') {
      // iOS Rubber-band effect: damping factor = 0.35
      scrollOffset.value = deltaY * 0.35
    } else {
      // Android Glow: increase opacity and scale
      glowOpacity.value = Math.min(1.0, deltaY / 150)
      glowScale.value = 1.0 + (deltaY / 250)
    }
  }
}

function handleScrollTouchEnd() {
  isDraggingScroll.value = false
  if (scrollType.value === 'ios') {
    // Return with elastic bounce transition
    scrollOffset.value = 0
  } else {
    // Reset glow smoothly
    glowOpacity.value = 0
    glowScale.value = 1.0
  }
}

// 2. Dynamic Island
const islandState = ref<'normal' | 'music' | 'download' | 'call'>('normal')
const downloadPercent = ref(0)
let downloadTimer: any = null

function triggerIsland(state: 'normal' | 'music' | 'download' | 'call') {
  islandState.value = state
  clearInterval(downloadTimer)
  
  if (state === 'download') {
    downloadPercent.value = 0
    downloadTimer = setInterval(() => {
      if (downloadPercent.value < 100) {
        downloadPercent.value += 10
      } else {
        clearInterval(downloadTimer)
        setTimeout(() => { islandState.value = 'normal' }, 1000)
      }
    }, 400)
  }
}

// 3. 3D Touch
const show3DMenu = ref(false)
const iconPressed = ref(false)

function pressIconStart() {
  iconPressed.value = true
}

function pressIconEnd() {
  if (iconPressed.value) {
    iconPressed.value = false
    show3DMenu.value = true
    toast.success('Haptic Tick! 触发 3D Touch 菜单')
  }
}

// 4. Spring Modal
const showSpringModal = ref(false)

// 5. Android Split Screen Drag
const topAppHeight = ref(200) // in rpx
const isDraggingDivider = ref(false)
let dividerStartY = 0

function handleDividerTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  dividerStartY = touch.clientY
  isDraggingDivider.value = true
}

function handleDividerTouchMove(e: TouchEvent) {
  if (!isDraggingDivider.value) return
  const touch = e.touches[0]
  const deltaY = touch.clientY - dividerStartY
  dividerStartY = touch.clientY
  topAppHeight.value = Math.min(320, Math.max(80, topAppHeight.value + deltaY))
}

function handleDividerTouchEnd() {
  isDraggingDivider.value = false
}

// 6. Haptic ticks
const hapticStrength = ref<'light' | 'medium' | 'heavy' | 'none'>('none')

function triggerHaptic(level: 'light' | 'medium' | 'heavy') {
  hapticStrength.value = level
  toast.success(`马达发射：${level === 'light' ? '轻微滴答' : level === 'medium' ? '中度脉冲' : '重击撞击'}`)
  setTimeout(() => {
    hapticStrength.value = 'none'
  }, 600)
}

// 7. Frosted glass slider
const glassBlur = ref(10)
const glassType = ref<'glass' | 'plain'>('glass')

// 8. Swipe back
const swipeOffset = ref(0)
const isDraggingSwipe = ref(false)
let swipeStartX = 0

function handleSwipeTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  swipeStartX = touch.clientX
  if (swipeStartX < 50) { // Only trigger swipe from left boundary (50px width)
    isDraggingSwipe.value = true
  }
}

function handleSwipeTouchMove(e: TouchEvent) {
  if (!isDraggingSwipe.value) return
  const touch = e.touches[0]
  const deltaX = touch.clientX - swipeStartX
  if (deltaX > 0) {
    swipeOffset.value = deltaX * 0.8
  }
}

function handleSwipeTouchEnd() {
  if (!isDraggingSwipe.value) return
  isDraggingSwipe.value = false
  if (swipeOffset.value > 150) {
    toast.success('触发侧滑返回上一页')
    setTimeout(() => {
      goBackToCatalog()
    }, 500)
  } else {
    swipeOffset.value = 0
  }
}
</script>

<template>
  <PageShell title="系统特性百宝箱" description="深度探索 iOS 与 Android 底层物理反馈，打磨极致的跨端阻尼细节。">
    <view class="os-features-page">
      <wd-toast selector="os-toast" />

      <!-- ==========================================
           1. 目录视图大厅 - activeId === 0
           ========================================== -->
      <view v-if="activeId === 0" class="os-lobby">
        <view class="lobby-banner-box">
          <view class="banner-title">OS 物理触感模拟</view>
          <view class="banner-desc">模拟不同手机系统级操作的交互细节与触觉反馈，赋能开发高级动效。</view>
        </view>

        <view class="lobby-grid">
          <view
            v-for="item in templatesList"
            :key="item.id"
            class="lobby-item"
            @click="selectTemplate(item.id)"
          >
            <view class="item-meta">
              <text class="item-id">#{{ String(item.id).padStart(2, '0') }}</text>
              <wd-tag size="small" type="primary" plain>{{ item.tag }}</wd-tag>
            </view>
            <view class="item-title">{{ item.title }}</view>
            <view class="item-desc">{{ item.desc }}</view>
          </view>
        </view>
      </view>

      <!-- ==========================================
           2. 系统特性演示画布 - activeId 1 至 8
           ========================================== -->
      <view v-else class="os-sandbox">
        <view class="sandbox-head">
          <wd-button size="small" type="neutral" icon="arrow-left" plain @click="goBackToCatalog">返回目录</wd-button>
          <text class="sandbox-title">{{ templatesList[activeId - 1]?.title }}</text>
        </view>

        <view class="sandbox-body">
          
          <!-- ID 1: Jelly scroll vs Android Glow -->
          <view v-if="activeId === 1" class="jelly-glow-wrapper">
            <view class="os-tab-select mt-2">
              <wd-button size="small" :type="scrollType === 'ios' ? 'primary' : 'neutral'" @click="scrollType = 'ios'">iOS 果冻回弹</wd-button>
              <wd-button size="small" :type="scrollType === 'android' ? 'primary' : 'neutral'" class="ml-2" @click="scrollType = 'android'">Android 触顶发光</wd-button>
            </view>
            
            <view class="scroll-container-outer mt-3">
              <view
                class="scroll-box-inner"
                :style="{
                  transform: 'translateY(' + scrollOffset + 'rpx)',
                  transition: isDraggingScroll ? 'none' : 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }"
                @touchstart="handleScrollTouchStart"
                @touchmove="handleScrollTouchMove"
                @touchend="handleScrollTouchEnd"
              >
                <!-- Android Glow arc overlay -->
                <view
                  v-if="scrollType === 'android'"
                  class="android-glow-overlay"
                  :style="{
                    opacity: glowOpacity,
                    transform: 'scaleX(' + glowScale + ')'
                  }"
                ></view>

                <view class="scroll-inner-card text-center">
                  <text class="emoji-indicator">{{ scrollType === 'ios' ? '🍮' : '⚡' }}</text>
                  <view class="card-title font-bold mt-2">请按住卡片往下拖拽</view>
                  <view class="card-desc mt-1">
                    {{ scrollType === 'ios' ? '体验过冲回弹的果冻阻尼拉伸' : '体验到达顶部边界时扩散的淡蓝色发光弧线' }}
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- ID 2: Dynamic Island -->
          <view v-slot:default v-else-if="activeId === 2" class="island-wrapper text-center">
            <!-- Simulated phone bezel top -->
            <view class="iphone-bezel-top relative-context">
              <!-- Dynamic Island Capsule -->
              <view :class="['dynamic-island-capsule', islandState]">
                <!-- Normal pill -->
                <view v-if="islandState === 'normal'" class="island-content-normal">
                  <text class="island-camera">●</text>
                </view>
                
                <!-- Music expanded -->
                <view v-else-if="islandState === 'music'" class="island-content-music flex items-center justify-between">
                  <text class="music-icon">🎵</text>
                  <text class="music-name text-brand">Vaporwave Beats</text>
                  <text class="music-wave-bar">|||||</text>
                </view>

                <!-- Download expanded -->
                <view v-else-if="islandState === 'download'" class="island-content-download flex items-center justify-between">
                  <text class="dl-label">Downloading App...</text>
                  <text class="dl-num text-brand font-bold">{{ downloadPercent }}%</text>
                </view>

                <!-- Call expanded -->
                <view v-else-if="islandState === 'call'" class="island-content-call">
                  <view class="call-row flex items-center justify-between">
                    <text class="call-avatar">👤</text>
                    <text class="call-name">Steve Jobs</text>
                    <view class="call-actions-row">
                      <wd-button size="small" type="danger" circle @click="triggerIsland('normal')">拒</wd-button>
                      <wd-button size="small" type="success" circle class="ml-2" @click="toast.success('接听成功')">接</wd-button>
                    </view>
                  </view>
                </view>
              </view>
            </view>

            <view class="island-actions mt-4">
              <wd-button size="small" type="primary" plain @click="triggerIsland('music')">播放音乐</wd-button>
              <wd-button size="small" type="primary" plain class="ml-2" @click="triggerIsland('download')">同步下载</wd-button>
              <wd-button size="small" type="primary" plain class="ml-2" @click="triggerIsland('call')">来电通话</wd-button>
            </view>
          </view>

          <!-- ID 3: 3D Touch Context Menu -->
          <view v-else-if="activeId === 3" class="touch-wrapper relative-context">
            <!-- Blur backdrop overlay -->
            <view v-if="show3DMenu" class="blur-menu-mask" @click="show3DMenu = false"></view>

            <!-- Active App Icon Container -->
            <view class="app-icon-container text-center">
              <view
                :class="['app-icon-box', { pressed: iconPressed, active: show3DMenu }]"
                @touchstart="pressIconStart"
                @touchend="pressIconEnd"
              >
                ⚙️
              </view>
              <view class="icon-label mt-2">长按图标触发 3D Touch</view>

              <!-- Context menu popover -->
              <view v-if="show3DMenu" class="popover-context-menu">
                <view class="menu-item border-bottom" @click="show3DMenu = false; toast.success('清理缓存成功')">🧹 清理缓存</view>
                <view class="menu-item border-bottom" @click="show3DMenu = false; toast.success('开启深色模式')">🌙 护眼深色</view>
                <view class="menu-item text-red" @click="show3DMenu = false; toast.success('已卸载应用(模拟)')">🗑️ 卸载组件</view>
              </view>
            </view>
          </view>

          <!-- ID 4: Spring Physics Modal -->
          <view v-else-if="activeId === 4" class="spring-wrapper text-center">
            <wd-button type="primary" @click="showSpringModal = true">打开 Spring 弹窗</wd-button>
            
            <wd-popup v-model="showSpringModal" position="center" custom-class="popup-bezel-spring">
              <view class="spring-modal-box">
                <view class="s-modal-title">物理弹簧过冲动效</view>
                <view class="s-modal-body mt-2">使用 Apple 经典物理阻尼曲线开盖，展现高级震颤回弹感。</view>
                <wd-button type="primary" block class="mt-4" @click="showSpringModal = false">确认关闭</wd-button>
              </view>
            </wd-popup>
          </view>

          <!-- ID 5: Android Split Screen resizer -->
          <view v-else-if="activeId === 5" class="split-screen-wrapper">
            <view class="split-screen-box">
              <!-- Top Virtual App Window -->
              <view class="split-app-top" :style="{ height: topAppHeight + 'rpx' }">
                <text class="app-lbl text-brand">🗺️ 顶部应用：虚拟高德地图</text>
              </view>

              <!-- Resize divider bar handle -->
              <view
                class="split-divider-handle"
                @touchstart="handleDividerTouchStart"
                @touchmove="handleDividerTouchMove"
                @touchend="handleDividerTouchEnd"
              >
                <view class="drag-bar-indicator"></view>
              </view>

              <!-- Bottom Virtual App Window -->
              <view class="split-app-bottom">
                <text class="app-lbl text-orange">💬 底部应用：虚拟微信聊天</text>
              </view>
            </view>
            <view class="split-tips mt-2 text-center">按住中间黑色横杠往上/下拖动，模拟分屏拉伸</view>
          </view>

          <!-- ID 6: Haptic chart simulator -->
          <view v-else-if="activeId === 6" class="haptic-wrapper text-center">
            <view class="haptic-graph-box">
              <!-- Seismic / wave visualizer -->
              <view :class="['wave-line', hapticStrength]">
                <view class="wave-bar w1"></view>
                <view class="wave-bar w2"></view>
                <view class="wave-bar w3"></view>
                <view class="wave-bar w4"></view>
                <view class="wave-bar w5"></view>
              </view>
            </view>
            
            <view class="haptic-buttons mt-4">
              <wd-button size="small" type="primary" plain @click="triggerHaptic('light')">轻微滴答</wd-button>
              <wd-button size="small" type="primary" plain class="ml-2" @click="triggerHaptic('medium')">中度脉冲</wd-button>
              <wd-button size="small" type="primary" plain class="ml-2" @click="triggerHaptic('heavy')">重击撞击</wd-button>
            </view>
          </view>

          <!-- ID 7: Frosted glass -->
          <view v-else-if="activeId === 7" class="glass-wrapper relative-context">
            <view class="glass-tab-header">
              <wd-button size="small" :type="glassType === 'glass' ? 'primary' : 'neutral'" @click="glassType = 'glass'">iOS 毛玻璃</wd-button>
              <wd-button size="small" :type="glassType === 'plain' ? 'primary' : 'neutral'" class="ml-2" @click="glassType = 'plain'">普通半透明</wd-button>
            </view>
            
            <view class="glass-bg-art mt-3 relative-context overflow-hidden">
              <view class="colorful-circle pos-left-top"></view>
              <view class="colorful-circle pos-right-bottom"></view>
              
              <!-- Frosty cover card overlay -->
              <view
                :class="['glass-cover-card', glassType]"
                :style="{
                  backdropFilter: glassType === 'glass' ? 'blur(' + glassBlur + 'px)' : 'none'
                }"
              >
                <view class="glass-inner-txt font-bold">iOS Backdrop Blur</view>
                <view class="glass-inner-desc">移动滑杆，调整高斯模糊像素半径，观察透底渲染变化。</view>
              </view>
            </view>

            <view class="blur-slider-control mt-3" v-if="glassType === 'glass'">
              <text class="lbl-txt">模糊半径: {{ glassBlur }}px</text>
              <slider :value="glassBlur" :min="1" :max="30" @change="glassBlur = $event.detail.value" active-color="#1e88e5" />
            </view>
          </view>

          <!-- ID 8: Swipe back gesture -->
          <view v-else-if="activeId === 8" class="swipe-back-wrapper relative-context">
            <view
              class="swipe-sensor-area"
              @touchstart="handleSwipeTouchStart"
              @touchmove="handleSwipeTouchMove"
              @touchend="handleSwipeTouchEnd"
            >
              <!-- Virtual sliding page with shadow boundary -->
              <view
                class="swipe-slide-page"
                :style="{
                  transform: 'translateX(' + swipeOffset + 'rpx)',
                  boxShadow: swipeOffset > 0 ? '0 0 30rpx rgba(0,0,0,0.15)' : 'none',
                  transition: isDraggingSwipe ? 'none' : 'transform 0.4s ease'
                }"
              >
                <view class="slide-inner-content text-center">
                  <text class="slide-icon">⬅️</text>
                  <view class="slide-title font-bold mt-2">请按住左边缘往右滑动</view>
                  <view class="slide-desc mt-1">滑动距离大于屏幕的一半将返回上一页目录</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.os-features-page {
  padding-bottom: 60rpx;
}

/* ==========================================
   系统大厅目录列表样式
   ========================================== */
.os-lobby {
  display: grid;
  gap: 28rpx;
}

.lobby-banner-box {
  background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%);
  border-radius: 16rpx;
  padding: 36rpx;
  color: #fff;
  box-shadow: 0 8rpx 20rpx rgba(79, 70, 229, 0.25);
}

.banner-title {
  font-size: 32rpx;
  font-weight: 900;
  margin-bottom: 12rpx;
}

.banner-desc {
  font-size: 22rpx;
  opacity: 0.85;
  line-height: 1.5;
}

.lobby-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.lobby-item {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.01);
  
  &:active {
    background: #f1f5f9;
  }
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-id {
  font-size: 20rpx;
  color: var(--app-muted);
  font-weight: 800;
}

.item-title {
  font-size: 24rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.item-desc {
  font-size: 18rpx;
  color: var(--app-muted);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ==========================================
   系统特性演示沙盒画布
   ========================================== */
.os-sandbox {
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #fff;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.02);
}

.sandbox-head {
  display: flex;
  align-items: center;
  gap: 20rpx;
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 20rpx;
  margin-bottom: 24rpx;
}

.sandbox-title {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--app-brand);
}

.sandbox-body {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 24rpx;
  min-height: 420rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.font-bold { font-weight: 800; }
.text-brand { color: var(--app-brand); }
.text-red { color: #ef4444; }
.text-orange { color: #f97316; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-4 { margin-top: 32rpx; }
.ml-2 { margin-left: 16rpx; }
.text-center { text-align: center; }
.relative-context { position: relative; }
.overflow-hidden { overflow: hidden; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.border-bottom { border-bottom: 1rpx solid var(--app-line); }

/* Sub-views style templates details */

/* 1. Jelly Scroll vs Android Glow */
.scroll-container-outer {
  height: 320rpx;
  background: #fff;
  border-radius: 12rpx;
  border: 1rpx solid var(--app-line);
  position: relative;
  overflow: hidden;
}

.scroll-box-inner {
  height: 100%;
  padding: 24rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.android-glow-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30rpx;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0) 70%);
  border-radius: 0 0 100rpx 100rpx;
  pointer-events: none;
  z-index: 10;
  transition: opacity 0.1s ease, transform 0.1s ease;
}

.scroll-inner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.emoji-indicator { font-size: 80rpx; }
.card-title { font-size: 24rpx; color: var(--app-ink); }
.card-desc { font-size: 18rpx; color: var(--app-muted); line-height: 1.4; }

/* 2. Dynamic Island */
.iphone-bezel-top {
  height: 160rpx;
  background: #000;
  border-radius: 20rpx;
  padding: 16rpx;
  box-sizing: border-box;
}

.dynamic-island-capsule {
  background: #000;
  border-radius: 99rpx;
  margin: 0 auto;
  border: 1rpx solid #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: #fff;
  transition: all 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.2);
  
  &.normal {
    width: 180rpx;
    height: 48rpx;
  }
  
  &.music {
    width: 320rpx;
    height: 64rpx;
    padding: 0 20rpx;
  }
  
  &.download {
    width: 320rpx;
    height: 64rpx;
    padding: 0 20rpx;
  }
  
  &.call {
    width: 360rpx;
    height: 100rpx;
    padding: 0 24rpx;
  }
}

.island-camera {
  color: #1e293b;
  font-size: 16rpx;
}

.music-icon { font-size: 28rpx; }
.music-name { font-size: 18rpx; font-weight: 700; }
.music-wave-bar {
  font-family: monospace;
  font-size: 18rpx;
  letter-spacing: 4rpx;
  color: var(--app-brand);
}

.dl-label { font-size: 18rpx; }
.dl-num { font-size: 20rpx; }

.call-row {
  width: 100%;
}

.call-avatar { font-size: 32rpx; }
.call-name { font-size: 20rpx; font-weight: 800; }
.call-actions-row {
  display: flex;
}

/* 3. 3D Touch Shortcuts */
.app-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-icon-box {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 54rpx;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  box-shadow: 0 6rpx 16rpx rgba(16, 185, 129, 0.25);
  
  &.pressed {
    transform: scale(0.92);
    filter: brightness(0.9);
  }
  
  &.active {
    transform: scale(1.05);
    z-index: 850;
  }
}

.icon-label {
  font-size: 21rpx;
  color: var(--app-ink);
  font-weight: 700;
}

.blur-menu-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(16rpx);
  z-index: 800;
}

.popover-context-menu {
  position: absolute;
  top: 140rpx;
  width: 260rpx;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  border-radius: 16rpx;
  padding: 10rpx;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.15);
  z-index: 850;
  animation: fadeInMenu 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
}

@keyframes fadeInMenu {
  0% { opacity: 0; transform: scale(0.9) translateY(-10rpx); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.menu-item {
  padding: 16rpx 20rpx;
  font-size: 20rpx;
  color: var(--app-ink);
  text-align: left;
  font-weight: 750;
  
  &:active {
    background: rgba(0,0,0,0.05);
  }
}

/* 4. Spring Modal */
.spring-modal-box {
  width: 500rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
}

.s-modal-title {
  font-size: 24rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.s-modal-body {
  font-size: 19rpx;
  color: var(--app-muted);
  line-height: 1.4;
}

/* 5. Android Split screen */
.split-screen-box {
  height: 380rpx;
  border: 2rpx solid var(--app-line);
  background: #fff;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.split-app-top {
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
}

.split-app-bottom {
  flex: 1;
  background: #fef3c7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-lbl {
  font-size: 20rpx;
  font-weight: 800;
}

.split-divider-handle {
  height: 16rpx;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  cursor: row-resize;
  
  &:active {
    background: var(--app-brand);
  }
}

.drag-bar-indicator {
  width: 60rpx;
  height: 4rpx;
  background: #64748b;
  border-radius: 99rpx;
}

.split-tips {
  font-size: 18rpx;
  color: var(--app-muted);
}

/* 6. Haptic tester seismic wave */
.haptic-graph-box {
  height: 180rpx;
  background: #1e293b;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wave-line {
  display: flex;
  align-items: center;
  gap: 8rpx;
  height: 100%;
}

.wave-bar {
  width: 8rpx;
  background: #3b82f6;
  border-radius: 99rpx;
  transition: height 0.1s ease;
  height: 16rpx;
}

.wave-line.light {
  .wave-bar {
    animation: bounceWaveLight 0.4s ease-out;
  }
}

.wave-line.medium {
  .wave-bar {
    animation: bounceWaveMedium 0.4s ease-out;
    background: #10b981;
  }
}

.wave-line.heavy {
  .wave-bar {
    animation: bounceWaveHeavy 0.5s ease-out;
    background: #ef4444;
  }
}

@keyframes bounceWaveLight {
  0% { height: 16rpx; }
  50% { height: 48rpx; }
  100% { height: 16rpx; }
}

@keyframes bounceWaveMedium {
  0% { height: 16rpx; }
  50% { height: 96rpx; }
  100% { height: 16rpx; }
}

@keyframes bounceWaveHeavy {
  0% { height: 16rpx; }
  30% { height: 140rpx; }
  70% { height: 32rpx; }
  100% { height: 16rpx; }
}

/* 7. Glass blur Comparison */
.glass-bg-art {
  height: 240rpx;
  background: linear-gradient(45deg, #fbbf24 0%, #ec4899 100%);
  border-radius: 12rpx;
}

.colorful-circle {
  position: absolute;
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: #38bdf8;
  filter: blur(10px);
}

.pos-left-top { left: -20rpx; top: -20rpx; background: #38bdf8; }
.pos-right-bottom { right: -20rpx; bottom: -20rpx; background: #818cf8; }

.glass-cover-card {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  right: 24rpx;
  bottom: 24rpx;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  box-sizing: border-box;
  
  &.glass {
    background: rgba(255, 255, 255, 0.25);
    border: 1rpx solid rgba(255, 255, 255, 0.4);
    color: #fff;
    text-shadow: 2rpx 2rpx 4rpx rgba(0,0,0,0.15);
  }
  
  &.plain {
    background: rgba(255, 255, 255, 0.85);
    border: 1rpx solid var(--app-line);
    color: var(--app-ink);
  }
}

.glass-inner-txt { font-size: 24rpx; }
.glass-inner-desc { font-size: 16rpx; opacity: 0.85; margin-top: 8rpx; text-align: center; line-height: 1.4; }

.blur-slider-control {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.lbl-txt { font-size: 18rpx; color: var(--app-ink); font-weight: 700; }

/* 8. Swipe back gesture */
.swipe-back-wrapper {
  height: 380rpx;
  background: #1e293b;
  border-radius: 12rpx;
}

.swipe-sensor-area {
  width: 100%;
  height: 100%;
  position: relative;
  touch-action: none;
}

.swipe-slide-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 24rpx;
}

.slide-inner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slide-icon { font-size: 64rpx; }
.slide-title { font-size: 24rpx; color: var(--app-ink); }
.slide-desc { font-size: 18rpx; color: var(--app-muted); line-height: 1.4; }
</style>
