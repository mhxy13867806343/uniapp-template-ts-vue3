import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSongUrl, type SongItem } from '@/apis/music'

export type PlayMode = 'order' | 'loop' | 'shuffle'

const PLAY_MODE_TEXT: Record<PlayMode, string> = {
  order: '顺序播放',
  loop: '单曲循环',
  shuffle: '随机播放'
}

export const useMusicStore = defineStore('music', () => {
  const playlist = ref<SongItem[]>([])
  const currentIndex = ref(-1)
  const playing = ref(false)
  const playMode = ref<PlayMode>('order')

  const modeCache = uni.getStorageSync('music:play_mode')
  if (modeCache === 'order' || modeCache === 'loop' || modeCache === 'shuffle') {
    playMode.value = modeCache
  }
  const currentTime = ref(0)
  const duration = ref(0)
  const playHistory = ref<SongItem[]>([])
  const favoriteSongs = ref<SongItem[]>([])

  const historyCache = uni.getStorageSync('music:play_history')
  if (Array.isArray(historyCache)) playHistory.value = historyCache

  const favoriteCache = uni.getStorageSync('music:favorite_songs')
  if (Array.isArray(favoriteCache)) favoriteSongs.value = favoriteCache

  const playlistVisible = ref(false)

  const currentSong = computed(() => {
    if (currentIndex.value >= 0 && currentIndex.value < playlist.value.length) {
      return playlist.value[currentIndex.value]
    }
    return null
  })

  let innerAudioContext: UniApp.InnerAudioContext | null = null

  function getAudioContext() {
    if (!innerAudioContext) {
      innerAudioContext = uni.createInnerAudioContext()
      
      innerAudioContext.onPlay(() => {
        playing.value = true
      })
      
      innerAudioContext.onPause(() => {
        playing.value = false
      })
      
      innerAudioContext.onStop(() => {
        playing.value = false
      })
      
      innerAudioContext.onEnded(() => {
        playing.value = false
        handleSongEnd()
      })
      
      innerAudioContext.onTimeUpdate(() => {
        if (innerAudioContext) {
          currentTime.value = innerAudioContext.currentTime
          duration.value = innerAudioContext.duration
        }
      })
      
      innerAudioContext.onError((res) => {
        console.error('Audio error', res)
        playing.value = false
        uni.showToast({ title: '播放失败', icon: 'none' })
      })
    }
    return innerAudioContext
  }

  function addToHistory(song: SongItem) {
    const list = [song, ...playHistory.value.filter(s => s.id !== song.id)].slice(0, 100)
    playHistory.value = list
    uni.setStorageSync('music:play_history', list)
  }

  function toggleFavorite(song: SongItem) {
    const index = favoriteSongs.value.findIndex(s => s.id === song.id)
    if (index > -1) {
      favoriteSongs.value.splice(index, 1)
    } else {
      favoriteSongs.value.unshift(song)
    }
    uni.setStorageSync('music:favorite_songs', favoriteSongs.value)
  }

  function isFavorite(songId: number) {
    return favoriteSongs.value.some(s => s.id === songId)
  }

  function addSong(song: SongItem) {
    const existingIndex = playlist.value.findIndex(s => s.id === song.id)
    if (existingIndex > -1) {
      uni.showToast({ title: '已在播放列表中', icon: 'none' })
      return false
    }
    playlist.value.push(song)
    uni.showToast({ title: '已添加到播放列表', icon: 'success' })
    if (playlist.value.length === 1) {
      currentIndex.value = 0
      startPlayback()
    }
    return true
  }

  async function playSong(song: SongItem, list: SongItem[] = []) {
    if (list.length > 0) {
      playlist.value = [...list]
      currentIndex.value = playlist.value.findIndex(s => s.id === song.id)
      if (currentIndex.value === -1) {
        playlist.value.unshift(song)
        currentIndex.value = 0
      }
    } else {
      const existingIndex = playlist.value.findIndex(s => s.id === song.id)
      if (existingIndex > -1) {
        currentIndex.value = existingIndex
      } else {
        playlist.value.unshift(song)
        currentIndex.value = 0
      }
    }

    addToHistory(song)
    await startPlayback()
  }

  async function startPlayback() {
    const song = currentSong.value
    if (!song) return
    
    uni.showLoading({ title: '加载中' })
    try {
      const url = await getSongUrl(song.id)
      if (!url) {
        uni.showToast({ title: '暂无音源', icon: 'none' })
        return
      }
      
      const audio = getAudioContext()
      audio.src = url
      audio.play()
    } catch (e) {
      uni.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      uni.hideLoading()
    }
  }

  function togglePlay() {
    const audio = getAudioContext()
    if (playing.value) {
      audio.pause()
    } else {
      if (!audio.src && currentSong.value) {
        startPlayback()
      } else {
        audio.play()
      }
    }
  }

  function getRandomIndex() {
    if (playlist.value.length <= 1) return currentIndex.value
    let next = currentIndex.value
    while (next === currentIndex.value) {
      next = Math.floor(Math.random() * playlist.value.length)
    }
    return next
  }

  function handleSongEnd() {
    if (playlist.value.length === 0) return
    if (playMode.value === 'loop') {
      startPlayback()
      return
    }
    playNext()
  }

  function playNext() {
    if (playlist.value.length === 0) return
    currentIndex.value = playMode.value === 'shuffle'
      ? getRandomIndex()
      : (currentIndex.value + 1) % playlist.value.length
    startPlayback()
  }

  function playPrev() {
    if (playlist.value.length === 0) return
    currentIndex.value = playMode.value === 'shuffle'
      ? getRandomIndex()
      : (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
    startPlayback()
  }

  function togglePlayMode() {
    const modes: PlayMode[] = ['order', 'loop', 'shuffle']
    const next = modes[(modes.indexOf(playMode.value) + 1) % modes.length]
    playMode.value = next
    uni.setStorageSync('music:play_mode', next)
    uni.showToast({ title: PLAY_MODE_TEXT[next], icon: 'none' })
  }

  const playModeText = computed(() => PLAY_MODE_TEXT[playMode.value])

  function seek(position: number) {
    const audio = getAudioContext()
    audio.seek(position)
  }

  return {
    playlist,
    currentIndex,
    currentSong,
    playing,
    currentTime,
    duration,
    playHistory,
    favoriteSongs,
    playlistVisible,
    playMode,
    playModeText,
    playSong,
    addSong,
    togglePlay,
    togglePlayMode,
    playNext,
    playPrev,
    seek,
    toggleFavorite,
    isFavorite,
    addToHistory
  }
})
