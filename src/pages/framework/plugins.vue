<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const pluginItems = [
  {
    name: 'Pinia',
    desc: '应用状态管理，当前已拆分 app/user store。'
  },
  {
    name: 'Wot Design Uni',
    desc: '组件 easycom 自动加载，useToast/useMessage 等 API 自动导入。'
  },
  {
    name: 'UnoCSS',
    desc: '跨端原子类与主题变量，适合快速搭建业务页面。'
  },
  {
    name: 'Auto Import',
    desc: 'Vue、Pinia、uni-app 生命周期和 Wot API 统一自动导入。'
  }
]

const pluginSteps = [
  '在 src/plugins 中集中安装插件',
  '在 vite.config.ts 中维护构建插件',
  '业务模块按 hooks/store/utils 分层沉淀',
  '平台差异优先放到 hooks/usePlatform 中'
]
</script>

<template>
  <PageShell title="插件体系" description="参考成熟模板的插件化组织方式，保留 CLI/HBX 都容易理解的入口。">
    <view class="grid gap-3">
      <view
        v-for="item in pluginItems"
        :key="item.name"
        class="panel"
      >
        <view class="font-700">{{ item.name }}</view>
        <view class="muted-text mt-2 leading-6">{{ item.desc }}</view>
      </view>

      <view class="panel">
        <view class="font-700 mb-3">推荐接入顺序</view>
        <wd-steps :active="1" vertical>
          <wd-step
            v-for="step in pluginSteps"
            :key="step"
            :title="step"
          />
        </wd-steps>
      </view>
    </view>
  </PageShell>
</template>
