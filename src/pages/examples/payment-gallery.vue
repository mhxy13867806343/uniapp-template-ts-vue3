<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('pay-gallery-toast')

// Selected scenario ID
const activeId = ref(1)

const paymentScenarios = [
  { id: 1, name: '聚合收银台', desc: '包含金额看板、倒计时及渠道立减单选' },
  { id: 2, name: '扫码雷达付', desc: '高仿真二维码、条形码加激光雷达扫描动效' },
  { id: 3, name: '密码/面容验证', desc: '底部弹窗、六位安全点阵输入与防泄密键盘' },
  { id: 4, name: '黑金会员余额', desc: '黑金反光质感会员卡，支持余额、充值九宫格' },
  { id: 5, name: '发票结果单', desc: '带喷洒彩屑成功反馈及电子发票极速申请' }
]

// Tab 1 States: Cashier Counter
const orderPrice = 598.00
const orderNo = 'PAY202607100098'
const selectedChannel = ref('wechat') // wechat, alipay, union, apple
const minutes = ref(14)
const seconds = ref(59)
let timerId: any = null

const formattedCountdown = computed(() => {
  const m = minutes.value.toString().padStart(2, '0')
  const s = seconds.value.toString().padStart(2, '0')
  return `${m}:${s}`
})

function startCountdown() {
  clearInterval(timerId)
  timerId = setInterval(() => {
    if (seconds.value > 0) {
      seconds.value--
    } else if (minutes.value > 0) {
      minutes.value--
      seconds.value = 59
    } else {
      clearInterval(timerId)
      toast.warning('支付超时，请重新下单')
    }
  }, 1000)
}

function handleCashierPay() {
  if (selectedChannel.value === 'wechat' || selectedChannel.value === 'alipay') {
    // Open Pin verification popup
    pinDigits.value = []
    verificationMode.value = 'pin'
    showPinPopup.value = true
  } else {
    toast.success(`正在拉起 ${selectedChannel.value} 支付...`)
    setTimeout(() => {
      activeId.value = 5
      toast.success('付款成功！')
    }, 1500)
  }
}

// Tab 2 States: Scan Pay
const isQrExpired = ref(false)
const qrTimeLeft = ref(60)
let qrTimer: any = null
const activeQrChannel = ref<'wechat' | 'alipay' | 'union'>('wechat')
const qrChannels = {
  wechat: {
    name: '微信支付收款码',
    hint: '使用微信 [扫一扫] 完成付款',
    emoji: '💬',
    color: '#22c55e'
  },
  alipay: {
    name: '支付宝收款码',
    hint: '使用支付宝 [扫一扫] 完成付款',
    emoji: '🔹',
    color: '#2563eb'
  },
  union: {
    name: '银联云闪付码',
    hint: '使用云闪付或银行APP [扫一扫] 完成付款',
    emoji: '💳',
    color: '#dc2626'
  }
}

function startQrTimer() {
  qrTimeLeft.value = 60
  isQrExpired.value = false
  clearInterval(qrTimer)
  qrTimer = setInterval(() => {
    if (qrTimeLeft.value > 0) {
      qrTimeLeft.value--
    } else {
      isQrExpired.value = true
      clearInterval(qrTimer)
    }
  }, 1000)
}

function refreshQrCode() {
  startQrTimer()
  toast.success('二维码已刷新')
}

// Tab 3 States: Biometrics PIN Popups
const showPinPopup = ref(false)
const pinDigits = ref<string[]>([])
const pinLength = 6
const verificationMode = ref<'pin' | 'face' | 'finger'>('pin')
const faceScanState = ref<'idle' | 'scanning' | 'success'>('idle')

function appendKey(num: string) {
  if (pinDigits.value.length < pinLength) {
    pinDigits.value.push(num)
  }
  if (pinDigits.value.length === pinLength) {
    toast.success('安全密码验证通过，扣款中...')
    setTimeout(() => {
      showPinPopup.value = false
      pinDigits.value = []
      activeId.value = 5 // Redirect to success tab
      toast.success('支付扣款成功！')
    }, 1500)
  }
}

function deleteKey() {
  pinDigits.value.pop()
}

function triggerFaceId() {
  verificationMode.value = 'face'
  faceScanState.value = 'scanning'
  setTimeout(() => {
    faceScanState.value = 'success'
    toast.success('Face ID 识别匹配完成')
    setTimeout(() => {
      showPinPopup.value = false
      activeId.value = 5
    }, 800)
  }, 2000)
}

function triggerFingerprint() {
  verificationMode.value = 'finger'
  toast.success('请在屏幕指纹感应区按下手指')
  setTimeout(() => {
    toast.success('指纹验证匹配成功')
    setTimeout(() => {
      showPinPopup.value = false
      activeId.value = 5
    }, 800)
  }, 1500)
}

// Tab 4 States: Wallet Member VIP Card
const balance = ref(1250.00)
const selectedRechargeAmount = ref(200)
const rechargeGrid = [100, 200, 500, 1000, 2000, 5000]
const customRechargeVal = ref('')
const selectedRechargeBank = ref('cmb') // cmb, ccb, wechat, alipay
const rechargeBankOptions = ref([
  { id: 'cmb', name: '招商银行 借记卡 (7018)', desc: '单笔限额 ¥50,000', icon: '🔴' },
  { id: 'ccb', name: '建设银行 信用卡 (9921)', desc: '单笔限额 ¥100,000', icon: '🔵' },
  { id: 'wechat', name: '微信支付', desc: '免密快速扣款', icon: '💬' },
  { id: 'alipay', name: '支付宝', desc: '支付宝免密扣款', icon: '🔹' }
])

// Add Bank Card states
const showAddCardPopup = ref(false)
const newCardForm = reactive({
  cardNo: '',
  bankName: '招商银行',
  holderName: '',
  phone: '',
  smsCode: ''
})
const cardBankList = ['招商银行', '工商银行', '农业银行', '建设银行', '中国银行', '交通银行', '浦发银行']
const showSmsCountdown = ref(false)
const smsTime = ref(60)
let smsTimer: any = null

function triggerSmsCode() {
  if (!/^1[3-9]\d{9}$/.test(newCardForm.phone)) {
    toast.warning('请输入正确的手机号')
    return
  }
  showSmsCountdown.value = true
  smsTime.value = 60
  clearInterval(smsTimer)
  smsTimer = setInterval(() => {
    if (smsTime.value > 0) {
      smsTime.value--
    } else {
      showSmsCountdown.value = false
      clearInterval(smsTimer)
    }
  }, 1000)
  toast.success('验证码已发送至预留手机')
}

function handleAddCardConfirm() {
  if (!newCardForm.cardNo.trim() || newCardForm.cardNo.length < 15) {
    toast.warning('请输入有效的银行卡号')
    return
  }
  if (!newCardForm.holderName.trim()) {
    toast.warning('请输入持卡人姓名')
    return
  }
  if (!newCardForm.smsCode.trim()) {
    toast.warning('请输入验证码')
    return
  }

  const lastDigits = newCardForm.cardNo.slice(-4)
  rechargeBankOptions.value.unshift({
    id: `custom_${Date.now()}`,
    name: `${newCardForm.bankName} (${lastDigits})`,
    desc: `持卡人: ${newCardForm.holderName}`,
    icon: '💳'
  })

  // Set as active selected bank
  selectedRechargeBank.value = rechargeBankOptions.value[0].id

  // Close and reset form
  showAddCardPopup.value = false
  newCardForm.cardNo = ''
  newCardForm.holderName = ''
  newCardForm.phone = ''
  newCardForm.smsCode = ''
  showSmsCountdown.value = false
  clearInterval(smsTimer)

  toast.success(`成功绑定 ${newCardForm.bankName} 账户 (尾号${lastDigits})`)
}

// Peer Pay (Friend Pay) states
const showPeerPayPopup = ref(false)
const peerPayLink = computed(() => {
  return `https://mhxy13867806343.github.io/uniapp-template-ts-vue3/#/pages/examples/payment-gallery?peer_pay=1&order_no=${orderNo}&amount=${orderPrice}`
})

function copyPeerPayLink() {
  uni.setClipboardData({
    data: peerPayLink.value,
    success: () => {
      toast.success('好友代付链接复制成功，去分享吧')
      showPeerPayPopup.value = false
    }
  })
}

function handleRecharge(amount: number) {
  selectedRechargeAmount.value = amount
  customRechargeVal.value = '' // Clear custom input
}

const finalRechargePrice = computed(() => {
  if (selectedRechargeAmount.value > 0) {
    return selectedRechargeAmount.value
  }
  return Number(customRechargeVal.value) || 0
})

function confirmRecharge() {
  const amt = finalRechargePrice.value
  if (amt <= 0) {
    toast.warning('请输入或选择有效的充值金额')
    return
  }
  balance.value += amt
  const bankName = rechargeBankOptions.value.find(b => b.id === selectedRechargeBank.value)?.name || '外部账户'
  toast.success(`通过 [${bankName}] 成功充值 ¥${amt}，尊享卡当前余额 ¥${balance.value}`)
}

// Tab 5 States: E-Invoice Receipt
const needInvoice = ref(false)
const invoiceTitle = ref('')
const taxNo = ref('')
const email = ref('')

function submitInvoice() {
  if (!invoiceTitle.value.trim()) {
    toast.warning('请输入开票企业抬头')
    return
  }
  const taxRegex = /^[A-Z0-9]{15,20}$/
  if (!taxNo.value.trim() || !taxRegex.test(invoiceTitle.value && taxNo.value)) {
    toast.warning('请输入有效的统一社会信用代码/税号')
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value.trim() || !emailRegex.test(email.value)) {
    toast.warning('请输入正确的接收电子邮箱')
    return
  }
  toast.success('电子发票已提交开具，请关注您的邮箱')
  needInvoice.value = false
}

onMounted(() => {
  startCountdown()
  startQrTimer()
})

onUnload(() => {
  clearInterval(timerId)
  clearInterval(qrTimer)
})
</script>

<template>
  <PageShell title="支付效果中心" description="整合聚合收银台、雷达扫码、数字安全键盘密码指纹校验、黑金尊享卡及发票通知 5 种高阶效果。">
    <view class="payment-gallery-page">
      <wd-toast selector="pay-gallery-toast" />

      <!-- Top horizontal navigation bar -->
      <view class="pay-tabs-scroller">
        <view
          v-for="item in paymentScenarios"
          :key="item.id"
          :class="['pay-tab-btn', { active: activeId === item.id }]"
          @click="activeId = item.id"
        >
          <view class="tab-btn-title">{{ item.name }}</view>
          <text class="tab-btn-desc">{{ item.desc }}</text>
        </view>
      </view>

      <!-- Main Pay Templates Section -->
      <view class="pay-template-card">

        <!-- 1. CASHIER COUNTER -->
        <view v-if="activeId === 1" class="cashier-counter-view animate-fade-in">
          <view class="price-header text-center">
            <view class="order-title">收银台付账金额</view>
            <view class="order-price font-bold text-ink">¥ {{ orderPrice.toFixed(2) }}</view>
            <view class="countdown-row flex items-center justify-center mt-2">
              <text class="clock-icon">🕒</text>
              <text class="countdown-timer font-bold ml-1">{{ formattedCountdown }}</text>
              <text class="countdown-lbl ml-2">后支付关闭</text>
            </view>
          </view>

          <!-- Order Info -->
          <view class="cashier-order-box mt-3">
            <view class="info-row">
              <text class="info-lbl">订单号</text>
              <text class="info-val font-bold">{{ orderNo }}</text>
            </view>
            <view class="info-row mt-2">
              <text class="info-lbl">商户名称</text>
              <text class="info-val">AGY 尊荣数码服务</text>
            </view>
          </view>

          <!-- Channels Picker -->
          <view class="channels-picker-group mt-3">
            <view class="picker-group-title font-bold mb-2">选择付款方式</view>

            <!-- WeChat Pay -->
            <view
              :class="['channel-option-cell', { active: selectedChannel === 'wechat' }]"
              @click="selectedChannel = 'wechat'"
            >
              <view class="option-left flex items-center">
                <text class="option-icon wechat">💬</text>
                <view class="option-labels ml-2">
                  <view class="option-name font-bold">微信支付</view>
                  <view class="option-sub">亿万用户的首选支付</view>
                </view>
              </view>
              <view class="option-right flex items-center">
                <text class="tag-recommend mr-2">推荐</text>
                <radio :checked="selectedChannel === 'wechat'" color="#22c55e" />
              </view>
            </view>

            <!-- Alipay -->
            <view
              :class="['channel-option-cell', { active: selectedChannel === 'alipay' }]"
              @click="selectedChannel = 'alipay'"
            >
              <view class="option-left flex items-center">
                <text class="option-icon alipay">🔹</text>
                <view class="option-labels ml-2">
                  <view class="option-name font-bold">支付宝</view>
                  <view class="option-sub">支付立减 ¥5 活动中</view>
                </view>
              </view>
              <view class="option-right flex items-center">
                <text class="tag-promo mr-2">立减¥5</text>
                <radio :checked="selectedChannel === 'alipay'" color="#2563eb" />
              </view>
            </view>

            <!-- UnionPay -->
            <view
              :class="['channel-option-cell', { active: selectedChannel === 'union' }]"
              @click="selectedChannel = 'union'"
            >
              <view class="option-left flex items-center">
                <text class="option-icon union">💳</text>
                <view class="option-labels ml-2">
                  <view class="option-name font-bold">银联闪付 / 云闪付</view>
                  <view class="option-sub">持各大行卡片一触即付</view>
                </view>
              </view>
              <view class="option-right flex items-center">
                <radio :checked="selectedChannel === 'union'" color="#dc2626" />
              </view>
            </view>

            <!-- Apple Pay -->
            <view
              :class="['channel-option-cell', { active: selectedChannel === 'apple' }]"
              @click="selectedChannel = 'apple'"
            >
              <view class="option-left flex items-center">
                <text class="option-icon apple"></text>
                <view class="option-labels ml-2">
                  <view class="option-name font-bold">Apple Pay</view>
                  <view class="option-sub">设备安全芯片面容付</view>
                </view>
              </view>
              <view class="option-right flex items-center">
                <radio :checked="selectedChannel === 'apple'" color="#0f172a" />
              </view>
            </view>
          </view>

          <!-- Submit Payment & Friend Pay button -->
          <view class="cashier-action-bar mt-4 flex">
            <wd-button type="primary" class="flex-1" @click="handleCashierPay">立即支付 ¥{{ orderPrice.toFixed(2) }}</wd-button>
            <wd-button type="warning" plain class="flex-1 ml-2" @click="showPeerPayPopup = true">👥 找好友代付</wd-button>
          </view>
        </view>

        <!-- 2. QR CODE SCAN PAY -->
        <view v-slot:default v-else-if="activeId === 2" class="scan-radar-pay-view animate-fade-in text-center flex-column items-center">
          <!-- QR Code channel tabs -->
          <view class="qr-channel-tabs flex justify-center mb-3">
            <view
              v-for="(conf, key) in qrChannels"
              :key="key"
              :class="['qr-channel-tab-item', key, { active: activeQrChannel === key }]"
              @click="activeQrChannel = key"
            >
              {{ conf.name }}
            </view>
          </view>

          <view class="scan-header mb-3">
            <view class="scan-title font-bold text-ink" :style="{ color: qrChannels[activeQrChannel].color }">
              {{ qrChannels[activeQrChannel].name }}
            </view>
            <view class="scan-desc">{{ qrChannels[activeQrChannel].hint }}</view>
          </view>

          <!-- Barcode Display -->
          <view class="scan-barcode-box flex-column items-center">
            <view
              class="barcode-lines"
              :style="{ background: 'repeating-linear-gradient(90deg, ' + qrChannels[activeQrChannel].color + ', ' + qrChannels[activeQrChannel].color + ' 4rpx, #fff 4rpx, #fff 8rpx)' }"
            ></view>
            <text class="barcode-num">9821 0029 8832 9912</text>
          </view>

          <!-- QR Code Box with Laser Scan Beam Animation -->
          <view class="qr-code-radar-container mt-3" :style="{ borderColor: qrChannels[activeQrChannel].color }">
            <!-- Simulated QR code pixels background -->
            <view class="simulated-qr-pixels flex items-center justify-center">
              <view class="qr-corner-square top-left" :style="{ borderColor: qrChannels[activeQrChannel].color }"></view>
              <view class="qr-corner-square top-right" :style="{ borderColor: qrChannels[activeQrChannel].color }"></view>
              <view class="qr-corner-square bottom-left" :style="{ borderColor: qrChannels[activeQrChannel].color }"></view>
              <view class="qr-center-box" :style="{ borderColor: qrChannels[activeQrChannel].color }">
                <text class="logo-emoji">{{ qrChannels[activeQrChannel].emoji }}</text>
              </view>
            </view>

            <!-- Radar Scanner beam moving vertically -->
            <view
              v-if="!isQrExpired"
              class="radar-scan-beam"
              :style="{ background: 'linear-gradient(to right, transparent, ' + qrChannels[activeQrChannel].color + ', transparent)', boxShadow: '0 0 10rpx ' + qrChannels[activeQrChannel].color }"
            ></view>

            <!-- Expired Mask -->
            <view v-if="isQrExpired" class="qr-expired-overlay flex-column items-center justify-center">
              <text class="expired-icon">↻</text>
              <text class="expired-lbl mt-1">付款码已过期</text>
              <wd-button size="small" type="primary" class="mt-2" @click="refreshQrCode">重新生成</wd-button>
            </view>
          </view>

          <!-- Expire Countdown text -->
          <view v-if="!isQrExpired" class="qr-expire-lbl mt-3">
            付款码每分钟自动刷新，剩余有效时间 <text class="sec-text font-bold" :style="{ color: qrChannels[activeQrChannel].color }">{{ qrTimeLeft }}</text> 秒
          </view>

          <!-- Simulator actions -->
          <view class="mock-scanner-triggers mt-4 flex justify-center">
            <wd-button size="medium" type="success" @click="toast.success('模拟商户扫码枪读取中...'); setTimeout(() => { activeId = 5; toast.success('扣款成功！'); }, 1200)">模拟商户扫码扣款</wd-button>
          </view>
        </view>

        <!-- 3. PIN KEYPAD & BIOMETRIC VERIFICATION (PREVIEW TRIGGERS ON PAGE) -->
        <view v-else-if="activeId === 3" class="biometrics-triggers-view animate-fade-in text-center">
          <view class="biometrics-header mb-4">
            <view class="bio-title font-bold text-ink">支付安全校验方式</view>
            <view class="bio-desc">支持6位输入框加物理面容、指纹触觉多维防窃密保护</view>
          </view>

          <view class="biometrics-card-grids">
            <view class="bio-trigger-box flex-column items-center" @click="pinDigits = []; verificationMode = 'pin'; showPinPopup = true">
              <text class="bt-icon">⌨️</text>
              <text class="bt-name font-bold text-ink mt-2">安全密码键盘</text>
              <text class="bt-sub">防录屏键盘排布</text>
            </view>

            <view class="bio-trigger-box flex-column items-center mt-3" @click="pinDigits = []; showPinPopup = true; triggerFaceId()">
              <text class="bt-icon">👤</text>
              <text class="bt-name font-bold text-ink mt-2">Face ID 面容识别</text>
              <text class="bt-sub">人脸识别匹配</text>
            </view>

            <view class="bio-trigger-box flex-column items-center mt-3" @click="pinDigits = []; showPinPopup = true; triggerFingerprint()">
              <text class="bt-icon">👆</text>
              <text class="bt-name font-bold text-ink mt-2">指纹触屏识别</text>
              <text class="bt-sub">密保指纹瞬发校验</text>
            </view>
          </view>
        </view>

        <!-- 4. BLACK GOLD MEMBERSHIP CARD WALLET -->
        <view v-else-if="activeId === 4" class="blackgold-wallet-view animate-fade-in">
          <!-- Black Gold Metal VIP Card -->
          <view class="vip-metal-card flex-column justify-between">
            <view class="vip-card-header flex justify-between items-center">
              <text class="vip-logo font-bold">尊享会员黑金卡 · Black Gold</text>
              <text class="vip-class">VIP 尊享</text>
            </view>
            <view class="vip-card-body mt-2">
              <view class="balance-title">尊享卡剩余可用余额</view>
              <view class="balance-val font-bold">¥ {{ balance.toFixed(2) }}</view>
            </view>
            <view class="vip-card-footer flex justify-between items-center mt-3">
              <text class="card-num font-bold">NO. 8892 0182 7731</text>
              <text class="card-holder font-bold">方家煜 (Fang Jiayu)</text>
            </view>
          </view>

          <!-- Recharge Amount selector Grid -->
          <view class="recharge-grid-panel mt-3">
            <view class="recharge-title font-bold mb-2">尊享卡快捷余额充值</view>
            <view class="recharge-grid-layout">
              <view
                v-for="amt in rechargeGrid"
                :key="amt"
                :class="['recharge-amount-cell', { active: selectedRechargeAmount === amt }]"
                @click="handleRecharge(amt)"
              >
                <text class="recharge-amt-val font-bold">¥ {{ amt }}</text>
                <text class="recharge-bonus">送 ¥{{ Math.floor(amt * 0.05) }}</text>
              </view>
            </view>

            <!-- Custom Amount input -->
            <view class="custom-recharge-row mt-3 flex items-center">
              <text class="custom-lbl font-bold text-ink">自定义金额 ¥</text>
              <input
                v-model="customRechargeVal"
                type="number"
                placeholder="在此输入自定义充值金额"
                class="custom-amt-input ml-2 flex-1"
                @input="selectedRechargeAmount = 0"
              />
            </view>

            <!-- Recharge payment bank sources picker -->
            <view class="recharge-sources-panel mt-3">
              <view class="recharge-title font-bold mb-2 flex justify-between items-center">
                <text>选择扣款账户</text>
                <text class="add-bank-cell-trigger font-bold text-brand" @click="showAddCardPopup = true">+ 添加新银行卡</text>
              </view>
              <view class="recharge-sources-list">
                <view
                  v-for="bank in rechargeBankOptions"
                  :key="bank.id"
                  :class="['recharge-source-row', { active: selectedRechargeBank === bank.id }]"
                  @click="selectedRechargeBank = bank.id"
                >
                  <view class="flex items-center">
                    <text class="source-icon">{{ bank.icon }}</text>
                    <view class="source-meta ml-2">
                      <text class="source-name font-bold text-ink">{{ bank.name }}</text>
                      <text class="source-desc">{{ bank.desc }}</text>
                    </view>
                  </view>
                  <radio :checked="selectedRechargeBank === bank.id" color="#fbbf24" />
                </view>
              </view>
            </view>

            <!-- Confirm topup button -->
            <view class="recharge-action-btn mt-3">
              <wd-button type="warning" block @click="confirmRecharge">确认充值并支付 ¥{{ finalRechargePrice }}</wd-button>
            </view>
          </view>
        </view>

        <!-- 5. PAYMENT RESULT & E-INVOICE GENERATION -->
        <view v-else-if="activeId === 5" class="payment-result-invoice-view animate-fade-in text-center">
          <view class="result-success-circle flex items-center justify-center">✓</view>
          <view class="result-title font-bold text-ink mt-3">付款清算成功</view>
          <view class="result-amount font-bold text-ink mt-1">¥ {{ orderPrice.toFixed(2) }}</view>
          <view class="result-subtitle">您的付款已由安全清算行结算，资金已入账商户。</view>

          <!-- Simulated celebratory Confetti visual lines -->
          <view class="confetti-ribbons-container">
            <text class="ribbon r-1">🎉</text>
            <text class="ribbon r-2">✨</text>
            <text class="ribbon r-3">🎈</text>
          </view>

          <!-- Invoice request toggle and fields -->
          <view class="invoice-box-sheet mt-4 text-left">
            <view class="invoice-head flex justify-between items-center">
              <view>
                <view class="invoice-head-title font-bold text-ink">开具电子发票</view>
                <view class="invoice-head-desc">支持即开即审，瞬间发送至您指定的联系邮箱</view>
              </view>
              <switch :checked="needInvoice" @change="needInvoice = $event.detail.value" color="#2563eb" />
            </view>

            <!-- Invoice fields dropdown panel -->
            <view v-if="needInvoice" class="invoice-form-fields mt-3 animate-fade-in">
              <view class="invoice-field-row">
                <text class="inf-lbl">发票企业抬头</text>
                <input v-model="invoiceTitle" placeholder="如：北京星河互联科技有限公司" class="invoice-native-input mt-1" />
              </view>
              <view class="invoice-field-row mt-2">
                <text class="inf-lbl">纳税人识别号 / 统一社会信用代码</text>
                <input v-model="taxNo" placeholder="请输入 15-20 位企业税号" class="invoice-native-input mt-1" />
              </view>
              <view class="invoice-field-row mt-2">
                <text class="inf-lbl">接收电子邮箱</text>
                <input v-model="email" placeholder="如：finance@starriver.com" class="invoice-native-input mt-1" />
              </view>
              <view class="invoice-submit-btn mt-3">
                <wd-button type="primary" block @click="submitInvoice">确认开具并发送发票</wd-button>
              </view>
            </view>
          </view>

          <!-- Bottom navigation back actions -->
          <view class="result-actions-row mt-4 flex">
            <wd-button type="neutral" plain block class="flex-1" @click="activeId = 1; startCountdown()">回到收银台</wd-button>
            <wd-button type="primary" block class="flex-1 ml-2" @click="toast.success('已进入订单详情流水 (Mock)')">查看账单流水</wd-button>
          </view>
        </view>

      </view>

      <!-- BOTTOM SECURE PIN KEYBOARD & BIOMETRICS DIALOG POPUP MODAL -->
      <wd-popup
        v-model="showPinPopup"
        position="bottom"
        root-portal
        custom-class="pin-keyboard-bottom-popup"
        :z-index="1300"
      >
        <view class="secure-pin-popup-container">
          <!-- Pop Header -->
          <view class="pop-header flex justify-between items-center">
            <text class="pop-title font-bold text-ink">请输入支付密码</text>
            <wd-icon name="close" size="20px" class="close-icon" @click="showPinPopup = false" />
          </view>

          <!-- Cashier brief details -->
          <view class="pop-cashier-details text-center mt-2">
            <view class="pop-merchant">商户：AGY 极速交易结算平台</view>
            <view class="pop-price font-bold text-ink mt-1">¥ {{ orderPrice.toFixed(2) }}</view>
          </view>

          <!-- PIN bullet slots -->
          <view class="secure-bullets-row flex justify-center mt-3">
            <view v-for="i in pinLength" :key="i" class="bullet-box-slot">
              <view v-if="pinDigits.length >= i" class="black-dot-bullet"></view>
            </view>
          </view>

          <!-- Simulated Face ID Overlay Scan Anim -->
          <view v-if="verificationMode === 'face'" class="face-scanner-overlay flex-column items-center justify-center mt-3">
            <view :class="['face-scan-target-frame', faceScanState]">
              <text class="face-emoji">👤</text>
              <view class="scanning-green-laser"></view>
            </view>
            <text class="face-scan-status-lbl mt-2 font-bold text-ink">
              {{ faceScanState === 'scanning' ? '正在匹配您的 Face ID 面容...' : '验证成功' }}
            </text>
          </view>

          <!-- Simulated Fingerprint Overlay -->
          <view v-else-if="verificationMode === 'finger'" class="finger-scanner-overlay flex-column items-center justify-center mt-3">
            <view class="finger-target-sensor-circle flex items-center justify-center">
              <text class="fingerprint-wave">👆</text>
            </view>
            <text class="finger-scan-status-lbl mt-2 font-bold text-ink">请在上方指纹模组录入指纹</text>
          </view>

          <!-- Secure Virtual Keypad (0-9 grids) -->
          <view v-else class="secure-keyboard-grid mt-4">
            <view class="key-cell-num" @click="appendKey('1')">1</view>
            <view class="key-cell-num" @click="appendKey('2')">2</view>
            <view class="key-cell-num" @click="appendKey('3')">3</view>
            
            <view class="key-cell-num" @click="appendKey('4')">4</view>
            <view class="key-cell-num" @click="appendKey('5')">5</view>
            <view class="key-cell-num" @click="appendKey('6')">6</view>
            
            <view class="key-cell-num" @click="appendKey('7')">7</view>
            <view class="key-cell-num" @click="appendKey('8')">8</view>
            <view class="key-cell-num" @click="appendKey('9')">9</view>
            
            <view class="key-cell-special text-brand font-bold" @click="triggerFaceId">面容付</view>
            <view class="key-cell-num" @click="appendKey('0')">0</view>
            <view class="key-cell-special delete-key font-bold" @click="deleteKey">删除</view>
          </view>

          <!-- Secure tip footer -->
          <view class="keypad-secure-guard-tip text-center mt-3">
            🔒 键盘由国家支付通道安全技术规范加密保护，防止录屏截屏泄密。
          </view>
        </view>
      </wd-popup>

      <!-- PEER PAY (FRIEND PAY) GENERATED DIALOG POPUP MODAL -->
      <wd-popup
        v-model="showPeerPayPopup"
        position="center"
        root-portal
        custom-class="peer-pay-center-popup"
        :z-index="1300"
      >
        <view class="peer-pay-container text-center flex-column items-center">
          <text class="peer-pay-header-icon">👥</text>
          <view class="peer-pay-title font-bold text-ink mt-2">已为您生成好友代付链接</view>
          <view class="peer-pay-subtitle mt-1">发给微信好友，由朋友替您付清此账单</view>

          <!-- QR Code mockup of peer pay -->
          <view class="peer-qr-box mt-3 flex items-center justify-center">
            <view class="simulated-qr-pixels">
              <view class="qr-corner-square top-left" style="border-color: #f59e0b;"></view>
              <view class="qr-corner-square top-right" style="border-color: #f59e0b;"></view>
              <view class="qr-corner-square bottom-left" style="border-color: #f59e0b;"></view>
              <view class="qr-center-box" style="border-color: #f59e0b; font-size: 24rpx;">👥</view>
            </view>
          </view>
          <text class="peer-amount-lbl mt-2 font-bold text-ink">代付总计金额：¥ {{ orderPrice.toFixed(2) }}</text>

          <!-- Mock Actions -->
          <view class="peer-actions-group mt-3 flex">
            <wd-button type="neutral" plain @click="showPeerPayPopup = false">取消</wd-button>
            <wd-button type="warning" class="ml-2" @click="copyPeerPayLink">复制代付链接</wd-button>
          </view>
        </view>
      </wd-popup>

      <!-- ADD NEW BANK CARD SHEET POPUP -->
      <wd-popup
        v-model="showAddCardPopup"
        position="bottom"
        root-portal
        custom-class="add-card-bottom-popup"
        :z-index="1300"
      >
        <view class="add-card-container">
          <view class="pop-header flex justify-between items-center">
            <text class="pop-title font-bold text-ink">绑定新储蓄卡/信用卡</text>
            <wd-icon name="close" size="20px" class="close-icon" @click="showAddCardPopup = false" />
          </view>

          <view class="add-card-form mt-3">
            <view class="form-input-row">
              <text class="field-label font-bold">持卡人姓名</text>
              <input v-model="newCardForm.holderName" placeholder="请填入持卡人法定真实姓名" class="card-native-input mt-1" />
            </view>

            <view class="form-input-row mt-2">
              <text class="field-label font-bold">所属银行</text>
              <picker :range="cardBankList" @change="newCardForm.bankName = cardBankList[$event.detail.value]" class="card-native-picker mt-1">
                <view class="picker-inner-box flex justify-between items-center">
                  <text class="picker-val font-bold text-ink">{{ newCardForm.bankName }}</text>
                  <wd-icon name="arrow-down" size="14px" />
                </view>
              </picker>
            </view>

            <view class="form-input-row mt-2">
              <text class="field-label font-bold">银行卡号</text>
              <input v-model="newCardForm.cardNo" type="number" placeholder="请输入 16-19 位卡面数字" class="card-native-input mt-1" />
            </view>

            <view class="form-input-row mt-2">
              <text class="field-label font-bold">银行预留手机号</text>
              <input v-model="newCardForm.phone" type="number" maxlength="11" placeholder="请输入发卡行绑定的密保手机" class="card-native-input mt-1" />
            </view>

            <view class="form-input-row mt-2">
              <text class="field-label font-bold">短信校验码</text>
              <view class="sms-code-input-row flex items-center mt-1">
                <input v-model="newCardForm.smsCode" type="number" maxlength="6" placeholder="请输入验证码" class="card-native-input flex-1" />
                <wd-button size="small" type="primary" class="ml-2 sms-trigger-btn" :disabled="showSmsCountdown" @click="triggerSmsCode">
                  {{ showSmsCountdown ? smsTime + 's后获取' : '获取验证码' }}
                </wd-button>
              </view>
            </view>
          </view>

          <!-- Confirm buttons -->
          <view class="add-card-actions mt-4">
            <wd-button type="warning" block @click="handleAddCardConfirm">确认并绑定该银行卡</wd-button>
          </view>
        </view>
      </wd-popup>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.payment-gallery-page {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* Peer Pay Dialog styles */
:deep(.peer-pay-center-popup) {
  background: transparent;
  width: auto;
}

.peer-pay-container {
  width: 580rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 40rpx;
  box-sizing: border-box;
  box-shadow: 0 12rpx 36rpx rgba(0,0,0,0.15);
}

.peer-pay-header-icon {
  font-size: 80rpx;
}

.peer-pay-title {
  font-size: 26rpx;
}

.peer-pay-subtitle {
  font-size: 19rpx;
  color: var(--app-muted);
}

.peer-qr-box {
  width: 180rpx;
  height: 180rpx;
  border: 4rpx solid #f59e0b;
  border-radius: 16rpx;
  background: #fffbeb;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
}

.peer-qr-box .simulated-qr-pixels {
  width: 100%;
  height: 100%;
  position: relative;
}

.peer-amount-lbl {
  font-size: 22rpx;
}

/* Add Bank Card Bottom sheet styles */
:deep(.add-card-bottom-popup) {
  background: transparent;
  width: auto;
}

.add-card-container {
  width: 100vw;
  background: #fff;
  border-top-left-radius: 28rpx;
  border-top-right-radius: 28rpx;
  padding: 32rpx;
  box-sizing: border-box;
  box-shadow: 0 -12rpx 36rpx rgba(0,0,0,0.1);
}

.add-bank-cell-trigger {
  font-size: 19rpx;
  cursor: pointer;
  
  &:active {
    opacity: 0.8;
  }
}

.form-input-row {
  display: flex;
  flex-direction: column;
}

.card-native-input {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  font-size: 20rpx;
  color: var(--app-ink);
}

.card-native-picker {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
}

.picker-inner-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.picker-val {
  font-size: 20rpx;
}

/* QR Code channel tabs */
.qr-channel-tabs {
  display: flex;
  gap: 12rpx;
  background: #f1f5f9;
  padding: 8rpx;
  border-radius: 99rpx;
  width: 100%;
  box-sizing: border-box;
}

.qr-channel-tab-item {
  flex: 1;
  font-size: 19rpx;
  padding: 12rpx 0;
  border-radius: 99rpx;
  color: var(--app-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 800;
  background: transparent;
  
  &.wechat.active { background: #22c55e; color: #fff; }
  &.alipay.active { background: #2563eb; color: #fff; }
  &.union.active { background: #dc2626; color: #fff; }
}

/* Custom amount input and bank options */
.custom-recharge-row {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
}

.custom-lbl {
  font-size: 21rpx;
}

.custom-amt-input {
  font-size: 21rpx;
  color: var(--app-ink);
  font-weight: 800;
  background: transparent;
}

.recharge-sources-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.recharge-source-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18rpx 20rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.active {
    border-color: #fbbf24;
    background: #fffbeb;
  }
}

.source-icon {
  font-size: 34rpx;
  width: 54rpx;
  height: 54rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}

.source-meta {
  display: flex;
  flex-direction: column;
}

.source-name {
  font-size: 20rpx;
}

.source-desc {
  font-size: 15rpx;
  color: var(--app-muted);
}

/* ==========================================
   TOP TAB SWITCHER STYLES
   ========================================== */
.pay-tabs-scroller {
  display: flex;
  overflow-x: auto;
  gap: 16rpx;
  padding-bottom: 8rpx;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.pay-tab-btn {
  flex: 0 0 200rpx;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 18rpx;
  box-sizing: border-box;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.01);
  transition: all 0.25s ease;
  
  &.active {
    border-color: var(--app-brand);
    background: #eff6ff;
    box-shadow: 0 4rpx 12rpx rgba(37, 99, 235, 0.08);
    
    .tab-btn-title {
      color: var(--app-brand);
    }
  }
}

.tab-btn-title {
  font-size: 21rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.tab-btn-desc {
  font-size: 14rpx;
  color: var(--app-muted);
  display: block;
  margin-top: 6rpx;
  line-height: 1.3;
}

/* ==========================================
   PAY TEMPLATES MAIN CONTAINER CARD
   ========================================== */
.pay-template-card {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  padding: 32rpx;
  min-height: 520rpx;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.01);
}

/* 1. CASHIER COUNTER SPECIFICS */
.price-header {
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 24rpx;
}

.order-title {
  font-size: 19rpx;
  color: var(--app-muted);
}

.order-price {
  font-size: 48rpx;
  margin-top: 6rpx;
}

.countdown-timer {
  font-size: 22rpx;
  color: #ef4444;
}

.countdown-lbl {
  font-size: 19rpx;
  color: var(--app-muted);
}

.cashier-order-box {
  background: #f8fafc;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20rpx;
}

.info-lbl {
  color: var(--app-muted);
}

.info-val {
  color: var(--app-ink);
}

.picker-group-title {
  font-size: 21rpx;
  color: var(--app-ink);
}

.channel-option-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #fff;
  transition: all 0.2s ease;
  margin-top: 14rpx;
  cursor: pointer;
  
  &.active {
    border-color: var(--app-brand);
    background: #f0f7ff;
  }
}

.option-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  
  &.wechat { background: #dcfce7; }
  &.alipay { background: #dbeafe; }
  &.union { background: #fee2e2; }
  &.apple { background: #f1f5f9; }
}

.option-name {
  font-size: 21rpx;
  color: var(--app-ink);
}

.option-sub {
  font-size: 15rpx;
  color: var(--app-muted);
  margin-top: 2rpx;
}

.tag-recommend {
  font-size: 14rpx;
  background: #ef4444;
  color: #fff;
  padding: 2rpx 8rpx;
  border-radius: 6rpx;
  font-weight: 800;
}

.tag-promo {
  font-size: 14rpx;
  background: #2563eb;
  color: #fff;
  padding: 2rpx 8rpx;
  border-radius: 6rpx;
  font-weight: 800;
}

/* 2. SCAN RADAR PAY SPECIFICS */
.scan-desc {
  font-size: 18rpx;
  color: var(--app-muted);
}

.scan-barcode-box {
  background: #f8fafc;
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
  width: 320rpx;
}

.barcode-lines {
  width: 280rpx;
  height: 60rpx;
  background: repeating-linear-gradient(
    90deg,
    #000,
    #000 4rpx,
    #fff 4rpx,
    #fff 8rpx
  );
}

.barcode-num {
  font-size: 15rpx;
  color: var(--app-muted);
  letter-spacing: 2rpx;
  margin-top: 8rpx;
}

.qr-code-radar-container {
  width: 260rpx;
  height: 260rpx;
  border: 4rpx solid var(--app-line);
  border-radius: 20rpx;
  position: relative;
  overflow: hidden;
  background: #f8fafc;
}

.simulated-qr-pixels {
  width: 100%;
  height: 100%;
  position: relative;
  background: repeating-linear-gradient(
    45deg,
    #fff,
    #fff 10rpx,
    rgba(0,0,0,0.03) 10rpx,
    rgba(0,0,0,0.03) 20rpx
  );
}

.qr-corner-square {
  position: absolute;
  width: 44rpx;
  height: 44rpx;
  border: 8rpx solid #000;
  background: #fff;
  border-radius: 6rpx;
  
  &.top-left { top: 12rpx; left: 12rpx; }
  &.top-right { top: 12rpx; right: 12rpx; }
  &.bottom-left { bottom: 12rpx; left: 12rpx; }
}

.qr-center-box {
  width: 50rpx;
  height: 50rpx;
  border-radius: 8rpx;
  background: #fff;
  border: 2rpx solid var(--app-line);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  z-index: 2;
}

.radar-scan-beam {
  position: absolute;
  left: 0;
  width: 100%;
  height: 6rpx;
  background: linear-gradient(to right, transparent, #22c55e, transparent);
  box-shadow: 0 0 10rpx #22c55e;
  animation: radarScan 2.5s linear infinite;
  z-index: 3;
}

.qr-expired-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.92);
  z-index: 5;
}

.expired-icon {
  font-size: 40rpx;
  color: var(--app-muted);
}

.expired-lbl {
  font-size: 19rpx;
  color: var(--app-muted);
}

.qr-expire-lbl {
  font-size: 16rpx;
  color: var(--app-muted);
}

.sec-text {
  color: var(--app-brand);
}

@keyframes radarScan {
  0% { top: 0; }
  50% { top: 250rpx; }
  100% { top: 0; }
}

/* 3. BIOMETRICS TRIGGER CODES */
.bio-desc {
  font-size: 18rpx;
  color: var(--app-muted);
}

.biometrics-card-grids {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.bio-trigger-box {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  padding: 32rpx;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    background: #f1f5f9;
  }
}

.bt-icon {
  font-size: 54rpx;
}

.bt-name {
  font-size: 22rpx;
}

.bt-sub {
  font-size: 16rpx;
  color: var(--app-muted);
}

/* 4. BLACK GOLD VIP CARD WALLET */
.vip-metal-card {
  width: 100%;
  height: 280rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 2rpx solid #334155;
  box-shadow: 0 12rpx 28rpx rgba(15, 23, 42, 0.25);
  padding: 30rpx;
  box-sizing: border-box;
  color: #e2e8f0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 10% 20%, rgba(255,255,255,0.06) 0%, transparent 80%);
    pointer-events: none;
    border-radius: 24rpx;
  }
}

.vip-logo {
  font-size: 19rpx;
  color: #f1f5f9;
}

.vip-class {
  font-size: 15rpx;
  background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
  color: #1e1b4b;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  font-weight: 800;
}

.balance-title {
  font-size: 16rpx;
  color: #94a3b8;
}

.balance-val {
  font-size: 36rpx;
  color: #fbbf24;
}

.card-num, .card-holder {
  font-size: 17rpx;
  color: #e2e8f0;
}

.recharge-grid-layout {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 14rpx;
}

.recharge-amount-cell {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 16rpx 10rpx;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.active {
    border-color: #f59e0b;
    background: #fffbeb;
    
    .recharge-amt-val { color: #d97706; }
  }
}

.recharge-amt-val {
  font-size: 21rpx;
  color: var(--app-ink);
}

.recharge-bonus {
  font-size: 14rpx;
  color: #ef4444;
  display: block;
  margin-top: 4rpx;
  font-weight: 800;
}

/* 5. PAYMENT SUCCESS RECEIPT */
.result-success-circle {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  background: #d1fae5;
  color: #10b981;
  font-size: 44rpx;
  font-weight: 900;
  margin: 0 auto;
}

.result-title {
  font-size: 28rpx;
}

.result-amount {
  font-size: 40rpx;
}

.result-subtitle {
  font-size: 18rpx;
  color: var(--app-muted);
  line-height: 1.5;
}

.confetti-ribbons-container {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-top: 12rpx;
}

.ribbon {
  font-size: 28rpx;
  animation: floatRibbon 1.5s ease-out infinite alternate;
  
  &.r-1 { animation-delay: 0.1s; }
  &.r-2 { animation-delay: 0.4s; }
  &.r-3 { animation-delay: 0.7s; }
}

@keyframes floatRibbon {
  from { transform: translateY(0) scale(1); }
  to { transform: translateY(-10rpx) scale(1.1); }
}

.invoice-box-sheet {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 24rpx;
}

.invoice-head-title {
  font-size: 20rpx;
}

.invoice-head-desc {
  font-size: 15rpx;
  color: var(--app-muted);
}

.invoice-field-row {
  display: flex;
  flex-direction: column;
}

.inf-lbl {
  font-size: 16rpx;
  color: var(--app-ink);
}

.invoice-native-input {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
  padding: 16rpx 20rpx;
  font-size: 18rpx;
  color: var(--app-ink);
}

/* ==========================================
   BOTTOM SECURE KEYBOARD DIALOG MODALS
   ========================================== */
:deep(.pin-keyboard-bottom-popup) {
  background: transparent;
  width: auto;
}

.secure-pin-popup-container {
  width: 100vw;
  background: #fff;
  border-top-left-radius: 28rpx;
  border-top-right-radius: 28rpx;
  padding: 32rpx;
  box-sizing: border-box;
  box-shadow: 0 -12rpx 36rpx rgba(0,0,0,0.1);
}

.pop-header {
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 16rpx;
}

.pop-title {
  font-size: 26rpx;
}

.pop-cashier-details {
  background: #f8fafc;
  padding: 14rpx;
  border-radius: 12rpx;
}

.pop-merchant {
  font-size: 18rpx;
  color: var(--app-muted);
}

.pop-price {
  font-size: 32rpx;
}

.secure-bullets-row {
  gap: 16rpx;
}

.bullet-box-slot {
  width: 50rpx;
  height: 50rpx;
  border: 2rpx solid var(--app-line);
  background: #f8fafc;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.black-dot-bullet {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background: #000;
}

/* virtual keyboard */
.secure-keyboard-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
  background: #f1f5f9;
  padding: 12rpx;
  border-radius: 16rpx;
}

.key-cell-num, .key-cell-special {
  height: 80rpx;
  border-radius: 12rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 800;
  color: var(--app-ink);
  cursor: pointer;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.02);
  
  &:active {
    background: #e2e8f0;
  }
}

.key-cell-special {
  background: #e2e8f0;
  font-size: 20rpx;
  
  &.delete-key {
    background: #fee2e2;
    color: #ef4444;
  }
}

.keypad-secure-guard-tip {
  font-size: 15rpx;
  color: var(--app-muted);
}

/* Face ID scanning animation styles */
.face-scanner-overlay {
  padding: 20rpx 0;
}

.face-scan-target-frame {
  width: 110rpx;
  height: 110rpx;
  border-radius: 16rpx;
  border: 4rpx dashed var(--app-brand);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.scanning {
    animation: pulseFrame 1s infinite alternate;
    .scanning-green-laser {
      display: block;
    }
  }
  
  &.success {
    border-color: #10b981;
    border-style: solid;
    background: #d1fae5;
  }
}

.face-emoji {
  font-size: 54rpx;
}

.scanning-green-laser {
  display: none;
  position: absolute;
  left: 0;
  width: 100%;
  height: 4rpx;
  background: #22c55e;
  box-shadow: 0 0 8rpx #22c55e;
  animation: laserScanDown 1.5s linear infinite;
}

@keyframes laserScanDown {
  0% { top: 0; }
  50% { top: 100rpx; }
  100% { top: 0; }
}

@keyframes pulseFrame {
  from { transform: scale(1); opacity: 0.85; }
  to { transform: scale(1.08); opacity: 1; }
}

.face-scan-status-lbl {
  font-size: 19rpx;
}

/* Fingerprint Scanning styles */
.finger-scanner-overlay {
  padding: 20rpx 0;
}

.finger-target-sensor-circle {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  background: #eff6ff;
  border: 4rpx solid var(--app-brand);
  font-size: 54rpx;
  animation: pulseSensor 1.5s infinite;
}

@keyframes pulseSensor {
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(37, 99, 235, 0.2); }
  70% { transform: scale(1.06); box-shadow: 0 0 16rpx rgba(37, 99, 235, 0.4); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(37, 99, 235, 0.2); }
}

.finger-scan-status-lbl {
  font-size: 19rpx;
}

/* Helpers */
.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.flex-1 { flex: 1; }
.font-bold { font-weight: 800; }
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-ink { color: var(--app-ink); }
.text-brand { color: var(--app-brand); }
.ml-1 { margin-left: 8rpx; }
.ml-2 { margin-left: 16rpx; }
.mr-2 { margin-right: 16rpx; }
.mb-2 { margin-bottom: 16rpx; }
.mb-3 { margin-bottom: 24rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-4 { margin-top: 32rpx; }

.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
