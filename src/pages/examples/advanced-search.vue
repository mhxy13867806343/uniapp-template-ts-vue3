<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('advanced-search-toast')

// Search state
const searchKeyword = ref('')
const searchHistory = ref<string[]>(['Baidu', 'Docker', 'ChatGPT', '360'])
const showLetterIndicator = ref(false)
const activeLetter = ref('A')
const scrollTargetId = ref('')

const hotRecommendations = [
  { rank: 1, name: 'ChatGPT', tag: '热' },
  { rank: 2, name: 'TypeScript 5.0' },
  { rank: 3, name: 'UniApp HBuilderX' },
  { rank: 4, name: 'Docker Container', tag: '新' },
  { rank: 5, name: 'Bilibili SDK' },
  { rank: 6, name: 'Vue 3.3 Composition' }
]

// Directory data grouped by letter A-Z and #
interface IndexItem {
  id: string
  name: string
  desc: string
}
interface GroupedDirectory {
  letter: string
  items: IndexItem[]
}

const directoryData: GroupedDirectory[] = [
  {
    letter: 'A',
    items: [
      { id: 'a1', name: 'Alipay 支付宝', desc: '蚂蚁集团旗下的移动支付平台。' },
      { id: 'a2', name: 'Android 安卓系统', desc: '由 Google 维护开发的移动操作系统平台。' },
      { id: 'a3', name: 'Adobe Design Suite', desc: '包含 Photoshop, Illustrator 等创作套件。' }
    ]
  },
  {
    letter: 'B',
    items: [
      { id: 'b1', name: 'Baidu 百度搜索', desc: '中国最大的中文搜索引擎。' },
      { id: 'b2', name: 'Bilibili 哔哩哔哩', desc: '年轻人喜爱的弹幕视频和弹幕文化社区。' },
      { id: 'b3', name: 'ByteDance 字节跳动', desc: '今日头条及抖音的母公司。' }
    ]
  },
  {
    letter: 'C',
    items: [
      { id: 'c1', name: 'ChatGPT', desc: '由 OpenAI 研发的划时代大语言模型。' },
      { id: 'c2', name: 'Chrome 浏览器', desc: '由 Google 推出的极速网页浏览器。' },
      { id: 'c3', name: 'CSS 样式表', desc: '层叠样式表，控制网页排版和视觉艺术。' }
    ]
  },
  {
    letter: 'D',
    items: [
      { id: 'd1', name: 'Docker 容器', desc: '应用容器化平台，实现一键打包部署。' },
      { id: 'd2', name: 'Django 框架', desc: '基于 Python 的高生产力 Web 后端框架。' },
      { id: 'd3', name: 'Dart 编程语言', desc: 'Flutter 开发首选的强类型客户端语言。' }
    ]
  },
  {
    letter: 'E',
    items: [
      { id: 'e1', name: 'ESLint 校验器', desc: 'JavaScript 静态代码分析与格式检验工具。' },
      { id: 'e2', name: 'Express.js', desc: '基于 Node.js 平台的极简 Web 开发框架。' }
    ]
  },
  {
    letter: 'F',
    items: [
      { id: 'f1', name: 'Figma 设计工具', desc: '基于浏览器的在线协同 UI/UX 设计平台。' },
      { id: 'f2', name: 'Flutter 开发包', desc: '谷歌推出的多端跨平台原生渲染框架。' }
    ]
  },
  {
    letter: 'G',
    items: [
      { id: 'g1', name: 'GitHub 代码库', desc: '全球最大的开源软件托管和代码分享中心。' },
      { id: 'g2', name: 'Google 谷歌公司', desc: '全球领先的搜索引擎及互联网科技巨头。' }
    ]
  },
  {
    letter: 'H',
    items: [
      { id: 'h1', name: 'HBuilderX 编辑器', desc: 'DCloud 推出的一流 UniApp 开发利器。' },
      { id: 'h2', name: 'HTML5 标准', desc: '构建下一代现代网页与流媒体的骨架协议。' }
    ]
  },
  {
    letter: 'N',
    items: [
      { id: 'n1', name: 'Next.js 框架', desc: '基于 React 性能优越的服务端渲染脚手架。' },
      { id: 'n2', name: 'Node.js 运行时', desc: '让 JavaScript 在服务器端运行的高效平台。' }
    ]
  },
  {
    letter: 'P',
    items: [
      { id: 'p1', name: 'Python 语言', desc: '适合人工智能与数据分析的极简脚本语言。' },
      { id: 'p2', name: 'Pinia 状态管理', desc: 'Vue 3 生态推荐的轻量直观全局数据仓库。' }
    ]
  },
  {
    letter: 'R',
    items: [
      { id: 'r1', name: 'React.js 视图库', desc: '由 Meta 维护的声明式组件化前端底层库。' },
      { id: 'r2', name: 'Rust 编程语言', desc: '兼顾极致运行速度和内存安全的底层语言。' }
    ]
  },
  {
    letter: 'T',
    items: [
      { id: 't1', name: 'TypeScript', desc: '给 JavaScript 附带强类型约束的超集语言。' },
      { id: 't2', name: 'TailwindCSS', desc: '实用主义的原子化 CSS 布局样式库。' }
    ]
  },
  {
    letter: 'V',
    items: [
      { id: 'v1', name: 'Vue.js 渐进式框架', desc: '基于数据双向绑定的主流前端声明式框架。' },
      { id: 'v2', name: 'Vite 构建工具', desc: '基于原生 ESM 的极速冷启动前端构建系统。' }
    ]
  },
  {
    letter: 'Z',
    items: [
      { id: 'z1', name: 'Zoom 视频会议', desc: '全球广泛使用的在线云视讯交流平台。' },
      { id: 'z2', name: 'ZTE 中兴通讯', desc: '全球领先的综合通信与信息技术解决方案提供商。' }
    ]
  },
  {
    letter: '#',
    items: [
      { id: 'num1', name: '360 安全卫士', desc: '国内知名安全防毒与系统清理辅助工具。' },
      { id: 'num2', name: '58同城分类网', desc: '提供租房、招聘及本地生活服务的生活网。' }
    ]
  }
]

// Index sidebar letters list
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'N', 'P', 'R', 'T', 'V', 'Z', '#']

// Filter directory by search keyword
const filteredDirectory = computed(() => {
  const query = searchKeyword.value.trim().toLowerCase()
  if (!query) return directoryData

  return directoryData
    .map(group => {
      const items = group.items.filter(
        item => item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
      )
      return { letter: group.letter, items }
    })
    .filter(group => group.items.length > 0)
})

function triggerSearch(kw: string) {
  searchKeyword.value = kw
  if (!searchHistory.value.includes(kw)) {
    searchHistory.value = [kw, ...searchHistory.value].slice(0, 10)
  }
  toast.success(`正在过滤：“${kw}”`)
}

function clearHistory() {
  searchHistory.value = []
  toast.success('历史已清空')
}

function scrollToLetter(letter: string) {
  activeLetter.value = letter
  scrollTargetId.value = `letter-group-${letter === '#' ? 'num' : letter}`
  
  // Show center temporary badge
  showLetterIndicator.value = true
  setTimeout(() => {
    showLetterIndicator.value = false
  }, 800)
}
</script>

<template>
  <PageShell title="字母索引搜索" description="顶部集成历史、热推面板，下方主体提供 A-Z + # 索引侧栏，支持流畅的拼音锚点滑动定位。">
    <view class="advanced-search-page">
      <wd-toast selector="advanced-search-toast" />

      <!-- Top Search Bar -->
      <view class="search-head-box">
        <wd-search
          v-model="searchKeyword"
          placeholder="搜索品牌、技术框架或应用"
          @search="(val) => triggerSearch(val)"
          @clear="searchKeyword = ''"
        />
      </view>

      <!-- Search Previews (Only shows when searchKeyword is empty) -->
      <view v-if="!searchKeyword" class="search-suggestions-container mt-3">
        <!-- 1. Search History -->
        <view class="suggest-section" v-if="searchHistory.length > 0">
          <view class="section-title flex justify-between items-center">
            <text class="font-bold text-ink">历史搜索</text>
            <text class="clear-txt" @click="clearHistory">🗑️ 清空</text>
          </view>
          <view class="tags-row mt-2">
            <view
              v-for="h in searchHistory"
              :key="h"
              class="tag-chip"
              @click="triggerSearch(h)"
            >
              {{ h }}
            </view>
          </view>
        </view>

        <!-- 2. Hot Recommendations -->
        <view class="suggest-section mt-4">
          <view class="section-title font-bold text-ink mb-2">热门推荐</view>
          <view class="hot-grid">
            <view
              v-for="hot in hotRecommendations"
              :key="hot.rank"
              class="hot-grid-item flex items-center"
              @click="triggerSearch(hot.name)"
            >
              <text :class="['rank-no', { 'top': hot.rank <= 3 }]">{{ hot.rank }}</text>
              <text class="rank-name text-ink ml-2 flex-1">{{ hot.name }}</text>
              <wd-tag v-if="hot.tag" :type="hot.tag === '热' ? 'danger' : 'warning'" size="small">{{ hot.tag }}</wd-tag>
            </view>
          </view>
        </view>
      </view>

      <!-- Grouped Indexed Directory Scroll view -->
      <view class="directory-list-box mt-3 relative-context">
        <scroll-view
          scroll-y
          class="directory-scroll"
          :scroll-into-view="scrollTargetId"
          scroll-with-animation
        >
          <view
            v-for="group in filteredDirectory"
            :key="group.letter"
            :id="`letter-group-${group.letter === '#' ? 'num' : group.letter}`"
            class="group-section"
          >
            <!-- Letter Header -->
            <view class="group-header-tag font-bold">{{ group.letter }}</view>

            <!-- Group items -->
            <view class="group-items-list">
              <view
                v-for="item in group.items"
                :key="item.id"
                class="directory-item-card"
                @click="toast.success(`点击了: ${item.name}`)"
              >
                <view class="item-name font-bold text-ink">{{ item.name }}</view>
                <view class="item-desc mt-1">{{ item.desc }}</view>
              </view>
            </view>
          </view>

          <!-- Padding to allow scrolling last letters to top -->
          <view class="scroll-footer-padding"></view>
        </scroll-view>

        <!-- Right float A-Z index sidebar -->
        <view class="alphabet-index-sidebar">
          <view
            v-for="l in letters"
            :key="l"
            :class="['index-letter', { active: activeLetter === l }]"
            @click="scrollToLetter(l)"
          >
            {{ l }}
          </view>
        </view>
      </view>

      <!-- Center pop big letter indicator (Shows when scrolling/clicking sidebar) -->
      <view v-if="showLetterIndicator" class="center-letter-badge font-bold">
        {{ activeLetter }}
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.advanced-search-page {
  position: relative;
  height: calc(100vh - 120rpx);
  display: flex;
  flex-direction: column;
}

.search-head-box {
  background: #fff;
  border-radius: 16rpx;
  border: 1rpx solid var(--app-line);
  padding: 8rpx;
}

/* History and recommendation styles */
.search-suggestions-container {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 24rpx;
}

.section-title {
  font-size: 20rpx;
}

.clear-txt {
  font-size: 18rpx;
  color: var(--app-muted);
  cursor: pointer;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag-chip {
  background: #f1f5f9;
  border-radius: 10rpx;
  font-size: 18rpx;
  color: var(--app-ink);
  padding: 8rpx 20rpx;
  border: 1rpx solid var(--app-line);
  cursor: pointer;
  
  &:active {
    filter: brightness(0.9);
  }
}

/* Hot Grid */
.hot-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.hot-grid-item {
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 12rpx;
  cursor: pointer;
}

.rank-no {
  font-size: 22rpx;
  color: var(--app-muted);
  font-weight: 800;
  width: 32rpx;
  text-align: center;
  
  &.top {
    color: #ef4444;
  }
}

.rank-name {
  font-size: 19rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Directory Index Box */
.directory-list-box {
  flex: 1;
  min-height: 0;
  display: flex;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  overflow: hidden;
}

.directory-scroll {
  height: 100%;
  padding-right: 48rpx; /* Leave space for the floating index bar */
}

.group-section {
  display: grid;
}

.group-header-tag {
  background: #f1f5f9;
  font-size: 20rpx;
  color: var(--app-brand);
  padding: 8rpx 24rpx;
  border-bottom: 1rpx solid var(--app-line);
}

.group-items-list {
  display: grid;
}

.directory-item-card {
  padding: 24rpx;
  border-bottom: 1rpx solid var(--app-line);
  cursor: pointer;
  
  &:active {
    background: #f8fafc;
  }
}

.item-name {
  font-size: 21rpx;
}

.item-desc {
  font-size: 17rpx;
  color: var(--app-muted);
  line-height: 1.4;
}

.scroll-footer-padding {
  height: 400rpx; /* Extra spacing at bottom so Z and # groups can scroll to top */
}

/* Sidebar Index */
.alphabet-index-sidebar {
  position: absolute;
  right: 8rpx;
  top: 24rpx;
  bottom: 24rpx;
  width: 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 5;
  background: rgba(241, 245, 249, 0.85);
  border-radius: 20rpx;
  padding: 16rpx 0;
  border: 1rpx solid var(--app-line);
}

.index-letter {
  font-size: 16rpx;
  font-weight: 800;
  color: var(--app-muted);
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  
  &.active, &:active {
    background: var(--app-brand);
    color: #fff;
  }
}

/* Center pop indicator */
.center-letter-badge {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 140rpx;
  height: 140rpx;
  background: rgba(15, 23, 42, 0.86);
  color: #fff;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  z-index: 20;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.15);
}

.flex { display: flex; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-ink { color: var(--app-ink); }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-4 { margin-top: 32rpx; }
.relative-context { position: relative; }
</style>
