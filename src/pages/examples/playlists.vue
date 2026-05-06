<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type PlaylistType = 'recommend' | 'study' | 'workout'

interface Playlist {
  id: number
  type: PlaylistType
  name: string
  desc: string
  count: number
  color: string
  songs: string[]
}

const activeType = ref<PlaylistType>('recommend')
const selectedId = ref(1)

const types = [
  { label: '推荐', value: 'recommend' },
  { label: '学习', value: 'study' },
  { label: '运动', value: 'workout' }
] as const

const playlists: Playlist[] = [
  { id: 1, type: 'recommend', name: '今日灵感', desc: '适合编码和产品梳理', count: 32, color: '#1e88e5', songs: ['蓝色小程序', '组件宇宙', 'H5 夜航'] },
  { id: 2, type: 'recommend', name: '跨端精选', desc: 'H5、小程序和 App 的轻快节奏', count: 24, color: '#12b76a', songs: ['鸿蒙清晨', '云端构建', '多端回声'] },
  { id: 3, type: 'study', name: '深度学习', desc: '安静、稳定、长时段专注', count: 18, color: '#7c3aed', songs: ['类型推导', '状态管理', '路由漫步'] },
  { id: 4, type: 'workout', name: '晨跑节拍', desc: '适合运动和通勤', count: 28, color: '#f97316', songs: ['热身启动', '节奏加速', '终点线'] }
]

const filteredPlaylists = computed(() => playlists.filter((item) => item.type === activeType.value))
const selectedPlaylist = computed(() => playlists.find((item) => item.id === selectedId.value) || filteredPlaylists.value[0])

watch(
  activeType,
  () => {
    selectedId.value = filteredPlaylists.value[0]?.id || 1
  },
  { immediate: true }
)
</script>

<template>
  <PageShell title="歌单列表" description="歌单业务模板，包含分类、歌单卡片、歌曲列表和收藏状态。">
    <view class="playlists-page">
      <view class="type-tabs">
        <view
          v-for="type in types"
          :key="type.value"
          :class="['type-tab', { active: activeType === type.value }]"
          @click="activeType = type.value"
        >
          {{ type.label }}
        </view>
      </view>

      <scroll-view scroll-x class="playlist-scroll">
        <view class="playlist-row">
          <view
            v-for="playlist in filteredPlaylists"
            :key="playlist.id"
            :class="['playlist-card', { active: playlist.id === selectedId }]"
            @click="selectedId = playlist.id"
          >
            <view class="playlist-cover" :style="{ background: playlist.color }">
              <text>{{ playlist.count }}</text>
            </view>
            <view class="playlist-name">{{ playlist.name }}</view>
            <view class="playlist-desc">{{ playlist.desc }}</view>
          </view>
        </view>
      </scroll-view>

      <view class="detail-card">
        <view class="detail-head">
          <view>
            <view class="detail-title">{{ selectedPlaylist.name }}</view>
            <view class="detail-desc">{{ selectedPlaylist.desc }}</view>
          </view>
          <wd-tag type="primary" plain>{{ selectedPlaylist.count }} 首</wd-tag>
        </view>

        <view class="song-list">
          <view v-for="(song, index) in selectedPlaylist.songs" :key="song" class="song-row">
            <view class="song-index">{{ index + 1 }}</view>
            <view class="min-w-0 flex-1">
              <view class="song-name">{{ song }}</view>
              <view class="song-meta">Hook Studio · 标准音质</view>
            </view>
            <wd-button size="small" plain>收藏</wd-button>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.playlists-page {
  display: grid;
  gap: 22rpx;
}

.type-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1rpx solid var(--app-line);
  border-radius: 999rpx;
  background: #fff;
  padding: 6rpx;
}

.type-tab {
  border-radius: 999rpx;
  color: var(--app-muted);
  font-size: 26rpx;
  font-weight: 800;
  padding: 16rpx 0;
  text-align: center;
}

.type-tab.active {
  background: var(--app-brand);
  color: #fff;
}

.playlist-scroll {
  white-space: nowrap;
}

.playlist-row {
  display: inline-flex;
  gap: 18rpx;
}

.playlist-card,
.detail-card {
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
}

.playlist-card {
  width: 260rpx;
  padding: 20rpx;
}

.playlist-card.active {
  border-color: var(--app-brand);
  box-shadow: 0 12rpx 32rpx rgb(30 136 229 / 12%);
}

.playlist-cover {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  height: 190rpx;
  border-radius: 16rpx;
  padding: 16rpx;
}

.playlist-cover text {
  border-radius: 999rpx;
  background: rgb(0 0 0 / 36%);
  color: #fff;
  font-size: 22rpx;
  font-weight: 900;
  padding: 6rpx 14rpx;
}

.playlist-name,
.detail-title,
.song-name {
  color: var(--app-ink);
  font-weight: 900;
}

.playlist-name {
  margin-top: 16rpx;
  font-size: 29rpx;
}

.playlist-desc,
.detail-desc,
.song-meta {
  color: var(--app-muted);
  font-size: 24rpx;
  line-height: 1.5;
}

.playlist-desc {
  margin-top: 8rpx;
  white-space: normal;
}

.detail-card {
  padding: 26rpx;
}

.detail-head,
.song-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.detail-head {
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.detail-title {
  font-size: 34rpx;
}

.song-list {
  display: grid;
}

.song-row {
  border-top: 1rpx solid var(--app-line);
  padding: 20rpx 0;
}

.song-index {
  flex: 0 0 44rpx;
  color: var(--app-muted);
  font-size: 26rpx;
  font-weight: 800;
}

.song-name {
  font-size: 28rpx;
}
</style>
