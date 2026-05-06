<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type FormScene = 'customer' | 'activity' | 'invoice' | 'repair'

interface DetailRow {
  id: number
  name: string
  count: string
  amount: string
}

const formRef = ref()
const toast = useToast('dynamic-form-toast')

const activeScene = ref<FormScene>('customer')
const formData = reactive({
  customerName: '张三',
  customerPhone: '13800138000',
  customerBudget: '18000',
  customerSource: 'mini',
  customerType: 'enterprise',
  customerRemark: '客户关注多端应用模板，希望先验证 H5 和小程序。',
  activityName: '春季拉新活动',
  activityCity: '上海',
  activityPeople: '200',
  activityChannel: 'douyin',
  activityMode: 'online',
  activityRemark: '需要同步落地页、报名表和数据看板。',
  invoiceTitle: '星河科技有限公司',
  invoiceTaxNo: '91310000123456789X',
  invoiceAmount: '4800',
  invoiceType: 'special',
  invoiceContent: 'software',
  repairDevice: 'H5 支付回调',
  repairOwner: '陈技术',
  repairLevel: '高',
  repairCategory: 'payment',
  repairMode: 'remote',
  repairRemark: '支付回调偶现超时，需要补充日志和重试策略。'
})

const detailRows = ref<DetailRow[]>([
  { id: 1, name: '设计联调', count: '1', amount: '1200' },
  { id: 2, name: '接口联调', count: '2', amount: '1800' }
])

const scenes = [
  { label: '客户资料', value: 'customer', desc: '销售线索和预算跟进' },
  { label: '活动报名', value: 'activity', desc: '运营活动和城市人数' },
  { label: '发票信息', value: 'invoice', desc: '企业抬头和税号金额' },
  { label: '设备报修', value: 'repair', desc: '故障设备和处理优先级' }
] as const

const sourceOptions = [
  { label: '微信小程序', value: 'mini' },
  { label: '抖音小程序', value: 'douyin' },
  { label: 'H5 活动页', value: 'h5' },
  { label: 'App 端', value: 'app' }
]

const channelOptions = [
  { label: '抖音投放', value: 'douyin' },
  { label: '私域社群', value: 'community' },
  { label: '线下门店', value: 'store' }
]

const invoiceContentOptions = [
  { label: '软件服务', value: 'software' },
  { label: '技术咨询', value: 'consulting' },
  { label: '平台订阅', value: 'subscription' }
]

const repairCategoryOptions = [
  { label: '支付问题', value: 'payment' },
  { label: '登录异常', value: 'auth' },
  { label: '性能告警', value: 'performance' }
]

const sceneTitle = computed(() => scenes.find((item) => item.value === activeScene.value)?.label || '动态表单')
const sceneDesc = computed(() => scenes.find((item) => item.value === activeScene.value)?.desc || '')
const detailTotal = computed(() =>
  detailRows.value.reduce((total, row) => total + Number(row.count || 0) * Number(row.amount || 0), 0)
)

const rules = computed(() => {
  if (activeScene.value === 'customer') {
    return {
      customerName: [{ required: true, message: '请输入客户姓名' }],
      customerPhone: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }],
      customerBudget: [{ required: true, validator: (value: string) => Number(value) > 0, message: '预算必须大于 0' }],
      customerSource: [{ required: true, message: '请选择来源' }],
      customerType: [{ required: true, message: '请选择客户类型' }]
    }
  }

  if (activeScene.value === 'activity') {
    return {
      activityName: [{ required: true, message: '请输入活动名称' }],
      activityCity: [{ required: true, message: '请输入城市' }],
      activityPeople: [{ required: true, validator: (value: string) => Number(value) >= 10, message: '报名人数不少于 10 人' }],
      activityChannel: [{ required: true, message: '请选择活动渠道' }],
      activityMode: [{ required: true, message: '请选择活动形式' }]
    }
  }

  if (activeScene.value === 'invoice') {
    return {
      invoiceTitle: [{ required: true, message: '请输入发票抬头' }],
      invoiceTaxNo: [{ required: true, message: '请输入税号' }],
      invoiceAmount: [{ required: true, validator: (value: string) => Number(value) > 0, message: '开票金额必须大于 0' }],
      invoiceType: [{ required: true, message: '请选择发票类型' }],
      invoiceContent: [{ required: true, message: '请选择开票内容' }]
    }
  }

  return {
    repairDevice: [{ required: true, message: '请输入报修对象' }],
    repairOwner: [{ required: true, message: '请输入负责人' }],
    repairLevel: [{ required: true, message: '请选择优先级' }],
    repairCategory: [{ required: true, message: '请选择故障分类' }],
    repairMode: [{ required: true, message: '请选择处理方式' }]
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

function addDetailRow() {
  detailRows.value.push({
    id: Date.now(),
    name: '',
    count: '1',
    amount: ''
  })
}

function removeDetailRow(id: number) {
  if (detailRows.value.length === 1) {
    toast.warning('至少保留一行明细')
    return
  }
  detailRows.value = detailRows.value.filter((row) => row.id !== id)
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
            <wd-picker
              v-model="formData.customerSource"
              label="来源渠道"
              prop="customerSource"
              :columns="sourceOptions"
              root-portal
            />
            <view class="form-block">
              <view class="block-label">客户类型</view>
              <wd-radio-group v-model="formData.customerType" cell shape="button">
                <wd-radio value="enterprise">企业客户</wd-radio>
                <wd-radio value="personal">个人客户</wd-radio>
                <wd-radio value="agency">渠道代理</wd-radio>
              </wd-radio-group>
            </view>
            <wd-textarea v-model="formData.customerRemark" label="复杂备注" prop="customerRemark" maxlength="120" show-word-limit />
          </template>

          <template v-if="activeScene === 'activity'">
            <wd-input v-model="formData.activityName" label="活动名称" prop="activityName" clearable />
            <wd-input v-model="formData.activityCity" label="城市" prop="activityCity" clearable />
            <wd-input v-model="formData.activityPeople" label="预计人数" prop="activityPeople" type="number" clearable />
            <wd-picker
              v-model="formData.activityChannel"
              label="活动渠道"
              prop="activityChannel"
              :columns="channelOptions"
              root-portal
            />
            <view class="form-block">
              <view class="block-label">活动形式</view>
              <wd-radio-group v-model="formData.activityMode" cell shape="button">
                <wd-radio value="online">线上活动</wd-radio>
                <wd-radio value="offline">线下活动</wd-radio>
                <wd-radio value="hybrid">混合活动</wd-radio>
              </wd-radio-group>
            </view>
            <wd-textarea v-model="formData.activityRemark" label="执行说明" maxlength="120" show-word-limit />
          </template>

          <template v-if="activeScene === 'invoice'">
            <wd-input v-model="formData.invoiceTitle" label="发票抬头" prop="invoiceTitle" clearable />
            <wd-input v-model="formData.invoiceTaxNo" label="税号" prop="invoiceTaxNo" clearable />
            <wd-input v-model="formData.invoiceAmount" label="金额" prop="invoiceAmount" type="digit" clearable />
            <wd-picker
              v-model="formData.invoiceContent"
              label="开票内容"
              prop="invoiceContent"
              :columns="invoiceContentOptions"
              root-portal
            />
            <view class="form-block">
              <view class="block-label">发票类型</view>
              <wd-radio-group v-model="formData.invoiceType" cell shape="button">
                <wd-radio value="special">专用发票</wd-radio>
                <wd-radio value="normal">普通发票</wd-radio>
              </wd-radio-group>
            </view>
          </template>

          <template v-if="activeScene === 'repair'">
            <wd-input v-model="formData.repairDevice" label="报修对象" prop="repairDevice" clearable />
            <wd-input v-model="formData.repairOwner" label="负责人" prop="repairOwner" clearable />
            <wd-input v-model="formData.repairLevel" label="优先级" prop="repairLevel" clearable />
            <wd-picker
              v-model="formData.repairCategory"
              label="故障分类"
              prop="repairCategory"
              :columns="repairCategoryOptions"
              root-portal
            />
            <view class="form-block">
              <view class="block-label">处理方式</view>
              <wd-radio-group v-model="formData.repairMode" cell shape="button">
                <wd-radio value="remote">远程处理</wd-radio>
                <wd-radio value="onsite">现场处理</wd-radio>
                <wd-radio value="delay">延期排查</wd-radio>
              </wd-radio-group>
            </view>
            <wd-textarea v-model="formData.repairRemark" label="故障描述" maxlength="120" show-word-limit />
          </template>
        </wd-form>
      </view>

      <view class="detail-card">
        <view class="card-head">
          <view>
            <view class="card-title">可增删明细</view>
            <view class="card-desc">点击添加一行，适合费用、物料、参与人、子任务等数组字段。</view>
          </view>
          <wd-button size="small" type="primary" plain @click="addDetailRow">添加一行</wd-button>
        </view>

        <view class="detail-list">
          <view v-for="(row, index) in detailRows" :key="row.id" class="detail-row">
            <view class="row-index">{{ index + 1 }}</view>
            <view class="row-fields">
              <wd-input v-model="row.name" placeholder="明细名称" clearable />
              <view class="row-grid">
                <wd-input v-model="row.count" placeholder="数量" type="number" clearable />
                <wd-input v-model="row.amount" placeholder="单价" type="digit" clearable />
              </view>
            </view>
            <wd-button size="small" plain @click="removeDetailRow(row.id)">删除</wd-button>
          </view>
        </view>
      </view>

      <view class="summary-card">
        <view class="summary-title">实时摘要</view>
        <view v-if="activeScene === 'customer'" class="summary-line">客户 {{ formData.customerName }}，预算 ¥{{ formData.customerBudget }}，{{ formData.customerType }}</view>
        <view v-if="activeScene === 'activity'" class="summary-line">{{ formData.activityCity }} · {{ formData.activityName }} · {{ formData.activityPeople }} 人 · {{ formData.activityMode }}</view>
        <view v-if="activeScene === 'invoice'" class="summary-line">{{ formData.invoiceTitle }}，开票 ¥{{ formData.invoiceAmount }} · {{ formData.invoiceType }}</view>
        <view v-if="activeScene === 'repair'" class="summary-line">{{ formData.repairDevice }}，{{ formData.repairLevel }}优先级，{{ formData.repairOwner }}负责</view>
        <view class="summary-line">明细 {{ detailRows.length }} 行，合计 ¥{{ detailTotal }}</view>
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
.detail-card,
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
.detail-card,
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

.form-block {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f1f5f9;
}

.block-label {
  margin-bottom: 16rpx;
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 800;
}

.detail-list {
  display: grid;
  gap: 18rpx;
}

.detail-row {
  display: grid;
  grid-template-columns: 44rpx minmax(0, 1fr) 96rpx;
  align-items: center;
  gap: 14rpx;
  padding: 18rpx;
  border: 1rpx solid #eef2f7;
  border-radius: 12rpx;
  background: #f8fafc;
}

.row-index {
  display: grid;
  width: 44rpx;
  height: 44rpx;
  place-items: center;
  border-radius: 50%;
  background: var(--app-brand);
  color: #fff;
  font-size: 24rpx;
  font-weight: 900;
}

.row-fields {
  display: grid;
  gap: 12rpx;
  min-width: 0;
}

.row-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12rpx;
}
</style>
