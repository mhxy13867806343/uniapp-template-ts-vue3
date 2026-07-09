<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { useUserStore } from '@/store'

const toast = useToast('quick-logins-toast')
const userStore = useUserStore()

const activeTab = ref('one-tap')
const agreementChecked = ref(true)

// Tab list
const tabs = [
  { title: '一键登录', name: 'one-tap' },
  { title: '验证码登录', name: 'sms-code' },
  { title: '第三方登录', name: 'third-party' }
]

// ==========================================
// Tab 1: One-tap eSIM simulated logic
// ==========================================
const carrierName = ref('中国移动')
const mockPhone = ref('138****8888')
const showOneTapAuthSheet = ref(false)

function selectCarrier(name: string) {
  carrierName.value = name
  mockPhone.value = name === '中国移动' ? '138****8888' : name === '中国联通' ? '156****6666' : '189****9999'
  toast.success(`切换至 ${name} 认证节点`)
}

function triggerOneTap() {
  if (!agreementChecked.value) {
    toast.warning('请先同意服务协议')
    return
  }
  showOneTapAuthSheet.value = true
}

function confirmOneTapLogin() {
  showOneTapAuthSheet.value = false
  const finalPhone = carrierName.value === '中国移动' ? '13800138000' : carrierName.value === '中国联通' ? '15600156000' : '18900189000'
  userStore.login({ phone: finalPhone, password: 'one-tap-simulated' })
  toast.success('一键登录授权成功')
  setTimeout(() => {
    uni.switchTab({ url: '/pages/mine/index' })
  }, 400)
}

// ==========================================
// Tab 2: 6 Different SMS Verification Styles
// ==========================================
const activeSmsStyle = ref(1) // 1 to 6
const smsPhone = ref('13800138000')
const smsCode = ref('')
const countdown = ref(0)
let timer: any = null

const smsStyles = [
  { id: 1, name: '标准带提示表单' },
  { id: 2, name: '6位独立数字方格' },
  { id: 3, name: '滑块安全拼图校验' },
  { id: 4, name: '语音验证码兜底' },
  { id: 5, name: '暗黑极简居中' },
  { id: 6, name: '卡片式分步输入' }
]

function sendSmsCode() {
  if (!smsPhone.value || !/^1[3-9]\d{9}$/.test(smsPhone.value)) {
    toast.error('请输入正确的手机号')
    return
  }
  countdown.value = 60
  toast.success('验证码已发送 (模拟码: 123456)')
  clearInterval(timer)
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

function submitSmsLogin() {
  if (!smsPhone.value || !smsCode.value) {
    toast.error('手机号及验证码不能为空')
    return
  }
  if (!agreementChecked.value) {
    toast.warning('请先同意服务协议')
    return
  }
  userStore.login({ phone: smsPhone.value, password: smsCode.value })
  toast.success('验证码登录成功')
  setTimeout(() => {
    uni.switchTab({ url: '/pages/mine/index' })
  }, 400)
}

// Style B: 6-Box OTP simulation
const otpDigits = ref(['1', '2', '3', '', '', ''])
function tapOtpDigit(index: number) {
  const val = prompt('请输入第 ' + (index + 1) + ' 位验证码:')
  if (val !== null) {
    otpDigits.value[index] = val.slice(0, 1)
  }
}

// Style C: Slider Puzzle logic
const sliderProgress = ref(0)
const sliderVerified = ref(false)

function onSliderChange(e: any) {
  const value = e.detail.value
  sliderProgress.value = value
  if (value > 85 && value < 95) {
    sliderVerified.value = true
    toast.success('拼图拼接成功！解锁验证码发送')
    sendSmsCode()
  } else if (value >= 95 || value <= 85) {
    sliderVerified.value = false
  }
}

// Style D: Voice Call simulated
const showVoiceCall = ref(false)

function triggerVoiceCall() {
  showVoiceCall.value = true
  setTimeout(() => {
    showVoiceCall.value = false
    smsCode.value = '654321'
    toast.success('语音验证码播报完成：654321')
  }, 3000)
}

// Style F: Multi-step login flow
const stepIndex = ref(1) // 1: phone, 2: code

// ==========================================
// Tab 3: Third party OAuth simulated drawers
// ==========================================
const showWechatDrawer = ref(false)
const showAlipayModal = ref(false)
const showApplePasskey = ref(false)

function triggerOAuth(platform: 'wechat' | 'alipay' | 'apple') {
  if (!agreementChecked.value) {
    toast.warning('请先同意服务协议')
    return
  }
  if (platform === 'wechat') showWechatDrawer.value = true
  if (platform === 'alipay') showAlipayModal.value = true
  if (platform === 'apple') {
    showApplePasskey.value = true
    setTimeout(() => {
      showApplePasskey.value = false
      userStore.login({ phone: '19900199000', password: 'apple-oauth' })
      toast.success('Apple ID 快捷登录成功')
      setTimeout(() => { uni.switchTab({ url: '/pages/mine/index' }) }, 400)
    }, 1500)
  }
}

function confirmWechatAuth() {
  showWechatDrawer.value = false
  userStore.login({ phone: '18800188000', password: 'wechat-oauth' })
  toast.success('微信授权登录成功')
  setTimeout(() => {
    uni.switchTab({ url: '/pages/mine/index' })
  }, 400)
}

function confirmAlipayAuth() {
  showAlipayModal.value = false
  userStore.login({ phone: '17700177000', password: 'alipay-oauth' })
  toast.success('支付宝授权登录成功')
  setTimeout(() => {
    uni.switchTab({ url: '/pages/mine/index' })
  }, 400)
}

onUnload(() => {
  clearInterval(timer)
})
</script>

<template>
  <PageShell title="快捷与第三方登录" description="解决底层导航栏遮挡，增加 6 种完全不同的短信验证码登录交互模式。">
    <view class="quick-logins-page">
      <wd-toast selector="quick-logins-toast" />

      <!-- Tabs Selector -->
      <wd-tabs v-model="activeTab" class="sticky-tabs">
        <wd-tab v-for="t in tabs" :key="t.name" :title="t.title" :name="t.name" />
      </wd-tabs>

      <view class="sandbox-shell mt-3">
        
        <!-- ==========================================
             TAB 1: 一键登录 (One-tap Carrier)
             ========================================== -->
        <view v-if="activeTab === 'one-tap'" class="tab-panel one-tap-panel">
          <view class="carrier-selection-grid">
            <view :class="['carrier-node', { active: carrierName === '中国移动' }]" @click="selectCarrier('中国移动')">
              <text class="c-logo text-blue">M</text>
              <text class="c-title">中国移动</text>
            </view>
            <view :class="['carrier-node', { active: carrierName === '中国联通' }]" @click="selectCarrier('中国联通')">
              <text class="c-logo text-orange">U</text>
              <text class="c-title">中国联通</text>
            </view>
            <view :class="['carrier-node', { active: carrierName === '中国电信' }]" @click="selectCarrier('中国电信')">
              <text class="c-logo text-green">T</text>
              <text class="c-title">中国电信</text>
            </view>
          </view>

          <view class="e-sim-card text-center mt-4">
            <view class="secure-badge">🛡️ 安全免密网关加密保护</view>
            <view class="carrier-desc-txt mt-2">{{ carrierName }}提供认证服务</view>
            <view class="phone-mask font-bold mt-2">{{ mockPhone }}</view>
            
            <wd-button type="primary" block class="mt-4 pulse-btn" @click="triggerOneTap">本机号码一键登录</wd-button>
          </view>
        </view>

        <!-- ==========================================
             TAB 2: 6种短信验证码登录交互模式 (SMS Code)
             ========================================== -->
        <view v-else-if="activeTab === 'sms-code'" class="tab-panel sms-code-panel">
          <!-- Sub-style menu toggles -->
          <view class="sms-style-selector-row">
            <scroll-view scroll-x class="style-scroll">
              <view class="scroll-flex-row">
                <view
                  v-for="s in smsStyles"
                  :key="s.id"
                  :class="['style-badge', { active: activeSmsStyle === s.id }]"
                  @click="activeSmsStyle = s.id"
                >
                  {{ s.name }}
                </view>
              </view>
            </scroll-view>
          </view>

          <!-- Divider line -->
          <view class="divider-line mt-2"></view>

          <!-- Style 1: Standard Form -->
          <view v-if="activeSmsStyle === 1" class="sms-style-box mt-2">
            <wd-form border>
              <wd-input v-model="smsPhone" label="手机号" type="tel" maxlength="11" placeholder="请输入手机号" clearable />
              <wd-input v-model="smsCode" label="验证码" type="number" maxlength="6" placeholder="验证码" clearable>
                <template #suffix>
                  <wd-button size="small" type="primary" :disabled="countdown > 0" plain @click="sendSmsCode">
                    {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                  </wd-button>
                </template>
              </wd-input>
            </wd-form>
            <wd-button type="primary" block class="mt-4" @click="submitSmsLogin">验证并登录</wd-button>
          </view>

          <!-- Style 2: 6-Box OTP Input -->
          <view v-else-if="activeSmsStyle === 2" class="sms-style-box mt-2">
            <view class="otp-box-title text-center">我们向您的手机号发送了验证码</view>
            <view class="otp-phone-sub text-center mt-1">{{ smsPhone }}</view>
            
            <view class="otp-grid-boxes mt-3">
              <view
                v-for="(digit, idx) in otpDigits"
                :key="idx"
                :class="['otp-square', { active: digit !== '' }]"
                @click="tapOtpDigit(idx)"
              >
                {{ digit }}
              </view>
            </view>
            <view class="otp-tips mt-3 text-center">点击每个方格进行数据录入 (模拟)</view>
            <wd-button type="primary" block class="mt-4" @click="submitSmsLogin">确认验证登录</wd-button>
          </view>

          <!-- Style 3: Slide Puzzle Captcha -->
          <view v-else-if="activeSmsStyle === 3" class="sms-style-box mt-2 text-center">
            <view class="puzzle-card-wrap">
              <view class="puzzle-bg-img relative-context">
                <text class="puzzle-label">🧩 模拟安全滑块验证</text>
                <!-- Target target box (at 90% progress) -->
                <view class="puzzle-target-slot"></view>
                <!-- Dragging piece -->
                <view class="puzzle-drag-piece" :style="{ left: sliderProgress * 0.85 + '%' }">🧩</view>
              </view>
              
              <view class="puzzle-slider-track mt-3">
                <slider :value="sliderProgress" :min="0" :max="100" @changing="onSliderChange" @change="onSliderChange" />
              </view>
              <view class="puzzle-status mt-2">
                <text v-if="sliderVerified" class="text-green font-bold">✓ 验证通过！已自动触发验证码</text>
                <text v-else class="text-muted">请向右拖拽滑块对准背景拼图块</text>
              </view>
            </view>
          </view>

          <!-- Style 4: Voice Call Fallback -->
          <view v-else-if="activeSmsStyle === 4" class="sms-style-box mt-2">
            <wd-form border>
              <wd-input v-model="smsPhone" label="手机号" type="tel" placeholder="请输入手机号" />
              <wd-input v-model="smsCode" label="验证码" placeholder="请输入验证码" />
            </wd-form>
            
            <view class="voice-fallback-link mt-3 text-center" @click="triggerVoiceCall">
              <text class="text-brand font-bold">收不到短信？点击接听语音验证码 📞</text>
            </view>

            <!-- Call animation overlay -->
            <view v-if="showVoiceCall" class="voice-calling-simulation mt-3 flex items-center justify-between">
              <text class="call-wave">📞 正在接听语音播报中...</text>
              <view class="seismic-small">🔊</view>
            </view>

            <wd-button type="primary" block class="mt-4" @click="submitSmsLogin">登录</wd-button>
          </view>

          <!-- Style 5: Cyber Dark Minimal -->
          <view v-else-if="activeSmsStyle === 5" class="sms-style-box dark-theme-otp mt-2">
            <view class="dark-box">
              <view class="neon-title text-center font-bold">CYBER SECURITY LOGIN</view>
              <view class="dark-input-row mt-3">
                <text class="row-icon">📞</text>
                <input v-model="smsPhone" type="tel" placeholder="ENTER PHONE" class="neon-input" />
              </view>
              <view class="dark-input-row mt-2">
                <text class="row-icon">🔑</text>
                <input v-model="smsCode" type="number" placeholder="ENTER CODE" class="neon-input" />
              </view>
              <wd-button type="warning" block class="mt-4" @click="submitSmsLogin">EXECUTE ACCESS</wd-button>
            </view>
          </view>

          <!-- Style 6: Multi-step Card Flow -->
          <view v-else-if="activeSmsStyle === 6" class="sms-style-box mt-2 overflow-hidden">
            <!-- Step 1: Phone Card -->
            <view v-if="stepIndex === 1" class="step-card-box">
              <view class="step-badge">STEP 01/02</view>
              <wd-input v-model="smsPhone" label="确认手机号" type="tel" placeholder="请输入手机号" class="mt-2" />
              <wd-button type="primary" block class="mt-3" @click="stepIndex = 2; sendSmsCode()">发送并下一步</wd-button>
            </view>
            
            <!-- Step 2: Code Card -->
            <view v-else class="step-card-box bg-light-brand">
              <view class="step-badge">STEP 02/02</view>
              <view class="phone-tip-txt mt-1">验证码已发送至：{{ smsPhone }}</view>
              <wd-input v-model="smsCode" label="输入验证码" type="number" placeholder="六位验证码" class="mt-2" />
              <view class="flex mt-3">
                <wd-button size="small" type="neutral" plain @click="stepIndex = 1">上一步</wd-button>
                <wd-button size="small" type="primary" class="ml-2 flex-1" @click="submitSmsLogin">验证并登录</wd-button>
              </view>
            </view>
          </view>
        </view>

        <!-- ==========================================
             TAB 3: 第三方登录 (Third-party OAuth)
             ========================================== -->
        <view v-slot:default v-else-if="activeTab === 'third-party'" class="tab-panel third-party-panel">
          <view class="oauth-headline text-center">选择其他快捷方式登录</view>
          
          <view class="oauth-social-grid mt-4">
            <view class="oauth-social-card wechat" @click="triggerOAuth('wechat')">
              <text class="social-icon">💬</text>
              <text class="social-name">微信一键登录</text>
            </view>
            <view class="oauth-social-card alipay mt-2" @click="triggerOAuth('alipay')">
              <text class="social-icon">💳</text>
              <text class="social-name">支付宝快捷登录</text>
            </view>
            <view class="oauth-social-card apple mt-2" @click="triggerOAuth('apple')">
              <text class="social-icon">🍏</text>
              <text class="social-name">Apple ID 登录</text>
            </view>
          </view>
        </view>

        <!-- Global Agreements -->
        <view class="agreement-box-row mt-4">
          <wd-checkbox v-model="agreementChecked">
            我已阅读并同意 <text class="link-span text-brand">《用户服务协议》</text> 和 <text class="link-span text-brand">《隐私保护政策》</text>
          </wd-checkbox>
        </view>

      </view>

      <!-- ==========================================
           SIMULATED AUTHORIZATION OVERLAYS (z-index: 2000)
           ========================================== -->

      <!-- 1. One-tap eSIM Auth Drawer -->
      <wd-popup v-model="showOneTapAuthSheet" position="bottom" :z-index="2000" custom-style="z-index: 2000 !important;" custom-class="carrier-drawer-overlay">
        <view class="auth-sheet-container">
          <view class="sheet-title-row">
            <text class="sheet-logo">🛡️</text>
            <text class="sheet-heading">本机号一键登录授权</text>
          </view>
          <view class="sheet-body mt-3 text-center">
            <view class="sheet-phone font-bold">{{ mockPhone }}</view>
            <view class="sheet-tip mt-2">申请授权应用获取您的本机号码，以便快速创建账号并登录</view>
          </view>
          <view class="sheet-actions mt-4">
            <wd-button size="small" type="neutral" plain @click="showOneTapAuthSheet = false">拒绝</wd-button>
            <wd-button size="small" type="primary" class="ml-2" @click="confirmOneTapLogin">同意并登录</wd-button>
          </view>
        </view>
      </wd-popup>

      <!-- 2. WeChat OAuth Drawer -->
      <wd-popup v-model="showWechatDrawer" position="bottom" :z-index="2000" custom-style="z-index: 2000 !important;" custom-class="wechat-drawer-overlay">
        <view class="wechat-sheet-container">
          <view class="wechat-head flex items-center justify-between">
            <text class="wechat-title font-bold">微信授权</text>
            <text class="wechat-close" @click="showWechatDrawer = false">×</text>
          </view>
          <view class="wechat-body mt-3">
            <view class="wechat-tip">应用申请使用您的微信头像、昵称、地区和性别信息：</view>
            <view class="wechat-profile-card mt-3">
              <view class="wechat-avatar">U</view>
              <view class="wechat-meta">
                <view class="wechat-nickname font-bold">UniApp 微信测试用户</view>
                <view class="wechat-desc">微信账号快捷绑定</view>
              </view>
            </view>
          </view>
          <view class="wechat-actions mt-4 flex justify-between">
            <wd-button size="small" type="neutral" plain @click="showWechatDrawer = false">拒绝</wd-button>
            <wd-button size="small" type="success" class="ml-2" @click="confirmWechatAuth">允许授权</wd-button>
          </view>
        </view>
      </wd-popup>

      <!-- 3. Alipay OAuth Dialog -->
      <wd-popup v-model="showAlipayModal" position="center" :z-index="2000" custom-style="z-index: 2000 !important;" custom-class="alipay-dialog-overlay">
        <view class="alipay-modal-box">
          <view class="alipay-head flex items-center justify-between">
            <text class="alipay-title font-bold">支付宝安全授权</text>
          </view>
          <view class="alipay-body mt-2">
            <view class="alipay-desc">检测到您手机上的支付宝账号，申请授权获取您的基本会员信息（头像、昵称）。</view>
          </view>
          <view class="alipay-actions mt-4 text-right">
            <wd-button size="small" type="neutral" plain @click="showAlipayModal = false">取消</wd-button>
            <wd-button size="small" type="primary" class="ml-2" @click="confirmAlipayAuth">确认授权</wd-button>
          </view>
        </view>
      </wd-popup>

      <!-- 4. Apple Passkey Mock -->
      <wd-popup v-model="showApplePasskey" position="center" :z-index="2000" custom-style="z-index: 2000 !important;" custom-class="apple-passkey-overlay">
        <view class="apple-passkey-box text-center">
          <view class="apple-passkey-icon">🍏</view>
          <view class="apple-passkey-title font-bold mt-2">使用 Apple ID 登录</view>
          <view class="apple-passkey-desc mt-1">正在校对您的 Face ID / Touch ID 凭证...</view>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.quick-logins-page {
  padding-bottom: 80rpx;
}

.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f8fafc;
}

.sandbox-shell {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.02);
}

.tab-panel {
  display: flex;
  flex-direction: column;
}

/* Tab 1: Carrier */
.carrier-selection-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
}

.carrier-node {
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
  padding: 12rpx 4rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  cursor: pointer;
  background: #f8fafc;
  
  &.active {
    border-color: var(--app-brand);
    background: #eff6ff;
    
    .c-title { color: var(--app-brand); font-weight: 800; }
  }
}

.c-logo {
  font-size: 28rpx;
  font-weight: 900;
  
  &.text-blue { color: #1e88e5; }
  &.text-orange { color: #f97316; }
  &.text-green { color: #10b981; }
}

.c-title {
  font-size: 16rpx;
  color: var(--app-ink);
}

.e-sim-card {
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  border-radius: 12rpx;
  padding: 32rpx;
}

.secure-badge {
  font-size: 18rpx;
  color: #1e3a8a;
  background: #dbeafe;
  padding: 4rpx 16rpx;
  border-radius: 99rpx;
  display: inline-block;
}

.carrier-desc-txt {
  font-size: 19rpx;
  color: #1e3a8a;
}

.phone-mask {
  font-size: 42rpx;
  color: #1e293b;
}

.pulse-btn {
  box-shadow: 0 0 0 rgba(30, 136, 229, 0.4);
  animation: pulseLoginBtn 1.5s infinite;
}

@keyframes pulseLoginBtn {
  0% { box-shadow: 0 0 0 0 rgba(30, 136, 229, 0.4); }
  70% { box-shadow: 0 0 0 16rpx rgba(30, 136, 229, 0); }
  100% { box-shadow: 0 0 0 0 rgba(30, 136, 229, 0); }
}

/* ==========================================
   Tab 2: SMS 6 sub-styles custom CSS
   ========================================== */
.sms-style-selector-row {
  width: 100%;
}

.style-scroll {
  white-space: nowrap;
  width: 100%;
}

.scroll-flex-row {
  display: flex;
  gap: 12rpx;
}

.style-badge {
  display: inline-block;
  padding: 8rpx 20rpx;
  background: #f1f5f9;
  border-radius: 99rpx;
  font-size: 18rpx;
  color: var(--app-muted);
  border: 1rpx solid var(--app-line);
  font-weight: 700;
  
  &.active {
    background: var(--app-brand);
    color: #fff;
    border-color: var(--app-brand);
  }
}

.divider-line {
  height: 1rpx;
  background: var(--app-line);
}

/* Style 2: 6-Box OTP CSS */
.otp-box-title { font-size: 20rpx; color: var(--app-ink); }
.otp-phone-sub { font-size: 18rpx; color: var(--app-muted); }
.otp-grid-boxes {
  display: flex;
  justify-content: space-around;
  gap: 8rpx;
}

.otp-square {
  width: 64rpx;
  height: 64rpx;
  border: 2rpx solid var(--app-line);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 800;
  color: var(--app-ink);
  background: #f8fafc;
  
  &.active {
    border-color: var(--app-brand);
    background: #eff6ff;
  }
}

.otp-tips { font-size: 16rpx; color: var(--app-muted); }

/* Style 3: Puzzle */
.puzzle-card-wrap {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 16rpx;
  background: #fff;
  display: inline-block;
}

.puzzle-bg-img {
  width: 320rpx;
  height: 160rpx;
  background: linear-gradient(45deg, #10b981 0%, #3b82f6 100%);
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.puzzle-label { font-size: 18rpx; color: #fff; opacity: 0.8; }
.puzzle-target-slot {
  position: absolute;
  left: 90%;
  top: 40rpx;
  width: 48rpx;
  height: 48rpx;
  background: rgba(0,0,0,0.5);
  border: 2rpx dashed #fff;
  border-radius: 8rpx;
}

.puzzle-drag-piece {
  position: absolute;
  top: 40rpx;
  width: 48rpx;
  height: 48rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.puzzle-slider-track {
  width: 320rpx;
}

.puzzle-status { font-size: 18rpx; color: var(--app-muted); }

/* Style 4: Voice Call */
.voice-fallback-link { font-size: 18rpx; cursor: pointer; }
.voice-calling-simulation {
  background: #f0fdf4;
  border: 1rpx solid #bbf7d0;
  border-radius: 10rpx;
  padding: 12rpx 20rpx;
}

.call-wave { font-size: 19rpx; color: #16a34a; font-weight: 700; }
.seismic-small { font-size: 26rpx; animation: seismicRing 1s ease infinite; }

@keyframes seismicRing {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* Style 5: Cyber Dark */
.dark-theme-otp {
  background: #020617;
  border-radius: 12rpx;
  padding: 24rpx;
  border: 1rpx solid #ef4444;
}

.neon-title { font-size: 20rpx; color: #ef4444; text-shadow: 0 0 8rpx #ef4444; font-family: monospace; }
.dark-input-row {
  display: flex;
  align-items: center;
  border: 1rpx solid #f97316;
  border-radius: 6rpx;
  padding: 10rpx 16rpx;
  background: #0f172a;
}

.row-icon { font-size: 24rpx; }
.neon-input {
  flex: 1;
  border: none;
  background: transparent;
  color: #fb923c;
  font-family: monospace;
  font-size: 21rpx;
  margin-left: 12rpx;
}

/* Style 6: Step Card */
.step-card-box {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 24rpx;
  background: #fff;
  transition: all 0.3s ease;
  
  &.bg-light-brand {
    background: #f5f8ff;
    border-color: #bfdbfe;
  }
}

.step-badge {
  font-size: 16rpx;
  background: var(--app-muted);
  color: #fff;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  display: inline-block;
}

.phone-tip-txt { font-size: 18rpx; color: var(--app-muted); }

.flex-1 { flex: 1; }

/* Tab 3: Third party */
.oauth-headline {
  font-size: 21rpx;
  color: var(--app-muted);
}

.oauth-social-grid {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.oauth-social-card {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  cursor: pointer;
  
  &.wechat {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #16a34a;
  }
  
  &.alipay {
    background: #f0f9ff;
    border-color: #bae6fd;
    color: #0284c7;
  }
  
  &.apple {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #1e293b;
  }
  
  &:active {
    filter: brightness(0.9);
  }
}

.social-icon { font-size: 32rpx; }
.social-name { font-size: 22rpx; font-weight: 800; }

/* Agreement link box */
.agreement-box-row {
  display: flex;
  justify-content: center;
}

.link-span {
  font-weight: 750;
  display: inline-block;
}

/* ==========================================
   SIMULATED MODALS OVERLAYS STYLES
   ========================================== */

/* 1. eSIM Carrier sheet */
.auth-sheet-container {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.sheet-title-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.sheet-logo { font-size: 36rpx; }
.sheet-heading { font-size: 24rpx; font-weight: 850; color: var(--app-ink); }
.sheet-phone { font-size: 38rpx; color: var(--app-ink); }
.sheet-tip { font-size: 19rpx; color: var(--app-muted); line-height: 1.4; }
.sheet-actions { display: flex; justify-content: flex-end; }

/* 2. WeChat drawer */
.wechat-sheet-container {
  background: #f3f4f6;
  border-radius: 20rpx 20rpx 0 0;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.wechat-head flex { display: flex; align-items: center; }
.wechat-title { font-size: 24rpx; color: #16a34a; }
.wechat-close { font-size: 32rpx; color: var(--app-muted); cursor: pointer; }
.wechat-tip { font-size: 19rpx; color: var(--app-ink); }
.wechat-profile-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.wechat-avatar {
  width: 72rpx;
  height: 72rpx;
  background: #22c55e;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 800;
}

.wechat-nickname { font-size: 21rpx; color: var(--app-ink); }
.wechat-desc { font-size: 16rpx; color: var(--app-muted); }
.wechat-actions { display: flex; justify-content: space-between; }

/* 3. Alipay dialog */
.alipay-modal-box {
  width: 500rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
}

.alipay-title { font-size: 22rpx; color: #0284c7; }
.alipay-desc { font-size: 19rpx; color: var(--app-muted); line-height: 1.4; }
.alipay-actions { display: flex; justify-content: flex-end; }

/* 4. Apple Passkey Mock */
.apple-passkey-box {
  width: 450rpx;
  background: rgba(255,255,255,0.95);
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.15);
}

.apple-passkey-icon { font-size: 64rpx; }
.apple-passkey-title { font-size: 24rpx; color: #000; }
.apple-passkey-desc { font-size: 18rpx; color: var(--app-muted); }

.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-4 { margin-top: 32rpx; }
.ml-2 { margin-left: 16rpx; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.font-bold { font-weight: 800; }
</style>
