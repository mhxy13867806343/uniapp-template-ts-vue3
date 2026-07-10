export interface CustomComponentItem {
  name: string
  title: string
  path: string
  summary: string
  tags: string[]
  group: string
}

export type CustomComponentLevel = 'basic' | 'intermediate' | 'advanced'

import { neoExtraMetaList, neoExtraMetaMap } from './neoExtraData'
import { neoExtraMoreMetaList, neoExtraMoreMetaMap } from './neoExtraMoreData'

export const customComponents: CustomComponentItem[] = [
  {
    name: 'NeoMetricBoard',
    title: '指标看板',
    path: 'neo-metric-board',
    summary: '独立封装的看板组件，适合首页、驾驶舱和经营总览，不依赖任何 UI 组件库。',
    tags: ['独立实现', '看板', '数据概览'],
    group: '第三方组件'
  },
  {
    name: 'NeoTaskCluster',
    title: '任务簇面板',
    path: 'neo-task-cluster',
    summary: '面向审批、工单、运营的任务组件，内含优先级、摘要和操作区。',
    tags: ['独立实现', '任务', '操作面板'],
    group: '第三方组件'
  },
  {
    name: 'NeoProfileSpotlight',
    title: '人物聚焦卡',
    path: 'neo-profile-spotlight',
    summary: '适合客户详情、成员资料和线索页，包含基础信息、统计和跟进时间线。',
    tags: ['独立实现', '人物卡', '资料详情'],
    group: '第三方组件'
  },
  {
    name: 'NeoButton',
    title: '按钮',
    path: 'neo-button',
    summary: '基础按钮组件，提供主按钮、次按钮和幽灵按钮三种视觉风格。',
    tags: ['独立实现', '基础件', '按钮'],
    group: '第三方组件'
  },
  {
    name: 'NeoField',
    title: '输入框',
    path: 'neo-field',
    summary: '基础表单输入组件，支持标签、占位提示和双向绑定。',
    tags: ['独立实现', '基础件', '表单'],
    group: '第三方组件'
  },
  {
    name: 'NeoNoticeStrip',
    title: '通知条',
    path: 'neo-notice-strip',
    summary: '轻量通知组件，适合更新提醒、风险提示和运营广播。',
    tags: ['独立实现', '基础件', '通知'],
    group: '第三方组件'
  },
  {
    name: 'NeoEmptyState',
    title: '空状态',
    path: 'neo-empty-state',
    summary: '适用于列表为空、没有数据或首次进入场景的空状态组件。',
    tags: ['独立实现', '基础件', '空状态'],
    group: '第三方组件'
  },
  {
    name: 'NeoCard',
    title: '卡片',
    path: 'neo-card',
    summary: '通用卡片容器，适合承载摘要信息、列表模块和轻量业务块。',
    tags: ['独立实现', '基础件', '容器'],
    group: '第三方组件'
  },
  {
    name: 'NeoBadge',
    title: '徽标',
    path: 'neo-badge',
    summary: '适合消息数量、状态提示和角标提醒的小体积组件。',
    tags: ['独立实现', '基础件', '状态'],
    group: '第三方组件'
  },
  {
    name: 'NeoTabs',
    title: '标签切换',
    path: 'neo-tabs',
    summary: '基础标签切换组件，适用于频道切换、内容筛选和面板分栏。',
    tags: ['独立实现', '基础件', '切换'],
    group: '第三方组件'
  },
  {
    name: 'NeoDialog',
    title: '对话框',
    path: 'neo-dialog',
    summary: '确认类弹窗组件，适合删除确认、发布确认和二次提示。',
    tags: ['独立实现', '基础件', '弹窗'],
    group: '第三方组件'
  },
  {
    name: 'NeoToast',
    title: '轻提示',
    path: 'neo-toast',
    summary: '轻量浮层提示组件，适合成功反馈、错误提醒和状态确认。',
    tags: ['独立实现', '基础件', '反馈'],
    group: '第三方组件'
  },
  {
    name: 'NeoDropdown',
    title: '下拉选择',
    path: 'neo-dropdown',
    summary: '基础下拉选择组件，适合筛选条件、状态切换和轻量选择器。',
    tags: ['独立实现', '基础件', '选择'],
    group: '第三方组件'
  },
  {
    name: 'NeoStepper',
    title: '计数器',
    path: 'neo-stepper',
    summary: '增减步进组件，适合商品数量、人数选择和配置数值调整。',
    tags: ['独立实现', '基础件', '步进'],
    group: '第三方组件'
  },
  {
    name: 'NeoSkeleton',
    title: '骨架屏',
    path: 'neo-skeleton',
    summary: '用于内容加载中的占位展示，适合列表、卡片和详情页首屏。',
    tags: ['独立实现', '基础件', '加载'],
    group: '第三方组件'
  },
  {
    name: 'NeoSwitch',
    title: '开关',
    path: 'neo-switch',
    summary: '基础开关组件，适合状态启停、消息订阅和配置项启用控制。',
    tags: ['独立实现', '基础件', '开关'],
    group: '第三方组件'
  },
  {
    name: 'NeoRadioGroup',
    title: '单选组',
    path: 'neo-radio-group',
    summary: '卡片式单选组件，适合方案选择、支付方式和类型切换。',
    tags: ['独立实现', '基础件', '单选'],
    group: '第三方组件'
  },
  {
    name: 'NeoCheckboxGroup',
    title: '多选组',
    path: 'neo-checkbox-group',
    summary: '卡片式多选组件，适合标签筛选、偏好设置和能力勾选。',
    tags: ['独立实现', '基础件', '多选'],
    group: '第三方组件'
  },
  {
    name: 'NeoDatePicker',
    title: '日期选择',
    path: 'neo-date-picker',
    summary: '基于原生日期能力封装的选择组件，适合预约、排期和到期日设置。',
    tags: ['独立实现', '基础件', '日期'],
    group: '第三方组件'
  },
  {
    name: 'NeoTextarea',
    title: '多行输入',
    path: 'neo-textarea',
    summary: '多行文本输入组件，适合备注、反馈意见和详情说明场景。',
    tags: ['独立实现', '基础件', '输入'],
    group: '第三方组件'
  },
  {
    name: 'NeoSearchBar',
    title: '搜索栏',
    path: 'neo-search-bar',
    summary: '带搜索动作的输入组件，适合列表检索、客户搜索和筛选入口。',
    tags: ['独立实现', '基础件', '搜索'],
    group: '第三方组件'
  },
  {
    name: 'NeoUpload',
    title: '上传面板',
    path: 'neo-upload',
    summary: '独立上传面板组件，适合附件提交、资料补充和工单上传场景。',
    tags: ['独立实现', '基础件', '上传'],
    group: '第三方组件'
  },
  {
    name: 'NeoActionSheet',
    title: '动作面板',
    path: 'neo-action-sheet',
    summary: '底部动作面板组件，适合快捷操作、分享入口和删除确认分流。',
    tags: ['独立实现', '基础件', '操作'],
    group: '第三方组件'
  },
  {
    name: 'NeoTagInput',
    title: '标签输入',
    path: 'neo-tag-input',
    summary: '带标签管理能力的输入组件，适合关键词录入、标签配置和条件编辑。',
    tags: ['独立实现', '基础件', '标签'],
    group: '第三方组件'
  },
  {
    name: 'NeoRate',
    title: '评分',
    path: 'neo-rate',
    summary: '星级评分组件，适合满意度评价、内容评分和服务打分场景。',
    tags: ['独立实现', '基础件', '评分'],
    group: '第三方组件'
  },
  {
    name: 'NeoTimeline',
    title: '时间线',
    path: 'neo-timeline',
    summary: '适合展示进度流转、订单节点和操作记录的纵向时间线组件。',
    tags: ['独立实现', '基础件', '流程'],
    group: '第三方组件'
  },
  {
    name: 'NeoCollapse',
    title: '折叠面板',
    path: 'neo-collapse',
    summary: '可展开收起的内容面板，适合 FAQ、配置分组和详情分段展示。',
    tags: ['独立实现', '基础件', '折叠'],
    group: '第三方组件'
  },
  ...neoExtraMetaList,
  ...neoExtraMoreMetaList
]

export function findCustomComponent(path?: string) {
  return customComponents.find(item => item.path === path) || customComponents[0]
}

export function getCustomComponentCode(path: string) {
  const extraMeta = neoExtraMetaMap[path]
  if (extraMeta) {
    return extraMeta.code
  }

  const moreExtraMeta = neoExtraMoreMetaMap[path]
  if (moreExtraMeta) {
    return moreExtraMeta.code
  }

  if (path === 'neo-metric-board') {
    return `import NeoMetricBoard from '@/components/neo/NeoMetricBoard.vue'

<NeoMetricBoard
  title="周经营总览"
  subtitle="快速看到关键数据和多端交付进度"
  status-label="本周稳定"
  :metrics="metrics"
  :channels="channels"
  :actions="actions"
/>`
  }

  if (path === 'neo-task-cluster') {
    return `import NeoTaskCluster from '@/components/neo/NeoTaskCluster.vue'

<NeoTaskCluster
  title="今日待处理"
  subtitle="适合审批、工单和运营催办场景"
  summary-label="3 条高优事项"
  completion-value="完成率 68%"
  completion-hint="还有 2 条事项需要今天闭环"
  :tasks="tasks"
  primary-action="立即处理"
  secondary-action="稍后提醒"
/>`
  }

  if (path === 'neo-button') {
    return `import NeoButton from '@/components/neo/NeoButton.vue'

<NeoButton label="立即创建" />
<NeoButton label="保存草稿" variant="secondary" />
<NeoButton label="查看更多" variant="ghost" size="sm" />`
  }

  if (path === 'neo-field') {
    return `import NeoField from '@/components/neo/NeoField.vue'

<NeoField
  v-model="form.name"
  label="客户姓名"
  placeholder="请输入客户姓名"
  hint="必填"
/>`
  }

  if (path === 'neo-notice-strip') {
    return `import NeoNoticeStrip from '@/components/neo/NeoNoticeStrip.vue'

<NeoNoticeStrip
  title="版本更新提醒"
  message="当前页面有新版本可用，建议刷新后继续操作。"
  action-label="立即刷新"
/>`
  }

  if (path === 'neo-empty-state') {
    return `import NeoEmptyState from '@/components/neo/NeoEmptyState.vue'

<NeoEmptyState
  title="暂无待处理任务"
  description="当前筛选条件下还没有内容，可以切换筛选条件或创建新任务。"
  action-label="新建任务"
/>`
  }

  if (path === 'neo-card') {
    return `import NeoCard from '@/components/neo/NeoCard.vue'

<NeoCard
  title="本周复盘"
  subtitle="整理经营数据、客户反馈和待办风险"
  meta="7 条更新"
>
  <text>这里可以放摘要内容或自定义插槽。</text>
</NeoCard>`
  }

  if (path === 'neo-badge') {
    return `import NeoBadge from '@/components/neo/NeoBadge.vue'

<NeoBadge value="8" />
<NeoBadge value="NEW" tone="danger" />
<NeoBadge dot tone="success" />`
  }

  if (path === 'neo-tabs') {
    return `import NeoTabs from '@/components/neo/NeoTabs.vue'

<NeoTabs
  v-model="activeTab"
  :items="[
    { label: '全部', value: 'all' },
    { label: '待处理', value: 'todo', badge: '3' }
  ]"
/>`
  }

  if (path === 'neo-dialog') {
    return `import NeoDialog from '@/components/neo/NeoDialog.vue'

<NeoDialog
  v-model="dialogVisible"
  title="确认发布吗？"
  description="发布后将同步到多个端，建议先检查文案与配置。"
  primary-label="确认发布"
  secondary-label="再看看"
/>`
  }

  if (path === 'neo-toast') {
    return `import NeoToast from '@/components/neo/NeoToast.vue'

<NeoToast message="保存成功" tone="success" />
<NeoToast message="请先完善必填项" tone="warning" />`
  }

  if (path === 'neo-dropdown') {
    return `import NeoDropdown from '@/components/neo/NeoDropdown.vue'

<NeoDropdown
  v-model="status"
  label="全部状态"
  :items="[
    { label: '全部状态', value: 'all' },
    { label: '待处理', value: 'todo' }
  ]"
/>`
  }

  if (path === 'neo-stepper') {
    return `import NeoStepper from '@/components/neo/NeoStepper.vue'

<NeoStepper
  v-model="count"
  :min="1"
  :max="10"
/>`
  }

  if (path === 'neo-skeleton') {
    return `import NeoSkeleton from '@/components/neo/NeoSkeleton.vue'

<NeoSkeleton :rows="4" show-avatar />
<NeoSkeleton :rows="3" />`
  }

  if (path === 'neo-switch') {
    return `import NeoSwitch from '@/components/neo/NeoSwitch.vue'

<NeoSwitch
  v-model="enabled"
  label="消息通知"
  description="开启后，系统会同步发送审批和异常提醒。"
/>`
  }

  if (path === 'neo-radio-group') {
    return `import NeoRadioGroup from '@/components/neo/NeoRadioGroup.vue'

<NeoRadioGroup
  v-model="planType"
  :items="[
    { label: '标准版', value: 'standard' },
    { label: '专业版', value: 'pro' }
  ]"
/>`
  }

  if (path === 'neo-checkbox-group') {
    return `import NeoCheckboxGroup from '@/components/neo/NeoCheckboxGroup.vue'

<NeoCheckboxGroup
  v-model="abilities"
  :items="[
    { label: '短信提醒', value: 'sms' },
    { label: '邮件同步', value: 'mail' }
  ]"
/>`
  }

  if (path === 'neo-date-picker') {
    return `import NeoDatePicker from '@/components/neo/NeoDatePicker.vue'

<NeoDatePicker
  v-model="scheduleDate"
  label="预约日期"
  start="2024-01-01"
  end="2030-12-31"
/>`
  }

  if (path === 'neo-textarea') {
    return `import NeoTextarea from '@/components/neo/NeoTextarea.vue'

<NeoTextarea
  v-model="remark"
  label="备注信息"
  placeholder="请输入补充说明"
  :maxlength="200"
/>`
  }

  if (path === 'neo-search-bar') {
    return `import NeoSearchBar from '@/components/neo/NeoSearchBar.vue'

<NeoSearchBar
  v-model="keyword"
  placeholder="搜索客户名称或手机号"
  action-label="查询"
  @search="handleSearch"
/>`
  }

  if (path === 'neo-upload') {
    return `import NeoUpload from '@/components/neo/NeoUpload.vue'

<NeoUpload
  :files="files"
  title="合同附件"
  description="支持 PDF、PNG、JPG 格式"
  add-label="添加附件"
  @add="handleAddFile"
  @remove="handleRemoveFile"
/>`
  }

  if (path === 'neo-action-sheet') {
    return `import NeoActionSheet from '@/components/neo/NeoActionSheet.vue'

<NeoActionSheet
  v-model="visible"
  title="选择操作"
  description="根据当前内容选择下一步动作"
  :actions="actions"
  @select="handleSelect"
/>`
  }

  if (path === 'neo-tag-input') {
    return `import NeoTagInput from '@/components/neo/NeoTagInput.vue'

<NeoTagInput
  v-model="tags"
  label="关键词标签"
  placeholder="输入标签后点击添加"
  add-label="添加"
/>`
  }

  if (path === 'neo-rate') {
    return `import NeoRate from '@/components/neo/NeoRate.vue'

<NeoRate
  v-model="score"
  label="服务评分"
  hint="点击星星完成打分"
/>`
  }

  if (path === 'neo-timeline') {
    return `import NeoTimeline from '@/components/neo/NeoTimeline.vue'

<NeoTimeline
  :items="[
    { title: '提交申请', time: '09:20', status: 'done' },
    { title: '主管审批', time: '10:10', status: 'active' }
  ]"
/>`
  }

  if (path === 'neo-collapse') {
    return `import NeoCollapse from '@/components/neo/NeoCollapse.vue'

<NeoCollapse
  v-model="openedPanels"
  :items="[
    { title: '基础信息', name: 'base', content: '这里放基础说明内容。' }
  ]"
/>`
  }

  return `import NeoProfileSpotlight from '@/components/neo/NeoProfileSpotlight.vue'

<NeoProfileSpotlight
  name="林知夏"
  role="华东区域采购负责人"
  status="重点客户"
  company="澄星科技"
  phone="138****5566"
  email="linzhixia@example.com"
  :stats="stats"
  :records="records"
/>`
}

export function getCustomComponentScenes(path: string) {
  const extraMeta = neoExtraMetaMap[path]
  if (extraMeta) {
    return extraMeta.scenes
  }

  const moreExtraMeta = neoExtraMoreMetaMap[path]
  if (moreExtraMeta) {
    return moreExtraMeta.scenes
  }

  if (path === 'neo-metric-board') {
    return [
      '首页经营看板',
      '门店数据总览',
      '多端项目周报入口'
    ]
  }

  if (path === 'neo-task-cluster') {
    return [
      '审批中心',
      '售后工单处理',
      '运营任务催办'
    ]
  }

  if (path === 'neo-button') {
    return [
      '弹窗确认操作',
      '列表底部操作栏',
      '表单提交入口'
    ]
  }

  if (path === 'neo-field') {
    return [
      '客户录入表单',
      '登录注册页',
      '筛选条件输入区'
    ]
  }

  if (path === 'neo-notice-strip') {
    return [
      '系统升级提醒',
      '风险提示条',
      '活动广播栏'
    ]
  }

  if (path === 'neo-empty-state') {
    return [
      '消息列表为空',
      '筛选结果为空',
      '首次进入引导占位'
    ]
  }

  if (path === 'neo-card') {
    return [
      '仪表盘摘要卡',
      '订单信息块',
      '活动信息面板'
    ]
  }

  if (path === 'neo-badge') {
    return [
      '消息未读数',
      '状态角标',
      '新功能标记'
    ]
  }

  if (path === 'neo-tabs') {
    return [
      '内容频道切换',
      '工单状态筛选',
      '订单列表分栏'
    ]
  }

  if (path === 'neo-dialog') {
    return [
      '删除确认弹窗',
      '发布确认提醒',
      '风险二次确认'
    ]
  }

  if (path === 'neo-toast') {
    return [
      '操作成功提醒',
      '表单校验反馈',
      '轻量状态提示'
    ]
  }

  if (path === 'neo-dropdown') {
    return [
      '列表筛选',
      '状态切换',
      '轻量单选下拉'
    ]
  }

  if (path === 'neo-stepper') {
    return [
      '商品购买数量',
      '房间人数选择',
      '参数数值微调'
    ]
  }

  if (path === 'neo-skeleton') {
    return [
      '首屏加载占位',
      '卡片内容预加载',
      '列表骨架占位'
    ]
  }

  if (path === 'neo-switch') {
    return [
      '消息通知开关',
      '配置项启停',
      '状态快速切换'
    ]
  }

  if (path === 'neo-radio-group') {
    return [
      '套餐方案选择',
      '支付方式选择',
      '内容类型切换'
    ]
  }

  if (path === 'neo-checkbox-group') {
    return [
      '标签筛选',
      '偏好能力勾选',
      '功能权限配置'
    ]
  }

  if (path === 'neo-date-picker') {
    return [
      '预约日期设置',
      '活动排期选择',
      '到期日录入'
    ]
  }

  if (path === 'neo-textarea') {
    return [
      '工单备注输入',
      '反馈意见填写',
      '详情补充说明'
    ]
  }

  if (path === 'neo-search-bar') {
    return [
      '客户列表检索',
      '订单搜索入口',
      '内容筛选搜索'
    ]
  }

  if (path === 'neo-upload') {
    return [
      '附件补充上传',
      '资料提交页',
      '工单文件补传'
    ]
  }

  if (path === 'neo-action-sheet') {
    return [
      '底部快捷操作',
      '分享方式选择',
      '删除前操作分流'
    ]
  }

  if (path === 'neo-tag-input') {
    return [
      '标签条件录入',
      '关键词维护',
      '筛选项动态编辑'
    ]
  }

  if (path === 'neo-rate') {
    return [
      '服务满意度评分',
      '内容质量评分',
      '评价页打分'
    ]
  }

  if (path === 'neo-timeline') {
    return [
      '工单处理记录',
      '订单进度节点',
      '审批流转过程'
    ]
  }

  if (path === 'neo-collapse') {
    return [
      'FAQ 常见问题',
      '配置项分组展开',
      '详情页分段查看'
    ]
  }

  return [
    '客户详情页',
    '销售线索池',
    '项目成员资料页'
  ]
}

const basicComponentPaths = new Set([
  'neo-button',
  'neo-field',
  'neo-notice-strip',
  'neo-empty-state',
  'neo-card',
  'neo-badge',
  'neo-tabs',
  'neo-dialog',
  'neo-toast',
  'neo-dropdown',
  'neo-stepper',
  'neo-skeleton',
  'neo-switch',
  'neo-radio-group',
  'neo-checkbox-group',
  'neo-date-picker',
  'neo-textarea',
  'neo-search-bar',
  'neo-upload',
  'neo-action-sheet',
  'neo-tag-input',
  'neo-rate',
  'neo-timeline',
  'neo-collapse',
  'neo-prompt-card',
  'neo-form-group',
  'neo-empty-search',
  'neo-segmented',
  'neo-filter-chips',
  'neo-breadcrumb',
  'neo-cell',
  'neo-avatar',
  'neo-avatar-group',
  'neo-price-tag',
  'neo-coupon-card',
  'neo-fab',
  'neo-toolbar',
  'neo-chat-shortcut',
  'neo-reaction-bar',
  'neo-calendar-strip',
  'neo-badge-wall'
])

const advancedKeywords = [
  '看板',
  '矩阵',
  '路线图',
  '工作区',
  '发布',
  '里程碑',
  '排期',
  '结算',
  '物流',
  '风险',
  '营收',
  '洞察',
  '工单',
  '审计',
  '动态流',
  '能力',
  '培训',
  '客户健康',
  '留存',
  '漏斗',
  '仓库',
  '库存',
  '配送',
  '税务',
  '活动',
  '线索',
  '客服',
  '排队',
  '路线'
]

export function getCustomComponentLevel(path: string): CustomComponentLevel {
  if (basicComponentPaths.has(path)) {
    return 'basic'
  }

  const component = findCustomComponent(path)
  const content = `${component.title} ${component.summary} ${component.tags.join(' ')}`

  if (advancedKeywords.some(keyword => content.includes(keyword))) {
    return 'advanced'
  }

  return 'intermediate'
}

export function getCustomComponentLevelLabel(path: string) {
  const level = getCustomComponentLevel(path)
  if (level === 'basic') return '基础'
  if (level === 'advanced') return '高级'
  return '中级'
}
