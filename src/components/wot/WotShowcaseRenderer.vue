<script setup lang="ts">
const props = withDefaults(defineProps<{
  path: string
  compact?: boolean
}>(), {
  compact: false
})

const isCompact = computed(() => props.compact)

const inputValue = ref('Wot UI 组件')
const textareaValue = ref('这里可以放多行说明、审批备注和补充信息。')
const searchValue = ref('客户搜索')
const searchLogs = ref(['最近搜索：客户中心', '最近搜索：表单校验'])
const textTone = ref<'summary' | 'warning' | 'highlight'>('summary')
const layoutMode = ref<'dashboard' | 'split'>('dashboard')
const numberValue = ref(2)
const switchValue = ref(true)
const checkedNames = ref<string[]>(['a'])
const radioValue = ref('a')
const rateValue = ref(4)
const sliderValue = ref(42)
const activeTab = ref(0)
const tabbarActive = ref(1)
const buttonClicks = ref(0)
const selectedIcon = ref('home')
const cellDetail = ref('查看详情')
const navbarClicks = ref(0)
const transitionVisible = ref(true)
const resizeMode = ref<'compact' | 'wide'>('compact')
const configTheme = ref<'blue' | 'green'>('blue')
const rootPortalVisible = ref(false)
const indexBarActive = ref('A')
const backtopProgress = ref(72)
const tourStep = ref(0)
const popupVisible = ref(false)
const popupMode = ref<'center' | 'bottom'>('center')
const overlayVisible = ref(false)
const languageVisible = ref(false)
const currentLanguage = ref('简体中文')
const channel = ref('all')
const owner = ref('sales')
const sort = ref('latest')
const activeCollapse = ref(['faq'])
const calendarValue = ref<string[]>(['2026-07-11', '2026-07-15'])
const visitTime = ref('14:30')
const calendarPanelSelected = ref(12)
const datetimeViewValue = reactive({
  date: '2026-07-11',
  hour: '14',
  minute: '30'
})
const segmentedValue = ref('overview')
const sidebarValue = ref('customer')
const paginationPage = ref(3)
const paginationRows = ref(['客户总览', '商机跟进', '审批提醒'])
const pickerLabel = ref('企业版')
const cascaderValue = ref(['华东', '上海', '浦东新区'])
const cascaderLevel = ref<'region' | 'city' | 'district'>('district')
const selectPickerValues = ref(['短信提醒', '邮件同步'])
const passwordDraft = ref('123')
const keyboardValue = ref('1380013')
const tooltipVisible = ref(false)
const floatingPanelExpanded = ref(false)
const progressValue = ref(68)
const circleValue = ref(68)
const swipeOpened = ref(false)
const sortActive = ref('默认排序')
const countdownRunning = ref(false)
const countdownValue = ref(86)
const countToIndex = ref(0)
const gridActive = ref('订单')
const stepsActive = ref(1)
const stickyPinned = ref(false)
const loadmoreItems = ref(['订单汇总', '客户标签', '经营日报'])
const swiperIndex = ref(0)
const curtainVisible = ref(true)
const fabExpanded = ref(false)
const loadingMode = ref<'spinner' | 'ring'>('spinner')
const avatarShape = ref<'circle' | 'square'>('circle')
const badgeCount = ref(8)
const tagActive = ref('标签')
const cardExpanded = ref(false)
const tableChannel = ref<'mini' | 'h5'>('mini')
const watermarkVisible = ref(true)
const emptyRecovered = ref(false)
const uploadFiles = ref([
  { name: '报价单-v3.pdf', size: '1.8MB', status: '已上传' },
  { name: '品牌素材包.zip', size: '12.4MB', status: '待复核' }
])
const signatureDraft = ref('林知夏')
const slideVerifyProgress = ref(36)
const feedbackLogs = ref(['最近调用：Toast 成功提示'])
const previewImageIndex = ref(0)
const previewImages = ['商品主图', '活动海报', '详情长图']
const videoPlaying = ref(false)
const cropperRatio = ref<'1:1' | '16:9' | '4:3'>('1:1')
const uploadQueueCount = ref(2)
const uploadHookStatus = ref('待处理')

const gridItems = [
  { title: '订单', icon: '📦' },
  { title: '客户', icon: '👤' },
  { title: '报表', icon: '📊' },
  { title: '设置', icon: '⚙️' }
]

const sidebarItems = [
  { label: '客户概览', value: 'customer' },
  { label: '订单中心', value: 'order' },
  { label: '经营分析', value: 'analytics' }
]

const pickerColumns = ['标准版', '专业版', '企业版']
const sortOptionsLite = ['默认排序', '最近更新', '优先级最高']
const countDownCells = ['01', '26', '48']
const countToNumbers = ['1,286', '86%', '¥28k']
const iconOptions = ['home', 'user', 'setting', 'success']
const keyboardKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←']
const tooltipMessages = {
  popover: '更多操作气泡面板',
  tooltip: '轻量文字提示信息'
}
const pickerViewColumns = [
  ['2026年', '2027年', '2028年'],
  ['07月', '08月', '09月'],
  ['11日', '12日', '13日']
]
const cascaderOptions = {
  region: ['华东', '华南', '华北'],
  city: ['上海', '杭州', '南京'],
  district: ['浦东新区', '徐汇区', '静安区']
}
const swiperBanners = ['活动 Banner', '新品专题', '经营看板']
const indexBarGroups = [
  { letter: 'A', items: ['阿里云服务', '爱采购活动'] },
  { letter: 'B', items: ['百度广告投放', '百货渠道'] },
  { letter: 'C', items: ['仓储系统', '城市营销'] }
]
const tourSteps = ['定位关键入口', '说明筛选能力', '提示底部操作']
let countdownTimer: ReturnType<typeof setInterval> | null = null

const inputFormRef = ref()
const inputDemoForm = reactive({
  name: '林知夏',
  phone: '13800138000',
  password: '',
  keyword: '客户搜索',
  readonlyName: '只读示例',
  disabledValue: '禁用示例'
})

const inputRules = computed(() => ({
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
  password: [
    { required: true, message: '请输入密码' },
    {
      required: true,
      message: '密码至少 6 位',
      validator: (value: string) => value.length >= 6
    }
  ]
}))

const filteredSearchLogs = computed(() => {
  const keyword = inputDemoForm.keyword.trim()
  if (!keyword) {
    return searchLogs.value
  }

  return searchLogs.value.filter(item => item.includes(keyword))
})

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
  { label: '最近更新', value: 'latest' },
  { label: '优先级最高', value: 'priority' },
  { label: '预算最高', value: 'budget' }
]

const languageActions = [
  { name: '简体中文' },
  { name: 'English' },
  { name: '日本語' }
]

const calendarShortcuts = [
  { text: '今天', days: 0 },
  { text: '近 3 天', days: 2 },
  { text: '近 7 天', days: 6 }
]

const stepItems = [
  { title: '提交申请', description: '用户发起资料提交' },
  { title: '负责人审批', description: '审批人确认预算范围' },
  { title: '配置发布', description: '通过后同步到多端' }
]

function showApiHint(title: string) {
  uni.showToast({
    icon: 'none',
    title
  })
}

function setTextTone(tone: 'summary' | 'warning' | 'highlight') {
  textTone.value = tone
}

function toggleLayoutMode() {
  layoutMode.value = layoutMode.value === 'dashboard' ? 'split' : 'dashboard'
}

function selectCellDetail(detail: string) {
  cellDetail.value = detail
}

function handleNavbarBack() {
  navbarClicks.value += 1
}

function toggleLoadingMode() {
  loadingMode.value = loadingMode.value === 'spinner' ? 'ring' : 'spinner'
}

function changeAvatarShape(shape: 'circle' | 'square') {
  avatarShape.value = shape
}

function changeBadge(delta: number) {
  badgeCount.value = Math.max(0, badgeCount.value + delta)
}

function selectTag(tag: string) {
  tagActive.value = tag
}

function toggleCardExpand() {
  cardExpanded.value = !cardExpanded.value
}

function switchTableChannel(channel: 'mini' | 'h5') {
  tableChannel.value = channel
}

function toggleWatermark() {
  watermarkVisible.value = !watermarkVisible.value
}

function recoverEmptyState() {
  emptyRecovered.value = true
}

function handleLanguageSelect(event: any) {
  currentLanguage.value = event?.item?.name || currentLanguage.value
  languageVisible.value = false
}

function openCenterPopup() {
  popupMode.value = 'center'
  popupVisible.value = true
}

function openBottomPopup() {
  popupMode.value = 'bottom'
  popupVisible.value = true
}

async function validateInputForm() {
  const result = await inputFormRef.value?.validate?.()
  if (!result?.valid) {
    showApiHint('请先修正输入项')
    return
  }

  showApiHint('输入校验通过')
}

function resetInputForm() {
  inputDemoForm.name = ''
  inputDemoForm.phone = ''
  inputDemoForm.password = ''
  inputDemoForm.keyword = ''
  inputFormRef.value?.reset?.()
}

function clearInputValidate() {
  inputFormRef.value?.clearValidate?.()
  showApiHint('已清空校验提示')
}

function fillInvalidInput() {
  inputDemoForm.name = '林'
  inputDemoForm.phone = '12345'
  inputDemoForm.password = '123'
  nextTick(() => {
    inputFormRef.value?.validate?.()
  })
}

function fillValidInput() {
  inputDemoForm.name = '林知夏'
  inputDemoForm.phone = '13800138000'
  inputDemoForm.password = 'abc123'
  inputFormRef.value?.clearValidate?.()
}

function applySearchTag(tag: string) {
  inputDemoForm.keyword = tag
}

function handlePrimaryButtonClick() {
  buttonClicks.value += 1
  showApiHint(`已触发 ${buttonClicks.value} 次`)
}

function selectIcon(name: string) {
  selectedIcon.value = name
}

function updatePagination(delta: number) {
  paginationPage.value = Math.min(8, Math.max(1, paginationPage.value + delta))
  paginationRows.value = [`第 ${paginationPage.value} 页客户总览`, `第 ${paginationPage.value} 页商机跟进`, `第 ${paginationPage.value} 页审批提醒`]
}

function toggleSelectPicker(item: string) {
  if (selectPickerValues.value.includes(item)) {
    selectPickerValues.value = selectPickerValues.value.filter(value => value !== item)
    return
  }

  selectPickerValues.value = [...selectPickerValues.value, item]
}

function updateCascader(level: 'region' | 'city' | 'district', value: string) {
  cascaderLevel.value = level
  if (level === 'region') {
    cascaderValue.value = [value, cascaderOptions.city[0], cascaderOptions.district[0]]
    return
  }

  if (level === 'city') {
    cascaderValue.value = [cascaderValue.value[0], value, cascaderOptions.district[0]]
    return
  }

  cascaderValue.value = [cascaderValue.value[0], cascaderValue.value[1], value]
}

function appendPasswordDigit(digit: string) {
  if (passwordDraft.value.length >= 6) return
  passwordDraft.value += digit
}

function inputKeyboardKey(key: string) {
  if (key === '←') {
    keyboardValue.value = keyboardValue.value.slice(0, -1)
    return
  }

  keyboardValue.value += key
}

function adjustProgress(delta: number) {
  progressValue.value = Math.min(100, Math.max(0, progressValue.value + delta))
}

function adjustCircle(delta: number) {
  circleValue.value = Math.min(100, Math.max(0, circleValue.value + delta))
}

function triggerSort(item: string) {
  sortActive.value = item
}

function startCountdown() {
  if (countdownRunning.value) return
  countdownRunning.value = true
  countdownTimer = setInterval(() => {
    if (countdownValue.value <= 0) {
      stopCountdown()
      return
    }
    countdownValue.value -= 1
  }, 1000)
}

function resetCountdown() {
  stopCountdown()
  countdownValue.value = 86
}

function stopCountdown() {
  countdownRunning.value = false
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

function cycleCountTo() {
  countToIndex.value = (countToIndex.value + 1) % countToNumbers.length
}

function toggleGrid(title: string) {
  gridActive.value = title
}

function updateSteps(delta: number) {
  stepsActive.value = Math.min(stepItems.length - 1, Math.max(0, stepsActive.value + delta))
}

function appendLoadmoreItem() {
  loadmoreItems.value = [...loadmoreItems.value, `新增内容 ${loadmoreItems.value.length + 1}`]
}

function selectBanner(index: number) {
  swiperIndex.value = index
}

function toggleFab() {
  fabExpanded.value = !fabExpanded.value
}

function toggleTransitionDemo() {
  transitionVisible.value = !transitionVisible.value
}

function toggleResizeMode() {
  resizeMode.value = resizeMode.value === 'compact' ? 'wide' : 'compact'
}

function toggleConfigTheme() {
  configTheme.value = configTheme.value === 'blue' ? 'green' : 'blue'
}

function activateIndex(letter: string) {
  indexBarActive.value = letter
}

function scrollBacktop(delta: number) {
  backtopProgress.value = Math.min(100, Math.max(0, backtopProgress.value + delta))
}

function nextTourStep() {
  tourStep.value = (tourStep.value + 1) % tourSteps.length
}

function pickCalendarPanelDay(day: number) {
  calendarPanelSelected.value = day
}

function cycleDatetimeView(part: 'date' | 'hour' | 'minute') {
  if (part === 'date') {
    datetimeViewValue.date = datetimeViewValue.date === '2026-07-11' ? '2026-07-12' : '2026-07-11'
    return
  }

  if (part === 'hour') {
    datetimeViewValue.hour = datetimeViewValue.hour === '14' ? '15' : '14'
    return
  }

  datetimeViewValue.minute = datetimeViewValue.minute === '30' ? '45' : '30'
}

function appendUploadFile() {
  const nextIndex = uploadFiles.value.length + 1
  uploadFiles.value = [
    ...uploadFiles.value,
    { name: `新增附件-${nextIndex}.png`, size: `${nextIndex}.2MB`, status: '上传中' }
  ]
}

function removeUploadFile(name: string) {
  uploadFiles.value = uploadFiles.value.filter(item => item.name !== name)
}

function rewriteSignature() {
  signatureDraft.value = signatureDraft.value === '林知夏' ? 'HOOKSVUE' : '林知夏'
}

function advanceSlideVerify() {
  slideVerifyProgress.value = Math.min(100, slideVerifyProgress.value + 16)
}

function resetSlideVerify() {
  slideVerifyProgress.value = 0
}

async function openDialogDemo() {
  const result = await uni.showModal({
    title: '确认操作',
    content: '这里演示 Dialog 常见的二次确认场景。',
    confirmText: '确认',
    cancelText: '取消'
  })

  feedbackLogs.value = [
    `最近调用：Dialog ${result.confirm ? '确认' : '取消'}`,
    ...feedbackLogs.value.slice(0, 2)
  ]
}

function triggerFeedback(type: string) {
  feedbackLogs.value = [`最近调用：${type}`, ...feedbackLogs.value.slice(0, 2)]
  showApiHint(`${type} 示例调用`)
}

function nextPreviewImage() {
  previewImageIndex.value = (previewImageIndex.value + 1) % previewImages.length
}

function toggleVideoPlaying() {
  videoPlaying.value = !videoPlaying.value
}

function switchCropperRatio(ratio: '1:1' | '16:9' | '4:3') {
  cropperRatio.value = ratio
}

function runUseUploadDemo() {
  uploadHookStatus.value = uploadHookStatus.value === '待处理' ? '上传中' : '已完成'
  uploadQueueCount.value = uploadHookStatus.value === '已完成' ? 0 : 2
}

onUnmounted(() => {
  stopCountdown()
})
</script>

<template>
  <view class="wot-demo">
    <view v-if="path === 'button'" class="demo-block">
      <view class="button-showcase">
        <view class="button-showcase__section">
          <view class="input-showcase__title">组件类型</view>
          <view class="demo-row">
            <wd-button type="primary" @click="handlePrimaryButtonClick">主要按钮</wd-button>
            <wd-button type="success" @click="showApiHint('成功操作')">成功按钮</wd-button>
            <wd-button type="info" @click="showApiHint('信息提示')">信息按钮</wd-button>
            <wd-button type="warning" @click="showApiHint('警告操作')">警告按钮</wd-button>
            <wd-button type="danger" @click="showApiHint('危险操作')">危险按钮</wd-button>
          </view>
        </view>

        <view class="button-showcase__section">
          <view class="input-showcase__title">组件状态</view>
          <view class="demo-row">
            <wd-button disabled>禁用按钮</wd-button>
            <wd-button loading>加载中</wd-button>
            <wd-button plain @click="buttonClicks = 0">重置计数</wd-button>
          </view>
          <view class="demo-note">当前触发次数：{{ buttonClicks }}</view>
        </view>

        <view class="button-showcase__section">
          <view class="input-showcase__title">组件变体</view>
          <view class="demo-row">
            <wd-button>默认按钮</wd-button>
            <wd-button variant="plain">镂空按钮</wd-button>
            <wd-button variant="dashed">虚线按钮</wd-button>
            <wd-button variant="soft">柔和按钮</wd-button>
            <wd-button variant="text">文字按钮</wd-button>
          </view>
        </view>

        <view class="button-showcase__section">
          <view class="input-showcase__title">组件样式</view>
          <view class="demo-row">
            <wd-button size="mini">迷你按钮</wd-button>
            <wd-button size="small">小号按钮</wd-button>
            <wd-button size="medium">中号按钮</wd-button>
            <wd-button size="large">大号按钮</wd-button>
          </view>
          <view class="demo-row">
            <wd-button variant="plain" hairline>细边框</wd-button>
            <wd-button variant="plain" round>圆角按钮</wd-button>
          </view>
        </view>

        <view class="button-showcase__section">
          <view class="input-showcase__title">特殊样式</view>
          <view class="demo-row">
            <wd-button custom-class="button-shadow">主要按钮</wd-button>
            <wd-button type="success" custom-class="button-shadow">成功按钮</wd-button>
            <wd-button type="info" custom-class="button-shadow">信息按钮</wd-button>
            <wd-button type="warning" custom-class="button-shadow">警告按钮</wd-button>
            <wd-button type="danger" custom-class="button-shadow">危险按钮</wd-button>
          </view>
        </view>

        <view class="button-showcase__section">
          <view class="input-showcase__title">内容形态</view>
          <view class="demo-row">
            <wd-button icon="edit-outline" />
            <wd-button icon="download">下载</wd-button>
            <wd-button icon="setting">设置</wd-button>
          </view>
        </view>

        <view class="button-showcase__section">
          <view class="input-showcase__title">布局能力</view>
          <view class="button-showcase__block">
            <wd-button block @click="showApiHint('块状按钮点击')">块状按钮</wd-button>
          </view>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'icon'" class="demo-row">
      <view
        v-for="name in iconOptions"
        :key="name"
        :class="['icon-chip', { 'icon-chip--active': selectedIcon === name }]"
        @click="selectIcon(name)"
      >
        <wd-icon :name="name" size="20px" />
      </view>
      <view class="demo-note">当前选中图标：{{ selectedIcon }}</view>
    </view>

    <view v-else-if="path === 'text'" class="demo-block">
      <view class="text-stack">
        <view class="demo-row">
          <wd-tag :type="textTone === 'summary' ? 'primary' : 'default'" @click="setTextTone('summary')">摘要</wd-tag>
          <wd-tag :type="textTone === 'warning' ? 'warning' : 'default'" @click="setTextTone('warning')">提示</wd-tag>
          <wd-tag :type="textTone === 'highlight' ? 'success' : 'default'" @click="setTextTone('highlight')">高亮</wd-tag>
        </view>
        <text class="text-stack__title">
          {{ textTone === 'summary' ? '重点标题' : textTone === 'warning' ? '风险提醒标题' : '高亮信息标题' }}
        </text>
        <text class="text-stack__sub">
          {{ textTone === 'summary' ? '适合承载信息层级、说明文本和摘要内容。' : textTone === 'warning' ? '适合承载错误态、风险态和二次确认前提示。' : '适合承载成功反馈、活动亮点和重点说明。' }}
        </text>
        <text class="text-stack__note">这里演示了 Wot 文本类组件常见的页面结构效果。</text>
      </view>
    </view>

    <view v-else-if="path === 'layout'" class="demo-block">
      <view class="demo-row">
        <wd-button size="small" plain @click="toggleLayoutMode">切换布局</wd-button>
      </view>
      <view :class="['layout-grid', { 'layout-grid--split': layoutMode === 'split' }]">
        <view class="layout-grid__item layout-grid__item--wide">{{ layoutMode === 'dashboard' ? '主内容区' : '左侧信息区' }}</view>
        <view class="layout-grid__item">{{ layoutMode === 'dashboard' ? '侧信息' : '右上操作' }}</view>
        <view class="layout-grid__item">{{ layoutMode === 'dashboard' ? '操作区' : '右下概览' }}</view>
      </view>
    </view>

    <view v-else-if="path === 'cell'" class="demo-block">
      <wd-cell-group border>
        <wd-cell title="订单信息" value="查看详情" is-link clickable @click="selectCellDetail('订单信息')" />
        <wd-cell title="联系人" label="辅助说明" value="林知夏" clickable @click="selectCellDetail('联系人')" />
      </wd-cell-group>
      <view class="demo-note">当前选中条目：{{ cellDetail }}</view>
    </view>

    <view v-else-if="path === 'tabbar'" class="demo-block">
      <wd-tabbar v-model="tabbarActive">
        <wd-tabbar-item :name="0" title="首页" icon="home" />
        <wd-tabbar-item :name="1" title="组件" icon="app" />
        <wd-tabbar-item :name="2" title="我的" icon="user" />
      </wd-tabbar>
      <view class="demo-note">当前底部导航：{{ ['首页', '组件', '我的'][tabbarActive] }}</view>
    </view>

    <view v-else-if="path === 'navbar'" class="demo-block">
      <view class="nav-bar-demo">
        <wd-icon name="arrow-left" size="18px" @click="handleNavbarBack" />
        <text class="nav-bar-demo__title">订单详情</text>
        <wd-icon name="more" size="18px" @click="showApiHint('更多操作')" />
      </view>
      <view class="demo-note">返回点击次数：{{ navbarClicks }}</view>
    </view>

    <view v-else-if="path === 'tabs'" class="demo-block">
      <wd-tabs v-model="activeTab">
        <wd-tab title="全部">全部内容</wd-tab>
        <wd-tab title="待处理">待处理内容</wd-tab>
        <wd-tab title="已完成">已完成内容</wd-tab>
      </wd-tabs>
      <view class="demo-note">当前标签：{{ ['全部', '待处理', '已完成'][activeTab] }}</view>
    </view>

    <view v-else-if="path === 'segmented'" class="demo-block">
      <view class="segmented-demo">
        <view
          v-for="item in [
            { label: '总览', value: 'overview' },
            { label: '明细', value: 'detail' },
            { label: '趋势', value: 'trend' }
          ]"
          :key="item.value"
          :class="['segmented-demo__item', { 'segmented-demo__item--active': segmentedValue === item.value }]"
          @click="segmentedValue = item.value"
        >
          {{ item.label }}
        </view>
      </view>
      <view class="demo-note">当前视图：{{ segmentedValue }}</view>
    </view>

    <view v-else-if="path === 'sidebar'" class="demo-block">
      <view class="sidebar-demo">
        <view class="sidebar-demo__nav">
          <view
            v-for="item in sidebarItems"
            :key="item.value"
            :class="['sidebar-demo__nav-item', { 'sidebar-demo__nav-item--active': sidebarValue === item.value }]"
            @click="sidebarValue = item.value"
          >
            {{ item.label }}
          </view>
        </view>
        <view class="sidebar-demo__panel">
          <view class="demo-fallback__title">{{ sidebarItems.find(item => item.value === sidebarValue)?.label }}</view>
          <view class="demo-note">适合左侧分类导航、榜单导航和配置分区切换。</view>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'pagination'" class="demo-block">
      <view class="pager-demo">
        <wd-button size="small" plain @click="updatePagination(-1)">上一页</wd-button>
        <view class="pager-demo__current">第 {{ paginationPage }} / 8 页</view>
        <wd-button size="small" type="primary" @click="updatePagination(1)">下一页</wd-button>
      </view>
      <view class="pager-list">
        <view v-for="item in paginationRows" :key="item" class="pager-list__item">{{ item }}</view>
      </view>
    </view>

    <view v-else-if="path === 'index-bar'" class="demo-block">
      <view class="index-bar-demo">
        <view class="index-bar-demo__list">
          <view
            v-for="group in indexBarGroups"
            :key="group.letter"
            :class="['index-bar-demo__section', { 'index-bar-demo__section--active': indexBarActive === group.letter }]"
          >
            <view class="index-bar-demo__anchor">{{ group.letter }}</view>
            <view
              v-for="item in group.items"
              :key="item"
              class="index-bar-demo__cell"
            >
              {{ item }}
            </view>
          </view>
        </view>
        <view class="index-bar-demo__sidebar">
          <text
            v-for="group in indexBarGroups"
            :key="group.letter"
            :class="{ 'index-bar-demo__sidebar-item--active': indexBarActive === group.letter }"
            @click="activateIndex(group.letter)"
          >
            {{ group.letter }}
          </text>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'backtop'" class="demo-block">
      <view class="backtop-demo">
        <view class="backtop-demo__track">
          <view class="backtop-demo__fill" :style="{ height: `${backtopProgress}%` }" />
        </view>
        <view class="backtop-demo__info">
          <view class="demo-fallback__title">长列表页面</view>
          <view class="demo-note">当前滚动深度：{{ backtopProgress }}%</view>
          <view class="input-actions">
            <wd-button size="small" plain @click="scrollBacktop(-20)">向上滚动</wd-button>
            <wd-button size="small" type="primary" @click="scrollBacktop(20)">向下滚动</wd-button>
            <wd-button size="small" @click="backtopProgress = 0">回到顶部</wd-button>
          </view>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'tour'" class="demo-block">
      <view class="tour-stack">
        <view class="tour-step">
          <view class="tour-step__index">{{ tourStep + 1 }}</view>
          <view>
            <view class="tour-step__title">{{ tourSteps[tourStep] }}</view>
            <view class="demo-note">适合新手引导、版本上新说明和关键路径提示。</view>
          </view>
        </view>
        <wd-button size="small" plain @click="nextTourStep">下一步</wd-button>
      </view>
    </view>

    <view v-else-if="path === 'form'" class="demo-block">
      <view class="input-showcase">
        <view class="input-showcase__title">表单联动示例</view>
        <wd-form ref="inputFormRef" :model="inputDemoForm" :rules="inputRules" error-type="message" border>
          <wd-input
            v-model="inputDemoForm.name"
            label="客户姓名"
            prop="name"
            placeholder="请输入客户姓名"
            clearable
            @blur="inputFormRef?.validate?.('name')"
          />
          <wd-input
            v-model="inputDemoForm.phone"
            label="手机号"
            prop="phone"
            type="tel"
            maxlength="11"
            placeholder="请输入手机号"
            clearable
            @blur="inputFormRef?.validate?.('phone')"
          />
          <wd-input
            v-model="inputDemoForm.password"
            label="登录密码"
            prop="password"
            type="password"
            clearable
            placeholder="请输入至少 6 位密码"
            @blur="inputFormRef?.validate?.('password')"
          />
          <wd-textarea
            v-model="textareaValue"
            label="补充说明"
            maxlength="80"
            show-word-limit
            placeholder="可以补充审批备注、客户背景和特殊要求"
          />
        </wd-form>
        <view class="input-actions">
          <wd-button size="small" type="primary" @click="validateInputForm">校验表单</wd-button>
          <wd-button size="small" plain @click="clearInputValidate">清空校验</wd-button>
          <wd-button size="small" plain @click="resetInputForm">重置表单</wd-button>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'input'" class="demo-block">
      <view class="input-showcase">
        <view class="input-showcase__title">输入框常用能力</view>
        <wd-form ref="inputFormRef" :model="inputDemoForm" :rules="inputRules" error-type="message" border>
          <wd-input
            v-model="inputDemoForm.name"
            label="客户姓名"
            prop="name"
            placeholder="支持清空、校验和双向绑定"
            clearable
            @blur="inputFormRef?.validate?.('name')"
          />
          <wd-input
            v-model="inputDemoForm.phone"
            label="手机号"
            prop="phone"
            type="tel"
            maxlength="11"
            placeholder="支持格式校验"
            clearable
            @blur="inputFormRef?.validate?.('phone')"
          />
          <wd-input
            v-model="inputDemoForm.password"
            label="密码"
            prop="password"
            type="password"
            placeholder="支持密码输入"
            clearable
            @blur="inputFormRef?.validate?.('password')"
          />
          <wd-input
            v-model="inputDemoForm.readonlyName"
            label="只读态"
            readonly
            placeholder="只读输入框"
          />
          <wd-input
            v-model="inputDemoForm.disabledValue"
            label="禁用态"
            disabled
            placeholder="禁用输入框"
          />
        </wd-form>
        <view class="input-actions">
          <wd-button size="small" type="primary" @click="validateInputForm">校验</wd-button>
          <wd-button size="small" plain @click="fillInvalidInput">填充错误示例</wd-button>
          <wd-button size="small" plain @click="fillValidInput">恢复正确示例</wd-button>
          <wd-button size="small" plain @click="clearInputValidate">清空提示</wd-button>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'textarea'" class="demo-block">
      <view class="input-showcase">
        <view class="input-showcase__title">文本域常用态</view>
        <wd-textarea
          v-model="textareaValue"
          label="备注信息"
          maxlength="80"
          show-word-limit
          placeholder="支持字数统计、长文本录入和双向绑定"
        />
        <wd-textarea
          model-value="这里是只读说明内容，用于展示不可编辑的备注。"
          label="只读内容"
          readonly
        />
        <wd-textarea
          model-value="禁用态内容"
          label="禁用内容"
          disabled
        />
      </view>
    </view>

    <view v-else-if="path === 'password-input'" class="demo-block">
      <view class="password-demo">
        <view class="password-demo__label">验证码输入</view>
        <view class="password-demo__cells">
          <view v-for="item in 6" :key="item" class="password-demo__cell">
            <view v-if="item <= passwordDraft.length" class="password-demo__dot" />
          </view>
        </view>
        <view class="keyboard-demo">
          <view v-for="item in ['1','2','3','4','5','6','7','8','9']" :key="item" class="keyboard-demo__key" @click="appendPasswordDigit(item)">
            {{ item }}
          </view>
          <view class="keyboard-demo__key" @click="passwordDraft = passwordDraft.slice(0, -1)">删除</view>
          <view class="keyboard-demo__key" @click="passwordDraft = ''">清空</view>
          <view class="keyboard-demo__key" @click="passwordDraft = '246810'.slice(0, 6)">填充</view>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'keyboard'" class="demo-block">
      <view class="demo-note">当前输入：{{ keyboardValue || '空' }}</view>
      <view class="keyboard-demo">
        <view v-for="item in keyboardKeys" :key="item" class="keyboard-demo__key" @click="inputKeyboardKey(item)">
          {{ item }}
        </view>
      </view>
    </view>

    <view v-else-if="path === 'search'" class="demo-block">
      <view class="input-showcase">
        <view class="input-showcase__title">搜索框常用态</view>
        <wd-search v-model="inputDemoForm.keyword" placeholder="搜索组件、页面或客户" />
        <view class="search-tags">
          <wd-tag
            v-for="tag in ['客户中心', '表单校验', 'Wot 组件', '营销页']"
            :key="tag"
            plain
            type="primary"
            @click="applySearchTag(tag)"
          >
            {{ tag }}
          </wd-tag>
        </view>
        <view class="search-log-list">
          <view
            v-for="item in filteredSearchLogs"
            :key="item"
            class="search-log-item"
          >
            {{ item }}
          </view>
          <view v-if="!filteredSearchLogs.length" class="search-empty">暂无匹配记录</view>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'input-number'" class="demo-row">
      <wd-input-number v-model="numberValue" />
    </view>

    <view v-else-if="path === 'checkbox'" class="demo-block">
      <wd-checkbox-group v-model="checkedNames">
        <wd-checkbox model-value="a">短信提醒</wd-checkbox>
        <wd-checkbox model-value="b">邮件同步</wd-checkbox>
      </wd-checkbox-group>
      <view class="demo-note">当前多选：{{ checkedNames.join('、') || '未选择' }}</view>
    </view>

    <view v-else-if="path === 'radio'" class="demo-block">
      <wd-radio-group v-model="radioValue">
        <wd-radio value="a">标准版</wd-radio>
        <wd-radio value="b">专业版</wd-radio>
      </wd-radio-group>
      <view class="demo-note">当前方案：{{ radioValue === 'a' ? '标准版' : '专业版' }}</view>
    </view>

    <view v-else-if="path === 'switch'" class="demo-row">
      <wd-switch v-model="switchValue" />
      <view class="demo-note">当前状态：{{ switchValue ? '已开启' : '已关闭' }}</view>
    </view>

    <view v-else-if="path === 'rate'" class="demo-row">
      <wd-rate v-model="rateValue" />
      <view class="demo-note">当前评分：{{ rateValue }} 星</view>
    </view>

    <view v-else-if="path === 'slider'" class="demo-block">
      <wd-slider v-model="sliderValue" />
      <view class="demo-note">当前数值：{{ sliderValue }}</view>
    </view>

    <view v-else-if="path === 'calendar'" class="demo-block">
      <wd-calendar
        v-model="calendarValue"
        type="daterange"
        label="拜访日期"
        title="选择拜访日期"
        placeholder="请选择日期范围"
        clearable
        show-confirm
        :shortcuts="calendarShortcuts"
        root-portal
      />
    </view>

    <view v-else-if="path === 'datetime-picker'" class="demo-block">
      <wd-datetime-picker
        v-model="visitTime"
        type="time"
        label="预约时间"
        title="选择时间"
        placeholder="请选择时间"
        clearable
        root-portal
      />
    </view>

    <view v-else-if="path === 'picker'" class="demo-block">
      <view class="picker-demo">
        <wd-cell title="套餐版本" :value="pickerLabel" is-link clickable />
        <view class="picker-demo__options">
          <wd-tag
            v-for="item in pickerColumns"
            :key="item"
            :type="pickerLabel === item ? 'primary' : 'default'"
            @click="pickerLabel = item"
          >
            {{ item }}
          </wd-tag>
        </view>
        <view class="demo-note">当前选择：{{ pickerLabel }}</view>
      </view>
    </view>

    <view v-else-if="path === 'picker-view'" class="demo-block">
      <view class="wheel-demo">
        <view v-for="column in pickerViewColumns" :key="column[0]" class="wheel-demo__column">
          <view
            v-for="item in column"
            :key="item"
            :class="['wheel-demo__item', { 'wheel-demo__item--active': item === '2026年' || item === '07月' || item === '11日' }]"
          >
            {{ item }}
          </view>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'select-picker'" class="demo-block">
      <view class="demo-row">
        <wd-tag
          v-for="item in ['短信提醒', '邮件同步', '系统通知', '审批结果']"
          :key="item"
          :type="selectPickerValues.includes(item) ? 'primary' : 'default'"
          :plain="!selectPickerValues.includes(item)"
          @click="toggleSelectPicker(item)"
        >
          {{ item }}
        </wd-tag>
      </view>
      <view class="demo-note">当前选择：{{ selectPickerValues.join('、') || '未选择' }}</view>
    </view>

    <view v-else-if="path === 'cascader'" class="demo-block">
      <view class="demo-row">
        <wd-tag
          v-for="item in cascaderValue"
          :key="item"
          type="primary"
          plain
        >
          {{ item }}
        </wd-tag>
      </view>
      <view class="cascader-demo">
        <view class="cascader-demo__col">
          <view
            v-for="item in cascaderOptions.region"
            :key="item"
            :class="['cascader-demo__item', { 'cascader-demo__item--active': cascaderValue[0] === item }]"
            @click="updateCascader('region', item)"
          >{{ item }}</view>
        </view>
        <view class="cascader-demo__col">
          <view
            v-for="item in cascaderOptions.city"
            :key="item"
            :class="['cascader-demo__item', { 'cascader-demo__item--active': cascaderValue[1] === item }]"
            @click="updateCascader('city', item)"
          >{{ item }}</view>
        </view>
        <view class="cascader-demo__col">
          <view
            v-for="item in cascaderOptions.district"
            :key="item"
            :class="['cascader-demo__item', { 'cascader-demo__item--active': cascaderValue[2] === item }]"
            @click="updateCascader('district', item)"
          >{{ item }}</view>
        </view>
      </view>
      <view class="demo-note">当前路径：{{ cascaderValue.join(' / ') }}</view>
    </view>

    <view v-else-if="path === 'calendar-view'" class="demo-block">
      <view class="calendar-grid">
        <view v-for="item in ['一','二','三','四','五','六','日']" :key="item" class="calendar-grid__week">{{ item }}</view>
        <view
          v-for="item in 14"
          :key="item"
          :class="['calendar-grid__day', { 'calendar-grid__day--active': item === calendarPanelSelected }]"
          @click="pickCalendarPanelDay(item)"
        >
          {{ item }}
        </view>
      </view>
      <view class="demo-note">当前选中日期：7 月 {{ calendarPanelSelected }} 日</view>
    </view>

    <view v-else-if="path === 'datetime-picker-view'" class="demo-block">
      <view class="wheel-demo">
        <view class="wheel-demo__column">
          <view class="wheel-demo__item wheel-demo__item--active" @click="cycleDatetimeView('date')">{{ datetimeViewValue.date }}</view>
        </view>
        <view class="wheel-demo__column">
          <view class="wheel-demo__item wheel-demo__item--active" @click="cycleDatetimeView('hour')">{{ datetimeViewValue.hour }}</view>
        </view>
        <view class="wheel-demo__column">
          <view class="wheel-demo__item wheel-demo__item--active" @click="cycleDatetimeView('minute')">{{ datetimeViewValue.minute }}</view>
        </view>
      </view>
      <view class="demo-note">点击滚轮项切换时间值</view>
    </view>

    <view v-else-if="path === 'upload'" class="demo-block">
      <view class="upload-demo">
        <view
          v-for="item in uploadFiles"
          :key="item.name"
          class="upload-demo__file"
        >
          <view class="upload-demo__icon">{{ item.name.split('.').pop() }}</view>
          <view class="upload-demo__meta">
            <view class="upload-demo__name">{{ item.name }}</view>
            <view class="demo-note">{{ item.size }} · {{ item.status }}</view>
          </view>
          <wd-button size="small" plain @click="removeUploadFile(item.name)">移除</wd-button>
        </view>
        <wd-button size="small" plain @click="appendUploadFile">添加附件</wd-button>
      </view>
    </view>

    <view v-else-if="path === 'signature'" class="demo-block">
      <view class="signature-demo">
        <view class="signature-demo__line" />
        <view class="signature-demo__mark">{{ signatureDraft }}</view>
      </view>
      <view class="input-actions">
        <wd-button size="small" plain @click="signatureDraft = ''">清空签名</wd-button>
        <wd-button size="small" type="primary" @click="rewriteSignature">重写签名</wd-button>
      </view>
    </view>

    <view v-else-if="path === 'slide-verify'" class="demo-block">
      <view class="verify-demo">
        <view class="verify-demo__track">
          <view class="verify-demo__progress" :style="{ width: `${slideVerifyProgress}%` }" />
          <view class="verify-demo__thumb" :style="{ left: `calc(${slideVerifyProgress}% - 28rpx)` }">⇢</view>
        </view>
        <view class="demo-note">{{ slideVerifyProgress >= 100 ? '验证通过' : '点击推进滑块完成验证' }}</view>
        <view class="input-actions">
          <wd-button size="small" type="primary" @click="advanceSlideVerify">推进</wd-button>
          <wd-button size="small" plain @click="resetSlideVerify">重置</wd-button>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'popup'" class="demo-block">
      <view class="demo-row">
        <wd-button size="small" type="primary" @click="openCenterPopup">打开居中弹层</wd-button>
        <wd-button size="small" plain @click="openBottomPopup">打开底部弹层</wd-button>
      </view>
      <wd-popup
        v-model="popupVisible"
        :position="popupMode"
        closable
        root-portal
        safe-area-inset-bottom
      >
        <view class="popup-body">
          <view class="popup-title">Wot Popup</view>
          <view class="popup-desc">适合承载筛选面板、说明内容和二次确认信息。</view>
          <wd-button type="primary" block @click="popupVisible = false">我知道了</wd-button>
        </view>
      </wd-popup>
    </view>

    <view v-else-if="path === 'dialog'" class="demo-block">
      <view class="demo-row">
        <wd-button size="small" type="primary" @click="openDialogDemo">打开确认弹框</wd-button>
      </view>
      <view class="feedback-panel">
        <view v-for="item in feedbackLogs" :key="item" class="feedback-panel__item">{{ item }}</view>
      </view>
    </view>

    <view v-else-if="path === 'overlay'" class="demo-block">
      <view class="demo-row">
        <wd-button size="small" type="primary" @click="overlayVisible = !overlayVisible">切换遮罩</wd-button>
      </view>
      <view class="overlay-demo">
        <view class="overlay-demo__content">被遮罩的页面内容</view>
        <view v-if="overlayVisible" class="overlay-demo__mask" @click="overlayVisible = false">Overlay</view>
      </view>
    </view>

    <view v-else-if="path === 'action-sheet'" class="demo-block">
      <wd-button size="small" type="primary" @click="languageVisible = true">打开动作面板</wd-button>
      <wd-action-sheet
        v-model="languageVisible"
        :actions="languageActions"
        @select="handleLanguageSelect"
      />
      <view class="demo-note">当前语言：{{ currentLanguage }}</view>
    </view>

    <view v-else-if="path === 'drop-menu'" class="demo-block">
      <wd-drop-menu>
        <wd-drop-menu-item v-model="channel" title="渠道" :options="channelOptions" root-portal />
        <wd-drop-menu-item v-model="owner" title="负责人" :options="ownerOptions" root-portal />
        <wd-drop-menu-item v-model="sort" title="排序" :options="sortOptions" root-portal />
      </wd-drop-menu>
      <view class="demo-note">当前筛选：{{ channel }} / {{ owner }} / {{ sort }}</view>
    </view>

    <view v-else-if="path === 'popover' || path === 'tooltip'" class="demo-block">
      <view class="popover-demo">
        <wd-button size="small" type="primary" @click="tooltipVisible = !tooltipVisible">触发目标</wd-button>
        <view v-if="tooltipVisible" class="popover-demo__bubble">{{ tooltipMessages[path as 'popover' | 'tooltip'] }}</view>
      </view>
    </view>

    <view v-else-if="path === 'floating-panel'" class="demo-block">
      <view :class="['floating-panel-demo', { 'floating-panel-demo--expanded': floatingPanelExpanded }]">
        <view class="floating-panel-demo__handle" />
        <view class="demo-fallback__title">浮动面板</view>
        <view class="demo-note">适合承载底部可拖拽内容区、筛选面板和弹出详情。</view>
        <wd-button size="small" plain @click="floatingPanelExpanded = !floatingPanelExpanded">
          {{ floatingPanelExpanded ? '收起面板' : '展开面板' }}
        </wd-button>
      </view>
    </view>

    <view v-else-if="path === 'loading'" class="demo-row">
      <wd-loading v-if="loadingMode === 'spinner'" />
      <wd-loading v-else type="ring" />
      <wd-button size="small" plain @click="toggleLoadingMode">切换类型</wd-button>
    </view>

    <view v-else-if="path === 'progress'" class="demo-block">
      <wd-progress :percentage="progressValue" />
      <view class="input-actions">
        <wd-button size="small" plain @click="adjustProgress(-10)">-10</wd-button>
        <wd-button size="small" type="primary" @click="adjustProgress(10)">+10</wd-button>
      </view>
    </view>

    <view v-else-if="path === 'circle'" class="demo-block">
      <view class="circle-demo">
        <view class="circle-demo__ring">
          <view class="circle-demo__value">{{ circleValue }}%</view>
        </view>
      </view>
      <view class="input-actions">
        <wd-button size="small" plain @click="adjustCircle(-5)">-5</wd-button>
        <wd-button size="small" type="primary" @click="adjustCircle(5)">+5</wd-button>
      </view>
    </view>

    <view v-else-if="path === 'toast' || path === 'notify' || path === 'use-toast' || path === 'use-message' || path === 'use-notify'" class="demo-block">
      <view class="demo-row">
        <wd-button size="small" type="primary" @click="triggerFeedback(path)">调用示例</wd-button>
      </view>
      <view class="feedback-panel">
        <view v-for="item in feedbackLogs" :key="item" class="feedback-panel__item">{{ item }}</view>
      </view>
    </view>

    <view v-else-if="path === 'notice-bar'" class="demo-block">
      <wd-notice-bar text="Wot UI 详情页已补充更多真实预览效果。" />
    </view>

    <view v-else-if="path === 'swipe-action'" class="demo-block">
      <view :class="['swipe-demo', { 'swipe-demo--opened': swipeOpened }]">
        <view class="swipe-demo__main">订单 #20260711001</view>
        <view class="swipe-demo__actions">
          <view class="swipe-demo__action" @click="showApiHint('已标记')">标记</view>
          <view class="swipe-demo__action swipe-demo__action--danger" @click="showApiHint('已删除')">删除</view>
        </view>
      </view>
      <wd-button size="small" plain @click="swipeOpened = !swipeOpened">{{ swipeOpened ? '收起操作' : '展开操作' }}</wd-button>
    </view>

    <view v-else-if="path === 'sort-button'" class="demo-row">
      <view
        v-for="item in sortOptionsLite"
        :key="item"
        :class="['sort-chip', { 'sort-chip--active': sortActive === item }]"
        @click="triggerSort(item)"
      >
        {{ item }}
      </view>
      <view class="demo-note">当前排序：{{ sortActive }}</view>
    </view>

    <view v-else-if="path === 'empty'" class="demo-block">
      <view v-if="!emptyRecovered" class="empty-demo">
        <wd-icon name="warn-bold" size="28px" />
        <view class="demo-fallback__title">暂无数据</view>
        <view class="demo-note">当前筛选条件下没有内容，可以切换条件后重试。</view>
        <wd-button size="small" type="primary" @click="recoverEmptyState">重新加载</wd-button>
      </view>
      <view v-else class="logic-demo">
        <view class="demo-fallback__title">数据已恢复</view>
        <view class="demo-note">模拟刷新后已重新拿到内容。</view>
      </view>
    </view>

    <view v-else-if="path === 'count-down' || path === 'use-count-down'" class="demo-row">
      <view class="timer-cell">{{ String(Math.floor(countdownValue / 60)).padStart(2, '0') }}</view>
      <view class="timer-cell">{{ String(countdownValue % 60).padStart(2, '0') }}</view>
      <view class="input-actions">
        <wd-button size="small" type="primary" @click="startCountdown">开始</wd-button>
        <wd-button size="small" plain @click="resetCountdown">重置</wd-button>
      </view>
    </view>

    <view v-else-if="path === 'count-to'" class="demo-row">
      <view v-for="item in countToNumbers" :key="item" :class="['metric-chip', { 'metric-chip--active': item === countToNumbers[countToIndex] }]">{{ item }}</view>
      <wd-button size="small" plain @click="cycleCountTo">切换指标</wd-button>
    </view>

    <view v-else-if="path === 'avatar'" class="demo-row">
      <wd-avatar :shape="avatarShape">W</wd-avatar>
      <wd-avatar :shape="avatarShape">UI</wd-avatar>
      <wd-button size="small" plain @click="changeAvatarShape(avatarShape === 'circle' ? 'square' : 'circle')">切换形状</wd-button>
    </view>

    <view v-else-if="path === 'badge'" class="demo-row">
      <wd-badge :model-value="badgeCount">
        <wd-button size="small">消息</wd-button>
      </wd-badge>
      <wd-badge is-dot>
        <wd-button size="small">提醒</wd-button>
      </wd-badge>
      <wd-button size="small" plain @click="changeBadge(-1)">-1</wd-button>
      <wd-button size="small" plain @click="changeBadge(1)">+1</wd-button>
    </view>

    <view v-else-if="path === 'tag'" class="demo-row">
      <wd-tag :type="tagActive === '标签' ? 'primary' : 'default'" @click="selectTag('标签')">标签</wd-tag>
      <wd-tag :type="tagActive === '成功' ? 'success' : 'default'" @click="selectTag('成功')">成功</wd-tag>
      <wd-tag :type="tagActive === '警告' ? 'warning' : 'default'" @click="selectTag('警告')">警告</wd-tag>
      <view class="demo-note">当前标签：{{ tagActive }}</view>
    </view>

    <view v-else-if="path === 'card'" class="demo-block">
      <wd-card title="经营周报">
        <view class="demo-note">适合放摘要信息、运营指标和内容模块。</view>
        <view v-if="cardExpanded" class="card-extra">新增成交 12 单，转化率提升 3.2%。</view>
      </wd-card>
      <wd-button size="small" plain @click="toggleCardExpand">{{ cardExpanded ? '收起详情' : '展开详情' }}</wd-button>
    </view>

    <view v-else-if="path === 'divider'" class="demo-block">
      <view class="divider-demo">
        <view class="divider-demo__line" />
        <text class="divider-demo__text">分割线</text>
        <view class="divider-demo__line" />
      </view>
    </view>

    <view v-else-if="path === 'gap'" class="demo-block">
      <view class="gap-demo">
        <view class="gap-demo__block">区块 A</view>
        <view class="gap-demo__spacer" />
        <view class="gap-demo__block">区块 B</view>
      </view>
    </view>

    <view v-else-if="path === 'grid'" class="demo-block">
      <view class="grid-demo">
        <view v-for="item in gridItems" :key="item.title" :class="['grid-demo__item', { 'grid-demo__item--active': gridActive === item.title }]" @click="toggleGrid(item.title)">
          <view class="grid-demo__icon">{{ item.icon }}</view>
          <view class="grid-demo__text">{{ item.title }}</view>
        </view>
      </view>
      <view class="demo-note">当前入口：{{ gridActive }}</view>
    </view>

    <view v-else-if="path === 'collapse'" class="demo-block">
      <wd-collapse v-model="activeCollapse">
        <wd-collapse-item title="基础信息" name="faq">
          <view class="collapse-content">这里可以放订单信息、客户资料和帮助说明。</view>
        </wd-collapse-item>
      </wd-collapse>
    </view>

    <view v-else-if="path === 'steps'" class="demo-block">
      <wd-steps :active="stepsActive" vertical>
        <wd-step
          v-for="step in stepItems"
          :key="step.title"
          :title="step.title"
          :description="step.description"
        />
      </wd-steps>
      <view class="input-actions">
        <wd-button size="small" plain @click="updateSteps(-1)">上一步</wd-button>
        <wd-button size="small" type="primary" @click="updateSteps(1)">下一步</wd-button>
      </view>
    </view>

    <view v-else-if="path === 'sticky'" class="demo-block">
      <view class="sticky-demo">
        <view :class="['sticky-demo__header', { 'sticky-demo__header--pinned': stickyPinned }]" @click="stickyPinned = !stickyPinned">吸顶筛选栏</view>
        <view class="sticky-demo__body">向下滚动时头部会固定在顶部，适合筛选栏和列表标题。</view>
      </view>
    </view>

    <view v-else-if="path === 'skeleton'" class="demo-block">
      <view class="skeleton-demo">
        <view class="skeleton-demo__avatar" />
        <view class="skeleton-demo__content">
          <view class="skeleton-demo__line skeleton-demo__line--lg" />
          <view class="skeleton-demo__line" />
          <view class="skeleton-demo__line skeleton-demo__line--sm" />
        </view>
      </view>
    </view>

    <view v-else-if="path === 'loadmore'" class="demo-block">
      <view class="loadmore-list">
        <view v-for="item in loadmoreItems" :key="item" class="loadmore-list__item">{{ item }}</view>
      </view>
      <view class="loadmore-demo">
        <view class="divider-demo__line" />
        <text class="loadmore-demo__text">点击继续追加内容</text>
        <view class="divider-demo__line" />
      </view>
      <wd-button size="small" plain @click="appendLoadmoreItem">加载更多</wd-button>
    </view>

    <view v-else-if="path === 'img'" class="demo-block">
      <view class="media-demo media-demo--image">
        <view class="media-demo__title">{{ previewImages[previewImageIndex] }}</view>
      </view>
      <wd-button size="small" plain @click="nextPreviewImage">切换图片</wd-button>
    </view>

    <view v-else-if="path === 'image-preview'" class="demo-block">
      <view class="image-preview-demo">
        <view
          v-for="(item, index) in previewImages"
          :key="item"
          :class="['media-demo', 'media-demo--thumb', { 'media-demo--thumb-active': previewImageIndex === index }]"
          @click="previewImageIndex = index"
        />
        <wd-button size="small" plain @click="nextPreviewImage">预览下一张</wd-button>
      </view>
      <view class="demo-note">当前预览：{{ previewImages[previewImageIndex] }}</view>
    </view>

    <view v-else-if="path === 'video-preview'" class="demo-block">
      <view :class="['media-demo', 'media-demo--video', { 'media-demo--video-active': videoPlaying }]">
        <view class="media-demo__play" @click="toggleVideoPlaying">{{ videoPlaying ? '❚❚' : '▶' }}</view>
      </view>
      <view class="demo-note">{{ videoPlaying ? '视频播放中' : '点击播放按钮开始预览' }}</view>
    </view>

    <view v-else-if="path === 'img-cropper'" class="demo-block">
      <view class="cropper-demo">
        <view :class="['cropper-demo__frame', `cropper-demo__frame--${cropperRatio.replace(':', '-')}`]">
          <view class="cropper-demo__image" />
        </view>
      </view>
      <view class="demo-row">
        <wd-tag :type="cropperRatio === '1:1' ? 'primary' : 'default'" @click="switchCropperRatio('1:1')">1:1</wd-tag>
        <wd-tag :type="cropperRatio === '16:9' ? 'primary' : 'default'" @click="switchCropperRatio('16:9')">16:9</wd-tag>
        <wd-tag :type="cropperRatio === '4:3' ? 'primary' : 'default'" @click="switchCropperRatio('4:3')">4:3</wd-tag>
      </view>
    </view>

    <view v-else-if="path === 'swiper'" class="demo-block">
      <view class="swiper-demo">
        <view class="swiper-demo__banner">{{ swiperBanners[swiperIndex] }}</view>
        <view class="swiper-demo__dots">
          <view
            v-for="(item, index) in swiperBanners"
            :key="item"
            :class="['swiper-demo__dot', { 'swiper-demo__dot--active': swiperIndex === index }]"
            @click="selectBanner(index)"
          />
        </view>
      </view>
    </view>

    <view v-else-if="path === 'table'" class="demo-block">
      <view class="demo-row">
        <wd-tag :type="tableChannel === 'mini' ? 'primary' : 'default'" @click="switchTableChannel('mini')">小程序</wd-tag>
        <wd-tag :type="tableChannel === 'h5' ? 'primary' : 'default'" @click="switchTableChannel('h5')">H5</wd-tag>
      </view>
      <view class="table-demo">
        <view class="table-demo__row table-demo__row--head">
          <text>渠道</text>
          <text>订单</text>
          <text>转化率</text>
        </view>
        <view v-if="tableChannel === 'mini'" class="table-demo__row">
          <text>小程序</text>
          <text>126</text>
          <text>18%</text>
        </view>
        <view v-if="tableChannel === 'mini'" class="table-demo__row">
          <text>企微导购</text>
          <text>64</text>
          <text>11%</text>
        </view>
        <view v-if="tableChannel === 'h5'" class="table-demo__row">
          <text>H5</text>
          <text>82</text>
          <text>12%</text>
        </view>
        <view v-if="tableChannel === 'h5'" class="table-demo__row">
          <text>落地页</text>
          <text>57</text>
          <text>9%</text>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'watermark'" class="demo-block">
      <view class="watermark-demo">
        <view v-if="watermarkVisible" class="watermark-demo__text">CONFIDENTIAL</view>
        <view class="demo-fallback__title">受保护内容区域</view>
      </view>
      <wd-button size="small" plain @click="toggleWatermark">{{ watermarkVisible ? '隐藏水印' : '显示水印' }}</wd-button>
    </view>

    <view v-else-if="path === 'curtain'" class="demo-block">
      <view v-if="curtainVisible" class="curtain-demo">
        <view class="curtain-demo__poster">开屏活动海报</view>
        <wd-button size="small" type="primary" @click="curtainVisible = false">关闭海报</wd-button>
      </view>
      <wd-button v-else size="small" plain @click="curtainVisible = true">重新打开</wd-button>
    </view>

    <view v-else-if="path === 'fab'" class="demo-block">
      <view class="floating-action-card">
        <view>
          <view class="demo-fallback__title">悬浮快捷入口</view>
          <view class="demo-note">适合高频新增、联系顾问和快速发起操作。</view>
        </view>
        <view class="fab-demo" @click="toggleFab">{{ fabExpanded ? '×' : '＋' }}</view>
      </view>
      <view v-if="fabExpanded" class="fab-demo__actions">
        <wd-button size="small" plain @click="showApiHint('联系顾问')">联系顾问</wd-button>
        <wd-button size="small" plain @click="showApiHint('新建客户')">新建客户</wd-button>
        <wd-button size="small" plain @click="showApiHint('发起审批')">发起审批</wd-button>
      </view>
    </view>

    <view v-else-if="path === 'transition'" class="demo-block">
      <view class="demo-row">
        <wd-button size="small" type="primary" @click="toggleTransitionDemo">
          {{ transitionVisible ? '隐藏内容' : '显示内容' }}
        </wd-button>
      </view>
      <view :class="['transition-demo', { 'transition-demo--hidden': !transitionVisible }]">
        <view class="transition-demo__card">带过渡的内容卡片</view>
      </view>
    </view>

    <view v-else-if="path === 'resize'" class="demo-block">
      <view class="demo-row">
        <wd-button size="small" plain @click="toggleResizeMode">
          切换为{{ resizeMode === 'compact' ? '宽布局' : '紧凑布局' }}
        </wd-button>
      </view>
      <view :class="['resize-demo', `resize-demo--${resizeMode}`]">
        <view class="resize-demo__box">{{ resizeMode === 'compact' ? '320rpx' : '520rpx' }}</view>
      </view>
      <view class="demo-note">当前尺寸模式：{{ resizeMode === 'compact' ? '紧凑' : '宽布局' }}</view>
    </view>

    <view v-else-if="path === 'config-provider'" class="demo-block">
      <view class="demo-row">
        <wd-button size="small" type="primary" @click="toggleConfigTheme">切换主题色</wd-button>
      </view>
      <view :class="['config-demo', `config-demo--${configTheme}`]">
        <view class="config-demo__badge">当前主题</view>
        <view class="config-demo__title">{{ configTheme === 'blue' ? '默认蓝主题' : '业务绿主题' }}</view>
      </view>
    </view>

    <view v-else-if="path === 'root-portal'" class="demo-block">
      <view class="demo-row">
        <wd-button size="small" type="primary" @click="rootPortalVisible = true">打开根节点浮层</wd-button>
      </view>
      <wd-popup v-model="rootPortalVisible" position="bottom" closable root-portal safe-area-inset-bottom>
        <view class="popup-body">
          <view class="popup-title">RootPortal 根节点演示</view>
          <view class="popup-desc">这类浮层会挂到根节点，避免被局部容器裁切。</view>
        </view>
      </wd-popup>
    </view>

    <view v-else-if="path === 'use-upload'" class="demo-block">
      <view class="logic-demo">
        <view class="demo-fallback__title">useUpload 逻辑示例</view>
        <view class="demo-note">队列数量：{{ uploadQueueCount }}，当前状态：{{ uploadHookStatus }}</view>
        <view class="input-actions">
          <wd-button size="small" type="primary" @click="runUseUploadDemo">执行上传</wd-button>
          <wd-button size="small" plain @click="uploadHookStatus = '待处理'; uploadQueueCount = 2">重置队列</wd-button>
        </view>
      </view>
    </view>

    <view v-else-if="path === 'use-config-provider'" class="demo-block">
      <view class="logic-demo">
        <view class="demo-fallback__title">useConfigProvider 逻辑示例</view>
        <view class="demo-note">当前逻辑主题：{{ configTheme === 'blue' ? '默认蓝主题' : '业务绿主题' }}</view>
        <wd-button size="small" type="primary" @click="toggleConfigTheme">切换逻辑主题</wd-button>
      </view>
    </view>

    <view v-else class="demo-fallback">
      <wd-tag type="primary" plain>{{ isCompact ? '预览' : '示例' }}</wd-tag>
      <view class="demo-fallback__title">Wot UI {{ path }}</view>
      <view class="demo-fallback__desc">
        这个组件已经纳入详情页联动，当前先展示场景化卡片，后续可以继续补成更完整的业务 Demo。
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.wot-demo {
  display: grid;
  gap: 18rpx;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16rpx;
}

.feedback-panel,
.logic-demo {
  display: grid;
  gap: 12rpx;
  margin-top: 14rpx;
}

.feedback-panel__item,
.logic-demo {
  border-radius: 16rpx;
  background: #f7f9fc;
  padding: 18rpx 20rpx;
}

.icon-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border: 1rpx solid #dfe6f1;
  border-radius: 18rpx;
  background: #fff;
}

.icon-chip--active {
  border-color: #8fb0ff;
  background: #edf3ff;
}

.demo-block {
  width: 100%;
}

.demo-note,
.collapse-content,
.popup-desc,
.demo-fallback__desc {
  color: #6a7485;
  font-size: 24rpx;
  line-height: 1.7;
}

.demo-note {
  margin-top: 14rpx;
}

.card-extra {
  margin-top: 12rpx;
  color: #426cff;
  font-size: 23rpx;
  line-height: 1.7;
}

.popup-body {
  display: grid;
  gap: 18rpx;
  min-width: 480rpx;
  padding: 32rpx;
}

.popup-title,
.demo-fallback__title {
  color: #182235;
  font-size: 30rpx;
  font-weight: 800;
}

.demo-fallback {
  display: grid;
  gap: 14rpx;
  border: 1rpx solid #e4e9f3;
  border-radius: 18rpx;
  background: linear-gradient(180deg, #fff 0%, #f7f9fc 100%);
  padding: 24rpx;
}

.text-stack,
.picker-demo,
.tour-stack,
.gap-demo,
.swiper-demo,
.watermark-demo,
.curtain-demo,
.empty-demo,
.password-demo,
.input-showcase,
.button-showcase,
.config-demo,
.resize-demo,
.transition-demo,
.backtop-demo {
  display: grid;
  gap: 14rpx;
}

.button-showcase__section {
  display: grid;
  gap: 14rpx;
  border-radius: 22rpx;
  background: #f7f9fc;
  padding: 20rpx;
}

.button-showcase__block {
  width: 100%;
}

:deep(.button-shadow) {
  box-shadow: 0 6px 18px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 10%);
}

.text-stack__title,
.tour-step__title,
.upload-demo__name,
.nav-bar-demo__title,
.grid-demo__text,
.password-demo__label {
  color: #182235;
  font-size: 26rpx;
  font-weight: 800;
}

.text-stack__sub,
.text-stack__note {
  color: #6a7485;
  font-size: 23rpx;
  line-height: 1.7;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 14rpx;
}

.layout-grid--split {
  grid-template-columns: 1fr 1fr;
}

.layout-grid__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 84rpx;
  border-radius: 16rpx;
  background: #f4f8ff;
  color: #426cff;
  font-size: 24rpx;
  font-weight: 700;
}

.layout-grid__item--wide {
  grid-row: span 2;
}

.nav-bar-demo,
.pager-demo,
.floating-action-card,
.swipe-demo,
.divider-demo,
.loadmore-demo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.nav-bar-demo {
  border: 1rpx solid #e4e9f3;
  border-radius: 18rpx;
  padding: 18rpx 22rpx;
}

.segmented-demo {
  display: flex;
  gap: 10rpx;
  border-radius: 999rpx;
  background: #f4f7fb;
  padding: 10rpx;
}

.segmented-demo__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
  min-height: 58rpx;
  border-radius: 999rpx;
  color: #657289;
  font-size: 22rpx;
  font-weight: 700;
}

.segmented-demo__item--active {
  background: #fff;
  color: #426cff;
  box-shadow: 0 10rpx 24rpx rgba(66, 108, 255, 0.12);
}

.sidebar-demo {
  display: grid;
  grid-template-columns: 180rpx 1fr;
  gap: 16rpx;
}

.sidebar-demo__nav {
  display: grid;
  gap: 10rpx;
}

.sidebar-demo__nav-item,
.sort-chip,
.metric-chip,
.timer-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background: #f5f7fb;
  color: #5f6c82;
  font-size: 22rpx;
  font-weight: 700;
}

.sidebar-demo__nav-item {
  min-height: 68rpx;
  padding: 0 12rpx;
}

.sidebar-demo__nav-item--active {
  background: #edf3ff;
  color: #426cff;
}

.sidebar-demo__panel,
.overlay-demo__content,
.floating-panel-demo,
.sticky-demo,
.cropper-demo,
.watermark-demo,
.curtain-demo {
  border: 1rpx solid #e4e9f3;
  border-radius: 18rpx;
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
  padding: 22rpx;
}

.pager-demo__current {
  color: #182235;
  font-size: 24rpx;
  font-weight: 700;
}

.index-bar-demo {
  display: grid;
  grid-template-columns: 1fr 52rpx;
  gap: 12rpx;
}

.index-bar-demo__list {
  display: grid;
  gap: 12rpx;
}

.index-bar-demo__section {
  display: grid;
  gap: 10rpx;
}

.index-bar-demo__anchor {
  color: #426cff;
  font-size: 22rpx;
  font-weight: 800;
}

.index-bar-demo__cell {
  border-radius: 14rpx;
  background: #f7f9fc;
  padding: 16rpx 18rpx;
  color: #56657a;
  font-size: 23rpx;
}

.index-bar-demo__sidebar {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 8rpx;
  color: #426cff;
  font-size: 20rpx;
  font-weight: 800;
}

.floating-badge,
.fab-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 80rpx;
  height: 80rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #386eff 0%, #6b7cff 100%);
  color: #fff;
  font-size: 26rpx;
  font-weight: 800;
}

.tour-step {
  display: flex;
  gap: 14rpx;
  align-items: flex-start;
}

.tour-step__index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border-radius: 999rpx;
  background: #edf3ff;
  color: #426cff;
  font-size: 22rpx;
  font-weight: 800;
  flex-shrink: 0;
}

.password-demo__cells {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12rpx;
}

.password-demo__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  border: 1rpx solid #dbe3f0;
  border-radius: 16rpx;
  background: #fff;
}

.password-demo__dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 999rpx;
  background: #182235;
}

.keyboard-demo {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
}

.keyboard-demo__key {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 68rpx;
  border-radius: 16rpx;
  background: #f7f9fc;
  color: #182235;
  font-size: 24rpx;
  font-weight: 700;
}

.picker-demo__options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.input-showcase__title {
  color: #182235;
  font-size: 26rpx;
  font-weight: 800;
}

.input-actions,
.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.search-log-list {
  display: grid;
  gap: 12rpx;
}

.search-log-item,
.search-empty {
  border-radius: 14rpx;
  background: #f7f9fc;
  padding: 16rpx 18rpx;
  color: #5f6c82;
  font-size: 23rpx;
  line-height: 1.6;
}

.upload-demo__meta {
  display: grid;
  gap: 6rpx;
  min-width: 0;
  flex: 1;
}

.wheel-demo {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
}

.wheel-demo__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 82rpx;
  border-radius: 16rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%);
  color: #426cff;
  font-size: 24rpx;
  font-weight: 700;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8rpx;
}

.calendar-grid__week,
.calendar-grid__day {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 54rpx;
  border-radius: 12rpx;
  font-size: 22rpx;
}

.calendar-grid__week {
  color: #6a7485;
}

.calendar-grid__day {
  background: #f7f9fc;
  color: #182235;
}

.calendar-grid__day--active {
  background: #edf3ff;
  color: #426cff;
  font-weight: 800;
}

.upload-demo {
  display: grid;
  gap: 16rpx;
}

.upload-demo__file {
  display: flex;
  align-items: center;
  gap: 14rpx;
  border: 1rpx solid #e4e9f3;
  border-radius: 16rpx;
  background: #fff;
  padding: 18rpx;
}

.upload-demo__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  background: #edf3ff;
  color: #426cff;
  font-size: 22rpx;
  font-weight: 800;
}

.signature-demo {
  position: relative;
  min-height: 160rpx;
  border: 1rpx dashed #cfd9e7;
  border-radius: 18rpx;
  background: linear-gradient(180deg, #fff 0%, #fbfcfe 100%);
}

.signature-demo__line {
  position: absolute;
  left: 24rpx;
  right: 24rpx;
  bottom: 38rpx;
  height: 2rpx;
  background: #d9e3f0;
}

.signature-demo__mark {
  position: absolute;
  right: 36rpx;
  bottom: 52rpx;
  color: #426cff;
  font-size: 30rpx;
  font-weight: 800;
  font-style: italic;
}

.verify-demo__track {
  position: relative;
  height: 74rpx;
  border-radius: 999rpx;
  background: #f3f6fb;
}

.verify-demo__progress {
  width: 48%;
  height: 100%;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #386eff 0%, #7f95ff 100%);
}

.verify-demo__thumb {
  position: absolute;
  top: 7rpx;
  left: calc(48% - 30rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  border-radius: 999rpx;
  background: #fff;
  color: #426cff;
  font-size: 24rpx;
  font-weight: 800;
  box-shadow: 0 10rpx 24rpx rgba(66, 108, 255, 0.12);
}

.overlay-demo {
  position: relative;
  overflow: hidden;
  border-radius: 18rpx;
}

.overlay-demo__content,
.overlay-demo__mask {
  min-height: 140rpx;
}

.overlay-demo__mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 24, 39, 0.45);
  color: #fff;
  font-size: 26rpx;
  font-weight: 800;
}

.popover-demo {
  display: grid;
  justify-items: start;
  gap: 14rpx;
}

.popover-demo__bubble {
  position: relative;
  border-radius: 16rpx;
  background: #182235;
  padding: 18rpx 22rpx;
  color: #fff;
  font-size: 22rpx;
}

.floating-panel-demo__handle {
  width: 72rpx;
  height: 8rpx;
  border-radius: 999rpx;
  background: #dbe3ef;
  justify-self: center;
}

.floating-panel-demo--expanded {
  box-shadow: 0 16rpx 40rpx rgba(61, 95, 192, 0.1);
}

.circle-demo {
  display: flex;
  justify-content: center;
}

.circle-demo__ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 164rpx;
  height: 164rpx;
  border: 14rpx solid #cfe0ff;
  border-top-color: #426cff;
  border-right-color: #426cff;
  border-radius: 999rpx;
  background: #fff;
}

.circle-demo__value {
  color: #426cff;
  font-size: 28rpx;
  font-weight: 800;
}

.swipe-demo {
  overflow: hidden;
  border-radius: 18rpx;
  border: 1rpx solid #e4e9f3;
}

.swipe-demo--opened {
  transform: translateX(-24rpx);
  transition: transform 0.2s ease;
}

.swipe-demo__main,
.swipe-demo__action {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 74rpx;
  font-size: 23rpx;
  font-weight: 700;
}

.swipe-demo__main {
  flex: 1;
  background: #fff;
  color: #182235;
  justify-content: flex-start;
  padding: 0 18rpx;
}

.swipe-demo__actions {
  display: flex;
}

.swipe-demo__action {
  min-width: 96rpx;
  background: #edf3ff;
  color: #426cff;
}

.swipe-demo__action--danger {
  background: #ffe9e7;
  color: #d55244;
}

.sort-chip,
.metric-chip,
.timer-cell {
  min-width: 112rpx;
  min-height: 58rpx;
  padding: 0 18rpx;
}

.sort-chip--active,
.metric-chip--active {
  background: #edf3ff;
  color: #426cff;
}

.empty-demo {
  justify-items: center;
  text-align: center;
}

.divider-demo__line {
  flex: 1;
  height: 2rpx;
  background: #dfe6f1;
}

.divider-demo__text,
.loadmore-demo__text {
  color: #6a7485;
  font-size: 22rpx;
}

.gap-demo__block,
.sticky-demo__header,
.sticky-demo__body,
.swiper-demo__banner,
.curtain-demo__poster {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
}

.gap-demo__block {
  min-height: 72rpx;
  background: #f7f9fc;
  color: #182235;
  font-size: 24rpx;
  font-weight: 700;
}

.gap-demo__spacer {
  height: 22rpx;
}

.grid-demo {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12rpx;
}

.grid-demo__item {
  display: grid;
  justify-items: center;
  gap: 10rpx;
  border-radius: 16rpx;
  background: #f7f9fc;
  padding: 18rpx 8rpx;
}

.grid-demo__item--active {
  background: #edf3ff;
  box-shadow: inset 0 0 0 1rpx #8fb0ff;
}

.grid-demo__icon {
  font-size: 32rpx;
}

.sticky-demo {
  gap: 14rpx;
}

.sticky-demo__header {
  min-height: 60rpx;
  background: #edf3ff;
  color: #426cff;
  font-size: 23rpx;
  font-weight: 800;
}

.sticky-demo__header--pinned {
  background: linear-gradient(135deg, #386eff 0%, #7187ff 100%);
  color: #fff;
}

.sticky-demo__body {
  min-height: 108rpx;
  background: #fff;
  color: #6a7485;
  font-size: 23rpx;
  line-height: 1.7;
  text-align: center;
  padding: 0 18rpx;
}

.skeleton-demo {
  display: flex;
  gap: 18rpx;
}

.skeleton-demo__avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #eff3f8 25%, #f7f9fc 37%, #eff3f8 63%);
}

.skeleton-demo__content {
  display: grid;
  flex: 1;
  gap: 12rpx;
}

.skeleton-demo__line {
  height: 20rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #eff3f8 25%, #f7f9fc 37%, #eff3f8 63%);
}

.skeleton-demo__line--lg {
  width: 80%;
}

.skeleton-demo__line--sm {
  width: 56%;
}

.media-demo {
  border-radius: 18rpx;
  background: linear-gradient(135deg, #dce8ff 0%, #edf3ff 100%);
}

.media-demo--image,
.media-demo--video {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180rpx;
}

.media-demo--thumb {
  width: 120rpx;
  height: 120rpx;
}

.media-demo__title,
.media-demo__play {
  color: #426cff;
  font-size: 26rpx;
  font-weight: 800;
}

.image-preview-demo {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.cropper-demo__frame {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180rpx;
  border: 2rpx dashed #9ab7ff;
  border-radius: 20rpx;
  background: #f7faff;
}

.cropper-demo__image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #cfe0ff 0%, #e9f1ff 100%);
}

.swiper-demo {
  gap: 16rpx;
}

.swiper-demo__banner {
  min-height: 160rpx;
  background: linear-gradient(135deg, #386eff 0%, #7187ff 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 800;
}

.swiper-demo__dots {
  display: flex;
  justify-content: center;
  gap: 10rpx;
}

.swiper-demo__dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 999rpx;
  background: #d8e0ee;
}

.swiper-demo__dot--active {
  width: 32rpx;
  background: #426cff;
}

.table-demo {
  overflow: hidden;
  border: 1rpx solid #e1e7f1;
  border-radius: 14rpx;
}

.table-demo__row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
  padding: 18rpx;
  border-bottom: 1rpx solid #edf1f6;
  color: #546377;
  font-size: 22rpx;
}

.table-demo__row:last-child {
  border-bottom: none;
}

.table-demo__row--head {
  background: #f7f9fc;
  color: #182235;
  font-weight: 700;
}

.pager-list,
.loadmore-list,
.fab-demo__actions,
.cascader-demo {
  display: grid;
  gap: 12rpx;
}

.pager-list {
  margin-top: 14rpx;
}

.pager-list__item,
.loadmore-list__item,
.cascader-demo__item {
  border-radius: 14rpx;
  background: #f7f9fc;
  padding: 16rpx 18rpx;
  color: #5f6c82;
  font-size: 23rpx;
  line-height: 1.6;
}

.cascader-demo {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 14rpx;
}

.cascader-demo__col {
  display: grid;
  gap: 10rpx;
}

.cascader-demo__item--active {
  background: #edf3ff;
  color: #426cff;
}

.wheel-demo__column {
  display: grid;
  gap: 12rpx;
}

.wheel-demo__item--active {
  box-shadow: inset 0 0 0 1rpx #8fb0ff;
}

.fab-demo__actions {
  margin-top: 14rpx;
}

.transition-demo {
  overflow: hidden;
  transition: all 0.2s ease;
}

.transition-demo--hidden {
  opacity: 0.35;
  transform: scale(0.96);
}

.transition-demo__card,
.resize-demo__box,
.config-demo {
  border-radius: 18rpx;
  background: #f7f9fc;
  padding: 22rpx;
}

.resize-demo--compact .resize-demo__box {
  width: 320rpx;
}

.resize-demo--wide .resize-demo__box {
  width: 520rpx;
}

.config-demo--blue {
  background: linear-gradient(135deg, #edf3ff 0%, #f7f9fc 100%);
}

.config-demo--green {
  background: linear-gradient(135deg, #e9fbf2 0%, #f7f9fc 100%);
}

.config-demo__badge {
  color: #426cff;
  font-size: 22rpx;
  font-weight: 700;
}

.config-demo--green .config-demo__badge {
  color: #1e9e68;
}

.config-demo__title {
  color: #182235;
  font-size: 28rpx;
  font-weight: 800;
}

.index-bar-demo__section--active {
  box-shadow: inset 0 0 0 1rpx #8fb0ff;
  background: #edf3ff;
}

.index-bar-demo__sidebar-item--active {
  color: #426cff;
  font-weight: 800;
}

.backtop-demo {
  grid-template-columns: 48rpx minmax(0, 1fr);
  align-items: stretch;
}

.backtop-demo__track {
  position: relative;
  border-radius: 999rpx;
  background: #edf1f7;
  min-height: 220rpx;
  overflow: hidden;
}

.backtop-demo__fill {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, #7ea0ff 0%, #386eff 100%);
}

.media-demo--thumb-active {
  box-shadow: inset 0 0 0 2rpx #426cff;
}

.media-demo--video-active {
  background: linear-gradient(135deg, #1d2740 0%, #426cff 100%);
}

.cropper-demo__frame--1-1 {
  aspect-ratio: 1 / 1;
}

.cropper-demo__frame--16-9 {
  aspect-ratio: 16 / 9;
}

.cropper-demo__frame--4-3 {
  aspect-ratio: 4 / 3;
}

.watermark-demo {
  position: relative;
  min-height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.watermark-demo__text {
  position: absolute;
  transform: rotate(-18deg);
  color: rgba(66, 108, 255, 0.12);
  font-size: 42rpx;
  font-weight: 800;
}

.curtain-demo {
  justify-items: center;
}

.curtain-demo__poster {
  width: 100%;
  min-height: 180rpx;
  background: linear-gradient(135deg, #111827 0%, #374151 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 800;
}
</style>
