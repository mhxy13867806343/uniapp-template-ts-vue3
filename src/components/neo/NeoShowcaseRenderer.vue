<script setup lang="ts">
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
import NeoProfileSpotlight from '@/components/neo/NeoProfileSpotlight.vue'
import NeoRadioGroup from '@/components/neo/NeoRadioGroup.vue'
import NeoRate from '@/components/neo/NeoRate.vue'
import NeoSearchBar from '@/components/neo/NeoSearchBar.vue'
import NeoSkeleton from '@/components/neo/NeoSkeleton.vue'
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

const props = withDefaults(defineProps<{
  path: string
  compact?: boolean
}>(), {
  compact: false
})

const isCompact = computed(() => props.compact)
const extraDemo = computed(() => neoExtraDemoMap[props.path])

const fieldValue = ref('林知夏')
const activeTab = ref('all')
const dropdownValue = ref('all')
const stepperValue = ref(2)
const switchValue = ref(true)
const radioValue = ref('pro')
const checkboxValues = ref(['sms'])
const dateValue = ref('2026-07-15')
const textareaValue = ref('这里是补充说明示意。')
const searchValue = ref('澄星科技')
const uploadFiles = ref([
  { name: '合同附件.pdf', size: '1.2MB', status: '已上传' }
])
const tagValues = ref(['高意向', '已跟进'])
const rateValue = ref(4)
const openedPanels = ref(['base'])
const dialogVisible = ref(!props.compact)
const actionSheetVisible = ref(!props.compact)

const boardMetrics = [
  { label: '成交额', value: '¥28,600', meta: '+12%' },
  { label: '新增', value: '36', meta: '+8%' },
  { label: '待办', value: '14', meta: '今日' },
  { label: '回款', value: '78%', meta: '本周' }
]

const boardActions = [
  { label: '新建任务', detail: '快速创建' },
  { label: '查看报表', detail: '数据复盘' }
]

const boardChannels = [
  { name: 'H5', percent: 92 },
  { name: '小程序', percent: 86 }
]

const taskItems = [
  { id: 1, title: '退款待审批', owner: '王敏', deadline: '30 分钟内', level: '紧急' },
  { id: 2, title: '配置校验', owner: '运营组', deadline: '18:00', level: '普通' }
]

const profileStats = [
  { label: '成交', value: '12 单' },
  { label: '沟通', value: '28 次' },
  { label: '最近', value: '昨天' }
]

const profileRecords = [
  '07-08 已确认采购预算。',
  '07-06 已补充开票信息。'
]

const tabItems = [
  { label: '全部', value: 'all', badge: '12' },
  { label: '待处理', value: 'todo', badge: '3' },
  { label: '已完成', value: 'done' }
]

const dropdownItems = [
  { label: '全部状态', value: 'all' },
  { label: '待处理', value: 'todo' },
  { label: '已完成', value: 'done' }
]

const radioItems = [
  { label: '标准版', value: 'standard', description: '适合常规页面。' },
  { label: '专业版', value: 'pro', description: '适合复杂业务。' }
]

const checkboxItems = [
  { label: '短信提醒', value: 'sms', description: '关键节点触达。' },
  { label: '邮件同步', value: 'mail', description: '同步审批结果。' }
]

const timelineItems = [
  { title: '提交申请', time: '09:20', description: '系统已接收资料。', status: 'done' as const },
  { title: '主管审批', time: '10:10', description: '正在等待确认。', status: 'active' as const }
]

const collapseItems = [
  { title: '基础信息', name: 'base', content: '这里放基础说明内容。', meta: '推荐先展开' },
  { title: '权限说明', name: 'permission', content: '这里放权限说明。', meta: '2 条说明' }
]

const actionSheetItems = [
  { label: '分享给同事', value: 'share', description: '快速转发。' },
  { label: '复制链接', value: 'copy', description: '复制当前链接。' }
]
</script>

<template>
  <view :class="['showcase-renderer', { 'showcase-renderer--compact': compact }]">
    <NeoMetricBoard
      v-if="path === 'neo-metric-board'"
      title="周经营总览"
      subtitle="快速看到关键数据"
      status-label="本周稳定"
      :metrics="boardMetrics"
      :actions="boardActions"
      :channels="boardChannels"
    />

    <NeoTaskCluster
      v-else-if="path === 'neo-task-cluster'"
      title="今日待处理"
      subtitle="审批、工单和催办场景"
      summary-label="2 条高优事项"
      completion-value="完成率 68%"
      completion-hint="还有 1 条事项需要闭环"
      :tasks="taskItems"
      primary-action="立即处理"
      secondary-action="稍后提醒"
    />

    <NeoProfileSpotlight
      v-else-if="path === 'neo-profile-spotlight'"
      name="林知夏"
      role="华东区域采购负责人"
      status="重点客户"
      company="澄星科技"
      phone="138****5566"
      email="linzhixia@example.com"
      :stats="profileStats"
      :records="profileRecords"
    />

    <view v-else-if="path === 'neo-button'" class="preview-stack">
      <view class="preview-row">
        <NeoButton label="立即创建" />
        <NeoButton label="保存草稿" variant="secondary" />
      </view>
    </view>

    <view v-else-if="path === 'neo-field'" class="preview-stack">
      <NeoField
        v-model="fieldValue"
        label="客户姓名"
        placeholder="请输入客户姓名"
        hint="必填"
      />
    </view>

    <view v-else-if="path === 'neo-notice-strip'" class="preview-stack">
      <NeoNoticeStrip
        title="版本更新提醒"
        message="当前页面有新版本可用。"
        action-label="立即刷新"
      />
    </view>

    <NeoEmptyState
      v-else-if="path === 'neo-empty-state'"
      title="暂无待处理任务"
      description="当前筛选条件下还没有内容。"
      action-label="新建任务"
    />

    <NeoCard
      v-else-if="path === 'neo-card'"
      title="本周复盘"
      subtitle="整理经营数据和待办风险"
      meta="7 条更新"
      tone="brand"
    >
      <view class="mini-lines">
        <view class="mini-lines__item">1. 留资率提升 11%</view>
        <view class="mini-lines__item">2. 支付成功率 98.2%</view>
      </view>
    </NeoCard>

    <view v-else-if="path === 'neo-badge'" class="preview-row">
      <NeoBadge value="8" />
      <NeoBadge value="NEW" tone="danger" />
      <NeoBadge dot tone="success" />
    </view>

    <NeoTabs
      v-else-if="path === 'neo-tabs'"
      v-model="activeTab"
      :items="tabItems"
    />

    <view v-else-if="path === 'neo-dialog'" class="preview-stack">
      <NeoCard
        v-if="isCompact"
        title="弹窗预览"
        subtitle="点击后可弹出确认层"
        meta="弹窗"
      />
      <NeoDialog
        v-else
        v-model="dialogVisible"
        title="确认发布吗？"
        description="发布后将同步到多个端。"
        primary-label="确认发布"
        secondary-label="再看看"
      />
    </view>

    <view v-else-if="path === 'neo-toast'" class="preview-stack">
      <NeoToast message="保存成功" tone="success" />
      <NeoToast v-if="!isCompact" message="请先完善必填项" tone="warning" />
    </view>

    <NeoDropdown
      v-else-if="path === 'neo-dropdown'"
      v-model="dropdownValue"
      label="全部状态"
      :items="dropdownItems"
    />

    <NeoStepper
      v-else-if="path === 'neo-stepper'"
      v-model="stepperValue"
      :min="1"
      :max="10"
    />

    <NeoSkeleton
      v-else-if="path === 'neo-skeleton'"
      :rows="isCompact ? 2 : 4"
      :show-avatar="!isCompact"
    />

    <NeoSwitch
      v-else-if="path === 'neo-switch'"
      v-model="switchValue"
      label="消息通知"
      description="开启后同步发送提醒。"
    />

    <NeoRadioGroup
      v-else-if="path === 'neo-radio-group'"
      v-model="radioValue"
      :items="radioItems"
    />

    <NeoCheckboxGroup
      v-else-if="path === 'neo-checkbox-group'"
      v-model="checkboxValues"
      :items="checkboxItems"
    />

    <NeoDatePicker
      v-else-if="path === 'neo-date-picker'"
      v-model="dateValue"
      label="预约日期"
      start="2024-01-01"
      end="2030-12-31"
    />

    <NeoTextarea
      v-else-if="path === 'neo-textarea'"
      v-model="textareaValue"
      label="备注信息"
      placeholder="请输入补充说明"
      :maxlength="200"
    />

    <NeoSearchBar
      v-else-if="path === 'neo-search-bar'"
      v-model="searchValue"
      placeholder="搜索客户名称或手机号"
      action-label="查询"
    />

    <NeoUpload
      v-else-if="path === 'neo-upload'"
      :files="uploadFiles"
      title="合同附件"
      description="支持 PDF、PNG、JPG 格式"
      add-label="添加附件"
    />

    <view v-else-if="path === 'neo-action-sheet'" class="preview-stack">
      <NeoCard
        v-if="isCompact"
        title="动作面板"
        subtitle="底部弹出操作集合"
        meta="Sheet"
      />
      <NeoActionSheet
        v-else
        v-model="actionSheetVisible"
        title="选择操作"
        description="根据当前内容选择下一步动作"
        :actions="actionSheetItems"
      />
    </view>

    <NeoTagInput
      v-else-if="path === 'neo-tag-input'"
      v-model="tagValues"
      label="关键词标签"
      placeholder="输入标签后点击添加"
      add-label="添加"
    />

    <NeoRate
      v-else-if="path === 'neo-rate'"
      v-model="rateValue"
      label="服务评分"
      hint="点击星星完成打分"
    />

    <NeoTimeline
      v-else-if="path === 'neo-timeline'"
      :items="timelineItems"
    />

    <NeoCollapse
      v-else-if="path === 'neo-collapse'"
      v-model="openedPanels"
      :items="collapseItems"
    />

    <component
      :is="extraDemo.component"
      v-else-if="extraDemo"
      v-bind="extraDemo.props || {}"
    />

    <NeoCard
      v-else
      title="预览准备中"
      subtitle="这个组件已经加入清单，预览位可以继续补细节。"
      meta="Preview"
    />
  </view>
</template>

<style lang="scss" scoped>
.showcase-renderer {
  width: 100%;
}

.showcase-renderer--compact {
  overflow: hidden;
  max-height: 420rpx;
}

.preview-stack {
  display: grid;
  gap: 14rpx;
}

.preview-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.mini-lines {
  display: grid;
  gap: 10rpx;
}

.mini-lines__item {
  color: #5f6b7a;
  font-size: 22rpx;
  line-height: 1.6;
}
</style>
