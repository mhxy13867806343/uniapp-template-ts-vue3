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
const carrierName = ref('中国移动') // 中国移动 | 中国联通 | 中国电信
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
// Tab 2: SMS Verification code logic
// ==========================================
const smsPhone = ref('')
const smsCode = ref('')
const countdown = ref(0)
let timer: any = null

function sendSmsCode() {
  if (!smsPhone.value || !/^1[3-9]\d{9}$/.test(smsPhone.value)) {
    toast.error('请输入正确的手机号')
    return
  }
  countdown.value = 60
  toast.success('验证码已发送 (模拟码: 123456)')
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

onUnload(() => {
  clearInterval(timer)
})

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
</script>

<template>
  <PageShell title="快捷与第三方登录" description="全方位展示运营商一键登录、短信倒计时校验、以及微信/支付宝等高保真第三方授权面板。">
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
             TAB 2: 短信验证码 (SMS Code)
             ========================================== -->
        <view v-else-if="activeTab === 'sms-code'" class="tab-panel sms-code-panel">
          <wd-form border>
            <wd-input v-model="smsPhone" label="手机号" type="tel" maxlength="11" placeholder="请输入您的手机号" clearable />
            <wd-input v-model="smsCode" label="验证码" type="number" maxlength="6" placeholder="请输入六位验证码" clearable>
              <template #suffix>
                <wd-button size="small" type="primary" :disabled="countdown > 0" plain @click="sendSmsCode">
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </wd-button>
              </template>
            </wd-input>
          </wd-form>
          <wd-button type="primary" block class="mt-4" @click="submitSmsLogin">验证并登录</wd-button>
        </view>

        <!-- ==========================================
             TAB 3: 第三方登录 (Third-party OAuth)
             ========================================== -->
        <view v-else-if="activeTab === 'third-party'" class="tab-panel third-party-panel">
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
           SIMULATED AUTHORIZATION OVERLAYS
           ========================================== -->

      <!-- 1. One-tap eSIM Auth Drawer -->
      <wd-popup v-model="showOneTapAuthSheet" position="bottom" custom-class="carrier-drawer-overlay">
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
      <wd-popup v-model="showWechatDrawer" position="bottom" custom-class="wechat-drawer-overlay">
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
      <wd-popup v-model="showAlipayModal" position="center" custom-class="alipay-dialog-overlay">
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
      <wd-popup v-model="showApplePasskey" position="center" custom-class="apple-passkey-overlay">
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
}

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
