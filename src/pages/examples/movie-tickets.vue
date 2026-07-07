<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('movie-toast')

interface Session {
  id: number
  time: string
  type: string
  hall: string
  price: number
  end: string
}

interface Seat {
  row: number
  col: number
  numLabel: string
  status: 'empty' | 'available' | 'sold' | 'selected'
}

// Cinema & Movie Info
const cinemaName = 'AGY 巨幕影城 (五道口店)'
const movieInfo = {
  title: '黑客帝国：矩阵觉醒',
  rating: '9.3',
  tags: ['科幻', '动作', '哲学'],
  duration: '136分钟',
  poster: '🎬'
}

// Dates List
const dateList = [
  { day: '今天 7月8日', val: 'day1' },
  { day: '明天 7月9日', val: 'day2' },
  { day: '周四 7月10日', val: 'day3' }
]
const activeDateVal = ref('day1')

// Sessions per Date
const sessionsData: Record<string, Session[]> = {
  day1: [
    { id: 101, time: '10:30', type: '3D 英文', hall: '5号巨幕厅', price: 45.00, end: '12:46' },
    { id: 102, time: '14:15', type: '3D 英文', hall: '3号激光厅', price: 55.00, end: '16:31' },
    { id: 103, time: '19:00', type: '3D 英文', hall: '5号巨幕厅', price: 65.00, end: '21:16' }
  ],
  day2: [
    { id: 201, time: '11:00', type: '3D 英文', hall: '5号巨幕厅', price: 45.00, end: '13:16' },
    { id: 202, time: '16:30', type: '3D 英文', hall: '3号激光厅', price: 55.00, end: '18:46' }
  ],
  day3: [
    { id: 301, time: '12:00', type: '3D 英文', hall: '2号原声厅', price: 40.00, end: '14:16' },
    { id: 302, time: '20:15', type: '3D 英文', hall: '5号巨幕厅', price: 60.00, end: '22:31' }
  ]
}

// Active selection
const activeSession = ref<Session>(sessionsData.day1[0])

// Seat Matrix Grid: 6 rows x 8 cols. 
// Corridor represents empty spaces between columns to separate seat groupings
const rowsCount = 6
const colsCount = 8
const seatsList = ref<Seat[]>([])

// Generate random sold seats based on session ID to simulate dynamic data
function initSeatsForSession(sessionId: number) {
  const list: Seat[] = []
  
  // Deterministic random sold seats based on session ID
  const seed = sessionId * 3
  
  for (let r = 1; r <= rowsCount; r++) {
    for (let c = 1; c <= colsCount; c++) {
      // Create a corridor at columns 3 and 7 (1-indexed)
      if (c === 3 || c === 7) {
        list.push({
          row: r,
          col: c,
          numLabel: '',
          status: 'empty'
        })
        continue
      }
      
      // Calculate seat number (excluding corridors)
      let seatNum = c
      if (c > 7) seatNum -= 2
      else if (c > 3) seatNum -= 1
      
      // Determine if sold based on pseudo-random hash
      const isSold = ((r * 7 + c * 13 + seed) % 5 === 0) || ((r === 3 || r === 4) && (c === 4 || c === 5))
      
      list.push({
        row: r,
        col: c,
        numLabel: `${r}排${seatNum}座`,
        status: isSold ? 'sold' : 'available'
      })
    }
  }
  seatsList.value = list
}

// Trigger initialization when session changes
watch(() => activeSession.value, (newSession) => {
  initSeatsForSession(newSession.id)
}, { immediate: true })

// Switch date
function selectDate(val: string) {
  activeDateVal.value = val
  // Switch to the first session of that day
  activeSession.value = sessionsData[val][0]
}

// List of currently selected seats
const selectedSeats = computed(() => {
  return seatsList.value.filter(s => s.status === 'selected')
})

const totalPrice = computed(() => {
  return selectedSeats.value.length * activeSession.value.price
})

// Toggle seat selection
function toggleSeat(seat: Seat) {
  if (seat.status === 'sold' || seat.status === 'empty') return
  
  if (seat.status === 'selected') {
    seat.status = 'available'
  } else if (seat.status === 'available') {
    // Check limit
    if (selectedSeats.value.length >= 4) {
      toast.warning('每人限购 4 张电影票')
      return
    }
    seat.status = 'selected'
  }
}

// Payment States
const showPaymentSheet = ref(false)
const payMethod = ref<'wechat' | 'alipay'>('wechat')
const secondsLeft = ref(300) // 5 minutes count down
const paying = ref(false)
const paySuccess = ref(false)
let timerId: any = null

function openPayment() {
  if (selectedSeats.value.length === 0) {
    toast.warning('请先在上方座位图点选座位')
    return
  }
  
  paySuccess.value = false
  paying.value = false
  secondsLeft.value = 300
  showPaymentSheet.value = true
  
  // Start countdown timer
  if (timerId) clearInterval(timerId)
  timerId = setInterval(() => {
    if (secondsLeft.value > 0) {
      secondsLeft.value -= 1
    } else {
      clearInterval(timerId)
      showPaymentSheet.value = false
      toast.error('订单支付超时，座位已释放')
      // Deselect all
      seatsList.value.forEach(s => {
        if (s.status === 'selected') s.status = 'available'
      })
    }
  }, 1000)
}

const formattedCountdown = computed(() => {
  const m = Math.floor(secondsLeft.value / 60)
  const s = secondsLeft.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

function triggerPayment() {
  paying.value = true
  setTimeout(() => {
    paying.value = false
    paySuccess.value = true
    clearInterval(timerId)
    toast.success('购票成功，祝您观影愉快')
    
    // Set seats as sold
    seatsList.value.forEach(s => {
      if (s.status === 'selected') s.status = 'sold'
    })
  }, 2000)
}

function closeSheet() {
  showPaymentSheet.value = false
}

onUnload(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<template>
  <PageShell title="电影选场选座" description="影院选座选场示例，支持横向日期切换、动态座位状态及底部支付流程。">
    <view class="movie-tickets-page">
      <wd-toast selector="movie-toast" />

      <!-- Top Movie details card -->
      <view class="movie-brief-card">
        <view class="brief-poster">{{ movieInfo.poster }}</view>
        <view class="brief-info">
          <view class="movie-name-row">
            <text class="movie-name">{{ movieInfo.title }}</text>
            <text class="movie-rating">{{ movieInfo.rating }}分</text>
          </view>
          <view class="movie-meta-tags">
            <wd-tag
              v-for="tag in movieInfo.tags"
              :key="tag"
              size="small"
              plain
              type="neutral"
            >
              {{ tag }}
            </wd-tag>
            <text class="duration-lbl">{{ movieInfo.duration }}</text>
          </view>
          <view class="selected-cinema">🏢 {{ cinemaName }}</view>
        </view>
      </view>

      <!-- Date Tab Bar (horizontal scroll) -->
      <scroll-view scroll-x class="date-scroll-bar">
        <view class="date-tabs-container">
          <view
            v-for="date in dateList"
            :key="date.val"
            :class="['date-tab', { active: activeDateVal === date.val }]"
            @click="selectDate(date.val)"
          >
            {{ date.day }}
          </view>
        </view>
      </scroll-view>

      <!-- Session List for current date -->
      <view class="session-section">
        <view class="section-title">选择场次</view>
        <scroll-view scroll-x class="sessions-scroll">
          <view class="sessions-row">
            <view
              v-for="session in sessionsData[activeDateVal]"
              :key="session.id"
              :class="['session-card', { active: activeSession.id === session.id }]"
              @click="activeSession = session"
            >
              <view class="sess-time">{{ session.time }}</view>
              <view class="sess-end">{{ session.end }}散场</view>
              <view class="sess-type">{{ session.type }}</view>
              <view class="sess-hall">{{ session.hall }}</view>
              <view class="sess-price">¥{{ session.price }}</view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- Seat Selector panel -->
      <view class="seat-selector-panel">
        <view class="screen-indicator">
          <view class="screen-line"></view>
          <text class="screen-label">屏幕中央</text>
        </view>

        <!-- Legend -->
        <view class="legend-row">
          <view class="legend-item">
            <view class="seat-demo available"></view>
            <text class="legend-text">可选</text>
          </view>
          <view class="legend-item">
            <view class="seat-demo sold"></view>
            <text class="legend-text">已售</text>
          </view>
          <view class="legend-item">
            <view class="seat-demo selected"></view>
            <text class="legend-text">已选</text>
          </view>
        </view>

        <!-- Seat Grid -->
        <view class="seats-grid-container">
          <view class="seats-matrix">
            <view
              v-for="(seat, idx) in seatsList"
              :key="idx"
              :class="['seat-cell', seat.status]"
              @click="toggleSeat(seat)"
            >
              <!-- Icon or indicator representation -->
              <text v-if="seat.status === 'selected'" class="seat-icon">✔</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Bottom Order info and checkout action -->
      <view class="booking-bottom-bar">
        <view class="selected-seats-row">
          <text v-if="selectedSeats.length === 0" class="no-seat-hint">请选择座位，最多限购 4 张票</text>
          <view v-else class="seats-chips">
            <wd-tag
              v-for="s in selectedSeats"
              :key="s.numLabel"
              type="primary"
              closable
              class="seat-chip"
              @close="toggleSeat(s)"
            >
              {{ s.numLabel }}
            </wd-tag>
          </view>
        </view>

        <view class="checkout-footer">
          <view class="price-display-block">
            <view class="pricing-top">
              <text class="total-lbl">应付：</text>
              <text class="currency">¥</text>
              <text class="total-val">{{ totalPrice.toFixed(2) }}</text>
            </view>
            <view v-if="selectedSeats.length > 0" class="pricing-detail">
              ¥{{ activeSession.price.toFixed(2) }} x {{ selectedSeats.length }}张
            </view>
          </view>

          <wd-button
            type="primary"
            size="large"
            :disabled="selectedSeats.length === 0"
            @click="openPayment"
            class="buy-tickets-btn"
          >
            确认选座
          </wd-button>
        </view>
      </view>

      <!-- Checkout & Mock Payment Sheet -->
      <wd-popup
        v-model="showPaymentSheet"
        position="bottom"
        safe-area-inset-bottom
        root-portal
        custom-class="payment-popup"
        :z-index="1300"
      >
        <view class="payment-container">
          <!-- LIST/PAY FORM VIEW -->
          <template v-if="!paySuccess">
            <view class="payment-header">
              <text class="payment-title">确认支付订单</text>
              <wd-icon name="close" size="20px" class="close-icon" @click="closeSheet" />
            </view>

            <!-- Loading overlay inside popup -->
            <view v-if="paying" class="paying-overlay">
              <wd-loading size="36px" />
              <view class="paying-text">正在向支付渠道发起扣款...</view>
            </view>

            <view v-else class="payment-body">
              <!-- Timeout and amount summary -->
              <view class="pay-amount-box">
                <view class="pay-amount-lbl">应付总额</view>
                <view class="pay-amount-val">¥{{ totalPrice.toFixed(2) }}</view>
                <view class="countdown-warning">
                  请在 <text class="timer-hl">{{ formattedCountdown }}</text> 内完成支付，超时订单将自动取消
                </view>
              </view>

              <!-- Order descriptions -->
              <view class="pay-order-summary">
                <view class="sum-line">
                  <text class="s-label">影片名称</text>
                  <text class="s-val">{{ movieInfo.title }}</text>
                </view>
                <view class="sum-line">
                  <text class="s-label">播放时间</text>
                  <text class="s-val">{{ activeSession.time }} ({{ activeSession.type }})</text>
                </view>
                <view class="sum-line">
                  <text class="s-label">放映厅室</text>
                  <text class="s-val">{{ activeSession.hall }}</text>
                </view>
                <view class="sum-line">
                  <text class="s-label">选定座位</text>
                  <text class="s-val">{{ selectedSeats.map(s => s.numLabel).join(', ') }}</text>
                </view>
              </view>

              <!-- Payment options -->
              <view class="payment-methods">
                <view class="methods-label">选择支付方式</view>
                
                <view
                  :class="['method-row', { active: payMethod === 'wechat' }]"
                  @click="payMethod = 'wechat'"
                >
                  <view class="method-left">
                    <text class="method-brand green">🟢</text>
                    <text class="method-name">微信支付</text>
                  </view>
                  <radio :checked="payMethod === 'wechat'" color="#1e88e5" />
                </view>

                <view
                  :class="['method-row', { active: payMethod === 'alipay' }]"
                  @click="payMethod = 'alipay'"
                >
                  <view class="method-left">
                    <text class="method-brand blue">🔵</text>
                    <text class="method-name">支付宝支付</text>
                  </view>
                  <radio :checked="payMethod === 'alipay'" color="#1e88e5" />
                </view>
              </view>
            </view>

            <view v-if="!paying" class="payment-footer">
              <wd-button type="primary" block size="large" @click="triggerPayment">立即付款</wd-button>
            </view>
          </template>

          <!-- SUCCESS VIEW -->
          <template v-else>
            <view class="payment-header text-center">
              <text class="payment-title text-success">出票成功</text>
              <wd-icon name="close" size="20px" class="close-icon" @click="closeSheet" />
            </view>

            <view class="payment-body success-body">
              <view class="success-icon-banner">🎉</view>
              <view class="success-heading">购票交易成功</view>
              <view class="success-sub">您选择的座位已锁定并顺利出票</view>
              
              <!-- Mock ticket qr-code card -->
              <view class="ticket-card-popup">
                <view class="ticket-top">
                  <view class="ticket-m-title">{{ movieInfo.title }}</view>
                  <view class="ticket-hall-info">{{ activeSession.hall }} · {{ selectedSeats.map(s => s.numLabel).join(', ') }}</view>
                  <view class="ticket-datetime">放映时间：7月8日 {{ activeSession.time }}</view>
                </view>
                <view class="ticket-dashed-line"></view>
                <view class="ticket-bottom">
                  <view class="ticket-code-lbl">入场取票码：<text class="code-hl">0081 2991 3328</text></view>
                  <!-- Mock QR code -->
                  <view class="qr-code-box">
                    <view class="qr-inner-grid">
                      <view class="sq sq-tl"></view>
                      <view class="sq sq-tr"></view>
                      <view class="sq sq-bl"></view>
                      <view class="sq-dot"></view>
                    </view>
                  </view>
                </view>
              </view>
            </view>

            <view class="payment-footer">
              <wd-button type="primary" block size="large" @click="closeSheet">完成购票</wd-button>
            </view>
          </template>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.movie-tickets-page {
  display: grid;
  gap: 22rpx;
  padding-bottom: calc(340rpx + env(safe-area-inset-bottom));
}

.movie-brief-card {
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  background: #fff;
  padding: 24rpx;
  display: flex;
  gap: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.01);
}

.brief-poster {
  width: 110rpx;
  height: 150rpx;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
}

.brief-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.movie-name-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.movie-name {
  font-size: 30rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.movie-rating {
  font-size: 28rpx;
  font-weight: 900;
  color: #f59e0b;
}

.movie-meta-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 6rpx;
}

.duration-lbl {
  font-size: 22rpx;
  color: var(--app-muted);
  margin-left: 8rpx;
}

.selected-cinema {
  font-size: 23rpx;
  color: var(--app-muted);
  margin-top: 10rpx;
}

/* Date bar styling */
.date-scroll-bar {
  border-bottom: 1rpx solid var(--app-line);
  background: #fff;
  white-space: nowrap;
}

.date-tabs-container {
  display: flex;
  padding: 0 20rpx;
}

.date-tab {
  display: inline-block;
  padding: 24rpx 32rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: var(--app-muted);
  border-bottom: 4rpx solid transparent;
  transition: all 0.2s ease;
  
  &.active {
    color: var(--app-brand);
    border-bottom-color: var(--app-brand);
  }
}

/* Sessions section */
.session-section {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.section-title {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--app-ink);
  padding: 0 4rpx;
}

.sessions-scroll {
  white-space: nowrap;
  padding-bottom: 8rpx;
}

.sessions-row {
  display: flex;
  gap: 16rpx;
}

.session-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 20rpx 28rpx;
  width: 170rpx;
  box-sizing: border-box;
  transition: all 0.2s ease;
  
  &.active {
    border-color: var(--app-brand);
    background: #f0f7ff;
    
    .sess-time,
    .sess-price {
      color: var(--app-brand);
    }
  }
}

.sess-time {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.sess-end {
  font-size: 18rpx;
  color: var(--app-muted);
  margin-top: 4rpx;
}

.sess-type {
  font-size: 22rpx;
  font-weight: 700;
  color: var(--app-ink);
  margin-top: 10rpx;
}

.sess-hall {
  font-size: 18rpx;
  color: var(--app-muted);
  margin-top: 4rpx;
}

.sess-price {
  font-size: 26rpx;
  font-weight: 900;
  color: var(--app-ink);
  margin-top: 12rpx;
}

/* Seat Selector Panel styling */
.seat-selector-panel {
  border: 1rpx solid var(--app-line);
  border-radius: 24rpx;
  background: #fff;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.screen-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin-bottom: 40rpx;
}

.screen-line {
  width: 100%;
  height: 6rpx;
  background: #cbd5e1;
  border-radius: 99rpx;
  position: relative;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
}

.screen-label {
  font-size: 20rpx;
  color: var(--app-muted);
  margin-top: 10rpx;
}

.legend-row {
  display: flex;
  gap: 36rpx;
  margin-bottom: 40rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.seat-demo {
  width: 32rpx;
  height: 32rpx;
  border-radius: 6rpx;
  box-sizing: border-box;
  
  &.available {
    border: 2rpx solid #94a3b8;
    background: #f8fafc;
  }
  
  &.sold {
    background: #f87171;
    border: 2rpx solid #ef4444;
  }
  
  &.selected {
    background: var(--app-brand);
    border: 2rpx solid var(--app-brand);
  }
}

.legend-text {
  font-size: 22rpx;
  color: var(--app-muted);
  font-weight: 700;
}

.seats-grid-container {
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
}

.seats-matrix {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 16rpx;
}

.seat-cell {
  width: 48rpx;
  height: 48rpx;
  border-radius: 8rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &.empty {
    background: transparent;
    cursor: default;
    pointer-events: none;
  }
  
  &.available {
    border: 2rpx solid #94a3b8;
    background: #f8fafc;
    
    &:active {
      transform: scale(0.9);
    }
  }
  
  &.sold {
    background: #fee2e2;
    border: 2rpx solid #fca5a5;
    background-image: radial-gradient(circle, #fca5a5 20%, transparent 20%);
    background-size: 10rpx 10rpx;
    background-position: center;
  }
  
  &.selected {
    background: var(--app-brand);
    border: 2rpx solid var(--app-brand);
    color: #fff;
    transform: scale(1.05);
    box-shadow: 0 4rpx 10rpx rgba(30, 136, 229, 0.3);
  }
}

.seat-icon {
  font-size: 22rpx;
  font-weight: 900;
}

/* Bottom Booking Bar styling */
.booking-bottom-bar {
  position: fixed;
  bottom: calc(112rpx + env(safe-area-inset-bottom));
  left: 0;
  width: 100%;
  background: #fff;
  border-top: 1rpx solid var(--app-line);
  box-shadow: 0 -8rpx 30rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 880;
}

.selected-seats-row {
  min-height: 72rpx;
  padding: 16rpx 32rpx;
  background: #f8fafc;
  display: flex;
  align-items: center;
}

.no-seat-hint {
  font-size: 24rpx;
  color: var(--app-muted);
  font-weight: 700;
}

.seats-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.seat-chip {
  font-size: 20rpx;
}

.checkout-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
}

.price-display-block {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.pricing-top {
  display: flex;
  align-items: baseline;
}

.total-lbl {
  font-size: 24rpx;
  color: var(--app-ink);
  font-weight: 700;
}

.currency {
  font-size: 26rpx;
  font-weight: 900;
  color: #ef4444;
}

.total-val {
  font-size: 40rpx;
  font-weight: 900;
  color: #ef4444;
}

.pricing-detail {
  font-size: 20rpx;
  color: var(--app-muted);
}

.buy-tickets-btn {
  width: 280rpx;
}

.ml-2 {
  margin-left: 16rpx;
}

/* Payment Popup styles */
:deep(.payment-popup) {
  border-radius: 32rpx 32rpx 0 0;
  background: #fff;
  overflow: hidden;
}

.payment-container {
  display: flex;
  flex-direction: column;
  height: 950rpx;
}

.payment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 36rpx;
  border-bottom: 1rpx solid var(--app-line);
  
  &.text-center {
    justify-content: center;
    position: relative;
    
    .close-icon {
      position: absolute;
      right: 36rpx;
      top: 34rpx;
    }
  }
}

.payment-title {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--app-ink);
  
  &.text-success {
    color: #10b981;
  }
}

.close-icon {
  color: var(--app-muted);
}

.paying-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 20rpx;
  background: rgba(255, 255, 255, 0.95);
}

.paying-text {
  font-size: 26rpx;
  color: var(--app-ink);
  font-weight: 700;
}

.payment-body {
  flex: 1;
  overflow-y: auto;
  padding: 24rpx 36rpx;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  
  &.success-body {
    align-items: center;
    text-align: center;
    gap: 16rpx;
  }
}

.pay-amount-box {
  background: #eff6ff;
  border-radius: 20rpx;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.pay-amount-lbl {
  font-size: 24rpx;
  color: var(--app-muted);
  font-weight: 700;
}

.pay-amount-val {
  font-size: 48rpx;
  font-weight: 950;
  color: var(--app-brand);
}

.countdown-warning {
  font-size: 22rpx;
  color: var(--app-muted);
}

.timer-hl {
  color: #ef4444;
  font-weight: 900;
}

.pay-order-summary {
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.sum-line {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
}

.s-label {
  color: var(--app-muted);
}

.s-val {
  color: var(--app-ink);
  font-weight: 700;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.methods-label {
  font-size: 24rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.method-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 24rpx;
  transition: all 0.2s ease;
  
  &.active {
    border-color: var(--app-brand);
    background: #f0f7ff;
  }
}

.method-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.method-brand {
  font-size: 32rpx;
}

.method-name {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--app-ink);
}

.payment-footer {
  padding: 24rpx 36rpx calc(24rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid var(--app-line);
  background: #fff;
}

/* Success out of tickets style */
.success-icon-banner {
  font-size: 90rpx;
  margin-top: 10rpx;
}

.success-heading {
  font-size: 34rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.success-sub {
  font-size: 23rpx;
  color: var(--app-muted);
}

.ticket-card-popup {
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  width: 100%;
  background: #fbfbfb;
  overflow: hidden;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  margin-top: 10rpx;
}

.ticket-top {
  padding: 24rpx 28rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8rpx;
}

.ticket-m-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.ticket-hall-info {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--app-brand);
}

.ticket-datetime {
  font-size: 22rpx;
  color: var(--app-muted);
}

.ticket-dashed-line {
  border-top: 2rpx dashed var(--app-line);
  margin: 0 24rpx;
}

.ticket-bottom {
  padding: 24rpx 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.ticket-code-lbl {
  font-size: 24rpx;
  color: var(--app-ink);
  font-weight: 700;
}

.code-hl {
  color: var(--app-brand);
  font-weight: 900;
}

.qr-code-box {
  width: 120rpx;
  height: 120rpx;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
  padding: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-inner-grid {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f1f5f9;
  border-radius: 4rpx;
}

.sq {
  width: 32rpx;
  height: 32rpx;
  border: 5rpx solid #334155;
  box-sizing: border-box;
  position: absolute;
}

.sq-tl { top: 0; left: 0; }
.sq-tr { top: 0; right: 0; }
.sq-bl { bottom: 0; left: 0; }

.sq-dot {
  width: 12rpx;
  height: 12rpx;
  background: #334155;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
