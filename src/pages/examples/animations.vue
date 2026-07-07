<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('anim-toast')

// ==========================================
// 1. 电商走楼梯 (ScrollSpy) 主架构设计
// ==========================================
const activeFloor = ref(0)
const scrollIntoViewId = ref('')
const rightScrollTop = ref(0)

const floors = [
  { id: 'floor-1', title: '按钮微交互', desc: '心跳、抛物线、水波纹' },
  { id: 'floor-2', title: '卡片3D转场', desc: '卡片翻转、探探、3D视差' },
  { id: 'floor-3', title: '文字字形', desc: '故障艺术、打字机、彩虹文字' },
  { id: 'floor-4', title: '数据加载', desc: '数字滚动、沙漏、激光扫描' },
  { id: 'floor-5', title: '进退动效', desc: '粉碎机、果冻列表、液态拉伸' }
]

const floorHeights = ref<number[]>([])

function initFloorOffsets() {
  const query = uni.createSelectorQuery()
  query.selectAll('.floor-section').boundingClientRect((rects) => {
    if (Array.isArray(rects) && rects.length > 0) {
      let accumulated = 0
      const heights: number[] = []
      rects.forEach((rect) => {
        accumulated += rect.height
        heights.push(accumulated)
      })
      floorHeights.value = heights
    }
  }).exec()
}

onReady(() => {
  setTimeout(initFloorOffsets, 600)
})

function selectFloor(index: number) {
  activeFloor.value = index
  scrollIntoViewId.value = floors[index].id
}

function handleRightScroll(e: any) {
  const scrollTop = e.detail.scrollTop
  rightScrollTop.value = scrollTop

  if (floorHeights.value.length === 0) return

  let currentIdx = 0
  for (let i = 0; i < floorHeights.value.length; i++) {
    if (scrollTop + 120 < floorHeights.value[i]) {
      currentIdx = i
      break
    }
    currentIdx = i
  }
  activeFloor.value = currentIdx
}

// ==========================================
// 2. 动效具体逻辑实现
// ==========================================

// 2. 购物车抛物线 (Parabolic Cart Fly)
interface FlyDot {
  id: number
  startX: number
  startY: number
}
const flyDots = ref<FlyDot[]>([])
const cartBouncing = ref(false)

function triggerCartFly(e: any) {
  const touch = e.touches?.[0] || e.detail
  const startX = touch.clientX || 150
  const startY = touch.clientY || 250
  const dotId = Date.now()
  flyDots.value.push({ id: dotId, startX, startY })
  
  setTimeout(() => {
    flyDots.value = flyDots.value.filter(d => d.id !== dotId)
    cartBouncing.value = true
    setTimeout(() => { cartBouncing.value = false }, 500)
  }, 800)
}

// 4. 水波纹扩散按钮 (Ripple Clicking Effect)
interface Ripple {
  id: number
  x: number
  y: number
}
const ripples = ref<Ripple[]>([])

function triggerRipple(e: any) {
  const query = uni.createSelectorQuery()
  query.select('.ripple-btn').boundingClientRect((rect: any) => {
    if (!rect) return
    const touch = e.touches?.[0] || e.detail
    const x = (touch.clientX || 0) - rect.left
    const y = (touch.clientY || 0) - rect.top
    const id = Date.now()
    ripples.value.push({ id, x, y })
    setTimeout(() => {
      ripples.value = ripples.value.filter(r => r.id !== id)
    }, 600)
  }).exec()
}

// 6. 五彩纸屑喷洒 (Confetti Burst)
interface Confetti {
  id: number
  left: number
  top: number
  color: string
  dx: string
  dy: string
  scale: number
}
const confettis = ref<Confetti[]>([])
const confettiColors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

function triggerConfetti(e: any) {
  const touch = e.touches?.[0] || e.detail
  const startX = touch.clientX || 150
  const startY = touch.clientY || 400
  
  for (let i = 0; i < 24; i++) {
    const angle = Math.random() * Math.PI * 2
    const velocity = 50 + Math.random() * 80
    const dx = `${Math.cos(angle) * velocity}px`
    const dy = `${Math.sin(angle) * velocity - 30}px` // slant upwards
    
    confettis.value.push({
      id: Date.now() + i,
      left: startX,
      top: startY,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      dx,
      dy,
      scale: 0.5 + Math.random() * 0.8
    })
  }
  
  setTimeout(() => {
    confettis.value = confettis.value.slice(24)
  }, 1000)
}

// 7. 3D Card Flip
const cardFlipped = ref(false)

// 8. Tinder Swipe Card
const cardX = ref(0)
const cardY = ref(0)
const cardAngle = ref(0)
const swipeStatus = ref<'like' | 'dislike' | ''>('')
const cardRemoved = ref(false)
let startTouchX = 0
let startTouchY = 0

function handleCardTouchStart(e: TouchEvent) {
  if (cardRemoved.value) return
  const touch = e.touches[0]
  startTouchX = touch.clientX
  startTouchY = touch.clientY
  swipeStatus.value = ''
}

function handleCardTouchMove(e: TouchEvent) {
  if (cardRemoved.value) return
  const touch = e.touches[0]
  const deltaX = touch.clientX - startTouchX
  const deltaY = touch.clientY - startTouchY
  
  cardX.value = deltaX
  cardY.value = deltaY
  cardAngle.value = deltaX * 0.08
  
  if (deltaX > 50) swipeStatus.value = 'like'
  else if (deltaX < -50) swipeStatus.value = 'dislike'
  else swipeStatus.value = ''
}

function handleCardTouchEnd() {
  if (cardRemoved.value) return
  if (cardX.value > 120) {
    cardX.value = 400
    cardAngle.value = 30
    cardRemoved.value = true
    toast.success('喜欢')
  } else if (cardX.value < -120) {
    cardX.value = -400
    cardAngle.value = -30
    cardRemoved.value = true
    toast.warning('不喜欢')
  } else {
    cardX.value = 0
    cardY.value = 0
    cardAngle.value = 0
    swipeStatus.value = ''
  }
}

// 9. Elastic bottom drawer
const showElasticDrawer = ref(false)

// 10. Accordion folding
const accordionExpanded = ref(false)

// 11. 3D Perspective Hover Tilt Card
const tiltX = ref(0)
const tiltY = ref(0)

function handleTiltMove(e: TouchEvent) {
  const query = uni.createSelectorQuery()
  query.select('.tilt-card').boundingClientRect((rect: any) => {
    if (!rect) return
    const touch = e.touches[0]
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Relative coordinates
    const relX = touch.clientX - centerX
    const relY = touch.clientY - centerY
    
    // Convert to rotation angles (-15 to 15 degrees)
    tiltX.value = -(relY / (rect.height / 2)) * 15
    tiltY.value = (relX / (rect.width / 2)) * 15
  }).exec()
}

function handleTiltEnd() {
  tiltX.value = 0
  tiltY.value = 0
}

// 12. 3D Cube Fold menu
const cubeFolded = ref(true)

// 15. Typewriter Effect
const typewrittenText = ref('')
const fullText = '写优雅而流畅的代码，创造令人惊叹的动态体验。'
let typewriterTimer: any = null

function runTypewriter() {
  if (typewriterTimer) clearInterval(typewriterTimer)
  typewrittenText.value = ''
  let idx = 0
  typewriterTimer = setInterval(() => {
    typewrittenText.value += fullText[idx]
    idx++
    if (idx >= fullText.length) clearInterval(typewriterTimer)
  }, 150)
}

onMounted(runTypewriter)

// 19. Number Counter Roller
const animatedNumber = ref(0)
let counterTimer: any = null

function startNumberCount() {
  if (counterTimer) clearInterval(counterTimer)
  const target = 18880
  const duration = 1200
  const stepTime = 20
  const steps = duration / stepTime
  let currentStep = 0
  
  counterTimer = setInterval(() => {
    currentStep++
    const progress = currentStep / steps
    const easeProgress = 1 - Math.pow(1 - progress, 2) // ease-out
    animatedNumber.value = Math.floor(easeProgress * target)
    if (currentStep >= steps) {
      animatedNumber.value = target
      clearInterval(counterTimer)
    }
  }, stepTime)
}

onMounted(startNumberCount)

// 22. SVG Circular Progress
const progressPercent = ref(0)
let progressTimer: any = null

function animateProgress() {
  if (progressTimer) clearInterval(progressTimer)
  progressPercent.value = 0
  progressTimer = setInterval(() => {
    if (progressPercent.value < 100) {
      progressPercent.value += 1
    } else {
      clearInterval(progressTimer)
    }
  }, 25)
}

onMounted(animateProgress)

// 25. Scroll Slide-In/Up trigger state
const elementVisible = ref(false)

// 26. Delete card disintegration
const cardDisintegrated = ref(false)

// 27. Jelly staggered list
const listItems = ref<string[]>([])

function loadJellyList() {
  listItems.value = []
  const data = ['极速开发框架', '极致兼容跨端', '炫酷动效预设', '完备主题管理']
  data.forEach((txt, idx) => {
    setTimeout(() => {
      listItems.value.push(txt)
    }, idx * 120)
  })
}

onMounted(loadJellyList)

// 29. Liquid stretch value
const liquidStretch = ref(0)

function handleLiquidTouchMove(e: TouchEvent) {
  const touch = e.touches[0]
  const deltaX = Math.abs(touch.clientX - startTouchX)
  liquidStretch.value = Math.min(deltaX, 120)
}

function handleLiquidTouchEnd() {
  liquidStretch.value = 0
}
</script>

<template>
  <PageShell title="交互动效中心" description="30 种从基础到高级的跨端精美动画，已针对 H5、小程序与 App 优化。">
    <view class="animations-center-page">
      <wd-toast selector="anim-toast" />

      <!-- Floor ScrollSpy Main View -->
      <view class="scrollspy-container">
        
        <!-- Left Categories Sidebar -->
        <view class="left-nav-bar">
          <view
            v-for="(floor, idx) in floors"
            :key="floor.id"
            :class="['nav-item', { active: activeFloor === idx }]"
            @click="selectFloor(idx)"
          >
            <view class="nav-title">{{ floor.title }}</view>
            <view class="nav-desc">{{ floor.desc }}</view>
          </view>
        </view>

        <!-- Right scrollable floors -->
        <scroll-view
          scroll-y
          class="right-scroll-view"
          :scroll-into-view="scrollIntoViewId"
          scroll-with-animation
          @scroll="handleRightScroll"
        >
          <!-- FLOOR 1: Buttons & Micro-Interactions -->
          <view id="floor-1" class="floor-section">
            <view class="floor-header">一、 按钮与微交互</view>
            
            <!-- 1. Heartbeat Button -->
            <view class="effect-box">
              <view class="effect-title">① 呼吸心跳警告按钮</view>
              <view class="pulse-container">
                <view class="heartbeat-btn">爆款特惠中</view>
              </view>
            </view>

            <!-- 2. Parabolic Cart Fly -->
            <view class="effect-box">
              <view class="effect-title">② 购物车抛物线飞入轨迹</view>
              <view class="cart-fly-demo-box">
                <view class="item-shop-card">
                  <text class="item-emoji">🍉</text>
                  <view class="item-info">
                    <text class="item-title">麒麟西瓜 2.5kg</text>
                    <text class="item-price">¥19.90</text>
                  </view>
                  <view class="add-cart-circle" @touchstart="triggerCartFly">
                    <wd-icon name="add" size="18px" />
                  </view>
                </view>

                <!-- Parabolic Flying Dots -->
                <view
                  v-for="dot in flyDots"
                  :key="dot.id"
                  class="fly-dot-axis-x"
                  :style="{ left: dot.startX + 'px', top: dot.startY + 'px' }"
                >
                  <view class="fly-dot-axis-y"></view>
                </view>

                <view :class="['cart-icon-basket', { bounce: cartBouncing }]">
                  <wd-icon name="cart" size="26px" />
                  <view class="cart-badge-count">1</view>
                </view>
              </view>
            </view>

            <!-- 3. Expandable FAB Menu -->
            <view class="effect-box relative-context">
              <view class="effect-title">③ 悬浮球弹性回弹菜单</view>
              <view class="fab-wrapper">
                <view :class="['fab-sub-buttons', { active: fabExpanded }]">
                  <view class="fab-sub bg-blue"><wd-icon name="phone" size="18px" /></view>
                  <view class="fab-sub bg-green"><wd-icon name="chat" size="18px" /></view>
                  <view class="fab-sub bg-orange"><wd-icon name="setting" size="18px" /></view>
                </view>
                <view :class="['fab-trigger', { active: fabExpanded }]" @click="fabExpanded = !fabExpanded">
                  <wd-icon name="add" size="26px" />
                </view>
              </view>
            </view>

            <!-- 4. Water Ripple Clicking Effect -->
            <view class="effect-box">
              <view class="effect-title">④ 触控水波纹扩散按钮</view>
              <view class="ripple-btn-wrapper">
                <view class="ripple-btn" @touchstart="triggerRipple">
                  点击这里触发涟漪
                  <view
                    v-for="ripple in ripples"
                    :key="ripple.id"
                    class="ripple-circle"
                    :style="{ left: ripple.x + 'px', top: ripple.y + 'px' }"
                  ></view>
                </view>
              </view>
            </view>

            <!-- 5. Glowing Streamer Border -->
            <view class="effect-box">
              <view class="effect-title">⑤ 流光溢彩流动边框按钮</view>
              <view class="streamer-btn-container">
                <view class="streamer-btn">
                  <view class="streamer-content">炫彩流光边框</view>
                </view>
              </view>
            </view>

            <!-- 6. Confetti Burst -->
            <view class="effect-box">
              <view class="effect-title">⑥ 纸屑喷洒爆炸特效</view>
              <view class="confetti-trigger-wrap">
                <wd-button type="primary" size="medium" @touchstart="triggerConfetti">
                  点击喷洒彩屑 🎉
                </wd-button>
                <view
                  v-for="c in confettis"
                  :key="c.id"
                  class="confetti-piece"
                  :style="{
                    left: c.left + 'px',
                    top: c.top + 'px',
                    backgroundColor: c.color,
                    '--dx': c.dx,
                    '--dy': c.dy,
                    transform: 'scale(' + c.scale + ')'
                  }"
                ></view>
              </view>
            </view>
          </view>

          <!-- FLOOR 2: Cards & 3D Transitions -->
          <view id="floor-2" class="floor-section">
            <view class="floor-header">二、 卡片与 3D 转场</view>
            
            <!-- 7. 3D Card Flip -->
            <view class="effect-box">
              <view class="effect-title">⑦ 3D 轴向空间卡片翻转</view>
              <view class="flip-card-wrapper" @click="cardFlipped = !cardFlipped">
                <view :class="['flip-card-inner', { flipped: cardFlipped }]">
                  <view class="flip-card-front">
                    <text class="card-logo">🎟️</text>
                    <text class="card-label">点击翻转卡片</text>
                  </view>
                  <view class="flip-card-back">
                    <text class="coupon-val">¥ 50</text>
                    <text class="coupon-limit">代金券</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 8. Tinder Swipe Card -->
            <view class="effect-box">
              <view class="effect-title">⑧ 探探卡片滑动手势飞出</view>
              <view class="tinder-slider-box">
                <view v-if="!cardRemoved" class="tinder-card-container">
                  <view
                    class="tinder-card"
                    :style="{
                      transform: 'translate(' + cardX + 'px, ' + cardY + 'px) rotate(' + cardAngle + 'deg)',
                      transition: cardX === 0 && cardY === 0 ? 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
                    }"
                    @touchstart="handleCardTouchStart"
                    @touchmove="handleCardTouchMove"
                    @touchend="handleCardTouchEnd"
                  >
                    <view class="tinder-cover">🎨</view>
                    <view class="tinder-info">
                      <view class="tinder-name">产品设计师 · Emily</view>
                      <view class="tinder-tag-row">
                        <wd-tag size="small" type="primary" plain>艺术</wd-tag>
                        <wd-tag size="small" type="success" plain class="ml-1">摄影</wd-tag>
                      </view>
                    </view>
                    <view v-if="swipeStatus === 'like'" class="swipe-indicator like">LIKE</view>
                    <view v-if="swipeStatus === 'dislike'" class="swipe-indicator dislike">NOPE</view>
                  </view>
                </view>
                <view v-else class="tinder-empty-fallback">
                  <text class="fallback-msg">已无更多匹配卡片</text>
                  <wd-button size="small" type="primary" plain @click="resetSwipeCard">重置卡片</wd-button>
                </view>
              </view>
            </view>

            <!-- 9. Elastic Bottom Drawer -->
            <view class="effect-box">
              <view class="effect-title">⑨ 弹性果冻阻尼回弹抽屉</view>
              <wd-button type="primary" size="medium" @click="showElasticDrawer = true">
                唤起弹性底栏
              </wd-button>
            </view>

            <!-- 10. Accordion -->
            <view class="effect-box">
              <view class="effect-title">⑩ 风琴最大高度无缝伸缩</view>
              <view class="accordion-card">
                <view class="accordion-head" @click="accordionExpanded = !accordionExpanded">
                  <text class="head-txt">为何该方案能高度兼容各端？</text>
                  <wd-icon name="arrow-down" size="16px" :class="['arrow-icon', { rotate: accordionExpanded }]" />
                </view>
                <view :class="['accordion-body', { expanded: accordionExpanded }]">
                  <view class="accordion-content">
                    摒弃了直接操作原生 DOM API 的写法，全依赖 Vue 状态驱动 Class 变化和 CSS3 硬件加速。
                  </view>
                </view>
              </view>
            </view>

            <!-- 11. 3D Hover Parallax Tilt Card -->
            <view class="effect-box">
              <view class="effect-title">⑪ 3D 触碰视差倾斜悬浮卡片</view>
              <view class="tilt-card-container">
                <view
                  class="tilt-card"
                  :style="{
                    transform: 'perspective(500px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)',
                    transition: tiltX === 0 ? 'transform 0.5s ease' : 'none'
                  }"
                  @touchmove="handleTiltMove"
                  @touchend="handleTiltEnd"
                >
                  <view class="tilt-card-inner">
                    <text class="tilt-icon">🌟</text>
                    <text class="tilt-title">手指在其上滑动倾斜</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 12. 3D Cube Folding Box Menu -->
            <view class="effect-box">
              <view class="effect-title">⑫ 3D 折叠魔方滚落菜单</view>
              <view class="cube-menu-container" @click="cubeFolded = !cubeFolded">
                <view :class="['cube-cube', { unfolded: !cubeFolded }]">
                  <view class="cube-face front">前端开发</view>
                  <view class="cube-face back">动效模板</view>
                  <view class="cube-face right">小程序端</view>
                  <view class="cube-face left">H5页面</view>
                </view>
              </view>
            </view>
          </view>

          <!-- FLOOR 3: Text & Typography -->
          <view id="floor-3" class="floor-section">
            <view class="floor-header">三、 文字与排版特效</view>
            
            <!-- 13. Marquee -->
            <view class="effect-box">
              <view class="effect-title">⑬ 跑马灯滚动通知公告</view>
              <view class="marquee-wrapper">
                <wd-icon name="sound" size="16px" class="sound-icon" />
                <view class="marquee-window">
                  <view class="marquee-track">
                    🔥 闪电速递：模板全面升级 Vue 3.5 内核，运行速度大幅提升，敬请体验！
                  </view>
                </view>
              </view>
            </view>

            <!-- 14. Glitch Cyberpunk Text -->
            <view class="effect-box bg-dark-theme">
              <view class="effect-title text-white">⑭ 故障艺术赛博文本抖动</view>
              <view class="glitch-box">
                <text class="glitch-text" data-text="CYBERPUNK">CYBERPUNK</text>
              </view>
            </view>

            <!-- 15. Typewriter Effect -->
            <view class="effect-box">
              <view class="effect-title">⑮ 打字机式文字吐出动画</view>
              <view class="typewriter-box">
                <text class="typewriter-txt">{{ typewrittenText }}</text>
                <text class="typewriter-cursor">|</text>
              </view>
              <wd-button size="small" type="primary" plain @click="runTypewriter" class="mt-3">
                重新运行打字机
              </wd-button>
            </view>

            <!-- 16. Rainbow Text Gradient Flow -->
            <view class="effect-box">
              <view class="effect-title">⑯ 七彩霓虹渐变流动文字</view>
              <view class="rainbow-box">
                <text class="rainbow-text">NEON RAINBOW FLOW</text>
              </view>
            </view>

            <!-- 17. Spotlight Reveal Text -->
            <view class="effect-box bg-dark-theme">
              <view class="effect-title text-white">⑰ 聚光灯掠过探照文字</view>
              <view class="spotlight-box">
                <text class="spotlight-text">SPOTLIGHT REVEAL</text>
              </view>
            </view>

            <!-- 18. Blur to Focus Transition -->
            <view class="effect-box">
              <view class="effect-title">⑱ 文字高斯模糊聚合渐显</view>
              <view class="blur-reveal-box">
                <text
                  v-for="(char, idx) in '模糊聚合进入'.split('')"
                  :key="idx"
                  class="blur-char"
                  :style="{ animationDelay: idx * 0.15 + 's' }"
                >
                  {{ char }}
                </text>
              </view>
            </view>
          </view>

          <!-- FLOOR 4: Data & Loading Feedbacks -->
          <view id="floor-4" class="floor-section">
            <view class="floor-header">四、 数据与加载反馈</view>
            
            <!-- 19. Number Counter Roller -->
            <view class="effect-box">
              <view class="effect-title">⑲ 数字倍增缓动过渡</view>
              <view class="counter-box">
                <view class="counter-val">¥ {{ animatedNumber.toLocaleString() }}.00</view>
                <wd-button size="small" type="primary" plain @click="startNumberCount">
                  重新计数
                </wd-button>
              </view>
            </view>

            <!-- 20. Skeleton Shimmer -->
            <view class="effect-box">
              <view class="effect-title">⑳ 骨架屏炫目扫光光晕</view>
              <view class="skeleton-shimmer-card">
                <view class="shimmer-avatar"></view>
                <view class="shimmer-lines">
                  <view class="shimmer-line w-60"></view>
                  <view class="shimmer-line w-100"></view>
                </view>
              </view>
            </view>

            <!-- 21. Bouncing Loading Dots -->
            <view class="effect-box">
              <view class="effect-title">㉑ 弹跳波浪加载小球</view>
              <view class="bouncing-dots-wrap">
                <view class="bounce-dot delay-0"></view>
                <view class="bounce-dot delay-15"></view>
                <view class="bounce-dot delay-30"></view>
              </view>
            </view>

            <!-- 22. SVG Circular Progress Ring Grow -->
            <view class="effect-box">
              <view class="effect-title">㉒ 圆形闭环进度环加载</view>
              <view class="progress-ring-box">
                <view class="progress-ring-inner" :style="{ '--percent': progressPercent }">
                  <text class="progress-val">{{ progressPercent }}%</text>
                </view>
                <wd-button size="small" type="primary" plain @click="animateProgress" class="mt-3">
                  重启进度环
                </wd-button>
              </view>
            </view>

            <!-- 23. Barcode Scanner Laser -->
            <view class="effect-box">
              <view class="effect-title">㉓ 条形码激光扫描线动效</view>
              <view class="scanner-box">
                <view class="scanner-laser"></view>
                <text class="scanner-barcode">|||||||||||||||||||||||||</text>
              </view>
            </view>

            <!-- 24. Hourglass Flip Loader -->
            <view class="effect-box">
              <view class="effect-title">㉔ 沙漏翻转计时倒流</view>
              <view class="hourglass-box">
                <view class="hourglass-icon">⏳</view>
              </view>
            </view>
          </view>

          <!-- FLOOR 5: Entrance, Dismissal & Gestures -->
          <view id="floor-5" class="floor-section">
            <view class="floor-header">五、 进入、退出与手势</view>
            
            <!-- 25. Scroll Slide In/Up -->
            <view class="effect-box">
              <view class="effect-title">㉕ 视口渐显滑入位移动效</view>
              <view class="fade-up-trigger-box">
                <wd-button size="small" type="primary" plain @click="elementVisible = !elementVisible">
                  触发渐显滑入
                </wd-button>
                <view :class="['fade-up-element', { visible: elementVisible }]">
                  <text class="fade-emoji">🌈</text>
                  <text class="fade-txt">平滑滑入渐显</text>
                </view>
              </view>
            </view>

            <!-- 26. Delete Card Disintegration -->
            <view class="effect-box">
              <view class="effect-title">㉖ 删除卡片缩小粉碎崩溃</view>
              <view v-if="!cardDisintegrated" class="disintegration-card">
                <view class="dis-text">可粉碎删除的商品项</view>
                <wd-icon name="delete" size="18px" class="dis-del-icon" @click="cardDisintegrated = true" />
              </view>
              <view v-else class="dis-fallback">
                <text class="fallback-msg">卡片已被碎纸机粉碎消失</text>
                <wd-button size="small" type="primary" plain @click="cardDisintegrated = false">撤销粉碎</wd-button>
              </view>
            </view>

            <!-- 27. Jelly staggered List -->
            <view class="effect-box">
              <view class="effect-title">㉗ 果冻列表项依次滑入</view>
              <view class="jelly-list-box">
                <view
                  v-for="(item, idx) in listItems"
                  :key="idx"
                  class="jelly-item animate-jelly"
                >
                  {{ item }}
                </view>
                <wd-button size="small" type="primary" plain @click="loadJellyList" class="mt-3">
                  重载依次滑入
                </wd-button>
              </view>
            </view>

            <!-- 28. Floating Bubbles Background -->
            <view class="effect-box relative-context overflow-hidden">
              <view class="effect-title">㉘ 悬浮气泡徐徐冉冉升起</view>
              <view class="bubble-bg-simulator">
                <view class="bubble b1"></view>
                <view class="bubble b2"></view>
                <view class="bubble b3"></view>
                <view class="bubble b4"></view>
                <text class="bubble-txt">漂浮气泡背景模拟</text>
              </view>
            </view>

            <!-- 29. Liquid stretch -->
            <view class="effect-box">
              <view class="effect-title">㉙ 手势液态融黏拉伸回弹</view>
              <view
                class="liquid-container"
                @touchstart="startTouchX = $event.touches[0].clientX"
                @touchmove="handleLiquidTouchMove"
                @touchend="handleLiquidTouchEnd"
              >
                <!-- Base Circle -->
                <view class="liquid-base-circle"></view>
                <!-- Stretchy Blob -->
                <view
                  class="liquid-stretch-blob"
                  :style="{
                    width: (60 + liquidStretch * 0.4) + 'rpx',
                    transform: 'translateX(' + liquidStretch + 'rpx)',
                    transition: liquidStretch === 0 ? 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.5), width 0.4s' : 'none'
                  }"
                ></view>
                <text class="liquid-hint">手势按住往右滑动拉伸</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 30. Elastic Drawer Overlay -->
      <wd-popup
        v-model="showElasticDrawer"
        position="bottom"
        safe-area-inset-bottom
        root-portal
        custom-class="elastic-drawer"
        :z-index="1300"
      >
        <view class="elastic-drawer-container">
          <view class="drawer-header-strip"></view>
          <view class="drawer-body">
            <view class="drawer-icon">🍨</view>
            <view class="drawer-heading">果冻弹性回弹抽屉</view>
            <view class="drawer-desc">
              采用阻尼过冲贝塞尔曲线实现极具物理弹性阻尼感的回弹，动效极其顺滑！
            </view>
            <wd-button type="primary" block @click="showElasticDrawer = false" class="mt-4">关闭抽屉</wd-button>
          </view>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.animations-center-page {
  height: calc(100vh - 380rpx - env(safe-area-inset-bottom));
  overflow: hidden;
}

.scrollspy-container {
  display: flex;
  height: 100%;
}

/* Left Categories Sidebar styling */
.left-nav-bar {
  width: 180rpx;
  background: #f1f5f9;
  display: flex;
  flex-direction: column;
  border-right: 1rpx solid var(--app-line);
}

.nav-item {
  padding: 24rpx 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-left: 6rpx solid transparent;
  gap: 4rpx;
  
  &.active {
    background: #fff;
    border-left-color: var(--app-brand);
    
    .nav-title {
      color: var(--app-brand);
      font-weight: 900;
    }
  }
}

.nav-title {
  font-size: 24rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.nav-desc {
  font-size: 16rpx;
  color: var(--app-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150rpx;
}

/* Right scrollview floors styling */
.right-scroll-view {
  flex: 1;
  height: 100%;
  background: #fff;
  padding: 0 24rpx;
  box-sizing: border-box;
}

.floor-section {
  padding: 30rpx 0 40rpx;
  border-bottom: 2rpx dashed var(--app-line);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 120rpx;
  }
}

.floor-header {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--app-brand);
  margin-bottom: 20rpx;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6rpx;
    left: 0;
    width: 60rpx;
    height: 4rpx;
    background: var(--app-brand);
    border-radius: 99rpx;
  }
}

.effect-box {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
  
  &.relative-context {
    position: relative;
    overflow: visible;
  }
  
  &.bg-dark-theme {
    background: #0f172a;
  }
  
  &.overflow-hidden {
    overflow: hidden;
  }
}

.text-white {
  color: #f8fafc;
}

.effect-title {
  font-size: 23rpx;
  font-weight: 800;
  color: var(--app-ink);
  margin-bottom: 18rpx;
  
  &.text-white {
    color: #f8fafc;
  }
}

.mt-3 {
  margin-top: 24rpx;
}

.mt-4 {
  margin-top: 32rpx;
}

.ml-1 {
  margin-left: 8rpx;
}

/* ==========================================
   一、 按钮与微交互 样式
   ========================================== */

/* 1. Heartbeat Button */
.pulse-container {
  display: flex;
  justify-content: center;
  padding: 10rpx 0;
}

.heartbeat-btn {
  background: #ef4444;
  color: #fff;
  border-radius: 99rpx;
  padding: 18rpx 50rpx;
  font-size: 24rpx;
  font-weight: 800;
  box-shadow: 0 8rpx 20rpx rgba(239, 68, 68, 0.3);
  animation: heartbeat 1.5s infinite ease-in-out;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.08); }
  28% { transform: scale(1); }
  42% { transform: scale(1.08); }
  70% { transform: scale(1); }
}

/* 2. Parabolic Cart Fly */
.cart-fly-demo-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx;
}

.item-shop-card {
  display: flex;
  align-items: center;
  flex: 1;
}

.item-emoji {
  font-size: 50rpx;
}

.item-info {
  display: flex;
  flex-direction: column;
  margin-left: 12rpx;
  flex: 1;
}

.item-title {
  font-size: 24rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.item-price {
  font-size: 22rpx;
  color: #ef4444;
  font-weight: 900;
}

.add-cart-circle {
  width: 48rpx;
  height: 48rpx;
  background: var(--app-brand);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-icon-basket {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #f1f5f9;
  color: var(--app-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &.bounce {
    animation: cartBounce 0.5s ease-out;
  }
}

@keyframes cartBounce {
  0% { transform: scale(1); }
  25% { transform: scale(1.25); }
  50% { transform: scale(0.9); }
  75% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.cart-badge-count {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  background: #ef4444;
  color: #fff;
  font-size: 18rpx;
  font-weight: 800;
  padding: 2rpx 8rpx;
  border-radius: 99rpx;
}

.fly-dot-axis-x {
  position: fixed;
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  z-index: 9999;
  pointer-events: none;
  animation: flyHorizontal 0.8s linear forwards;
}

.fly-dot-axis-y {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #ef4444;
  animation: flyVertical 0.8s cubic-bezier(0.55, 0, 0.85, 0.36) forwards;
}

@keyframes flyHorizontal {
  0% { transform: translateX(0); }
  100% { transform: translateX(180px); }
}

@keyframes flyVertical {
  0% { transform: translateY(0); }
  100% { transform: translateY(220px); }
}

/* 3. FAB Menu */
.fab-wrapper {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
}

.fab-trigger {
  width: 80rpx;
  height: 80rpx;
  background: var(--app-brand);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 20rpx rgba(30, 136, 229, 0.3);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &.active {
    transform: rotate(135deg);
  }
}

.fab-sub-buttons {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 16rpx;
  opacity: 0;
  transform: translateY(30rpx) scale(0.3);
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.5);
  
  &.active {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }
}

.fab-sub {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.15);
  
  &.bg-blue { background: #3b82f6; }
  &.bg-green { background: #10b981; }
  &.bg-orange { background: #f97316; }
}

/* 4. Ripple Button */
.ripple-btn-wrapper {
  display: flex;
  justify-content: center;
}

.ripple-btn {
  position: relative;
  background: #3b82f6;
  color: #fff;
  font-size: 24rpx;
  font-weight: 800;
  padding: 24rpx 50rpx;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.2);
}

.ripple-circle {
  position: absolute;
  width: 100rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: rippleAnimation 0.6s linear;
  pointer-events: none;
}

@keyframes rippleAnimation {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
}

/* 5. Streamer Border Button */
.streamer-btn-container {
  display: flex;
  justify-content: center;
}

.streamer-btn {
  position: relative;
  width: 320rpx;
  height: 80rpx;
  border-radius: 14rpx;
  overflow: hidden;
  padding: 3rpx; // border width space
  background: linear-gradient(0deg, transparent, transparent);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(#f43f5e, #3b82f6, #10b981, #f59e0b, #f43f5e);
    animation: rotateStreamer 3s linear infinite;
  }
}

@keyframes rotateStreamer {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.streamer-content {
  position: relative;
  background: #f8fafc;
  color: var(--app-ink);
  font-size: 24rpx;
  font-weight: 800;
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 6. Confetti Explosion */
.confetti-trigger-wrap {
  display: flex;
  justify-content: center;
  position: relative;
}

.confetti-piece {
  position: fixed;
  width: 12rpx;
  height: 12rpx;
  border-radius: 3rpx;
  pointer-events: none;
  z-index: 9999;
  animation: explodeConfetti 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
}

@keyframes explodeConfetti {
  0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0) rotate(360deg); opacity: 0; }
}


/* ==========================================
   二、 卡片与 3D 转场 样式
   ========================================== */

/* 7. 3D Card Flip */
.flip-card-wrapper {
  width: 100%;
  height: 140rpx;
  perspective: 1000px;
}

.flip-card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.flipped {
    transform: rotateY(180deg);
  }
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.flip-card-front {
  background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
  color: #fff;
  justify-content: center;
  gap: 16rpx;
}

.card-logo {
  font-size: 50rpx;
}

.card-label {
  font-size: 24rpx;
  font-weight: 800;
}

.flip-card-back {
  background: #fff7ed;
  border: 2rpx solid #ffedd5;
  color: #c2410c;
  transform: rotateY(180deg);
  justify-content: space-around;
  padding: 0 40rpx;
}

.coupon-val {
  font-size: 40rpx;
  font-weight: 900;
}

.coupon-limit {
  font-size: 22rpx;
  font-weight: 700;
}

/* 8. Tinder Swipe Card */
.tinder-slider-box {
  height: 320rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tinder-card-container {
  width: 260rpx;
  height: 300rpx;
  position: relative;
}

.tinder-card {
  width: 100%;
  height: 100%;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: center bottom;
  touch-action: none;
}

.tinder-cover {
  flex: 1;
  background: #fdf4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80rpx;
}

.tinder-info {
  padding: 12rpx;
  background: #fff;
}

.tinder-name {
  font-size: 20rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.tinder-tag-row {
  margin-top: 6rpx;
  display: flex;
}

.swipe-indicator {
  position: absolute;
  top: 20rpx;
  border: 4rpx solid;
  border-radius: 8rpx;
  padding: 4rpx 10rpx;
  font-size: 22rpx;
  font-weight: 950;
  transform: rotate(-15deg);
  
  &.like {
    left: 20rpx;
    color: #22c55e;
    border-color: #22c55e;
  }
  
  &.dislike {
    right: 20rpx;
    color: #ef4444;
    border-color: #ef4444;
    transform: rotate(15deg);
  }
}

.tinder-empty-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.fallback-msg {
  font-size: 22rpx;
  color: var(--app-muted);
  font-weight: 700;
}

/* 10. Accordion */
.accordion-card {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  overflow: hidden;
}

.accordion-head {
  padding: 20rpx 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.head-txt {
  font-size: 23rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.arrow-icon {
  color: var(--app-muted);
  transition: transform 0.3s ease;
  
  &.rotate {
    transform: rotate(180deg);
  }
}

.accordion-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0, 1, 0, 1);
  background: #f8fafc;
  
  &.expanded {
    max-height: 200rpx;
  }
}

.accordion-content {
  padding: 20rpx 24rpx;
  font-size: 21rpx;
  color: var(--app-muted);
  line-height: 1.5;
}

/* 11. 3D Hover Parallax Card */
.tilt-card-container {
  display: flex;
  justify-content: center;
  perspective: 500px;
}

.tilt-card {
  width: 320rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border-radius: 16rpx;
  padding: 4rpx;
  box-shadow: 0 10rpx 24rpx rgba(139, 92, 246, 0.25);
  transform-style: preserve-3d;
  touch-action: none;
}

.tilt-card-inner {
  background: rgba(255, 255, 255, 0.08);
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  transform: translateZ(30px); // Pop text forward
  color: #fff;
}

.tilt-icon {
  font-size: 40rpx;
}

.tilt-title {
  font-size: 22rpx;
  font-weight: 800;
}

/* 12. 3D Folding Box Menu */
.cube-menu-container {
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 800px;
}

.cube-cube {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateY(25deg);
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &.unfolded {
    transform: rotateX(70deg) rotateY(45deg) scale(0.9);
    
    .front { transform: translateZ(90rpx); }
    .back { transform: translateZ(-90rpx) rotateY(180deg); }
    .right { transform: rotateY(90deg) translateZ(90rpx); }
    .left { transform: rotateY(-90deg) translateZ(90rpx); }
  }
}

.cube-face {
  position: absolute;
  width: 120rpx;
  height: 120rpx;
  background: rgba(30, 136, 229, 0.88);
  border: 1rpx solid rgba(255, 255, 255, 0.4);
  color: #fff;
  font-size: 20rpx;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  border-radius: 8rpx;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.front  { transform: translateZ(60rpx); background: #1e88e5; }
.back   { transform: translateZ(-60rpx) rotateY(180deg); background: #f97316; }
.right  { transform: rotateY(90deg) translateZ(60rpx); background: #10b981; }
.left   { transform: rotateY(-90deg) translateZ(60rpx); background: #8b5cf6; }


/* ==========================================
   三、 文字与排版特效 样式
   ========================================== */

/* 13. Marquee */
.marquee-wrapper {
  background: #fffbeb;
  border: 1rpx solid #fef3c7;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  padding: 14rpx 18rpx;
}

.sound-icon {
  color: #d97706;
  margin-right: 12rpx;
}

.marquee-window {
  flex: 1;
  overflow: hidden;
}

.marquee-track {
  display: inline-block;
  white-space: nowrap;
  font-size: 21rpx;
  color: #b45309;
  font-weight: 700;
  animation: marquee 16s linear infinite;
}

@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

/* 14. Glitch Cyberpunk Text */
.glitch-box {
  display: flex;
  justify-content: center;
  padding: 20rpx 0;
}

.glitch-text {
  font-size: 40rpx;
  font-weight: 950;
  color: #fff;
  position: relative;
  text-shadow: 0.05em 0 0 #ff0055, -0.05em -0.025em 0 #00ffc4,
    0.025em 0.05em 0 #ffcc00;
  animation: glitch 1s infinite;
  
  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #0f172a;
  }
  
  &::before {
    left: 4rpx;
    text-shadow: -2rpx 0 #00ffff;
    clip-path: rect(24rpx, 350rpx, 56rpx, 0);
    animation: glitch-anim 2s infinite linear alternate-reverse;
  }
  
  &::after {
    left: -4rpx;
    text-shadow: -2rpx 0 #ff00ff;
    clip-path: rect(85rpx, 350rpx, 120rpx, 0);
    animation: glitch-anim2 2s infinite linear alternate-reverse;
  }
}

@keyframes glitch {
  0% { text-shadow: 2rpx 4rpx 0 rgba(255,0,85,0.8), -2rpx -2rpx 0 rgba(0,255,196,0.8); }
  50% { text-shadow: -2rpx -2rpx 0 rgba(255,0,85,0.8), 2rpx 2rpx 0 rgba(0,255,196,0.8); }
  100% { text-shadow: 2rpx -2rpx 0 rgba(255,0,85,0.8), -2rpx 2rpx 0 rgba(0,255,196,0.8); }
}

@keyframes glitch-anim {
  0% { clip-path: inset(40% 0 61% 0); }
  20% { clip-path: inset(92% 0 1% 0); }
  40% { clip-path: inset(15% 0 80% 0); }
  60% { clip-path: inset(80% 0 5% 0); }
  80% { clip-path: inset(3% 0 92% 0); }
  100% { clip-path: inset(50% 0 43% 0); }
}

@keyframes glitch-anim2 {
  0% { clip-path: inset(25% 0 58% 0); }
  20% { clip-path: inset(70% 0 10% 0); }
  40% { clip-path: inset(5% 0 85% 0); }
  60% { clip-path: inset(62% 0 25% 0); }
  80% { clip-path: inset(88% 0 2% 0); }
  100% { clip-path: inset(30% 0 60% 0); }
}

/* 15. Typewriter */
.typewriter-box {
  background: #f1f5f9;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  min-height: 80rpx;
  display: flex;
  align-items: center;
}

.typewriter-txt {
  font-size: 24rpx;
  color: var(--app-ink);
  line-height: 1.5;
}

.typewriter-cursor {
  color: var(--app-brand);
  font-weight: 900;
  animation: cursorBlink 0.8s infinite;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* 16. Rainbow Text */
.rainbow-box {
  display: flex;
  justify-content: center;
  padding: 12rpx 0;
}

.rainbow-text {
  font-size: 30rpx;
  font-weight: 950;
  background: linear-gradient(to right, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ef4444);
  background-size: 200% auto;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  animation: rainbowFlow 4s linear infinite;
}

@keyframes rainbowFlow {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

/* 17. Spotlight Text */
.spotlight-box {
  display: flex;
  justify-content: center;
  padding: 24rpx 0;
}

.spotlight-text {
  font-size: 32rpx;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.1);
  background-image: radial-gradient(circle 40rpx at 0% 50%, #fff 60%, transparent 100%);
  background-clip: text;
  -webkit-background-clip: text;
  animation: spotlightMove 4s ease-in-out infinite alternate;
}

@keyframes spotlightMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

/* 18. Blur to Focus */
.blur-reveal-box {
  display: flex;
  justify-content: center;
  gap: 8rpx;
  padding: 12rpx 0;
}

.blur-char {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--app-ink);
  opacity: 0;
  filter: blur(12rpx);
  transform: scale(2);
  animation: blurToFocus 0.8s ease-out forwards;
}

@keyframes blurToFocus {
  0% { opacity: 0; filter: blur(12rpx); transform: scale(2); }
  100% { opacity: 1; filter: blur(0); transform: scale(1); }
}


/* ==========================================
   四、 数据与加载反馈 样式
   ========================================== */

/* 19. Counter Roller */
.counter-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.counter-val {
  font-size: 38rpx;
  font-weight: 950;
  color: var(--app-brand);
}

/* 20. Skeleton Shimmer */
.skeleton-shimmer-card {
  display: flex;
  gap: 16rpx;
  background: #fff;
  padding: 16rpx;
  border-radius: 12rpx;
}

.shimmer-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

.shimmer-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10rpx;
}

.shimmer-line {
  height: 16rpx;
  border-radius: 4rpx;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  
  &.w-60 { width: 60%; }
  &.w-100 { width: 100%; }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 21. Bouncing Dots */
.bouncing-dots-wrap {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  padding: 20rpx 0;
}

.bounce-dot {
  width: 16rpx;
  height: 16rpx;
  background: var(--app-brand);
  border-radius: 50%;
  animation: bounceDot 1.2s infinite ease-in-out;
  
  &.delay-0 { animation-delay: 0s; }
  &.delay-15 { animation-delay: 0.15s; }
  &.delay-30 { animation-delay: 0.3s; }
}

@keyframes bounceDot {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-24rpx); }
}

/* 22. SVG Circular Progress */
.progress-ring-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-ring-inner {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: conic-gradient(var(--app-brand) calc(var(--percent) * 3.6deg), #e2e8f0 0deg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: #f8fafc;
  }
}

.progress-val {
  position: relative;
  z-index: 2;
  font-size: 22rpx;
  font-weight: 900;
  color: var(--app-ink);
}

/* 23. Barcode Scanner */
.scanner-box {
  position: relative;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.scanner-laser {
  position: absolute;
  width: 100%;
  height: 4rpx;
  background: #ef4444;
  box-shadow: 0 0 10rpx #ef4444;
  top: 0;
  animation: scanLaser 2s linear infinite;
}

@keyframes scanLaser {
  0%, 100% { top: 0%; }
  50% { top: 100%; }
}

.scanner-barcode {
  font-family: monospace;
  font-size: 40rpx;
  color: #334155;
  letter-spacing: 2rpx;
  opacity: 0.6;
}

/* 24. Hourglass */
.hourglass-box {
  display: flex;
  justify-content: center;
  padding: 10rpx 0;
}

.hourglass-icon {
  font-size: 64rpx;
  display: inline-block;
  animation: rotateHourglass 2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
}

@keyframes rotateHourglass {
  0% { transform: rotate(0deg); }
  50%, 100% { transform: rotate(180deg); }
}


/* ==========================================
   五、 进入、退出与手势 样式
   ========================================== */

/* 25. Scroll Slide-In/Up */
.fade-up-trigger-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  min-height: 140rpx;
  justify-content: center;
}

.fade-up-element {
  display: flex;
  align-items: center;
  gap: 10rpx;
  background: #f0fdf4;
  border: 1rpx solid #bbf7d0;
  padding: 14rpx 28rpx;
  border-radius: 10rpx;
  opacity: 0;
  transform: translateY(30rpx);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.2);
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-emoji { font-size: 32rpx; }
.fade-txt { font-size: 21rpx; color: #15803d; font-weight: 800; }

/* 26. Delete Card Disintegration */
.disintegration-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1rpx solid var(--app-line);
  padding: 20rpx 24rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.02);
}

.dis-text {
  font-size: 22rpx;
  font-weight: 700;
  color: var(--app-ink);
}

.dis-del-icon {
  color: #ef4444;
}

.dis-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

/* 27. Jelly List */
.jelly-list-box {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.jelly-item {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
  padding: 14rpx 20rpx;
  font-size: 22rpx;
  font-weight: 800;
  color: var(--app-ink);
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.01);
}

.animate-jelly {
  animation: jellyFlyIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
}

@keyframes jellyFlyIn {
  0% { opacity: 0; transform: translateX(80rpx) scale(0.9); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}

/* 28. Floating Bubbles */
.bubble-bg-simulator {
  height: 140rpx;
  background: linear-gradient(to top, #0f172a, #1e293b);
  border-radius: 12rpx;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bubble-txt {
  font-size: 22rpx;
  font-weight: 800;
  color: #fff;
  opacity: 0.8;
  z-index: 5;
}

.bubble {
  position: absolute;
  bottom: -20rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: floatBubble 4s infinite linear;
  
  &.b1 { width: 30rpx; height: 30rpx; left: 15%; animation-duration: 3s; }
  &.b2 { width: 16rpx; height: 16rpx; left: 45%; animation-duration: 5s; animation-delay: 1s; }
  &.b3 { width: 24rpx; height: 24rpx; left: 70%; animation-duration: 4s; animation-delay: 0.5s; }
  &.b4 { width: 36rpx; height: 36rpx; left: 85%; animation-duration: 3.5s; animation-delay: 1.5s; }
}

@keyframes floatBubble {
  0% { transform: translateY(0) scale(1); opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-180rpx) scale(1.2); opacity: 0; }
}

/* 29. Liquid Stretch */
.liquid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: #fff;
  border: 1rpx solid var(--app-line);
  height: 130rpx;
  border-radius: 12rpx;
  justify-content: center;
  touch-action: none;
}

.liquid-base-circle,
.liquid-stretch-blob {
  position: absolute;
  height: 60rpx;
  border-radius: 50%;
  background: #ef4444;
}

.liquid-base-circle {
  width: 60rpx;
  left: 80rpx;
}

.liquid-stretch-blob {
  left: 80rpx;
}

.liquid-hint {
  font-size: 20rpx;
  color: var(--app-muted);
  position: absolute;
  bottom: 10rpx;
  font-weight: 700;
}


/* ==========================================
   弹性底部抽屉 整体浮层样式
   ========================================== */
:deep(.elastic-drawer) {
  border-radius: 36rpx 36rpx 0 0;
  background: #fff;
  overflow: hidden;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.elastic-drawer-container {
  padding: 20rpx 36rpx calc(30rpx + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drawer-header-strip {
  width: 80rpx;
  height: 6rpx;
  background: #cbd5e1;
  border-radius: 99rpx;
  margin-bottom: 24rpx;
}

.drawer-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12rpx;
}

.drawer-icon {
  font-size: 70rpx;
}

.drawer-heading {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.drawer-desc {
  font-size: 22rpx;
  color: var(--app-muted);
  line-height: 1.5;
}
</style>
