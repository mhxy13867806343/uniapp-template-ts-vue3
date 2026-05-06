<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

type NodeType = 'folder' | 'file'

interface TreeNode {
  id: string
  name: string
  type: NodeType
  size?: string
  updated: string
  children?: TreeNode[]
}

interface VisibleNode extends TreeNode {
  level: number
}

const keyword = ref('')
const expandedIds = ref(['workspace', 'src', 'pages'])

const tree: TreeNode[] = [
  {
    id: 'workspace',
    name: 'uniapp-template-ts-vue3',
    type: 'folder',
    updated: '刚刚',
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        updated: '今天',
        children: [
          {
            id: 'pages',
            name: 'pages',
            type: 'folder',
            updated: '今天',
            children: [
              { id: 'examples', name: 'examples', type: 'folder', updated: '刚刚' },
              { id: 'components', name: 'components', type: 'folder', updated: '昨天' }
            ]
          },
          { id: 'utils', name: 'utils', type: 'folder', updated: '今天' },
          { id: 'styles', name: 'styles', type: 'folder', updated: '周一' }
        ]
      },
      { id: 'readme', name: 'README.md', type: 'file', size: '6.2 KB', updated: '刚刚' },
      { id: 'pages-json', name: 'pages.json', type: 'file', size: '4.8 KB', updated: '今天' }
    ]
  }
]

const visibleNodes = computed<VisibleNode[]>(() => {
  const text = keyword.value.trim().toLowerCase()
  const result: VisibleNode[] = []

  function walk(nodes: TreeNode[], level: number) {
    nodes.forEach((node) => {
      const matched = !text || node.name.toLowerCase().includes(text)
      if (matched) {
        result.push({ ...node, level })
      }
      if (node.children?.length && (expandedIds.value.includes(node.id) || text)) {
        walk(node.children, level + 1)
      }
    })
  }

  walk(tree, 0)
  return result
})

const folderCount = computed(() => visibleNodes.value.filter((item) => item.type === 'folder').length)
const fileCount = computed(() => visibleNodes.value.filter((item) => item.type === 'file').length)

function toggleNode(node: VisibleNode) {
  if (!node.children?.length) return
  if (expandedIds.value.includes(node.id)) {
    expandedIds.value = expandedIds.value.filter((id) => id !== node.id)
  } else {
    expandedIds.value = [...expandedIds.value, node.id]
  }
}
</script>

<template>
  <PageShell title="文件夹树形" description="文件夹和文件树形模板，支持展开收起、搜索过滤和层级缩进。">
    <view class="folders-page">
      <view class="summary-card">
        <view>
          <view class="summary-title">项目文件夹</view>
          <view class="summary-desc">适合网盘、知识库、项目文件管理等业务。</view>
        </view>
        <view class="count-box">
          <text>{{ folderCount }} 夹</text>
          <text>{{ fileCount }} 文件</text>
        </view>
      </view>

      <wd-search v-model="keyword" placeholder="搜索文件夹或文件名" />

      <view class="tree-card">
        <view
          v-for="node in visibleNodes"
          :key="node.id"
          class="tree-row"
          :style="{ paddingLeft: `${24 + node.level * 34}rpx` }"
          @click="toggleNode(node)"
        >
          <view :class="['node-icon', node.type]">
            {{ node.type === 'folder' ? (expandedIds.includes(node.id) ? '开' : '夹') : '文' }}
          </view>
          <view class="min-w-0 flex-1">
            <view class="node-name">{{ node.name }}</view>
            <view class="node-meta">{{ node.updated }}{{ node.size ? ` · ${node.size}` : '' }}</view>
          </view>
          <wd-icon v-if="node.children?.length" :name="expandedIds.includes(node.id) ? 'arrow-up' : 'arrow-down'" size="16px" />
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.folders-page {
  display: grid;
  gap: 22rpx;
}

.summary-card,
.tree-card {
  border: 1rpx solid var(--app-line);
  border-radius: 14rpx;
  background: #fff;
}

.summary-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 30rpx;
}

.summary-title {
  color: var(--app-ink);
  font-size: 34rpx;
  font-weight: 900;
}

.summary-desc,
.node-meta {
  color: var(--app-muted);
  font-size: 24rpx;
}

.summary-desc {
  margin-top: 8rpx;
  line-height: 1.5;
}

.count-box {
  display: grid;
  gap: 8rpx;
  flex: 0 0 auto;
  color: var(--app-brand);
  font-size: 23rpx;
  font-weight: 900;
}

.tree-card {
  overflow: hidden;
}

.tree-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
  border-bottom: 1rpx solid var(--app-line);
  padding-top: 20rpx;
  padding-right: 24rpx;
  padding-bottom: 20rpx;
}

.tree-row:last-child {
  border-bottom: 0;
}

.node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 56rpx;
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  font-size: 22rpx;
  font-weight: 900;
}

.node-icon.folder {
  background: #eff6ff;
  color: var(--app-brand);
}

.node-icon.file {
  background: #f6f8fb;
  color: var(--app-muted);
}

.node-name {
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 800;
}

.node-meta {
  margin-top: 6rpx;
}
</style>
