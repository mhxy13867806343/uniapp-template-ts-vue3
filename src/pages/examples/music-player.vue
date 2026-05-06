<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

interface Song {
  id: number
  title: string
  artist: string
  album: string
  duration: string
  cover: string
}

const songs: Song[] = [
  { id: 1, title: '蓝色小程序', artist: 'Hook Studio', album: '跨端模板集', duration: '03:42', cover: '#1e88e5' },
  { id: 2, title: 'H5 夜航', artist: 'Vue Beats', album: '前端旋律', duration: '04:08', cover: '#12b76a' },
  { id: 3, title: '鸿蒙清晨', artist: 'Uni Choir', album: 'App Sessions', duration: '03:18', cover: '#f97316' },
  { id: 4, title: '组件宇宙', artist: 'Wot Design Band', album: 'UI Grooves', duration: '02:56', cover: '#7c3aed' }
]

const activeIndex = ref(0)
const progress = ref(36)
const volume = ref(68)
const playing = ref(true)
const currentSong = computed(() => songs[activeIndex.value])

function previousSong() {
  activeIndex.value = activeIndex.value === 0 ? songs.length - 1 : activeIndex.value - 1
  progress.value = 12
}

function nextSong() {
  activeIndex.value = activeIndex.value === songs.length - 1 ? 0 : activeIndex.value + 1
  progress.value = 12
}

function chooseSong(index: number) {
  activeIndex.value = index
  playing.value = true
  progress.value = 20
}
</script>

<template>
  <PageShell title="音乐播放器" description="移动端音乐播放模板，包含播放状态、进度、音量和播放队列。">
    <view class="music-page">
      <view class="player-card">
        <view class="cover" :style="{ background: currentSong.cover }">
          <wd-icon name="play" size="38px" custom-class="cover-icon" />
        </view>
        <view class="song-title">{{ currentSong.title }}</view>
        <view class="song-artist">{{ currentSong.artist }} · {{ currentSong.album }}</view>

        <view class="progress-area">
          <wd-slider v-model="progress" hide-min-max />
          <view class="time-row">
            <text>01:28</text>
            <text>{{ currentSong.duration }}</text>
          </view>
        </view>

        <view class="controls">
          <wd-button round plain @click="previousSong">上一首</wd-button>
          <wd-button type="primary" round @click="playing = !playing">{{ playing ? '暂停' : '播放' }}</wd-button>
          <wd-button round plain @click="nextSong">下一首</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="panel-title">播放设置</view>
        <view class="volume-row">
          <text>音量</text>
          <wd-slider v-model="volume" hide-min-max custom-class="volume-slider" />
          <text>{{ volume }}%</text>
        </view>
      </view>

      <view class="panel-card">
        <view class="panel-title">播放队列</view>
        <view class="queue-list">
          <view
            v-for="(song, index) in songs"
            :key="song.id"
            :class="['queue-item', { active: index === activeIndex }]"
            @click="chooseSong(index)"
          >
            <view class="queue-cover" :style="{ background: song.cover }" />
            <view class="min-w-0 flex-1">
              <view class="queue-title">{{ song.title }}</view>
              <view class="queue-artist">{{ song.artist }}</view>
            </view>
            <text>{{ song.duration }}</text>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.music-page {
  display: grid;
  gap: 22rpx;
}

.player-card,
.panel-card {
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
  padding: 28rpx;
}

.player-card {
  display: grid;
  justify-items: center;
  text-align: center;
}

.cover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300rpx;
  height: 300rpx;
  border-radius: 28rpx;
  box-shadow: 0 24rpx 48rpx rgb(16 24 40 / 16%);
}

:deep(.cover-icon) {
  color: #fff;
}

.song-title {
  margin-top: 28rpx;
  color: var(--app-ink);
  font-size: 38rpx;
  font-weight: 900;
}

.song-artist,
.time-row,
.queue-artist,
.queue-item text {
  color: var(--app-muted);
  font-size: 24rpx;
}

.song-artist {
  margin-top: 10rpx;
}

.progress-area {
  width: 100%;
  margin-top: 30rpx;
}

.time-row,
.volume-row,
.queue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: 100%;
  gap: 14rpx;
  margin-top: 24rpx;
}

.panel-title {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 900;
  margin-bottom: 20rpx;
}

.volume-row text {
  flex: 0 0 auto;
  color: var(--app-muted);
  font-size: 25rpx;
}

:deep(.volume-slider) {
  flex: 1;
}

.queue-list {
  display: grid;
}

.queue-item {
  border-radius: 12rpx;
  padding: 18rpx;
}

.queue-item.active {
  background: #eff6ff;
}

.queue-cover {
  flex: 0 0 60rpx;
  width: 60rpx;
  height: 60rpx;
  border-radius: 14rpx;
}

.queue-title {
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 800;
}
</style>
