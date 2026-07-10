import { defineComponent, h } from 'vue'

type Tone = 'brand' | 'success' | 'warning' | 'slate'

interface DemoEntry {
  component: ReturnType<typeof defineComponent>
  props?: Record<string, unknown>
}

function getToneStyle(tone: Tone) {
  if (tone === 'success') {
    return {
      border: '#d6eadf',
      accent: '#24925b',
      background: 'linear-gradient(180deg, #ffffff 0%, #f2fbf6 100%)',
      chip: '#edf9f2'
    }
  }

  if (tone === 'warning') {
    return {
      border: '#efd8b1',
      accent: '#c97b1d',
      background: 'linear-gradient(180deg, #ffffff 0%, #fff8ee 100%)',
      chip: '#fff2df'
    }
  }

  if (tone === 'slate') {
    return {
      border: '#d7deea',
      accent: '#4f607d',
      background: 'linear-gradient(180deg, #ffffff 0%, #f5f7fb 100%)',
      chip: '#eef2f8'
    }
  }

  return {
    border: '#d9e4ff',
    accent: '#426cff',
    background: 'linear-gradient(180deg, #ffffff 0%, #f3f7ff 100%)',
    chip: '#edf3ff'
  }
}

function createInfoCardComponent(
  displayName: string,
  preset: { title: string, subtitle: string, meta?: string, actionText?: string, tone?: Tone },
) {
  return defineComponent({
    name: displayName,
    props: {
      title: { type: String, default: preset.title },
      subtitle: { type: String, default: preset.subtitle },
      meta: { type: String, default: preset.meta || '' },
      actionText: { type: String, default: preset.actionText || '' }
    },
    setup(props) {
      return () => {
        const tone = getToneStyle(preset.tone || 'brand')
        return h('view', {
          style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
        }, [
          h('view', {
            style: 'display:flex;align-items:flex-start;justify-content:space-between;gap:16rpx;'
          }, [
            h('view', { style: 'min-width:0;flex:1;' }, [
              h('text', {
                style: 'display:block;color:#182235;font-size:30rpx;font-weight:800;'
              }, props.title),
              h('text', {
                style: 'display:block;margin-top:10rpx;color:#6a7485;font-size:24rpx;line-height:1.7;'
              }, props.subtitle)
            ]),
            props.meta
              ? h('text', {
                style: `flex-shrink:0;color:${tone.accent};font-size:22rpx;font-weight:800;`
              }, props.meta)
              : null
          ]),
          props.actionText
            ? h('view', {
              style: `display:inline-flex;align-items:center;justify-content:center;min-height:58rpx;justify-self:start;border-radius:999rpx;background:${tone.chip};padding:0 18rpx;color:${tone.accent};font-size:22rpx;font-weight:800;`
            }, props.actionText)
            : null
        ])
      }
    }
  })
}

function createChipPanelComponent(
  displayName: string,
  preset: { title: string, items: string[], tone?: Tone },
) {
  return defineComponent({
    name: displayName,
    props: {
      title: { type: String, default: preset.title },
      items: { type: Array as () => string[], default: () => preset.items }
    },
    setup(props) {
      return () => {
        const tone = getToneStyle(preset.tone || 'brand')
        return h('view', {
          style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
        }, [
          h('text', {
            style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;'
          }, props.title),
          h('view', {
            style: 'display:flex;flex-wrap:wrap;gap:12rpx;'
          }, props.items.map(item => h('view', {
            style: `display:inline-flex;align-items:center;justify-content:center;min-height:54rpx;border-radius:999rpx;background:${tone.chip};padding:0 18rpx;`
          }, [
            h('text', {
              style: `color:${tone.accent};font-size:22rpx;font-weight:800;`
            }, item)
          ])))
        ])
      }
    }
  })
}

function createMetricGridComponent(
  displayName: string,
  preset: { title: string, items: Array<{ label: string, value: string }>, tone?: Tone },
) {
  return defineComponent({
    name: displayName,
    props: {
      title: { type: String, default: preset.title },
      items: {
        type: Array as () => Array<{ label: string, value: string }>,
        default: () => preset.items
      }
    },
    setup(props) {
      return () => {
        const tone = getToneStyle(preset.tone || 'brand')
        return h('view', {
          style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
        }, [
          h('text', {
            style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;'
          }, props.title),
          h('view', {
            style: 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14rpx;'
          }, props.items.map(item => h('view', {
            style: 'border:1rpx solid #e3eaf3;border-radius:18rpx;background:#fff;padding:18rpx;'
          }, [
            h('text', {
              style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;'
            }, item.value),
            h('text', {
              style: 'display:block;margin-top:8rpx;color:#6b7586;font-size:22rpx;'
            }, item.label)
          ])))
        ])
      }
    }
  })
}

function createListPanelComponent(
  displayName: string,
  preset: { title: string, items: string[], tone?: Tone },
) {
  return defineComponent({
    name: displayName,
    props: {
      title: { type: String, default: preset.title },
      items: { type: Array as () => string[], default: () => preset.items }
    },
    setup(props) {
      return () => {
        const tone = getToneStyle(preset.tone || 'slate')
        return h('view', {
          style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
        }, [
          h('text', {
            style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;'
          }, props.title),
          ...props.items.map(item => h('view', {
            style: 'display:flex;align-items:center;gap:12rpx;border-bottom:1rpx solid #edf1f6;padding-bottom:14rpx;'
          }, [
            h('view', {
              style: `width:12rpx;height:12rpx;border-radius:50%;background:${tone.accent};`
            }),
            h('text', {
              style: 'color:#5f6b7a;font-size:24rpx;line-height:1.7;'
            }, item)
          ]))
        ])
      }
    }
  })
}

function createProfilePanelComponent(
  displayName: string,
  preset: { title: string, name: string, subtitle: string, members?: string[], tone?: Tone },
) {
  return defineComponent({
    name: displayName,
    props: {
      title: { type: String, default: preset.title },
      name: { type: String, default: preset.name },
      subtitle: { type: String, default: preset.subtitle },
      members: { type: Array as () => string[], default: () => preset.members || [] }
    },
    setup(props) {
      return () => {
        const tone = getToneStyle(preset.tone || 'brand')
        return h('view', {
          style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
        }, [
          h('text', {
            style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;'
          }, props.title),
          h('view', {
            style: 'display:flex;align-items:center;gap:16rpx;'
          }, [
            h('view', {
              style: `display:flex;align-items:center;justify-content:center;width:72rpx;height:72rpx;border-radius:22rpx;background:${tone.chip};color:${tone.accent};font-size:30rpx;font-weight:800;`
            }, props.name.slice(0, 1)),
            h('view', { style: 'min-width:0;flex:1;' }, [
              h('text', {
                style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;'
              }, props.name),
              h('text', {
                style: 'display:block;margin-top:8rpx;color:#6a7485;font-size:23rpx;line-height:1.6;'
              }, props.subtitle)
            ])
          ]),
          props.members.length
            ? h('view', {
              style: 'display:flex;flex-wrap:wrap;gap:10rpx;'
            }, props.members.map(member => h('view', {
              style: 'display:inline-flex;align-items:center;justify-content:center;min-height:48rpx;border-radius:999rpx;background:#fff;padding:0 16rpx;'
            }, [
              h('text', {
                style: 'color:#5f6b7a;font-size:22rpx;font-weight:700;'
              }, member)
            ])))
            : null
        ])
      }
    }
  })
}

function createActionPanelComponent(
  displayName: string,
  preset: { title: string, subtitle: string, actions: string[], tone?: Tone },
) {
  return defineComponent({
    name: displayName,
    props: {
      title: { type: String, default: preset.title },
      subtitle: { type: String, default: preset.subtitle },
      actions: { type: Array as () => string[], default: () => preset.actions }
    },
    setup(props) {
      return () => {
        const tone = getToneStyle(preset.tone || 'brand')
        return h('view', {
          style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
        }, [
          h('view', [
            h('text', {
              style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;'
            }, props.title),
            h('text', {
              style: 'display:block;margin-top:10rpx;color:#6a7485;font-size:24rpx;line-height:1.7;'
            }, props.subtitle)
          ]),
          h('view', {
            style: 'display:flex;flex-wrap:wrap;gap:12rpx;'
          }, props.actions.map(action => h('view', {
            style: `display:inline-flex;align-items:center;justify-content:center;min-height:62rpx;border-radius:18rpx;background:${tone.chip};padding:0 18rpx;`
          }, [
            h('text', {
              style: `color:${tone.accent};font-size:23rpx;font-weight:800;`
            }, action)
          ])))
        ])
      }
    }
  })
}

export const neoExtraComponents = {
  NeoSegmented: createChipPanelComponent('NeoSegmented', { title: '分段选择', items: ['总览', '明细', '趋势'], tone: 'brand' }),
  NeoProgress: createMetricGridComponent('NeoProgress', { title: '进度概览', items: [{ label: '已完成', value: '78%' }, { label: '剩余', value: '22%' }], tone: 'brand' }),
  NeoStatCard: createInfoCardComponent('NeoStatCard', { title: '月度统计', subtitle: '适合首页摘要卡和运营数据概览。', meta: '本月', tone: 'brand' }),
  NeoEmptySearch: createInfoCardComponent('NeoEmptySearch', { title: '没有找到结果', subtitle: '试试更换关键词或调整筛选条件。', actionText: '清空筛选', tone: 'slate' }),
  NeoAvatar: createProfilePanelComponent('NeoAvatar', { title: '头像信息', name: '林知夏', subtitle: '采购负责人 · 华东大区', tone: 'brand' }),
  NeoAvatarGroup: createProfilePanelComponent('NeoAvatarGroup', { title: '协作成员', name: '项目组', subtitle: '共 4 位成员参与当前任务', members: ['林知夏', '王敏', '周扬', '陈露'], tone: 'success' }),
  NeoBreadcrumb: createListPanelComponent('NeoBreadcrumb', { title: '页面路径', items: ['首页', '客户中心', '详情页'], tone: 'slate' }),
  NeoCell: createListPanelComponent('NeoCell', { title: '单元格信息', items: ['账户信息', '发票抬头', '收货地址'], tone: 'slate' }),
  NeoPriceTag: createInfoCardComponent('NeoPriceTag', { title: '价格标签', subtitle: '适合商品、套餐和报价摘要展示。', meta: '¥199', tone: 'warning' }),
  NeoCouponCard: createInfoCardComponent('NeoCouponCard', { title: '新人券 ¥80', subtitle: '满 499 可用，适合营销券和活动券展示。', actionText: '立即领取', tone: 'warning' }),
  NeoResultPanel: createInfoCardComponent('NeoResultPanel', { title: '已提交成功', subtitle: '资料已经进入审核流程，预计 1 个工作日内返回结果。', meta: '成功', tone: 'success' }),
  NeoFab: createActionPanelComponent('NeoFab', { title: '悬浮操作', subtitle: '适合页面右下角快捷入口。', actions: ['新建', '分享'], tone: 'brand' }),
  NeoToolbar: createActionPanelComponent('NeoToolbar', { title: '底部工具栏', subtitle: '适合详情页底部操作聚合。', actions: ['收藏', '分享', '购买'], tone: 'slate' }),
  NeoFilterChips: createChipPanelComponent('NeoFilterChips', { title: '筛选胶囊', items: ['全部', '待处理', '已完成', '异常'], tone: 'brand' }),
  NeoInfoGrid: createMetricGridComponent('NeoInfoGrid', { title: '信息网格', items: [{ label: '订单数', value: '128' }, { label: '客户数', value: '32' }, { label: '转化率', value: '16%' }, { label: '复购率', value: '38%' }], tone: 'brand' }),
  NeoSummaryPanel: createInfoCardComponent('NeoSummaryPanel', { title: '摘要面板', subtitle: '适合列表页顶部摘要、分区统计和一屏总览。', meta: '摘要', tone: 'slate' }),
  NeoMenuGrid: createMetricGridComponent('NeoMenuGrid', { title: '菜单宫格', items: [{ label: '审批', value: '01' }, { label: '工单', value: '02' }, { label: '消息', value: '03' }, { label: '设置', value: '04' }], tone: 'brand' }),
  NeoStatusPanel: createInfoCardComponent('NeoStatusPanel', { title: '运行状态正常', subtitle: '服务可用率 99.98%，当前未发现异常波动。', meta: '稳定', tone: 'success' }),
  NeoOrderSummary: createInfoCardComponent('NeoOrderSummary', { title: '订单摘要', subtitle: '3 件商品，运费已减免，支持电子发票。', meta: '¥1,268', tone: 'brand' }),
  NeoInfoBanner: createInfoCardComponent('NeoInfoBanner', { title: '活动横幅', subtitle: '适合促销提醒、公告通知和版本升级提示。', actionText: '查看详情', tone: 'brand' })
} as const

export const neoExtraDemoMap: Record<string, DemoEntry> = {
  'neo-segmented': { component: neoExtraComponents.NeoSegmented },
  'neo-progress': { component: neoExtraComponents.NeoProgress },
  'neo-stat-card': { component: neoExtraComponents.NeoStatCard },
  'neo-empty-search': { component: neoExtraComponents.NeoEmptySearch },
  'neo-avatar': { component: neoExtraComponents.NeoAvatar },
  'neo-avatar-group': { component: neoExtraComponents.NeoAvatarGroup },
  'neo-breadcrumb': { component: neoExtraComponents.NeoBreadcrumb },
  'neo-cell': { component: neoExtraComponents.NeoCell },
  'neo-price-tag': { component: neoExtraComponents.NeoPriceTag },
  'neo-coupon-card': { component: neoExtraComponents.NeoCouponCard },
  'neo-result-panel': { component: neoExtraComponents.NeoResultPanel },
  'neo-fab': { component: neoExtraComponents.NeoFab },
  'neo-toolbar': { component: neoExtraComponents.NeoToolbar },
  'neo-filter-chips': { component: neoExtraComponents.NeoFilterChips },
  'neo-info-grid': { component: neoExtraComponents.NeoInfoGrid },
  'neo-summary-panel': { component: neoExtraComponents.NeoSummaryPanel },
  'neo-menu-grid': { component: neoExtraComponents.NeoMenuGrid },
  'neo-status-panel': { component: neoExtraComponents.NeoStatusPanel },
  'neo-order-summary': { component: neoExtraComponents.NeoOrderSummary },
  'neo-info-banner': { component: neoExtraComponents.NeoInfoBanner }
}
