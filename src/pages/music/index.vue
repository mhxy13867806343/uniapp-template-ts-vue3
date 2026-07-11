<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { getMusicHomeData, type MusicBanner, type PlaylistItem, type SongItem, type TopListItem } from '@/apis/music'
import { formatCompactNumber, formatDuration } from '@/utils/format'
import { useMusicStore } from '@/store/music'
import { storeToRefs } from 'pinia'

const musicStore = useMusicStore()
const { currentSong, playing } = storeToRefs(musicStore)

function handlePlaySong(song: SongItem) {
  if (currentSong.value?.id === song.id) {
    musicStore.togglePlay()
  } else {
    musicStore.playSong(song, newSongs.value)
  }
}

const loading = ref(false)
const searchKeyword = ref('')
const banners = ref<MusicBanner[]>([])
const playlists = ref<PlaylistItem[]>([])
const newSongs = ref<SongItem[]>([])
const topLists = ref<TopListItem[]>([])

const quickKeywords = ['周杰伦', '林俊杰', '陈奕迅', '告白气球', '晴天', '起风了']

const stats = computed(() => [
  { label: '推荐歌单', value: String(playlists.value.length).padStart(2, '0') },
  { label: '新歌速递', value: String(newSongs.value.length).padStart(2, '0') },
  { label: '热榜精选', value: String(topLists.value.length).padStart(2, '0') }
])

async function loadHomeData() {
  loading.value = true
  try {
    const data = await getMusicHomeData()
    banners.value = data.banners
    playlists.value = data.playlists
    newSongs.value = data.newSongs
    topLists.value = data.topLists
  } finally {
    loading.value = false
  }
}

function toSearchPage(keyword = searchKeyword.value.trim()) {
  const value = keyword.trim()
  uni.navigateTo({
    url: value
      ? `/pages/music/search?keyword=${encodeURIComponent(value)}`
      : '/pages/music/search'
  })
}

function openSong(id: number) {
  uni.navigateTo({
    url: `/pages/music/detail?mode=song&id=${id}`
  })
}

function openPlaylist(id: number) {
  uni.navigateTo({
    url: `/pages/music/detail?mode=playlist&id=${id}`
  })
}

function handleBannerClick(item: MusicBanner) {
  if (item.targetTypeTitle.includes('单曲') && item.targetId) {
    openSong(item.targetId)
    return
  }

  if (item.targetTypeTitle.includes('歌单') && item.targetId) {
    openPlaylist(item.targetId)
    return
  }

  toSearchPage(item.typeTitle || '网易云热歌')
}

onLoad(() => {
  loadHomeData()
})

onPullDownRefresh(async () => {
  await loadHomeData()
  uni.stopPullDownRefresh()
})
</script>

<template>
  <PageShell title="网易云音乐接口页" description="基于 NeteaseCloudMusicApi 搭建的移动端演示页，支持首页推荐、搜索、歌单详情和歌曲详情。">
    <view class="music-home">
      <view class="hero-card">
        <view class="hero-main">
          <view class="hero-kicker">Music API Lab</view>
          <view class="hero-title">首页、搜索、详情一条龙打通</view>
          <view class="hero-desc">当前页面已经接入 Banner、推荐歌单、新歌速递和官方热榜接口，点列表项就能继续查看详情。</view>
        </view>
        <view class="stats-grid">
          <view v-for="item in stats" :key="item.label" class="stat-item">
            <view class="stat-value">{{ item.value }}</view>
            <view class="stat-label">{{ item.label }}</view>
          </view>
        </view>
      </view>

      <view class="search-card">
        <wd-search v-model="searchKeyword" placeholder="搜索歌曲、歌手、专辑" hide-cancel @search="toSearchPage()" />
        <view class="keyword-row">
          <view
            v-for="keyword in quickKeywords"
            :key="keyword"
            class="keyword-chip"
            @click="toSearchPage(keyword)"
          >
            {{ keyword }}
          </view>
        </view>
      </view>

      <view v-if="loading && !banners.length" class="state-card">
        <wd-icon name="play" size="26px" />
        <text>正在拉取网易云首页数据...</text>
      </view>

      <swiper v-else-if="banners.length" class="banner-swiper" circular autoplay interval="3600" duration="320">
        <swiper-item v-for="item in banners" :key="`${item.imageUrl}-${item.targetId}`">
          <view class="banner-card" @click="handleBannerClick(item)">
            <image class="banner-image" :src="item.imageUrl" mode="aspectFill" />
            <view class="banner-mask">
              <wd-tag size="small" type="danger">{{ item.typeTitle || item.targetTypeTitle || '推荐' }}</wd-tag>
              <view class="banner-tip">点击进入详情</view>
            </view>
          </view>
        </swiper-item>
      </swiper>

      <view class="panel-card">
        <view class="section-head">
          <view>
            <view class="section-title">推荐歌单</view>
            <view class="section-desc">来自 `/personalized` 接口</view>
          </view>
          <wd-button size="small" type="primary" plain @click="toSearchPage('热歌榜')">去搜索</wd-button>
        </view>

        <view class="playlist-grid">
          <view
            v-for="item in playlists"
            :key="item.id"
            class="playlist-card"
            @click="openPlaylist(item.id)"
          >
            <image class="playlist-cover" :src="item.coverUrl" mode="aspectFill" />
            <view class="playlist-title">{{ item.name }}</view>
            <view class="playlist-meta">
              <text>{{ formatCompactNumber(item.playCount) }} 播放</text>
              <text>{{ item.trackCount || '--' }} 首</text>
            </view>
            <view class="playlist-copy">{{ item.copywriter || '点击查看歌单详情与曲目列表' }}</view>
          </view>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <view>
            <view class="section-title">新歌速递</view>
            <view class="section-desc">来自 `/top/song` 接口</view>
          </view>
          <wd-tag plain>{{ newSongs.length }} 首</wd-tag>
        </view>

        <view class="song-list">
          <view
            v-for="(item, index) in newSongs"
            :key="item.id"
            class="song-row"
            @click="openSong(item.id)"
          >
            <view class="song-rank">{{ String(index + 1).padStart(2, '0') }}</view>
            <image v-if="item.picUrl" class="song-cover" :src="item.picUrl" mode="aspectFill" />
            <view v-else class="song-cover placeholder">
              <wd-icon name="play" size="20px" />
            </view>
            <view class="song-main">
              <view class="song-name" :class="{ 'is-playing-text': currentSong?.id === item.id }">
                {{ item.name }}
                <text v-if="item.alias.length" class="song-alias">({{ item.alias[0] }})</text>
              </view>
              <view class="song-meta">{{ item.artists.join(' / ') || '未知歌手' }} · {{ item.albumName || '未知专辑' }}</view>
            </view>
            <view class="song-action" @click.stop="handlePlaySong(item)">
              <wd-icon :name="playing && currentSong?.id === item.id ? 'pause' : 'play'" size="22px" />
            </view>
          </view>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <view>
            <view class="section-title">热榜精选</view>
            <view class="section-desc">来自 `/toplist/detail` 接口</view>
          </view>
          <wd-tag type="warning" plain>榜单详情</wd-tag>
        </view>

        <view class="toplist-grid">
          <view
            v-for="item in topLists"
            :key="item.id"
            class="toplist-card"
            @click="openPlaylist(item.id)"
          >
            <view class="toplist-head">
              <image class="toplist-cover" :src="item.coverUrl" mode="aspectFill" />
              <view class="toplist-info">
                <view class="toplist-name">{{ item.name }}</view>
                <view class="toplist-frequency">{{ item.updateFrequency || '实时更新' }}</view>
              </view>
            </view>
            <view class="toplist-tracks">
              <view v-for="(track, trackIndex) in item.tracks" :key="`${item.id}-${trackIndex}`" class="toplist-track">
                {{ trackIndex + 1 }}. {{ track.first }} - {{ track.second }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.music-home {
  display: grid;
  gap: 24rpx;
}

.hero-card,
.search-card,
.panel-card,
.state-card {
  border: 1rpx solid var(--app-line);
  border-radius: 18rpx;
  background: #fff;
}

.hero-card {
  padding: 32rpx;
  background: linear-gradient(135deg, #111827 0%, #1d4ed8 55%, #60a5fa 100%);
  color: #fff;
}

.hero-main {
  display: grid;
  gap: 12rpx;
}

.hero-kicker {
  font-size: 22rpx;
  opacity: 0.72;
  letter-spacing: 2rpx;
}

.hero-title {
  font-size: 40rpx;
  font-weight: 900;
}

.hero-desc {
  font-size: 24rpx;
  line-height: 1.6;
  opacity: 0.88;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 28rpx;
}

.stat-item {
  border-radius: 16rpx;
  background: rgb(255 255 255 / 14%);
  padding: 20rpx;
}

.stat-value {
  font-size: 34rpx;
  font-weight: 900;
}

.stat-label {
  margin-top: 8rpx;
  font-size: 22rpx;
  opacity: 0.82;
}

.search-card,
.panel-card,
.state-card {
  padding: 24rpx;
}

.keyword-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 18rpx;
}

.keyword-chip {
  padding: 10rpx 20rpx;
  border-radius: 999rpx;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 22rpx;
  font-weight: 700;
}

.state-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  color: var(--app-muted);
  min-height: 180rpx;
}

.banner-swiper,
.banner-card,
.banner-image {
  width: 100%;
  height: 300rpx;
  border-radius: 20rpx;
}

.banner-card {
  position: relative;
  overflow: hidden;
}

.banner-mask {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 24rpx;
  background: linear-gradient(180deg, rgb(15 23 42 / 0%) 0%, rgb(15 23 42 / 78%) 100%);
}

.banner-tip {
  color: #fff;
  font-size: 22rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 22rpx;
}

.section-title {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 900;
}

.section-desc {
  margin-top: 8rpx;
  color: var(--app-muted);
  font-size: 22rpx;
}

.playlist-grid,
.toplist-grid {
  display: grid;
  gap: 18rpx;
}

.playlist-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.playlist-card,
.toplist-card {
  overflow: hidden;
  border: 1rpx solid #eef2f7;
  border-radius: 16rpx;
  background: #f8fafc;
}

.playlist-card {
  padding-bottom: 18rpx;
}

.playlist-cover {
  width: 100%;
  height: 220rpx;
}

.playlist-title,
.playlist-meta,
.playlist-copy,
.toplist-head,
.toplist-tracks {
  padding-left: 18rpx;
  padding-right: 18rpx;
}

.playlist-title {
  margin-top: 16rpx;
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 800;
  line-height: 1.4;
}

.playlist-meta,
.playlist-copy,
.song-meta,
.song-duration,
.toplist-frequency,
.toplist-track {
  color: var(--app-muted);
  font-size: 22rpx;
}

.playlist-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
}

.playlist-copy {
  margin-top: 10rpx;
  line-height: 1.6;
}

.song-list {
  display: grid;
  gap: 16rpx;
}

.song-row {
  display: grid;
  grid-template-columns: 56rpx 88rpx minmax(0, 1fr) auto;
  align-items: center;
  gap: 18rpx;
  border: 1rpx solid #eef2f7;
  border-radius: 16rpx;
  background: #f8fafc;
  padding: 18rpx;
}

.is-playing-text {
  color: #1d4ed8 !important;
}

.song-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  color: #1d4ed8;
}

.song-rank {
  color: #1d4ed8;
  font-size: 24rpx;
  font-weight: 900;
}

.song-cover {
  width: 88rpx;
  height: 88rpx;
  border-radius: 18rpx;
  background: #dbeafe;
}

.song-cover.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.song-main {
  min-width: 0;
}

.song-name,
.toplist-name {
  overflow: hidden;
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-alias {
  color: #94a3b8;
  font-size: 22rpx;
}

.song-meta {
  overflow: hidden;
  margin-top: 8rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toplist-card {
  padding: 20rpx;
}

.toplist-head {
  display: flex;
  gap: 16rpx;
  padding: 0;
}

.toplist-cover {
  flex: 0 0 112rpx;
  width: 112rpx;
  height: 112rpx;
  border-radius: 18rpx;
}

.toplist-info {
  min-width: 0;
  flex: 1;
}

.toplist-frequency {
  margin-top: 10rpx;
}

.toplist-tracks {
  display: grid;
  gap: 10rpx;
  margin-top: 18rpx;
  padding: 0;
}

.toplist-track {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
