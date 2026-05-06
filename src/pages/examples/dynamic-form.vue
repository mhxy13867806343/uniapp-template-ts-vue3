<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type FormScene = 'customer' | 'activity' | 'invoice' | 'repair'

const formRef = ref()
const toast = useToast('dynamic-form-toast')

const activeScene = ref<FormScene>('customer')
const formData = reactive({
  customerName: '张三',
  customerPhone: '13800138000',
  customerBudget: '18000',
  activityName: '春季拉新活动',
  activityCity: '上海',
  activityPeople: '200',
  invoiceTitle: '星河科技有限公司',
  invoiceTaxNo: '91310000123456789X',
  invoiceAmount: '4800',
  repairDevice: 'H5 支付回调',
  repairOwner: '陈技术',
  repairLevel: '高'
})

const scenes = [
  { label: '客户资料', value: 'customer', desc: '销售线索和预算跟进' },
  { label: '活动报名', value: 'activity', desc: '运营活动和城市人数' },
  { label: '发票信息', value: 'invoice', desc: '企业抬头和税号金额' },
  { label: '设备报修', value: 'repair', desc: '故障设备和处理优先级' }
] as const

const sceneTitle = computed(() => scenes.find((item) => item.value === activeScene.value)?.label || '动态表单')
const sceneDesc = computed(() => scenes.find((item) => item.value === activeScene.value)?.desc || '')

const rules = computed(() => {
  if (activeScene.value === 'customer') {
    return {
      customerName: [{ required: true, message: '请输入客户姓名' }],
      customerPhone: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }],
      customerBudget: [{ required: true, validator: (value: string) => Number(value) > 0, message: '预算必须大于 0' }]
    }
  }

  if (activeScene.value === 'activity') {
    return {
      activityName: [{ required: true, message: '请输入活动名称' }],
      activityCity: [{ required: true, message: '请输入城市' }],
      activityPeople: [{ required: true, validator: (value: string) => Number(value) >= 10, message: '报名人数不少于 10 人' }]
    }
  }

  if (activeScene.value === 'invoice') {
    return {
      invoiceTitle: [{ required: true, message: '请输入发票抬头' }],
      invoiceTaxNo: [{ required: true, message: '请输入税号' }],
      invoiceAmount: [{ required: true, validator: (value: string) => Number(value) > 0, message: '开票金额必须大于 0' }]
    }
  }

  return {
    repairDevice: [{ required: true, message: '请输入报修对象' }],
    repairOwner: [{ required: true, message: '请输入负责人' }],
    repairLevel: [{ required: true, message: '请选择优先级' }]
  }
})

function switchScene(scene: FormScene) {
  activeScene.value = scene
  nextTick(() => {
    formRef.value?.clearValidate?.()
  })
}

async function submitForm() {
  const result = await formRef.value?.validate?.()
  if (!result?.valid) return
  toast.success(`${sceneTitle.value}已保存`)
}
</script>

<template>
  <PageShell title="动态表单" description="切换不同业务类型时，表单字段、校验规则和摘要内容同步变化。">
    <view class="dynamic-page">
      <wd-toast selector="dynamic-form-toast" />

      <view class="scene-tabs">
        <view
          v-for="scene in scenes"
          :key="scene.value"
          :class="['scene-tab', { active: activeScene === scene.value }]"
          @click="switchScene(scene.value)"
        >
          <view>{{ scene.label }}</view>
          <text>{{ scene.desc }}</text>
        </view>
      </view>

      <view class="form-card">
        <view class="card-head">
          <view>
            <view class="card-title">{{ sceneTitle }}</view>
            <view class="card-desc">{{ sceneDesc }}</view>
          </view>
          <wd-tag type="primary" plain>动态规则</wd-tag>
        </view>

        <wd-form ref="formRef" :model="formData" :rules="rules" error-type="message" border>
          <template v-if="activeScene === 'customer'">
            <wd-input v-model="formData.customerName" label="客户姓名" prop="customerName" clearable />
            <wd-input v-model="formData.customerPhone" label="手机号" prop="customerPhone" type="tel" maxlength="11" clearable />
            <wd-input v-model="formData.customerBudget" label="预算" prop="customerBudget" type="digit" clearable />
          </template>

          <template v-if="activeScene === 'activity'">
            <wd-input v-model="formData.activityName" label="活动名称" prop="activityName" clearable />
            <wd-input v-model="formData.activityCity" label="城市" prop="activityCity" clearable />
            <wd-input v-model="formData.activityPeople" label="预计人数" prop="activityPeople" type="number" clearable />
          </template>

          <template v-if="activeScene === 'invoice'">
            <wd-input v-model="formData.invoiceTitle" label="发票抬头" prop="invoiceTitle" clearable />
            <wd-input v-model="formData.invoiceTaxNo" label="税号" prop="invoiceTaxNo" clearable />
            <wd-input v-model="formData.invoiceAmount" label="金额" prop="invoiceAmount" type="digit" clearable />
          </template>

          <template v-if="activeScene === 'repair'">
            <wd-input v-model="formData.repairDevice" label="报修对象" prop="repairDevice" clearable />
            <wd-input v-model="formData.repairOwner" label="负责人" prop="repairOwner" clearable />
            <wd-input v-model="formData.repairLevel" label="优先级" prop="repairLevel" clearable />
          </template>
        </wd-form>
      </view>

      <view class="summary-card">
        <view class="summary-title">实时摘要</view>
        <view v-if="activeScene === 'customer'" class="summary-line">客户 {{ formData.customerName }}，预算 ¥{{ formData.customerBudget }}</view>
        <view v-if="activeScene === 'activity'" class="summary-line">{{ formData.activityCity }} · {{ formData.activityName }} · {{ formData.activityPeople }} 人</view>
        <view v-if="activeScene === 'invoice'" class="summary-line">{{ formData.invoiceTitle }}，开票 ¥{{ formData.invoiceAmount }}</view>
        <view v-if="activeScene === 'repair'" class="summary-line">{{ formData.repairDevice }}，{{ formData.repairLevel }}优先级，{{ formData.repairOwner }}负责</view>
      </view>

      <wd-button type="primary" block @click="submitForm">提交当前表单</wd-button>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.dynamic-page {
  display: grid;
  gap: 22rpx;
}

.scene-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.scene-tab,
.form-card,
.summary-card {
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
}

.scene-tab {
  padding: 22rpx;
}

.scene-tab view {
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 900;
}

.scene-tab text,
.card-desc,
.summary-line {
  color: var(--app-muted);
  font-size: 24rpx;
  line-height: 1.5;
}

.scene-tab text {
  display: block;
  margin-top: 8rpx;
}

.scene-tab.active {
  border-color: var(--app-brand);
  background: #eff6ff;
}

.form-card,
.summary-card {
  padding: 26rpx;
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.card-title,
.summary-title {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 900;
}

.card-desc {
  margin-top: 8rpx;
}

.summary-line {
  margin-top: 12rpx;
}
</style>
