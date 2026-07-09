<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('leaderboard-toast')

// Selected leaderboard index
const activeBoardIndex = ref(0)

const boardList = [
  { id: 1, name: '王者公会争霸榜', key: 'gaming' },
  { id: 2, name: '全球企业估值榜', key: 'brand' },
  { id: 3, name: '电商畅销热卖榜', key: 'ecommerce' },
  { id: 4, name: '微博社交热搜榜', key: 'social' },
  { id: 5, name: '电影票房排行榜', key: 'movie' },
  { id: 6, name: '会员成长积分榜', key: 'vip' },
  { id: 7, name: 'App Store 应用榜', key: 'app-store' },
  { id: 8, name: 'Billboard 音乐榜', key: 'music' },
  { id: 9, name: '证券个股涨幅榜', key: 'stock' },
  { id: 10, name: '旅游景点网红榜', key: 'travel' },
  { id: 11, name: '数码好物关注榜', key: 'tech' },
  { id: 12, name: '美食大厨人气榜', key: 'food' },
  { id: 13, name: '全国房企销售榜', key: 'real-estate' },
  { id: 14, name: '图书阅读热度榜', key: 'book' },
  { id: 15, name: '在线直播人气榜', key: 'live' },
  { id: 16, name: '新能源车销量榜', key: 'car' },
  { id: 17, name: '健身燃脂卡路里', key: 'fitness' },
  { id: 18, name: 'GitHub 趋势榜', key: 'github' },
  { id: 19, name: '播客订阅畅听榜', key: 'podcast' },
  { id: 20, name: '黑客松战队积分', key: 'hackathon' }
]

function switchBoard(index: number) {
  activeBoardIndex.value = index
  toast.success(`已切换至: ${boardList[index].name}`)
}

// --------------------------------------------------
// Expanded Mock Data containing Top 8 items
// --------------------------------------------------
const gamingData = [
  { rank: 1, name: '屠龙殿公会', val: '984.2k', desc: 'Lv.99', sub: '会长: 魔王', icon: '🦖' },
  { rank: 2, name: '凌霄阁战队', val: '862.1k', desc: 'Lv.88', sub: '会长: 剑影', icon: '⚔️' },
  { rank: 3, name: '聚义堂兄弟', val: '715.4k', desc: 'Lv.76', sub: '会长: 铁血', icon: '🛡️' },
  { rank: 4, name: '风云会盟', val: '501.2k', desc: 'Lv.65', sub: '会长: 狂风', icon: '💨' },
  { rank: 5, name: '幻影刺客联盟', val: '432.8k', desc: 'Lv.62', sub: '会长: 幽灵', icon: '👤' },
  { rank: 6, name: '绝代双骄', val: '315.6k', desc: 'Lv.58', sub: '会长: 花无缺', icon: '🌸' },
  { rank: 7, name: '听雨轩小筑', val: '286.0k', desc: 'Lv.50', sub: '会长: 晴天', icon: '☔' },
  { rank: 8, name: '梦回大唐', val: '155.0k', desc: 'Lv.45', sub: '会长: 李唐', icon: '🏛️' }
]

const brandData = [
  { rank: 1, name: '苹果公司 (Apple)', val: '$3.25万亿', desc: 'v10', sub: '总部: 库比蒂诺', icon: '🍎' },
  { rank: 2, name: '微软 (Microsoft)', val: '$3.08万亿', desc: 'v8', sub: '总部: 雷德蒙德', icon: '💻' },
  { rank: 3, name: '英伟达 (NVIDIA)', val: '$2.96万亿', desc: 'v8', sub: '总部: 圣克拉拉', icon: '🎮' },
  { rank: 4, name: '谷歌 (Google)', val: '$2.15万亿', desc: 'v7', sub: '总部: 山景城', icon: '🔍' },
  { rank: 5, name: '亚马逊 (Amazon)', val: '$1.86万亿', desc: 'v6', sub: '总部: 西雅图', icon: '📦' },
  { rank: 6, name: 'Meta 社交平台', val: '$1.26万亿', desc: 'v5', sub: '总部: 门洛帕克', icon: '👥' },
  { rank: 7, name: '特斯拉 (Tesla)', val: '$856.2亿', desc: 'v5', sub: '总部: 奥斯汀', icon: '⚡' },
  { rank: 8, name: '腾讯控股 (Tencent)', val: '$455.0亿', desc: 'v4', sub: '总部: 深圳', icon: '🐧' }
]

const ecommerceData = [
  { rank: 1, name: '智能降噪耳机', val: '¥1299', desc: '8.4万件', sub: '评分 4.9', icon: '🎧' },
  { rank: 2, name: '轻感氮气跑鞋', val: '¥599', desc: '5.2万件', sub: '评分 4.8', icon: '👟' },
  { rank: 3, name: '手持便携挂烫机', val: '¥199', desc: '3.1万件', sub: '评分 4.7', icon: '🔌' },
  { rank: 4, name: '多功能空气炸锅', val: '¥399', desc: '2.5万件', sub: '评分 4.6', icon: '🍲' },
  { rank: 5, name: '自动感应洗手机', val: '¥79', desc: '1.8万件', sub: '评分 4.5', icon: '🧼' },
  { rank: 6, name: '折叠收纳整理箱', val: '¥49', desc: '1.5万件', sub: '评分 4.5', icon: '📦' },
  { rank: 7, name: '三合一磁吸数据线', val: '¥29', desc: '1.2万件', sub: '评分 4.4', icon: '🔌' },
  { rank: 8, name: '防滑抑菌软木瑜伽垫', val: '¥119', desc: '9k件', sub: '评分 4.4', icon: '🧘' }
]

const socialData = [
  { rank: 1, name: 'AI 安全公约全球签署', val: '942.5万', desc: '爆', sub: '热搜首位', icon: '🤖' },
  { rank: 2, name: 'iPhone 18 潜望镜升级', val: '610.2万', desc: '热', sub: '数码榜首', icon: '📷' },
  { rank: 3, name: '大范围冷空气席卷南方', val: '420.7万', desc: '新', sub: '天气预报', icon: '❄️' },
  { rank: 4, name: '新一季音综歌手阵容', val: '315.6万', desc: '热', sub: '娱乐头条', icon: '🎤' },
  { rank: 5, name: '新能源电池密度突破', val: '286.0万', desc: '新', sub: '科技前沿', icon: '🔋' },
  { rank: 6, name: '国际油价迎四连跌', val: '185.3万', desc: '稳', sub: '财经动态', icon: '⛽' },
  { rank: 7, name: '某著名国创动漫完结', val: '150.0万', desc: '热', sub: '动漫天地', icon: '🎬' },
  { rank: 8, name: '春季百强县GDP公示', val: '98.5万', desc: '新', sub: '区域经济', icon: '📊' }
]

const movieData = [
  { rank: 1, name: '星际远航：觉醒', val: '¥42.6亿', desc: '35.4%', sub: '科幻巨制', icon: '🚀' },
  { rank: 2, name: '流浪都市', val: '¥31.8亿', desc: '28.2%', sub: '末日叙事', icon: '🏙️' },
  { rank: 3, name: '代号：守护者', val: '¥19.5亿', desc: '18.1%', sub: '硬核动作', icon: '🛡️' },
  { rank: 4, name: '深海探秘大冒险', val: '¥11.5亿', desc: '10.5%', sub: '合家欢', icon: '🐠' },
  { rank: 5, name: '青春的下半场', val: '¥9.2亿', desc: '9.8%', sub: '治愈爱情', icon: '🌸' },
  { rank: 6, name: '荒野追踪记', val: '¥6.4亿', desc: '6.5%', sub: '惊悚悬疑', icon: '🌲' },
  { rank: 7, name: '国漫之光：封神后传', val: '¥5.1亿', desc: '5.2%', sub: '神话动漫', icon: '🐉' },
  { rank: 8, name: '超时空邂逅', val: '¥3.2亿', desc: '3.1%', sub: '奇幻喜剧', icon: '⏰' }
]

const vipData = [
  { rank: 1, name: '至尊龙纹会员', val: '980k', desc: 'V10', sub: '尊享18项特权', icon: '👑' },
  { rank: 2, name: '钻石先锋VIP', val: '642k', desc: 'V8', sub: '尊享12项特权', icon: '💎' },
  { rank: 3, name: '黄金探索会员', val: '315k', desc: 'V5', sub: '尊享8项特权', icon: '⭐️' },
  { rank: 4, name: '翡翠资深会员', val: '198k', desc: 'V4', sub: '尊享5项特权', icon: '🟢' },
  { rank: 5, name: '普通白银会员', val: '86k', desc: 'V2', sub: '尊享3项特权', icon: '⚪' }
]

// Determine if current list should render the Xiaohongshu-style podium layout
const isPodiumSupported = computed(() => {
  const currentKey = boardList[activeBoardIndex.value].key
  return ['gaming', 'brand', 'ecommerce', 'social', 'movie', 'vip'].includes(currentKey)
})

// Retrieve the corresponding active dataset
const currentBoardData = computed(() => {
  const key = boardList[activeBoardIndex.value].key
  if (key === 'gaming') return gamingData
  if (key === 'brand') return brandData
  if (key === 'ecommerce') return ecommerceData
  if (key === 'social') return socialData
  if (key === 'movie') return movieData
  return vipData
})

// Extract Top 3 for the Podium layout
const top3Data = computed(() => {
  const data = currentBoardData.value
  // Place 1 (Index 0), Place 2 (Index 1), Place 3 (Index 2)
  return {
    first: data[0] || null,
    second: data[1] || null,
    third: data[2] || null
  }
})

// Ranks 4 and below list data
const listData = computed(() => {
  return currentBoardData.value.slice(3)
})
</script>

<template>
  <PageShell title="特色排行榜" description="完美实现小红书风格的深色渐变领奖台，1号居中，带独立头像边框皇冠与白角排版。">
    <view class="leaderboards-page">
      <wd-toast selector="leaderboard-toast" />

      <view class="leaderboards-split-container">
        
        <!-- Left Sidebar Navigation -->
        <scroll-view scroll-y class="left-sidebar-nav">
          <view
            v-for="(b, idx) in boardList"
            :key="b.id"
            :class="['sidebar-nav-item', { active: activeBoardIndex === idx }]"
            @click="switchBoard(idx)"
          >
            <view class="active-left-stripe" />
            <text class="nav-name">{{ b.name }}</text>
          </view>
        </scroll-view>

        <!-- Right Leaderboard Details Pane -->
        <view class="right-detail-pane flex-column">
          
          <!-- Podium Layout (For supported boards) -->
          <view v-if="isPodiumSupported" class="podium-header-wrapper">
            <!-- Theme title inside header -->
            <view class="board-header-title-row flex items-center justify-between">
              <text class="board-header-name font-bold">{{ boardList[activeBoardIndex].name }}</text>
              <wd-tag type="warning" size="small">实时更新</wd-tag>
            </view>

            <!-- Staggered Podium Container (2, 1, 3) -->
            <view class="podium-columns flex items-end justify-center">
              
              <!-- Rank 2: Silver (Left) -->
              <view v-if="top3Data.second" class="podium-card rank-silver-column">
                <view class="avatar-ring silver-ring relative-context">
                  <text class="crown-emoji-top silver-crown">👑</text>
                  <view class="circle-avatar">{{ top3Data.second.icon }}</view>
                  <view class="rank-badge silver-bg">2</view>
                </view>
                <view class="player-name font-bold text-center mt-1">{{ top3Data.second.name }}</view>
                <view class="player-val text-center mt-1">{{ top3Data.second.val }}</view>
                <!-- Stand base -->
                <view class="podium-stand silver-stand mt-2">2</view>
              </view>

              <!-- Rank 1: Gold (Center - Tallest) -->
              <view v-if="top3Data.first" class="podium-card rank-gold-column">
                <view class="avatar-ring gold-ring relative-context">
                  <text class="crown-emoji-top gold-crown">👑</text>
                  <view class="circle-avatar">{{ top3Data.first.icon }}</view>
                  <view class="rank-badge gold-bg">1</view>
                </view>
                <view class="player-name font-bold text-center mt-1">{{ top3Data.first.name }}</view>
                <view class="player-val text-center mt-1">{{ top3Data.first.val }}</view>
                <!-- Stand base -->
                <view class="podium-stand gold-stand mt-2">1</view>
              </view>

              <!-- Rank 3: Bronze (Right) -->
              <view v-if="top3Data.third" class="podium-card rank-bronze-column">
                <view class="avatar-ring bronze-ring relative-context">
                  <text class="crown-emoji-top bronze-crown">👑</text>
                  <view class="circle-avatar">{{ top3Data.third.icon }}</view>
                  <view class="rank-badge bronze-bg">3</view>
                </view>
                <view class="player-name font-bold text-center mt-1">{{ top3Data.third.name }}</view>
                <view class="player-val text-center mt-1">{{ top3Data.third.val }}</view>
                <!-- Stand base -->
                <view class="podium-stand bronze-stand mt-2">3</view>
              </view>
            </view>
          </view>

          <!-- Flat Header (For other fallback styles if any) -->
          <view v-else class="simple-board-header flex justify-between items-center">
            <text class="flat-header-name font-bold">{{ boardList[activeBoardIndex].name }}</text>
            <wd-tag type="primary" size="small">官方出品</wd-tag>
          </view>

          <!-- List below podium (White card wrapper) -->
          <scroll-view scroll-y class="list-scroll-view">
            <view class="white-card-list">
              <!-- If Podium is shown, show ranks 4+ here -->
              <view v-if="isPodiumSupported" class="sub-list-container">
                <view
                  v-for="item in listData"
                  :key="item.rank"
                  class="flat-list-row flex items-center justify-between"
                  @click="toast.success(`查看第 ${item.rank} 名：${item.name}`)"
                >
                  <view class="row-left flex items-center">
                    <text class="row-rank-num font-bold">{{ item.rank }}</text>
                    <view class="row-avatar ml-2">{{ item.icon }}</view>
                    <view class="row-meta ml-2">
                      <view class="row-name font-bold text-ink">{{ item.name }}</view>
                      <view class="row-sub-info mt-1">
                        <text class="level-badge mr-1">{{ item.desc }}</text>
                        <text>{{ item.sub }}</text>
                      </view>
                    </view>
                  </view>
                  <view class="row-val font-bold text-brand">{{ item.val }}</view>
                </view>
              </view>

              <!-- Fallback to complete list if podium not supported (though we support it for our core 20) -->
              <view v-else class="fallback-list-container">
                <view
                  v-for="item in currentBoardData"
                  :key="item.rank"
                  class="flat-list-row flex items-center justify-between"
                >
                  <view class="row-left flex items-center">
                    <text class="row-rank-num font-bold">{{ item.rank }}</text>
                    <view class="row-avatar ml-2">{{ item.icon }}</view>
                    <view class="row-meta ml-2">
                      <view class="row-name font-bold text-ink">{{ item.name }}</view>
                      <view class="row-sub-info mt-1">{{ item.sub }}</view>
                    </view>
                  </view>
                  <view class="row-val font-bold text-brand">{{ item.val }}</view>
                </view>
              </view>

            </view>
          </scroll-view>

        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.leaderboards-page {
  height: calc(100vh - 120rpx);
}

.leaderboards-split-container {
  display: flex;
  height: 100%;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  overflow: hidden;
  background: #f1f5f9;
}

/* Left Nav */
.left-sidebar-nav {
  width: 200rpx;
  background: #f8fafc;
  border-right: 1rpx solid var(--app-line);
  height: 100%;
}

.sidebar-nav-item {
  position: relative;
  padding: 24rpx 16rpx;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid var(--app-line);
  cursor: pointer;
  
  &.active {
    background: #fff;
    
    .nav-name {
      color: var(--app-brand);
      font-weight: 800;
    }
    
    .active-left-stripe {
      background: var(--app-brand);
    }
  }
}

.active-left-stripe {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6rpx;
  background: transparent;
}

.nav-name {
  font-size: 18rpx;
  color: var(--app-muted);
  line-height: 1.3;
}

/* Right Details view with layout-column */
.right-detail-pane {
  flex: 1;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* ==========================================
   HIGH-FIDELITY PODIUM GRADIENT HEADER
   ========================================== */
.podium-header-wrapper {
  background: linear-gradient(180deg, #581c87 0%, #3b0764 100%);
  padding: 24rpx;
  color: #fff;
  border-bottom: 1rpx solid #4a044e;
}

.board-header-title-row {
  display: flex;
  justify-content: space-between;
}

.board-header-name {
  font-size: 24rpx;
  color: #f3e8ff;
  text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.3);
}

.podium-columns {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 20rpx;
  margin-top: 36rpx;
  padding-bottom: 8rpx;
}

.podium-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140rpx;
}

/* Avatar circular rings */
.avatar-ring {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 4rpx solid transparent;
}

.gold-ring { border-color: #fde047; box-shadow: 0 0 12rpx #fde047; }
.silver-ring { border-color: #cbd5e1; box-shadow: 0 0 8rpx #cbd5e1; }
.bronze-ring { border-color: #ffedd5; box-shadow: 0 0 8rpx #ffedd5; }

.circle-avatar {
  font-size: 48rpx;
}

/* Crowns resting on top of circular ring */
.crown-emoji-top {
  position: absolute;
  top: -28rpx;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32rpx;
}

/* Sub-rank badge overlapping avatar */
.rank-badge {
  position: absolute;
  bottom: -6rpx;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16rpx;
  font-weight: 900;
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 2rpx solid #fff;
}

.gold-bg { background: #ca8a04; }
.silver-bg { background: #475467; }
.bronze-bg { background: #ea580c; }

.player-name {
  font-size: 18rpx;
  color: #f3e8ff;
  width: 130rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-val {
  font-size: 16rpx;
  color: #d8b4fe;
}

/* Podium stand columns */
.podium-stand {
  width: 100%;
  border-radius: 12rpx 12rpx 0 0;
  color: rgba(255,255,255,0.85);
  font-size: 36rpx;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2rpx 4rpx rgba(255,255,255,0.2);
}

.rank-gold-column .podium-stand {
  height: 90rpx;
  background: linear-gradient(180deg, #ca8a04 0%, #854d0e 100%);
  border: 1rpx solid #fde047;
}

.rank-silver-column .podium-stand {
  height: 70rpx;
  background: linear-gradient(180deg, #64748b 0%, #334155 100%);
  border: 1rpx solid #94a3b8;
}

.rank-bronze-column .podium-stand {
  height: 55rpx;
  background: linear-gradient(180deg, #c2410c 0%, #7c2d12 100%);
  border: 1rpx solid #fdba74;
}

/* Fallback Simple Header */
.simple-board-header {
  border-bottom: 2rpx solid var(--app-line);
  padding: 24rpx;
}
.flat-header-name {
  font-size: 24rpx;
}

/* ==========================================
   WHITE CARD LIST LAYOUT
   ========================================== */
.list-scroll-view {
  flex: 1;
  min-height: 0;
}

.white-card-list {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 16rpx 24rpx 60rpx;
  margin-top: -12rpx; /* overlap with podium to create connected look */
  position: relative;
  z-index: 2;
}

.flat-list-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--app-line);
  cursor: pointer;
  
  &:active {
    background: #f8fafc;
  }
}

.row-rank-num {
  font-size: 21rpx;
  color: var(--app-muted);
  width: 32rpx;
  text-align: center;
}

.row-avatar {
  font-size: 40rpx;
  width: 64rpx;
  height: 64rpx;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-meta {
  display: flex;
  flex-direction: column;
}

.row-name {
  font-size: 19rpx;
}

.level-badge {
  background: #e2e8f0;
  color: #475467;
  font-size: 14rpx;
  padding: 2rpx 8rpx;
  border-radius: 6rpx;
  font-weight: 800;
}

.row-val {
  font-size: 20rpx;
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-brand { color: var(--app-brand); }
.text-ink { color: var(--app-ink); }
.text-center { text-align: center; }
.ml-2 { margin-left: 16rpx; }
.mr-1 { margin-right: 8rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.relative-context { position: relative; }
</style>
