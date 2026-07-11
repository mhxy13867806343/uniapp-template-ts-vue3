<script setup lang="ts">
import { useMusicStore } from '@/store/music'
import { storeToRefs } from 'pinia'

const musicStore = useMusicStore()
const { currentSong, playing, playlist, playlistVisible } = storeToRefs(musicStore)

function togglePlay() {
  if (!currentSong.value) return
  musicStore.togglePlay()
}

function playNext() {
  if (!currentSong.value) return
  musicStore.playNext()
}

function openDetail() {
  if (currentSong.value) {
    uni.navigateTo({
      url: `/pages/music/detail?mode=song&id=${currentSong.value.id}`
    })
  } else {
    uni.navigateTo({
      url: `/pages/music/index`
    })
  }
}

function openPlaylist() {
  playlistVisible.value = true
}

function playFromList(song: any) {
  musicStore.playSong(song, playlist.value)
}

function removeFromList(index: number) {
  playlist.value.splice(index, 1)
  if (playlist.value.length === 0) {
    musicStore.togglePlay() // Will stop or do nothing if already stopped
    playlistVisible.value = false
  }
}
</script>

<template>
  <view>
    <view class="global-player" @click="openDetail">
      <view class="cover placeholder" v-if="!currentSong">
        <wd-icon name="music" size="24px" color="#999" />
      </view>
      <image v-else class="cover" :class="{ 'is-playing': playing }" :src="currentSong.picUrl" mode="aspectFill" />
      
      <view class="info">
        <view class="name">{{ currentSong ? currentSong.name : '网易云音乐' }}</view>
        <view class="artist">{{ currentSong ? currentSong.artists.join('/') : '发现好音乐' }}</view>
      </view>
      
      <view class="controls" @click.stop>
        <view class="control-btn" @click="togglePlay" :class="{ disabled: !currentSong }">
          <text class="icon-text">{{ playing ? '⏸' : '▶' }}</text>
        </view>
        <view class="control-btn" @click="playNext" :class="{ disabled: !currentSong }">
          <text class="icon-text">⏭</text>
        </view>
        <view class="control-btn" @click="openPlaylist">
          <text class="icon-text">📑</text>
        </view>
      </view>
    </view>

    <!-- Playlist Drawer -->
    <wd-popup v-model="playlistVisible" position="right" custom-class="playlist-drawer">
      <view class="drawer-header">
        <text class="drawer-title">当前播放 ({{ playlist.length }})</text>
        <wd-icon name="close" size="20px" @click="playlistVisible = false" />
      </view>
      <scroll-view scroll-y class="drawer-content">
        <view v-if="playlist.length === 0" class="empty-tip">暂无播放歌曲</view>
        <view v-for="(song, index) in playlist" :key="song.id" class="playlist-item" :class="{ active: currentSong?.id === song.id }" @click="playFromList(song)">
          <view class="item-info">
            <view class="item-name">{{ song.name }}</view>
            <view class="item-artist">- {{ song.artists.join('/') }}</view>
          </view>
          <wd-icon name="close" size="16px" custom-class="item-delete" @click.stop="removeFromList(index)" />
        </view>
      </scroll-view>
    </wd-popup>
  </view>
</template>

<style lang="scss" scoped>
.global-player {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom) + 120rpx);
  left: 30rpx;
  right: 30rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 60rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  z-index: 999;
  transition: all 0.3s ease;
  border: 1rpx solid #eef2f7;
}

.cover {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #eee;
  flex-shrink: 0;
  animation: spin 10s linear infinite;
  animation-play-state: paused;
}

.cover.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: none;
}

.cover.is-playing {
  animation-play-state: running;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.info {
  flex: 1;
  min-width: 0;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-shrink: 0;
}

.control-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f8fafc;
}

.control-btn.disabled {
  opacity: 0.5;
}

:deep(.playlist-drawer) {
  width: 600rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.drawer-header {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #eee;
}

.drawer-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.drawer-content {
  flex: 1;
  min-height: 0;
}

.empty-tip {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 28rpx;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.playlist-item.active {
  background: #f8fafc;
}

.playlist-item.active .item-name {
  color: #1d4ed8;
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}

.item-name {
  font-size: 28rpx;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}

.item-artist {
  font-size: 22rpx;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

:deep(.item-delete) {
  padding: 10rpx;
  color: #999;
}
</style>
