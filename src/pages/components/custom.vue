<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import NeoMetricBoard from '@/components/neo/NeoMetricBoard.vue'
import NeoPill from '@/components/neo/NeoPill.vue'
import NeoProfileSpotlight from '@/components/neo/NeoProfileSpotlight.vue'
import NeoTaskCluster from '@/components/neo/NeoTaskCluster.vue'
import { customComponents, findCustomComponent, getCustomComponentCode, getCustomComponentScenes } from '@/utils/customComponents'

const currentPath = ref(customComponents[0].path)

const currentComponent = computed(() => findCustomComponent(currentPath.value))
const currentCode = computed(() => getCustomComponentCode(currentPath.value))
const currentScenes = computed(() => getCustomComponentScenes(currentPath.value))

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

onLoad((query) => {
  if (typeof query?.path === 'string') {
    currentPath.value = decodeURIComponent(query.path)
  }
})

function selectComponent(path: string) {
  currentPath.value = path
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

      <view class="selector-card">
        <view class="section-title">组件切换</view>
        <scroll-view scroll-x class="selector-scroll">
          <view class="selector-row">
            <view
              v-for="item in customComponents"
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
          </view>
        </view>

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
          v-else
          name="林知夏"
          role="华东区域采购负责人"
          status="重点客户"
          company="澄星科技"
          phone="138****5566"
          email="linzhixia@example.com"
          :stats="profileStats"
          :records="profileRecords"
        />
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
.info-card {
  padding: 28rpx;
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
