<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type BillingCycle = 'monthly' | 'yearly'
type PlanKey = 'basic' | 'premium' | 'plus'
type PayMethod = 'wechat' | 'alipay' | 'bank'

interface Plan {
  key: PlanKey
  name: string
  subtitle: string
  monthly: number
  yearly: number
  originalMonthly?: number
  originalYearly?: number
  badge?: string
  features: string[]
}

const toast = useToast('subscription-toast')
const message = useMessage('subscription-message')

const cycle = ref<BillingCycle>('monthly')
const selectedPlan = ref<PlanKey>('premium')
const selectedPay = ref<PayMethod>('wechat')
const bankPopupVisible = ref(false)

const bankForm = reactive({
  cardNo: '6222 8888 6666 1234',
  holder: '模板用户',
  phone: '13800138000'
})

const plans: Plan[] = [
  {
    key: 'basic',
    name: '基础',
    subtitle: '适合轻量使用',
    monthly: 3,
    yearly: 30,
    features: ['小范围内容推广', '为文件夹添加书签', '亮点标签', '编辑帖子']
  },
  {
    key: 'premium',
    name: 'Premium',
    subtitle: '推荐团队和高频用户',
    monthly: 4,
    yearly: 48,
    originalMonthly: 8,
    originalYearly: 96,
    badge: '2 个月享 50% 折扣',
    features: ['基础订阅全部内容', '认证账号标记', '增强模型使用权', '高级分析']
  },
  {
    key: 'plus',
    name: 'Premium+',
    subtitle: '适合增长和商业化',
    monthly: 20,
    yearly: 240,
    originalMonthly: 40,
    originalYearly: 480,
    badge: '2 个月享 50% 折扣',
    features: ['Premium 全部内容', '完全免广告', '高级市场洞察', '优先客户支持']
  }
]

const payMethods = [
  {
    key: 'wechat',
    name: '微信支付',
    desc: '适合微信小程序、H5 微信环境和 App 微信 SDK',
    mark: '微'
  },
  {
    key: 'alipay',
    name: '支付宝',
    desc: '适合支付宝小程序、H5 和 App 支付宝 SDK',
    mark: '支'
  },
  {
    key: 'bank',
    name: '银行卡',
    desc: '适合企业付款、订阅续费和手动扣款场景',
    mark: '卡'
  }
] as const

const currentPlan = computed(() => plans.find((item) => item.key === selectedPlan.value) || plans[1])
const currentPrice = computed(() => cycle.value === 'monthly' ? currentPlan.value.monthly : currentPlan.value.yearly)
const currentOriginalPrice = computed(() => cycle.value === 'monthly' ? currentPlan.value.originalMonthly : currentPlan.value.originalYearly)
const cycleText = computed(() => cycle.value === 'monthly' ? '月度' : '年度')
const unitText = computed(() => cycle.value === 'monthly' ? '/ 月' : '/ 年')

function choosePayment(method: PayMethod) {
  selectedPay.value = method
  if (method === 'bank') {
    bankPopupVisible.value = true
  }
}

async function submitPayment() {
  if (selectedPay.value === 'bank' && !bankForm.cardNo.trim()) {
    toast.warning('请先填写银行卡信息')
    bankPopupVisible.value = true
    return
  }

  const payName = payMethods.find((item) => item.key === selectedPay.value)?.name || '支付'

  try {
    await message.confirm({
      title: '确认订阅并支付？',
      msg: `${currentPlan.value.name} ${cycleText.value}套餐，${payName}，金额 US$${currentPrice.value}`,
      confirmButtonText: '确认支付',
      cancelButtonText: '再看看'
    })
    toast.success(`${payName} 支付已创建`)
  } catch {
    toast.info('已取消支付')
  }
}
</script>

<template>
  <PageShell title="订阅支付" description="会员订阅模板，支持月/年套餐切换和微信、支付宝、银行卡支付方式。">
    <view class="subscription-page">
      <wd-toast selector="subscription-toast" />
      <wd-message-box selector="subscription-message" />

      <view class="premium-hero">
        <view class="hero-glow" />
        <view class="hero-kicker">PREMIUM ACCESS</view>
        <view class="hero-title">Premium 可节省 50%</view>
        <view class="cycle-switch">
          <view :class="['cycle-item', { active: cycle === 'yearly' }]" @click="cycle = 'yearly'">年度</view>
          <view :class="['cycle-item', { active: cycle === 'monthly' }]" @click="cycle = 'monthly'">月度</view>
        </view>
      </view>

      <view class="plan-list">
        <view
          v-for="plan in plans"
          :key="plan.key"
          :class="['plan-card', { active: selectedPlan === plan.key }]"
          @click="selectedPlan = plan.key"
        >
          <view class="plan-head">
            <view class="min-w-0">
              <view class="plan-name">{{ plan.name }}</view>
              <view class="plan-subtitle">{{ plan.subtitle }}</view>
            </view>
            <view class="radio-dot">
              <wd-icon v-if="selectedPlan === plan.key" name="check" size="16px" />
            </view>
          </view>
          <view class="plan-main">
            <view>
              <view v-if="plan.badge" class="discount-badge">{{ plan.badge }}</view>
              <view class="price-line">
                <text v-if="currentOriginalPrice && selectedPlan === plan.key" class="strike">US${{ currentOriginalPrice }}</text>
                <text v-else-if="cycle === 'monthly' && plan.originalMonthly" class="strike">US${{ plan.originalMonthly }}</text>
                <text v-else-if="cycle === 'yearly' && plan.originalYearly" class="strike">US${{ plan.originalYearly }}</text>
                <text class="plan-price">US${{ cycle === 'monthly' ? plan.monthly : plan.yearly }}</text>
                <text class="unit">{{ unitText }}</text>
              </view>
            </view>
            <view class="feature-list">
              <view
                v-for="feature in selectedPlan === plan.key ? plan.features : plan.features.slice(0, 2)"
                :key="feature"
                class="feature-item"
              >
                <view class="feature-icon">✓</view>
                <text>{{ feature }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="pay-panel">
        <view class="section-title">支付方式</view>
        <view class="pay-list">
          <view
            v-for="method in payMethods"
            :key="method.key"
            :class="['pay-method', { active: selectedPay === method.key }]"
            @click="choosePayment(method.key)"
          >
            <view class="pay-mark">{{ method.mark }}</view>
            <view class="min-w-0 flex-1">
              <view class="pay-name">{{ method.name }}</view>
              <view class="pay-desc">{{ method.desc }}</view>
            </view>
            <wd-icon v-if="selectedPay === method.key" name="check" size="18px" />
          </view>
        </view>
      </view>

      <view class="agreement-card">
        订阅即表示你同意购买者服务条款。除非提前取消，否则订阅将自动续订。你可以在支付平台或应用订阅管理中取消。
      </view>

      <view v-if="!bankPopupVisible" class="bottom-bar">
        <view>
          <view class="bar-plan">{{ currentPlan.name }}</view>
          <view class="bar-price">
            <text v-if="currentOriginalPrice" class="strike">US${{ currentOriginalPrice }}</text>
            <text>US${{ currentPrice }}</text>
            <text class="unit">{{ unitText }}</text>
          </view>
        </view>
        <wd-button type="primary" custom-class="pay-button" @click="submitPayment">订阅并支付</wd-button>
      </view>

      <wd-popup
        v-model="bankPopupVisible"
        position="bottom"
        safe-area-inset-bottom
        root-portal
        custom-class="bank-popup"
        :z-index="1200"
      >
        <view class="bank-panel">
          <view class="section-title">银行卡信息</view>
          <wd-cell-group border>
            <wd-input v-model="bankForm.cardNo" label="卡号" clearable />
            <wd-input v-model="bankForm.holder" label="持卡人" clearable />
            <wd-input v-model="bankForm.phone" label="预留手机" type="tel" maxlength="11" clearable />
          </wd-cell-group>
          <wd-button type="primary" block @click="bankPopupVisible = false">保存银行卡</wd-button>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.subscription-page {
  display: grid;
  gap: 22rpx;
  margin-inline: -32rpx;
  padding: 0 28rpx 290rpx;
  background: #030609;
  color: #fff;
}

.premium-hero {
  position: relative;
  overflow: hidden;
  border-radius: 0 0 32rpx 32rpx;
  margin-inline: -28rpx;
  padding: 42rpx 28rpx 30rpx;
  text-align: center;
}

.premium-hero::before {
  position: absolute;
  inset: 0;
  content: '';
  background:
    radial-gradient(circle at 50% 0%, rgba(30, 136, 229, 0.36), transparent 22%),
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.12), transparent 2%),
    radial-gradient(circle at 70% 45%, rgba(255, 255, 255, 0.16), transparent 2%),
    linear-gradient(180deg, #05090d, #030609);
}

.hero-glow,
.hero-kicker,
.hero-title,
.cycle-switch {
  position: relative;
  z-index: 1;
}

.hero-glow {
  width: 78rpx;
  height: 58rpx;
  border: 2rpx solid #159cff;
  border-radius: 36rpx;
  box-shadow: 0 0 24rpx rgba(30, 136, 229, 0.95);
  margin: 0 auto 20rpx;
}

.hero-kicker {
  color: rgba(255, 255, 255, 0.54);
  font-size: 22rpx;
  font-weight: 800;
}

.hero-title {
  margin-top: 12rpx;
  color: #fff;
  font-size: 42rpx;
  font-weight: 900;
  line-height: 1.2;
}

.cycle-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 380rpx;
  max-width: 100%;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.1);
  margin: 28rpx auto 0;
  padding: 6rpx;
}

.cycle-item {
  border-radius: 999rpx;
  color: rgba(255, 255, 255, 0.5);
  font-size: 26rpx;
  font-weight: 800;
  padding: 13rpx 0;
}

.cycle-item.active {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.plan-list {
  display: grid;
  gap: 18rpx;
}

.plan-card {
  width: 100%;
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  border-radius: 22rpx;
  background: #1a1f25;
  padding: 24rpx;
}

.plan-card.active {
  border-color: #fff;
  box-shadow: 0 0 0 2rpx rgba(255, 255, 255, 0.78);
}

.plan-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
}

.plan-name {
  color: #fff;
  font-size: 32rpx;
  font-weight: 900;
}

.plan-subtitle {
  margin-top: 8rpx;
  color: rgba(255, 255, 255, 0.54);
  font-size: 23rpx;
}

.radio-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34rpx;
  height: 34rpx;
  flex: 0 0 34rpx;
  border: 4rpx solid #8c939d;
  border-radius: 50%;
  color: #fff;
}

.plan-card.active .radio-dot {
  border-color: #fff;
  background: #fff;
  color: #101418;
}

.discount-badge {
  display: inline-flex;
  border-radius: 999rpx;
  background: rgba(18, 183, 106, 0.18);
  color: #32d583;
  font-size: 22rpx;
  font-weight: 800;
  margin-top: 20rpx;
  padding: 7rpx 16rpx;
}

.plan-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

.price-line {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  margin-top: 18rpx;
}

.strike {
  color: rgba(255, 255, 255, 0.48);
  text-decoration: line-through;
}

.plan-price {
  color: #fff;
  font-size: 44rpx;
  font-weight: 900;
}

.unit {
  color: rgba(255, 255, 255, 0.62);
  font-size: 24rpx;
}

.feature-list {
  display: grid;
  gap: 14rpx;
  margin-top: 22rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: rgba(255, 255, 255, 0.88);
  font-size: 25rpx;
  font-weight: 700;
}

.feature-icon,
.pay-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 46rpx;
  width: 46rpx;
  height: 46rpx;
  border-radius: 13rpx;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 900;
}

.pay-panel,
.agreement-card {
  border: 1rpx solid rgba(255, 255, 255, 0.14);
  border-radius: 20rpx;
  background: #151a20;
  padding: 24rpx;
}

.section-title {
  color: #fff;
  font-size: 30rpx;
  font-weight: 900;
  margin-bottom: 20rpx;
}

.pay-list {
  display: grid;
  gap: 16rpx;
}

.pay-method {
  display: flex;
  align-items: center;
  gap: 18rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.12);
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.04);
  padding: 18rpx;
}

.pay-method.active {
  border-color: #fff;
}

.pay-name {
  color: #fff;
  font-size: 27rpx;
  font-weight: 800;
}

.pay-desc,
.agreement-card {
  color: rgba(255, 255, 255, 0.56);
  font-size: 24rpx;
  line-height: 1.6;
}

.pay-desc {
  margin-top: 6rpx;
}

.bottom-bar {
  position: fixed;
  right: 0;
  bottom: calc(112rpx + env(safe-area-inset-bottom));
  left: 0;
  z-index: 880;
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) 1fr;
  gap: 18rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.12);
  background: rgba(3, 6, 9, 0.94);
  padding: 18rpx 28rpx;
  backdrop-filter: blur(16rpx);
}

.bar-plan {
  color: #fff;
  font-size: 25rpx;
  font-weight: 900;
}

.bar-price {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
  margin-top: 8rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: 900;
}

:deep(.pay-button) {
  border-radius: 999rpx;
  background: #fff !important;
  color: #030609 !important;
  font-weight: 900;
}

:deep(.bank-popup) {
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
}

.bank-panel {
  display: grid;
  gap: 24rpx;
  background: #fff;
  padding: 32rpx 32rpx calc(48rpx + env(safe-area-inset-bottom));
}

.bank-panel .section-title {
  color: var(--app-ink);
  margin-bottom: 0;
}
</style>
