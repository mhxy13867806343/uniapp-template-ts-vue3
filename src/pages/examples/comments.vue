<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type CommentFilter = 'hot' | 'latest' | 'pending'

interface Reply {
  id: number
  author: string
  replyTo?: string
  content: string
  time: string
  likes: number
  pending: boolean
}

interface CommentItem {
  id: number
  author: string
  avatar: string
  content: string
  source: string
  time: string
  likes: number
  pending: boolean
  pinned?: boolean
  replies: Reply[]
}

const toast = useToast('comments-toast')

const activeFilter = ref<CommentFilter>('hot')
const replyVisible = ref(false)
const currentComment = ref<CommentItem | null>(null)
const currentReply = ref<Reply | null>(null)
const replyText = ref('')

const filters = [
  { label: '热门', value: 'hot' },
  { label: '最新', value: 'latest' },
  { label: '待回复', value: 'pending' }
] as const

const comments = ref<CommentItem[]>([
  {
    id: 1,
    author: '周小鹿',
    avatar: '周',
    content: '这个瀑布流模板能不能直接接抖音小程序的数据源？图片高度不固定时表现挺像真实内容流。',
    source: '瀑布流示例',
    time: '3 分钟前',
    likes: 128,
    pending: true,
    pinned: true,
    replies: [
      {
        id: 101,
        author: '运营助手',
        content: '可以，数据结构里只要补齐封面、高度和详情 id 就能接。',
        time: '刚刚',
        likes: 16,
        pending: false
      },
      {
        id: 102,
        author: '周小鹿',
        replyTo: '运营助手',
        content: '明白，那接口字段我按这个结构先整理出来。',
        time: '1 分钟前',
        likes: 8,
        pending: true
      }
    ]
  },
  {
    id: 2,
    author: '陈产品',
    avatar: '陈',
    content: '订阅页的银行卡弹层已经不挡按钮了，移动端体验顺了很多。',
    source: '订阅支付',
    time: '18 分钟前',
    likes: 86,
    pending: false,
    replies: [
      {
        id: 201,
        author: '模板管理员',
        content: '这块后面可以直接接微信、支付宝和银行卡支付状态。',
        time: '12 分钟前',
        likes: 11,
        pending: false
      }
    ]
  },
  {
    id: 3,
    author: '李审核',
    avatar: '李',
    content: '组件中心能按官方分类跳详情，这个对团队培训很方便。',
    source: '组件中心',
    time: '今天 09:20',
    likes: 42,
    pending: true,
    replies: []
  }
])

const pendingCount = computed(() => comments.value.filter((item) => item.pending).length)
const replyCount = computed(() => comments.value.reduce((total, item) => total + item.replies.length, 0))
const pendingReplyCount = computed(() => comments.value.reduce((total, item) => total + item.replies.filter((reply) => reply.pending).length, 0))
const replyTargetTitle = computed(() => {
  if (currentReply.value) return `回复二级评论：${currentReply.value.author}`
  if (currentComment.value) return `回复一级评论：${currentComment.value.author}`
  return '回复评论'
})

const filteredComments = computed(() => {
  if (activeFilter.value === 'pending') {
    return comments.value.filter((item) => item.pending || item.replies.some((reply) => reply.pending))
  }
  if (activeFilter.value === 'latest') return [...comments.value].sort((a, b) => b.id - a.id)
  return [...comments.value].sort((a, b) => b.likes - a.likes)
})

function likeComment(item: CommentItem) {
  item.likes += 1
  toast.success('已点赞')
}

function likeReply(reply: Reply) {
  reply.likes += 1
  toast.success('已点赞')
}

function openReply(item: CommentItem, reply?: Reply) {
  currentComment.value = item
  currentReply.value = reply || null
  replyText.value = ''
  replyVisible.value = true
}

function submitReply() {
  if (!currentComment.value) return
  if (replyText.value.trim().length < 2) {
    toast.warning('回复至少 2 个字')
    return
  }

  currentComment.value.replies.push({
    id: Date.now(),
    author: '模板管理员',
    replyTo: currentReply.value?.author,
    content: replyText.value.trim(),
    time: '刚刚',
    likes: 0,
    pending: false
  })
  currentComment.value.pending = false
  if (currentReply.value) {
    currentReply.value.pending = false
  }
  replyVisible.value = false
  toast.success(currentReply.value ? '二级评论回复已发布' : '一级评论回复已发布')
}

function approveReply(reply: Reply) {
  reply.pending = false
  toast.success('二级回复已通过')
}
</script>

<template>
  <PageShell title="评论相关" description="评论业务模板，覆盖热门/最新/待回复、点赞、二级回复和底部回复弹层。">
    <view class="comments-page">
      <wd-toast selector="comments-toast" />

      <view class="comment-summary">
        <view>
          <view class="summary-title">评论互动</view>
          <view class="summary-desc">聚合内容页、订阅页和组件页的用户反馈。</view>
        </view>
        <view class="pending-card">
          <view class="pending-number">{{ pendingCount }}</view>
          <view class="pending-label">待回复</view>
        </view>
      </view>

      <view class="stats-row">
        <view class="stat-item">
          <view class="stat-number">{{ comments.length }}</view>
          <view class="stat-label">一级评论</view>
        </view>
        <view class="stat-item">
          <view class="stat-number">{{ replyCount }}</view>
          <view class="stat-label">二级回复</view>
        </view>
        <view class="stat-item warning">
          <view class="stat-number">{{ pendingReplyCount }}</view>
          <view class="stat-label">待审回复</view>
        </view>
      </view>

      <view class="filter-tabs">
        <view
          v-for="filter in filters"
          :key="filter.value"
          :class="['filter-tab', { active: activeFilter === filter.value }]"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </view>
      </view>

      <view class="comment-list">
        <view v-for="item in filteredComments" :key="item.id" class="comment-card">
          <view class="comment-head">
            <view class="avatar">{{ item.avatar }}</view>
            <view class="comment-author">
              <view class="author-line">
                <view class="author-name">{{ item.author }}</view>
                <wd-tag v-if="item.pinned" type="primary" plain>置顶</wd-tag>
                <wd-tag v-if="item.pending" type="warning" plain>待回复</wd-tag>
              </view>
              <view class="source-line">{{ item.source }} · {{ item.time }}</view>
            </view>
          </view>

          <view class="comment-content">{{ item.content }}</view>

          <view class="level-title">
            <text>二级回复</text>
            <text>{{ item.replies.length }} 条</text>
          </view>

          <view v-if="item.replies.length" class="reply-list">
            <view v-for="reply in item.replies" :key="reply.id" :class="['reply-item', { pending: reply.pending }]">
              <view class="reply-top">
                <view class="reply-name-line">
                  <text class="reply-author">{{ reply.author }}</text>
                  <text v-if="reply.replyTo" class="reply-to">回复 {{ reply.replyTo }}</text>
                  <wd-tag v-if="reply.pending" type="warning" plain>待审核</wd-tag>
                </view>
                <text class="reply-time">{{ reply.time }}</text>
              </view>
              <view class="reply-content">{{ reply.content }}</view>
              <view class="reply-actions">
                <text @click="likeReply(reply)">赞 {{ reply.likes }}</text>
                <text @click="openReply(item, reply)">回复二级</text>
                <text v-if="reply.pending" @click="approveReply(reply)">通过</text>
              </view>
            </view>
          </view>
          <view v-else class="empty-replies">暂无二级回复，适合展示首条官方回复入口。</view>

          <view class="comment-actions">
            <wd-button size="small" plain @click="likeComment(item)">赞 {{ item.likes }}</wd-button>
            <wd-button size="small" type="primary" plain @click="openReply(item)">回复</wd-button>
          </view>
        </view>
      </view>

      <wd-popup
        v-model="replyVisible"
        position="bottom"
        safe-area-inset-bottom
        root-portal
        custom-class="reply-popup"
        :z-index="1200"
      >
        <view class="reply-panel">
          <view class="reply-title">{{ replyTargetTitle }}</view>
          <view v-if="currentReply" class="reply-quote">{{ currentReply.content }}</view>
          <view v-if="currentReply" class="reply-tip">发布后会作为同一条一级评论下的二级回复，并显示“回复 {{ currentReply.author }}”。</view>
          <wd-input
            v-model="replyText"
            clearable
            :placeholder="currentReply ? '输入给这条二级评论的回复' : '输入给一级评论的回复'"
          />
          <wd-button type="primary" block @click="submitReply">
            {{ currentReply ? '发布二级回复' : '发布回复' }}
          </wd-button>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.comments-page {
  display: grid;
  gap: 22rpx;
}

.comment-summary,
.comment-card {
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
}

.comment-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 32rpx;
}

.summary-title {
  color: var(--app-ink);
  font-size: 36rpx;
  font-weight: 900;
}

.summary-desc,
.source-line,
.reply-time {
  color: var(--app-muted);
  font-size: 24rpx;
}

.summary-desc {
  margin-top: 10rpx;
  line-height: 1.5;
}

.pending-card {
  display: grid;
  justify-items: center;
  flex: 0 0 112rpx;
  border-radius: 18rpx;
  background: #fff7ed;
  color: #f97316;
  padding: 18rpx 0;
}

.pending-number {
  font-size: 40rpx;
  font-weight: 900;
  line-height: 1;
}

.pending-label {
  margin-top: 8rpx;
  font-size: 22rpx;
  font-weight: 800;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.stat-item {
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
  padding: 22rpx 16rpx;
  text-align: center;
}

.stat-item.warning {
  background: #fff7ed;
}

.stat-number {
  color: var(--app-ink);
  font-size: 34rpx;
  font-weight: 900;
  line-height: 1;
}

.stat-label {
  margin-top: 10rpx;
  color: var(--app-muted);
  font-size: 23rpx;
  font-weight: 700;
}

.filter-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1rpx solid var(--app-line);
  border-radius: 999rpx;
  background: #fff;
  padding: 6rpx;
}

.filter-tab {
  border-radius: 999rpx;
  color: var(--app-muted);
  font-size: 26rpx;
  font-weight: 800;
  padding: 16rpx 0;
  text-align: center;
}

.filter-tab.active {
  background: var(--app-brand);
  color: #fff;
}

.comment-list {
  display: grid;
  gap: 18rpx;
}

.comment-card {
  padding: 24rpx;
}

.comment-head {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 76rpx;
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  background: #eff6ff;
  color: var(--app-brand);
  font-size: 30rpx;
  font-weight: 900;
}

.comment-author {
  min-width: 0;
  flex: 1;
}

.author-line {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.author-name {
  color: var(--app-ink);
  font-size: 30rpx;
  font-weight: 800;
}

.source-line {
  margin-top: 6rpx;
}

.comment-content {
  margin-top: 20rpx;
  color: var(--app-ink);
  font-size: 28rpx;
  line-height: 1.65;
}

.level-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
  color: var(--app-muted);
  font-size: 23rpx;
  font-weight: 800;
}

.reply-list {
  display: grid;
  gap: 14rpx;
  border-radius: 12rpx;
  background: #f6f8fb;
  margin-top: 10rpx;
  padding: 18rpx;
}

.reply-item {
  border-radius: 10rpx;
  color: #475467;
  font-size: 25rpx;
  line-height: 1.55;
  padding: 14rpx;
}

.reply-item.pending {
  background: #fff7ed;
}

.reply-top,
.reply-actions,
.reply-name-line {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.reply-top {
  justify-content: space-between;
}

.reply-name-line {
  min-width: 0;
  flex: 1;
  flex-wrap: wrap;
}

.reply-author {
  color: var(--app-ink);
  font-weight: 800;
}

.reply-to {
  color: var(--app-muted);
  font-size: 23rpx;
}

.reply-content {
  margin-top: 8rpx;
}

.reply-actions {
  justify-content: flex-end;
  margin-top: 10rpx;
  color: var(--app-brand);
  font-size: 23rpx;
  font-weight: 800;
}

.empty-replies {
  border-radius: 12rpx;
  background: #f6f8fb;
  color: var(--app-muted);
  font-size: 24rpx;
  margin-top: 10rpx;
  padding: 18rpx;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14rpx;
  margin-top: 20rpx;
}

:deep(.reply-popup) {
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
}

.reply-panel {
  display: grid;
  gap: 22rpx;
  background: #fff;
  padding: 32rpx 32rpx calc(64rpx + env(safe-area-inset-bottom));
}

.reply-title {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 900;
}

.reply-quote {
  border-left: 6rpx solid var(--app-brand);
  border-radius: 8rpx;
  background: #f6f8fb;
  color: var(--app-muted);
  font-size: 25rpx;
  line-height: 1.5;
  padding: 18rpx;
}

.reply-tip {
  border-radius: 10rpx;
  background: #eff6ff;
  color: var(--app-brand);
  font-size: 24rpx;
  line-height: 1.5;
  padding: 16rpx 18rpx;
}
</style>
