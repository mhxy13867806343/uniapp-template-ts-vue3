<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('routing-toast')

// States
const realPages = ref<any[]>([])
const navParams = ref('id=1024&source=routing_api')

function refreshRouterStack() {
  try {
    const pages = getCurrentPages()
    realPages.value = pages.map((p: any) => ({
      route: p.route || '未知页面',
      options: p.options || {}
    }))
  } catch (e) {
    realPages.value = [{ route: 'pages/uni-api/routing', options: {} }]
  }
}

function handleNavigateTo() {
  uni.navigateTo({
    url: `/pages/uni-api/storage?${navParams.value}`,
    success: () => {
      toast.success('navigateTo 跳转成功')
    }
  })
}

function handleRedirectTo() {
  uni.redirectTo({
    url: `/pages/uni-api/interface?${navParams.value}`,
    success: () => {
      toast.success('redirectTo 重定向成功')
    }
  })
}

function handleSwitchTab() {
  uni.switchTab({
    url: '/pages/home/index',
    success: () => {
      toast.success('switchTab 切换 Tab 成功')
    }
  })
}

function handleReLaunch() {
  uni.showModal({
    title: '确认全局重启',
    content: 'reLaunch 将关闭所有历史页面栈并重新加载首页，确认继续吗？',
    success: (res) => {
      if (res.confirm) {
        uni.reLaunch({
          url: '/pages/home/index?relaunch=true'
        })
      }
    }
  })
}

function handleNavigateBack() {
  const pages = getCurrentPages()
  if (pages.length <= 1) {
    toast.warning('已经处于根级页面，无法再退栈')
    return
  }
  uni.navigateBack({
    delta: 1
  })
}

function handlePreloadPage() {
  // uni.preloadPage is only supported on certain MP platforms and App
  // #ifdef APP-PLUS || MP-WEIXIN
  try {
    uni.preloadPage({
      url: '/pages/uni-api/storage'
    })
    toast.success('预加载 pages/uni-api/storage 页面资源成功')
  } catch (e: any) {
    toast.warning(`预加载失败: ${e.message}`)
  }
  // #endif

  // #ifndef APP-PLUS || MP-WEIXIN
  toast.warning('当前平台不支持 preloadPage，通常在微信小程序或 App 中使用')
  // #endif
}

onMounted(() => {
  refreshRouterStack()
})
</script>

<template>
  <PageShell title="页面和路由 APIs" description="演示 UniApp 路由导航栈原理，支持实时抓取底层路由栈，体验 navigateTo、redirectTo 等不同路由模式的区别。">
    <view class="routing-api-page">
      <wd-toast selector="routing-toast" />

      <!-- 1. Real-time Router Stack Visualizer -->
      <view class="api-card-panel">
        <view class="panel-header font-bold text-ink flex justify-between items-center mb-2">
          <text>🥞 实时页面路由栈分析 (getCurrentPages)</text>
          <text class="refresh-stack-btn font-bold text-brand" @click="refreshRouterStack">刷新堆栈</text>
        </view>
        <view class="share-desc-info text-muted mb-3">
          下方列表由系统原生 API 抓取得到。UniApp 历史页面栈深度最大限制为 10 层，超过将无法继续跳转：
        </view>

        <view class="router-stack-list">
          <view v-if="realPages.length === 0" class="empty-stack p-3 text-center text-muted">
            正在分析页面栈中...
          </view>
          
          <view
            v-for="(page, idx) in realPages"
            :key="idx"
            class="stack-item-row flex justify-between items-center p-3 mb-2"
          >
            <view class="flex items-center">
              <text class="stack-depth-badge font-bold flex items-center justify-center">#{{ idx + 1 }}</text>
              <view class="stack-meta ml-2">
                <text class="stack-path font-bold text-ink">{{ page.route }}</text>
                <text class="stack-query text-muted">携带参数: {{ JSON.stringify(page.options) }}</text>
              </view>
            </view>
            <wd-tag :type="idx === realPages.length - 1 ? 'primary' : 'success'" plain>
              {{ idx === realPages.length - 1 ? '活动栈顶 (Active)' : '已挂起 (Suspended)' }}
            </wd-tag>
          </view>
        </view>
      </view>

      <!-- 2. Interactive Navigation controller -->
      <view class="api-card-panel mt-3">
        <view class="panel-header font-bold text-ink mb-2">
          <text>🚀 路由控制与参数携带 (uni.navigateTo)</text>
        </view>

        <view class="form-row">
          <text class="row-label font-bold">跳转参数配置 (Query String)</text>
          <input v-model="navParams" placeholder="例如: uid=9988&vip=true" class="custom-native-input mt-1" />
        </view>

        <!-- Command Grid actions -->
        <view class="routing-actions-grid mt-3 flex-column">
          
          <view class="routing-action-card p-3 mb-2 flex justify-between items-center" @click="handleNavigateTo">
            <view class="flex-column">
              <text class="action-title font-bold text-ink">uni.navigateTo (保留当前页)</text>
              <text class="action-desc">跳转到缓存管理页，使当前页挂起退入栈中，点击左上角可返回。</text>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>

          <view class="routing-action-card p-3 mb-2 flex justify-between items-center" @click="handleRedirectTo">
            <view class="flex-column">
              <text class="action-title font-bold text-ink">uni.redirectTo (关闭并替换当前页)</text>
              <text class="action-desc">重定向至界面反馈页。当前页将出栈销毁，无法再通过物理返回键退回。</text>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>

          <view class="routing-action-card p-3 mb-2 flex justify-between items-center" @click="handleSwitchTab">
            <view class="flex-column">
              <text class="action-title font-bold text-ink">uni.switchTab (切换主页底栏)</text>
              <text class="action-desc">关闭所有非 TabBar 页面，直接跳转至系统底部配置的首页。</text>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>

          <view class="routing-action-card p-3 mb-2 flex justify-between items-center" @click="handlePreloadPage">
            <view class="flex-column">
              <text class="action-title font-bold text-ink">uni.preloadPage (预加载目标页)</text>
              <text class="action-desc">提前下载编译缓存管理页的视图和资源，秒开必备（支持小程序/App）。</text>
            </view>
            <wd-icon name="arrow-right" size="16px" color="#94a3b8" />
          </view>

          <view class="flex mt-2">
            <wd-button type="neutral" plain class="flex-1" @click="handleNavigateBack">uni.navigateBack 退栈返回</wd-button>
            <wd-button type="error" class="flex-1 ml-2" @click="handleReLaunch">uni.reLaunch 重启应用</wd-button>
          </view>

        </view>
      </view>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.routing-api-page {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.api-card-panel {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 28rpx;
}

.share-desc-info {
  font-size: 21rpx;
  line-height: 1.5;
}

.router-stack-list {
  display: flex;
  flex-direction: column;
}

.stack-item-row {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #f8fafc;
}

.stack-depth-badge {
  width: 50rpx;
  height: 50rpx;
  background: #e2e8f0;
  border-radius: 50%;
  font-size: 20rpx;
  color: var(--app-ink);
}

.stack-meta {
  display: flex;
  flex-direction: column;
}

.stack-path {
  font-size: 20rpx;
}

.stack-query {
  font-size: 15rpx;
  margin-top: 4rpx;
}

.form-row {
  display: flex;
  flex-direction: column;
}

.custom-native-input {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  font-size: 20rpx;
  color: var(--app-ink);
}

.routing-action-card {
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    background: #f1f5f9;
    border-color: var(--app-brand);
  }
}

.action-title {
  font-size: 21rpx;
}

.action-desc {
  font-size: 16rpx;
  color: var(--app-muted);
  margin-top: 6rpx;
  line-height: 1.4;
}

.refresh-stack-btn {
  font-size: 19rpx;
  cursor: pointer;
  
  &:active {
    opacity: 0.8;
  }
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-brand { color: var(--app-brand); }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.p-3 { padding: 24rpx; }
.mb-2 { margin-bottom: 16rpx; }
.mb-3 { margin-bottom: 24rpx; }
</style>
