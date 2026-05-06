<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { useAppEnv } from '@/hooks/useAppEnv'
import { useBackRefresh } from '@/hooks/useBackRefresh'
import { usePagePagination, useStepPagination } from '@/hooks/pagination'
import { usePlatform } from '@/hooks/usePlatform'
import { useAppStore } from '@/store'
import { appCache } from '@/utils/cache'
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

const pagePagination = usePagePagination({ page: 2, pageSize: 10, total: 58 })
const stepPagination = useStepPagination({ offset: 20, step: 20, total: 86 })
const backRefresh = useBackRefresh('home-demo')
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

function previewBackRefresh() {
  backRefresh.markBackSilent({ from: 'home' })
  const result = backRefresh.consumeBackRefresh()
  uni.showToast({
    title: result.shouldRefresh ? '返回后刷新' : '返回不刷新',
    icon: 'none'
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
          <wd-button size="small" type="primary" plain @click="previewBackRefresh">返回示例</wd-button>
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
</style>
