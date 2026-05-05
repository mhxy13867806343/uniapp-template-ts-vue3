<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const formRef = ref()
const toast = useToast('basic-example-toast')
const message = useMessage('basic-example-message')

const levelPopupVisible = ref(false)
const quickPopupVisible = ref(false)
const submitted = ref(false)
const visitRange = ref<number[]>([Date.now(), Date.now() + 2 * 24 * 60 * 60 * 1000])
const visitTime = ref('09:30')
const channel = ref('all')
const owner = ref('sales')
const sort = ref('priority')

const form = reactive({
  name: '张三',
  phone: '13800138000',
  budget: '12000',
  keyword: '',
  level: '重点客户',
  enabled: true,
  count: 1
})

const levels = [
  { label: '普通客户', desc: '标准跟进，适合轻量合作。' },
  { label: '重点客户', desc: '每周跟进，适合持续转化。' },
  { label: '战略客户', desc: '专人跟进，适合高价值项目。' }
]

const tagOptions = ['多端模板', '小程序审核', 'App 上架', 'H5 活动', '客户成功', '运营看板']

const channelOptions = [
  { label: '全部渠道', value: 'all', tip: '微信、抖音、H5、App' },
  { label: '小程序', value: 'mini', tip: '微信/抖音/支付宝小程序' },
  { label: 'App 端', value: 'app', tip: 'App 与鸿蒙 App' }
]

const ownerOptions = [
  { label: '销售负责', value: 'sales', tip: '商机与报价' },
  { label: '运营负责', value: 'ops', tip: '活动与数据' },
  { label: '技术负责', value: 'tech', tip: '上架与问题定位' }
]

const sortOptions = [
  { label: '优先级最高', value: 'priority' },
  { label: '最近更新', value: 'latest' },
  { label: '预算最高', value: 'budget' }
]

const calendarShortcuts = [
  { text: '今天', days: 0 },
  { text: '近 3 天', days: 2 },
  { text: '近 7 天', days: 6 }
]

const filteredTags = computed(() => {
  const keyword = form.keyword.trim()
  if (!keyword) return tagOptions
  return tagOptions.filter((tag) => tag.includes(keyword))
})

const followText = computed(() => {
  if (!form.enabled) return '不创建提醒'
  return `每周 ${form.count} 次`
})

const riskLevel = computed(() => {
  const budget = Number(form.budget)
  if (!form.phone) return '待补手机号'
  if (Number.isNaN(budget) || budget <= 0) return '预算异常'
  if (budget >= 50000 || form.level === '战略客户') return '高价值'
  return '正常'
})

const visitSummary = computed(() => `${formatDate(visitRange.value[0])} 至 ${formatDate(visitRange.value[1])} ${visitTime.value}`)

const rules = computed(() => ({
  name: [
    { required: true, message: '请输入客户姓名' },
    {
      required: true,
      message: '姓名至少 2 个字符',
      validator: (value: string) => value.trim().length >= 2
    }
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    {
      required: true,
      message: '手机号格式不正确',
      pattern: /^1[3-9]\d{9}$/
    }
  ],
  budget: [
    { required: form.level !== '普通客户', message: '重点及以上客户需要填写预算' },
    {
      required: true,
      message: '预算必须大于 0',
      validator: (value: string) => Number(value) > 0
    },
    {
      required: true,
      message: '战略客户预算不能低于 50000',
      validator: (value: string) => form.level !== '战略客户' || Number(value) >= 50000
    }
  ]
}))

watch(
  () => form.level,
  () => {
    formRef.value?.validate?.('budget')
  }
)

function chooseLevel(level: string) {
  form.level = level
  levelPopupVisible.value = false
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function formatDate(value?: number) {
  if (!value) return '未选择'
  const date = new Date(value)
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function formatCalendarValue(value: number | number[]) {
  if (Array.isArray(value)) {
    return value.map((item) => formatDate(item)).join(' 至 ')
  }
  return formatDate(value)
}

function handleCalendarShortcut({ item }: { item: Record<string, any> }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return [today.getTime(), today.getTime() + Number(item.days || 0) * 24 * 60 * 60 * 1000]
}

function showToast(type: 'success' | 'warning' | 'error' | 'loading') {
  if (type === 'loading') {
    toast.loading({ msg: '同步排期中...', cover: true, position: 'middle' })
    setTimeout(() => {
      toast.close()
      toast.success('排期已同步')
    }, 900)
    return
  }

  const tips = {
    success: '客户资料已保存',
    warning: '请补充关键字段',
    error: '提交失败，请重试'
  }
  toast[type]({ msg: tips[type], position: 'middle' })
}

async function showAlertDialog() {
  await message.alert({
    title: '系统提醒',
    msg: '当前示例使用 Wot Design Uni 的 MessageBox，对 H5、小程序和 App 端保持统一交互。',
    confirmButtonText: '知道了'
  })
}

async function showPromptDialog() {
  try {
    const result = await message.prompt({
      title: '补充跟进备注',
      inputPlaceholder: '请输入 2-20 个字',
      inputValidate: (value) => String(value).trim().length >= 2,
      inputError: '备注至少 2 个字',
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    })
    form.keyword = String(result.value || '')
    toast.success('备注已写入搜索框')
  } catch {
    toast.info('已取消备注')
  }
}

async function submitForm() {
  const result = await formRef.value?.validate?.()
  if (!result?.valid) return

  try {
    await message.confirm({
      title: '确认提交客户资料？',
      msg: `${form.name} / ${form.level} / ${followText.value}`,
      confirmButtonText: '提交',
      cancelButtonText: '再看看'
    })
    submitted.value = true
    toast.success('客户资料已提交')
  } catch {
    toast.info('已取消提交')
  }
}

function resetForm() {
  form.name = ''
  form.phone = ''
  form.budget = ''
  form.keyword = ''
  form.level = '普通客户'
  form.enabled = true
  form.count = 1
  submitted.value = false
  formRef.value?.reset?.()
}
</script>

<template>
  <PageShell title="基础示例" description="客户资料维护，包含动态校验、输入联动、底部弹窗和确认弹框。">
    <view class="example-page">
      <wd-message-box selector="basic-example-message" />
      <wd-toast selector="basic-example-toast" />

      <view class="business-card">
        <view class="section-title">动态表单</view>
        <wd-form ref="formRef" :model="form" :rules="rules" error-type="message" border>
          <wd-input
            v-model="form.name"
            label="姓名"
            prop="name"
            placeholder="请输入客户姓名"
            clearable
            @blur="formRef?.validate?.('name')"
          />
          <wd-input
            v-model="form.phone"
            label="手机号"
            prop="phone"
            type="tel"
            maxlength="11"
            placeholder="请输入手机号"
            clearable
            @blur="formRef?.validate?.('phone')"
          />
          <wd-input
            v-model="form.budget"
            label="预算"
            prop="budget"
            type="digit"
            placeholder="请输入项目预算"
            clearable
            @blur="formRef?.validate?.('budget')"
          />
          <wd-cell title="客户等级" :value="form.level" is-link clickable @click="levelPopupVisible = true" />
        </wd-form>
      </view>

      <view class="business-card">
        <view class="section-title">输入联动</view>
        <wd-search v-model="form.keyword" placeholder="搜索标签或备注" />
        <view class="tag-grid">
          <wd-tag
            v-for="tag in filteredTags"
            :key="tag"
            plain
            type="primary"
            @click="form.keyword = tag"
          >
            {{ tag }}
          </wd-tag>
        </view>
        <view v-if="!filteredTags.length" class="empty-line">暂无匹配标签</view>
      </view>

      <view class="business-card overflow-card">
        <view class="section-title">筛选下拉</view>
        <wd-drop-menu>
          <wd-drop-menu-item v-model="channel" title="渠道" :options="channelOptions" root-portal />
          <wd-drop-menu-item v-model="owner" title="负责人" :options="ownerOptions" root-portal />
          <wd-drop-menu-item v-model="sort" title="排序" :options="sortOptions" root-portal />
        </wd-drop-menu>
        <view class="summary-line">当前筛选：{{ channel }} / {{ owner }} / {{ sort }}</view>
      </view>

      <view class="business-card">
        <view class="section-title">日历与时间</view>
        <wd-calendar
          v-model="visitRange"
          type="daterange"
          label="拜访日期"
          title="选择拜访日期"
          placeholder="请选择日期范围"
          clearable
          show-confirm
          :shortcuts="calendarShortcuts"
          :on-shortcuts-click="handleCalendarShortcut"
          :display-format="formatCalendarValue"
          root-portal
        />
        <wd-datetime-picker
          v-model="visitTime"
          type="time"
          label="拜访时间"
          title="选择拜访时间"
          placeholder="请选择时间"
          clearable
          root-portal
        />
        <view class="summary-line">预约摘要：{{ visitSummary }}</view>
      </view>

      <view class="business-card">
        <view class="section-title">提示与弹层</view>
        <view class="notice-stack">
          <wd-notice-bar prefix="warning" text="审批高峰期：小程序审核资料请在 18:00 前补齐。" />
          <wd-notice-bar
            type="info"
            prefix="notification"
            direction="vertical"
            :text="['H5 活动页待发布', '抖音小程序素材待确认', '鸿蒙 App 日志待复盘']"
          />
        </view>
        <view class="button-grid">
          <wd-button size="small" @click="showToast('success')">成功 Toast</wd-button>
          <wd-button size="small" type="warning" @click="showToast('warning')">警告 Toast</wd-button>
          <wd-button size="small" type="error" @click="showToast('error')">失败 Toast</wd-button>
          <wd-button size="small" plain @click="showToast('loading')">Loading</wd-button>
          <wd-button size="small" plain @click="quickPopupVisible = true">Popup</wd-button>
          <wd-button size="small" plain @click="showAlertDialog">Dialog</wd-button>
          <wd-button size="small" type="primary" @click="showPromptDialog">Prompt</wd-button>
        </view>
      </view>

      <view class="business-card">
        <view class="section-title">提醒设置</view>
        <view class="setting-row">
          <view>
            <view class="setting-title">启用客户提醒</view>
            <view class="setting-desc">开启后会在待办中提示跟进。</view>
          </view>
          <wd-switch v-model="form.enabled" />
        </view>
        <view class="setting-row">
          <view>
            <view class="setting-title">跟进频次</view>
            <view class="setting-desc">{{ followText }}</view>
          </view>
          <wd-input-number v-model="form.count" :min="1" :max="7" :disabled="!form.enabled" />
        </view>
      </view>

      <view class="business-card">
        <view class="section-title">实时预览</view>
        <view class="preview-grid">
          <view>
            <view class="preview-label">客户</view>
            <view class="preview-value">{{ form.name || '未填写' }}</view>
          </view>
          <view>
            <view class="preview-label">风险</view>
            <view class="preview-value">{{ riskLevel }}</view>
          </view>
          <view>
            <view class="preview-label">预算</view>
            <view class="preview-value">¥{{ form.budget || 0 }}</view>
          </view>
          <view>
            <view class="preview-label">提醒</view>
            <view class="preview-value">{{ followText }}</view>
          </view>
        </view>
        <view class="action-row">
          <wd-button plain @click="resetForm">重置</wd-button>
          <wd-button type="primary" @click="submitForm">提交并弹窗确认</wd-button>
        </view>
        <view v-if="submitted" class="success-line">已提交，可在业务列表中继续维护。</view>
      </view>

      <wd-popup v-model="levelPopupVisible" position="bottom" safe-area-inset-bottom root-portal custom-class="level-popup">
        <view class="popup-panel">
          <view class="popup-title">选择客户等级</view>
          <view
            v-for="item in levels"
            :key="item.label"
            :class="['level-option', { active: form.level === item.label }]"
            @click="chooseLevel(item.label)"
          >
            <view>
              <view class="level-label">{{ item.label }}</view>
              <view class="level-desc">{{ item.desc }}</view>
            </view>
            <wd-icon v-if="form.level === item.label" name="check" size="18px" custom-class="level-check" />
          </view>
        </view>
      </wd-popup>

      <wd-popup v-model="quickPopupVisible" position="center" closable root-portal custom-class="quick-popup">
        <view class="quick-panel">
          <view class="popup-title">Popup 弹层</view>
          <view class="quick-desc">适合承载轻量说明、活动确认、二次操作入口等内容。</view>
          <view class="quick-meta">
            <view>拜访时间</view>
            <view>{{ visitSummary }}</view>
          </view>
          <wd-button type="primary" block @click="quickPopupVisible = false">完成</wd-button>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.example-page {
  display: grid;
  gap: 24rpx;
}

.business-card {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  padding: 28rpx;
}

.overflow-card {
  overflow: visible;
  padding-inline: 0;
}

.overflow-card .section-title,
.overflow-card .summary-line {
  padding-inline: 28rpx;
}

.section-title,
.setting-title,
.preview-value,
.popup-title,
.level-label {
  color: var(--app-ink);
  font-weight: 700;
}

.section-title {
  margin-bottom: 20rpx;
  font-size: 32rpx;
}

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 20rpx;
}

.empty-line,
.setting-desc,
.preview-label,
.level-desc,
.success-line,
.summary-line,
.quick-desc {
  color: var(--app-muted);
  font-size: 26rpx;
}

.empty-line,
.setting-desc {
  margin-top: 8rpx;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 22rpx 0;
  border-top: 1rpx solid var(--app-line);
}

.setting-row:first-of-type {
  border-top: 0;
}

.summary-line {
  margin-top: 18rpx;
  line-height: 1.6;
}

.notice-stack {
  display: grid;
  gap: 16rpx;
}

.button-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 22rpx;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.preview-grid > view {
  border-radius: 10rpx;
  background: #f6f8fb;
  padding: 20rpx;
}

.preview-value {
  margin-top: 8rpx;
  font-size: 30rpx;
}

.action-row {
  display: flex;
  justify-content: flex-end;
  gap: 18rpx;
  margin-top: 24rpx;
}

.success-line {
  margin-top: 18rpx;
  color: #12b76a;
}

:deep(.level-popup) {
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
}

:deep(.quick-popup) {
  width: 620rpx;
  max-width: calc(100vw - 64rpx);
  border-radius: 16rpx;
  overflow: hidden;
}

.popup-panel {
  background: #fff;
  padding: 32rpx;
}

.quick-panel {
  background: #fff;
  padding: 36rpx;
}

.quick-desc {
  margin-bottom: 24rpx;
  line-height: 1.6;
}

.quick-meta {
  display: grid;
  grid-template-columns: 150rpx minmax(0, 1fr);
  gap: 16rpx;
  border-radius: 10rpx;
  background: #f6f8fb;
  color: var(--app-ink);
  font-size: 26rpx;
  line-height: 1.6;
  margin-bottom: 26rpx;
  padding: 20rpx;
}

.popup-title {
  margin-bottom: 20rpx;
  font-size: 34rpx;
}

.level-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 24rpx;
  margin-top: 18rpx;
}

.level-option.active {
  border-color: var(--app-brand);
  background: #eef6ff;
}

.level-desc {
  margin-top: 8rpx;
}

:deep(.level-check) {
  color: var(--app-brand);
}
</style>
