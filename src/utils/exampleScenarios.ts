export interface ExampleScenario {
  level: string
  title: string
  path: string
  description: string
  tags: string[]
}

export const exampleScenarios: ExampleScenario[] = [
  {
    level: '基础',
    title: '资料表单',
    path: 'basic',
    description: '表单录入、搜索、开关、计数器等基础交互。',
    tags: ['Form', 'Input', 'Switch']
  },
  {
    level: '初级',
    title: '商品列表',
    path: 'junior',
    description: '商品卡片、购物车数量和订单入口。',
    tags: ['Card', 'Tag', 'InputNumber']
  },
  {
    level: '中级',
    title: '审批流程',
    path: 'intermediate',
    description: '任务分组、流程进度、状态流转。',
    tags: ['Tabs', 'Steps', 'Progress']
  },
  {
    level: '高级',
    title: '运营看板',
    path: 'advanced',
    description: '业务指标、筛选条件、趋势和待办动作。',
    tags: ['Grid', 'Progress', 'Cell']
  },
  {
    level: '复杂',
    title: '订单工作台',
    path: 'complex',
    description: '订单详情、履约节点、客户信息和操作闭环。',
    tags: ['Collapse', 'Timeline', 'Action']
  },
  {
    level: '内容流',
    title: '瀑布流',
    path: 'waterfall',
    description: '短视频/本地生活风格内容流，支持分类、动态加载和详情页。',
    tags: ['Waterfall', 'Feed', 'Detail']
  }
]

export function navigateToExample(path: string) {
  uni.navigateTo({
    url: `/pages/examples/${path}`
  })
}
