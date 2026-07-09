<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const searchQuery = ref('')
const activeNames = ref<string[]>([])

const faqCategories = [
  {
    title: '🚀 基础常见问题',
    items: [
      {
        id: 'faq-1',
        q: '如何使用这套 UniApp 模版？',
        a: '本模版基于 Vue 3 + TypeScript + Pinia + UnoCSS + Wot Design Uni 构建。在本地安装依赖后，运行命令 `pnpm dev:h5` 或 `pnpm dev:mp-weixin` 即可在相应平台预览开发。详情可以参考“其他”页面中的“HBX 模板”使用教程。'
      },
      {
        id: 'faq-2',
        q: '如何切换主题色或深色模式？',
        a: '您可以在 `src/styles/theme.css` 或 UnoCSS 配置文件中调整全局色彩变量。全局设计遵循 CSS 变量规范，通过修改 `--app-brand` 等变量即可秒变主题色彩。'
      }
    ]
  },
  {
    title: '📡 网络与数据请求',
    items: [
      {
        id: 'faq-3',
        q: '项目中如何配置接口请求拦截？',
        a: '核心请求封装代码位于 `src/utils/request.ts` 文件夹下。您可以通过修改 `createRequest` 中的拦截器，自行定义 Token 携带规则、401 无权限重定向拦截以及网络错误重试逻辑。'
      },
      {
        id: 'faq-4',
        q: 'H5 端开发时跨域（CORS）如何解决？',
        a: '在 `vite.config.ts` 中配置了 `server.proxy` 代理服务。您可以在其中将 `/api` 指向您的真实后端 API 接口服务地址，从而绕过 H5 端的跨域限制。'
      }
    ]
  },
  {
    title: '🛠️ 跨端打包与排错',
    items: [
      {
        id: 'faq-5',
        q: '小程序打包体积超出限制怎么处理？',
        a: '建议开启 uniapp 编译的分包配置 `subPackages`。将复杂的业务逻辑（如音视频播放、特定大型展示页）拆分到分包中。并在编译时开启“运行时代码压缩”选项。'
      },
      {
        id: 'faq-6',
        q: '样式在微信小程序与 H5 显示不一致？',
        a: '微信小程序不支持部分 H5 端专有的 CSS 样式（如复杂的 `backdrop-filter` 视平台兼容性而定）。在编写样式时，推荐优先使用 UniApp 官方推荐的 `rpx` 单位或标准的 Flex 弹性盒模型，尽量避免使用 ad-hoc 的原生选择器。'
      }
    ]
  }
]

// Filter FAQ items by search query
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return faqCategories
  
  const query = searchQuery.value.toLowerCase()
  return faqCategories.map(cat => {
    const items = cat.items.filter(item => 
      item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)
    )
    return { ...cat, items }
  }).filter(cat => cat.items.length > 0)
})

function contactSupport() {
  uni.showModal({
    title: '在线客服',
    content: '客服服务时间：工作日 9:00 - 18:00。是否拨打客服热线模拟？',
    success: (res) => {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: '4001001000'
        })
      }
    }
  })
}

function submitFeedback() {
  uni.showToast({
    title: '反馈通道暂未开放，请联系管理员！',
    icon: 'none'
  })
}
</script>

<template>
  <PageShell title="帮助中心" description="为您提供模版工程化配置、接口封装和微信小程序常见问题的快速自助解答。">
    <view class="help-center-page">
      
      <!-- Top search bar -->
      <view class="search-wrap">
        <wd-search v-model="searchQuery" placeholder="输入关键字搜索常见问题..." hide-cancel />
      </view>

      <!-- FAQ Accordions -->
      <view class="faq-list mt-3">
        <view v-if="filteredCategories.length === 0" class="empty-faq text-center">
          <text class="empty-icon">🔍</text>
          <view class="empty-txt mt-2">未找到与“{{ searchQuery }}”相关的解答</view>
        </view>

        <view
          v-else
          v-for="cat in filteredCategories"
          :key="cat.title"
          class="faq-cat-group"
        >
          <view class="cat-title">{{ cat.title }}</view>
          
          <view class="collapse-box mt-2">
            <wd-collapse v-model="activeNames">
              <wd-collapse-item
                v-for="item in cat.items"
                :key="item.id"
                :title="item.q"
                :name="item.id"
              >
                <view class="faq-answer">{{ item.a }}</view>
              </wd-collapse-item>
            </wd-collapse>
          </view>
        </view>
      </view>

      <!-- Bottom help buttons -->
      <view class="footer-help-actions mt-5">
        <view class="action-btn-card" @click="contactSupport">
          <text class="icon-bubble">💬</text>
          <view class="btn-lbl">在线客服</view>
          <view class="btn-sub">工作日快速解答</view>
        </view>
        <view class="action-btn-card" @click="submitFeedback">
          <text class="icon-bubble">📝</text>
          <view class="btn-lbl">意见反馈</view>
          <view class="btn-sub">吐槽与改进建议</view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.help-center-page {
  padding-bottom: 80rpx;
}

.search-wrap {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f8fafc;
  padding: 10rpx 0;
}

.faq-list {
  display: grid;
  gap: 32rpx;
}

.faq-cat-group {
  display: flex;
  flex-direction: column;
}

.cat-title {
  font-size: 24rpx;
  font-weight: 850;
  color: var(--app-ink);
  padding-left: 12rpx;
  border-left: 6rpx solid var(--app-brand);
}

.collapse-box {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  border: 1rpx solid var(--app-line);
}

.faq-answer {
  font-size: 21rpx;
  color: var(--app-muted);
  line-height: 1.5;
  background: #f8fafc;
  padding: 16rpx;
  border-radius: 8rpx;
}

/* Empty search result style */
.empty-faq {
  padding: 60rpx 0;
}

.empty-icon {
  font-size: 80rpx;
}

.empty-txt {
  font-size: 22rpx;
  color: var(--app-muted);
}

/* Footer layout actions */
.footer-help-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.action-btn-card {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  cursor: pointer;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.01);
  
  &:active {
    background: #f1f5f9;
  }
}

.icon-bubble {
  font-size: 40rpx;
}

.btn-lbl {
  font-size: 22rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.btn-sub {
  font-size: 16rpx;
  color: var(--app-muted);
}

.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-5 { margin-top: 40rpx; }
.ml-2 { margin-left: 16rpx; }
.text-center { text-align: center; }
.font-bold { font-weight: 800; }
</style>
