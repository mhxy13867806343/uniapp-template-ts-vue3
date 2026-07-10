import type { CustomComponentItem } from './customComponents'
import { neoExtraMoreCatalog } from './neoExtraMoreCatalog'

interface ExtraMeta extends CustomComponentItem {
  code: string
  scenes: string[]
}

export const neoExtraMoreMetaList: ExtraMeta[] = neoExtraMoreCatalog.map((item) => ({
  name: item.name,
  title: item.title,
  path: item.path,
  summary: item.summary,
  code: `import { neoExtraComponents } from '@/components/neo/extra-library'

const { ${item.name} } = neoExtraComponents

<${item.name} />`,
  scenes: item.scenes,
  tags: ['独立实现', '扩展件', item.title],
  group: '第三方组件'
}))

export const neoExtraMoreMetaMap = Object.fromEntries(
  neoExtraMoreMetaList.map(item => [item.path, item]),
) as Record<string, ExtraMeta>
