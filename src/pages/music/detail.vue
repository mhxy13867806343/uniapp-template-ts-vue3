<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { getPlaylistDetail, getSongDetail, type PlaylistDetail, type SongDetailData, type SongItem } from '@/apis/music'
import { formatCompactNumber, formatDuration } from '@/utils/format'
import { useMusicStore } from '@/store/music'
import { storeToRefs } from 'pinia'

type DetailMode = 'playlist' | 'song'

const musicStore = useMusicStore()
const { playing, currentTime, duration, currentSong, favoriteSongs } = storeToRefs(musicStore)

const loading = ref(false)
const mode = ref<DetailMode>('song')
const detailId = ref(0)
const playlistDetail = ref<PlaylistDetail | null>(null)
const songDetail = ref<SongDetailData | null>(null)

const visibleTracks = computed(() => playlistDetail.value?.tracks.slice(0, 20) || [])
const lyricLines = computed(() => {
  const lyric = songDetail.value?.lyric || ''
  return lyric
    .split('\n')
    .map(line => line.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/gu, '').trim())
    .filter(Boolean)
})

function formatPublishTime(value: number) {
  if (!value) return '未知'
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function loadDetail() {
  if (!detailId.value) {
    uni.showToast({
      title: '缺少详情 id',
      icon: 'none'
    })
    return
  }

  loading.value = true
  playlistDetail.value = null
  songDetail.value = null

  try {
    if (mode.value === 'playlist') {
      playlistDetail.value = await getPlaylistDetail(detailId.value)
      return
    }

    songDetail.value = await getSongDetail(detailId.value)
    
    // Auto-play if it's a song and not currently playing
    if (songDetail.value.song && currentSong.value?.id !== songDetail.value.song.id) {
      musicStore.playSong(songDetail.value.song)
    }
  } finally {
    loading.value = false
  }
}

function handlePlaySong(song: SongItem) {
  if (currentSong.value?.id === song.id) {
    musicStore.togglePlay()
  } else {
    musicStore.playSong(song, playlistDetail.value?.tracks || [])
  }
}

function openSong(item: SongItem) {
  musicStore.playSong(item, playlistDetail.value?.tracks || [])
  uni.navigateTo({
    url: `/pages/music/detail?mode=song&id=${item.id}`
  })
}

function toSearchPage(keyword = '') {
  const query = keyword.trim()
  uni.navigateTo({
    url: query
      ? `/pages/music/search?keyword=${encodeURIComponent(query)}`
      : '/pages/music/search'
  })
}

onLoad((options) => {
  mode.value = String(options?.mode || 'song') === 'playlist' ? 'playlist' : 'song'
  detailId.value = Number(options?.id || 0)
  loadDetail()
})
</script>

<template>
  <PageShell title="音乐详情" description="歌单详情与歌曲详情共用一个动态页面，支持继续跳转和二级浏览。">
    <view class="music-detail-page">
      <view v-if="loading" class="state-card">
        <wd-icon name="play" size="26px" />
        <text>正在加载详情...</text>
      </view>

      <template v-else-if="mode === 'playlist' && playlistDetail">
        <view class="hero-card">
          <image class="hero-cover" :src="playlistDetail.coverUrl" mode="aspectFill" />
          <view class="hero-main">
            <view class="hero-type">歌单详情</view>
            <view class="hero-title">{{ playlistDetail.name }}</view>
            <view class="hero-meta">创建者：{{ playlistDetail.creatorName || '网易云音乐' }}</view>
            <view class="hero-tags">
              <wd-tag v-for="tag in playlistDetail.tags" :key="tag" plain>{{ tag }}</wd-tag>
            </view>
          </view>
        </view>

        <view class="summary-grid">
          <view class="summary-card">
            <view class="summary-value">{{ formatCompactNumber(playlistDetail.playCount) }}</view>
            <view class="summary-label">播放量</view>
          </view>
          <view class="summary-card">
            <view class="summary-value">{{ playlistDetail.trackCount }}</view>
            <view class="summary-label">歌曲数</view>
          </view>
          <view class="summary-card action" @click="toSearchPage(playlistDetail.name)">
            <view class="summary-value">搜索</view>
            <view class="summary-label">同名内容</view>
          </view>
        </view>

        <view v-if="playlistDetail.description" class="panel-card">
          <view class="section-title">歌单简介</view>
          <view class="description-text">{{ playlistDetail.description }}</view>
        </view>

        <view class="panel-card">
          <view class="section-head">
            <view class="section-title">曲目列表</view>
            <wd-tag type="primary" plain>展示前 {{ visibleTracks.length }} 首</wd-tag>
          </view>

          <view class="track-list">
            <view
              v-for="(item, index) in visibleTracks"
              :key="item.id"
              class="track-row"
              @click="openSong(item)"
            >
              <view class="track-rank">{{ String(index + 1).padStart(2, '0') }}</view>
              <view class="track-main">
                <view class="track-name" :class="{ 'is-playing-text': currentSong?.id === item.id }">{{ item.name }}</view>
                <view class="track-meta">{{ item.artists.join(' / ') || '未知歌手' }} · {{ item.albumName || '未知专辑' }}</view>
              </view>
              <view class="track-action" @click.stop="handlePlaySong(item)">
                <wd-icon :name="playing && currentSong?.id === item.id ? 'pause' : 'play'" size="22px" />
              </view>
            </view>
          </view>
        </view>
      </template>

      <template v-else-if="songDetail?.song">
        <view class="hero-card song-hero">
          <image v-if="songDetail.song.picUrl" class="hero-cover" :class="{ 'is-playing': playing && currentSong?.id === songDetail.song.id }" :src="songDetail.song.picUrl" mode="aspectFill" />
          <view v-else class="hero-cover placeholder">
            <wd-icon name="play" size="30px" />
          </view>
          <view class="hero-main">
            <view class="hero-title">{{ songDetail.song.name }}</view>
            <view class="hero-meta">{{ songDetail.song.artists.join(' / ') || '未知歌手' }}</view>
          </view>

          <!-- 播放控制区 -->
          <view class="player-controls">
            <view class="progress-bar">
              <text class="time-text">{{ formatDuration(currentTime) }}</text>
              <wd-slider class="slider" v-model="currentTime" :max="duration" @change="musicStore.seek($event.value)" hide-min-max />
              <text class="time-text">{{ formatDuration(duration) }}</text>
            </view>
            <view class="control-buttons">
              <view class="btn" @click="musicStore.toggleFavorite(songDetail.song)">
                <text class="icon-text">{{ musicStore.isFavorite(songDetail.song.id) ? '❤️' : '🤍' }}</text>
              </view>
              <view class="btn" @click="musicStore.playPrev()">
                <text class="icon-text">⏮</text>
              </view>
              <view class="btn play-btn" @click="musicStore.togglePlay()">
                <text class="icon-text">{{ playing ? '⏸' : '▶' }}</text>
              </view>
              <view class="btn" @click="musicStore.playNext()">
                <text class="icon-text">⏭</text>
              </view>
              <view class="btn" @click="toSearchPage(songDetail.song.artists[0] || '')">
                <text class="icon-text">🔍</text>
              </view>
            </view>
          </view>
        </view>

        <view class="summary-grid">
          <view class="summary-card">
            <view class="summary-value">{{ songDetail.comments.length }}</view>
            <view class="summary-label">热门评论</view>
          </view>
          <view class="summary-card action" @click="toSearchPage(songDetail.song.name)">
            <view class="summary-value">搜索</view>
            <view class="summary-label">同名歌曲</view>
          </view>
          <view class="summary-card action" @click="toSearchPage(songDetail.song.artists[0] || '')">
            <view class="summary-value">歌手</view>
            <view class="summary-label">{{ songDetail.song.artists[0] || '更多' }}</view>
          </view>
        </view>

        <view class="panel-card">
          <view class="section-head">
            <view class="section-title">歌词</view>
            <wd-tag plain>{{ lyricLines.length }} 行</wd-tag>
          </view>

          <view v-if="lyricLines.length" class="lyric-card">
            <view v-for="(line, index) in lyricLines" :key="`${line}-${index}`" class="lyric-line">
              {{ line }}
            </view>
          </view>
          <view v-else class="empty-tip">当前歌曲暂时没有可用歌词。</view>
        </view>

        <view class="panel-card">
          <view class="section-head">
            <view class="section-title">热门评论</view>
            <wd-tag type="warning" plain>{{ songDetail.comments.length }} 条</wd-tag>
          </view>

          <view v-if="songDetail.comments.length" class="comment-list">
            <view v-for="item in songDetail.comments" :key="item.id" class="comment-row">
              <image class="comment-avatar" :src="item.avatarUrl" mode="aspectFill" />
              <view class="comment-main">
                <view class="comment-head">
                  <view class="comment-name">{{ item.nickname }}</view>
                  <view class="comment-time">{{ item.timeText }}</view>
                </view>
                <view class="comment-content">{{ item.content }}</view>
                <view class="comment-like">👍 {{ formatCompactNumber(item.likedCount) }}</view>
              </view>
            </view>
          </view>
          <view v-else class="empty-tip">当前歌曲暂时没有评论数据。</view>
        </view>
      </template>

      <view v-else class="state-card">
        <wd-icon name="warning" size="26px" />
        <text>没有加载到详情数据</text>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.music-detail-page {
  display: grid;
  gap: 24rpx;
}

.hero-card,
.panel-card,
.state-card,
.summary-card {
  border: 1rpx solid var(--app-line);
  border-radius: 18rpx;
  background: #fff;
}

.hero-card {
  display: flex;
  gap: 22rpx;
  padding: 28rpx;
}

.hero-cover {
  flex: 0 0 220rpx;
  width: 220rpx;
  height: 220rpx;
  border-radius: 24rpx;
  background: #dbeafe;
}

.hero-cover.placeholder,
.state-card {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-main {
  min-width: 0;
  flex: 1;
  display: grid;
  align-content: center;
  gap: 10rpx;
}

.hero-type,
.hero-meta,
.hero-submeta,
.description-text,
.track-meta,
.track-duration,
.empty-tip,
.comment-time,
.comment-like {
  color: var(--app-muted);
  font-size: 22rpx;
}

.song-hero {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.song-hero .hero-cover {
  width: 320rpx;
  height: 320rpx;
  border-radius: 50%;
  margin: 20rpx 0;
  box-shadow: 0 16rpx 48rpx rgba(0,0,0,0.2);
  animation: spin 15s linear infinite;
  animation-play-state: paused;
}

.song-hero .hero-cover.is-playing {
  animation-play-state: running;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.player-controls {
  width: 100%;
  margin-top: 40rpx;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 20rpx;
  width: 100%;
}

.time-text {
  font-size: 24rpx;
  color: #999;
}

.slider {
  flex: 1;
}

.control-buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 40rpx;
}

.control-buttons .btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f8fafc;
}

.control-buttons .play-btn {
  width: 120rpx;
  height: 120rpx;
  background: #1d4ed8;
}

.control-buttons .play-btn .icon-text {
  color: #fff;
  font-size: 48rpx;
}

.icon-text {
  font-size: 40rpx;
}

.hero-title,
.section-title,
.track-name,
.comment-name {
  color: var(--app-ink);
  font-weight: 900;
}

.hero-title {
  font-size: 38rpx;
  line-height: 1.4;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 6rpx;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.summary-card {
  padding: 22rpx;
  text-align: center;
}

.summary-card.action {
  background: #eff6ff;
}

.summary-value {
  color: var(--app-ink);
  font-size: 30rpx;
  font-weight: 900;
}

.summary-label {
  margin-top: 8rpx;
  color: var(--app-muted);
  font-size: 22rpx;
}

.panel-card {
  padding: 24rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
}

.description-text {
  line-height: 1.7;
  white-space: pre-wrap;
}

.track-list,
.comment-list {
  display: grid;
  gap: 16rpx;
}

.track-row,
.comment-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  border: 1rpx solid #eef2f7;
  border-radius: 16rpx;
  background: #f8fafc;
  padding: 18rpx;
}

.is-playing-text {
  color: #1d4ed8 !important;
}

.track-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  color: #1d4ed8;
}

.track-rank {
  flex: 0 0 56rpx;
  color: #1d4ed8;
  font-size: 24rpx;
  font-weight: 900;
  line-height: 1.9;
  text-align: center;
}

.track-main,
.comment-main {
  min-width: 0;
  flex: 1;
}

.track-name {
  font-size: 28rpx;
}

.track-meta {
  overflow: hidden;
  margin-top: 8rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lyric-card {
  display: grid;
  gap: 12rpx;
  max-height: 720rpx;
  overflow-y: auto;
  border-radius: 16rpx;
  background: #f8fafc;
  padding: 22rpx;
}

.lyric-line {
  color: var(--app-ink);
  font-size: 25rpx;
  line-height: 1.7;
}

.comment-avatar {
  flex: 0 0 72rpx;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
}

.comment-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.comment-name {
  font-size: 26rpx;
}

.comment-content {
  margin-top: 10rpx;
  color: var(--app-ink);
  font-size: 24rpx;
  line-height: 1.7;
}

.comment-like {
  margin-top: 12rpx;
}

.state-card {
  gap: 14rpx;
  min-height: 240rpx;
  color: var(--app-muted);
}
</style>
