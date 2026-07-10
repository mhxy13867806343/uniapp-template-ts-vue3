<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('wizard-toast')

// Form Stepper state (1: 账号设置, 2: 绑定资料, 3: 安全确认, 4: 提交完成)
const currentStep = ref(1)
const submitting = ref(false)

const formData = reactive({
  // Step 1: 账号设置
  account: '',
  email: '',
  // Step 2: 绑定资料
  realName: '',
  idCard: '',
  phone: '',
  // Step 3: 安全确认
  password: '',
  confirmPassword: '',
  agree: false
})

// Validation helper
function validateStep(step: number): boolean {
  if (step === 1) {
    if (!formData.account.trim()) {
      toast.warning('请输入用户账号')
      return false
    }
    if (formData.account.length < 4) {
      toast.warning('账号长度不能少于4位')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      toast.warning('请输入电子邮箱')
      return false
    }
    if (!emailRegex.test(formData.email)) {
      toast.warning('邮箱格式不正确')
      return false
    }
    return true
  }

  if (step === 2) {
    if (!formData.realName.trim()) {
      toast.warning('请输入真实姓名')
      return false
    }
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (!formData.idCard.trim()) {
      toast.warning('请输入身份证号')
      return false
    }
    if (!idCardRegex.test(formData.idCard)) {
      toast.warning('身份证号格式不正确')
      return false
    }
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!formData.phone.trim()) {
      toast.warning('请输入手机号码')
      return false
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.warning('手机号格式不正确')
      return false
    }
    return true
  }

  if (step === 3) {
    if (!formData.password) {
      toast.warning('请设置登录密码')
      return false
    }
    if (formData.password.length < 6) {
      toast.warning('密码长度不能少于6位')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      toast.warning('两次输入密码不一致')
      return false
    }
    if (!formData.agree) {
      toast.warning('请阅读并同意用户服务协议')
      return false
    }
    return true
  }

  return true
}

function handleNextStep() {
  if (validateStep(currentStep.value)) {
    currentStep.value += 1
    toast.success('本步骤校验通过')
  }
}

function handlePrevStep() {
  if (currentStep.value > 1) {
    currentStep.value -= 1
  }
}

function handleSubmit() {
  if (!validateStep(3)) return

  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    currentStep.value = 4
    toast.success('账号创建并提交成功')
  }, 1500)
}

function handleReset() {
  currentStep.value = 1
  formData.account = ''
  formData.email = ''
  formData.realName = ''
  formData.idCard = ''
  formData.phone = ''
  formData.password = ''
  formData.confirmPassword = ''
  formData.agree = false
}
</script>

<template>
  <PageShell title="分步向导表单" description="完美实现在线多步骤表单，每步独立规则校验，支持上一步/下一步流畅返回。">
    <view class="wizard-form-page">
      <wd-toast selector="wizard-toast" />

      <!-- Horizontal Steps Stepper Indicators -->
      <view class="stepper-tab-bar">
        <view :class="['step-tab-cell', { active: currentStep >= 1, current: currentStep === 1 }]">
          <view class="tab-badge">1</view>
          <text class="tab-name">账号设置</text>
        </view>
        <view class="step-connector-line" :class="{ active: currentStep >= 2 }"></view>
        <view :class="['step-tab-cell', { active: currentStep >= 2, current: currentStep === 2 }]">
          <view class="tab-badge">2</view>
          <text class="tab-name">资料绑定</text>
        </view>
        <view class="step-connector-line" :class="{ active: currentStep >= 3 }"></view>
        <view :class="['step-tab-cell', { active: currentStep >= 3, current: currentStep === 3 }]">
          <view class="tab-badge">3</view>
          <text class="tab-name">安全确认</text>
        </view>
        <view class="step-connector-line" :class="{ active: currentStep >= 4 }"></view>
        <view :class="['step-tab-cell', { active: currentStep >= 4, current: currentStep === 4 }]">
          <view class="tab-badge">✓</view>
          <text class="tab-name">提交完成</text>
        </view>
      </view>

      <!-- Main Form Sheet Card -->
      <view class="wizard-form-card">
        <view v-if="submitting" class="loading-overlay flex-column items-center justify-center">
          <wd-loading size="40px" />
          <text class="loading-lbl mt-2">正在验证并上传数据中...</text>
        </view>

        <view v-else class="step-form-content">
          
          <!-- STEP 1: ACCOUNT INFOS -->
          <view v-if="currentStep === 1" class="form-step-view animate-fade-in">
            <view class="form-section-title font-bold text-ink">第一步：设置您的安全账号</view>
            <view class="form-fields-group mt-3">
              <view class="form-field-item">
                <text class="field-label font-bold">登录账号 <text class="red-star">*</text></text>
                <input v-model="formData.account" placeholder="请输入字母/数字组合账号 (不少于4位)" class="wizard-native-input" />
              </view>
              <view class="form-field-item mt-3">
                <text class="field-label font-bold">电子邮箱 <text class="red-star">*</text></text>
                <input v-model="formData.email" placeholder="请输入安全接收验证码的邮箱" class="wizard-native-input" />
              </view>
            </view>
          </view>

          <!-- STEP 2: PROFILE BINDINGS -->
          <view v-slot:default v-else-if="currentStep === 2" class="form-step-view animate-fade-in">
            <view class="form-section-title font-bold text-ink">第二步：核对并绑定身份信息</view>
            <view class="form-fields-group mt-3">
              <view class="form-field-item">
                <text class="field-label font-bold">真实姓名 <text class="red-star">*</text></text>
                <input v-model="formData.realName" placeholder="请输入您的有效法定姓名" class="wizard-native-input" />
              </view>
              <view class="form-field-item mt-3">
                <text class="field-label font-bold">身份证号 <text class="red-star">*</text></text>
                <input v-model="formData.idCard" type="idcard" maxlength="18" placeholder="请输入 18 位大陆居民身份证号" class="wizard-native-input" />
              </view>
              <view class="form-field-item mt-3">
                <text class="field-label font-bold">手机号码 <text class="red-star">*</text></text>
                <input v-model="formData.phone" type="number" maxlength="11" placeholder="请输入密保绑定的手机号" class="wizard-native-input" />
              </view>
            </view>
          </view>

          <!-- STEP 3: SECURITY AND AGREEMENT -->
          <view v-else-if="currentStep === 3" class="form-step-view animate-fade-in">
            <view class="form-section-title font-bold text-ink">第三步：密码设置与合规同意</view>
            <view class="form-fields-group mt-3">
              <view class="form-field-item">
                <text class="field-label font-bold">设置登录密码 <text class="red-star">*</text></text>
                <input v-model="formData.password" type="password" placeholder="建议使用不少于 6 位强密码" class="wizard-native-input" />
              </view>
              <view class="form-field-item mt-3">
                <text class="field-label font-bold">重复登录密码 <text class="red-star">*</text></text>
                <input v-model="formData.confirmPassword" type="password" placeholder="请再次输入新密码" class="wizard-native-input" />
              </view>
              <view class="agreement-checkbox-row mt-3 flex items-center">
                <checkbox :checked="formData.agree" @click="formData.agree = !formData.agree" color="#2563eb" />
                <text class="agree-lbl-txt ml-2">我已阅读并同意 <text class="text-brand">《用户服务协议》</text> 和 <text class="text-brand">《隐私政策说明》</text></text>
              </view>
            </view>
          </view>

          <!-- STEP 4: SUCCESS SUMMARY FINISH SCREEN -->
          <view v-else-if="currentStep === 4" class="form-step-view finish-step animate-fade-in text-center">
            <view class="success-check-badge flex items-center justify-center">✓</view>
            <view class="finish-title font-bold text-ink mt-3">恭喜您，账号分步申请已完成</view>
            <view class="finish-subtitle mt-1">系统已将本轮步骤录入的所有保密数据封包成功，详情摘要如下：</view>
            
            <view class="finish-summary-card mt-3">
              <view class="summary-field-line">
                <text class="sf-lbl">创建账户：</text>
                <text class="sf-val font-bold">{{ formData.account }}</text>
              </view>
              <view class="summary-field-line">
                <text class="sf-lbl">实名姓名：</text>
                <text class="sf-val font-bold">{{ formData.realName }}</text>
              </view>
              <view class="summary-field-line">
                <text class="sf-lbl">绑定手机：</text>
                <text class="sf-val font-bold">{{ formData.phone }}</text>
              </view>
              <view class="summary-field-line">
                <text class="sf-lbl">安全邮箱：</text>
                <text class="sf-val font-bold">{{ formData.email }}</text>
              </view>
            </view>
          </view>

        </view>
      </view>

      <!-- Action Button Triggers -->
      <view v-if="!submitting" class="form-wizard-action-footer flex mt-4">
        <!-- Back Prev step button -->
        <view
          v-if="currentStep > 1 && currentStep < 4"
          class="wizard-action-btn prev-btn font-bold text-center flex-1"
          @click="handlePrevStep"
        >
          返回上一步
        </view>

        <!-- Forward Next step button -->
        <view
          v-if="currentStep < 3"
          class="wizard-action-btn next-btn font-bold text-center flex-1 ml-2"
          @click="handleNextStep"
        >
          继续下一步
        </view>

        <!-- Final Submit button -->
        <view
          v-if="currentStep === 3"
          class="wizard-action-btn submit-btn font-bold text-center flex-1 ml-2"
          @click="handleSubmit"
        >
          提交并完成
        </view>

        <!-- Restart Reset button -->
        <view
          v-if="currentStep === 4"
          class="wizard-action-btn restart-btn font-bold text-center flex-1"
          @click="handleReset"
        >
          重新创建新表单
        </view>
      </view>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.wizard-form-page {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* ==========================================
   HORIZONTAL STEPPER TAB BAR STYLES
   ========================================== */
.stepper-tab-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 24rpx 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.01);
}

.step-tab-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 100rpx;
  opacity: 0.45;
  transition: all 0.3s ease;
  
  &.active {
    opacity: 1;
    .tab-badge {
      background: var(--app-brand);
      color: #fff;
      border-color: var(--app-brand);
    }
    .tab-name {
      color: var(--app-ink);
      font-weight: 800;
    }
  }
  
  &.current {
    transform: scale(1.08);
    .tab-badge {
      box-shadow: 0 0 12rpx rgba(37, 99, 235, 0.45);
    }
  }
}

.tab-badge {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  border: 3rpx solid var(--app-line);
  background: #f8fafc;
  color: var(--app-muted);
  font-size: 22rpx;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.tab-name {
  font-size: 16rpx;
  color: var(--app-muted);
  margin-top: 8rpx;
  white-space: nowrap;
}

.step-connector-line {
  flex: 1;
  height: 4rpx;
  background: var(--app-line);
  margin-inline: 12rpx;
  margin-top: -24rpx; /* Align with avatar badge */
  border-radius: 99rpx;
  transition: background 0.3s ease;
  
  &.active {
    background: var(--app-brand);
  }
}

/* ==========================================
   FORM SHEET CARD CONTAINER
   ========================================== */
.wizard-form-card {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  padding: 32rpx;
  min-height: 400rpx;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.85);
  z-index: 5;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
}

.loading-lbl {
  font-size: 20rpx;
  color: var(--app-muted);
}

.form-section-title {
  font-size: 24rpx;
  border-left: 6rpx solid var(--app-brand);
  padding-left: 14rpx;
}

.form-field-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.field-label {
  font-size: 20rpx;
  color: var(--app-ink);
}

.red-star {
  color: #ef4444;
}

.wizard-native-input {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
  font-size: 21rpx;
  color: var(--app-ink);
}

.agree-lbl-txt {
  font-size: 17rpx;
  color: var(--app-muted);
  line-height: 1.4;
}

.text-brand {
  color: var(--app-brand);
}

/* Success step */
.success-check-badge {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #d1fae5;
  color: #10b981;
  font-size: 40rpx;
  font-weight: 900;
  margin: 0 auto;
}

.finish-title {
  font-size: 28rpx;
}

.finish-subtitle {
  font-size: 20rpx;
  color: var(--app-muted);
  line-height: 1.5;
}

.finish-summary-card {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.summary-field-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20rpx;
}

.sf-lbl {
  color: var(--app-muted);
}

.sf-val {
  color: var(--app-ink);
}

/* ==========================================
   ACTION BUTTON FOOTER
   ========================================== */
.form-wizard-action-footer {
  gap: 16rpx;
}

.wizard-action-btn {
  padding: 24rpx 0;
  border-radius: 99rpx;
  font-size: 21rpx;
  cursor: pointer;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.02);
  
  &.prev-btn {
    background: #fff;
    color: var(--app-ink);
    border: 1rpx solid var(--app-line);
  }
  
  &.next-btn {
    background: var(--app-brand);
    color: #fff;
  }
  
  &.submit-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.2);
  }
  
  &.restart-btn {
    background: #f1f5f9;
    color: var(--app-ink);
    border: 1rpx solid var(--app-line);
  }
  
  &:active {
    opacity: 0.9;
  }
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.font-bold { font-weight: 800; }
.text-center { text-align: center; }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }

/* Transitions */
.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
