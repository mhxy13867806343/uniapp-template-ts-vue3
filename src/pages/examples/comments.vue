<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type CommentFilter = 'hot' | 'latest' | 'pending'

interface Reply {
  author: string
  content: string
  time: string
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
  replies: Reply[]
}

const toast = useToast('comments-toast')

const activeFilter = ref<CommentFilter>('hot')
const replyVisible = ref(false)
const currentComment = ref<CommentItem | null>(null)
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
    replies: [{ author: '运营助手', content: '可以，数据结构里只要补齐封面、高度和详情 id 就能接。', time: '刚刚' }]
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
    replies: []
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
const filteredComments = computed(() => {
  if (activeFilter.value === 'pending') return comments.value.filter((item) => item.pending)
  if (activeFilter.value === 'latest') return [...comments.value].sort((a, b) => b.id - a.id)
  return [...comments.value].sort((a, b) => b.likes - a.likes)
})

function likeComment(item: CommentItem) {
  item.likes += 1
  toast.success('已点赞')
}

function openReply(item: CommentItem) {
  currentComment.value = item
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
    author: '模板管理员',
    content: replyText.value.trim(),
    time: '刚刚'
  })
  currentComment.value.pending = false
  replyVisible.value = false
  toast.success('回复已发布')
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
                <wd-tag v-if="item.pending" type="warning" plain>待回复</wd-tag>
              </view>
              <view class="source-line">{{ item.source }} · {{ item.time }}</view>
            </view>
          </view>

          <view class="comment-content">{{ item.content }}</view>

          <view v-if="item.replies.length" class="reply-list">
            <view v-for="reply in item.replies" :key="`${reply.author}-${reply.time}`" class="reply-item">
              <text class="reply-author">{{ reply.author }}：</text>
              <text>{{ reply.content }}</text>
              <text class="reply-time"> {{ reply.time }}</text>
            </view>
          </view>

          <view class="comment-actions">
            <wd-button size="small" plain @click="likeComment(item)">赞 {{ item.likes }}</wd-button>
            <wd-button size="small" type="primary" plain @click="openReply(item)">回复</wd-button>
          </view>
        </view>
      </view>

      <wd-popup v-model="replyVisible" position="bottom" safe-area-inset-bottom root-portal custom-class="reply-popup">
        <view class="reply-panel">
          <view class="reply-title">回复 {{ currentComment?.author }}</view>
          <wd-input v-model="replyText" clearable placeholder="输入回复内容，支持接入敏感词校验" />
          <wd-button type="primary" block @click="submitReply">发布回复</wd-button>
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

.reply-list {
  display: grid;
  gap: 10rpx;
  border-radius: 12rpx;
  background: #f6f8fb;
  margin-top: 18rpx;
  padding: 18rpx;
}

.reply-item {
  color: #475467;
  font-size: 25rpx;
  line-height: 1.55;
}

.reply-author {
  color: var(--app-ink);
  font-weight: 800;
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
  padding: 32rpx 32rpx calc(48rpx + env(safe-area-inset-bottom));
}

.reply-title {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 900;
}
</style>
