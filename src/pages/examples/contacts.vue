<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type ContactGroup = 'all' | 'team' | 'customer' | 'vendor'

interface Contact {
  id: number
  letter: string
  name: string
  role: string
  company: string
  phone: string
  tags: string[]
  group: ContactGroup
  online: boolean
  lastContact: string
  remark: string
}

interface ContactSection {
  letter: string
  contacts: Contact[]
}

const toast = useToast('contacts-toast')

const activeGroup = ref<ContactGroup>('all')
const keyword = ref('')
const detailVisible = ref(false)
const selectedContact = ref<Contact | null>(null)

const groups = [
  { label: '全部', value: 'all' },
  { label: '团队', value: 'team' },
  { label: '客户', value: 'customer' },
  { label: '供应商', value: 'vendor' }
] as const

const contacts: Contact[] = [
  {
    id: 1,
    letter: 'C',
    name: '陈产品',
    role: '产品负责人',
    company: '星河科技',
    phone: '13800138001',
    tags: ['App', '验收'],
    group: 'team',
    online: true,
    lastContact: '刚刚同步需求确认',
    remark: '负责多端模板交付验收。'
  },
  {
    id: 2,
    letter: 'L',
    name: '李运营',
    role: '增长运营',
    company: '青禾传媒',
    phone: '13800138002',
    tags: ['活动', 'H5'],
    group: 'customer',
    online: true,
    lastContact: '12 分钟前查看活动数据',
    remark: '关注 H5 活动承接和数据复盘。'
  },
  {
    id: 3,
    letter: 'W',
    name: '王审核',
    role: '小程序审核',
    company: '云杉服务',
    phone: '13800138003',
    tags: ['微信', '抖音'],
    group: 'vendor',
    online: false,
    lastContact: '今天 10:30 提交审核材料',
    remark: '协助微信、抖音小程序审核资料。'
  },
  {
    id: 4,
    letter: 'Z',
    name: '赵设计',
    role: 'UI 设计师',
    company: '内部团队',
    phone: '13800138004',
    tags: ['设计', '组件'],
    group: 'team',
    online: false,
    lastContact: '昨天更新视觉规范',
    remark: '维护组件库视觉规范。'
  },
  {
    id: 5,
    letter: 'S',
    name: '孙财务',
    role: '财务联系人',
    company: '明澈集团',
    phone: '13800138005',
    tags: ['支付', '合同'],
    group: 'customer',
    online: true,
    lastContact: '今天确认订阅发票',
    remark: '负责付款、合同和发票对接。'
  },
  {
    id: 6,
    letter: 'A',
    name: '安客服',
    role: '客户成功',
    company: '星河科技',
    phone: '13800138006',
    tags: ['续费', '满意度'],
    group: 'team',
    online: true,
    lastContact: '刚刚处理客户反馈',
    remark: '负责续费提醒和满意度回访。'
  },
  {
    id: 7,
    letter: 'B',
    name: '白测试',
    role: '测试工程师',
    company: '内部团队',
    phone: '13800138007',
    tags: ['H5', 'App'],
    group: 'team',
    online: false,
    lastContact: '今天提交兼容报告',
    remark: '关注小程序、H5、App 多端兼容测试。'
  },
  {
    id: 8,
    letter: 'G',
    name: '高渠道',
    role: '渠道经理',
    company: '蓝海代理',
    phone: '13800138008',
    tags: ['渠道', '报价'],
    group: 'vendor',
    online: true,
    lastContact: '昨天同步渠道报价',
    remark: '负责代理渠道和商务报价。'
  },
  {
    id: 9,
    letter: 'H',
    name: '何商务',
    role: '商务顾问',
    company: '明澈集团',
    phone: '13800138009',
    tags: ['合同', '回款'],
    group: 'customer',
    online: false,
    lastContact: '周一确认合同条款',
    remark: '跟进合同审批和回款节点。'
  },
  {
    id: 10,
    letter: 'M',
    name: '马开发',
    role: '前端工程师',
    company: '内部团队',
    phone: '13800138010',
    tags: ['Vue3', 'UniApp'],
    group: 'team',
    online: true,
    lastContact: '刚刚合并支付模板',
    remark: '维护 uni-app 跨端业务模板。'
  }
]

const filteredContacts = computed(() => {
  const text = keyword.value.trim()
  return contacts.filter((item) => {
    const groupMatched = activeGroup.value === 'all' || item.group === activeGroup.value
    const keywordMatched = !text || [item.name, item.role, item.company, item.phone, ...item.tags].some((field) => field.includes(text))
    return groupMatched && keywordMatched
  })
})

const onlineCount = computed(() => contacts.filter((item) => item.online).length)
const contactSections = computed<ContactSection[]>(() => {
  const map = filteredContacts.value.reduce<Record<string, Contact[]>>((result, item) => {
    if (!result[item.letter]) {
      result[item.letter] = []
    }
    result[item.letter].push(item)
    return result
  }, {})

  return Object.keys(map)
    .sort()
    .map((letter) => ({
      letter,
      contacts: map[letter].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
    }))
})

function openDetail(contact: Contact) {
  selectedContact.value = contact
  detailVisible.value = true
}

function handleAction(action: string) {
  if (!selectedContact.value) return
  toast.success(`${action}：${selectedContact.value.name}`)
}
</script>

<template>
  <PageShell title="联系人" description="通讯录式联系人模板，覆盖字母索引、搜索、分组、详情弹层和快捷操作。">
    <view class="contacts-page">
      <wd-toast selector="contacts-toast" />

      <view class="overview-card">
        <view>
          <view class="overview-title">联系人工作台</view>
          <view class="overview-desc">统一管理团队、客户和供应商联系人。</view>
        </view>
        <view class="online-pill">{{ onlineCount }} 人在线</view>
      </view>

      <wd-search v-model="keyword" placeholder="搜索姓名、公司、手机号或标签" />

      <scroll-view scroll-x class="group-scroll">
        <view class="group-tabs">
          <view
            v-for="group in groups"
            :key="group.value"
            :class="['group-tab', { active: activeGroup === group.value }]"
            @click="activeGroup = group.value"
          >
            {{ group.label }}
          </view>
        </view>
      </scroll-view>

      <view class="index-card">
        <wd-index-bar v-if="contactSections.length" sticky>
          <wd-index-anchor v-for="section in contactSections" :key="section.letter" :index="section.letter">
            <view class="letter-title">{{ section.letter }}</view>
            <view class="contact-list">
              <view v-for="contact in section.contacts" :key="contact.id" class="contact-row" @click="openDetail(contact)">
                <view class="avatar-wrap">
                  <view class="avatar">{{ contact.name.slice(0, 1) }}</view>
                  <view :class="['status-dot', { online: contact.online }]" />
                </view>
                <view class="contact-main">
                  <view class="contact-line">
                    <view class="contact-name">{{ contact.name }}</view>
                    <view class="contact-company">{{ contact.company }}</view>
                  </view>
                  <view class="contact-role">{{ contact.role }} · {{ contact.phone }}</view>
                  <view class="contact-tags">
                    <wd-tag v-for="tag in contact.tags" :key="tag" plain>{{ tag }}</wd-tag>
                  </view>
                </view>
                <wd-icon name="arrow-right" size="18px" custom-class="muted-icon" />
              </view>
            </view>
          </wd-index-anchor>
        </wd-index-bar>

        <view v-else class="empty-state">
          <wd-icon name="search" size="30px" custom-class="empty-icon" />
          <view>没有匹配的联系人</view>
          <text>换个关键词或分组试试</text>
        </view>
      </view>

      <view class="recent-card">
        <view class="recent-title">最近联系</view>
        <view v-for="contact in filteredContacts.slice(0, 3)" :key="`recent-${contact.id}`" class="recent-row" @click="openDetail(contact)">
          <view class="avatar mini">{{ contact.name.slice(0, 1) }}</view>
          <view class="min-w-0 flex-1">
            <view class="recent-name">{{ contact.name }}</view>
            <view class="last-contact">{{ contact.lastContact }}</view>
          </view>
        </view>
      </view>

      <wd-popup v-model="detailVisible" position="bottom" safe-area-inset-bottom root-portal custom-class="contact-popup">
        <view v-if="selectedContact" class="detail-panel">
          <view class="detail-head">
            <view class="avatar large">{{ selectedContact.name.slice(0, 1) }}</view>
            <view class="min-w-0">
              <view class="detail-name">{{ selectedContact.name }}</view>
              <view class="detail-meta">{{ selectedContact.role }} · {{ selectedContact.company }}</view>
            </view>
          </view>
          <wd-cell-group border>
            <wd-cell title="手机号" :value="selectedContact.phone" />
            <wd-cell title="最近联系" :value="selectedContact.lastContact" />
            <wd-cell title="备注" :value="selectedContact.remark" />
          </wd-cell-group>
          <view class="detail-actions">
            <wd-button plain @click="handleAction('拨打电话')">拨打</wd-button>
            <wd-button plain @click="handleAction('发送消息')">消息</wd-button>
            <wd-button type="primary" @click="handleAction('创建跟进')">跟进</wd-button>
          </view>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.contacts-page {
  display: grid;
  gap: 22rpx;
}

.overview-card,
.index-card,
.recent-card {
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
}

.overview-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 30rpx;
}

.overview-title {
  color: var(--app-ink);
  font-size: 34rpx;
  font-weight: 800;
}

.overview-desc {
  margin-top: 10rpx;
  color: var(--app-muted);
  font-size: 25rpx;
}

.online-pill {
  flex: 0 0 auto;
  border-radius: 999rpx;
  background: #e8f5e9;
  color: #12b76a;
  font-size: 24rpx;
  font-weight: 800;
  padding: 10rpx 18rpx;
}

.group-scroll {
  white-space: nowrap;
}

.group-tabs {
  display: inline-flex;
  gap: 16rpx;
}

.group-tab {
  border: 1rpx solid var(--app-line);
  border-radius: 999rpx;
  background: #fff;
  color: var(--app-muted);
  font-size: 26rpx;
  font-weight: 700;
  padding: 14rpx 28rpx;
}

.group-tab.active {
  border-color: var(--app-brand);
  background: #eff6ff;
  color: var(--app-brand);
}

.index-card {
  overflow: hidden;
  height: 780rpx;
}

:deep(.wd-index-bar) {
  height: 100%;
}

:deep(.wd-index-bar__sidebar) {
  right: 8rpx;
  border-radius: 999rpx;
  background: rgb(255 255 255 / 86%);
  box-shadow: 0 8rpx 24rpx rgb(16 24 40 / 8%);
}

:deep(.wd-index-bar__index) {
  color: var(--app-muted);
  font-size: 22rpx;
  font-weight: 900;
  padding: 6rpx 10rpx;
}

.contact-list {
  display: grid;
}

.letter-title {
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 1rpx solid var(--app-line);
  background: #f6f8fb;
  color: var(--app-brand);
  font-size: 24rpx;
  font-weight: 900;
  padding: 12rpx 28rpx;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  border-bottom: 1rpx solid var(--app-line);
  background: #fff;
  padding: 22rpx 46rpx 22rpx 24rpx;
}

.avatar-wrap {
  position: relative;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e88e5, #60a5fa);
  color: #fff;
  font-size: 34rpx;
  font-weight: 900;
}

.avatar.large {
  width: 108rpx;
  height: 108rpx;
}

.avatar.mini {
  width: 64rpx;
  height: 64rpx;
  font-size: 26rpx;
}

.status-dot {
  position: absolute;
  right: 4rpx;
  bottom: 4rpx;
  width: 18rpx;
  height: 18rpx;
  border: 4rpx solid #fff;
  border-radius: 50%;
  background: #98a2b3;
}

.status-dot.online {
  background: #12b76a;
}

.contact-main {
  min-width: 0;
  flex: 1;
}

.contact-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
}

.contact-name,
.detail-name {
  color: var(--app-ink);
  font-size: 31rpx;
  font-weight: 800;
}

.contact-company,
.contact-role,
.last-contact,
.detail-meta {
  color: var(--app-muted);
  font-size: 24rpx;
}

.contact-role {
  margin-top: 8rpx;
}

.contact-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 12rpx;
}

.last-contact {
  margin-top: 12rpx;
}

.recent-card {
  padding: 26rpx;
}

.recent-title {
  color: var(--app-ink);
  font-size: 30rpx;
  font-weight: 800;
  margin-bottom: 18rpx;
}

.recent-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 16rpx 0;
}

.recent-row + .recent-row {
  border-top: 1rpx solid var(--app-line);
}

.recent-name {
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 800;
}

.empty-state {
  display: grid;
  justify-items: center;
  gap: 12rpx;
  color: var(--app-muted);
  font-size: 26rpx;
  padding: 120rpx 32rpx;
}

.empty-state text {
  font-size: 23rpx;
}

:deep(.empty-icon) {
  color: var(--app-muted);
}

:deep(.muted-icon) {
  color: var(--app-muted);
}

:deep(.contact-popup) {
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
}

.detail-panel {
  display: grid;
  gap: 24rpx;
  background: #fff;
  padding: 32rpx 32rpx calc(44rpx + env(safe-area-inset-bottom));
}

.detail-head {
  display: flex;
  align-items: center;
  gap: 22rpx;
}

.detail-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}
</style>
