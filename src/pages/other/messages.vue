<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('messages-toast')

// State
const activeTab = ref('all')

const tabs = [
  { title: '全部', name: 'all' },
  { title: '系统', name: 'system' },
  { title: '互动', name: 'interaction' },
  { title: '促销', name: 'promotion' }
]

interface MessageItem {
  id: string
  title: string
  content: string
  time: string
  unread: boolean
  category: 'system' | 'interaction' | 'promotion'
  icon: string
  color: string
}

const mockMessages = ref<MessageItem[]>([
  {
    id: 'msg-1',
    title: '系统维护与升级通知',
    content: '尊敬的用户，我们已将基础模板核心依赖包升级至最新稳定版，完美优化 iOS 17/18 及 HarmonyOS Next 运行兼容性。',
    time: '今天 10:24',
    unread: true,
    category: 'system',
    icon: 'chat',
    color: '#3b82f6'
  },
  {
    id: 'msg-2',
    title: '有人 @ 了你',
    content: '用户 Antigravity 在“开发演练百宝箱”反馈板块中向您留言，点击查看他发出的代码片段修改请求。',
    time: '今天 09:15',
    unread: true,
    category: 'interaction',
    icon: 'user',
    color: '#10b981'
  },
  {
    id: 'msg-3',
    title: '新用户专享大礼包已送达',
    content: '恭喜！您获得 5 张无门槛开源组件高级下载券，可直接在“交互动画与特效”面板中使用导出。',
    time: '昨天 18:30',
    unread: true,
    category: 'promotion',
    icon: 'check',
    color: '#f59e0b'
  },
  {
    id: 'msg-4',
    title: '账号异地登录安全警报',
    content: '系统检测到您的测试账号于上海市进行了设备二次验证授权登录，若非本人操作请及时在应用设置中修改密码。',
    time: '前天 14:00',
    unread: false,
    category: 'system',
    icon: 'lock',
    color: '#ef4444'
  },
  {
    id: 'msg-5',
    title: '感谢您提出宝贵意见',
    content: '您提交的“iOS回弹果冻动效”反馈已收录入库，相关组件已成功发布更新至“交互动画与特效”演示包。',
    time: '3天前',
    unread: false,
    category: 'interaction',
    icon: 'chat',
    color: '#8b5cf6'
  }
])

// Filter messages by tab
const filteredMessages = computed(() => {
  if (activeTab.value === 'all') return mockMessages.value
  return mockMessages.value.filter(msg => msg.category === activeTab.value)
})

const unreadTotal = computed(() => mockMessages.value.filter(msg => msg.unread).length)

// Actions
function markAllAsRead() {
  let count = 0
  mockMessages.value.forEach(msg => {
    if (msg.unread && (activeTab.value === 'all' || msg.category === activeTab.value)) {
      msg.unread = false
      count++
    }
  })
  if (count > 0) {
    toast.success(`已将 ${count} 条消息标记为已读`)
    // Sync to store or global states if needed
    uni.setStorageSync('unread_msg_count', mockMessages.value.filter(msg => msg.unread).length.toString())
  } else {
    toast.warning('没有未读消息')
  }
}

function clearAllMessages() {
  if (filteredMessages.value.length === 0) {
    toast.warning('当前列表已空')
    return
  }
  
  uni.showModal({
    title: '清空确认',
    content: `确定要清空当前选中的 [${tabs.find(t => t.name === activeTab.value)?.title}] 列表所有消息吗？`,
    success: (res) => {
      if (res.confirm) {
        if (activeTab.value === 'all') {
          mockMessages.value = []
        } else {
          mockMessages.value = mockMessages.value.filter(msg => msg.category !== activeTab.value)
        }
        toast.success('消息已全部清空')
        uni.setStorageSync('unread_msg_count', mockMessages.value.filter(msg => msg.unread).length.toString())
      }
    }
  })
}

function clickMessage(msg: MessageItem) {
  if (msg.unread) {
    msg.unread = false
    toast.success('消息已读')
    uni.setStorageSync('unread_msg_count', mockMessages.value.filter(msg => msg.unread).length.toString())
  }
}

function deleteMessage(id: string) {
  mockMessages.value = mockMessages.value.filter(msg => msg.id !== id)
  toast.success('消息已删除')
  uni.setStorageSync('unread_msg_count', mockMessages.value.filter(msg => msg.unread).length.toString())
}
</script>

<template>
  <PageShell title="消息通知" description="集中展示与用户账号相关的升级提示、活动推荐及互动消息，支持已读及删除。">
    <view class="messages-page">
      <wd-toast selector="messages-toast" />

      <!-- Top action bar -->
      <view class="action-top-row flex items-center justify-between">
        <view class="unread-badge-txt">
          未读消息：<text class="count-tag font-bold text-red">{{ unreadTotal }}</text>
        </view>
        <view class="action-buttons-group">
          <wd-button size="small" type="neutral" plain @click="markAllAsRead">一键已读</wd-button>
          <wd-button size="small" type="error" plain class="ml-2" @click="clearAllMessages">清空当前</wd-button>
        </view>
      </view>

      <!-- Category Tabs -->
      <wd-tabs v-model="activeTab" class="sticky-tabs mt-2">
        <wd-tab v-for="t in tabs" :key="t.name" :title="t.title" :name="t.name" />
      </wd-tabs>

      <!-- Message List -->
      <view class="messages-container mt-3">
        <transition-group name="list-fade" tag="view" class="list-wrapper">
          <view
            v-for="msg in filteredMessages"
            :key="msg.id"
            :class="['message-card', { 'is-unread': msg.unread }]"
            @click="clickMessage(msg)"
          >
            <!-- Left Category Indicator -->
            <view class="category-icon-box" :style="{ background: msg.color }">
              <wd-icon :name="msg.icon" size="20px" color="#fff" />
            </view>

            <!-- Middle Text Body -->
            <view class="message-body flex-1">
              <view class="title-row flex items-center justify-between">
                <text class="msg-title font-bold">{{ msg.title }}</text>
                <text class="msg-time">{{ msg.time }}</text>
              </view>
              <view class="msg-content mt-1">{{ msg.content }}</view>
            </view>

            <!-- Red dot & Delete button column -->
            <view class="right-actions-col">
              <view v-if="msg.unread" class="unread-red-dot" />
              <view class="delete-action-btn mt-2" @click.stop="deleteMessage(msg.id)">
                🗑️
              </view>
            </view>
          </view>
        </transition-group>

        <!-- Empty State -->
        <view v-if="filteredMessages.length === 0" class="empty-state text-center mt-5">
          <view class="empty-icon">📨</view>
          <view class="empty-title font-bold mt-2">暂无通知内容</view>
          <view class="empty-desc mt-1">当前列表已被全部清空或未收到相关类型通知。</view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.messages-page {
  padding-bottom: 80rpx;
}

.action-top-row {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.01);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.unread-badge-txt {
  font-size: 20rpx;
  color: var(--app-ink);
}

.count-tag {
  font-size: 22rpx;
}

.action-buttons-group {
  display: flex;
}

.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f8fafc;
}

/* Card list */
.messages-container {
  display: grid;
  gap: 20rpx;
}

.list-wrapper {
  display: grid;
  gap: 20rpx;
}

.message-card {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
  transition: all 0.25s ease;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.01);
  cursor: pointer;
  
  &.is-unread {
    border-color: #bfdbfe;
    background: #f8fafc;
    
    .msg-title {
      color: #1e3a8a;
    }
  }
}

.category-icon-box {
  width: 68rpx;
  height: 68rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-body {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.msg-title {
  font-size: 21rpx;
  color: var(--app-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-time {
  font-size: 16rpx;
  color: var(--app-muted);
}

.msg-content {
  font-size: 18rpx;
  color: var(--app-muted);
  line-height: 1.5;
  text-align: justify;
}

/* Right operations */
.right-actions-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
}

.unread-red-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #ef4444;
}

.delete-action-btn {
  font-size: 26rpx;
  padding: 4rpx;
  opacity: 0.4;
  transition: opacity 0.2s ease;
  
  &:active {
    opacity: 0.9;
  }
}

/* Animations list-fade */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.35s ease;
}

.list-fade-enter-from {
  opacity: 0;
  transform: translateY(30rpx);
}

.list-fade-leave-to {
  opacity: 0;
  transform: translateX(100rpx);
}

/* Empty state */
.empty-state {
  padding: 80rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
}

.empty-title {
  font-size: 24rpx;
  color: var(--app-ink);
}

.empty-desc {
  font-size: 18rpx;
  color: var(--app-muted);
}

.flex-1 { flex: 1; }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-5 { margin-top: 50rpx; }
.font-bold { font-weight: 800; }
.text-red { color: #ef4444; }
.text-center { text-align: center; }
</style>
