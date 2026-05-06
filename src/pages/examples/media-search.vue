<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

interface VideoItem {
  id: number
  title: string
  category: string
  desc: string
  cover: string
  score: string
  duration: string
  author: string
  views: string
}

interface HotSearch {
  rank: number
  title: string
  tag?: '热' | '新'
}

const toast = useToast('media-search-toast')

const moreOpen = ref(false)
const searchVisible = ref(false)
const searchKeyword = ref('phyton')
const searchHistory = ref([
  '最终幻想6',
  '最终幻想6 魔列车',
  'anthropic封号',
  'Anthropic',
  '全新世纪 1,2,3',
  'trae godot',
  'trae Figma',
  '沉默的遗迹',
  'vue底层',
  '完美世界',
  'traesolo Skills',
  'traesolo模式'
])

const primaryCategories = ['国创', '纪录片', '电影', '电视剧', '影视']
const moreCategories = ['综艺', '动画', '知识', '游戏', '音乐', '科技', '番剧', '短剧']
const allCategories = [...primaryCategories, ...moreCategories]
const activeIndex = ref(0)
const activeCategory = computed(() => allCategories[activeIndex.value] || allCategories[0])

const hotSearches: HotSearch[] = [
  { rank: 1, title: '理财王大赛中期复盘', tag: '热' },
  { rank: 2, title: '万字细读电影坠落' },
  { rank: 3, title: '詹姆斯空砍27分湖人不敌雷霆' },
  { rank: 4, title: '盘点VCT的1v5名场面', tag: '新' },
  { rank: 5, title: '陈瑶惊鸿一面训练记录' },
  { rank: 6, title: '网警提示企业网络安全备案' },
  { rank: 7, title: '特朗普称暂停自由计划行动' },
  { rank: 8, title: 'ZywOo今年的第五个冠军' },
  { rank: 9, title: '新华社批日本慰灵甲级战犯', tag: '新' },
  { rank: 10, title: '曼联新赛季阵容前瞻', tag: '新' }
]

const videos: VideoItem[] = [
  {
    id: 1,
    title: '灵笼终章：废土都市的最后一次远行',
    category: '国创',
    desc: '高燃国创混剪，拆解角色弧光和末日叙事。',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=720&q=80',
    score: '9.6',
    duration: '18:42',
    author: '国创研究所',
    views: '126.8万'
  },
  {
    id: 2,
    title: '极地航线纪录：穿过白夜与冰川',
    category: '纪录片',
    desc: '从北纬 70 度出发，记录航线、气候和普通人的生活。',
    cover: 'https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&w=720&q=80',
    score: '9.4',
    duration: '42:10',
    author: '远方影像',
    views: '48.2万'
  },
  {
    id: 3,
    title: '电影坠落万字解析：封闭空间的压迫感',
    category: '电影',
    desc: '从镜头、节奏和声音三个层面拆一部小成本惊悚片。',
    cover: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=720&q=80',
    score: '8.8',
    duration: '26:15',
    author: '影评档案',
    views: '85.1万'
  },
  {
    id: 4,
    title: '悬疑电视剧里的双线叙事为什么有效',
    category: '电视剧',
    desc: '用三集结构分析铺垫、反转和人物动机。',
    cover: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=720&q=80',
    score: '9.1',
    duration: '31:04',
    author: '剧集观察',
    views: '62.7万'
  },
  {
    id: 5,
    title: '影视热搜周榜：从国创到电影档期',
    category: '影视',
    desc: '一屏看完本周热度变化、用户搜索词和播放增长。',
    cover: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=720&q=80',
    score: '8.9',
    duration: '12:36',
    author: 'B 站热搜台',
    views: '71.5万'
  },
  {
    id: 6,
    title: '综艺名场面复盘：爆点是怎么剪出来的',
    category: '综艺',
    desc: '拆解冲突、字幕和节奏对观感的影响。',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=720&q=80',
    score: '8.6',
    duration: '16:55',
    author: '剪辑课代表',
    views: '35.9万'
  },
  {
    id: 7,
    title: '动画镜头语言：一秒钟的速度感',
    category: '动画',
    desc: '用分镜、形变和残影解释动作戏为什么好看。',
    cover: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=720&q=80',
    score: '9.3',
    duration: '21:08',
    author: '动画实验室',
    views: '54.4万'
  },
  {
    id: 8,
    title: 'Python 搜索词为什么总被拼成 phyton',
    category: '知识',
    desc: '搜索纠错、历史记录和热榜推荐的产品设计拆解。',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=720&q=80',
    score: '9.0',
    duration: '14:22',
    author: '产品手记',
    views: '42.1万'
  }
]

function getVideosByCategory(category: string) {
  const list = videos.filter((item) => item.category === category)
  return list.length ? list : videos.slice(0, 4)
}

const visibleVideos = computed(() => getVideosByCategory(activeCategory.value))

const searchResults = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return videos.slice(0, 4)
  return videos.filter((item) => {
    const haystack = `${item.title}${item.category}${item.desc}${item.author}`.toLowerCase()
    return haystack.includes(keyword) || keyword === 'phyton' && haystack.includes('python')
  })
})

function chooseCategory(category: string) {
  const index = allCategories.indexOf(category)
  if (index > -1) activeIndex.value = index
  moreOpen.value = false
}

function handleSwiperChange(event: { detail: { current: number } }) {
  activeIndex.value = Number(event.detail.current || 0)
  moreOpen.value = false
}

function openSearch() {
  searchVisible.value = true
}

function chooseKeyword(keyword: string) {
  searchKeyword.value = keyword
  addHistory(keyword)
}

function addHistory(keyword: string) {
  const value = keyword.trim()
  if (!value) return
  searchHistory.value = [value, ...searchHistory.value.filter((item) => item !== value)].slice(0, 12)
}

function submitSearch() {
  addHistory(searchKeyword.value)
  toast.success('已更新搜索结果')
}

function clearHistory() {
  searchHistory.value = []
}
</script>

<template>
  <PageShell title="影视检索" description="仿视频应用的频道导航、更多分类、搜索历史和热搜榜弹层。">
    <view class="media-page">
      <wd-toast selector="media-search-toast" />

      <view class="channel-bar">
        <scroll-view scroll-x class="channel-scroll">
          <view class="channel-list">
            <view
              v-for="item in primaryCategories"
              :key="item"
              :class="['channel-item', { active: activeCategory === item }]"
              @click="chooseCategory(item)"
            >
              {{ item }}
            </view>
          </view>
        </scroll-view>
        <view class="more-trigger" @click="moreOpen = !moreOpen">
          <wd-icon :name="moreOpen ? 'arrow-up' : 'arrow-down'" size="18px" />
        </view>
      </view>

      <view v-if="moreOpen" class="more-panel">
        <view
          v-for="item in moreCategories"
          :key="item"
          :class="['more-chip', { active: activeCategory === item }]"
          @click="chooseCategory(item)"
        >
          {{ item }}
        </view>
      </view>

      <view class="hero-card">
        <image class="hero-image" src="https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=900&q=80" mode="aspectFill" />
        <view class="hero-overlay">
          <view class="hero-title">今日影视热搜</view>
          <view class="hero-desc">频道切换、热词检索、历史记录都在一个移动端模板里。</view>
          <view class="search-entry" @click="openSearch">
            <text>{{ searchKeyword || '搜索影片、UP 主或话题' }}</text>
            <wd-icon name="search" size="22px" />
          </view>
        </view>
      </view>

      <view class="section-head">
        <view>
          <view class="section-title">{{ activeCategory }} 推荐</view>
          <view class="section-desc">按当前频道刷新卡片内容</view>
        </view>
        <wd-tag type="primary" plain>{{ visibleVideos.length }} 条</wd-tag>
      </view>

      <swiper class="video-swiper" :current="activeIndex" :duration="280" @change="handleSwiperChange">
        <swiper-item v-for="category in allCategories" :key="category" class="video-slide">
          <scroll-view scroll-y class="slide-scroll">
            <view class="video-list">
              <view v-for="item in getVideosByCategory(category)" :key="item.id" class="video-card">
                <view class="cover-wrap">
                  <image class="video-cover" :src="item.cover" mode="aspectFill" />
                  <view class="duration">{{ item.duration }}</view>
                </view>
                <view class="video-body">
                  <view class="video-title">{{ item.title }}</view>
                  <view class="video-desc">{{ item.desc }}</view>
                  <view class="video-meta">
                    <text>{{ item.author }}</text>
                    <text>{{ item.views }}</text>
                    <text>{{ item.score }} 分</text>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>

      <wd-popup
        v-model="searchVisible"
        position="top"
        root-portal
        custom-class="media-search-popup"
        :z-index="99"
      >
        <view class="search-panel">
          <view class="search-head">
            <input
              v-model="searchKeyword"
              class="search-input"
              confirm-type="search"
              focus
              placeholder="搜索影片、UP 主或话题"
              @confirm="submitSearch"
            />
            <wd-icon name="search" size="28px" custom-class="search-icon" @click="submitSearch" />
          </view>

          <view class="panel-section">
            <view class="panel-title-row">
              <view class="panel-title">搜索历史</view>
              <view class="clear-link" @click="clearHistory">清空</view>
            </view>
            <view class="history-tags">
              <view
                v-for="item in searchHistory"
                :key="item"
                class="history-tag"
                @click="chooseKeyword(item)"
              >
                {{ item }}
              </view>
            </view>
          </view>

          <view class="panel-section">
            <view class="panel-title">bilibili热搜</view>
            <view class="hot-list">
              <view
                v-for="item in hotSearches"
                :key="item.rank"
                class="hot-item"
                @click="chooseKeyword(item.title)"
              >
                <view :class="['hot-rank', { top: item.rank <= 3 }]">{{ item.rank }}</view>
                <view class="hot-title">{{ item.title }}</view>
                <view v-if="item.tag" :class="['hot-tag', item.tag === '热' ? 'hot' : 'new']">{{ item.tag }}</view>
              </view>
            </view>
          </view>

          <view class="panel-section">
            <view class="panel-title">搜索结果</view>
            <view class="result-list">
              <view v-for="item in searchResults" :key="item.id" class="result-item">
                <image class="result-cover" :src="item.cover" mode="aspectFill" />
                <view class="result-main">
                  <view class="result-title">{{ item.title }}</view>
                  <view class="result-desc">{{ item.author }} · {{ item.category }} · {{ item.views }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.media-page {
  display: grid;
  gap: 22rpx;
}

.channel-bar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  margin-inline: -32rpx;
  border-bottom: 1rpx solid var(--app-line);
  background: #fff;
  padding-left: 32rpx;
}

.channel-scroll {
  min-width: 0;
  flex: 1;
  white-space: nowrap;
}

.channel-list {
  display: flex;
  width: max-content;
}

.channel-item {
  position: relative;
  color: #344054;
  font-size: 30rpx;
  font-weight: 700;
  padding: 24rpx 28rpx;
}

.channel-item.active {
  color: var(--app-brand);
}

.channel-item.active::after {
  position: absolute;
  right: 28rpx;
  bottom: 10rpx;
  left: 28rpx;
  height: 5rpx;
  border-radius: 999rpx;
  background: var(--app-brand);
  content: '';
}

.more-trigger {
  display: grid;
  flex: 0 0 86rpx;
  width: 86rpx;
  height: 86rpx;
  place-items: center;
  border-left: 1rpx solid #eef2f7;
  color: #667085;
}

.more-panel {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: -10rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
  padding: 22rpx;
  box-shadow: 0 18rpx 42rpx rgb(16 24 40 / 10%);
}

.more-chip {
  border-radius: 999rpx;
  background: #f3f5f7;
  color: #344054;
  font-size: 26rpx;
  font-weight: 700;
  padding: 16rpx 8rpx;
  text-align: center;
}

.more-chip.active {
  background: #eef6ff;
  color: var(--app-brand);
}

.hero-card {
  position: relative;
  overflow: hidden;
  min-height: 380rpx;
  border-radius: 18rpx;
  background: #101828;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-overlay {
  position: relative;
  display: grid;
  align-content: end;
  min-height: 380rpx;
  gap: 14rpx;
  background: linear-gradient(180deg, rgb(16 24 40 / 16%), rgb(16 24 40 / 78%));
  padding: 32rpx;
}

.hero-title {
  color: #fff;
  font-size: 40rpx;
  font-weight: 900;
}

.hero-desc {
  color: rgb(255 255 255 / 82%);
  font-size: 25rpx;
  line-height: 1.5;
}

.search-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  margin-top: 10rpx;
  border-radius: 18rpx;
  background: #fff;
  color: #475467;
  font-size: 28rpx;
  padding: 20rpx 24rpx;
}

.search-entry text {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.section-title,
.panel-title {
  color: var(--app-ink);
  font-size: 32rpx;
  font-weight: 900;
}

.section-desc {
  margin-top: 8rpx;
  color: var(--app-muted);
  font-size: 24rpx;
}

.video-swiper {
  height: 1060rpx;
}

.video-slide,
.slide-scroll {
  height: 100%;
}

.video-list {
  display: grid;
  gap: 18rpx;
  padding-bottom: 24rpx;
}

.video-card {
  overflow: hidden;
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
}

.cover-wrap {
  position: relative;
  height: 300rpx;
  background: #eef2f7;
}

.video-cover {
  width: 100%;
  height: 100%;
}

.duration {
  position: absolute;
  right: 16rpx;
  bottom: 16rpx;
  border-radius: 999rpx;
  background: rgb(16 24 40 / 76%);
  color: #fff;
  font-size: 22rpx;
  padding: 7rpx 14rpx;
}

.video-body {
  padding: 22rpx;
}

.video-title,
.result-title {
  display: -webkit-box;
  overflow: hidden;
  color: var(--app-ink);
  font-size: 30rpx;
  font-weight: 800;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.video-desc,
.video-meta,
.result-desc {
  color: var(--app-muted);
  font-size: 24rpx;
  line-height: 1.5;
}

.video-desc {
  margin-top: 10rpx;
}

.video-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
  margin-top: 14rpx;
}

:deep(.media-search-popup) {
  width: calc(100vw - 48rpx);
  max-height: 88vh;
  margin: 28rpx 24rpx 0;
  overflow: hidden;
  border-radius: 18rpx;
  background: #fff;
}

.search-panel {
  max-height: 88vh;
  overflow-y: auto;
  padding: 10rpx 24rpx 36rpx;
}

.search-head {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 18rpx;
  background: #fff;
  padding: 10rpx 0 24rpx;
}

.search-input {
  min-width: 0;
  flex: 1;
  height: 72rpx;
  border-radius: 12rpx;
  background: #e5e7eb;
  color: var(--app-ink);
  font-size: 30rpx;
  padding: 0 20rpx;
}

:deep(.search-icon) {
  flex: 0 0 auto;
  color: #101828;
}

.panel-section {
  margin-top: 26rpx;
}

.panel-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.clear-link {
  color: #98a2b3;
  font-size: 26rpx;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
  margin-top: 22rpx;
}

.history-tag {
  max-width: 100%;
  border-radius: 10rpx;
  background: #f3f4f6;
  color: #20242b;
  font-size: 27rpx;
  padding: 16rpx 22rpx;
}

.hot-list,
.result-list {
  display: grid;
  margin-top: 18rpx;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  min-height: 64rpx;
}

.hot-rank {
  flex: 0 0 34rpx;
  color: #98a2b3;
  font-size: 30rpx;
  font-weight: 800;
  text-align: center;
}

.hot-rank.top {
  color: #101828;
}

.hot-title {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: #20242b;
  font-size: 30rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-tag {
  border-radius: 6rpx;
  color: #fff;
  font-size: 20rpx;
  line-height: 1;
  padding: 6rpx;
}

.hot-tag.hot {
  background: #ff4d4f;
}

.hot-tag.new {
  background: #f59e0b;
}

.result-item {
  display: flex;
  gap: 18rpx;
  padding: 18rpx 0;
  border-bottom: 1rpx solid #eef2f7;
}

.result-cover {
  flex: 0 0 132rpx;
  width: 132rpx;
  height: 88rpx;
  border-radius: 10rpx;
  background: #eef2f7;
}

.result-main {
  min-width: 0;
  flex: 1;
}

.result-desc {
  margin-top: 8rpx;
}
</style>
