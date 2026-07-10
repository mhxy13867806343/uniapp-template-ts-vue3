import type { CustomComponentItem } from './customComponents'

interface ExtraMeta extends CustomComponentItem {
  code: string
  scenes: string[]
}

function makeExtraMeta(
  name: string,
  title: string,
  path: string,
  summary: string,
  code: string,
  scenes: string[],
): ExtraMeta {
  return {
    name,
    title,
    path,
    summary,
    code,
    scenes,
    tags: ['独立实现', '扩展件', title],
    group: '第三方组件'
  }
}

export const neoExtraMetaList: ExtraMeta[] = [
  makeExtraMeta('NeoSegmented', '分段选择', 'neo-segmented', '适合内容频道、状态切换和视图分段的轻量组件。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoSegmented } = neoExtraComponents

<NeoSegmented />`, ['内容分段', '状态切换', '多视图切换']),
  makeExtraMeta('NeoProgress', '进度概览', 'neo-progress', '适合任务完成率、流程推进和执行概览展示。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoProgress } = neoExtraComponents

<NeoProgress />`, ['任务进度', '流程追踪', '执行概览']),
  makeExtraMeta('NeoStatCard', '统计卡', 'neo-stat-card', '适合首页摘要、经营统计和运营总览的卡片组件。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoStatCard } = neoExtraComponents

<NeoStatCard />`, ['首页摘要', '经营统计', '看板卡片']),
  makeExtraMeta('NeoEmptySearch', '搜索空态', 'neo-empty-search', '适合搜索无结果、筛选为空和缺省反馈场景。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoEmptySearch } = neoExtraComponents

<NeoEmptySearch />`, ['检索无结果', '筛选为空', '空态提示']),
  makeExtraMeta('NeoAvatar', '头像信息', 'neo-avatar', '适合个人信息入口、成员资料和联系人头部区域。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoAvatar } = neoExtraComponents

<NeoAvatar />`, ['成员信息', '联系人头部', '个人资料']),
  makeExtraMeta('NeoAvatarGroup', '头像组', 'neo-avatar-group', '适合协作成员、参与人列表和小组展示。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoAvatarGroup } = neoExtraComponents

<NeoAvatarGroup />`, ['协作成员', '参与人展示', '小组成员']),
  makeExtraMeta('NeoBreadcrumb', '面包屑', 'neo-breadcrumb', '适合路径层级、页面位置和返回链路展示。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoBreadcrumb } = neoExtraComponents

<NeoBreadcrumb />`, ['路径导航', '层级展示', '位置提示']),
  makeExtraMeta('NeoCell', '单元格', 'neo-cell', '适合设置项、信息项和详情列表中的基础行。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoCell } = neoExtraComponents

<NeoCell />`, ['设置项', '详情行', '信息列表']),
  makeExtraMeta('NeoPriceTag', '价格标签', 'neo-price-tag', '适合报价展示、活动价格和商品金额突出显示。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoPriceTag } = neoExtraComponents

<NeoPriceTag />`, ['报价展示', '活动价格', '金额强调']),
  makeExtraMeta('NeoCouponCard', '优惠券卡', 'neo-coupon-card', '适合营销优惠券、活动券和领取入口。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoCouponCard } = neoExtraComponents

<NeoCouponCard />`, ['营销优惠券', '活动券', '领券入口']),
  makeExtraMeta('NeoResultPanel', '结果面板', 'neo-result-panel', '适合成功提交、审核完成和操作反馈结果页。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoResultPanel } = neoExtraComponents

<NeoResultPanel />`, ['提交成功', '审核完成', '操作反馈']),
  makeExtraMeta('NeoFab', '悬浮操作', 'neo-fab', '适合页面悬浮快捷入口和主操作按钮集合。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoFab } = neoExtraComponents

<NeoFab />`, ['悬浮按钮', '快捷入口', '主操作']),
  makeExtraMeta('NeoToolbar', '工具栏', 'neo-toolbar', '适合页面底部操作条和详情工具区。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoToolbar } = neoExtraComponents

<NeoToolbar />`, ['底部工具栏', '详情页操作', '聚合操作']),
  makeExtraMeta('NeoFilterChips', '筛选胶囊', 'neo-filter-chips', '适合条件切换、标签筛选和快速过滤。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoFilterChips } = neoExtraComponents

<NeoFilterChips />`, ['条件筛选', '标签过滤', '快速切换']),
  makeExtraMeta('NeoInfoGrid', '信息网格', 'neo-info-grid', '适合经营数据、摘要信息和概览指标。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoInfoGrid } = neoExtraComponents

<NeoInfoGrid />`, ['经营数据', '信息概览', '摘要指标']),
  makeExtraMeta('NeoSummaryPanel', '摘要面板', 'neo-summary-panel', '适合分区摘要、页面总览和顶部提示面板。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoSummaryPanel } = neoExtraComponents

<NeoSummaryPanel />`, ['分区摘要', '页面总览', '顶部提示']),
  makeExtraMeta('NeoMenuGrid', '菜单宫格', 'neo-menu-grid', '适合工作台入口、业务菜单和常用功能聚合。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoMenuGrid } = neoExtraComponents

<NeoMenuGrid />`, ['工作台入口', '业务菜单', '功能宫格']),
  makeExtraMeta('NeoStatusPanel', '状态面板', 'neo-status-panel', '适合系统状态、运行监控和结果提示。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoStatusPanel } = neoExtraComponents

<NeoStatusPanel />`, ['系统状态', '运行监控', '结果提示']),
  makeExtraMeta('NeoOrderSummary', '订单摘要', 'neo-order-summary', '适合支付前确认、订单汇总和费用概览。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoOrderSummary } = neoExtraComponents

<NeoOrderSummary />`, ['订单汇总', '支付确认', '费用概览']),
  makeExtraMeta('NeoInfoBanner', '信息横幅', 'neo-info-banner', '适合活动宣传、消息提示和运营横幅。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoInfoBanner } = neoExtraComponents

<NeoInfoBanner />`, ['活动横幅', '消息提示', '运营宣传'])
]

export const neoExtraMetaMap = Object.fromEntries(
  neoExtraMetaList.map(item => [item.path, item]),
) as Record<string, ExtraMeta>
