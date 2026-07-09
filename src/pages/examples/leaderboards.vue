<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('leaderboard-toast')

// Selected leaderboard index
const activeBoardIndex = ref(0)

const boardList = [
  { id: 1, name: 'App Store 应用榜', key: 'app-store' },
  { id: 2, name: 'Billboard 音乐榜', key: 'music' },
  { id: 3, name: '电商畅销热卖榜', key: 'ecommerce' },
  { id: 4, name: '微博社交热搜榜', key: 'social' },
  { id: 5, name: '证券个股涨幅榜', key: 'stock' },
  { id: 6, name: '王者公会争霸榜', key: 'gaming' },
  { id: 7, name: '电影票房排行榜', key: 'movie' },
  { id: 8, name: '旅游景点网红榜', key: 'travel' },
  { id: 9, name: '数码好物关注榜', key: 'tech' },
  { id: 10, name: '美食大厨人气榜', key: 'food' },
  { id: 11, name: '全国房企销售榜', key: 'real-estate' },
  { id: 12, name: '图书阅读热度榜', key: 'book' },
  { id: 13, name: '在线直播人气榜', key: 'live' },
  { id: 14, name: '新能源车销量榜', key: 'car' },
  { id: 15, name: '健身燃脂卡路里', key: 'fitness' },
  { id: 16, name: '全球企业估值榜', key: 'brand' },
  { id: 17, name: 'GitHub 趋势榜', key: 'github' },
  { id: 18, name: '播客订阅畅听榜', key: 'podcast' },
  { id: 19, name: '黑客松战队积分', key: 'hackathon' },
  { id: 20, name: '会员成长积分榜', key: 'vip' }
]

function switchBoard(index: number) {
  activeBoardIndex.value = index
  toast.success(`已切换至: ${boardList[index].name}`)
}

// --------------------------------------------------
// Mock Data definitions for the 20 leaderboards
// --------------------------------------------------
const appStoreData = [
  { rank: 1, name: '微信 (WeChat)', category: '社交', icon: '💬' },
  { rank: 2, name: '抖音 (TikTok)', category: '娱乐', icon: '🎵' },
  { rank: 3, name: '支付宝', category: '财务', icon: '💳' }
]

const musicData = [
  { rank: 1, name: '七里香', artist: '周杰伦', duration: '04:43', cover: '💿' },
  { rank: 2, name: 'Blinding Lights', artist: 'The Weeknd', duration: '03:20', cover: '📀' },
  { rank: 3, name: '泡沫', artist: '邓紫棋', duration: '04:18', cover: '💿' }
]

const ecommerceData = [
  { rank: 1, name: '智能降噪无线耳机', price: '¥1299', sales: '8.4万件', rating: '4.9' },
  { rank: 2, name: '超轻跑鞋 V2', price: '¥599', sales: '5.2万件', rating: '4.8' },
  { rank: 3, name: '便携挂烫机', price: '¥199', sales: '3.1万件', rating: '4.7' }
]

const socialData = [
  { rank: 1, title: '#人工智能安全公约首批签署#', count: '942.5万', tag: '爆' },
  { rank: 2, title: '#iPhone 18 潜望镜头再升级#', count: '610.2万', tag: '热' },
  { rank: 3, title: '#新一轮冷空气即将席卷南方#', count: '420.7万', tag: '新' }
]

const stockData = [
  { rank: 1, code: '600519', name: '贵州茅台', price: '1850.50', change: '+10.01%' },
  { rank: 2, code: '002594', name: '比亚迪', price: '286.40', change: '+8.45%' },
  { rank: 3, code: '300750', name: '宁德时代', price: '215.30', change: '+5.12%' }
]

const gamingData = [
  { rank: 1, name: '屠龙殿公会', leader: '魔王至尊', points: '984,200', icon: '👑' },
  { rank: 2, name: '凌霄阁战队', leader: '剑影留风', points: '862,100', icon: '🥈' },
  { rank: 3, name: '聚义堂兄弟', leader: '铁血霸气', points: '715,400', icon: '🥉' }
]

const movieData = [
  { rank: 1, name: '星际远航：觉醒', boxOffice: '¥42.6亿', showRate: '35.4%' },
  { rank: 2, name: '流浪都市', boxOffice: '¥31.8亿', showRate: '28.2%' },
  { rank: 3, name: '代号：守护者', boxOffice: '¥19.5亿', showRate: '18.1%' }
]

const travelData = [
  { rank: 1, name: '九寨沟自然保护区', location: '四川阿坝', score: '9.8 分', cover: '⛰️' },
  { rank: 2, name: '大理古城洱海', location: '云南大理', score: '9.6 分', cover: '🌊' },
  { rank: 3, name: '长白山天池景区', location: '吉林延边', score: '9.5 分', cover: '❄️' }
]

const techData = [
  { rank: 1, name: '旗舰微单相机 A7M5', brand: '索尼', spec: '6100万像素 / 8K录制', score: '98' },
  { rank: 2, name: '折叠屏旗舰手机 X Fold', brand: '智能终端', spec: '第二代骁龙8 / 双超声波', score: '95' },
  { rank: 3, name: '极客降噪电竞机械键盘', brand: '外设大厂', spec: '三模热插拔 / 磁轴触控', score: '92' }
]

const foodData = [
  { rank: 1, chef: '陈大厨', dish: '秘制东坡红烧肉', likes: '12.4k', avatar: '🍳' },
  { rank: 2, chef: '林主理', dish: '金丝避风塘炒蟹', likes: '9.8k', avatar: '🍲' },
  { rank: 3, chef: '王面点', dish: '黑松露芝士流沙包', likes: '7.5k', avatar: '🥯' }
]

const realEstateData = [
  { rank: 1, name: '万科星悦里', location: '朝阳区', price: '¥85000/㎡', units: '124套' },
  { rank: 2, name: '中海寰宇时代', location: '海淀区', price: '¥98000/㎡', units: '98套' },
  { rank: 3, name: '保利和光逸境', location: '丰台区', price: '¥78000/㎡', units: '85套' }
]

const bookData = [
  { rank: 1, name: '三体（全集）', author: '刘慈欣', readProgress: '85%', cover: '📘' },
  { rank: 2, name: '人类简史', author: '尤瓦尔·赫拉利', readProgress: '60%', cover: '📙' },
  { rank: 3, name: '白夜行', author: '东野圭吾', readProgress: '45%', cover: '📕' }
]

const liveData = [
  { rank: 1, name: '带货一姐李美美', title: '全网最低价好物大放送', heat: '8.4M', status: 'LIVE' },
  { rank: 2, name: '技术极客张老师', title: '现场手写Vue3核心编译器', heat: '5.2M', status: 'LIVE' },
  { rank: 3, name: '户外大冒险阿飞', title: '深度露营无人区大探险', heat: '3.1M', status: 'OFFLINE' }
]

const carData = [
  { rank: 1, model: 'Model Y', brand: '特斯拉', sales: '41,200 辆', share: '12.4%' },
  { rank: 2, model: '秦 PLUS DM-i', brand: '比亚迪', sales: '38,500 辆', share: '10.8%' },
  { rank: 3, model: '问界 M9', brand: '赛力斯', sales: '18,400 辆', share: '5.2%' }
]

const fitnessData = [
  { rank: 1, nickname: '健身狂人阿强', duration: '120分钟', calories: '850 kcal', avatar: '🏃' },
  { rank: 2, nickname: '瑜伽美少女', duration: '90分钟', calories: '420 kcal', avatar: '🧘' },
  { rank: 3, nickname: '深蹲小王子', duration: '60分钟', calories: '380 kcal', avatar: '🏋️' }
]

const brandData = [
  { rank: 1, name: '苹果公司 (Apple)', country: '美国', valuation: '$3.25万亿' },
  { rank: 2, name: '微软公司 (Microsoft)', country: '美国', valuation: '$3.08万亿' },
  { rank: 3, name: '英伟达 (NVIDIA)', country: '美国', valuation: '$2.96万亿' }
]

const githubData = [
  { rank: 1, repo: 'vuejs/core', lang: 'TypeScript', stars: '45,200', color: '#3178c6' },
  { rank: 2, repo: 'facebook/react', lang: 'JavaScript', stars: '224,100', color: '#f1e05a' },
  { rank: 3, repo: 'denoland/deno', lang: 'Rust', stars: '91,500', color: '#deeaff' }
]

const podcastData = [
  { rank: 1, name: '声东击西', hosts: '徐涛', listenCount: '4.8M', wave: '🎙️' },
  { rank: 2, name: '忽左忽右', hosts: '程衍樑', listenCount: '3.5M', wave: '📻' },
  { rank: 3, name: '知行合一', hosts: '孟岩', listenCount: '2.1M', wave: '🎙️' }
]

const hackathonData = [
  { rank: 1, team: '智行者 AI 队', commits: '142次', points: '98.5' },
  { rank: 2, team: '元宇宙探险家', commits: '98次', points: '89.4' },
  { rank: 3, team: '极客之光战队', commits: '84次', points: '82.1' }
]

const vipData = [
  { rank: 1, name: '至尊龙纹会员', level: 'V10', credits: '980,450', crown: '👑' },
  { rank: 2, name: '钻石先锋VIP', level: 'V8', credits: '642,100', crown: '💎' },
  { rank: 3, name: '黄金探索会员', level: 'V5', credits: '315,000', crown: '⭐️' }
]
</script>

<template>
  <PageShell title="特色排行榜" description="展示左导航与右面版多屏自适应架构下，完美整合 20 套主题各异的排行榜演练中心。">
    <view class="leaderboards-page">
      <wd-toast selector="leaderboard-toast" />

      <view class="leaderboards-split-container">
        
        <!-- Left Sidebar Navigation (20 List items) -->
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

        <!-- Right Leaderboard Details Area -->
        <scroll-view scroll-y class="right-detail-pane">
          
          <!-- Board Title -->
          <view class="right-pane-header flex items-center justify-between">
            <text class="current-board-title font-bold">{{ boardList[activeBoardIndex].name }}</text>
            <wd-tag type="primary" size="small">今日更新</wd-tag>
          </view>

          <!-- --------------------------------------------------
               1. App Store Top Apps Leaderboard
               -------------------------------------------------- -->
          <view v-if="boardList[activeBoardIndex].key === 'app-store'" class="ranking-layout-box">
            <view v-for="item in appStoreData" :key="item.rank" class="rank-item-card app-card flex items-center">
              <view :class="['rank-crown', `rank-${item.rank}`]">{{ item.rank }}</view>
              <view class="app-icon-badge ml-2">{{ item.icon }}</view>
              <view class="app-info-body flex-1 ml-2">
                <view class="app-name font-bold text-ink">{{ item.name }}</view>
                <view class="app-category mt-1">{{ item.category }} · 免费排行榜首</view>
              </view>
              <wd-button size="small" type="neutral" plain>获取</wd-button>
            </view>
          </view>

          <!-- --------------------------------------------------
               2. Billboard Music Leaderboard
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'music'" class="ranking-layout-box music-layout">
            <view v-for="item in musicData" :key="item.rank" class="rank-item-card music-card flex items-center">
              <view :class="['rank-crown', `rank-${item.rank}`]">{{ item.rank }}</view>
              <view class="music-cover-art ml-2">{{ item.cover }}</view>
              <view class="music-info flex-1 ml-2">
                <view class="song-title font-bold text-ink">{{ item.name }}</view>
                <view class="singer-name mt-1">{{ item.artist }}</view>
              </view>
              <text class="song-duration mr-2">{{ item.duration }}</text>
              <view class="play-btn-circle">▶</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               3. E-commerce Bestsellers Leaderboard
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'ecommerce'" class="ranking-layout-box">
            <view v-for="item in ecommerceData" :key="item.rank" class="rank-item-card ecommerce-card flex items-center">
              <view :class="['rank-crown', `rank-${item.rank}`]">{{ item.rank }}</view>
              <view class="prod-info-body flex-1 ml-2">
                <view class="prod-name font-bold text-ink">{{ item.name }}</view>
                <view class="prod-meta mt-1">销量：{{ item.sales }} · 评分：⭐ {{ item.rating }}</view>
              </view>
              <view class="price-box font-bold text-red">{{ item.price }}</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               4. Weibo Social Hot Searches
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'social'" class="ranking-layout-box">
            <view v-for="item in socialData" :key="item.rank" class="rank-item-card social-card flex items-center">
              <view :class="['rank-crown', `rank-${item.rank}`]">{{ item.rank }}</view>
              <view class="social-body flex-1 ml-2">
                <view class="social-title text-ink font-bold">{{ item.title }}</view>
                <view class="social-count mt-1">实时热度：{{ item.count }}次搜索</view>
              </view>
              <wd-tag type="danger" v-if="item.tag">{{ item.tag }}</wd-tag>
            </view>
          </view>

          <!-- --------------------------------------------------
               5. Financial Stock Gainers
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'stock'" class="ranking-layout-box">
            <view v-for="item in stockData" :key="item.rank" class="rank-item-card stock-card flex items-center justify-between">
              <view class="stock-left">
                <view class="stock-name font-bold text-ink">{{ item.name }}</view>
                <view class="stock-code mt-1">{{ item.code }}</view>
              </view>
              <view class="stock-right text-right">
                <view class="stock-price font-bold">{{ item.price }}</view>
                <view class="stock-change text-red font-bold">{{ item.change }}</view>
              </view>
            </view>
          </view>

          <!-- --------------------------------------------------
               6. Gaming Guild Leaderboard
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'gaming'" class="ranking-layout-box">
            <view v-for="item in gamingData" :key="item.rank" class="rank-item-card gaming-card flex items-center">
              <view class="guild-crown mr-2">{{ item.icon }}</view>
              <view class="guild-body flex-1">
                <view class="guild-name font-bold text-ink">{{ item.name }}</view>
                <view class="guild-leader mt-1">会长: {{ item.leader }}</view>
              </view>
              <view class="guild-points font-bold text-brand">{{ item.points }} 分</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               7. Movie Box Office Rankings
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'movie'" class="ranking-layout-box">
            <view v-for="item in movieData" :key="item.rank" class="rank-item-card movie-card flex items-center">
              <view :class="['rank-crown', `rank-${item.rank}`]">{{ item.rank }}</view>
              <view class="movie-body flex-1 ml-2">
                <view class="movie-title font-bold text-ink">{{ item.name }}</view>
                <view class="movie-rate mt-1">排片占比: {{ item.showRate }}</view>
              </view>
              <view class="movie-office font-bold text-orange">累计 {{ item.boxOffice }}</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               8. Travel Destination Hotlist
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'travel'" class="ranking-layout-box">
            <view v-for="item in travelData" :key="item.rank" class="rank-item-card travel-card flex items-center">
              <view class="scenic-cover mr-2">{{ item.cover }}</view>
              <view class="scenic-body flex-1">
                <view class="scenic-name font-bold text-ink">{{ item.name }}</view>
                <view class="scenic-loc mt-1">{{ item.location }}</view>
              </view>
              <view class="scenic-score font-bold text-green">{{ item.score }}</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               9. Tech Gadget Popularity
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'tech'" class="ranking-layout-box">
            <view v-for="item in techData" :key="item.rank" class="rank-item-card tech-card">
              <view class="flex items-center justify-between">
                <text class="tech-brand-tag">{{ item.brand }}</text>
                <text class="tech-score font-bold text-brand">{{ item.score }} pts</text>
              </view>
              <view class="tech-name font-bold text-ink mt-1">{{ item.name }}</view>
              <view class="tech-spec mt-1">{{ item.spec }}</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               10. Gourmet Recipe Rankings
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'food'" class="ranking-layout-box">
            <view v-for="item in foodData" :key="item.rank" class="rank-item-card food-card flex items-center">
              <view class="chef-avatar mr-2">{{ item.avatar }}</view>
              <view class="food-body flex-1">
                <view class="food-dish font-bold text-ink">{{ item.dish }}</view>
                <view class="chef-name mt-1">主厨: {{ item.chef }}</view>
              </view>
              <view class="food-likes text-red">❤️ {{ item.likes }}</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               11. Real Estate Sales Rank
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'real-estate'" class="ranking-layout-box">
            <view v-for="item in realEstateData" :key="item.rank" class="rank-item-card real-estate-card flex items-center justify-between">
              <view class="re-left">
                <view class="re-name font-bold text-ink">{{ item.name }}</view>
                <view class="re-loc mt-1">区位: {{ item.location }} · 单价: {{ item.price }}</view>
              </view>
              <view class="re-right text-right">
                <view class="re-units font-bold text-brand">{{ item.units }}</view>
                <view class="re-lbl mt-1">当周套数</view>
              </view>
            </view>
          </view>

          <!-- --------------------------------------------------
               12. Book Bestseller Charts
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'book'" class="ranking-layout-box">
            <view v-for="item in bookData" :key="item.rank" class="rank-item-card book-card">
              <view class="flex items-center">
                <view class="book-cover mr-2">{{ item.cover }}</view>
                <view class="book-body flex-1">
                  <view class="book-name font-bold text-ink">{{ item.name }}</view>
                  <view class="book-author mt-1">作者: {{ item.author }}</view>
                </view>
                <text class="read-pct">{{ item.readProgress }} 已读</text>
              </view>
              <view class="progress-bar-bg mt-2">
                <view class="progress-bar-fill" :style="{ width: item.readProgress }" />
              </view>
            </view>
          </view>

          <!-- --------------------------------------------------
               13. Live Streamers Heat Rank
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'live'" class="ranking-layout-box">
            <view v-for="item in liveData" :key="item.rank" class="rank-item-card live-card flex items-center">
              <view class="live-status-dot mr-2" :class="{ offline: item.status === 'OFFLINE' }" />
              <view class="live-body flex-1">
                <view class="live-name font-bold text-ink">{{ item.name }}</view>
                <view class="live-title mt-1">{{ item.title }}</view>
              </view>
              <view class="live-heat font-bold text-red">🔥 {{ item.heat }}</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               14. Automobile Sales Monthly
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'car'" class="ranking-layout-box">
            <view v-for="item in carData" :key="item.rank" class="rank-item-card car-card flex items-center">
              <view :class="['rank-crown', `rank-${item.rank}`]">{{ item.rank }}</view>
              <view class="car-body flex-1 ml-2">
                <view class="car-model font-bold text-ink">{{ item.model }}</view>
                <view class="car-brand mt-1">品牌: {{ item.brand }} · 市场份额: {{ item.share }}</view>
              </view>
              <view class="car-sales font-bold text-brand">{{ item.sales }}</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               15. Fitness Workout Calories
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'fitness'" class="ranking-layout-box">
            <view v-for="item in fitnessData" :key="item.rank" class="rank-item-card fitness-card flex items-center">
              <view class="fit-avatar mr-2">{{ item.avatar }}</view>
              <view class="fit-body flex-1">
                <view class="fit-name font-bold text-ink">{{ item.nickname }}</view>
                <view class="fit-duration mt-1">运动时长: {{ item.duration }}</view>
              </view>
              <view class="fit-calories font-bold text-green">{{ item.calories }}</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               16. Corporate Brand Values
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'brand'" class="ranking-layout-box">
            <view v-for="item in brandData" :key="item.rank" class="rank-item-card brand-card flex items-center justify-between">
              <view class="brand-left">
                <view class="brand-name font-bold text-ink">{{ item.name }}</view>
                <view class="brand-country mt-1">总部地区: {{ item.country }}</view>
              </view>
              <view class="brand-value font-bold text-brand">{{ item.valuation }}</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               17. GitHub Trending Repos
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'github'" class="ranking-layout-box">
            <view v-for="item in githubData" :key="item.rank" class="rank-item-card github-card">
              <view class="flex items-center justify-between">
                <text class="github-repo font-bold text-ink">{{ item.repo }}</text>
                <text class="github-stars font-bold">⭐ {{ item.stars }}</text>
              </view>
              <view class="github-lang-row mt-2 flex items-center">
                <view class="lang-color-dot" :style="{ background: item.color }" />
                <text class="lang-txt ml-1">{{ item.lang }}</text>
              </view>
            </view>
          </view>

          <!-- --------------------------------------------------
               18. Podcast Subscription Channels
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'podcast'" class="ranking-layout-box">
            <view v-for="item in podcastData" :key="item.rank" class="rank-item-card podcast-card flex items-center">
              <view class="podcast-wave mr-2">{{ item.wave }}</view>
              <view class="podcast-body flex-1">
                <view class="podcast-name font-bold text-ink">{{ item.name }}</view>
                <view class="podcast-hosts mt-1">主理人: {{ item.hosts }}</view>
              </view>
              <view class="podcast-listen font-bold text-brand">{{ item.listenCount }} 次收听</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               19. Hackathon Team Scoreboard
               -------------------------------------------------- -->
          <view v-else-if="boardList[activeBoardIndex].key === 'hackathon'" class="ranking-layout-box">
            <view v-for="item in hackathonData" :key="item.rank" class="rank-item-card hackathon-card">
              <view class="flex justify-between items-center">
                <text class="team-name font-bold text-ink">{{ item.team }}</text>
                <text class="team-score font-bold text-brand">{{ item.points }} 分</text>
              </view>
              <view class="team-commits mt-1">Git 提交数: {{ item.commits }}</view>
            </view>
          </view>

          <!-- --------------------------------------------------
               20. VIP Growth Credits Leaderboard
               -------------------------------------------------- -->
          <view v-slot:default v-else-if="boardList[activeBoardIndex].key === 'vip'" class="ranking-layout-box">
            <view v-for="item in vipData" :key="item.rank" class="rank-item-card vip-card flex items-center">
              <view class="vip-crown mr-2">{{ item.crown }}</view>
              <view class="vip-body flex-1">
                <view class="vip-name font-bold text-ink">{{ item.name }}</view>
                <view class="vip-level mt-1">成长体系等级: {{ item.level }}</view>
              </view>
              <view class="vip-credits font-bold text-orange">{{ item.credits }} Pts</view>
            </view>
          </view>

        </scroll-view>
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
  background: #fff;
}

/* Left Navigation */
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

/* Right Details Board */
.right-detail-pane {
  flex: 1;
  height: 100%;
  background: #fff;
  padding: 24rpx;
}

.right-pane-header {
  border-bottom: 2rpx solid var(--app-line);
  padding-bottom: 16rpx;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.current-board-title {
  font-size: 24rpx;
  color: var(--app-ink);
}

/* General Ranking Cards styling */
.ranking-layout-box {
  display: grid;
  gap: 16rpx;
  padding-bottom: 60rpx;
}

.rank-item-card {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 20rpx;
  background: #f8fafc;
  transition: all 0.2s ease;
  
  &:active {
    background: #f1f5f9;
  }
}

.rank-crown {
  font-size: 20rpx;
  font-weight: 800;
  width: 38rpx;
  height: 38rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--app-muted);
  
  &.rank-1 { background: #fef08a; color: #854d0e; }
  &.rank-2 { background: #e2e8f0; color: #475467; }
  &.rank-3 { background: #ffedd5; color: #c2410c; }
}

/* Styles specifics */
.app-icon-badge {
  font-size: 32rpx;
}
.app-category, .singer-name, .prod-meta, .social-count, .stock-code, .guild-leader, .movie-rate, .scenic-loc, .tech-spec, .chef-name, .re-loc, .book-author, .live-title, .car-brand, .fit-duration, .brand-country, .team-commits, .vip-level {
  font-size: 16rpx;
  color: var(--app-muted);
}

.app-name, .song-title, .prod-name, .social-title, .stock-name, .guild-name, .movie-title, .scenic-name, .tech-name, .food-dish, .re-name, .book-name, .live-name, .car-model, .fit-name, .brand-name, .github-repo, .podcast-name, .team-name, .vip-name {
  font-size: 19rpx;
}

/* Music disc cover */
.music-cover-art {
  font-size: 36rpx;
}
.play-btn-circle {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: var(--app-brand);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16rpx;
}

/* Progress bar inside book card */
.progress-bar-bg {
  height: 8rpx;
  background: var(--app-line);
  border-radius: 4rpx;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: var(--app-brand);
}

.live-status-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #ef4444;
  animation: flashStatus 1s infinite alternate;
  
  &.offline {
    background: #94a3b8;
    animation: none;
  }
}

@keyframes flashStatus {
  from { opacity: 0.3; }
  to { opacity: 1; }
}

/* GitHub stars colored tag */
.lang-color-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}
.lang-txt {
  font-size: 16rpx;
  color: var(--app-muted);
}

/* VIP crowns */
.vip-crown, .guild-crown, .fit-avatar, .chef-avatar, .scenic-cover, .book-cover, .podcast-wave {
  font-size: 32rpx;
}

.flex { display: flex; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-ink { color: var(--app-ink); }
.text-red { color: #ef4444; }
.text-orange { color: #f97316; }
.text-green { color: #10b981; }
.text-brand { color: var(--app-brand); }
.text-right { text-align: right; }
.ml-1 { margin-left: 8rpx; }
.ml-2 { margin-left: 16rpx; }
.mr-2 { margin-right: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-4 { margin-top: 32rpx; }
.tech-brand-tag {
  background: #f1f5f9;
  border-radius: 6rpx;
  font-size: 16rpx;
  padding: 2rpx 8rpx;
  color: var(--app-muted);
}
</style>
