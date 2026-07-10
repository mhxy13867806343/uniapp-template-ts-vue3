export type EcommercePlatformKey = 'taobao' | 'jd' | 'pdd'
export type EcommerceTerminalKey = 'user' | 'merchant' | 'marketing'

export interface EcommercePlatform {
  key: EcommercePlatformKey
  label: string
  shortLabel: string
  accent: string
  surface: string
  gradient: string
  tone: string
  description: string
}

export interface EcommerceTerminal {
  key: EcommerceTerminalKey
  label: string
  description: string
  accent: string
  surface: string
}

export interface EcommerceScenarioTemplate {
  slug: string
  title: string
  summary: string
  primaryAction: string
  secondaryAction: string
}

export interface EcommerceScenarioGroup {
  key: string
  label: string
  description: string
  terminalKey: EcommerceTerminalKey
  items: EcommerceScenarioTemplate[]
}

export interface EcommerceScenePage {
  id: string
  route: string
  platform: EcommercePlatform
  terminalKey: EcommerceTerminalKey
  terminalLabel: string
  groupKey: string
  groupLabel: string
  groupDescription: string
  slug: string
  title: string
  subtitle: string
  summary: string
  tags: string[]
  metrics: Array<{ label: string, value: string }>
  highlights: string[]
  actions: string[]
  browseRoute: string
  orderRoute: string
  serviceRoute: string
}

export const ecommercePlatforms: EcommercePlatform[] = [
  {
    key: 'taobao',
    label: '淘宝电商专区',
    shortLabel: '淘宝',
    accent: '#ff6a00',
    surface: '#fff4eb',
    gradient: 'linear-gradient(135deg, #ff7a18 0%, #ff4d4f 100%)',
    tone: '内容种草、直播成交、会场浏览',
    description: '偏内容化、会场化和直播种草，适合做首页浏览、活动聚合与达人转化。'
  },
  {
    key: 'jd',
    label: '京东电商专区',
    shortLabel: '京东',
    accent: '#e1251b',
    surface: '#fff1f0',
    gradient: 'linear-gradient(135deg, #ff4d4f 0%, #d40000 100%)',
    tone: '品质电商、履约效率、家电数码',
    description: '偏强履约和品质零售，适合做下单链路、物流履约和会员权益场景。'
  },
  {
    key: 'pdd',
    label: '拼多多电商专区',
    shortLabel: '拼多多',
    accent: '#e60012',
    surface: '#fff1f3',
    gradient: 'linear-gradient(135deg, #ff4060 0%, #ff004f 100%)',
    tone: '低价爆款、百亿补贴、拼团裂变',
    description: '偏补贴、拼团和裂变转化，适合做活动会场、成团分享和新客转化场景。'
  }
]

export const ecommerceTerminals: EcommerceTerminal[] = [
  {
    key: 'user',
    label: '用户端',
    description: '覆盖浏览、商品详情、下单、订单、会员和本地零售等消费者链路。',
    accent: '#2563eb',
    surface: '#eff6ff'
  },
  {
    key: 'merchant',
    label: '商家端',
    description: '覆盖商品发布、订单处理、库存、客服、财务和经营分析等后台链路。',
    accent: '#7c3aed',
    surface: '#f5f3ff'
  },
  {
    key: 'marketing',
    label: '营销端',
    description: '覆盖活动会场、裂变拉新、广告投放、招商生态和会员增长链路。',
    accent: '#db2777',
    surface: '#fdf2f8'
  }
]

export const ecommerceScenarioGroups: EcommerceScenarioGroup[] = [
  {
    key: 'discovery',
    label: '逛会场与浏览',
    description: '覆盖首页推荐、搜索逛街、活动会场和内容浏览入口。',
    terminalKey: 'user',
    items: [
      { slug: 'home-recommend', title: '首页推荐流', summary: '展示猜你喜欢、品牌活动和实时热卖内容。', primaryAction: '继续浏览', secondaryAction: '加入购物车' },
      { slug: 'search-results', title: '搜索结果页', summary: '支持综合排序、销量筛选和价格区间过滤。', primaryAction: '筛选商品', secondaryAction: '查看详情' },
      { slug: 'channel-plaza', title: '频道会场页', summary: '承载服饰、美妆、数码等垂类频道主入口。', primaryAction: '浏览会场', secondaryAction: '领取优惠' },
      { slug: 'live-square', title: '直播广场页', summary: '聚合直播间、秒杀品和达人带货内容。', primaryAction: '进入直播间', secondaryAction: '查看预告' },
      { slug: 'flash-sale', title: '限时秒杀页', summary: '展示整点开抢、库存进度和倒计时。', primaryAction: '立即抢购', secondaryAction: '订阅提醒' },
      { slug: 'subsidy-center', title: '补贴专区页', summary: '汇总官方补贴、满减券和价格保护说明。', primaryAction: '领券下单', secondaryAction: '比价查看' },
      { slug: 'brand-hall', title: '品牌馆页', summary: '展示品牌日、官方旗舰店和新品矩阵。', primaryAction: '进入店铺', secondaryAction: '订阅上新' },
      { slug: 'new-arrivals', title: '新品首发页', summary: '展示新品预售、首发权益和达人试用内容。', primaryAction: '预约购买', secondaryAction: '查看测评' },
      { slug: 'guess-like', title: '猜你喜欢页', summary: '根据浏览行为持续推荐相似商品。', primaryAction: '继续逛', secondaryAction: '收藏商品' }
    ]
  },
  {
    key: 'product',
    label: '商品详情与决策',
    description: '覆盖商品详情、规格选择、评价问答和搭配推荐。',
    terminalKey: 'user',
    items: [
      { slug: 'product-detail', title: '商品详情页', summary: '聚合主图、卖点、券后价和服务承诺。', primaryAction: '立即购买', secondaryAction: '加入购物车' },
      { slug: 'sku-selector', title: '规格选择页', summary: '完成颜色、尺码、套装和库存判断。', primaryAction: '确认规格', secondaryAction: '继续挑选' },
      { slug: 'graphic-detail', title: '图文详情页', summary: '承载长图详情、材质说明和参数对比。', primaryAction: '查看参数', secondaryAction: '收藏商品' },
      { slug: 'review-list', title: '评价列表页', summary: '展示晒图评价、追评和评分维度。', primaryAction: '看买家秀', secondaryAction: '筛选评价' },
      { slug: 'ask-community', title: '问大家页', summary: '展示用户问答、客服补充和高频问题。', primaryAction: '参与提问', secondaryAction: '联系客服' },
      { slug: 'bundle-recommend', title: '搭配推荐页', summary: '展示套餐购、关联购和满减凑单推荐。', primaryAction: '一键带走', secondaryAction: '拆分查看' },
      { slug: 'price-drop-alert', title: '降价提醒页', summary: '订阅目标价格并提示历史价走势。', primaryAction: '设置提醒', secondaryAction: '查看历史价' },
      { slug: 'stock-alert', title: '到货提醒页', summary: '缺货时支持留资订阅和类似商品替代。', primaryAction: '订阅到货', secondaryAction: '看替代品' },
      { slug: 'service-commitment', title: '服务承诺页', summary: '聚合运费险、保价、退换和发货承诺。', primaryAction: '查看规则', secondaryAction: '咨询客服' }
    ]
  },
  {
    key: 'purchase',
    label: '下单与支付',
    description: '覆盖购物车、结算、地址、优惠券和支付收银台。',
    terminalKey: 'user',
    items: [
      { slug: 'cart', title: '购物车页', summary: '管理待购商品、凑单商品和营销提醒。', primaryAction: '去结算', secondaryAction: '继续逛逛' },
      { slug: 'checkout-confirm', title: '确认订单页', summary: '确认地址、商品清单、配送方式和发票。', primaryAction: '提交订单', secondaryAction: '修改地址' },
      { slug: 'address-selector', title: '地址选择页', summary: '支持地址切换、新增和地址校验。', primaryAction: '选择地址', secondaryAction: '新增地址' },
      { slug: 'coupon-center', title: '优惠券页', summary: '汇总店铺券、平台券和跨店满减资格。', primaryAction: '领券下单', secondaryAction: '查看使用门槛' },
      { slug: 'invoice-editor', title: '发票信息页', summary: '支持个人、企业抬头和税号填写。', primaryAction: '保存发票', secondaryAction: '稍后再说' },
      { slug: 'payment-cashier', title: '支付收银台页', summary: '展示支付方式、分期免息和余额抵扣。', primaryAction: '立即支付', secondaryAction: '切换支付方式' },
      { slug: 'installment-plan', title: '分期方案页', summary: '展示不同期数费率和月供试算。', primaryAction: '选择分期', secondaryAction: '全款支付' },
      { slug: 'order-success', title: '下单成功页', summary: '展示支付成功、领券返场和推荐加购内容。', primaryAction: '查看订单', secondaryAction: '继续购物' },
      { slug: 'group-invite', title: '拼团邀请页', summary: '生成拼团链接、邀请卡片和成团进度。', primaryAction: '去邀请', secondaryAction: '继续参团' }
    ]
  },
  {
    key: 'order',
    label: '订单与售后',
    description: '覆盖订单履约、物流追踪、评价和退款售后。',
    terminalKey: 'user',
    items: [
      { slug: 'order-list', title: '订单列表页', summary: '按待付款、待发货和待收货分类展示。', primaryAction: '查看全部订单', secondaryAction: '筛选状态' },
      { slug: 'pending-payment', title: '待付款页', summary: '展示剩余支付时间和补贴失效提醒。', primaryAction: '去付款', secondaryAction: '取消订单' },
      { slug: 'pending-shipment', title: '待发货页', summary: '查看备货中、加急发货和客服进度反馈。', primaryAction: '催发货', secondaryAction: '联系客服' },
      { slug: 'pending-delivery', title: '待收货页', summary: '展示物流节点、签收方式和收货提醒。', primaryAction: '查看物流', secondaryAction: '确认收货' },
      { slug: 'pending-review', title: '待评价页', summary: '引导晒单、视频评价和返积分权益。', primaryAction: '去评价', secondaryAction: '稍后评价' },
      { slug: 'logistics-tracking', title: '物流轨迹页', summary: '展示包裹节点、预计送达和异常预警。', primaryAction: '查看物流', secondaryAction: '联系配送' },
      { slug: 'order-detail', title: '订单详情页', summary: '完整展示订单号、价格明细和售后入口。', primaryAction: '再次购买', secondaryAction: '申请售后' },
      { slug: 'refund-after-sale', title: '退款售后页', summary: '支持退款、退货退款和仅退款说明。', primaryAction: '发起退款', secondaryAction: '查看进度' },
      { slug: 'rebuy-center', title: '再次购买页', summary: '汇总复购商品和相近替代推荐。', primaryAction: '一键复购', secondaryAction: '浏览相似商品' }
    ]
  },
  {
    key: 'store',
    label: '店铺与客服',
    description: '覆盖店铺首页、粉丝运营、直播和客服咨询。',
    terminalKey: 'user',
    items: [
      { slug: 'store-home', title: '店铺首页页', summary: '展示店铺氛围、主推商品和会员权益。', primaryAction: '逛店铺', secondaryAction: '关注店铺' },
      { slug: 'store-category', title: '店铺分类页', summary: '按品类、价格带和新品状态筛选店铺商品。', primaryAction: '按分类逛', secondaryAction: '查看热销' },
      { slug: 'store-live', title: '店铺直播页', summary: '聚合店播预告、直播福利和回放商品。', primaryAction: '进入直播', secondaryAction: '预约开播' },
      { slug: 'store-member', title: '店铺会员页', summary: '展示会员等级、积分和专属折扣权益。', primaryAction: '立即入会', secondaryAction: '查看权益' },
      { slug: 'store-discount', title: '店铺优惠页', summary: '整合店铺券、满减活动和加赠机制。', primaryAction: '领取店铺券', secondaryAction: '去凑单' },
      { slug: 'service-chat', title: '客服会话页', summary: '支持机器人、人工客服和快捷问题模板。', primaryAction: '联系客服', secondaryAction: '查看常见问题' },
      { slug: 'fan-benefits', title: '粉丝权益页', summary: '展示关注有礼、专属价和直播提醒。', primaryAction: '领取权益', secondaryAction: '分享店铺' },
      { slug: 'new-user-gift', title: '新客礼金页', summary: '新用户领取礼金并触发首单转化。', primaryAction: '领取礼金', secondaryAction: '去首单' },
      { slug: 'follow-store', title: '关注店铺页', summary: '展示已关注店铺动态和上新提醒。', primaryAction: '查看动态', secondaryAction: '取消关注' }
    ]
  },
  {
    key: 'marketing',
    label: '营销与活动',
    description: '覆盖大促会场、红包任务、券中心和裂变拉新。',
    terminalKey: 'marketing',
    items: [
      { slug: 'campaign-main', title: '大促主会场页', summary: '承接双11、618等大促活动总入口。', primaryAction: '逛主会场', secondaryAction: '查看时间表' },
      { slug: 'campaign-seckill', title: '秒杀会场页', summary: '按时间场次展示爆品和库存进度。', primaryAction: '抢爆品', secondaryAction: '提醒我' },
      { slug: 'campaign-cross-reduce', title: '跨店满减页', summary: '展示凑单门槛、可参与商家和减免效果。', primaryAction: '去凑单', secondaryAction: '查看规则' },
      { slug: 'red-packet-center', title: '红包中心页', summary: '支持签到红包、膨胀红包和分享红包。', primaryAction: '抢红包', secondaryAction: '邀请好友' },
      { slug: 'task-signin', title: '任务签到页', summary: '通过浏览、下单和分享完成任务领奖励。', primaryAction: '做任务', secondaryAction: '查看奖励' },
      { slug: 'coupon-club', title: '神券会场页', summary: '汇总平台神券和限量券池。', primaryAction: '领神券', secondaryAction: '查看爆款' },
      { slug: 'member-day', title: '会员日页', summary: '会员专享折扣、专属券和抽奖活动。', primaryAction: '参与活动', secondaryAction: '升级会员' },
      { slug: 'bargain-event', title: '砍价活动页', summary: '展示砍价进度、帮砍名单和剩余时间。', primaryAction: '发起砍价', secondaryAction: '帮好友砍' },
      { slug: 'fission-invite', title: '裂变邀请页', summary: '生成分享链路，拉新后可获得返利或优惠。', primaryAction: '立即邀请', secondaryAction: '查看规则' }
    ]
  },
  {
    key: 'content',
    label: '内容与社区',
    description: '覆盖买家秀、短视频、榜单、话题和收藏历史。',
    terminalKey: 'user',
    items: [
      { slug: 'buyer-show', title: '买家秀页', summary: '聚合真实晒图、短视频和真实体验反馈。', primaryAction: '查看晒图', secondaryAction: '发布买家秀' },
      { slug: 'video-discovery', title: '短视频种草页', summary: '以短视频流承载商品种草和带货转化。', primaryAction: '刷视频', secondaryAction: '查看商品' },
      { slug: 'ranking-list', title: '榜单频道页', summary: '按热卖、新品和回购率维度输出榜单。', primaryAction: '查看榜单', secondaryAction: '看同款' },
      { slug: 'topic-square', title: '话题广场页', summary: '围绕季节、趋势和人群偏好组织话题内容。', primaryAction: '参与话题', secondaryAction: '浏览内容' },
      { slug: 'creator-live', title: '达人直播页', summary: '展示达人直播场次、预告和精选单品。', primaryAction: '进入直播', secondaryAction: '关注达人' },
      { slug: 'note-feed', title: '图文笔记页', summary: '用图文卡片承载测评、开箱和搭配推荐。', primaryAction: '看笔记', secondaryAction: '收藏笔记' },
      { slug: 'favorites', title: '收藏夹页', summary: '统一管理收藏商品、店铺和内容。', primaryAction: '查看收藏', secondaryAction: '批量管理' },
      { slug: 'browse-history', title: '浏览历史页', summary: '展示最近浏览轨迹和回访商品。', primaryAction: '继续浏览', secondaryAction: '清空历史' },
      { slug: 'subscription-reminder', title: '订阅提醒页', summary: '订阅上新、降价、直播和补货通知。', primaryAction: '管理订阅', secondaryAction: '全部开启' }
    ]
  },
  {
    key: 'account',
    label: '会员与账户',
    description: '覆盖钱包、地址、消息、发票和安全中心。',
    terminalKey: 'user',
    items: [
      { slug: 'wallet', title: '我的钱包页', summary: '查看余额、红包、礼品卡和支付工具。', primaryAction: '查看资产', secondaryAction: '去充值' },
      { slug: 'member-center', title: '会员中心页', summary: '展示会员等级、成长值和专属礼包。', primaryAction: '升级会员', secondaryAction: '查看权益' },
      { slug: 'address-book', title: '地址管理页', summary: '支持新增、编辑默认地址和标签管理。', primaryAction: '新增地址', secondaryAction: '智能识别地址' },
      { slug: 'footprint', title: '足迹中心页', summary: '展示近 30 天浏览足迹和回访场景。', primaryAction: '查看足迹', secondaryAction: '删除记录' },
      { slug: 'favorite-center', title: '关注收藏页', summary: '统一管理商品关注、店铺关注和内容关注。', primaryAction: '管理收藏', secondaryAction: '去发现' },
      { slug: 'message-center', title: '消息中心页', summary: '接收物流、营销、客服和系统通知。', primaryAction: '查看消息', secondaryAction: '设置免打扰' },
      { slug: 'security-center', title: '安全中心页', summary: '管理登录设备、支付密码和风险提醒。', primaryAction: '检查安全', secondaryAction: '修改密码' },
      { slug: 'invoice-profile', title: '发票抬头页', summary: '统一管理个人与企业发票资料。', primaryAction: '新增抬头', secondaryAction: '设为默认' },
      { slug: 'after-sale-progress', title: '售后进度页', summary: '查看退货审核、收货和退款节点。', primaryAction: '查看进度', secondaryAction: '补充凭证' }
    ]
  },
  {
    key: 'local',
    label: '本地零售与服务',
    description: '覆盖同城到家、门店自提、安装维修和本地团购。',
    terminalKey: 'user',
    items: [
      { slug: 'local-delivery', title: '同城到家页', summary: '展示附近仓店、预计送达和运力状态。', primaryAction: '立即下单', secondaryAction: '选择地址' },
      { slug: 'supermarket-delivery', title: '外卖超市页', summary: '承载生鲜、快消和即时零售购物。', primaryAction: '加入购物车', secondaryAction: '查看优惠' },
      { slug: 'pickup-store', title: '门店自提页', summary: '展示门店库存、自提时间和核销码。', primaryAction: '选择门店', secondaryAction: '查看路线' },
      { slug: 'install-booking', title: '预约安装页', summary: '支持家电安装、上门时段和技师选择。', primaryAction: '预约服务', secondaryAction: '咨询安装' },
      { slug: 'trade-in', title: '以旧换新页', summary: '估价旧机并抵扣新机订单金额。', primaryAction: '立即估价', secondaryAction: '查看规则' },
      { slug: 'store-verification', title: '到店核销页', summary: '生成核销码并同步到门店履约。', primaryAction: '出示核销码', secondaryAction: '查看门店信息' },
      { slug: 'service-orders', title: '服务订单页', summary: '管理家政、维修和安装等服务订单。', primaryAction: '查看服务单', secondaryAction: '评价服务' },
      { slug: 'home-repair', title: '上门维修页', summary: '支持故障描述、报价和工程师派单。', primaryAction: '提交维修', secondaryAction: '联系客服' },
      { slug: 'local-groupbuy', title: '本地团购页', summary: '展示到店券、套餐购和周边热卖。', primaryAction: '抢购套餐', secondaryAction: '查看商家' }
    ]
  },
  {
    key: 'merchant',
    label: '商家经营后台',
    description: '覆盖商品、订单、库存、营销和客服分流。',
    terminalKey: 'merchant',
    items: [
      { slug: 'merchant-dashboard', title: '商家工作台页', summary: '汇总销售额、转化率和异常提醒。', primaryAction: '查看经营看板', secondaryAction: '处理待办' },
      { slug: 'merchant-publish', title: '商品发布页', summary: '完成商品信息、类目属性和图文详情发布。', primaryAction: '发布商品', secondaryAction: '保存草稿' },
      { slug: 'merchant-orders', title: '订单处理页', summary: '批量确认订单、拆单和异常订单标记。', primaryAction: '批量处理', secondaryAction: '查看详情' },
      { slug: 'merchant-shipping', title: '发货管理页', summary: '维护包裹、物流公司和发货异常处理。', primaryAction: '立即发货', secondaryAction: '打印面单' },
      { slug: 'merchant-marketing', title: '营销工具页', summary: '创建满减、折扣、优惠券和人群投放。', primaryAction: '创建活动', secondaryAction: '查看数据' },
      { slug: 'merchant-analytics', title: '数据看板页', summary: '查看流量、转化、客单价和商品结构。', primaryAction: '查看明细', secondaryAction: '导出报表' },
      { slug: 'merchant-service', title: '客服分流页', summary: '支持机器人路由、人工分配和质检。', primaryAction: '分配会话', secondaryAction: '查看质检' },
      { slug: 'merchant-stock', title: '库存预警页', summary: '展示安全库存、断货商品和补货建议。', primaryAction: '立即补货', secondaryAction: '导出清单' },
      { slug: 'merchant-diagnosis', title: '经营诊断页', summary: '输出商品、活动和转化漏斗优化建议。', primaryAction: '查看建议', secondaryAction: '去优化' }
    ]
  },
  {
    key: 'finance',
    label: '结算与资金',
    description: '覆盖商家收益、账单、提现、佣金和保证金。',
    terminalKey: 'merchant',
    items: [
      { slug: 'revenue-center', title: '收益中心页', summary: '查看日收入、渠道收入和退货影响。', primaryAction: '查看收益', secondaryAction: '导出明细' },
      { slug: 'statement-list', title: '对账单页', summary: '按周期展示订单收入和服务费。', primaryAction: '下载账单', secondaryAction: '筛选账期' },
      { slug: 'capital-flow', title: '资金流水页', summary: '展示到账、退款、补贴和营销扣减。', primaryAction: '查看流水', secondaryAction: '申请对账' },
      { slug: 'withdraw-apply', title: '提现申请页', summary: '支持绑定账户、设置金额和到账说明。', primaryAction: '申请提现', secondaryAction: '查看规则' },
      { slug: 'profit-sharing', title: '分账管理页', summary: '维护达人、供应商和门店分账规则。', primaryAction: '配置分账', secondaryAction: '查看记录' },
      { slug: 'commission-plan', title: '佣金计划页', summary: '管理分销比例和渠道佣金策略。', primaryAction: '新建佣金计划', secondaryAction: '查看排行' },
      { slug: 'invoice-download', title: '发票下载页', summary: '下载平台服务费发票和结算凭证。', primaryAction: '下载发票', secondaryAction: '查看开票状态' },
      { slug: 'deposit-center', title: '保证金页', summary: '查看店铺保证金、补缴和解冻说明。', primaryAction: '补缴保证金', secondaryAction: '查看政策' },
      { slug: 'settlement-calendar', title: '结算日历页', summary: '展示账期节点、打款计划和异常提醒。', primaryAction: '查看账期', secondaryAction: '设置提醒' }
    ]
  },
  {
    key: 'ecosystem',
    label: '平台招商与生态',
    description: '覆盖招商、广告投放、服务市场、私域和 AI 选品。',
    terminalKey: 'marketing',
    items: [
      { slug: 'merchant-entry', title: '开店入驻页', summary: '引导品牌、商家完成入驻资料与流程。', primaryAction: '立即入驻', secondaryAction: '查看要求' },
      { slug: 'brand-recruit', title: '品牌招商页', summary: '展示平台招商政策、类目机会和招商经理。', primaryAction: '提交意向', secondaryAction: '预约沟通' },
      { slug: 'service-market', title: '服务市场页', summary: '挑选代运营、设计、客服和履约服务商。', primaryAction: '筛选服务', secondaryAction: '查看案例' },
      { slug: 'ads-delivery', title: '广告投放页', summary: '创建品牌广告、搜索推广和直播投流。', primaryAction: '新建投放', secondaryAction: '查看效果' },
      { slug: 'crm-operations', title: '客户运营页', summary: '管理会员召回、分层营销和复购人群。', primaryAction: '创建人群', secondaryAction: '发送触达' },
      { slug: 'private-traffic', title: '私域引流页', summary: '承接社群、企微和会员留资链路。', primaryAction: '配置引流', secondaryAction: '查看线索' },
      { slug: 'growth-missions', title: '会员任务页', summary: '通过任务体系提升用户活跃和转化。', primaryAction: '配置任务', secondaryAction: '查看完成率' },
      { slug: 'content-studio', title: '内容中心页', summary: '统一管理短视频、图文和直播素材。', primaryAction: '发布内容', secondaryAction: '查看排期' },
      { slug: 'ai-selection', title: 'AI选品页', summary: '根据销量趋势和库存结构输出选品建议。', primaryAction: '生成选品建议', secondaryAction: '查看报告' }
    ]
  }
]

const terminalLabelMap = Object.fromEntries(
  ecommerceTerminals.map(item => [item.key, item.label])
) as Record<EcommerceTerminalKey, string>

function toMetric(value: number, suffix = '') {
  return `${value}${suffix}`
}

const routeByPlatformKey: Record<EcommercePlatformKey, { browse: string, order: string, service: string }> = {
  taobao: {
    browse: '/pages/ecommerce/taobao/home-recommend',
    order: '/pages/ecommerce/taobao/payment-cashier',
    service: '/pages/ecommerce/taobao/service-chat'
  },
  jd: {
    browse: '/pages/ecommerce/jd/home-recommend',
    order: '/pages/ecommerce/jd/payment-cashier',
    service: '/pages/ecommerce/jd/service-chat'
  },
  pdd: {
    browse: '/pages/ecommerce/pdd/home-recommend',
    order: '/pages/ecommerce/pdd/payment-cashier',
    service: '/pages/ecommerce/pdd/service-chat'
  }
}

export const ecommercePages: EcommerceScenePage[] = ecommercePlatforms.flatMap((platform, platformIndex) =>
  ecommerceScenarioGroups.flatMap((group, groupIndex) =>
    group.items.map((item, itemIndex) => {
      const base = (platformIndex + 2) * 100 + groupIndex * 9 + itemIndex
      return {
        id: `${platform.key}-${item.slug}`,
        route: `/pages/ecommerce/${platform.key}/${item.slug}`,
        platform,
        terminalKey: group.terminalKey,
        terminalLabel: terminalLabelMap[group.terminalKey],
        groupKey: group.key,
        groupLabel: group.label,
        groupDescription: group.description,
        slug: item.slug,
        title: `${platform.shortLabel}${item.title}`,
        subtitle: `${platform.tone} · ${group.label}`,
        summary: `${item.summary}${platform.description}`,
        tags: [platform.shortLabel, group.label, item.primaryAction, item.secondaryAction],
        metrics: [
          { label: '今日浏览', value: toMetric(base + 1200) },
          { label: '支付转化', value: toMetric(((groupIndex + 2) * 3) + platformIndex + 8, '%') },
          { label: '客单价', value: `¥${base + 59}` },
          { label: '复购率', value: toMetric(((itemIndex + 1) * 2) + 10, '%') }
        ],
        highlights: [
          `${platform.shortLabel}风格的${group.label}界面组织`,
          `支持“${item.primaryAction} / ${item.secondaryAction}”等高频动作模拟`,
          `适合继续扩展为真实商品、订单、活动数据接口页面`
        ],
        actions: [item.primaryAction, item.secondaryAction, '查看同平台更多页面'],
        browseRoute: routeByPlatformKey[platform.key].browse,
        orderRoute: routeByPlatformKey[platform.key].order,
        serviceRoute: routeByPlatformKey[platform.key].service
      } satisfies EcommerceScenePage
    })
  )
)

export const ecommercePageCount = ecommercePages.length

export const ecommercePageMap = new Map(ecommercePages.map(page => [page.id, page]))

export const ecommercePlatformSummaries = ecommercePlatforms.map(platform => {
  const pages = ecommercePages.filter(page => page.platform.key === platform.key)
  return {
    ...platform,
    count: pages.length,
    firstRoute: pages[0]?.route || routeByPlatformKey[platform.key].browse,
    browseRoute: routeByPlatformKey[platform.key].browse,
    orderRoute: routeByPlatformKey[platform.key].order
  }
})

export const ecommerceTerminalSummaries = ecommerceTerminals.map(terminal => {
  const pages = ecommercePages.filter(page => page.terminalKey === terminal.key)
  return {
    ...terminal,
    count: pages.length,
    firstRoute: pages[0]?.route || '/pages/ecommerce/index'
  }
})

export function getEcommercePageById(id: string) {
  return ecommercePageMap.get(id) || ecommercePages[0]
}

export function getEcommercePagesByPlatform(platformKey: EcommercePlatformKey | 'all') {
  if (platformKey === 'all') return ecommercePages
  return ecommercePages.filter(page => page.platform.key === platformKey)
}

export function getEcommercePagesByTerminal(terminalKey: EcommerceTerminalKey | 'all') {
  if (terminalKey === 'all') return ecommercePages
  return ecommercePages.filter(page => page.terminalKey === terminalKey)
}

export function getEcommercePagesByGroup(
  groupKey: string,
  platformKey: EcommercePlatformKey | 'all' = 'all',
  terminalKey: EcommerceTerminalKey | 'all' = 'all'
) {
  return getEcommercePagesByTerminal(terminalKey)
    .filter(page => platformKey === 'all' || page.platform.key === platformKey)
    .filter(page => groupKey === 'all' || page.groupKey === groupKey)
}

export function getEcommerceScenarioGroupsByTerminal(terminalKey: EcommerceTerminalKey | 'all') {
  if (terminalKey === 'all') return ecommerceScenarioGroups
  return ecommerceScenarioGroups.filter(group => group.terminalKey === terminalKey)
}

export function getRelatedEcommercePages(page: EcommerceScenePage, limit = 6) {
  return ecommercePages
    .filter(item => item.id !== page.id && item.platform.key === page.platform.key)
    .filter(item => item.groupKey === page.groupKey || item.slug === 'payment-cashier' || item.slug === 'service-chat')
    .slice(0, limit)
}
