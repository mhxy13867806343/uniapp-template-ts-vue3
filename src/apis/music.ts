import { createRequest } from '@/hooks/requests'

type AnyRecord = Record<string, any>

export interface MusicBanner {
  imageUrl: string
  targetId: number
  targetTypeTitle: string
  titleColor: string
  typeTitle: string
}

export interface PlaylistItem {
  id: number
  name: string
  coverUrl: string
  playCount: number
  trackCount: number
  copywriter: string
}

export interface SongItem {
  id: number
  name: string
  alias: string[]
  duration: number
  artists: string[]
  albumName: string
  picUrl: string
  publishTime: number
}

export interface TopListItem {
  id: number
  name: string
  coverUrl: string
  description: string
  updateFrequency: string
  tracks: Array<{
    first: string
    second: string
  }>
}

export interface PlaylistDetail {
  id: number
  name: string
  coverUrl: string
  description: string
  playCount: number
  trackCount: number
  creatorName: string
  tags: string[]
  tracks: SongItem[]
}

export interface SongComment {
  id: number
  nickname: string
  avatarUrl: string
  content: string
  likedCount: number
  timeText: string
}

export interface MusicHomeData {
  banners: MusicBanner[]
  playlists: PlaylistItem[]
  newSongs: SongItem[]
  topLists: TopListItem[]
}

export interface SongDetailData {
  song: SongItem | null
  lyric: string
  comments: SongComment[]
}

export interface HotSearchItem {
  searchWord: string
  score: number
  content: string
  iconType: number
}

const MUSIC_API_BASE_URL = import.meta.env.DEV
  ? '/music-api'
  : 'https://neteasecloudmusicapi-main-api.vercel.app'

const musicRequest = createRequest({
  baseUrl: MUSIC_API_BASE_URL,
  showErrorToast: true
})

function toArtistNames(song: AnyRecord) {
  const source = Array.isArray(song.ar)
    ? song.ar
    : Array.isArray(song.artists)
      ? song.artists
      : []

  return source
    .map(item => String(item?.name || '').trim())
    .filter(Boolean)
}

function toSongItem(song: AnyRecord): SongItem {
  return {
    id: Number(song.id || 0),
    name: String(song.name || ''),
    alias: (Array.isArray(song.alia) ? song.alia : Array.isArray(song.alias) ? song.alias : []).filter(Boolean),
    duration: Number(song.dt ?? song.duration ?? 0),
    artists: toArtistNames(song),
    albumName: String(song.al?.name || song.album?.name || ''),
    picUrl: String(song.al?.picUrl || song.album?.picUrl || song.picUrl || ''),
    publishTime: Number(song.publishTime || 0)
  }
}

function toPlaylistItem(item: AnyRecord): PlaylistItem {
  return {
    id: Number(item.id || 0),
    name: String(item.name || ''),
    coverUrl: String(item.picUrl || item.coverImgUrl || ''),
    playCount: Number(item.playCount || 0),
    trackCount: Number(item.trackCount || 0),
    copywriter: String(item.copywriter || '')
  }
}

function formatCommentTime(value: number) {
  if (!value) return ''
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

export async function getMusicHomeData(): Promise<MusicHomeData> {
  const [bannerData, playlistData, newSongData, topListData] = await Promise.all([
    musicRequest<{ banners?: AnyRecord[] }>({
      url: '/banner',
      data: { type: 0 }
    }),
    musicRequest<{ result?: AnyRecord[] }>({
      url: '/personalized',
      data: { limit: 6 }
    }),
    musicRequest<{ data?: AnyRecord[] }>({
      url: '/top/song',
      data: { type: 0 }
    }),
    musicRequest<{ list?: AnyRecord[] }>({
      url: '/toplist/detail'
    })
  ])

  return {
    banners: (bannerData.banners || []).slice(0, 6).map(item => ({
      imageUrl: String(item.imageUrl || ''),
      targetId: Number(item.targetId || 0),
      targetTypeTitle: String(item.targetTypeTitle || ''),
      titleColor: String(item.titleColor || ''),
      typeTitle: String(item.typeTitle || '')
    })),
    playlists: (playlistData.result || []).slice(0, 6).map(toPlaylistItem),
    newSongs: (newSongData.data || []).slice(0, 8).map(toSongItem),
    topLists: (topListData.list || []).slice(0, 4).map(item => ({
      id: Number(item.id || 0),
      name: String(item.name || ''),
      coverUrl: String(item.coverImgUrl || ''),
      description: String(item.description || ''),
      updateFrequency: String(item.updateFrequency || ''),
      tracks: Array.isArray(item.tracks) ? item.tracks.slice(0, 3) : []
    }))
  }
}

export async function searchSongs(keywords: string, limit = 20) {
  const data = await musicRequest<{ result?: { songs?: AnyRecord[] } }>({
    url: '/search',
    data: {
      keywords,
      limit,
      type: 1
    }
  })

  return (data.result?.songs || []).map(toSongItem)
}

export async function getHotSearches(limit = 10) {
  const data = await musicRequest<{ data?: AnyRecord[] }>({
    url: '/search/hot/detail'
  })

  return (data.data || []).slice(0, limit).map(item => ({
    searchWord: String(item.searchWord || ''),
    score: Number(item.score || 0),
    content: String(item.content || ''),
    iconType: Number(item.iconType || 0)
  })) as HotSearchItem[]
}

export async function getPlaylistDetail(id: string | number): Promise<PlaylistDetail> {
  const data = await musicRequest<{ playlist?: AnyRecord }>({
    url: '/playlist/detail',
    data: { id }
  })

  const playlist = data.playlist || {}

  return {
    id: Number(playlist.id || 0),
    name: String(playlist.name || ''),
    coverUrl: String(playlist.coverImgUrl || ''),
    description: String(playlist.description || ''),
    playCount: Number(playlist.playCount || 0),
    trackCount: Number(playlist.trackCount || 0),
    creatorName: String(playlist.creator?.nickname || ''),
    tags: Array.isArray(playlist.tags) ? playlist.tags.filter(Boolean) : [],
    tracks: Array.isArray(playlist.tracks) ? playlist.tracks.map(toSongItem) : []
  }
}

export async function getSongUrl(id: string | number): Promise<string> {
  const data = await musicRequest<{ data?: AnyRecord[] }>({
    url: '/song/url/v1',
    data: { id, level: 'exhigh' }
  })
  return String(data.data?.[0]?.url || '')
}

export async function getSongDetail(id: string | number): Promise<SongDetailData> {
  const [songData, lyricData, commentData] = await Promise.all([
    musicRequest<{ songs?: AnyRecord[] }>({
      url: '/song/detail',
      data: { ids: id }
    }),
    musicRequest<{ lrc?: { lyric?: string } }>({
      url: '/lyric',
      data: { id }
    }),
    musicRequest<{ comments?: AnyRecord[] }>({
      url: '/comment/music',
      data: {
        id,
        limit: 10
      }
    })
  ])

  return {
    song: songData.songs?.[0] ? toSongItem(songData.songs[0]) : null,
    lyric: String(lyricData.lrc?.lyric || ''),
    comments: (commentData.comments || []).map(item => ({
      id: Number(item.commentId || 0),
      nickname: String(item.user?.nickname || ''),
      avatarUrl: String(item.user?.avatarUrl || ''),
      content: String(item.content || ''),
      likedCount: Number(item.likedCount || 0),
      timeText: formatCommentTime(Number(item.time || 0))
    }))
  }
}
