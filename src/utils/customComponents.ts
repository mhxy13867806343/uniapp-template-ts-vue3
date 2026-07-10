export interface CustomComponentItem {
  name: string
  title: string
  path: string
  summary: string
  tags: string[]
  group: string
}

export const customComponents: CustomComponentItem[] = [
  {
    name: 'NeoMetricBoard',
    title: '指标看板',
    path: 'neo-metric-board',
    summary: '独立封装的看板组件，适合首页、驾驶舱和经营总览，不依赖任何 UI 组件库。',
    tags: ['独立实现', '看板', '数据概览'],
    group: '第三方组件'
  },
  {
    name: 'NeoTaskCluster',
    title: '任务簇面板',
    path: 'neo-task-cluster',
    summary: '面向审批、工单、运营的任务组件，内含优先级、摘要和操作区。',
    tags: ['独立实现', '任务', '操作面板'],
    group: '第三方组件'
  },
  {
    name: 'NeoProfileSpotlight',
    title: '人物聚焦卡',
    path: 'neo-profile-spotlight',
    summary: '适合客户详情、成员资料和线索页，包含基础信息、统计和跟进时间线。',
    tags: ['独立实现', '人物卡', '资料详情'],
    group: '第三方组件'
  }
]

export function findCustomComponent(path?: string) {
  return customComponents.find(item => item.path === path) || customComponents[0]
}

export function getCustomComponentCode(path: string) {
  if (path === 'neo-metric-board') {
    return `import NeoMetricBoard from '@/components/neo/NeoMetricBoard.vue'

<NeoMetricBoard
  title="周经营总览"
  subtitle="快速看到关键数据和多端交付进度"
  status-label="本周稳定"
  :metrics="metrics"
  :channels="channels"
  :actions="actions"
/>`
  }

  if (path === 'neo-task-cluster') {
    return `import NeoTaskCluster from '@/components/neo/NeoTaskCluster.vue'

<NeoTaskCluster
  title="今日待处理"
  subtitle="适合审批、工单和运营催办场景"
  summary-label="3 条高优事项"
  completion-value="完成率 68%"
  completion-hint="还有 2 条事项需要今天闭环"
  :tasks="tasks"
  primary-action="立即处理"
  secondary-action="稍后提醒"
/>`
  }

  return `import NeoProfileSpotlight from '@/components/neo/NeoProfileSpotlight.vue'

<NeoProfileSpotlight
  name="林知夏"
  role="华东区域采购负责人"
  status="重点客户"
  company="澄星科技"
  phone="138****5566"
  email="linzhixia@example.com"
  :stats="stats"
  :records="records"
/>`
}

export function getCustomComponentScenes(path: string) {
  if (path === 'neo-metric-board') {
    return [
      '首页经营看板',
      '门店数据总览',
      '多端项目周报入口'
    ]
  }

  if (path === 'neo-task-cluster') {
    return [
      '审批中心',
      '售后工单处理',
      '运营任务催办'
    ]
  }

  return [
    '客户详情页',
    '销售线索池',
    '项目成员资料页'
  ]
}
