<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { getHotSearches, searchSongs, type HotSearchItem, type SongItem } from '@/apis/music'
import { formatDuration } from '@/utils/format'
import { useMusicStore } from '@/store/music'
import { storeToRefs } from 'pinia'

const musicStore = useMusicStore()
const { currentSong, playing } = storeToRefs(musicStore)

function handlePlaySong(song: SongItem) {
  if (currentSong.value?.id === song.id) {
    musicStore.togglePlay()
  } else {
    musicStore.playSong(song, results.value)
  }
}

const MUSIC_SEARCH_HISTORY_KEY = 'music:search:history'

const loading = ref(false)
const keyword = ref('')
const hotKeywords = ref<HotSearchItem[]>([])
const historyKeywords = ref<string[]>([])
const results = ref<SongItem[]>([])
const searched = ref(false)

function readHistory() {
  const cache = uni.getStorageSync(MUSIC_SEARCH_HISTORY_KEY)
  historyKeywords.value = Array.isArray(cache) ? cache.filter(Boolean).slice(0, 10) : []
}

function writeHistory(value: string) {
  const current = value.trim()
  if (!current) return
  historyKeywords.value = [current, ...historyKeywords.value.filter(item => item !== current)].slice(0, 10)
  uni.setStorageSync(MUSIC_SEARCH_HISTORY_KEY, historyKeywords.value)
}

async function loadHotKeywords() {
  hotKeywords.value = await getHotSearches(10)
}

async function runSearch(target = keyword.value.trim()) {
  const value = target.trim()
  if (!value) {
    uni.showToast({
      title: '请输入搜索关键词',
      icon: 'none'
    })
    return
  }

  loading.value = true
  keyword.value = value
  searched.value = true

  try {
    results.value = await searchSongs(value, 20)
    writeHistory(value)
  } finally {
    loading.value = false
  }
}

function clearHistory() {
  historyKeywords.value = []
  uni.removeStorageSync(MUSIC_SEARCH_HISTORY_KEY)
}

function removeHistoryItem(index: number) {
  historyKeywords.value.splice(index, 1)
  uni.setStorageSync(MUSIC_SEARCH_HISTORY_KEY, historyKeywords.value)
}

function openSong(id: number) {
  uni.navigateTo({
    url: `/pages/music/detail?mode=song&id=${id}`
  })
}

onLoad(async (options) => {
  readHistory()
  await loadHotKeywords()

  const initialKeyword = String(options?.keyword || '')
  if (initialKeyword) {
    keyword.value = decodeURIComponent(initialKeyword)
    await runSearch(keyword.value)
  }
})
</script>

<template>
  <PageShell title="音乐搜索" description="接入 `/search` 与 `/search/hot/detail` 接口，支持热搜、历史搜索和结果跳详情。">
    <view class="music-search-page">
      <view class="search-panel">
        <wd-search v-model="keyword" placeholder="输入歌曲、歌手、专辑关键字" hide-cancel @search="runSearch()" />
        <wd-button block type="primary" class="search-action" @click="runSearch()">
          立即搜索
        </wd-button>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <view class="section-title">热搜推荐</view>
          <wd-tag plain>{{ hotKeywords.length }} 条</wd-tag>
        </view>
        <view class="keyword-grid">
          <view
            v-for="(item, index) in hotKeywords"
            :key="item.searchWord"
            class="keyword-card"
            @click="runSearch(item.searchWord)"
          >
            <view class="keyword-rank">{{ index + 1 }}</view>
            <view class="keyword-main">
              <view class="keyword-title">{{ item.searchWord }}</view>
              <view class="keyword-desc">{{ item.content || '点击直接搜索' }}</view>
            </view>
          </view>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <view class="section-title">搜索历史</view>
          <wd-button size="small" plain @click="clearHistory">清空</wd-button>
        </view>
        <view v-if="historyKeywords.length" class="history-row">
          <view
            v-for="(item, index) in historyKeywords"
            :key="item"
            class="history-chip"
          >
            <text class="chip-text" @click="runSearch(item)">{{ item }}</text>
            <wd-icon name="close" size="14px" custom-class="close-icon" @click.stop="removeHistoryItem(index)" />
          </view>
        </view>
        <view v-else class="empty-tip">还没有历史记录，先搜一首歌试试。</view>
      </view>

      <view class="panel-card">
        <view class="section-head">
          <view class="section-title">搜索结果</view>
          <wd-tag type="primary" plain>{{ results.length }} 首</wd-tag>
        </view>

        <view v-if="loading" class="state-card">
          <wd-icon name="play" size="26px" />
          <text>搜索中...</text>
        </view>

        <view v-else-if="results.length" class="result-list">
          <view
            v-for="item in results"
            :key="item.id"
            class="result-row"
            @click="openSong(item.id)"
          >
            <image v-if="item.picUrl" class="result-cover" :src="item.picUrl" mode="aspectFill" />
            <view v-else class="result-cover placeholder">
              <wd-icon name="play" size="20px" />
            </view>
            <view class="result-main">
              <view class="result-name" :class="{ 'is-playing-text': currentSong?.id === item.id }">
                {{ item.name }}
                <text v-if="item.alias.length" class="result-alias">({{ item.alias[0] }})</text>
              </view>
              <view class="result-meta">{{ item.artists.join(' / ') || '未知歌手' }} · {{ item.albumName || '未知专辑' }}</view>
            </view>
            <view class="result-action" @click.stop="handlePlaySong(item)">
              <wd-icon :name="playing && currentSong?.id === item.id ? 'pause' : 'play'" size="22px" />
            </view>
          </view>
        </view>

        <view v-else-if="searched" class="state-card">
          <wd-icon name="search" size="26px" />
          <text>没有找到匹配的结果</text>
        </view>

        <view v-else class="empty-tip">输入关键词后即可展示接口返回的歌曲列表。</view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.music-search-page {
  display: grid;
  gap: 24rpx;
}

.search-panel,
.panel-card {
  border: 1rpx solid var(--app-line);
  border-radius: 18rpx;
  background: #fff;
  padding: 24rpx;
}

.search-action {
  margin-top: 18rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  margin-bottom: 20rpx;
}

.section-title {
  color: var(--app-ink);
  font-size: 30rpx;
  font-weight: 900;
}

.keyword-grid,
.result-list {
  display: grid;
  gap: 16rpx;
}

.keyword-card,
.result-row {
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

.result-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  color: #1d4ed8;
  flex-shrink: 0;
}

.keyword-rank {
  flex: 0 0 50rpx;
  color: #ef4444;
  font-size: 28rpx;
  font-weight: 900;
  text-align: center;
}

.keyword-main,
.result-main {
  min-width: 0;
  flex: 1;
}

.history-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 16rpx;
}

.history-chip {
  display: inline-flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background: #f1f5f9;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #475569;
}

.history-chip .chip-text {
  margin-right: 8rpx;
}

.close-icon {
  color: #94a3b8;
}.result-name {
  overflow: hidden;
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.keyword-desc,
.result-meta,
.result-duration,
.empty-tip {
  color: var(--app-muted);
  font-size: 22rpx;
}

.keyword-desc,
.result-meta {
  overflow: hidden;
  margin-top: 8rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.history-chip {
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 22rpx;
  font-weight: 700;
}

.result-cover {
  flex: 0 0 84rpx;
  width: 84rpx;
  height: 84rpx;
  border-radius: 18rpx;
  background: #dbeafe;
}

.result-cover.placeholder,
.state-card {
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-card {
  gap: 14rpx;
  min-height: 180rpx;
  color: var(--app-muted);
}

.result-alias {
  color: #94a3b8;
  font-size: 22rpx;
}
</style>
