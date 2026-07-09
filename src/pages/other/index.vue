<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { navigateTo } from '@/utils/router'

const frameworkItems = [
  {
    title: '插件体系',
    value: 'Pinia / Wot / UnoCSS',
    url: '/pages/framework/plugins'
  },
  {
    title: '样式规范',
    value: 'Theme / UnoCSS',
    url: '/pages/framework/styles'
  },
  {
    title: '多语言',
    value: 'zh-CN / en-US',
    url: '/pages/framework/i18n'
  },
  {
    title: 'HBX 模板',
    value: 'CLI + HBuilderX',
    url: '/pages/framework/hbx'
  }
]
function showAboutApp() {
  uni.showToast({
    title: '当前版本: 0.1.0',
    icon: 'none'
  })
}
</script>

<template>
  <PageShell title="其他" description="模板工程能力、帮助、关于、协议和更多扩展入口。">
    <view class="grid gap-3">
      <wd-cell-group border>
        <wd-cell
          v-for="item in frameworkItems"
          :key="item.url"
          :title="item.title"
          :value="item.value"
          is-link
          clickable
          @click="navigateTo(item.url)"
        />
        <wd-cell title="关于应用" value="0.1.0" is-link clickable @click="showAboutApp" />
        <wd-cell title="帮助中心" is-link clickable @click="navigateTo('/pages/other/help')" />
        <wd-cell title="隐私协议" is-link clickable @click="navigateTo('/pages/other/privacy')" />
      </wd-cell-group>

      <view class="panel">
        <view class="font-700">模板能力</view>
        <view class="muted-text mt-2 leading-6">
          已补齐登录注册、插件入口、样式规范、多语言示例和 HBX/CLI 使用说明。后续可以继续加入请求拦截、权限路由、主题切换和业务组件库。
        </view>
      </view>
    </view>
  </PageShell>
</template>
