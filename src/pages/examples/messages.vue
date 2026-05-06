<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type MessageFilter = 'all' | 'unread' | 'audit' | 'billing'

interface SystemMessage {
  id: number
  title: string
  content: string
  type: MessageFilter
  time: string
  unread: boolean
  level: 'info' | 'warning' | 'success'
  action: string
}

const toast = useToast('messages-toast')
const messageBox = useMessage('messages-box')

const activeFilter = ref<MessageFilter>('all')
const messages = ref<SystemMessage[]>([
  {
    id: 1,
    title: '小程序审核资料待确认',
    content: '抖音小程序主体资料缺少授权函，请在 2 小时内补齐后重新提交。',
    type: 'audit',
    time: '10:24',
    unread: true,
    level: 'warning',
    action: '去处理'
  },
  {
    id: 2,
    title: '订阅扣费成功',
    content: 'Premium 月度套餐已通过微信支付完成扣费，服务有效期已延长。',
    type: 'billing',
    time: '09:10',
    unread: true,
    level: 'success',
    action: '查看账单'
  },
  {
    id: 3,
    title: 'H5 活动数据同步完成',
    content: '昨日访问、转化和留资数据已经同步到运营看板。',
    type: 'all',
    time: '昨天',
    unread: false,
    level: 'info',
    action: '打开看板'
  },
  {
    id: 4,
    title: 'App 异常日志待复盘',
    content: '鸿蒙 App 端检测到 3 条支付回调超时日志，建议尽快排查。',
    type: 'audit',
    time: '周一',
    unread: false,
    level: 'warning',
    action: '查看日志'
  }
])

const filters = [
  { label: '全部', value: 'all' },
  { label: '未读', value: 'unread' },
  { label: '审核', value: 'audit' },
  { label: '账单', value: 'billing' }
] as const

const unreadCount = computed(() => messages.value.filter((item) => item.unread).length)
const filteredMessages = computed(() => {
  if (activeFilter.value === 'unread') return messages.value.filter((item) => item.unread)
  if (activeFilter.value === 'all') return messages.value
  return messages.value.filter((item) => item.type === activeFilter.value)
})

function levelText(level: SystemMessage['level']) {
  const map = {
    info: '通知',
    warning: '待办',
    success: '成功'
  }
  return map[level]
}

function markRead(item: SystemMessage) {
  item.unread = false
  toast.success('已标记为已读')
}

async function clearUnread() {
  if (!unreadCount.value) {
    toast.info('暂无未读消息')
    return
  }

  try {
    await messageBox.confirm({
      title: '全部标记已读？',
      msg: `当前有 ${unreadCount.value} 条未读系统消息。`,
      confirmButtonText: '标记已读',
      cancelButtonText: '取消'
    })
    messages.value.forEach((item) => {
      item.unread = false
    })
    toast.success('未读消息已清空')
  } catch {
    toast.info('已取消')
  }
}
</script>

<template>
  <PageShell title="系统消息" description="系统通知模板，覆盖未读统计、分类筛选、标记已读和业务动作。">
    <view class="messages-page">
      <wd-toast selector="messages-toast" />
      <wd-message-box selector="messages-box" />

      <view class="message-hero">
        <view>
          <view class="hero-title">系统消息</view>
          <view class="hero-desc">审核、账单、日志和运营同步通知集中处理。</view>
        </view>
        <view class="unread-box">
          <view class="unread-number">{{ unreadCount }}</view>
          <view class="unread-label">未读</view>
        </view>
      </view>

      <view class="toolbar">
        <scroll-view scroll-x class="filter-scroll">
          <view class="filter-list">
            <view
              v-for="filter in filters"
              :key="filter.value"
              :class="['filter-chip', { active: activeFilter === filter.value }]"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
            </view>
          </view>
        </scroll-view>
        <wd-button size="small" plain @click="clearUnread">全部已读</wd-button>
      </view>

      <view class="message-list">
        <view v-for="item in filteredMessages" :key="item.id" :class="['message-card', item.level, { unread: item.unread }]">
          <view class="message-mark">
            <view class="mark-text">{{ levelText(item.level) }}</view>
          </view>
          <view class="message-main">
            <view class="message-top">
              <view class="message-title">
                <view v-if="item.unread" class="unread-dot" />
                <text>{{ item.title }}</text>
              </view>
              <view class="message-time">{{ item.time }}</view>
            </view>
            <view class="message-content">{{ item.content }}</view>
            <view class="message-actions">
              <wd-button size="small" type="primary" plain>{{ item.action }}</wd-button>
              <wd-button v-if="item.unread" size="small" plain @click="markRead(item)">已读</wd-button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.messages-page {
  display: grid;
  gap: 22rpx;
}

.message-hero,
.message-card {
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
}

.message-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 32rpx;
}

.hero-title {
  color: var(--app-ink);
  font-size: 36rpx;
  font-weight: 900;
}

.hero-desc {
  margin-top: 10rpx;
  color: var(--app-muted);
  font-size: 25rpx;
  line-height: 1.5;
}

.unread-box {
  display: grid;
  justify-items: center;
  flex: 0 0 112rpx;
  border-radius: 18rpx;
  background: #eff6ff;
  color: var(--app-brand);
  padding: 18rpx 0;
}

.unread-number {
  font-size: 40rpx;
  font-weight: 900;
  line-height: 1;
}

.unread-label {
  margin-top: 8rpx;
  font-size: 22rpx;
  font-weight: 700;
}

.toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 18rpx;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-list {
  display: inline-flex;
  gap: 14rpx;
}

.filter-chip {
  border: 1rpx solid var(--app-line);
  border-radius: 999rpx;
  background: #fff;
  color: var(--app-muted);
  font-size: 25rpx;
  font-weight: 800;
  padding: 13rpx 26rpx;
}

.filter-chip.active {
  border-color: var(--app-brand);
  background: #eff6ff;
  color: var(--app-brand);
}

.message-list {
  display: grid;
  gap: 18rpx;
}

.message-card {
  display: flex;
  gap: 20rpx;
  padding: 24rpx;
}

.message-card.unread {
  box-shadow: 0 12rpx 32rpx rgb(30 136 229 / 8%);
}

.message-mark {
  flex: 0 0 64rpx;
}

.mark-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 18rpx;
  background: #eef2f6;
  color: var(--app-muted);
  font-size: 22rpx;
  font-weight: 900;
}

.message-card.warning .mark-text {
  background: #fff7ed;
  color: #f97316;
}

.message-card.success .mark-text {
  background: #ecfdf3;
  color: #12b76a;
}

.message-main {
  min-width: 0;
  flex: 1;
}

.message-top {
  display: flex;
  justify-content: space-between;
  gap: 18rpx;
}

.message-title {
  display: flex;
  align-items: center;
  gap: 10rpx;
  min-width: 0;
  color: var(--app-ink);
  font-size: 30rpx;
  font-weight: 800;
}

.unread-dot {
  flex: 0 0 14rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #f04438;
}

.message-time {
  flex: 0 0 auto;
  color: var(--app-muted);
  font-size: 23rpx;
}

.message-content {
  margin-top: 12rpx;
  color: var(--app-muted);
  font-size: 25rpx;
  line-height: 1.6;
}

.message-actions {
  display: flex;
  gap: 14rpx;
  justify-content: flex-end;
  margin-top: 18rpx;
}
</style>
