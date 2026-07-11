<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import PageShell from '@/components/PageShell.vue'
import { useUserStore } from '@/store'
import { useMusicStore } from '@/store/music'
import { navigateTo } from '@/utils/router'
import { exampleScenarios, navigateToExample } from '@/utils/exampleScenarios'

const userStore = useUserStore()
const musicStore = useMusicStore()

// State for active collapse groups
const activeCollapses = ref<string[]>([])

// Filter scenarios by category
const pageScenarios = computed(() => exampleScenarios.filter(item => item.level === '页面'))
const formScenarios = computed(() => exampleScenarios.filter(item => item.level === '表单'))
const feedbackScenarios = computed(() => exampleScenarios.filter(item => item.level === '反馈'))
const displayScenarios = computed(() => exampleScenarios.filter(item => item.level === '展示'))
const animScenarios = computed(() => exampleScenarios.filter(item => item.level === '动效'))

function goLogin() {
  navigateTo('/pages/auth/login')
}

function goRegister() {
  navigateTo('/pages/auth/register')
}

const unreadMsgCount = ref('3')

onShow(() => {
  const cached = uni.getStorageSync('unread_msg_count')
  unreadMsgCount.value = cached !== '' ? cached : '3'
})

function logout() {
  userStore.logout()
  uni.showToast({
    title: '已退出登录',
    icon: 'none'
  })
}

function playSong(song: any, list: any[]) {
  musicStore.playSong(song, list)
  uni.navigateTo({
    url: `/pages/music/detail?mode=song&id=${song.id}`
  })
}
</script>

<template>
  <PageShell title="我的" description="用户资料、登录状态和个人中心入口。">
    <view class="mine-page-container">
      <!-- User profile panel -->
      <view class="panel flex items-center gap-3">
        <view class="h-14 w-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-6 font-700">
          {{ userStore.profile?.nickname?.slice(0, 1) || 'U' }}
        </view>
        <view class="min-w-0 flex-1">
          <view class="font-700">{{ userStore.profile?.nickname || '未登录用户' }}</view>
          <view class="muted-text mt-1">{{ userStore.profile?.role || '登录后体验账户中心、权限和业务入口' }}</view>
        </view>
        <wd-button v-if="!userStore.isLogin" size="small" type="primary" @click="goLogin">登录</wd-button>
        <wd-button v-else size="small" type="primary" plain @click="logout">退出</wd-button>
      </view>

      <!-- Original functional options -->
      <wd-cell-group border class="mt-3">
        <wd-cell title="账号登录" :value="userStore.isLogin ? '已登录' : '未登录'" is-link clickable @click="goLogin" />
        <wd-cell title="注册账号" value="新用户入口" is-link clickable @click="goRegister" />
        <wd-cell title="个人资料" :value="userStore.profile?.phone || '完善'" is-link />
        <wd-cell title="消息通知" :value="unreadMsgCount" is-link clickable @click="navigateTo('/pages/other/messages')" />
        <wd-cell title="应用设置" is-link clickable @click="navigateTo('/pages/other/settings')" />
      </wd-cell-group>

      <!-- Music Center -->
      <view class="panel mt-4">
        <view class="toolbox-header mb-3">
          <text class="toolbox-title">音乐中心</text>
        </view>
        <wd-collapse>
          <wd-collapse-item :title="`我的收藏 (${musicStore.favoriteSongs.length}首)`" name="favorites">
            <view class="song-list">
              <view v-for="song in musicStore.favoriteSongs" :key="song.id" class="song-row" @click="playSong(song, musicStore.favoriteSongs)">
                <image v-if="song.picUrl" class="song-cover" :src="song.picUrl" mode="aspectFill" />
                <view class="song-main">
                  <view class="song-name">{{ song.name }}</view>
                  <view class="song-meta">{{ song.artists.join('/') }}</view>
                </view>
              </view>
              <view v-if="!musicStore.favoriteSongs.length" class="empty-tip">暂无收藏</view>
            </view>
          </wd-collapse-item>
          <wd-collapse-item :title="`最近播放 (${musicStore.playHistory.length}首)`" name="history">
            <view class="song-list">
              <view v-for="song in musicStore.playHistory" :key="song.id" class="song-row" @click="playSong(song, musicStore.playHistory)">
                <image v-if="song.picUrl" class="song-cover" :src="song.picUrl" mode="aspectFill" />
                <view class="song-main">
                  <view class="song-name">{{ song.name }}</view>
                  <view class="song-meta">{{ song.artists.join('/') }}</view>
                </view>
              </view>
              <view v-if="!musicStore.playHistory.length" class="empty-tip">暂无播放历史</view>
            </view>
          </wd-collapse-item>
          <wd-collapse-item title="创建的歌单 (0个)" name="playlists">
            <view class="empty-tip">暂无自建歌单</view>
          </wd-collapse-item>
        </wd-collapse>
      </view>

      <!-- Advanced examples toolbox (100 Examples) -->
      <view class="panel mt-4">
        <view class="toolbox-header mb-3">
          <text class="toolbox-title">开发演练百宝箱</text>
          <wd-tag type="primary" plain>共 {{ exampleScenarios.length }} 个场景</wd-tag>
        </view>

        <wd-collapse v-model="activeCollapses">
          <!-- Category 1 -->
          <wd-collapse-item :title="`典型页面模板 (${pageScenarios.length}个)`" name="pages">
            <wd-cell-group border>
              <wd-cell
                v-for="item in pageScenarios"
                :key="item.title"
                :title="item.title"
                :label="item.description"
                is-link
                clickable
                @click="navigateToExample(item.path)"
              />
            </wd-cell-group>
          </wd-collapse-item>

          <!-- Category 2 -->
          <wd-collapse-item :title="`互动表单录入 (${formScenarios.length}个)`" name="forms">
            <wd-cell-group border>
              <wd-cell
                v-for="item in formScenarios"
                :key="item.title"
                :title="item.title"
                :label="item.description"
                is-link
                clickable
                @click="navigateToExample(item.path)"
              />
            </wd-cell-group>
          </wd-collapse-item>

          <!-- Category 3 -->
          <wd-collapse-item :title="`反馈提示与弹窗 (${feedbackScenarios.length}个)`" name="feedbacks">
            <wd-cell-group border>
              <wd-cell
                v-for="item in feedbackScenarios"
                :key="item.title"
                :title="item.title"
                :label="item.description"
                is-link
                clickable
                @click="navigateToExample(item.path)"
              />
            </wd-cell-group>
          </wd-collapse-item>

          <!-- Category 4 -->
          <wd-collapse-item :title="`数据展示与排版 (${displayScenarios.length}个)`" name="display">
            <wd-cell-group border>
              <wd-cell
                v-for="item in displayScenarios"
                :key="item.title"
                :title="item.title"
                :label="item.description"
                is-link
                clickable
                @click="navigateToExample(item.path)"
              />
            </wd-cell-group>
          </wd-collapse-item>

          <!-- Category 5 -->
          <wd-collapse-item :title="`交互动画与特效 (${animScenarios.length}个)`" name="anims">
            <wd-cell-group border>
              <wd-cell
                v-for="item in animScenarios"
                :key="item.title"
                :title="item.title"
                :label="item.description"
                is-link
                clickable
                @click="navigateToExample(item.path)"
              />
            </wd-cell-group>
          </wd-collapse-item>
        </wd-collapse>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.mine-page-container {
  display: grid;
  gap: 20rpx;
  padding-bottom: 60rpx;
}

.panel {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  padding: 30rpx;
}

.toolbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 18rpx;
}

.toolbox-title {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 800;
}

.mt-3 {
  margin-top: 24rpx;
}

.mt-4 {
  margin-top: 32rpx;
}

.song-list {
  display: grid;
  gap: 16rpx;
}

.song-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  border-radius: 12rpx;
  background: #f8fafc;
}

.song-cover {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  background: #eee;
}

.song-main {
  flex: 1;
  min-width: 0;
}

.song-name {
  font-size: 28rpx;
  color: var(--app-ink);
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-meta {
  font-size: 24rpx;
  color: var(--app-muted);
  margin-top: 4rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-tip {
  color: var(--app-muted);
  font-size: 24rpx;
  padding: 20rpx;
  text-align: center;
}

:deep(.wd-collapse-item__header) {
  font-weight: 700;
  color: var(--app-ink);
}
</style>
