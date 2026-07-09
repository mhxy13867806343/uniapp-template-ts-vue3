<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('video-toast')

// Active video item ID (0 is gallery catalog/lobby, 1-15 is specific layouts)
const activeId = ref(0)

onLoad((query) => {
  if (typeof query?.id === 'string') {
    activeId.value = parseInt(query.id) || 0
  }
})

function goBackToCatalog() {
  activeId.value = 0
  uni.redirectTo({
    url: '/pages/examples/video-gallery'
  })
}

function selectTemplate(id: number) {
  activeId.value = id
  uni.navigateTo({
    url: `/pages/examples/video-gallery?id=${id}`
  })
}

// 15 video templates registry
const templatesList = [
  { id: 1, title: '抖音竖屏短视频流', desc: '全屏手势滑动视频流，附带悬浮侧边栏。', tag: '短视频' },
  { id: 2, title: '手势控制自定义面板', desc: '划动视频屏幕控制亮度、音量和进度反馈。', tag: '手势' },
  { id: 3, title: '弹幕大片播放器', desc: '视频上方平滑滚动多道弹幕，支持实时发射。', tag: '弹幕' },
  { id: 4, title: '剧集章节右滑抽屉', desc: '右侧推拉章节列表（1-10集），含单集进度。', tag: '列表' },
  { id: 5, title: '帧缩略图拖动预览', desc: '拖动播放滑轨实时在上方悬浮展示微缩帧画面。', tag: '交互' },
  { id: 6, title: '互动剧情选择剧场', desc: '指定时间暂停，用户做出路线选择改变剧情分支。', tag: '互动' },
  { id: 7, title: '多机位/视角无缝切换', desc: '点击快速在主舞台、广角、侧位中切换视频流。', tag: '多视角' },
  { id: 8, title: '画面滤镜与特效微调', desc: '实时滑杆调节视频灰度、复古、色相旋转等特效。', tag: '滤镜' },
  { id: 9, title: '音频电台/听剧模式', desc: '视频屏息黑屏切换到唱片旋转的播客电台播放。', tag: '电台' },
  { id: 10, title: '精彩看点打点进度', desc: '进度条标出关键节点，点击直接跳转看点。', tag: '导航' },
  { id: 11, title: '悬浮画中画小窗播放', desc: '页面下滑浏览内容时，视频自动缩放到右下角。', tag: '画中画' },
  { id: 12, title: '中英双语字幕同步', desc: '歌词字幕逐字逐句点亮渲染，保持高同步率。', tag: '字幕' },
  { id: 13, title: '防盗录移动水印蒙层', desc: '对角线漂移倾斜文本，保障原创版权安全。', tag: '版权' },
  { id: 14, title: '直播带货互动弹幕流', desc: '带货界面，左侧滚动弹幕气泡加右侧飘红心。', tag: '直播' },
  { id: 15, title: '倍速与音调控制器', desc: '提供 0.5x 到 2.0x 倍速调节，支持滑动变更。', tag: '控制' },
  { id: 16, title: '高保真全功能控制台', desc: '合集标签、章节切换、弹幕发射、清屏连播及画中画小图标的终极控制台。', tag: '精选' }
]

// ==========================================
// 15种视频交互各自的状态与模拟逻辑
// ==========================================

// 1. TikTok: swipe mockup
const tiktokLike = ref(false)
const tiktokLikesCount = ref(1280)

// 2. Gesture Controls: Touch tracking
const gestureText = ref('手势待机中，在视频框上划动试试')
const gestureValue = ref('')
let touchStartX = 0
let touchStartY = 0

function handleTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  touchStartX = touch.clientX
  touchStartY = touch.clientY
}

function handleTouchMove(e: TouchEvent) {
  const touch = e.touches[0]
  const deltaX = touch.clientX - touchStartX
  const deltaY = touch.clientY - touchStartY
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal scrubbing
    gestureText.value = '调节播放进度'
    gestureValue.value = deltaX > 0 ? '快进 >> ' + Math.floor(deltaX / 5) + '秒' : '快退 << ' + Math.floor(Math.abs(deltaX) / 5) + '秒'
  } else {
    // Vertical sound/light
    const screenWidth = uni.getSystemInfoSync().screenWidth
    if (touchStartX < screenWidth / 2) {
      gestureText.value = '调节左侧：屏幕亮度'
      gestureValue.value = `亮度: ${Math.min(100, Math.max(0, 50 - Math.floor(deltaY / 2)))}%`
    } else {
      gestureText.value = '调节右侧：媒体音量'
      gestureValue.value = `音量: ${Math.min(100, Math.max(0, 40 - Math.floor(deltaY / 2)))}%`
    }
  }
}

function handleTouchEnd() {
  setTimeout(() => {
    gestureText.value = '手势已记录'
    gestureValue.value = ''
  }, 1000)
}

// 3. Danmaku lists
interface Danmaku {
  id: number
  text: string
  top: number
  delay: string
}
const danmakuInput = ref('')
const danmakus = ref<Danmaku[]>([
  { id: 1, text: '前方高能预警！！！', top: 20, delay: '0s' },
  { id: 2, text: '吹爆这个镜头，太赞了！', top: 60, delay: '1s' },
  { id: 3, text: '哈哈哈哈，这也太秀了吧', top: 100, delay: '2.5s' },
  { id: 4, text: '打卡打卡，第5遍了', top: 140, delay: '4s' }
])

function sendDanmaku() {
  if (!danmakuInput.value.trim()) return
  const id = Date.now()
  danmakus.value.push({
    id,
    text: danmakuInput.value,
    top: 20 + Math.random() * 120,
    delay: '0s'
  })
  danmakuInput.value = ''
  toast.success('弹幕已发射')
}

// 4. Playlist Drawer
const showEpisodes = ref(false)
const activeEpisode = ref(1)

// 5. Scrubbing Hover frame
const scrubPercent = ref(30)
const thumbSrc = computed(() => {
  if (scrubPercent.value < 20) return '🌅 序章：日出峡谷'
  if (scrubPercent.value < 50) return '⚔ 战斗：两军对垒'
  if (scrubPercent.value < 80) return '🏰 探索：城堡奇遇'
  return '🏆 终章：凯旋加冕'
})

// 6. Interactive choice
const storylineActive = ref(true)
const storylineSegment = ref('intro') // intro | optionA | optionB

function selectStory(option: 'A' | 'B') {
  storylineSegment.value = option === 'A' ? 'optionA' : 'optionB'
  storylineActive.value = false
  toast.success(option === 'A' ? '您选择了【正面突围】' : '您选择了【乔装混入】')
}

// 7. Cameras switcher
const activeCamera = ref(1)

// 8. Filters
const filterGray = ref(0)
const filterSepia = ref(0)
const filterHue = ref(0)

// 9. Podcast mode
const isPodcast = ref(false)

// 10. Markers
const videoProgress = ref(0)
const markers = [
  { time: 20, title: '精彩打斗' },
  { time: 65, title: '悬疑反转' },
  { time: 90, title: '泪目高潮' }
]

function jumpToMarker(time: number, title: string) {
  videoProgress.value = time
  toast.success(`已跳转至【${title}】`)
}

// 11. PIP float
const showPip = ref(false)

// 12. Subtitle track
const lyrics = [
  { time: 0, cn: '在人海中 寻找你的身影', en: 'Searching for you in the crowd' },
  { time: 10, cn: '夜空闪烁 繁星点点', en: 'Stars flashing in the night sky' },
  { time: 20, cn: '我们终将 拥抱彼此', en: 'We will embrace each other eventually' }
]
const activeLyricIdx = ref(0)

function setLyricTime(idx: number) {
  activeLyricIdx.value = idx
}

// 14. Live stream simulated
const liveComments = ref<string[]>(['张伟: 主播真给力！', '李娜: 已经下单了，划算', '王刚: 顺丰包邮吗？'])
let liveTimer: any = null

function addLiveComment() {
  const names = ['赵六', '孙七', '周八', '吴九']
  const msgs = ['赞赞赞！', '物美价廉！', '太有用了', '买它买它！']
  const raw = `${names[Math.floor(Math.random() * names.length)]}: ${msgs[Math.floor(Math.random() * msgs.length)]}`
  liveComments.value.push(raw)
  if (liveComments.value.length > 5) liveComments.value.shift()
}

onMounted(() => {
  liveTimer = setInterval(addLiveComment, 2500)
})

onUnload(() => {
  clearInterval(liveTimer)
})

// 14. Heart floatings
interface FloatHeart {
  id: number
  left: string
  delay: string
}
const hearts = ref<FloatHeart[]>([])

function triggerHeart() {
  const id = Date.now()
  hearts.value.push({
    id,
    left: `${20 + Math.random() * 60}%`,
    delay: `${Math.random() * 0.2}s`
  })
  setTimeout(() => {
    hearts.value = hearts.value.filter(h => h.id !== id)
  }, 1000)
}

// 15. Speed
const videoSpeed = ref(1.0)

// 16. Premium Bilibili/Douyin Player Console states
const t16Danmakus = ref<string[]>([
  '这是公元前238年的秦国版图',
  '前方高能预警！！！',
  '李牧死，赵国亡，令人唏嘘',
  '历史大片，打卡打卡！',
  '科普牛逼！三连支持'
])
const t16Input = ref('')
const t16DanmakuToggle = ref(true)
const t16Autoplay = ref(true)
const t16ClearScreen = ref(false)
const t16VolumeMute = ref(false)
const t16TheaterMode = ref(false)
const t16Fullscreen = ref(false)
const t16ActiveChapterIdx = ref(0)
const t16ChaptersList = [
  '第1章：秦国的东出战争',
  '第2章：长平之战余波',
  '第3章：合纵攻秦的终结',
  '第4章：李牧重整旗鼓'
]
const t16CurrentTimeSec = ref(2)
const t16FormattedTime = computed(() => {
  const min = Math.floor(t16CurrentTimeSec.value / 60).toString().padStart(2, '0')
  const sec = (t16CurrentTimeSec.value % 60).toString().padStart(2, '0')
  return `${min}:${sec} / 05:20`
})

function t16SendDanmaku() {
  if (!t16Input.value.trim()) return
  t16Danmakus.value.push(t16Input.value)
  t16Input.value = ''
  toast.success('弹幕已发射')
}

function t16NextChapter() {
  t16ActiveChapterIdx.value = (t16ActiveChapterIdx.value + 1) % t16ChaptersList.length
  t16CurrentTimeSec.value = 0
  toast.success(`已切换至: ${t16ChaptersList[t16ActiveChapterIdx.value]}`)
}
</script>

<template>
  <PageShell title="视频创意展示" description="包含 15 个风格迥异的视频组件与交互演示，已为跨端适配优化。">
    <view class="video-gallery-page">
      <wd-toast selector="video-toast" />

      <!-- ==========================================
           1. 视频组件大厅（目录视图） - activeId === 0
           ========================================== -->
      <view v-if="activeId === 0" class="video-lobby">
        <view class="lobby-headline-card">
          <view class="lobby-title">多端视频交互百宝箱</view>
          <view class="lobby-desc">针对各种特定高阶业务场景封装的 15 种视频演示模板。</view>
        </view>

        <view class="lobby-grid">
          <view
            v-for="v in templatesList"
            :key="v.id"
            class="lobby-item"
            @click="selectTemplate(v.id)"
          >
            <view class="item-head">
              <text class="item-id">#{{ String(v.id).padStart(2, '0') }}</text>
              <wd-tag size="small" type="primary" plain>{{ v.tag }}</wd-tag>
            </view>
            <view class="item-title">{{ v.title }}</view>
            <view class="item-desc">{{ v.desc }}</view>
          </view>
        </view>
      </view>

      <!-- ==========================================
           2. 视频演示画布 - activeId 1 至 15
           ========================================== -->
      <view v-else class="video-sandbox">
        <!-- Back button header -->
        <view class="sandbox-head">
          <wd-button size="small" type="neutral" icon="arrow-left" plain @click="goBackToCatalog">返回目录</wd-button>
          <text class="sandbox-title">{{ templatesList[activeId - 1]?.title }}</text>
        </view>

        <view class="sandbox-body">
          
          <!-- ID 1: TikTok Short Video Feed -->
          <view v-if="activeId === 1" class="tiktok-wrapper">
            <view class="tiktok-video-box">
              <text class="tiktok-placeholder">🎬 竖屏短视频流模拟</text>
              <!-- Left bottom description -->
              <view class="tiktok-info">
                <text class="tiktok-author">@前端架构师</text>
                <text class="tiktok-desc-txt">模板一键升级，解锁 15 种全新高级视频特写！</text>
              </view>
              <!-- Right floating buttons -->
              <view class="tiktok-actions">
                <view :class="['action-icon-circle', { active: tiktokLike }]" @click="tiktokLike = !tiktokLike; tiktokLikesCount += tiktokLike ? 1 : -1">
                  <text class="emoji-heart">❤</text>
                  <text class="count-val">{{ tiktokLikesCount }}</text>
                </view>
                <view class="action-icon-circle mt-3">
                  <text class="emoji-heart">💬</text>
                  <text class="count-val">288</text>
                </view>
              </view>
            </view>
            <view class="tiktok-swipe-tips">手指在此滑动可切换视频</view>
          </view>

          <!-- ID 2: Gesture Controls -->
          <view v-else-if="activeId === 2" class="gesture-video-wrapper">
            <view
              class="gesture-canvas"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
            >
              <text class="gesture-placeholder-txt">🎬 触控此处手势感应</text>
              
              <view class="gesture-status-bar">
                <view class="g-txt">{{ gestureText }}</view>
                <view class="g-val font-bold text-brand">{{ gestureValue }}</view>
              </view>
            </view>
          </view>

          <!-- ID 3: Danmaku video player -->
          <view v-else-if="activeId === 3" class="danmaku-video-wrapper">
            <view class="danmaku-canvas">
              <text class="danmaku-placeholder">🎬 弹幕轨道叠加器</text>
              
              <!-- Danmaku channels -->
              <view
                v-for="d in danmakus"
                :key="d.id"
                class="danmaku-text"
                :style="{ top: d.top + 'rpx', animationDelay: d.delay }"
              >
                {{ d.text }}
              </view>
            </view>
            
            <view class="danmaku-input-row mt-3">
              <input v-model="danmakuInput" type="text" placeholder="说点什么发射弹幕..." class="dm-input-bar" />
              <wd-button size="small" type="primary" @click="sendDanmaku" class="ml-2">发射</wd-button>
            </view>
          </view>

          <!-- ID 4: Playlist drawer -->
          <view v-else-if="activeId === 4" class="playlist-video-wrapper">
            <view class="playlist-flex">
              <view class="video-play-box-left">
                <text class="mini-placeholder">🎬 第 {{ activeEpisode }} 集播放中</text>
              </view>
              <view :class="['episode-drawer-right', { active: showEpisodes }]">
                <view class="drawer-header" @click="showEpisodes = !showEpisodes">
                  <text>目录章节列表 (展开/收起)</text>
                </view>
                <view class="drawer-ep-list">
                  <view
                    v-for="ep in [1, 2, 3, 4, 5, 6, 7, 8]"
                    :key="ep"
                    :class="['ep-cell', { active: activeEpisode === ep }]"
                    @click="activeEpisode = ep"
                  >
                    <text class="ep-num">第{{ ep }}集</text>
                    <text class="ep-prog">进度：{{ ep < activeEpisode ? '100%' : ep === activeEpisode ? '45%' : '0%' }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- ID 5: Scrubbing Thumbnails -->
          <view v-else-if="activeId === 5" class="scrub-video-wrapper text-center">
            <view class="scrub-player">
              <text class="scrub-pl-icon">🎬 电影正片播放</text>
              <!-- Hover Thumbnail tooltip -->
              <view class="thumbnail-tooltip" :style="{ left: scrubPercent + '%' }">
                <view class="thumb-mini-pic">{{ thumbSrc }}</view>
                <view class="thumb-indicator">{{ Math.floor(scrubPercent * 1.8) }}分</view>
              </view>
            </view>
            
            <view class="scrub-slider-track mt-3">
              <slider
                :value="scrubPercent"
                :min="0"
                :max="100"
                active-color="#1e88e5"
                block-size="20"
                @change="scrubPercent = $event.detail.value"
                @changing="scrubPercent = $event.detail.value"
              />
            </view>
          </view>

          <!-- ID 6: Interactive Choice -->
          <view v-else-if="activeId === 6" class="story-video-wrapper">
            <view class="story-player">
              <!-- Segment intro -->
              <view v-if="storylineSegment === 'intro'" class="story-layout">
                <text class="story-pl">🎬 剧情播放中 (前路遭遇黑风寨)</text>
                <view v-if="storylineActive" class="story-choices-overlay">
                  <view class="choice-title">🚨 做出你的抉择：</view>
                  <view class="choice-btns mt-2">
                    <wd-button size="small" type="primary" @click="selectStory('A')">选项A. 正面强行突围</wd-button>
                    <wd-button size="small" type="warning" class="ml-2" @click="selectStory('B')">选项B. 乔装打扮混入</wd-button>
                  </view>
                </view>
              </view>
              
              <!-- Segment A -->
              <view v-else-if="storylineSegment === 'optionA'" class="story-layout bg-red">
                <text class="story-pl text-white">🎬 战斗模式：突破包围圈成功通关！</text>
                <wd-button size="small" type="neutral" plain @click="storylineSegment = 'intro'; storylineActive = true" class="reset-story-btn">重置剧情</wd-button>
              </view>

              <!-- Segment B -->
              <view v-else-if="storylineSegment === 'optionB'" class="story-layout bg-green">
                <text class="story-pl text-white">🎬 潜行模式：乔装成功，平安通过哨卡！</text>
                <wd-button size="small" type="neutral" plain @click="storylineSegment = 'intro'; storylineActive = true" class="reset-story-btn">重置剧情</wd-button>
              </view>
            </view>
          </view>

          <!-- ID 7: Multi-Camera -->
          <view v-else-if="activeId === 7" class="camera-video-wrapper">
            <view class="camera-main-player">
              <text class="c-main-txt">🎬 当前显示机位: 【机位 {{ activeCamera }}】</text>
            </view>
            
            <view class="camera-thumbnails mt-3">
              <view :class="['cam-thumb', { active: activeCamera === 1 }]" @click="activeCamera = 1">
                <text class="t-icon">🎥</text>
                <text class="t-lbl">机位一 (广角)</text>
              </view>
              <view :class="['cam-thumb', { active: activeCamera === 2 }]" @click="activeCamera = 2">
                <text class="t-icon">🎥</text>
                <text class="t-lbl">机位二 (近景)</text>
              </view>
              <view :class="['cam-thumb', { active: activeCamera === 3 }]" @click="activeCamera = 3">
                <text class="t-icon">🎥</text>
                <text class="t-lbl">机位三 (特写)</text>
              </view>
            </view>
          </view>

          <!-- ID 8: Video Filters -->
          <view v-else-if="activeId === 8" class="filter-video-wrapper">
            <view
              class="filter-player-box"
              :style="{
                filter: 'grayscale(' + filterGray + '%) sepia(' + filterSepia + '%) hue-rotate(' + filterHue + 'deg)'
              }"
            >
              <text class="f-pl-txt">🎬 视频画面 (调节滤镜控制色彩)</text>
            </view>
            
            <view class="filter-sliders-list mt-3">
              <view class="slider-row">
                <text class="s-lbl">黑白灰度: {{ filterGray }}%</text>
                <slider :value="filterGray" :min="0" :max="100" @change="filterGray = $event.detail.value" active-color="#1e88e5" />
              </view>
              <view class="slider-row mt-2">
                <text class="s-lbl">复古怀旧: {{ filterSepia }}%</text>
                <slider :value="filterSepia" :min="0" :max="100" @change="filterSepia = $event.detail.value" active-color="#1e88e5" />
              </view>
              <view class="slider-row mt-2">
                <text class="s-lbl">色相旋转: {{ filterHue }}°</text>
                <slider :value="filterHue" :min="0" :max="360" @change="filterHue = $event.detail.value" active-color="#1e88e5" />
              </view>
            </view>
          </view>

          <!-- ID 9: Podcast mode -->
          <view v-else-if="activeId === 9" class="podcast-video-wrapper text-center">
            <view :class="['podcast-canvas', { black: isPodcast }]">
              <view v-if="!isPodcast" class="video-standard-box">
                <text class="std-txt">🎬 视频画面正常播放中</text>
              </view>
              <view v-else class="audio-cd-box">
                <view class="spinning-vinyl-disc">📀</view>
                <text class="spinning-txt">电台音频模式播放中</text>
              </view>
            </view>
            
            <wd-button type="primary" block class="mt-4" @click="isPodcast = !isPodcast">
              {{ isPodcast ? '切回视频画面' : '切换听剧/电台模式' }}
            </wd-button>
          </view>

          <!-- ID 10: Highlights markers -->
          <view v-else-if="activeId === 10" class="marker-video-wrapper">
            <view class="marker-player">
              <text class="mk-pl-txt">🎬 精彩瞬间打卡点 (已播放: {{ videoProgress }}s)</text>
            </view>
            
            <!-- Custom Progress bar with dots -->
            <view class="custom-progress-bar-container mt-3">
              <view class="bar-line"></view>
              <view class="active-bar-line" :style="{ width: videoProgress + '%' }"></view>
              <!-- Highlight dot markers -->
              <view
                v-for="m in markers"
                :key="m.time"
                class="highlight-dot"
                :style="{ left: m.time + '%' }"
                @click="jumpToMarker(m.time, m.title)"
              >
                <view class="dot-desc-tooltip">{{ m.title }}</view>
              </view>
            </view>
          </view>

          <!-- ID 11: PIP float -->
          <view v-slot:default v-else-if="activeId === 11" class="pip-video-wrapper">
            <view class="flex items-center justify-between">
              <text class="pip-title font-bold">文章长页面小窗模式</text>
              <wd-button size="small" type="primary" plain @click="showPip = !showPip">
                {{ showPip ? '关闭悬浮小窗' : '启动小窗模拟' }}
              </wd-button>
            </view>
            
            <view class="pip-scroll-preview-article mt-3">
              <view class="article-paragraph">文章首段：UniApp 是一款基于 Vue.js 的跨端解决方案...</view>
              <view class="article-paragraph mt-2">文章二段：框架底层设计支持多端打包编译，支持高效打包和原生渲染渲染能力...</view>
              <view class="article-paragraph mt-2">文章三段：开发者仅需维护一套代码即可快速分发到各大平台...</view>
            </view>

            <!-- Sticky overlay floating window -->
            <view v-if="showPip" class="sticky-pip-overlay-mini">
              <text class="mini-pip-pl">🎬 画中画播放中</text>
              <text class="mini-pip-close" @click="showPip = false">×</text>
            </view>
          </view>

          <!-- ID 12: Lyric Sync -->
          <view v-else-if="activeId === 12" class="lyric-video-wrapper text-center">
            <view class="lyric-player">
              <text class="ly-pl">🎬 音乐卡拉OK同步</text>
            </view>
            
            <view class="lyrics-lines-container mt-3">
              <view
                v-for="(ly, idx) in lyrics"
                :key="idx"
                :class="['lyric-row-line', { active: activeLyricIdx === idx }]"
                @click="setLyricTime(idx)"
              >
                <view class="cn">{{ ly.cn }}</view>
                <view class="en">{{ ly.en }}</view>
              </view>
            </view>
          </view>

          <!-- ID 13: Floating Watermark -->
          <view v-else-if="activeId === 13" class="watermark-video-wrapper relative-context overflow-hidden">
            <view class="watermark-player">
              <text class="wt-pl">🎬 原创视频画面（带移动版权水印）</text>
            </view>
            
            <!-- Drifting secure watermarks -->
            <view class="drifting-watermark-overlay">
              <view class="drift-txt d1">UniApp Template 2026</view>
              <view class="drift-txt d2">工号: 9527 (防盗拷贝)</view>
            </view>
          </view>

          <!-- ID 14: Live comments -->
          <view v-else-if="activeId === 14" class="live-video-wrapper">
            <view class="live-screen-mock" @click="triggerHeart">
              <text class="live-banner">🔴 直播带货中</text>
              <view class="live-product-box">🛍️ 爆款西瓜 ¥9.90</view>
              
              <!-- Left Chat message bubbles scrolling -->
              <view class="live-chat-stream">
                <view v-for="(comment, cIdx) in liveComments" :key="cIdx" class="live-comment-bubble">
                  {{ comment }}
                </view>
              </view>

              <!-- Floating hearts container -->
              <view class="hearts-floating-canvas">
                <view
                  v-for="h in hearts"
                  :key="h.id"
                  class="floating-heart"
                  :style="{ left: h.left, animationDelay: h.delay }"
                >
                  ❤
                </view>
              </view>
            </view>
            <view class="live-click-tip mt-2">点击直播屏幕可增加红色爱心点赞数！</view>
          </view>

          <!-- ID 15: Speed Control -->
          <view v-else-if="activeId === 15" class="speed-video-wrapper text-center">
            <view class="speed-player">
              <text class="speed-pl-txt">🎬 视频播放中 (当前倍速: {{ videoSpeed }}x)</text>
            </view>
            
            <view class="speed-selector-row mt-4">
              <wd-button
                v-for="sp in [0.5, 1.0, 1.25, 1.5, 2.0]"
                :key="sp"
                size="small"
                :type="videoSpeed === sp ? 'primary' : 'neutral'"
                plain
                @click="videoSpeed = sp; toast.success('已切换到 ' + sp + 'x 倍速')"
              >
                {{ sp }}x
              </wd-button>
            </view>
          </view>

          <!-- ID 16: Premium Full Featured Player Console -->
          <view v-else-if="activeId === 16" class="premium-player-wrapper">
            <view class="premium-video-box relative-context overflow-hidden">
              <view class="video-main-frame">
                <!-- Danmaku stream overlay -->
                <view v-slot:default v-if="t16DanmakuToggle && !t16ClearScreen" class="danmaku-overlay-t16">
                  <view
                    v-for="(dm, dmIdx) in t16Danmakus"
                    :key="dmIdx"
                    class="t16-danmaku-item"
                    :style="{
                      top: (15 + (dmIdx * 20) % 65) + '%',
                      animationDelay: (dmIdx * 1.5) + 's'
                    }"
                  >
                    {{ dm }}
                  </view>
                </view>

                <!-- Subtitle centered overlay -->
                <view class="subtitle-text-overlay font-bold text-center">
                  这是公元前238年的秦国版图
                </view>

                <!-- Custom capsules on top of video -->
                <view class="capsules-overlay flex mt-2">
                  <view class="capsule-badge">合集 · 春秋战国</view>
                  <view class="capsule-badge orange-capsule ml-2">当前提及：李牧为何能成为赵国的守护神</view>
                </view>

                <!-- Creator Overlay (Right interaction bar) -->
                <view class="creator-interaction-bar flex-column items-center">
                  <view class="avatar-box font-bold">拾光</view>
                  <view class="interact-item mt-3">
                    <text class="emoji-icon">❤️</text>
                    <text class="lbl-txt">1.6万</text>
                  </view>
                  <view class="interact-item mt-2">
                    <text class="emoji-icon">💬</text>
                    <text class="lbl-txt">313</text>
                  </view>
                  <view class="interact-item mt-2">
                    <text class="emoji-icon">⭐</text>
                    <text class="lbl-txt">2042</text>
                  </view>
                  <!-- Mascot -->
                  <view class="mascot-douyin mt-3 flex-column items-center">
                    <text class="bee-emoji">🐝</text>
                    <text class="mascot-lbl">听抖音</text>
                  </view>
                </view>
              </view>

              <!-- BOTTOM CONTROL CONSOLE BAR -->
              <view class="bottom-control-console-bar flex items-center justify-between">
                <!-- Left Playback & chapter info -->
                <view class="console-left flex items-center">
                  <text class="play-pause-icon-btn mr-2" @click="t16Autoplay = !t16Autoplay">
                    {{ t16Autoplay ? '⏸' : '▶' }}
                  </text>
                  <text class="time-meta-txt">{{ t16FormattedTime }}</text>
                  <text class="chapter-meta-name font-bold ml-2">{{ t16ChaptersList[t16ActiveChapterIdx] }}</text>
                  <text class="next-chapter-action-btn ml-2" @click="t16NextChapter">下一章 ></text>
                </view>

                <!-- Center Danmaku Input & Toggle -->
                <view class="console-center flex items-center">
                  <view class="danmaku-switch-btn flex items-center mr-2" @click="t16DanmakuToggle = !t16DanmakuToggle">
                    <text class="bullet-symbol-icon">弹</text>
                    <text :class="['toggle-dot', { active: t16DanmakuToggle }]"></text>
                  </view>
                  <input
                    v-model="t16Input"
                    placeholder="发一条友好的弹幕吧"
                    class="danmaku-input-console"
                    confirm-type="send"
                    @confirm="t16SendDanmaku"
                  />
                  <view class="danmaku-send-btn font-bold text-center ml-2" @click="t16SendDanmaku">
                    发送
                  </view>
                </view>

                <!-- Right Quick controls & window modes -->
                <view class="console-right flex items-center">
                  <view class="console-switch-item flex items-center mr-2" @click="t16Autoplay = !t16Autoplay">
                    <text class="sw-lbl">连播</text>
                    <text :class="['sw-dot', { active: t16Autoplay }]"></text>
                  </view>

                  <view class="console-switch-item flex items-center mr-2" @click="t16ClearScreen = !t16ClearScreen">
                    <text class="sw-lbl">清屏</text>
                    <text :class="['sw-dot', { active: t16ClearScreen }]"></text>
                  </view>

                  <text class="speed-toggle-badge font-bold mr-2" @click="toast.success('已切换为智能变速模式')">智能</text>
                  <text class="speed-toggle-badge font-bold mr-2" @click="toast.success('当前倍速: 1.0x')">倍速</text>

                  <text class="small-ctrl-icon-btn mr-1" @click="toast.success('展示分段大纲')">🎛️</text>
                  <text class="small-ctrl-icon-btn mr-1" @click="toast.success('已开启小窗模式')">📺</text>
                  <text class="small-ctrl-icon-btn mr-1" @click="t16VolumeMute = !t16VolumeMute; toast.success(t16VolumeMute ? '静音' : '开启声音')">
                    {{ t16VolumeMute ? '🔇' : '🔊' }}
                  </text>
                  <text class="small-ctrl-icon-btn mr-1" @click="t16TheaterMode = !t16TheaterMode; toast.success('切换为宽屏模式')">🔲</text>
                  <text class="small-ctrl-icon-btn" @click="t16Fullscreen = !t16Fullscreen; toast.success('已切换全屏视效')">🔳</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.video-gallery-page {
  padding-bottom: 60rpx;
}

/* ==========================================
   视频组件大厅目录列表样式
   ========================================== */
.video-lobby {
  display: grid;
  gap: 28rpx;
}

.lobby-headline-card {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 16rpx;
  padding: 36rpx;
  color: #fff;
  box-shadow: 0 8rpx 20rpx rgba(16, 185, 129, 0.2);
}

.lobby-title {
  font-size: 32rpx;
  font-weight: 900;
  margin-bottom: 12rpx;
}

.lobby-desc {
  font-size: 22rpx;
  opacity: 0.85;
  line-height: 1.5;
}

.lobby-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.lobby-item {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.01);
  
  &:active {
    background: #f1f5f9;
  }
}

.item-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-id {
  font-size: 20rpx;
  color: var(--app-muted);
  font-weight: 800;
}

.item-title {
  font-size: 24rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.item-desc {
  font-size: 18rpx;
  color: var(--app-muted);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ==========================================
   视频沙盒画布组件演示样式
   ========================================== */
.video-sandbox {
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #fff;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.02);
}

.sandbox-head {
  display: flex;
  align-items: center;
  gap: 20rpx;
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 20rpx;
  margin-bottom: 24rpx;
}

.sandbox-title {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--app-brand);
}

.sandbox-body {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 24rpx;
  min-height: 420rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.font-bold { font-weight: 800; }
.text-brand { color: var(--app-brand); }
.text-red { color: #ef4444; }
.text-orange { color: #f97316; }
.text-white { color: #fff; }
.bg-red { background: #fca5a5; border-color: #ef4444; }
.bg-green { background: #bbf7d0; border-color: #10b981; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-4 { margin-top: 32rpx; }
.ml-2 { margin-left: 16rpx; }
.text-center { text-align: center; }
.relative-context { position: relative; }
.overflow-hidden { overflow: hidden; }

/* Sub-panels detailed styling */
/* 1. TikTok Shorts Feed */
.tiktok-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tiktok-video-box {
  width: 320rpx;
  height: 450rpx;
  background: #0f172a;
  border-radius: 16rpx;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tiktok-placeholder {
  font-size: 24rpx;
  color: #fff;
}

.tiktok-info {
  position: absolute;
  left: 16rpx;
  bottom: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  width: 200rpx;
}

.tiktok-author {
  font-size: 20rpx;
  font-weight: 800;
  color: #fff;
}

.tiktok-desc-txt {
  font-size: 16rpx;
  color: rgba(255,255,255,0.8);
  line-height: 1.3;
}

.tiktok-actions {
  position: absolute;
  right: 16rpx;
  bottom: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  
  &.active {
    .emoji-heart { color: #f43f5e; }
  }
}

.emoji-heart {
  font-size: 38rpx;
}

.count-val {
  font-size: 16rpx;
  margin-top: 4rpx;
}

.tiktok-swipe-tips {
  font-size: 20rpx;
  color: var(--app-muted);
  margin-top: 16rpx;
}

/* 2. Gesture Controls */
.gesture-video-wrapper {
  display: flex;
  justify-content: center;
}

.gesture-canvas {
  width: 100%;
  height: 280rpx;
  background: #1e293b;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  touch-action: none;
}

.gesture-placeholder-txt {
  font-size: 24rpx;
  color: #64748b;
}

.gesture-status-bar {
  position: absolute;
  bottom: 16rpx;
  background: rgba(0,0,0,0.6);
  padding: 8rpx 20rpx;
  border-radius: 99rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.g-txt { font-size: 18rpx; color: #fff; }
.g-val { font-size: 20rpx; margin-top: 4rpx; }

/* 3. Danmaku */
.danmaku-video-wrapper {
  width: 100%;
}

.danmaku-canvas {
  height: 280rpx;
  background: #0f172a;
  border-radius: 12rpx;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.danmaku-placeholder {
  font-size: 24rpx;
  color: #334155;
}

.danmaku-text {
  position: absolute;
  right: -200px;
  font-size: 21rpx;
  color: #fff;
  font-weight: 800;
  text-shadow: 2rpx 2rpx 2rpx rgba(0,0,0,0.8);
  white-space: nowrap;
  animation: floatDanmaku 8s linear infinite;
}

@keyframes floatDanmaku {
  0% { transform: translateX(0); }
  100% { transform: translateX(-450px); }
}

.danmaku-input-row {
  display: flex;
  align-items: center;
}

.dm-input-bar {
  flex: 1;
  height: 72rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
  color: var(--app-ink);
}

/* 4. Playlist Drawer */
.playlist-video-wrapper {
  width: 100%;
}

.playlist-flex {
  display: flex;
  height: 280rpx;
  border-radius: 12rpx;
  overflow: hidden;
  border: 1rpx solid var(--app-line);
}

.video-play-box-left {
  flex: 1;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-placeholder {
  font-size: 22rpx;
  color: #fff;
}

.episode-drawer-right {
  width: 80rpx;
  background: #f1f5f9;
  border-left: 1rpx solid var(--app-line);
  display: flex;
  flex-direction: column;
  transition: width 0.4s ease;
  
  &.active {
    width: 220rpx;
  }
}

.drawer-header {
  padding: 10rpx;
  font-size: 18rpx;
  font-weight: 800;
  color: var(--app-brand);
  background: #cbd5e1;
  text-align: center;
  cursor: pointer;
}

.drawer-ep-list {
  flex: 1;
  overflow-y: auto;
  padding: 6rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.ep-cell {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 6rpx;
  padding: 6rpx 10rpx;
  display: flex;
  flex-direction: column;
  
  &.active {
    border-color: var(--app-brand);
    background: #eff6ff;
    
    .ep-num { color: var(--app-brand); }
  }
}

.ep-num { font-size: 18rpx; font-weight: 800; color: var(--app-ink); }
.ep-prog { font-size: 14rpx; color: var(--app-muted); }

/* 5. Scrubbing */
.scrub-player {
  height: 240rpx;
  background: #000;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.scrub-pl-icon {
  font-size: 24rpx;
  color: #fff;
}

.thumbnail-tooltip {
  position: absolute;
  bottom: 16rpx;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.85);
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
  padding: 8rpx 14rpx;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  z-index: 5;
}

.thumb-mini-pic {
  font-size: 18rpx;
  white-space: nowrap;
}

.thumb-indicator {
  font-size: 14rpx;
  color: var(--app-brand);
  font-weight: 700;
}

.scrub-slider-track {
  padding: 10rpx 0;
}

/* 6. Storyline Interactive choice */
.story-player {
  height: 280rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.story-layout {
  height: 100%;
  background: #1e293b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.story-pl {
  font-size: 22rpx;
  color: #fff;
}

.story-choices-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.choice-title {
  font-size: 22rpx;
  color: #fca5a5;
  font-weight: 800;
}

.choice-btns {
  display: flex;
}

.reset-story-btn {
  position: absolute;
  bottom: 16rpx;
}

/* 7. Cameras switcher */
.camera-main-player {
  height: 220rpx;
  background: #0f172a;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.c-main-txt {
  font-size: 22rpx;
  color: #fff;
}

.camera-thumbnails {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.cam-thumb {
  flex: 1;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
  padding: 12rpx 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  
  &.active {
    border-color: var(--app-brand);
    background: #eff6ff;
    
    .t-lbl { color: var(--app-brand); }
  }
}

.t-icon { font-size: 28rpx; }
.t-lbl { font-size: 16rpx; color: var(--app-ink); font-weight: 700; }

/* 8. Filters adjustment */
.filter-player-box {
  height: 200rpx;
  background: #64748b;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.f-pl-txt {
  font-size: 22rpx;
  color: #fff;
  text-shadow: 2rpx 2rpx 4rpx rgba(0,0,0,0.6);
}

.filter-sliders-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  background: #fff;
  border-radius: 8rpx;
  padding: 10rpx 16rpx;
  border: 1rpx solid var(--app-line);
}

.s-lbl {
  font-size: 18rpx;
  color: var(--app-ink);
  font-weight: 700;
}

/* 9. Podcast mode style */
.podcast-canvas {
  height: 260rpx;
  background: #e2e8f0;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.4s ease;
  
  &.black {
    background-color: #0f172a;
  }
}

.std-txt {
  font-size: 22rpx;
  color: var(--app-ink);
}

.audio-cd-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.spinning-vinyl-disc {
  font-size: 80rpx;
  animation: spinCD 5s linear infinite;
}

@keyframes spinCD {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinning-txt {
  font-size: 20rpx;
  color: #fbbf24;
  font-weight: 700;
}

/* 10. Markers timeline */
.marker-player {
  height: 240rpx;
  background: #1e293b;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mk-pl-txt {
  font-size: 22rpx;
  color: #fff;
}

.custom-progress-bar-container {
  height: 12rpx;
  background: #cbd5e1;
  border-radius: 99rpx;
  position: relative;
}

.bar-line {
  width: 100%;
  height: 100%;
}

.active-bar-line {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #3b82f6;
  border-radius: 99rpx;
  transition: width 0.3s ease;
}

.highlight-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: #ef4444;
  border: 4rpx solid #fff;
  cursor: pointer;
  
  &:hover {
    .dot-desc-tooltip { display: block; }
  }
}

.dot-desc-tooltip {
  display: none;
  position: absolute;
  bottom: 30rpx;
  transform: translateX(-50%);
  left: 50%;
  background: #1e293b;
  color: #fff;
  font-size: 16rpx;
  padding: 4rpx 8rpx;
  border-radius: 6rpx;
  white-space: nowrap;
}

/* 11. PIP Float */
.pip-scroll-preview-article {
  height: 180rpx;
  overflow-y: auto;
  border: 1rpx solid var(--app-line);
  background: #fff;
  padding: 16rpx;
  border-radius: 10rpx;
}

.article-paragraph {
  font-size: 18rpx;
  color: var(--app-muted);
  line-height: 1.5;
}

.sticky-pip-overlay-mini {
  position: fixed;
  bottom: calc(130rpx + env(safe-area-inset-bottom));
  right: 24rpx;
  width: 200rpx;
  height: 130rpx;
  background: #000;
  border-radius: 12rpx;
  border: 2rpx solid #fff;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 850;
}

.mini-pip-pl {
  font-size: 16rpx;
  color: #fff;
}

.mini-pip-close {
  position: absolute;
  top: 4rpx;
  right: 8rpx;
  color: #fff;
  font-size: 24rpx;
}

/* 12. Lyric Sync */
.lyric-player {
  height: 180rpx;
  background: #475569;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ly-pl {
  font-size: 22rpx;
  color: #fff;
}

.lyrics-lines-container {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.lyric-row-line {
  padding: 10rpx;
  border-radius: 8rpx;
  background: #fff;
  border: 1rpx solid var(--app-line);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  
  &.active {
    border-color: var(--app-brand);
    background: #f0fdf4;
    
    .cn { color: #16a34a; font-weight: 800; }
    .en { color: #22c55e; }
  }
}

.cn { font-size: 20rpx; color: var(--app-ink); }
.en { font-size: 16rpx; color: var(--app-muted); }

/* 13. Watermark secure */
.watermark-player {
  height: 240rpx;
  background: #0f172a;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wt-pl {
  font-size: 22rpx;
  color: #fff;
}

.drifting-watermark-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.drift-txt {
  font-size: 24rpx;
  color: rgba(255,255,255,0.08);
  transform: rotate(-25deg);
  font-weight: 800;
  white-space: nowrap;
  
  &.d1 { animation: driftLeft 10s linear infinite; }
  &.d2 { animation: driftRight 12s linear infinite; }
}

@keyframes driftLeft {
  0% { transform: translate(-30rpx, 0) rotate(-25deg); }
  50% { transform: translate(30rpx, 0) rotate(-25deg); }
  100% { transform: translate(-30rpx, 0) rotate(-25deg); }
}

@keyframes driftRight {
  0% { transform: translate(30rpx, 0) rotate(-25deg); }
  50% { transform: translate(-30rpx, 0) rotate(-25deg); }
  100% { transform: translate(30rpx, 0) rotate(-25deg); }
}

/* 14. Live stream simulated layout */
.live-screen-mock {
  height: 380rpx;
  background: linear-gradient(to bottom, #ec4899 0%, #db2777 100%);
  border-radius: 16rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 20rpx rgba(236, 72, 153, 0.25);
}

.live-banner {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  background: rgba(0,0,0,0.4);
  color: #fff;
  font-size: 16rpx;
  padding: 6rpx 14rpx;
  border-radius: 99rpx;
}

.live-product-box {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  background: #fff;
  color: #ec4899;
  font-size: 18rpx;
  font-weight: 800;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
}

.live-chat-stream {
  position: absolute;
  bottom: 20rpx;
  left: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  max-height: 180rpx;
  width: 240rpx;
}

.live-comment-bubble {
  background: rgba(0,0,0,0.3);
  color: #fff;
  font-size: 18rpx;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  white-space: nowrap;
}

.hearts-floating-canvas {
  position: absolute;
  bottom: 20rpx;
  right: 40rpx;
  width: 80rpx;
  height: 200rpx;
  pointer-events: none;
}

.floating-heart {
  position: absolute;
  bottom: 0;
  color: #ef4444;
  font-size: 32rpx;
  animation: floatHeartUp 1s ease-out forwards;
}

@keyframes floatHeartUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-160rpx) scale(1.4); opacity: 0; }
}

.live-click-tip {
  font-size: 20rpx;
  color: var(--app-muted);
}

/* 15. Speed panel */
.speed-player {
  height: 200rpx;
  background: #334155;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.speed-pl-txt {
  font-size: 22rpx;
  color: #fff;
}

.speed-selector-row {
  display: flex;
  justify-content: space-around;
}

/* ==========================================
   16. BILIBILI/DOUYIN PREMIUM PLAYER CONSOLE STYLES
   ========================================== */
.premium-player-wrapper {
  width: 100%;
}

.premium-video-box {
  width: 100%;
  height: 520rpx;
  background: #000;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  border: 1rpx solid #333;
}

.video-main-frame {
  flex: 1;
  position: relative;
  background: radial-gradient(circle, #1e1b4b 0%, #03000a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Danmaku rolling styles for template 16 */
.danmaku-overlay-t16 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.t16-danmaku-item {
  position: absolute;
  right: -300px;
  color: #fff;
  font-size: 20rpx;
  font-weight: 800;
  text-shadow: 2rpx 2rpx 4rpx rgba(0,0,0,0.9);
  white-space: nowrap;
  animation: floatDanmakuT16 12s linear infinite;
}

@keyframes floatDanmakuT16 {
  0% { transform: translateX(0); }
  100% { transform: translateX(-950px); }
}

.subtitle-text-overlay {
  position: absolute;
  bottom: 24rpx;
  left: 50%;
  transform: translateX(-50%);
  color: #fef08a;
  font-size: 26rpx;
  text-shadow: 3rpx 3rpx 6rpx rgba(0,0,0,0.95);
  background: rgba(0,0,0,0.5);
  padding: 8rpx 24rpx;
  border-radius: 12rpx;
  pointer-events: none;
  width: max-content;
}

.capsules-overlay {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  gap: 12rpx;
  pointer-events: none;
}

.capsule-badge {
  font-size: 16rpx;
  color: #fff;
  padding: 6rpx 16rpx;
  border-radius: 99rpx;
  background: rgba(255,255,255,0.15);
  border: 1rpx solid rgba(255,255,255,0.25);
  
  &.orange-capsule {
    color: #fdba74;
    border-color: rgba(251,146,60,0.4);
    background: rgba(251,146,60,0.2);
  }
}

/* Creator profile & reaction bar on the right side */
.creator-interaction-bar {
  position: absolute;
  right: 20rpx;
  top: 40rpx;
  z-index: 10;
  background: rgba(0,0,0,0.3);
  padding: 16rpx 10rpx;
  border-radius: 20rpx;
}

.avatar-box {
  width: 50rpx;
  height: 50rpx;
  background: #f43f5e;
  border: 2rpx solid #fff;
  border-radius: 50%;
  color: #fff;
  font-size: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.interact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rpx;
}

.emoji-icon {
  font-size: 26rpx;
  cursor: pointer;
}

.lbl-txt {
  font-size: 13rpx;
  color: rgba(255,255,255,0.85);
}

.mascot-douyin {
  cursor: pointer;
}

.bee-emoji {
  font-size: 32rpx;
}

.mascot-lbl {
  font-size: 12rpx;
  color: #fde047;
  white-space: nowrap;
}

/* ==========================================
   BOTTOM CONSOLE CONTROL BAR
   ========================================== */
.bottom-control-console-bar {
  background: #111;
  border-top: 1rpx solid #222;
  padding: 16rpx 20rpx;
  height: 80rpx;
  box-sizing: border-box;
}

.console-left, .console-center, .console-right {
  display: flex;
  align-items: center;
}

.play-pause-icon-btn {
  font-size: 26rpx;
  color: #fff;
  cursor: pointer;
}

.time-meta-txt {
  font-size: 16rpx;
  color: #888;
}

.chapter-meta-name {
  font-size: 16rpx;
  color: #ddd;
}

.next-chapter-action-btn {
  font-size: 16rpx;
  color: #a855f7;
  cursor: pointer;
}

/* Danmaku Input group inside console */
.danmaku-switch-btn {
  background: #222;
  border: 1rpx solid #444;
  border-radius: 99rpx;
  padding: 4rpx 10rpx;
  cursor: pointer;
}

.bullet-symbol-icon {
  font-size: 14rpx;
  color: #888;
  margin-right: 6rpx;
}

.toggle-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #666;
  
  &.active {
    background: #22c55e;
  }
}

.danmaku-input-console {
  background: #222;
  border: 1rpx solid #333;
  color: #fff;
  border-radius: 99rpx;
  padding: 4rpx 20rpx;
  font-size: 16rpx;
  width: 150rpx;
}

.danmaku-send-btn {
  background: #3b82f6;
  color: #fff;
  border-radius: 99rpx;
  font-size: 16rpx;
  padding: 6rpx 20rpx;
  cursor: pointer;
}

.console-switch-item {
  cursor: pointer;
}

.sw-lbl {
  font-size: 14rpx;
  color: #888;
  margin-right: 6rpx;
}

.sw-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #666;
  
  &.active {
    background: #3b82f6;
  }
}

.speed-toggle-badge {
  font-size: 15rpx;
  color: #888;
  cursor: pointer;
  
  &:hover {
    color: #fff;
  }
}

.small-ctrl-icon-btn {
  font-size: 20rpx;
  color: #888;
  cursor: pointer;
  
  &:hover {
    color: #fff;
  }
}
</style>
