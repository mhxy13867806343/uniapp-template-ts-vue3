<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import {
  customComponents,
  findCustomComponent,
  getCustomComponentCode,
  getCustomComponentScenes
} from '@/utils/customComponents'

const currentPath = ref(customComponents[0].path)

const currentComponent = computed(() => findCustomComponent(currentPath.value))
const currentCode = computed(() => getCustomComponentCode(currentPath.value))
const currentScenes = computed(() => getCustomComponentScenes(currentPath.value))

const boardMetrics = [
  { label: '今日成交', value: '¥28,600', trend: '+12%' },
  { label: '新增客户', value: '36', trend: '+8%' },
  { label: '待跟进', value: '14', trend: '-3%' },
  { label: '回款进度', value: '78%', trend: '本周目标' }
]

const boardActions = [
  { title: '新建任务', icon: 'app' },
  { title: '查看报表', icon: 'home' },
  { title: '客户分层', icon: 'user' }
]

const boardChannels = [
  { name: 'H5', progress: 92 },
  { name: '微信小程序', progress: 86 },
  { name: 'App', progress: 71 }
]

const taskItems = [
  { id: 1, title: '退款申请待审批', owner: '王敏', deadline: '30 分钟内', level: '紧急' },
  { id: 2, title: '活动页面配置校验', owner: '运营组', deadline: '今天 18:00', level: '普通' },
  { id: 3, title: '用户投诉回访', owner: '客服组', deadline: '明天 10:00', level: '重点' }
]

const contactStats = [
  { label: '累计成交', value: '12 单' },
  { label: '沟通次数', value: '28 次' },
  { label: '最近到访', value: '昨天' }
]

const contactRecords = [
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
    title="自定义的组件"
    :description="`${currentComponent.title}，基于现有 Wot UI 组合出来的业务模块，可以直接用，也方便继续改。`"
  >
    <view class="custom-page">
      <view class="selector-card">
        <view class="selector-title">组件切换</view>
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
            <wd-tag
              v-for="tag in currentComponent.tags"
              :key="tag"
              plain
            >
              {{ tag }}
            </wd-tag>
          </view>
        </view>

        <view v-if="currentPath === 'overview-board'" class="overview-board">
          <view class="board-top">
            <view>
              <view class="board-title">周经营总览</view>
              <view class="board-subtitle">快速看到关键数据和多端交付进度</view>
            </view>
            <wd-tag type="success">本周稳定</wd-tag>
          </view>

          <view class="metric-grid">
            <view
              v-for="metric in boardMetrics"
              :key="metric.label"
              class="metric-card"
            >
              <text class="metric-value">{{ metric.value }}</text>
              <text class="metric-label">{{ metric.label }}</text>
              <text class="metric-trend">{{ metric.trend }}</text>
            </view>
          </view>

          <view class="channel-card">
            <view class="mini-title">渠道进度</view>
            <view
              v-for="channel in boardChannels"
              :key="channel.name"
              class="channel-item"
            >
              <text class="channel-name">{{ channel.name }}</text>
              <view class="channel-progress">
                <wd-progress :percentage="channel.progress" />
              </view>
              <text class="channel-value">{{ channel.progress }}%</text>
            </view>
          </view>

          <view class="action-grid">
            <view
              v-for="action in boardActions"
              :key="action.title"
              class="action-card"
            >
              <wd-icon :name="action.icon" size="22px" />
              <text>{{ action.title }}</text>
            </view>
          </view>
        </view>

        <view v-else-if="currentPath === 'task-hub'" class="task-hub">
          <view class="task-top">
            <view>
              <view class="board-title">今日待处理</view>
              <view class="board-subtitle">适合审批、工单和运营催办场景</view>
            </view>
            <view class="task-badge">3 条高优事项</view>
          </view>

          <view class="task-list">
            <view
              v-for="task in taskItems"
              :key="task.id"
              class="task-item"
            >
              <view class="task-item-main">
                <view class="task-item-title">{{ task.title }}</view>
                <view class="task-item-meta">{{ task.owner }} · 截止 {{ task.deadline }}</view>
              </view>
              <view class="task-item-level">{{ task.level }}</view>
            </view>
          </view>

          <view class="task-footer">
            <view class="task-footer-info">
              <text class="task-footer-value">完成率 68%</text>
              <text class="task-footer-desc">还有 2 条事项需要今天闭环</text>
            </view>
            <view class="task-footer-actions">
              <wd-button size="small" type="warning">立即处理</wd-button>
              <wd-button size="small" plain>稍后提醒</wd-button>
            </view>
          </view>
        </view>

        <view v-else class="contact-sheet">
          <view class="profile-head">
            <wd-avatar size="56px">林</wd-avatar>
            <view class="profile-main">
              <view class="profile-name-row">
                <text class="profile-name">林知夏</text>
                <wd-tag type="primary">重点客户</wd-tag>
              </view>
              <view class="profile-role">华东区域采购负责人 · 最近跟进中</view>
            </view>
          </view>

          <view class="profile-stats">
            <view
              v-for="item in contactStats"
              :key="item.label"
              class="profile-stat"
            >
              <text class="profile-stat-value">{{ item.value }}</text>
              <text class="profile-stat-label">{{ item.label }}</text>
            </view>
          </view>

          <wd-cell-group border>
            <wd-cell title="手机号" value="138****5566" />
            <wd-cell title="邮箱" value="linzhixia@example.com" />
            <wd-cell title="所属公司" value="澄星科技" />
          </wd-cell-group>

          <view class="record-card">
            <view class="mini-title">最近跟进</view>
            <view
              v-for="item in contactRecords"
              :key="item"
              class="record-item"
            >
              {{ item }}
            </view>
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
            <wd-icon name="check" size="16px" />
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

.selector-card,
.demo-card,
.info-card {
  overflow: hidden;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #fff;
}

.selector-card,
.info-card {
  padding: 28rpx;
}

.selector-title,
.section-title {
  color: var(--app-ink);
  font-size: 30rpx;
  font-weight: 700;
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
  width: 320rpx;
  border: 1rpx solid #e6ebf5;
  border-radius: 14rpx;
  background: #f8fafc;
  padding: 22rpx;
  white-space: normal;
}

.selector-chip--active {
  border-color: #7aa7ff;
  background: linear-gradient(180deg, #eef5ff 0%, #f8fbff 100%);
}

.selector-chip-name {
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 700;
}

.selector-chip-summary {
  color: var(--app-muted);
  font-size: 24rpx;
  line-height: 1.6;
}

.demo-card {
  padding: 28rpx;
}

.demo-head {
  display: grid;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.demo-title,
.board-title {
  color: var(--app-ink);
  font-size: 34rpx;
  font-weight: 700;
}

.demo-summary,
.board-subtitle,
.task-footer-desc,
.profile-role {
  margin-top: 10rpx;
  color: var(--app-muted);
  font-size: 25rpx;
  line-height: 1.6;
}

.demo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.overview-board,
.task-hub,
.contact-sheet {
  display: grid;
  gap: 24rpx;
}

.board-top,
.task-top,
.profile-head,
.task-footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.metric-grid,
.profile-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.metric-card,
.profile-stat,
.action-card,
.channel-card,
.record-card,
.task-item {
  border-radius: 14rpx;
  background: #f8fafc;
}

.metric-card,
.profile-stat {
  display: grid;
  gap: 10rpx;
  padding: 24rpx;
}

.metric-value,
.profile-stat-value,
.task-footer-value {
  color: var(--app-ink);
  font-size: 34rpx;
  font-weight: 700;
}

.metric-label,
.profile-stat-label,
.mini-title,
.channel-name,
.channel-value,
.task-item-level {
  color: var(--app-muted);
  font-size: 24rpx;
}

.metric-trend {
  color: #2563eb;
  font-size: 24rpx;
  font-weight: 600;
}

.channel-card,
.record-card {
  padding: 24rpx;
}

.channel-item {
  display: grid;
  grid-template-columns: 100rpx minmax(0, 1fr) 70rpx;
  align-items: center;
  gap: 16rpx;
  margin-top: 18rpx;
}

.channel-progress {
  min-width: 0;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.action-card {
  display: grid;
  justify-items: center;
  gap: 10rpx;
  padding: 26rpx 18rpx;
  color: var(--app-ink);
  font-size: 24rpx;
  font-weight: 600;
}

.task-badge {
  border-radius: 999rpx;
  background: #fff4e5;
  padding: 10rpx 20rpx;
  color: #c2410c;
  font-size: 24rpx;
  font-weight: 600;
}

.task-list {
  display: grid;
  gap: 16rpx;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  padding: 24rpx;
}

.task-item-main {
  min-width: 0;
  flex: 1;
}

.task-item-title,
.profile-name {
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 700;
}

.task-item-meta {
  margin-top: 8rpx;
  color: var(--app-muted);
  font-size: 24rpx;
}

.task-item-level {
  flex-shrink: 0;
  border-radius: 999rpx;
  background: #e9f2ff;
  padding: 10rpx 18rpx;
  color: #2563eb;
  font-weight: 600;
}

.task-footer {
  border-radius: 14rpx;
  background: #f3f7ff;
  padding: 24rpx;
}

.task-footer-info {
  display: grid;
  gap: 8rpx;
}

.task-footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.profile-main {
  min-width: 0;
  flex: 1;
}

.profile-name-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12rpx;
}

.record-item {
  padding: 18rpx 0;
  border-bottom: 1rpx solid #e8edf5;
  color: var(--app-ink);
  font-size: 24rpx;
  line-height: 1.7;
}

.record-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
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
  color: var(--app-ink);
  font-size: 25rpx;
}

.code-box {
  margin-top: 20rpx;
  border-radius: 12rpx;
  background: #111827;
  padding: 24rpx;
  color: #e5e7eb;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 24rpx;
  line-height: 1.7;
  white-space: pre-wrap;
}
</style>
