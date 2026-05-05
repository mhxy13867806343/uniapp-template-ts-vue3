export type TabbarName = 'home' | 'mine' | 'components' | 'examples' | 'other'

export interface TabbarItem {
  name: TabbarName
  title: string
  icon: string
  pagePath: string
}

export const tabbarItems: TabbarItem[] = [
  { name: 'home', title: '首页', icon: 'home', pagePath: '/pages/home/index' },
  { name: 'mine', title: '我的', icon: 'user', pagePath: '/pages/mine/index' },
  { name: 'components', title: '组件', icon: 'app', pagePath: '/pages/components/index' },
  { name: 'examples', title: '示例', icon: 'chart', pagePath: '/pages/examples/index' },
  { name: 'other', title: '其他', icon: 'more', pagePath: '/pages/other/index' }
]

export function getActiveTabName(): TabbarName {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const route = current?.route ? `/${current.route}` : tabbarItems[0].pagePath
  const item = tabbarItems.find((tabbarItem) => {
    return route === tabbarItem.pagePath || route.startsWith(`${tabbarItem.pagePath.replace('/index', '')}/`)
  })

  return item?.name || 'home'
}

export function switchTabByName(name: TabbarName) {
  const target = tabbarItems.find((item) => item.name === name)

  if (!target || target.name === getActiveTabName()) {
    return
  }

  uni.switchTab({
    url: target.pagePath
  })
}
