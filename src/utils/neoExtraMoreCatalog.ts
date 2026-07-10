type MoreComponentKind = 'info' | 'metric' | 'list' | 'chip' | 'profile' | 'action'
type Tone = 'brand' | 'success' | 'warning' | 'slate'

export interface MoreComponentSpec {
  name: string
  title: string
  path: string
  kind: MoreComponentKind
  summary: string
  scenes: string[]
  tone?: Tone
  subtitle?: string
  meta?: string
  actionText?: string
  items?: string[]
  metrics?: Array<{ label: string, value: string }>
  personName?: string
  personSubtitle?: string
  members?: string[]
  actions?: string[]
}

export const neoExtraMoreCatalog: MoreComponentSpec[] = [
  { name: 'NeoInsightPanel', title: '洞察面板', path: 'neo-insight-panel', kind: 'info', summary: '适合策略洞察、经营结论和关键结论归纳。', scenes: ['策略洞察', '经营结论', '关键摘要'], subtitle: '适合承载一屏结论、风险判断和阶段性建议。', meta: '洞察', tone: 'brand' },
  { name: 'NeoRevenueCard', title: '营收卡片', path: 'neo-revenue-card', kind: 'metric', summary: '适合营收、回款和收入结构概览。', scenes: ['营收概览', '回款追踪', '收入结构'], metrics: [{ label: '本月营收', value: '¥286k' }, { label: '目标达成', value: '91%' }, { label: '同比', value: '+12%' }, { label: '回款率', value: '84%' }], tone: 'success' },
  { name: 'NeoFunnelCard', title: '漏斗卡片', path: 'neo-funnel-card', kind: 'metric', summary: '适合转化漏斗、线索推进和销售阶段分析。', scenes: ['转化漏斗', '线索推进', '阶段分析'], metrics: [{ label: '曝光', value: '12w' }, { label: '点击', value: '8.4k' }, { label: '留资', value: '862' }, { label: '成交', value: '127' }], tone: 'brand' },
  { name: 'NeoHeatmapSummary', title: '热力摘要', path: 'neo-heatmap-summary', kind: 'chip', summary: '适合热点分布、活跃区域和兴趣标签聚合。', scenes: ['热点分布', '活跃区域', '兴趣分析'], items: ['华东活跃', '新客聚集', '高复购', '高转化'], tone: 'warning' },
  { name: 'NeoChannelMix', title: '渠道结构', path: 'neo-channel-mix', kind: 'metric', summary: '适合渠道占比、来源结构和投放效果总览。', scenes: ['渠道占比', '来源结构', '投放效果'], metrics: [{ label: '自然流量', value: '42%' }, { label: '广告投放', value: '28%' }, { label: '转介绍', value: '18%' }, { label: '私域', value: '12%' }], tone: 'slate' },
  { name: 'NeoRetentionCard', title: '留存卡片', path: 'neo-retention-card', kind: 'info', summary: '适合用户留存、续费趋势和生命周期运营。', scenes: ['用户留存', '续费趋势', '生命周期运营'], subtitle: '近 30 日留存稳定提升，重点用户群转化表现更好。', meta: '留存', tone: 'success' },
  { name: 'NeoTrafficCard', title: '流量卡片', path: 'neo-traffic-card', kind: 'metric', summary: '适合站点访问、页面流量和活动曝光概览。', scenes: ['站点访问', '页面流量', '活动曝光'], metrics: [{ label: 'PV', value: '58.2w' }, { label: 'UV', value: '14.6w' }, { label: '跳失率', value: '21%' }, { label: '停留时长', value: '03:28' }], tone: 'brand' },
  { name: 'NeoLeadsBoard', title: '线索看板', path: 'neo-leads-board', kind: 'list', summary: '适合销售线索、客户池和重点跟进列表。', scenes: ['销售线索', '客户池', '重点跟进'], items: ['A 类线索待联系', '大客户报价待发出', '沉默客户需回访'], tone: 'brand' },
  { name: 'NeoAlertStack', title: '告警栈', path: 'neo-alert-stack', kind: 'list', summary: '适合异常提醒、风控告警和监控事件堆叠。', scenes: ['异常提醒', '风控告警', '监控事件'], items: ['支付失败率升高', '库存低于预警值', '接口延时出现波动'], tone: 'warning' },
  { name: 'NeoRiskPanel', title: '风险面板', path: 'neo-risk-panel', kind: 'info', summary: '适合风险提示、问题归类和处置优先级展示。', scenes: ['风险提示', '问题归类', '优先级管理'], subtitle: '当前存在 2 个高优风险，建议优先处理支付链路和履约时效。', meta: '高优', tone: 'warning' },
  { name: 'NeoCalendarStrip', title: '日历条', path: 'neo-calendar-strip', kind: 'chip', summary: '适合日期胶囊、排班切换和日程概览。', scenes: ['日期切换', '排班浏览', '日程概览'], items: ['周一', '周二', '周三', '周四', '周五'], tone: 'brand' },
  { name: 'NeoScheduleCard', title: '排期卡片', path: 'neo-schedule-card', kind: 'info', summary: '适合项目排期、活动时间表和执行日历。', scenes: ['项目排期', '活动时间表', '执行日历'], subtitle: '本周将完成需求确认、设计走查和灰度发布三项关键节点。', meta: '本周', tone: 'slate' },
  { name: 'NeoBookingCard', title: '预约卡片', path: 'neo-booking-card', kind: 'info', summary: '适合门店预约、服务预约和访客登记。', scenes: ['门店预约', '服务预约', '访客登记'], subtitle: '今天共有 18 条预约，其中 4 条需要人工再次确认。', actionText: '查看预约', tone: 'success' },
  { name: 'NeoQueueStatus', title: '排队状态', path: 'neo-queue-status', kind: 'metric', summary: '适合候诊、排号和队列服务进度展示。', scenes: ['候诊排号', '服务队列', '窗口等待'], metrics: [{ label: '当前号', value: 'A028' }, { label: '等待中', value: '12' }, { label: '预计时长', value: '18m' }, { label: '开放窗口', value: '4' }], tone: 'warning' },
  { name: 'NeoSupportCard', title: '客服卡片', path: 'neo-support-card', kind: 'profile', summary: '适合客服接待、售后支持和顾问入口。', scenes: ['客服接待', '售后支持', '顾问入口'], personName: '顾问小林', personSubtitle: '在线服务中 · 平均响应 28 秒', tone: 'success' },
  { name: 'NeoTicketBoard', title: '工单面板', path: 'neo-ticket-board', kind: 'list', summary: '适合售后工单、内部工单和客服处理单。', scenes: ['售后工单', '内部工单', '客服处理'], items: ['退款工单待审核', '设备报修待派单', '客户投诉待回访'], tone: 'brand' },
  { name: 'NeoMessageDigest', title: '消息摘要', path: 'neo-message-digest', kind: 'info', summary: '适合站内信、系统通知和消息聚合。', scenes: ['站内信', '系统通知', '消息聚合'], subtitle: '你有 6 条未读消息，其中 2 条来自重要审批提醒。', actionText: '查看消息', tone: 'slate' },
  { name: 'NeoChatShortcut', title: '会话快捷', path: 'neo-chat-shortcut', kind: 'action', summary: '适合 IM 快捷操作、群助手和联系入口。', scenes: ['IM 快捷操作', '群助手', '联系入口'], subtitle: '高频会话支持一键发消息、拉群和共享资料。', actions: ['发消息', '发文件', '拉群'], tone: 'brand' },
  { name: 'NeoCommentPanel', title: '评论面板', path: 'neo-comment-panel', kind: 'list', summary: '适合内容评论、协作批注和评审意见。', scenes: ['内容评论', '协作批注', '评审意见'], items: ['建议优化标题层级', '图片尺寸需统一', 'CTA 文案可更直接'], tone: 'slate' },
  { name: 'NeoReactionBar', title: '反馈栏', path: 'neo-reaction-bar', kind: 'chip', summary: '适合点赞反馈、情绪标签和内容互动。', scenes: ['点赞反馈', '情绪标签', '内容互动'], items: ['有帮助', '很清晰', '想收藏', '继续更新'], tone: 'success' },
  { name: 'NeoInventoryCard', title: '库存卡片', path: 'neo-inventory-card', kind: 'metric', summary: '适合库存健康、补货建议和商品存量概览。', scenes: ['库存健康', '补货建议', '商品存量'], metrics: [{ label: '在库 SKU', value: '1,286' }, { label: '低库存', value: '32' }, { label: '待补货', value: '18' }, { label: '周转天数', value: '26' }], tone: 'warning' },
  { name: 'NeoStockGrid', title: '库存网格', path: 'neo-stock-grid', kind: 'metric', summary: '适合仓储分布、库位汇总和在途状态。', scenes: ['仓储分布', '库位汇总', '在途状态'], metrics: [{ label: '华东仓', value: '420' }, { label: '华南仓', value: '315' }, { label: '华北仓', value: '286' }, { label: '在途', value: '95' }], tone: 'brand' },
  { name: 'NeoWarehousePanel', title: '仓库面板', path: 'neo-warehouse-panel', kind: 'list', summary: '适合仓库巡检、拣货状态和作业提醒。', scenes: ['仓库巡检', '拣货状态', '作业提醒'], items: ['A 区待补货', '冷链区温控正常', '晚班拣货效率偏低'], tone: 'slate' },
  { name: 'NeoDeliveryCard', title: '配送卡片', path: 'neo-delivery-card', kind: 'info', summary: '适合即时配送、履约时效和运力状态。', scenes: ['即时配送', '履约时效', '运力状态'], subtitle: '当前履约准时率 97%，晚高峰运力略显紧张。', meta: '配送中', tone: 'brand' },
  { name: 'NeoInvoiceSummary', title: '发票摘要', path: 'neo-invoice-summary', kind: 'info', summary: '适合开票进度、发票状态和财务信息确认。', scenes: ['开票进度', '发票状态', '财务确认'], subtitle: '本月已开票 82 张，仍有 6 张待审核开具。', actionText: '查看发票', tone: 'slate' },
  { name: 'NeoTaxCard', title: '税务卡片', path: 'neo-tax-card', kind: 'metric', summary: '适合税务测算、税率展示和申报信息概览。', scenes: ['税务测算', '税率展示', '申报概览'], metrics: [{ label: '销项税额', value: '¥12.8k' }, { label: '进项税额', value: '¥8.6k' }, { label: '税负率', value: '3.4%' }, { label: '申报状态', value: '待提交' }], tone: 'warning' },
  { name: 'NeoSettlementPanel', title: '结算面板', path: 'neo-settlement-panel', kind: 'action', summary: '适合对账、账期结算和出款操作入口。', scenes: ['对账结算', '账期管理', '出款操作'], subtitle: '当前账期已进入结算阶段，可发起对账单确认和打款申请。', actions: ['发起对账', '导出账单', '申请打款'], tone: 'success' },
  { name: 'NeoRefundCard', title: '退款卡片', path: 'neo-refund-card', kind: 'info', summary: '适合退款进度、售后赔付和异常处理说明。', scenes: ['退款进度', '售后赔付', '异常处理'], subtitle: '退款单已提交财务处理，预计 1 个工作日内到账。', meta: '退款中', tone: 'warning' },
  { name: 'NeoCustomerHealth', title: '客户健康度', path: 'neo-customer-health', kind: 'metric', summary: '适合客户分层、健康评分和流失预警。', scenes: ['客户分层', '健康评分', '流失预警'], metrics: [{ label: '健康客户', value: '68%' }, { label: '风险客户', value: '14%' }, { label: '高活跃', value: '312' }, { label: '待关怀', value: '46' }], tone: 'success' },
  { name: 'NeoLoyaltyCard', title: '忠诚度卡', path: 'neo-loyalty-card', kind: 'info', summary: '适合会员体系、积分权益和忠诚度提升。', scenes: ['会员体系', '积分权益', '忠诚度提升'], subtitle: '核心会员本月活跃提升明显，复购率保持在高位。', meta: 'VIP', tone: 'brand' },
  { name: 'NeoMilestoneBoard', title: '里程碑面板', path: 'neo-milestone-board', kind: 'list', summary: '适合项目里程碑、交付节点和阶段成果跟踪。', scenes: ['项目里程碑', '交付节点', '阶段成果'], items: ['需求冻结完成', '交互评审已通过', '发布窗口待确认'], tone: 'brand' },
  { name: 'NeoRoadmapCard', title: '路线图卡片', path: 'neo-roadmap-card', kind: 'action', summary: '适合产品路线图、版本规划和阶段目标说明。', scenes: ['产品路线图', '版本规划', '阶段目标'], subtitle: 'Q3 聚焦支付稳定性、跨端插件和组件体系增强。', actions: ['查看规划', '同步团队'], tone: 'slate' },
  { name: 'NeoSprintPanel', title: '迭代面板', path: 'neo-sprint-panel', kind: 'metric', summary: '适合 Sprint 进度、燃尽节奏和研发效率概览。', scenes: ['Sprint 进度', '燃尽追踪', '研发效率'], metrics: [{ label: '总任务', value: '42' }, { label: '已完成', value: '29' }, { label: '阻塞中', value: '3' }, { label: '燃尽率', value: '69%' }], tone: 'brand' },
  { name: 'NeoReleaseCard', title: '发布卡片', path: 'neo-release-card', kind: 'info', summary: '适合发布说明、上线状态和版本摘要。', scenes: ['发布说明', '上线状态', '版本摘要'], subtitle: '本次版本覆盖组件扩展、插件统一层和多端能力增强。', meta: 'v2.3.0', tone: 'success' },
  { name: 'NeoDocSummary', title: '文档摘要', path: 'neo-doc-summary', kind: 'info', summary: '适合方案文档、需求摘要和知识提炼。', scenes: ['方案文档', '需求摘要', '知识提炼'], subtitle: '快速查看文档结论、关键约束和待确认项。', actionText: '打开文档', tone: 'slate' },
  { name: 'NeoKnowledgeCard', title: '知识卡片', path: 'neo-knowledge-card', kind: 'chip', summary: '适合知识标签、专题目录和资料聚合。', scenes: ['知识标签', '专题目录', '资料聚合'], items: ['接入指南', '排障手册', '发布流程', '交付规范'], tone: 'brand' },
  { name: 'NeoTrainingPanel', title: '培训面板', path: 'neo-training-panel', kind: 'action', summary: '适合培训计划、学习任务和课程入口。', scenes: ['培训计划', '学习任务', '课程入口'], subtitle: '新成员培训包含 4 个阶段模块，支持直接进入学习。', actions: ['学习路径', '考试任务', '查看证书'], tone: 'success' },
  { name: 'NeoCourseCard', title: '课程卡片', path: 'neo-course-card', kind: 'info', summary: '适合课程简介、学习状态和推荐内容。', scenes: ['课程简介', '学习状态', '内容推荐'], subtitle: '课程共 12 节，适合快速了解跨端插件和组件封装。', actionText: '继续学习', tone: 'brand' },
  { name: 'NeoBadgeWall', title: '徽章墙', path: 'neo-badge-wall', kind: 'chip', summary: '适合荣誉徽章、能力标签和成就展示。', scenes: ['荣誉徽章', '能力标签', '成就展示'], items: ['交付达人', '增长专家', '协作先锋', '学习之星'], tone: 'warning' },
  { name: 'NeoCampaignCard', title: '活动卡片', path: 'neo-campaign-card', kind: 'info', summary: '适合市场活动、运营 campaign 和转化入口。', scenes: ['市场活动', '运营 campaign', '转化入口'], subtitle: '本期活动目标聚焦拉新转化和回流召回，当前效果良好。', actionText: '查看活动', tone: 'warning' }
]
