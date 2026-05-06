export type WaterfallScene = 'life' | 'shop' | 'news' | 'moments'

export interface WaterfallFeed {
  id: string
  scene: WaterfallScene
  title: string
  desc: string
  cover: string
  ratio: number
  author: string
  city: string
  category: string
  likes: number
  comments: number
  saves: number
  duration: string
  tags: string[]
  price?: number
  originPrice?: number
  sales?: number
  source?: string
  time?: string
  images?: string[]
}

export const sceneTabs: Array<{ label: string; value: WaterfallScene; desc: string }> = [
  { label: '生活', value: 'life', desc: '双列图片流，适合短视频、本地生活和探店。' },
  { label: '电商', value: 'shop', desc: '商品瀑布流，点击进入商品详情。' },
  { label: '新闻', value: 'news', desc: '一行一个的信息流，适合资讯列表。' },
  { label: '朋友圈', value: 'moments', desc: '社交动态流，头像、文案和九宫格图片。' }
]

export const feedCategories = ['推荐', '探店', '美食', '旅行', '穿搭', '运动']

export const lifeFeeds: WaterfallFeed[] = [
  {
    id: 'life-1001',
    scene: 'life',
    title: '城市天台日落打卡',
    desc: '下班后 20 分钟抵达的城市天台，适合做活动页首屏素材和短视频封面。',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=80',
    ratio: 1.22,
    author: '城市漫游计划',
    city: '上海',
    category: '旅行',
    likes: 12800,
    comments: 342,
    saves: 1900,
    duration: '00:18',
    tags: ['日落', '城市', '打卡']
  },
  {
    id: 'life-1002',
    scene: 'life',
    title: '春日浅色穿搭模板',
    desc: '一套适合内容社区和电商导购的穿搭卡片，浅色背景更适合瀑布流。',
    cover: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=720&q=80',
    ratio: 1.42,
    author: '衣橱编辑部',
    city: '杭州',
    category: '穿搭',
    likes: 8900,
    comments: 128,
    saves: 2310,
    duration: '00:22',
    tags: ['穿搭', '春日', '导购']
  },
  {
    id: 'life-1003',
    scene: 'life',
    title: '巷口咖啡店探店',
    desc: '适合本地生活应用的探店流：封面、门店、评分和收藏数据都能复用。',
    cover: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=720&q=80',
    ratio: 1.16,
    author: '周末探店',
    city: '成都',
    category: '探店',
    likes: 15600,
    comments: 520,
    saves: 4800,
    duration: '00:31',
    tags: ['咖啡', '本地生活', '周末']
  },
  {
    id: 'life-1004',
    scene: 'life',
    title: '十分钟健康早餐',
    desc: '早餐制作步骤清晰，适合短视频详情页展示材料、步骤和评论。',
    cover: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=720&q=80',
    ratio: 1.08,
    author: '轻食日记',
    city: '广州',
    category: '美食',
    likes: 22100,
    comments: 861,
    saves: 7600,
    duration: '00:27',
    tags: ['早餐', '轻食', '教程']
  },
  {
    id: 'life-1005',
    scene: 'life',
    title: '海边公路自驾路线',
    desc: '路线、天气、停车点和拍照点都适合做小程序行程详情。',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=720&q=80',
    ratio: 1.34,
    author: '路线收藏夹',
    city: '厦门',
    category: '旅行',
    likes: 18400,
    comments: 406,
    saves: 5200,
    duration: '00:36',
    tags: ['自驾', '海边', '路线']
  },
  {
    id: 'life-1006',
    scene: 'life',
    title: '晚间跑步拉伸记录',
    desc: '运动内容流可以承载动作卡片、时长、消耗和打卡状态。',
    cover: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=720&q=80',
    ratio: 1.3,
    author: '运动打卡局',
    city: '深圳',
    category: '运动',
    likes: 7300,
    comments: 96,
    saves: 880,
    duration: '00:19',
    tags: ['跑步', '拉伸', '打卡']
  }
]

export const shopFeeds: WaterfallFeed[] = [
  {
    id: 'shop-2001',
    scene: 'shop',
    title: '轻量通勤双肩包',
    desc: '防泼水面料，13 英寸电脑仓，适合通勤和短途出差。',
    cover: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=720&q=80',
    ratio: 1.18,
    author: '城市装备店',
    city: '杭州',
    category: '通勤',
    likes: 8200,
    comments: 218,
    saves: 1320,
    duration: '',
    tags: ['通勤', '背包', '防泼水'],
    price: 199,
    originPrice: 299,
    sales: 2300
  },
  {
    id: 'shop-2002',
    scene: 'shop',
    title: '云感跑步鞋',
    desc: '轻弹中底，适合 5 公里日常慢跑和城市步行。',
    cover: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=720&q=80',
    ratio: 1.04,
    author: '运动补给站',
    city: '广州',
    category: '运动',
    likes: 15600,
    comments: 430,
    saves: 3900,
    duration: '',
    tags: ['跑步', '鞋履', '轻弹'],
    price: 369,
    originPrice: 499,
    sales: 5800
  },
  {
    id: 'shop-2003',
    scene: 'shop',
    title: '桌面氛围灯',
    desc: '三档色温，适合办公桌、床头和直播背景。',
    cover: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=720&q=80',
    ratio: 1.28,
    author: '效率家居',
    city: '深圳',
    category: '家居',
    likes: 6400,
    comments: 95,
    saves: 1700,
    duration: '',
    tags: ['桌面', '灯具', '氛围'],
    price: 89,
    originPrice: 129,
    sales: 1200
  },
  {
    id: 'shop-2004',
    scene: 'shop',
    title: '便携冷萃杯',
    desc: '一杯一盖，冷萃、茶饮和运动补水都能用。',
    cover: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=720&q=80',
    ratio: 1.36,
    author: '轻食器物',
    city: '上海',
    category: '生活',
    likes: 9100,
    comments: 180,
    saves: 2400,
    duration: '',
    tags: ['杯子', '冷萃', '便携'],
    price: 59,
    originPrice: 99,
    sales: 3400
  }
]

export const newsFeeds: WaterfallFeed[] = [
  {
    id: 'news-3001',
    scene: 'news',
    title: '多端应用模板完成登录、注册和瀑布流场景补齐',
    desc: '模板继续补齐真实业务场景：自定义 Tabbar、示例中心、组件中心和内容流页面已经形成基础闭环。',
    cover: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80',
    ratio: 0.74,
    author: '模板日报',
    city: '产品',
    category: '产品',
    likes: 2400,
    comments: 81,
    saves: 500,
    duration: '',
    tags: ['模板', '多端', '更新'],
    source: '技术频道',
    time: '10 分钟前'
  },
  {
    id: 'news-3002',
    scene: 'news',
    title: '本地生活小程序加速接入内容流和门店详情',
    desc: '内容流不再只是推荐页组件，也可以作为门店、活动、商品和用户评论的统一承接层。',
    cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=720&q=80',
    ratio: 0.76,
    author: '增长观察',
    city: '商业',
    category: '商业',
    likes: 5300,
    comments: 246,
    saves: 910,
    duration: '',
    tags: ['本地生活', '内容流'],
    source: '增长频道',
    time: '36 分钟前'
  },
  {
    id: 'news-3003',
    scene: 'news',
    title: '鸿蒙 App 与小程序共用业务组件成为团队提效重点',
    desc: '跨端工程更看重目录结构、样式规范、插件入口和统一的页面模板。',
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=720&q=80',
    ratio: 0.72,
    author: '工程前线',
    city: '技术',
    category: '技术',
    likes: 7600,
    comments: 318,
    saves: 1400,
    duration: '',
    tags: ['鸿蒙', '小程序', '工程'],
    source: '开发者周刊',
    time: '1 小时前'
  }
]

export const momentFeeds: WaterfallFeed[] = [
  {
    id: 'moment-4001',
    scene: 'moments',
    title: '今天把瀑布流拆成四种业务形态了',
    desc: '生活流、电商流、新闻流和朋友圈流都能从一个页面里切换。下一步准备加接口分页和骨架屏。',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=720&q=80',
    ratio: 1,
    author: '前端小队',
    city: '刚刚',
    category: '动态',
    likes: 132,
    comments: 18,
    saves: 0,
    duration: '',
    tags: ['开发记录', 'uni-app'],
    time: '刚刚',
    images: [
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=360&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=360&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=360&q=80'
    ]
  },
  {
    id: 'moment-4002',
    scene: 'moments',
    title: '探店样式终于顺了',
    desc: '图片、标题、城市和互动数据都能复用到详情页，业务看起来完整很多。',
    cover: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=720&q=80',
    ratio: 1,
    author: '产品同学',
    city: '22 分钟前',
    category: '动态',
    likes: 89,
    comments: 7,
    saves: 0,
    duration: '',
    tags: ['探店', '模板'],
    time: '22 分钟前',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=360&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=360&q=80'
    ]
  }
]

export const waterfallFeeds = [...lifeFeeds, ...shopFeeds, ...newsFeeds, ...momentFeeds]

export function getFeedsByScene(scene: WaterfallScene) {
  if (scene === 'life') return lifeFeeds
  if (scene === 'shop') return shopFeeds
  if (scene === 'news') return newsFeeds
  return momentFeeds
}

export function getWaterfallFeed(id: string) {
  return waterfallFeeds.find((item) => item.id === id)
}

export function formatCount(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return String(value)
}
