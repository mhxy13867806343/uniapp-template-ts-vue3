<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { useAppEnv } from '@/hooks/useAppEnv'
import { useBackRefresh } from '@/hooks/useBackRefresh'
import { usePagePagination, useStepPagination } from '@/hooks/pagination'
import { usePlatform } from '@/hooks/usePlatform'
import { useAppStore } from '@/store'
import { appCache } from '@/utils/cache'
import { ecommercePageCount, ecommercePlatformSummaries, ecommerceTerminalSummaries } from '@/utils/ecommerceCatalog'
import { navigateToExample } from '@/utils/exampleScenarios'
import {
  formatAddress,
  formatBoolean,
  formatCompactNumber,
  formatCountdown,
  formatCurrency,
  formatDateRange,
  formatDateTime,
  formatDuration,
  formatFileSize,
  formatListText,
  formatPercent,
  formatQuery,
  formatRelativeTime,
  formatSignedNumber,
  formatWeekday,
  getSpecialLength,
  maskBankCard,
  maskPhone,
  numberToChinese,
  truncateBySpecialLength
} from '@/utils/format'
import { isBankCard, isEmail, isIdCard, isPhone, isStrongPassword } from '@/utils/validate'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

const appStore = useAppStore()
const { appEnv } = useAppEnv()
const { platform } = usePlatform()

const metrics = [
  { label: '今日订单', value: '128', trend: '+18%' },
  { label: '待处理', value: '24', trend: '-6%' },
  { label: '成交额', value: '¥56.8k', trend: '+12%' },
  { label: '活跃用户', value: '8,642', trend: '+9%' }
]

const shortcuts = [
  { title: '客户录入', path: 'basic', icon: 'edit-outline' },
  { title: '商品下单', path: 'junior', icon: 'cart' },
  { title: '审批中心', path: 'intermediate', icon: 'check' },
  { title: '运营看板', path: 'advanced', icon: 'chart' }
]

const tasks = [
  { title: '小程序审核资料待确认', value: '2 小时内', type: 'warning' },
  { title: 'App 端异常日志待复盘', value: '进行中', type: 'primary' },
  { title: 'H5 活动页数据待归档', value: '今天', type: 'success' }
] as const

const channels = [
  { name: 'H5', progress: 92 },
  { name: '微信小程序', progress: 86 },
  { name: '抖音小程序', progress: 74 },
  { name: '鸿蒙 App', progress: 68 }
]

const ecommercePlatforms = ecommercePlatformSummaries
const ecommerceTerminals = ecommerceTerminalSummaries

const pagePagination = usePagePagination({ page: 2, pageSize: 10, total: 58 })
const stepPagination = useStepPagination({ offset: 20, step: 20, total: 86 })
useBackRefresh('home-demo')
const sampleText = 'UniApp模板🚀#H5小程序'
const cacheDemoKey = 'home:tools'

appCache.set(cacheDemoKey, { page: 'home', module: 'tools' }, 5 * 60 * 1000)
appCache.update(cacheDemoKey, { touched: true }, 5 * 60 * 1000)

const utilityItems = computed(() => [
  {
    label: 'dayjs 时间格式化',
    value: formatDateTime(Date.now(), 'YYYY-MM-DD HH:mm'),
    desc: 'formatDateTime(Date.now())'
  },
  {
    label: '数字转中文',
    value: numberToChinese(20260506),
    desc: 'numberToChinese(20260506)'
  },
  {
    label: '特殊字符长度',
    value: `${getSpecialLength(sampleText)} 位`,
    desc: sampleText
  },
  {
    label: '金额格式化',
    value: formatCurrency(56800),
    desc: 'formatCurrency(56800)'
  },
  {
    label: '特殊长度截断',
    value: truncateBySpecialLength(sampleText, 14),
    desc: 'truncateBySpecialLength(text, 14)'
  },
  {
    label: '手机号脱敏',
    value: maskPhone('13800138000'),
    desc: 'maskPhone(13800138000)'
  },
  {
    label: '银行卡脱敏',
    value: maskBankCard('6222888866661234'),
    desc: 'maskBankCard(cardNo)'
  },
  {
    label: '文件大小',
    value: formatFileSize(128 * 1024 * 1024),
    desc: 'formatFileSize(bytes)'
  },
  {
    label: '百分比',
    value: formatPercent(0.8625),
    desc: 'formatPercent(0.8625)'
  },
  {
    label: '万/亿缩写',
    value: formatCompactNumber(1286420),
    desc: 'formatCompactNumber(1286420)'
  },
  {
    label: '相对时间',
    value: formatRelativeTime(Date.now() - 2 * 60 * 60 * 1000),
    desc: 'formatRelativeTime(time)'
  },
  {
    label: '时长格式化',
    value: formatDuration(3725),
    desc: 'formatDuration(3725)'
  },
  {
    label: '日期范围',
    value: formatDateRange(Date.now(), Date.now() + 86400000),
    desc: 'formatDateRange(start, end)'
  },
  {
    label: '星期格式',
    value: formatWeekday(Date.now(), '今天'),
    desc: 'formatWeekday(Date.now())'
  },
  {
    label: '倒计时',
    value: formatCountdown(26 * 60 * 60 * 1000),
    desc: 'formatCountdown(ms)'
  },
  {
    label: '列表文本',
    value: formatListText(['H5', '小程序', '鸿蒙']),
    desc: 'formatListText(list)'
  },
  {
    label: '正负数',
    value: formatSignedNumber(18),
    desc: 'formatSignedNumber(18)'
  },
  {
    label: '布尔文案',
    value: formatBoolean(true, '已启用', '已停用'),
    desc: 'formatBoolean(value)'
  },
  {
    label: '地址拼接',
    value: formatAddress(['上海市', '浦东新区', '张江']),
    desc: 'formatAddress(parts)'
  },
  {
    label: 'Query 生成',
    value: formatQuery({ page: 1, keyword: '模板' }),
    desc: 'formatQuery(params)'
  }
])

const hookItems = computed(() => [
  {
    label: '页码分页',
    value: `第 ${pagePagination.page.value}/${pagePagination.totalPage.value} 页`,
    desc: `page=${pagePagination.params.value.page}, pageSize=${pagePagination.params.value.pageSize}`
  },
  {
    label: '步长分页',
    value: `已展示 ${stepPagination.visibleCount.value} 条`,
    desc: `offset=${stepPagination.params.value.offset}, limit=${stepPagination.params.value.limit}`
  },
  {
    label: '返回上一页不刷新',
    value: 'useBackRefresh',
    desc: 'backWithoutRefresh() / backWithRefresh()'
  },
  {
    label: '请求封装',
    value: 'requests.ts',
    desc: 'createRequest() / request()'
  },
  {
    label: '缓存封装',
    value: appCache.has(cacheDemoKey) ? `${Math.ceil(appCache.getTtl(cacheDemoKey) / 1000)}s` : '未命中',
    desc: 'appCache.set/get/update/getOrSet'
  },
  {
    label: '校验方法',
    value: isPhone('13800138000') && isEmail('demo@uni.app') ? '通过' : '失败',
    desc: 'isPhone / isEmail / isIdCard'
  },
  {
    label: '安全校验',
    value: isStrongPassword('Uniapp2026') ? '强密码' : '弱密码',
    desc: `身份证:${isIdCard('11010519491231002X') ? '对' : '错'} 银行卡:${isBankCard('6225881414207430') ? '对' : '错'}`
  }
])

function viewMoreUtilities() {
  uni.navigateTo({
    url: '/pages/examples/utilities'
  })
}

const shareConfig = {
  title: 'UniApp Vue3 TS 多端极速开发模板',
  path: '/pages/home/index?from=wechat_mp_home',
  imageUrl: 'https://mhxy13867806343.github.io/uniapp-template-ts-vue3/logo.png'
}

onShareAppMessage(() => ({
  title: shareConfig.title,
  path: shareConfig.path,
  imageUrl: shareConfig.imageUrl
}))

onShareTimeline(() => ({
  title: shareConfig.title,
  query: shareConfig.path.includes('?') ? shareConfig.path.split('?')[1] : '',
  imageUrl: shareConfig.imageUrl
}))

function navToSharePage(type: 'wechat' | 'system' | 'poster') {
  const urlMap = {
    wechat: '/pages/uni-api/share-wechat',
    system: '/pages/uni-api/share-system',
    poster: '/pages/uni-api/share-poster'
  }
  uni.navigateTo({
    url: urlMap[type]
  })
}

function navToApiPage(type: 'interface' | 'storage' | 'routing') {
  const urlMap = {
    interface: '/pages/uni-api/interface',
    storage: '/pages/uni-api/storage',
    routing: '/pages/uni-api/routing'
  }
  uni.navigateTo({
    url: urlMap[type]
  })
}

function navToBubbleGallery() {
  uni.navigateTo({
    url: '/pages/examples/bubble-gallery'
  })
}

function navToWebsocketPage() {
  uni.navigateTo({
    url: '/pages/framework/websocket'
  })
}

function navToUdpPage() {
  uni.navigateTo({
    url: '/pages/framework/udp'
  })
}

function navToWorkerPage() {
  uni.navigateTo({
    url: '/pages/framework/worker'
  })
}

function navToEcommerceZone() {
  uni.navigateTo({
    url: '/pages/ecommerce/index'
  })
}

function navToEcommercePage(url: string) {
  uni.navigateTo({
    url
  })
}

appStore.markReady()
</script>

<template>
  <PageShell title="工作台" description="面向多端业务应用的首页模板，集中展示经营数据、任务和快捷入口。">
    <view class="home-dashboard">
      <view class="hero-card">
        <view>
          <view class="hero-title">{{ appStore.title }}</view>
          <view class="hero-desc">{{ platform.name }} / {{ appEnv.mode }} / {{ appEnv.apiBaseUrl }}</view>
        </view>
        <wd-tag type="primary">运行中</wd-tag>
      </view>

      <view class="metric-grid">
        <view
          v-for="item in metrics"
          :key="item.label"
          class="metric-card"
        >
          <view class="metric-label">{{ item.label }}</view>
          <view class="metric-value">{{ item.value }}</view>
          <wd-tag :type="item.trend.startsWith('+') ? 'success' : 'danger'" plain>{{ item.trend }}</wd-tag>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head">
          <text>快捷入口</text>
          <wd-button size="small" type="primary" plain @click="navigateToExample('complex')">复杂场景</wd-button>
        </view>
        <view class="shortcut-grid">
          <view
            v-for="item in shortcuts"
            :key="item.title"
            class="shortcut-item"
            @click="navigateToExample(item.path)"
          >
            <wd-icon :name="item.icon" size="24px" custom-class="shortcut-icon" />
            <text>{{ item.title }}</text>
          </view>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head">
          <text>多端健康度</text>
          <wd-tag plain>{{ channels.length }} 端</wd-tag>
        </view>
        <view
          v-for="item in channels"
          :key="item.name"
          class="channel-row"
        >
          <view class="channel-title">
            <text>{{ item.name }}</text>
            <text>{{ item.progress }}%</text>
          </view>
          <wd-progress :percentage="item.progress" />
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head">
          <text>电商专区</text>
          <wd-button size="small" type="primary" plain @click="navToEcommerceZone">查看全部 {{ ecommercePageCount }} 页</wd-button>
        </view>
        <view class="share-desc-info mb-2">
          新增淘宝、京东、拼多多三大电商平台页面矩阵，覆盖浏览、商品详情、购物车、下单、支付、订单、售后、店铺、营销、商家后台等高频链路。
        </view>

        <view class="ecommerce-terminal-row">
          <view v-for="item in ecommerceTerminals" :key="item.key" class="ecommerce-terminal-chip">
            {{ item.label }} · {{ item.count }} 页
          </view>
        </view>

        <view class="ecommerce-platform-grid">
          <view
            v-for="item in ecommercePlatforms"
            :key="item.key"
            class="ecommerce-platform-card"
            :style="{ background: item.surface, borderColor: item.accent }"
          >
            <view class="ecommerce-platform-title">{{ item.label }}</view>
            <view class="ecommerce-platform-desc">{{ item.description }}</view>
            <view class="ecommerce-platform-actions">
              <wd-button size="small" type="primary" @click="navToEcommercePage(item.browseRoute)">去浏览</wd-button>
              <wd-button size="small" plain @click="navToEcommercePage(item.orderRoute)">去下单</wd-button>
            </view>
          </view>
        </view>
      </view>

      <view class="panel-section">
        <view class="section-head">
          <text>今日待办</text>
          <wd-tag type="warning" plain>{{ tasks.length }}</wd-tag>
        </view>
        <wd-cell-group border>
          <wd-cell
            v-for="task in tasks"
            :key="task.title"
            :title="task.title"
            :value="task.value"
            is-link
          >
            <template #icon>
              <wd-tag :type="task.type" custom-class="task-tag">待办</wd-tag>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <view class="panel-section">
        <view class="section-head">
          <text>工具方法</text>
          <wd-button size="small" type="primary" plain @click="viewMoreUtilities">查看更多</wd-button>
        </view>

        <view class="utility-grid">
          <view v-for="item in utilityItems" :key="item.label" class="utility-card">
            <view class="utility-label">{{ item.label }}</view>
            <view class="utility-value">{{ item.value }}</view>
            <view class="utility-desc">{{ item.desc }}</view>
          </view>
        </view>

        <view class="hook-list">
          <view v-for="item in hookItems" :key="item.label" class="hook-row">
            <view>
              <view class="hook-title">{{ item.label }}</view>
              <view class="hook-desc">{{ item.desc }}</view>
            </view>
            <wd-tag plain>{{ item.value }}</wd-tag>
          </view>
        </view>
      </view>

      <view class="panel-section bottom-share-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>🔌 WebSocket 示例中心</text>
          <wd-tag type="primary">6种 tabs 示例</wd-tag>
        </view>
        <view class="share-desc-info mb-3">
          从首页直接进入统一的 WebSocket 实验页，通过 tabs 切换基础连接、聊天室、心跳保活、订单状态、价格推送、在线状态同步 6 种场景。
        </view>

        <view class="share-links-list flex-column">
          <view class="share-link-row flex justify-between items-center p-2" @click="navToWebsocketPage">
            <view class="flex items-center">
              <text class="share-link-icon">🛰️</text>
              <view class="share-link-meta ml-2">
                <text class="share-link-title font-bold text-ink">进入 WebSocket 示例页</text>
                <text class="share-link-desc">支持连接、重连、断开、自定义消息发送和日志查看，tabs 下切换 6 种 ws 示例。</text>
              </view>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>
        </view>
      </view>

      <view class="panel-section bottom-share-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>📡 UDP 调试台</text>
          <wd-tag type="warning">后端桥接示例</wd-tag>
        </view>
        <view class="share-desc-info mb-3">
          UDP 在 H5 里不能直接原生发送，所以这里配了一套 FastAPI 后端桥接。前端通过 HTTP 触发 UDP 报文发送，再用 WebSocket 实时订阅后端收到的 UDP 事件。
        </view>

        <view class="share-links-list flex-column">
          <view class="share-link-row flex justify-between items-center p-2" @click="navToUdpPage">
            <view class="flex items-center">
              <text class="share-link-icon">📶</text>
              <view class="share-link-meta ml-2">
                <text class="share-link-title font-bold text-ink">进入 UDP 调试台</text>
                <text class="share-link-desc">支持 6 种 UDP 场景 tabs、发送报文、查看回包、订阅后端 UDP 事件流。</text>
              </view>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>
        </view>
      </view>

      <view class="panel-section bottom-share-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>🧵 Worker 示例中心</text>
          <wd-tag type="success">6种后台任务</wd-tag>
        </view>
        <view class="share-desc-info mb-3">
          补了一套 Worker 示例页，用来演示把计算密集型任务放到 Worker 线程里执行。H5 环境优先使用真实 Worker，不支持的端会自动降级为主线程模拟执行。
        </view>

        <view class="share-links-list flex-column">
          <view class="share-link-row flex justify-between items-center p-2" @click="navToWorkerPage">
            <view class="flex items-center">
              <text class="share-link-icon">⚙️</text>
              <view class="share-link-meta ml-2">
                <text class="share-link-title font-bold text-ink">进入 Worker 示例页</text>
                <text class="share-link-desc">支持素数统计、Fibonacci、排序、JSON 处理、分块统计、词频分析 6 种任务。</text>
              </view>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>
        </view>
      </view>

      <!-- Bottom Share Entry zone (3 pages grid) -->
      <view class="panel-section bottom-share-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>⚙️ 平台分享与开发调用专区</text>
          <wd-tag type="success">3类分享接口</wd-tag>
        </view>
        <view class="share-desc-info mb-3">
          我们为外部使用者封装了三类主流的跨端分享方法。点击下方入口即可跳转到专用页面，查看运行兼容性、预览卡片并拷贝代码调用接口：
        </view>

        <view class="share-links-list flex-column">
          <!-- WeChat -->
          <view class="share-link-row flex justify-between items-center p-2 mb-2" @click="navToSharePage('wechat')">
            <view class="flex items-center">
              <text class="share-link-icon">💬</text>
              <view class="share-link-meta ml-2">
                <text class="share-link-title font-bold text-ink">微信社交生态分享</text>
                <text class="share-link-desc">支持小程序卡片、朋友圈定制及微信 JSSDK/App 调用</text>
              </view>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>

          <!-- System -->
          <view class="share-link-row flex justify-between items-center p-2 mb-2" @click="navToSharePage('system')">
            <view class="flex items-center">
              <text class="share-link-icon">📱</text>
              <view class="share-link-meta ml-2">
                <text class="share-link-title font-bold text-ink">OS 系统原生分享</text>
                <text class="share-link-desc">一键呼起 iOS AirDrop/Android 系统原生社交面板</text>
              </view>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>

          <!-- Poster -->
          <view class="share-link-row flex justify-between items-center p-2" @click="navToSharePage('poster')">
            <view class="flex items-center">
              <text class="share-link-icon">🖼️</text>
              <view class="share-link-meta ml-2">
                <text class="share-link-title font-bold text-ink">卡片海报生成保存</text>
                <text class="share-link-desc">基于 Canvas 绘图生成分享卡片，一键授权保存相册</text>
              </view>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>
        </view>
      </view>

      <!-- Bottom Core API Entry zone (3 pages grid) -->
      <view class="panel-section bottom-share-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>🔧 UniApp 核心 API 演示专区</text>
          <wd-tag type="primary">3类核心组件</wd-tag>
        </view>
        <view class="share-desc-info mb-3">
          精选封装了微信/App常用的界面反馈、导航Tab定制、异步/同步数据存储管理与路由历史堆栈的可视化调试演示：
        </view>

        <view class="share-links-list flex-column">
          <!-- Interface -->
          <view class="share-link-row flex justify-between items-center p-2 mb-2" @click="navToApiPage('interface')">
            <view class="flex items-center">
              <text class="share-link-icon">🎨</text>
              <view class="share-link-meta ml-2">
                <text class="share-link-title font-bold text-ink">界面交互控制 APIs</text>
                <text class="share-link-desc">交互反馈 (Toast/Modal)、动态导航栏及 TabBar Badge 设置</text>
              </view>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>

          <!-- Storage -->
          <view class="share-link-row flex justify-between items-center p-2 mb-2" @click="navToApiPage('storage')">
            <view class="flex items-center">
              <text class="share-link-icon">💾</text>
              <view class="share-link-meta ml-2">
                <text class="share-link-title font-bold text-ink">数据缓存 APIs</text>
                <text class="share-link-desc">同步与异步 get/set/removeStorage 键值读写及内存清理</text>
              </view>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>

          <!-- Routing -->
          <view class="share-link-row flex justify-between items-center p-2" @click="navToApiPage('routing')">
            <view class="flex items-center">
              <text class="share-link-icon">🥞</text>
              <view class="share-link-meta ml-2">
                <text class="share-link-title font-bold text-ink">页面栈与路由 APIs</text>
                <text class="share-link-desc">抓取小程序/App原生路由历史堆栈，navigateTo/redirectTo 状态演示</text>
              </view>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>
        </view>
      </view>

      <!-- Bottom Bubble Gallery Entry -->
      <view class="panel-section bottom-share-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>🔮 20 种水泡与环形进度画廊</text>
          <wd-tag type="danger">新奇动效</wd-tag>
        </view>
        <view class="share-desc-info mb-3">
          集成了 20 种高水准环形进度环与液态水泡起伏动效，包含手势上下拖拽互动水位响应，提供极佳的交互式视觉体验：
        </view>

        <view class="share-links-list flex-column">
          <view class="share-link-row flex justify-between items-center p-2" @click="navToBubbleGallery">
            <view class="flex items-center">
              <text class="share-link-icon">🫧</text>
              <view class="share-link-meta ml-2">
                <text class="share-link-title font-bold text-ink">液态水泡与环形进度条画廊</text>
                <text class="share-link-desc">查看 20 种不同的动效展现与物理触控高度反馈</text>
              </view>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>
        </view>
      </view>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.home-dashboard {
  display: grid;
  gap: 24rpx;
}

.hero-card,
.metric-card,
.panel-section {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
}

.hero-card {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  padding: 32rpx;
}

.hero-title,
.section-head {
  color: var(--app-ink);
  font-weight: 700;
}

.hero-title {
  font-size: 38rpx;
}

.hero-desc {
  margin-top: 12rpx;
  color: var(--app-muted);
  font-size: 24rpx;
  line-height: 1.6;
}

.metric-grid,
.shortcut-grid,
.utility-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.metric-card,
.panel-section {
  padding: 28rpx;
}

.metric-label,
.channel-title {
  color: var(--app-muted);
  font-size: 26rpx;
}

.metric-value {
  margin: 12rpx 0;
  color: var(--app-ink);
  font-size: 38rpx;
  font-weight: 800;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-size: 32rpx;
}

.shortcut-item {
  display: grid;
  justify-items: center;
  gap: 12rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
  padding: 24rpx 12rpx;
  color: var(--app-ink);
  font-size: 26rpx;
}

:deep(.shortcut-icon) {
  color: var(--app-brand);
}

.channel-row {
  display: grid;
  gap: 12rpx;
  margin-top: 22rpx;
}

.channel-title {
  display: flex;
  justify-content: space-between;
}

:deep(.task-tag) {
  margin-right: 12rpx;
}

.utility-card {
  min-width: 0;
  border: 1rpx solid #eef2f7;
  border-radius: 10rpx;
  background: #f8fafc;
  padding: 20rpx;
}

.utility-label,
.hook-title {
  color: var(--app-muted);
  font-size: 24rpx;
}

.utility-value {
  overflow: hidden;
  margin-top: 10rpx;
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.utility-desc,
.hook-desc {
  overflow: hidden;
  margin-top: 8rpx;
  color: #98a2b3;
  font-size: 22rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hook-list {
  display: grid;
  gap: 14rpx;
  margin-top: 20rpx;
}

.hook-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  border-top: 1rpx solid #eef2f7;
  padding-top: 16rpx;
}

.ecommerce-platform-grid {
  display: grid;
  gap: 20rpx;
}

.ecommerce-terminal-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-bottom: 18rpx;
}

.ecommerce-terminal-chip {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: #eef2ff;
  color: var(--app-brand);
  font-size: 23rpx;
  font-weight: 700;
}

.ecommerce-platform-card {
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  padding: 24rpx;
}

.ecommerce-platform-title {
  color: var(--app-ink);
  font-size: 30rpx;
  font-weight: 700;
}

.ecommerce-platform-desc {
  margin-top: 10rpx;
  color: var(--app-muted);
  font-size: 24rpx;
  line-height: 1.6;
}

.ecommerce-platform-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 18rpx;
}

/* Bottom share styling */
.bottom-share-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 28rpx;
}

.share-desc-info {
  font-size: 21rpx;
  color: var(--app-muted);
  line-height: 1.5;
}

.share-links-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.share-link-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    background: #f1f5f9;
    border-color: var(--app-brand);
  }
}

.share-link-icon {
  font-size: 40rpx;
}

.share-link-meta {
  display: flex;
  flex-direction: column;
}

.share-link-title {
  font-size: 22rpx;
  color: var(--app-ink);
}

.share-link-desc {
  font-size: 17rpx;
  color: var(--app-muted);
  margin-top: 4rpx;
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-brand { color: var(--app-brand); }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.p-2 { padding: 16rpx; }
.mb-2 { margin-bottom: 16rpx; }
</style>
