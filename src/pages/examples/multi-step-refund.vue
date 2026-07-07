<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('refund-toast')

// Mock Order Data
const orderInfo = {
  orderNo: 'DX2026070799812',
  shopName: 'AGY 极速数码旗舰店',
  productName: 'ANC 主动降噪无线蓝牙耳机',
  specs: '太空灰 / 旗舰版 / 30h续航',
  price: 1299.00,
  quantity: 1,
  image: '🎧',
  orderDate: '2026-07-07 10:24'
}

// Modal & Step States
const showModal = ref(false)
const currentStep = ref(0)
const submitting = ref(false)

// Form Fields
const serviceType = ref<'refund_only' | 'return_and_refund'>('refund_only')
const refundReason = ref('')
const refundReasons = ['七天无理由退换', '包装破损/少件', '商品质量问题', '商家发错货', '效果未达到预期']
const reasonIndex = ref<number | null>(null)

const refundAmount = ref<string>('1299.00')
const remark = ref('')
const fileList = ref<any[]>([])

// Compute display labels
const selectedReasonText = computed(() => {
  if (reasonIndex.value !== null) {
    return refundReasons[reasonIndex.value]
  }
  return ''
})

function openRefundFlow() {
  // Reset form states
  currentStep.value = 0
  serviceType.value = 'refund_only'
  reasonIndex.value = null
  refundAmount.value = orderInfo.price.toString()
  remark.value = ''
  fileList.value = []
  submitting.value = false
  
  showModal.value = true
}

// Select Service Reason Picker
function handleReasonChange(event: any) {
  reasonIndex.value = event.detail.value
}

// Navigate steps
function nextStep() {
  if (currentStep.value === 0) {
    if (reasonIndex.value === null) {
      toast.warning('请选择申请退款的原因')
      return
    }
    currentStep.value = 1
  }
}

function prevStep() {
  if (currentStep.value === 1) {
    currentStep.value = 0
  }
}

// Upload mock files
function handleUploadSuccess(file: any) {
  fileList.value.push(file)
}

function handleRemoveFile(index: number) {
  fileList.value.splice(index, 1)
}

// Mock form submission
function submitRefund() {
  const amt = parseFloat(refundAmount.value)
  if (isNaN(amt) || amt <= 0) {
    toast.warning('请输入有效的退款金额')
    return
  }
  if (amt > orderInfo.price) {
    toast.error(`最高退款金额不能超过订单总额 ¥${orderInfo.price}`)
    return
  }

  submitting.value = true
  
  // Mock network request
  setTimeout(() => {
    submitting.value = false
    currentStep.value = 2
    toast.success('售后申请已成功提交')
  }, 1800)
}

function viewProgress() {
  showModal.value = false
  toast.success('已跳转至售后详情页 (Mock)')
}
</script>

<template>
  <PageShell title="分步售后退款" description="中间弹出式模态对话框，支持分步售后表单、数值区间校验和模拟提交效果。">
    <view class="multi-step-refund-page">
      <wd-toast selector="refund-toast" />

      <!-- Order Card displayed on the page -->
      <view class="order-details-card">
        <view class="card-header">
          <text class="shop-name">🏢 {{ orderInfo.shopName }}</text>
          <text class="order-status">待发货</text>
        </view>

        <view class="product-item">
          <view class="product-cover">{{ orderInfo.image }}</view>
          <view class="product-info">
            <view class="product-name">{{ orderInfo.productName }}</view>
            <view class="product-specs">{{ orderInfo.specs }}</view>
            <view class="price-qty-row">
              <text class="price">¥{{ orderInfo.price }}</text>
              <text class="quantity">x{{ orderInfo.quantity }}</text>
            </view>
          </view>
        </view>

        <view class="order-meta-info">
          <view class="meta-line">
            <text class="meta-label">订单编号：</text>
            <text class="meta-val">{{ orderInfo.orderNo }}</text>
          </view>
          <view class="meta-line">
            <text class="meta-label">下单时间：</text>
            <text class="meta-val">{{ orderInfo.orderDate }}</text>
          </view>
        </view>

        <view class="card-footer">
          <wd-button type="warning" plain size="medium" @click="openRefundFlow">申请退款</wd-button>
          <wd-button type="primary" size="medium" class="ml-2">联系商家</wd-button>
        </view>
      </view>

      <!-- Advanced Step-by-Step Refund Dialog Modal -->
      <wd-popup
        v-model="showModal"
        position="center"
        root-portal
        custom-class="refund-dialog-popup"
        :z-index="1200"
      >
        <view class="refund-modal-container">
          <view class="modal-header">
            <text class="modal-title">申请售后服务</text>
            <wd-icon v-if="currentStep !== 2" name="close" size="20px" class="close-icon" @click="showModal = false" />
          </view>

          <!-- Steps Progress Indicator -->
          <view class="steps-bar-wrapper">
            <wd-steps :active="currentStep" align-center>
              <wd-step title="类型选择" />
              <wd-step title="详情录入" />
              <wd-step title="提交结果" />
            </wd-steps>
          </view>

          <!-- Step content sections -->
          <view class="modal-body">
            <!-- Loading Indicator while submitting -->
            <view v-if="submitting" class="submitting-overlay">
              <wd-loading size="36px" />
              <view class="submitting-text">正在上传凭证并提交申请...</view>
            </view>

            <!-- STEP 0: Select Type and Reason -->
            <view v-else-if="currentStep === 0" class="step-view step-0">
              <!-- Service Type cards -->
              <view class="label-heading">选择售后类型</view>
              <view class="type-cards-row">
                <view
                  :class="['type-card', { active: serviceType === 'refund_only' }]"
                  @click="serviceType = 'refund_only'"
                >
                  <view class="card-inner-top">
                    <text class="type-icon">💰</text>
                    <text class="type-title">仅退款</text>
                  </view>
                  <view class="type-desc">未收到货，或与商家协商一致不用退货直接退款</view>
                </view>

                <view
                  :class="['type-card', { active: serviceType === 'return_and_refund' }]"
                  @click="serviceType = 'return_and_refund'"
                >
                  <view class="card-inner-top">
                    <text class="type-icon">📦</text>
                    <text class="type-title">退货退款</text>
                  </view>
                  <view class="type-desc">已收到货，需要退回已收到的商品并申请退款</view>
                </view>
              </view>

              <!-- Reason Picker -->
              <view class="label-heading mt-4">退款原因</view>
              <picker :range="refundReasons" @change="handleReasonChange" class="custom-picker">
                <view class="picker-value-box">
                  <text v-if="reasonIndex !== null" class="selected-text">{{ selectedReasonText }}</text>
                  <text v-else class="placeholder-text">请选择退款原因</text>
                  <wd-icon name="arrow-down" size="16px" class="arrow-icon" />
                </view>
              </picker>
            </view>

            <!-- STEP 1: Form Fields & Photo Upload -->
            <view v-else-if="currentStep === 1" class="step-view step-1">
              <!-- Refund Amount with limit check -->
              <view class="label-heading">退款金额 (元)</view>
              <view class="amount-input-box">
                <text class="currency-symbol">¥</text>
                <input
                  v-model="refundAmount"
                  type="digit"
                  class="native-amount-input"
                  placeholder="请输入退款金额"
                />
              </view>
              <view class="amount-tip">最多可退 ¥{{ orderInfo.price }}，包含商品实际支付金额</view>

              <!-- Notes Area -->
              <view class="label-heading mt-4">补充说明</view>
              <textarea
                v-model="remark"
                placeholder="请详细描述申请退款的问题，以便我们更快处理您的售后申请..."
                class="custom-textarea"
                maxlength="200"
              />

              <!-- File Uploader -->
              <view class="label-heading mt-4">上传凭证 (最多 3 张)</view>
              <view class="upload-area">
                <!-- Mock upload items -->
                <view v-for="(file, idx) in fileList" :key="idx" class="uploaded-image-preview">
                  <text class="photo-placeholder-icon">🖼️</text>
                  <view class="delete-photo-btn" @click="handleRemoveFile(idx)">
                    <wd-icon name="close" size="10px" />
                  </view>
                </view>
                
                <view
                  v-if="fileList.length < 3"
                  class="photo-uploader-button"
                  @click="handleUploadSuccess({ id: Date.now() })"
                >
                  <wd-icon name="add" size="24px" class="add-photo-icon" />
                  <text class="add-photo-label">{{ fileList.length }}/3</text>
                </view>
              </view>
            </view>

            <!-- STEP 2: Submission Success State -->
            <view v-else-if="currentStep === 2" class="step-view step-2">
              <view class="success-screen">
                <view class="success-icon-circle">
                  <wd-icon name="success" size="36px" />
                </view>
                <view class="success-title">申请提交成功</view>
                <view class="success-description">
                  我们已接收到您的申请。系统已将订单锁定，售后服务专员将在 <text class="highlight">24小时</text> 内处理完成您的审核。
                </view>
                
                <view class="success-summary-box">
                  <view class="summary-line">
                    <text class="s-label">服务单号</text>
                    <text class="s-val">SH202607078832</text>
                  </view>
                  <view class="summary-line">
                    <text class="s-label">退款金额</text>
                    <text class="s-val price">¥{{ refundAmount }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- Modal Action footer -->
          <view v-if="!submitting" class="modal-footer">
            <template v-if="currentStep === 0">
              <wd-button plain type="neutral" block @click="showModal = false">取消</wd-button>
              <wd-button type="primary" block @click="nextStep" class="ml-2">下一步</wd-button>
            </template>
            <template v-else-if="currentStep === 1">
              <wd-button plain type="neutral" block @click="prevStep">上一步</wd-button>
              <wd-button type="primary" block @click="submitRefund" class="ml-2">提交申请</wd-button>
            </template>
            <template v-else-if="currentStep === 2">
              <wd-button plain type="neutral" block @click="showModal = false">关闭窗口</wd-button>
              <wd-button type="primary" block @click="viewProgress" class="ml-2">查看进度</wd-button>
            </template>
          </view>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.multi-step-refund-page {
  display: grid;
  gap: 24rpx;
}

.order-details-card {
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  background: #fff;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.02);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 18rpx;
}

.shop-name {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.order-status {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--app-brand);
}

.product-item {
  display: flex;
  gap: 20rpx;
}

.product-cover {
  width: 140rpx;
  height: 140rpx;
  background: #f8fafc;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 70rpx;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--app-ink);
  line-height: 1.4;
}

.product-specs {
  font-size: 22rpx;
  color: var(--app-muted);
}

.price-qty-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6rpx;
}

.price {
  font-size: 30rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.quantity {
  font-size: 24rpx;
  color: var(--app-muted);
}

.order-meta-info {
  background: #f8fafc;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.meta-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
}

.meta-label {
  color: var(--app-muted);
}

.meta-val {
  color: var(--app-ink);
  font-weight: 700;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1rpx solid var(--app-line);
  padding-top: 20rpx;
}

.ml-2 {
  margin-left: 16rpx;
}

.mt-4 {
  margin-top: 32rpx;
}

/* Modal styling */
:deep(.refund-dialog-popup) {
  background: transparent;
  width: auto;
}

.refund-modal-container {
  width: 660rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 40rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.close-icon {
  color: var(--app-muted);
}

.steps-bar-wrapper {
  padding: 10rpx 0;
  border-bottom: 1rpx solid var(--app-line);
}

.modal-body {
  min-height: 480rpx;
  position: relative;
}

.submitting-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  z-index: 5;
  gap: 20rpx;
}

.submitting-text {
  font-size: 26rpx;
  color: var(--app-ink);
  font-weight: 700;
}

.label-heading {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--app-ink);
  margin-bottom: 16rpx;
}

.type-cards-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.type-card {
  border: 2rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  transition: all 0.2s ease;

  &.active {
    border-color: var(--app-brand);
    background: #eff6ff;
    
    .type-title {
      color: var(--app-brand);
    }
  }
}

.card-inner-top {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.type-icon {
  font-size: 34rpx;
}

.type-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.type-desc {
  font-size: 20rpx;
  color: var(--app-muted);
  line-height: 1.4;
}

.custom-picker {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #f8fafc;
}

.picker-value-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
}

.selected-text {
  color: var(--app-ink);
  font-weight: 700;
}

.placeholder-text {
  color: var(--app-muted);
}

.arrow-icon {
  color: var(--app-muted);
}

/* Step 1 specifics */
.amount-input-box {
  display: flex;
  align-items: center;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #f8fafc;
  padding: 0 24rpx;
  height: 80rpx;
}

.currency-symbol {
  font-size: 36rpx;
  font-weight: 900;
  color: var(--app-ink);
  margin-right: 12rpx;
}

.native-amount-input {
  flex: 1;
  font-size: 30rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.amount-tip {
  font-size: 22rpx;
  color: var(--app-muted);
  margin-top: 8rpx;
}

.custom-textarea {
  width: 100%;
  height: 160rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #f8fafc;
  padding: 16rpx 20rpx;
  box-sizing: border-box;
  font-size: 26rpx;
  color: var(--app-ink);
  line-height: 1.5;
}

.upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.uploaded-image-preview,
.photo-uploader-button {
  width: 110rpx;
  height: 110rpx;
  border-radius: 12rpx;
  box-sizing: border-box;
}

.uploaded-image-preview {
  background: #f1f5f9;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-placeholder-icon {
  font-size: 50rpx;
}

.delete-photo-btn {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  width: 28rpx;
  height: 28rpx;
  background: #ef4444;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.photo-uploader-button {
  border: 1rpx dashed var(--app-line);
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  
  &:active {
    background: #f1f5f9;
  }
}

.add-photo-icon {
  color: var(--app-muted);
}

.add-photo-label {
  font-size: 18rpx;
  color: var(--app-muted);
}

/* Step 2 specifics */
.success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20rpx 0;
}

.success-icon-circle {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #d1fae5;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.success-title {
  font-size: 34rpx;
  font-weight: 900;
  color: var(--app-ink);
  margin-bottom: 16rpx;
}

.success-description {
  font-size: 24rpx;
  color: var(--app-muted);
  line-height: 1.6;
  padding: 0 10rpx;
}

.highlight {
  color: #10b981;
  font-weight: 800;
}

.success-summary-box {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  width: 100%;
  margin-top: 30rpx;
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  box-sizing: border-box;
}

.summary-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
}

.s-label {
  color: var(--app-muted);
}

.s-val {
  color: var(--app-ink);
  font-weight: 700;
  
  &.price {
    color: #ef4444;
    font-weight: 900;
  }
}

.modal-footer {
  display: flex;
  border-top: 1rpx solid var(--app-line);
  padding-top: 24rpx;
}
</style>
