import { defineComponent, h } from 'vue'
import { neoExtraMoreCatalog, type MoreComponentSpec } from '@/utils/neoExtraMoreCatalog'

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

function createBySpec(spec: MoreComponentSpec) {
  const tone = getToneStyle(spec.tone || 'brand')

  if (spec.kind === 'metric') {
    return defineComponent({
      name: spec.name,
      setup() {
        return () => h('view', {
          style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
        }, [
          h('text', { style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;' }, spec.title),
          h('view', {
            style: 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14rpx;'
          }, (spec.metrics || []).map(item => h('view', {
            style: 'border:1rpx solid #e3eaf3;border-radius:18rpx;background:#fff;padding:18rpx;'
          }, [
            h('text', { style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;' }, item.value),
            h('text', { style: 'display:block;margin-top:8rpx;color:#6b7586;font-size:22rpx;' }, item.label)
          ])))
        ])
      }
    })
  }

  if (spec.kind === 'list') {
    return defineComponent({
      name: spec.name,
      setup() {
        return () => h('view', {
          style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
        }, [
          h('text', { style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;' }, spec.title),
          ...(spec.items || []).map(item => h('view', {
            style: 'display:flex;align-items:center;gap:12rpx;border-bottom:1rpx solid #edf1f6;padding-bottom:14rpx;'
          }, [
            h('view', { style: `width:12rpx;height:12rpx;border-radius:50%;background:${tone.accent};` }),
            h('text', { style: 'color:#5f6b7a;font-size:24rpx;line-height:1.7;' }, item)
          ]))
        ])
      }
    })
  }

  if (spec.kind === 'chip') {
    return defineComponent({
      name: spec.name,
      setup() {
        return () => h('view', {
          style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
        }, [
          h('text', { style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;' }, spec.title),
          h('view', {
            style: 'display:flex;flex-wrap:wrap;gap:12rpx;'
          }, (spec.items || []).map(item => h('view', {
            style: `display:inline-flex;align-items:center;justify-content:center;min-height:54rpx;border-radius:999rpx;background:${tone.chip};padding:0 18rpx;`
          }, [
            h('text', { style: `color:${tone.accent};font-size:22rpx;font-weight:800;` }, item)
          ])))
        ])
      }
    })
  }

  if (spec.kind === 'profile') {
    return defineComponent({
      name: spec.name,
      setup() {
        return () => h('view', {
          style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
        }, [
          h('text', { style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;' }, spec.title),
          h('view', {
            style: 'display:flex;align-items:center;gap:16rpx;'
          }, [
            h('view', {
              style: `display:flex;align-items:center;justify-content:center;width:72rpx;height:72rpx;border-radius:22rpx;background:${tone.chip};color:${tone.accent};font-size:30rpx;font-weight:800;`
            }, (spec.personName || spec.title).slice(0, 1)),
            h('view', { style: 'min-width:0;flex:1;' }, [
              h('text', { style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;' }, spec.personName || spec.title),
              h('text', { style: 'display:block;margin-top:8rpx;color:#6a7485;font-size:23rpx;line-height:1.6;' }, spec.personSubtitle || spec.subtitle || '')
            ])
          ]),
          spec.members?.length
            ? h('view', {
              style: 'display:flex;flex-wrap:wrap;gap:10rpx;'
            }, spec.members.map(item => h('view', {
              style: 'display:inline-flex;align-items:center;justify-content:center;min-height:48rpx;border-radius:999rpx;background:#fff;padding:0 16rpx;'
            }, [
              h('text', { style: 'color:#5f6b7a;font-size:22rpx;font-weight:700;' }, item)
            ])))
            : null
        ])
      }
    })
  }

  if (spec.kind === 'action') {
    return defineComponent({
      name: spec.name,
      setup() {
        return () => h('view', {
          style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
        }, [
          h('view', [
            h('text', { style: 'display:block;color:#182235;font-size:28rpx;font-weight:800;' }, spec.title),
            h('text', { style: 'display:block;margin-top:10rpx;color:#6a7485;font-size:24rpx;line-height:1.7;' }, spec.subtitle || '')
          ]),
          h('view', {
            style: 'display:flex;flex-wrap:wrap;gap:12rpx;'
          }, (spec.actions || []).map(action => h('view', {
            style: `display:inline-flex;align-items:center;justify-content:center;min-height:62rpx;border-radius:18rpx;background:${tone.chip};padding:0 18rpx;`
          }, [
            h('text', { style: `color:${tone.accent};font-size:23rpx;font-weight:800;` }, action)
          ])))
        ])
      }
    })
  }

  return defineComponent({
    name: spec.name,
    setup() {
      return () => h('view', {
        style: `display:grid;gap:18rpx;border:1rpx solid ${tone.border};border-radius:24rpx;background:${tone.background};padding:24rpx;`
      }, [
        h('view', {
          style: 'display:flex;align-items:flex-start;justify-content:space-between;gap:16rpx;'
        }, [
          h('view', { style: 'min-width:0;flex:1;' }, [
            h('text', { style: 'display:block;color:#182235;font-size:30rpx;font-weight:800;' }, spec.title),
            h('text', { style: 'display:block;margin-top:10rpx;color:#6a7485;font-size:24rpx;line-height:1.7;' }, spec.subtitle || '')
          ]),
          spec.meta
            ? h('text', { style: `flex-shrink:0;color:${tone.accent};font-size:22rpx;font-weight:800;` }, spec.meta)
            : null
        ]),
        spec.actionText
          ? h('view', {
            style: `display:inline-flex;align-items:center;justify-content:center;min-height:58rpx;justify-self:start;border-radius:999rpx;background:${tone.chip};padding:0 18rpx;color:${tone.accent};font-size:22rpx;font-weight:800;`
          }, spec.actionText)
          : null
      ])
    }
  })
}

export const neoMoreComponents = Object.fromEntries(
  neoExtraMoreCatalog.map(spec => [spec.name, createBySpec(spec)]),
) as Record<string, ReturnType<typeof defineComponent>>

export const neoMoreDemoMap = Object.fromEntries(
  neoExtraMoreCatalog.map(spec => [spec.path, { component: neoMoreComponents[spec.name] }]),
) as Record<string, DemoEntry>
