export interface WaterfallFeed {
  id: string
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
}

export const feedCategories = ['推荐', '探店', '美食', '旅行', '穿搭', '运动']

export const waterfallFeeds: WaterfallFeed[] = [
  {
    id: 'feed-1001',
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
    id: 'feed-1002',
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
    id: 'feed-1003',
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
    id: 'feed-1004',
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
    id: 'feed-1005',
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
    id: 'feed-1006',
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
  },
  {
    id: 'feed-1007',
    title: '夜市小吃合集',
    desc: '多图/短视频混排时，瀑布流可以按封面比例自动形成节奏。',
    cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=720&q=80',
    ratio: 1.12,
    author: '夜市观察员',
    city: '长沙',
    category: '美食',
    likes: 30500,
    comments: 1402,
    saves: 9600,
    duration: '00:41',
    tags: ['夜市', '小吃', '合集']
  },
  {
    id: 'feed-1008',
    title: '办公通勤包里有什么',
    desc: '适合种草流的轻内容：商品、品牌、价格和同款入口可以继续扩展。',
    cover: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=720&q=80',
    ratio: 0.98,
    author: '效率装备库',
    city: '北京',
    category: '穿搭',
    likes: 11300,
    comments: 233,
    saves: 3400,
    duration: '00:25',
    tags: ['通勤', '好物', '种草']
  },
  {
    id: 'feed-1009',
    title: '周末露营清单',
    desc: '卡片里可扩展商品、库存、优惠券和门店配送，适合电商模板。',
    cover: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=720&q=80',
    ratio: 1.26,
    author: '户外补给站',
    city: '南京',
    category: '探店',
    likes: 9900,
    comments: 204,
    saves: 2800,
    duration: '00:33',
    tags: ['露营', '清单', '户外']
  },
  {
    id: 'feed-1010',
    title: '健身房新手器械安排',
    desc: '新手训练路径，适合课程类 App 的瀑布流和详情承接。',
    cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=720&q=80',
    ratio: 1.38,
    author: '训练计划表',
    city: '武汉',
    category: '运动',
    likes: 16700,
    comments: 612,
    saves: 6100,
    duration: '00:45',
    tags: ['健身', '新手', '课程']
  },
  {
    id: 'feed-1011',
    title: '老街面馆一碗清汤面',
    desc: '门店型内容可直接连接预约、导航、优惠券和用户评价。',
    cover: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=720&q=80',
    ratio: 1.04,
    author: '一人食地图',
    city: '苏州',
    category: '美食',
    likes: 24800,
    comments: 928,
    saves: 7300,
    duration: '00:28',
    tags: ['面馆', '探店', '本地生活']
  },
  {
    id: 'feed-1012',
    title: '雪山徒步一分钟',
    desc: '高画幅封面适合拉开瀑布流高度差，详情页可以继续接视频播放。',
    cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=720&q=80',
    ratio: 1.5,
    author: '山野来信',
    city: '丽江',
    category: '旅行',
    likes: 35200,
    comments: 1506,
    saves: 11300,
    duration: '00:59',
    tags: ['徒步', '雪山', '旅行']
  }
]

export function getWaterfallFeed(id: string) {
  return waterfallFeeds.find((item) => item.id === id)
}

export function formatCount(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return String(value)
}
