<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import NeoActionSheet from '@/components/neo/NeoActionSheet.vue'
import NeoBadge from '@/components/neo/NeoBadge.vue'
import NeoButton from '@/components/neo/NeoButton.vue'
import NeoCard from '@/components/neo/NeoCard.vue'
import NeoCheckboxGroup from '@/components/neo/NeoCheckboxGroup.vue'
import NeoCollapse from '@/components/neo/NeoCollapse.vue'
import NeoDatePicker from '@/components/neo/NeoDatePicker.vue'
import NeoDialog from '@/components/neo/NeoDialog.vue'
import NeoDropdown from '@/components/neo/NeoDropdown.vue'
import NeoEmptyState from '@/components/neo/NeoEmptyState.vue'
import NeoField from '@/components/neo/NeoField.vue'
import NeoMetricBoard from '@/components/neo/NeoMetricBoard.vue'
import NeoNoticeStrip from '@/components/neo/NeoNoticeStrip.vue'
import NeoPill from '@/components/neo/NeoPill.vue'
import NeoProfileSpotlight from '@/components/neo/NeoProfileSpotlight.vue'
import NeoRadioGroup from '@/components/neo/NeoRadioGroup.vue'
import NeoRate from '@/components/neo/NeoRate.vue'
import NeoSearchBar from '@/components/neo/NeoSearchBar.vue'
import NeoSkeleton from '@/components/neo/NeoSkeleton.vue'
import NeoShowcaseRenderer from '@/components/neo/NeoShowcaseRenderer.vue'
import NeoStepper from '@/components/neo/NeoStepper.vue'
import NeoSwitch from '@/components/neo/NeoSwitch.vue'
import NeoTagInput from '@/components/neo/NeoTagInput.vue'
import NeoTaskCluster from '@/components/neo/NeoTaskCluster.vue'
import NeoTabs from '@/components/neo/NeoTabs.vue'
import NeoTextarea from '@/components/neo/NeoTextarea.vue'
import NeoTimeline from '@/components/neo/NeoTimeline.vue'
import NeoToast from '@/components/neo/NeoToast.vue'
import NeoUpload from '@/components/neo/NeoUpload.vue'
import { neoExtraDemoMap } from '@/components/neo/extra-library'
import { customComponents, findCustomComponent, getCustomComponentCode, getCustomComponentLevel, getCustomComponentLevelLabel, getCustomComponentScenes } from '@/utils/customComponents'

const currentPath = ref(customComponents[0].path)
const activeLevel = ref<'all' | 'basic' | 'intermediate' | 'advanced'>('all')

const currentComponent = computed(() => findCustomComponent(currentPath.value))
const currentCode = computed(() => getCustomComponentCode(currentPath.value))
const currentScenes = computed(() => getCustomComponentScenes(currentPath.value))
const extraDemo = computed(() => neoExtraDemoMap[currentPath.value])
const currentLevelLabel = computed(() => getCustomComponentLevelLabel(currentPath.value))

const levelTabs = [
  { value: 'all', label: '全部', desc: '查看全部第三方组件示例。' },
  { value: 'basic', label: '基础', desc: '输入、反馈、容器、轻交互等基础件。' },
  { value: 'intermediate', label: '中级', desc: '信息组合、摘要卡片、流程和业务组合件。' },
  { value: 'advanced', label: '高级', desc: '看板、工作台、策略、履约和经营类复杂组件。' }
] as const

const levelCounts = computed(() => ({
  basic: customComponents.filter(item => getCustomComponentLevel(item.path) === 'basic').length,
  intermediate: customComponents.filter(item => getCustomComponentLevel(item.path) === 'intermediate').length,
  advanced: customComponents.filter(item => getCustomComponentLevel(item.path) === 'advanced').length
}))

const filteredComponents = computed(() => {
  if (activeLevel.value === 'all') {
    return customComponents
  }

  return customComponents.filter(item => getCustomComponentLevel(item.path) === activeLevel.value)
})

const sameLevelExamples = computed(() => {
  const currentLevel = getCustomComponentLevel(currentPath.value)
  return customComponents
    .filter(item => getCustomComponentLevel(item.path) === currentLevel && item.path !== currentPath.value)
    .slice(0, 12)
})

const boardMetrics = [
  { label: '今日成交', value: '¥28,600', meta: '+12%' },
  { label: '新增客户', value: '36', meta: '+8%' },
  { label: '待跟进', value: '14', meta: '-3%' },
  { label: '回款进度', value: '78%', meta: '本周目标' }
]

const boardActions = [
  { label: '新建任务', detail: '创建今日跟进单' },
  { label: '查看报表', detail: '进入经营日报' },
  { label: '客户分层', detail: '同步线索标签' }
]

const boardChannels = [
  { name: 'H5', percent: 92 },
  { name: '微信', percent: 86 },
  { name: 'App', percent: 71 }
]

const taskItems = [
  { id: 1, title: '退款申请待审批', owner: '王敏', deadline: '30 分钟内', level: '紧急' },
  { id: 2, title: '活动页面配置校验', owner: '运营组', deadline: '今天 18:00', level: '普通' },
  { id: 3, title: '用户投诉回访', owner: '客服组', deadline: '明天 10:00', level: '重点' }
]

const profileStats = [
  { label: '累计成交', value: '12 单' },
  { label: '沟通次数', value: '28 次' },
  { label: '最近到访', value: '昨天' }
]

const profileRecords = [
  '07-08 已确认三季度采购预算，倾向标准版。',
  '07-06 补充了合同抬头和开票信息。',
  '07-03 首次演示后，对移动端审批体验反馈较好。'
]

const fieldForm = reactive({
  name: '林知夏',
  phone: '13800138000'
})

const activeTab = ref('all')
const dialogVisible = ref(true)
const dialogActionText = ref('最近一次操作：未触发')
const dropdownValue = ref('all')
const stepperValue = ref(2)
const switchValue = ref(true)
const radioValue = ref('pro')
const checkboxValues = ref(['sms', 'mail'])
const dateValue = ref('2026-07-15')
const textareaValue = ref('今天已经完成和客户的二次沟通，确认下周四进入方案评审。')
const searchValue = ref('澄星科技')
const searchResultText = ref('最近一次搜索：澄星科技')
const uploadFiles = ref([
  { name: '报价单-v3.pdf', size: '1.8MB', status: '已上传' },
  { name: '合同补充说明.png', size: '860KB', status: '待审核' }
])
const actionSheetVisible = ref(true)
const actionSheetResult = ref('最近一次操作：未选择')
const tagValues = ref(['高意向', '已回访'])
const rateValue = ref(4)
const openedPanels = ref(['base'])

const tabItems = [
  { label: '全部', value: 'all', badge: '12' },
  { label: '待处理', value: 'todo', badge: '3' },
  { label: '已完成', value: 'done' }
]

const dropdownItems = [
  { label: '全部状态', value: 'all' },
  { label: '待处理', value: 'todo' },
  { label: '进行中', value: 'doing' },
  { label: '已完成', value: 'done' }
]

const radioItems = [
  { label: '标准版', value: 'standard', description: '适合基础业务页面和常规配置。' },
  { label: '专业版', value: 'pro', description: '适合中后台、审批流和复杂表单。' },
  { label: '企业版', value: 'enterprise', description: '适合多角色、多组织的扩展场景。' }
]

const checkboxItems = [
  { label: '短信提醒', value: 'sms', description: '触发关键节点时发送短信通知。' },
  { label: '邮件同步', value: 'mail', description: '自动抄送日报和审批结果。' },
  { label: '日历写入', value: 'calendar', description: '将预约和排期自动同步到日历。' }
]

const actionSheetItems = [
  { label: '分享给同事', value: 'share', description: '通过企业微信或链接快速转发。' },
  { label: '复制链接', value: 'copy', description: '复制当前页面链接用于外部传递。' },
  { label: '删除记录', value: 'delete', description: '删除后不可恢复，请谨慎操作。', tone: 'danger' as const }
]

const timelineItems = [
  { title: '客户提交申请', time: '09:20', description: '系统已接收资料并开始校验。', status: 'done' as const },
  { title: '主管审批中', time: '10:10', description: '正在等待负责人确认预算范围。', status: 'active' as const },
  { title: '归档完成', time: '待处理', description: '审批通过后将自动进入归档节点。', status: 'pending' as const }
]

const collapseItems = [
  { title: '基础信息', name: 'base', content: '这里可以放客户名称、联系方式、组织信息等基础资料。', meta: '推荐先展开' },
  { title: '权限说明', name: 'permission', content: '这里可以放角色权限、数据范围和可见性说明。', meta: '2 条说明' },
  { title: '补充备注', name: 'remark', content: '这里可以放业务备注、风险提示和后续跟进建议。', meta: '可选阅读' }
]

onLoad((query) => {
  if (typeof query?.path === 'string') {
    currentPath.value = decodeURIComponent(query.path)
  }
})

watch(currentPath, (value) => {
  if (activeLevel.value === 'all') {
    return
  }

  const level = getCustomComponentLevel(value)
  if (level !== activeLevel.value) {
    activeLevel.value = level
  }
})

function selectComponent(path: string) {
  currentPath.value = path
}

function selectLevel(level: 'all' | 'basic' | 'intermediate' | 'advanced') {
  activeLevel.value = level

  const nextList = level === 'all'
    ? customComponents
    : customComponents.filter(item => getCustomComponentLevel(item.path) === level)

  if (!nextList.some(item => item.path === currentPath.value) && nextList[0]) {
    currentPath.value = nextList[0].path
  }
}

function handleDialogPrimary() {
  dialogActionText.value = '最近一次操作：已点击确认发布'
}

function handleDialogSecondary() {
  dialogActionText.value = '最近一次操作：已点击再看看'
}

function handleSearch(value: string) {
  searchResultText.value = `最近一次搜索：${value || '空关键词'}`
}

function handleUploadAdd() {
  uploadFiles.value = [
    ...uploadFiles.value,
    {
      name: `新附件-${uploadFiles.value.length + 1}.pdf`,
      size: '1.2MB',
      status: '模拟上传'
    }
  ]
}

function handleUploadRemove(index: number) {
  uploadFiles.value = uploadFiles.value.filter((_, itemIndex) => itemIndex !== index)
}

function handleActionSelect(value: string) {
  actionSheetResult.value = `最近一次操作：${value}`
}
</script>

<template>
  <PageShell
    title="第三方组件"
    :description="`${currentComponent.title}，这是我们自己封装的本地组件，内部不依赖 Wot UI，也不会影响原来的组件库。`"
  >
    <view class="custom-page">
      <view class="intro-card">
        <view class="intro-kicker">Neo Components</view>
        <view class="intro-title">独立组件库预览</view>
        <view class="intro-desc">所有组件都放在 `src/components/neo`，命名和样式完全独立，适合继续往组件库方向扩展。</view>
      </view>

      <view class="level-card">
        <view class="section-title">示例分级</view>
        <view class="level-summary">
          <view class="level-summary__item">
            <view class="level-summary__value">{{ levelCounts.basic }}</view>
            <view class="level-summary__label">基础</view>
          </view>
          <view class="level-summary__item">
            <view class="level-summary__value">{{ levelCounts.intermediate }}</view>
            <view class="level-summary__label">中级</view>
          </view>
          <view class="level-summary__item">
            <view class="level-summary__value">{{ levelCounts.advanced }}</view>
            <view class="level-summary__label">高级</view>
          </view>
        </view>

        <view class="level-tab-row">
          <view
            v-for="tab in levelTabs"
            :key="tab.value"
            :class="['level-tab', { 'level-tab--active': activeLevel === tab.value }]"
            @click="selectLevel(tab.value)"
          >
            <view class="level-tab__title">{{ tab.label }}</view>
            <view class="level-tab__desc">{{ tab.desc }}</view>
          </view>
        </view>
      </view>

      <view class="example-card">
        <view class="example-card__head">
          <view>
            <view class="section-title">分级示例清单</view>
            <view class="example-card__desc">
              当前显示
              {{ activeLevel === 'all' ? '全部' : activeLevel === 'basic' ? '基础' : activeLevel === 'intermediate' ? '中级' : '高级' }}
              组件示例，点击任意卡片可切换到详细预览。
            </view>
          </view>
          <NeoPill :label="`${filteredComponents.length} 个示例`" />
        </view>

        <view class="example-grid">
          <view
            v-for="item in filteredComponents"
            :key="item.path"
            :class="['example-tile', { 'example-tile--active': item.path === currentPath }]"
            @click="selectComponent(item.path)"
          >
            <view class="example-tile__head">
              <view class="example-tile__title">{{ item.title }}</view>
              <view class="example-tile__level">{{ getCustomComponentLevelLabel(item.path) }}</view>
            </view>
            <view class="example-tile__preview">
              <NeoShowcaseRenderer
                :path="item.path"
                compact
              />
            </view>
            <view class="example-tile__summary">{{ item.summary }}</view>
            <view class="example-tile__tags">
              <text
                v-for="tag in item.tags.slice(0, 3)"
                :key="tag"
                class="example-tile__tag"
              >
                {{ tag }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <view class="selector-card">
        <view class="section-title">组件切换</view>
        <scroll-view scroll-x class="selector-scroll">
          <view class="selector-row">
            <view
              v-for="item in filteredComponents"
              :key="item.path"
              :class="['selector-chip', { 'selector-chip--active': item.path === currentPath }]"
              @click="selectComponent(item.path)"
            >
              <text class="selector-chip-name">{{ item.title }}</text>
              <text class="selector-chip-summary">{{ item.summary }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="demo-card">
        <view class="demo-head">
          <view>
            <view class="demo-title">{{ currentComponent.title }}</view>
            <view class="demo-summary">{{ currentComponent.summary }}</view>
          </view>
          <view class="demo-tags">
            <NeoPill
              v-for="tag in currentComponent.tags"
              :key="tag"
              :label="tag"
            />
            <NeoPill :label="`${currentLevelLabel} 示例`" />
          </view>
        </view>

        <view class="demo-preview-label">效果预览</view>

        <NeoMetricBoard
          v-if="currentPath === 'neo-metric-board'"
          title="周经营总览"
          subtitle="快速看到关键数据和多端交付进度"
          status-label="本周稳定"
          :metrics="boardMetrics"
          :actions="boardActions"
          :channels="boardChannels"
        />

        <NeoTaskCluster
          v-else-if="currentPath === 'neo-task-cluster'"
          title="今日待处理"
          subtitle="适合审批、工单和运营催办场景"
          summary-label="3 条高优事项"
          completion-value="完成率 68%"
          completion-hint="还有 2 条事项需要今天闭环"
          :tasks="taskItems"
          primary-action="立即处理"
          secondary-action="稍后提醒"
        />

        <NeoProfileSpotlight
          v-else-if="currentPath === 'neo-profile-spotlight'"
          name="林知夏"
          role="华东区域采购负责人"
          status="重点客户"
          company="澄星科技"
          phone="138****5566"
          email="linzhixia@example.com"
          :stats="profileStats"
          :records="profileRecords"
        />

        <view v-else-if="currentPath === 'neo-button'" class="stack-demo">
          <view class="button-row">
            <NeoButton label="立即创建" />
            <NeoButton label="保存草稿" variant="secondary" />
          </view>
          <view class="button-row">
            <NeoButton label="查看更多" variant="ghost" size="sm" />
            <NeoButton label="禁用状态" variant="secondary" :disabled="true" />
          </view>
          <NeoButton label="整行提交按钮" block />
        </view>

        <view v-else-if="currentPath === 'neo-field'" class="stack-demo">
          <view class="field-card">
            <NeoField
              v-model="fieldForm.name"
              label="客户姓名"
              placeholder="请输入客户姓名"
              hint="必填"
            />
            <NeoField
              v-model="fieldForm.phone"
              label="联系电话"
              placeholder="请输入手机号"
              type="number"
            />
          </view>
          <view class="form-preview">
            <view class="form-preview__title">当前输入值</view>
            <view class="form-preview__line">姓名：{{ fieldForm.name }}</view>
            <view class="form-preview__line">电话：{{ fieldForm.phone }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-notice-strip'" class="stack-demo">
          <NeoNoticeStrip
            title="版本更新提醒"
            message="当前页面有新版本可用，建议刷新后继续操作。"
            action-label="立即刷新"
          />
          <NeoNoticeStrip
            title="风险提示"
            message="当前客户资料尚未完成实名认证，部分能力暂不可用。"
            tone="warning"
          />
        </view>

        <NeoEmptyState
          v-else-if="currentPath === 'neo-empty-state'"
          title="暂无待处理任务"
          description="当前筛选条件下还没有内容，可以切换筛选条件或创建新任务。"
          action-label="新建任务"
        />

        <view v-else-if="currentPath === 'neo-card'" class="stack-demo">
          <NeoCard
            title="本周复盘"
            subtitle="整理经营数据、客户反馈和待办风险"
            meta="7 条更新"
            tone="brand"
          >
            <view class="card-summary">
              <view class="card-summary__line">1. 客户留资率较上周提升 11%</view>
              <view class="card-summary__line">2. 小程序端支付成功率保持 98.2%</view>
              <view class="card-summary__line">3. 还有 2 个高优工单待跟进</view>
            </view>
          </NeoCard>
        </view>

        <view v-else-if="currentPath === 'neo-badge'" class="stack-demo">
          <view class="badge-row">
            <NeoBadge value="8" />
            <NeoBadge value="NEW" tone="danger" />
            <NeoBadge dot tone="success" />
          </view>
          <view class="badge-card">
            <text class="badge-card__title">消息中心</text>
            <NeoBadge value="24" tone="danger" />
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-tabs'" class="stack-demo">
          <NeoTabs
            v-model="activeTab"
            :items="tabItems"
          />
          <NeoCard
            :title="activeTab === 'all' ? '全部任务' : activeTab === 'todo' ? '待处理任务' : '已完成任务'"
            subtitle="标签切换已联动当前面板"
          >
            <view class="tab-panel-text">当前选中：{{ activeTab }}</view>
          </NeoCard>
        </view>

        <view v-else-if="currentPath === 'neo-dialog'" class="stack-demo">
          <view class="button-row">
            <NeoButton
              label="重新打开弹窗"
              variant="secondary"
              @click="dialogVisible = true"
            />
          </view>
          <NeoDialog
            v-model="dialogVisible"
            title="确认发布吗？"
            description="发布后将同步到多个端，建议先检查文案与配置。"
            primary-label="确认发布"
            secondary-label="再看看"
            @primary="handleDialogPrimary"
            @secondary="handleDialogSecondary"
          />
          <view class="form-preview">
            <view class="form-preview__title">弹窗状态</view>
            <view class="form-preview__line">{{ dialogActionText }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-toast'" class="stack-demo">
          <NeoToast message="保存成功" tone="success" />
          <NeoToast message="已切换到测试环境" />
          <NeoToast message="请先完善必填项" tone="warning" />
        </view>

        <view v-else-if="currentPath === 'neo-dropdown'" class="stack-demo">
          <NeoDropdown
            v-model="dropdownValue"
            label="全部状态"
            :items="dropdownItems"
          />
          <view class="form-preview">
            <view class="form-preview__title">当前选项</view>
            <view class="form-preview__line">{{ dropdownValue }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-stepper'" class="stack-demo">
          <view class="button-row">
            <NeoStepper
              v-model="stepperValue"
              :min="1"
              :max="10"
            />
          </view>
          <view class="form-preview">
            <view class="form-preview__title">当前数量</view>
            <view class="form-preview__line">{{ stepperValue }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-skeleton'" class="stack-demo">
          <NeoSkeleton :rows="4" show-avatar />
          <NeoSkeleton :rows="3" />
        </view>

        <view v-else-if="currentPath === 'neo-switch'" class="stack-demo">
          <NeoSwitch
            v-model="switchValue"
            label="消息通知"
            description="开启后，系统会同步发送审批和异常提醒。"
          />
          <view class="form-preview">
            <view class="form-preview__title">当前状态</view>
            <view class="form-preview__line">{{ switchValue ? '已开启' : '已关闭' }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-radio-group'" class="stack-demo">
          <NeoRadioGroup
            v-model="radioValue"
            :items="radioItems"
          />
          <view class="form-preview">
            <view class="form-preview__title">当前方案</view>
            <view class="form-preview__line">{{ radioValue }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-checkbox-group'" class="stack-demo">
          <NeoCheckboxGroup
            v-model="checkboxValues"
            :items="checkboxItems"
          />
          <view class="form-preview">
            <view class="form-preview__title">当前已选</view>
            <view class="form-preview__line">{{ checkboxValues.join('、') || '未选择' }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-date-picker'" class="stack-demo">
          <NeoDatePicker
            v-model="dateValue"
            label="预约日期"
            start="2024-01-01"
            end="2030-12-31"
          />
          <view class="form-preview">
            <view class="form-preview__title">当前日期</view>
            <view class="form-preview__line">{{ dateValue || '未选择' }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-textarea'" class="stack-demo">
          <NeoTextarea
            v-model="textareaValue"
            label="备注信息"
            placeholder="请输入补充说明"
            :maxlength="200"
          />
          <view class="form-preview">
            <view class="form-preview__title">当前内容</view>
            <view class="form-preview__line">{{ textareaValue || '暂无内容' }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-search-bar'" class="stack-demo">
          <NeoSearchBar
            v-model="searchValue"
            placeholder="搜索客户名称或手机号"
            action-label="查询"
            @search="handleSearch"
          />
          <view class="form-preview">
            <view class="form-preview__title">搜索反馈</view>
            <view class="form-preview__line">{{ searchResultText }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-upload'" class="stack-demo">
          <NeoUpload
            :files="uploadFiles"
            title="合同附件"
            description="支持 PDF、PNG、JPG 格式"
            add-label="添加附件"
            @add="handleUploadAdd"
            @remove="handleUploadRemove"
          />
          <view class="form-preview">
            <view class="form-preview__title">当前附件数</view>
            <view class="form-preview__line">{{ uploadFiles.length }} 个</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-action-sheet'" class="stack-demo">
          <view class="button-row">
            <NeoButton
              label="重新打开动作面板"
              variant="secondary"
              @click="actionSheetVisible = true"
            />
          </view>
          <NeoActionSheet
            v-model="actionSheetVisible"
            title="选择操作"
            description="根据当前内容选择下一步动作"
            :actions="actionSheetItems"
            @select="handleActionSelect"
          />
          <view class="form-preview">
            <view class="form-preview__title">动作结果</view>
            <view class="form-preview__line">{{ actionSheetResult }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-tag-input'" class="stack-demo">
          <NeoTagInput
            v-model="tagValues"
            label="关键词标签"
            placeholder="输入标签后点击添加"
            add-label="添加"
          />
          <view class="form-preview">
            <view class="form-preview__title">当前标签</view>
            <view class="form-preview__line">{{ tagValues.join('、') || '暂无标签' }}</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-rate'" class="stack-demo">
          <NeoRate
            v-model="rateValue"
            label="服务评分"
            hint="点击星星完成打分"
          />
          <view class="form-preview">
            <view class="form-preview__title">当前评分</view>
            <view class="form-preview__line">{{ rateValue }} 星</view>
          </view>
        </view>

        <view v-else-if="currentPath === 'neo-timeline'" class="stack-demo">
          <NeoTimeline :items="timelineItems" />
        </view>

        <view v-else-if="currentPath === 'neo-collapse'" class="stack-demo">
          <NeoCollapse
            v-model="openedPanels"
            :items="collapseItems"
          />
          <view class="form-preview">
            <view class="form-preview__title">当前展开</view>
            <view class="form-preview__line">{{ openedPanels.join('、') || '未展开' }}</view>
          </view>
        </view>

        <component
          :is="extraDemo.component"
          v-else-if="extraDemo"
          v-bind="extraDemo.props || {}"
        />

        <view v-else class="form-preview">
          <view class="form-preview__title">组件预览暂未配置</view>
          <view class="form-preview__line">这个组件已经加入组件清单，但当前页面还没有单独的交互演示。</view>
        </view>
      </view>

      <view
        v-if="sameLevelExamples.length"
        class="info-card"
      >
        <view class="section-title">同级更多示例</view>
        <view class="related-grid">
          <view
            v-for="item in sameLevelExamples"
            :key="item.path"
            class="related-card"
            @click="selectComponent(item.path)"
          >
            <view class="related-card__title">{{ item.title }}</view>
            <view class="related-card__summary">{{ item.summary }}</view>
          </view>
        </view>
      </view>

      <view class="info-card">
        <view class="section-title">适用场景</view>
        <view class="scene-list">
          <view
            v-for="scene in currentScenes"
            :key="scene"
            class="scene-item"
          >
            <view class="scene-dot" />
            <text>{{ scene }}</text>
          </view>
        </view>
      </view>

      <view class="info-card">
        <view class="section-title">使用代码</view>
        <view class="code-box">
          <text>{{ currentCode }}</text>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.custom-page {
  display: grid;
  gap: 24rpx;
}

.intro-card,
.level-card,
.example-card,
.selector-card,
.demo-card,
.info-card {
  overflow: hidden;
  border: 1rpx solid #dde4ef;
  border-radius: 22rpx;
  background: #fff;
}

.intro-card {
  background:
    radial-gradient(circle at top left, rgba(56, 110, 255, 0.12), transparent 36%),
    linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%);
  padding: 30rpx;
}

.intro-kicker {
  color: #2b5fe0;
  font-size: 22rpx;
  font-weight: 800;
  letter-spacing: 2rpx;
  text-transform: uppercase;
}

.intro-title,
.section-title,
.demo-title {
  color: #182235;
  font-size: 32rpx;
  font-weight: 800;
}

.intro-title {
  margin-top: 12rpx;
}

.intro-desc,
.demo-summary {
  margin-top: 12rpx;
  color: #6a7485;
  font-size: 25rpx;
  line-height: 1.7;
}

.selector-card,
.level-card,
.example-card,
.info-card {
  padding: 28rpx;
}

.level-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
  margin-top: 20rpx;
}

.level-summary__item {
  border-radius: 18rpx;
  background: #f7f9fc;
  padding: 22rpx 18rpx;
}

.level-summary__value {
  color: #182235;
  font-size: 34rpx;
  font-weight: 800;
}

.level-summary__label {
  margin-top: 8rpx;
  color: #6a7485;
  font-size: 23rpx;
}

.level-tab-row {
  display: grid;
  gap: 14rpx;
  margin-top: 20rpx;
}

.level-tab {
  border: 1rpx solid #e4e9f3;
  border-radius: 18rpx;
  background: #fff;
  padding: 22rpx;
}

.level-tab--active {
  border-color: #8fb0ff;
  background:
    radial-gradient(circle at top left, rgba(82, 121, 255, 0.12), transparent 46%),
    #f4f8ff;
  box-shadow: 0 16rpx 40rpx rgba(61, 95, 192, 0.08);
}

.level-tab__title {
  color: #182235;
  font-size: 28rpx;
  font-weight: 800;
}

.level-tab__desc,
.example-card__desc {
  margin-top: 10rpx;
  color: #6a7485;
  font-size: 24rpx;
  line-height: 1.7;
}

.example-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
}

.example-grid,
.related-grid {
  display: grid;
  gap: 16rpx;
  margin-top: 20rpx;
}

.example-tile,
.related-card {
  border: 1rpx solid #e4e9f3;
  border-radius: 18rpx;
  background: #fff;
  padding: 22rpx;
}

.example-tile--active {
  border-color: #8fb0ff;
  background:
    radial-gradient(circle at top left, rgba(82, 121, 255, 0.12), transparent 46%),
    #f4f8ff;
}

.example-tile__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14rpx;
}

.example-tile__title,
.related-card__title {
  color: #182235;
  font-size: 27rpx;
  font-weight: 800;
}

.example-tile__level {
  flex-shrink: 0;
  border-radius: 999rpx;
  background: #edf3ff;
  padding: 8rpx 14rpx;
  color: #426cff;
  font-size: 20rpx;
  font-weight: 700;
}

.example-tile__summary,
.related-card__summary {
  margin-top: 10rpx;
  color: #6a7485;
  font-size: 23rpx;
  line-height: 1.65;
}

.example-tile__preview {
  overflow: hidden;
  margin-top: 14rpx;
  border: 1rpx solid #edf1f6;
  border-radius: 16rpx;
  background:
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 16rpx;
}

.example-tile__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 14rpx;
}

.example-tile__tag {
  border-radius: 999rpx;
  background: #f2f5fa;
  padding: 8rpx 14rpx;
  color: #607083;
  font-size: 20rpx;
}

.selector-scroll {
  width: 100%;
  margin-top: 20rpx;
  white-space: nowrap;
}

.selector-row {
  display: inline-flex;
  gap: 16rpx;
  padding-right: 8rpx;
}

.selector-chip {
  display: inline-flex;
  flex-direction: column;
  gap: 8rpx;
  width: 336rpx;
  border: 1rpx solid #e4e9f3;
  border-radius: 18rpx;
  background: #f7f9fc;
  padding: 22rpx;
  white-space: normal;
}

.selector-chip--active {
  border-color: #8fb0ff;
  background:
    radial-gradient(circle at top left, rgba(82, 121, 255, 0.12), transparent 46%),
    #f4f8ff;
  box-shadow: 0 16rpx 40rpx rgba(61, 95, 192, 0.08);
}

.selector-chip-name {
  color: #182235;
  font-size: 28rpx;
  font-weight: 700;
}

.selector-chip-summary {
  color: #6a7485;
  font-size: 24rpx;
  line-height: 1.65;
}

.demo-card {
  padding: 28rpx;
}

.demo-preview-label {
  margin: 24rpx 0 18rpx;
  color: #426cff;
  font-size: 22rpx;
  font-weight: 800;
  letter-spacing: 1rpx;
}

.demo-head {
  display: grid;
  gap: 18rpx;
  margin-bottom: 22rpx;
}

.demo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.stack-demo {
  display: grid;
  gap: 18rpx;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.badge-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.badge-card,
.card-summary,
.tab-panel-text {
  color: #1d2942;
  font-size: 25rpx;
}

.badge-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  border: 1rpx solid #e2e8f4;
  border-radius: 24rpx;
  background: #f8fafc;
  padding: 22rpx;
}

.badge-card__title {
  font-size: 26rpx;
  font-weight: 800;
}

.card-summary {
  display: grid;
  gap: 12rpx;
  line-height: 1.7;
}

.card-summary__line {
  color: #657289;
  font-size: 24rpx;
}

.tab-panel-text {
  color: #667088;
  line-height: 1.7;
}

.field-card,
.form-preview {
  border: 1rpx solid #e2e8f4;
  border-radius: 24rpx;
  background: #f8fafc;
  padding: 22rpx;
}

.field-card {
  display: grid;
  gap: 18rpx;
}

.form-preview__title {
  color: #1d2942;
  font-size: 26rpx;
  font-weight: 800;
}

.form-preview__line {
  margin-top: 10rpx;
  color: #6f7c91;
  font-size: 24rpx;
  line-height: 1.7;
}

.scene-list {
  display: grid;
  gap: 16rpx;
  margin-top: 20rpx;
}

.scene-item {
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: #182235;
  font-size: 25rpx;
}

.scene-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #4c78ff;
  box-shadow: 0 0 0 6rpx rgba(76, 120, 255, 0.12);
}

.code-box {
  margin-top: 20rpx;
  border-radius: 16rpx;
  background: #121827;
  padding: 24rpx;
  color: #e5e7eb;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 24rpx;
  line-height: 1.7;
  white-space: pre-wrap;
}
</style>
