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

<NeoInfoBanner />`, ['活动横幅', '消息提示', '运营宣传']),
  makeExtraMeta('NeoKpiStrip', 'KPI 速览', 'neo-kpi-strip', '适合经营指标、首页看板和关键数据总览。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoKpiStrip } = neoExtraComponents

<NeoKpiStrip />`, ['经营指标', '首页看板', '关键数据']),
  makeExtraMeta('NeoDataDigest', '数据摘要', 'neo-data-digest', '适合渠道数据、访问数据和摘要指标展示。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoDataDigest } = neoExtraComponents

<NeoDataDigest />`, ['渠道数据', '访问统计', '摘要指标']),
  makeExtraMeta('NeoMiniChartCard', '趋势摘要卡', 'neo-mini-chart-card', '适合小趋势结论、环比变化和简要图表摘要。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoMiniChartCard } = neoExtraComponents

<NeoMiniChartCard />`, ['趋势结论', '环比变化', '小图摘要']),
  makeExtraMeta('NeoSplitStats', '分栏统计', 'neo-split-stats', '适合对比数据、渠道占比和结构型统计。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoSplitStats } = neoExtraComponents

<NeoSplitStats />`, ['渠道占比', '结构对比', '分栏数据']),
  makeExtraMeta('NeoChecklistPanel', '检查清单', 'neo-checklist-panel', '适合上线检查、配置核验和任务确认。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoChecklistPanel } = neoExtraComponents

<NeoChecklistPanel />`, ['上线检查', '配置核验', '任务确认']),
  makeExtraMeta('NeoFaqPanel', '问题面板', 'neo-faq-panel', '适合 FAQ、帮助中心和常见问题说明。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoFaqPanel } = neoExtraComponents

<NeoFaqPanel />`, ['FAQ', '帮助中心', '问题说明']),
  makeExtraMeta('NeoUserBadge', '用户标识', 'neo-user-badge', '适合用户标签、身份状态和个人摘要区域。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoUserBadge } = neoExtraComponents

<NeoUserBadge />`, ['用户标签', '身份状态', '个人摘要']),
  makeExtraMeta('NeoContactCard', '联系人卡', 'neo-contact-card', '适合商务联系人、客户经理和对接人信息。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoContactCard } = neoExtraComponents

<NeoContactCard />`, ['商务联系人', '客户经理', '对接人信息']),
  makeExtraMeta('NeoArticleCard', '文章卡片', 'neo-article-card', '适合文章列表、资讯摘要和内容推荐。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoArticleCard } = neoExtraComponents

<NeoArticleCard />`, ['文章列表', '资讯摘要', '内容推荐']),
  makeExtraMeta('NeoMediaCard', '媒体卡片', 'neo-media-card', '适合视频专题、图文封面和媒体内容入口。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoMediaCard } = neoExtraComponents

<NeoMediaCard />`, ['视频专题', '图文封面', '媒体入口']),
  makeExtraMeta('NeoQuickActions', '快捷操作', 'neo-quick-actions', '适合工作台高频动作和一键操作入口。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoQuickActions } = neoExtraComponents

<NeoQuickActions />`, ['高频动作', '一键操作', '工作台入口']),
  makeExtraMeta('NeoOperationQueue', '待办队列', 'neo-operation-queue', '适合待处理事项、工单积压和审批队列。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoOperationQueue } = neoExtraComponents

<NeoOperationQueue />`, ['待处理事项', '工单积压', '审批队列']),
  makeExtraMeta('NeoTaskSummary', '任务摘要', 'neo-task-summary', '适合日任务概览、执行进度和效率追踪。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoTaskSummary } = neoExtraComponents

<NeoTaskSummary />`, ['日任务概览', '执行进度', '效率追踪']),
  makeExtraMeta('NeoAnnouncementCard', '公告卡片', 'neo-announcement-card', '适合系统公告、维护通知和版本提醒。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoAnnouncementCard } = neoExtraComponents

<NeoAnnouncementCard />`, ['系统公告', '维护通知', '版本提醒']),
  makeExtraMeta('NeoPermissionCard', '权限卡片', 'neo-permission-card', '适合角色权限说明、能力范围和访问提醒。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoPermissionCard } = neoExtraComponents

<NeoPermissionCard />`, ['角色权限', '能力范围', '访问提醒']),
  makeExtraMeta('NeoBillingCard', '账单卡片', 'neo-billing-card', '适合月账单、自动扣费和费用提醒。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoBillingCard } = neoExtraComponents

<NeoBillingCard />`, ['月账单', '自动扣费', '费用提醒']),
  makeExtraMeta('NeoReceiptCard', '收款卡片', 'neo-receipt-card', '适合回款进度、收据状态和财务确认。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoReceiptCard } = neoExtraComponents

<NeoReceiptCard />`, ['回款进度', '收据状态', '财务确认']),
  makeExtraMeta('NeoAddressCard', '地址卡片', 'neo-address-card', '适合收货地址、门店地址和配送信息展示。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoAddressCard } = neoExtraComponents

<NeoAddressCard />`, ['收货地址', '门店地址', '配送信息']),
  makeExtraMeta('NeoShipmentTracker', '物流追踪', 'neo-shipment-tracker', '适合物流节点、履约进度和配送状态。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoShipmentTracker } = neoExtraComponents

<NeoShipmentTracker />`, ['物流节点', '履约进度', '配送状态']),
  makeExtraMeta('NeoOrderStatusCard', '订单状态卡', 'neo-order-status-card', '适合订单履约、支付后状态和售后跟踪。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoOrderStatusCard } = neoExtraComponents

<NeoOrderStatusCard />`, ['订单履约', '支付状态', '售后跟踪']),
  makeExtraMeta('NeoPlanCard', '方案卡片', 'neo-plan-card', '适合套餐方案、订阅升级和版本对比。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoPlanCard } = neoExtraComponents

<NeoPlanCard />`, ['套餐方案', '订阅升级', '版本对比']),
  makeExtraMeta('NeoMemberCard', '成员卡片', 'neo-member-card', '适合团队成员、负责人信息和个人工作摘要。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoMemberCard } = neoExtraComponents

<NeoMemberCard />`, ['团队成员', '负责人信息', '工作摘要']),
  makeExtraMeta('NeoTeamStats', '团队统计', 'neo-team-stats', '适合团队管理、排班统计和组织概览。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoTeamStats } = neoExtraComponents

<NeoTeamStats />`, ['团队管理', '排班统计', '组织概览']),
  makeExtraMeta('NeoAuditPanel', '审计面板', 'neo-audit-panel', '适合操作审计、变更记录和行为追踪。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoAuditPanel } = neoExtraComponents

<NeoAuditPanel />`, ['操作审计', '变更记录', '行为追踪']),
  makeExtraMeta('NeoActivityFeed', '动态流', 'neo-activity-feed', '适合协作动态、项目更新和团队活动。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoActivityFeed } = neoExtraComponents

<NeoActivityFeed />`, ['协作动态', '项目更新', '团队活动']),
  makeExtraMeta('NeoLogList', '日志列表', 'neo-log-list', '适合系统日志、事件记录和排障信息。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoLogList } = neoExtraComponents

<NeoLogList />`, ['系统日志', '事件记录', '排障信息']),
  makeExtraMeta('NeoTagCloud', '标签云', 'neo-tag-cloud', '适合标签聚合、兴趣标签和状态词集合。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoTagCloud } = neoExtraComponents

<NeoTagCloud />`, ['标签聚合', '兴趣标签', '状态词']),
  makeExtraMeta('NeoShortcutPanel', '快捷面板', 'neo-shortcut-panel', '适合首页入口、业务导航和二级操作。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoShortcutPanel } = neoExtraComponents

<NeoShortcutPanel />`, ['首页入口', '业务导航', '二级操作']),
  makeExtraMeta('NeoWorkspaceCard', '工作区卡', 'neo-workspace-card', '适合工作台入口、空间卡片和角色起始页。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoWorkspaceCard } = neoExtraComponents

<NeoWorkspaceCard />`, ['工作台入口', '空间卡片', '角色起始页']),
  makeExtraMeta('NeoHighlightCard', '重点提示卡', 'neo-highlight-card', '适合高优提醒、风险提示和重要事项强调。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoHighlightCard } = neoExtraComponents

<NeoHighlightCard />`, ['高优提醒', '风险提示', '事项强调']),
  makeExtraMeta('NeoPromoBanner', '促销横幅', 'neo-promo-banner', '适合活动推广、优惠通知和营销转化入口。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoPromoBanner } = neoExtraComponents

<NeoPromoBanner />`, ['活动推广', '优惠通知', '营销入口']),
  makeExtraMeta('NeoServicePanel', '服务面板', 'neo-service-panel', '适合服务能力展示、售后说明和支持入口。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoServicePanel } = neoExtraComponents

<NeoServicePanel />`, ['服务能力', '售后说明', '支持入口']),
  makeExtraMeta('NeoFeatureMatrix', '能力矩阵', 'neo-feature-matrix', '适合产品能力对比、功能矩阵和方案说明。', `import { neoExtraComponents } from '@/components/neo/extra-library'

const { NeoFeatureMatrix } = neoExtraComponents

<NeoFeatureMatrix />`, ['能力对比', '功能矩阵', '方案说明'])
]

export const neoExtraMetaMap = Object.fromEntries(
  neoExtraMetaList.map(item => [item.path, item]),
) as Record<string, ExtraMeta>
