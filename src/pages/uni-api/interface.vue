<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('interface-toast')

// Title & Color Form
const navTitle = ref('导航栏标题测试')
const navColorOption = ref('#3b82f6') // default blue
const tabBadgeText = ref('99+')

// Actions
function triggerToast() {
  uni.showToast({
    title: '触发消息提示成功',
    icon: 'success',
    duration: 2000
  })
}

function triggerLoading() {
  uni.showLoading({
    title: '数据加载中...'
  })
  setTimeout(() => {
    uni.hideLoading()
    toast.success('加载状态已关闭')
  }, 2000)
}

function triggerModal() {
  uni.showModal({
    title: '系统警告',
    content: '这是一个使用 uni.showModal 调用出来的标准跨端对话框确认演示。',
    confirmColor: '#ef4444',
    success: (res) => {
      if (res.confirm) {
        toast.success('您点击了确认')
      } else {
        toast.warning('您点击了取消')
      }
    }
  })
}

function triggerActionSheet() {
  uni.showActionSheet({
    itemList: ['保存图片至相册', '转发分享给微信好友', '收藏该资源卡片', '投诉反馈违规'],
    success: (res) => {
      const items = ['保存图片至相册', '转发分享给微信好友', '收藏该资源卡片', '投诉反馈违规']
      toast.success(`您选中了选项: ${items[res.tapIndex]}`)
    }
  })
}

function setNavTitle() {
  if (!navTitle.value.trim()) {
    toast.warning('请输入标题文字')
    return
  }
  uni.setNavigationBarTitle({
    title: navTitle.value.trim()
  })
  toast.success('设置成功，看最上方顶部标题！')
}

function changeNavColor(color: string) {
  navColorOption.value = color
  uni.setNavigationBarColor({
    frontColor: '#ffffff', // must be #ffffff or #000000
    backgroundColor: color,
    animation: {
      duration: 300,
      timingFunc: 'easeIn'
    }
  })
  toast.success('设置导航栏背景色成功！')
}

function showNavLoading() {
  uni.showNavigationBarLoading()
  setTimeout(() => {
    uni.hideNavigationBarLoading()
  }, 3000)
  toast.success('开启标题栏加载圈（3秒后自动关闭）')
}

function setBadge() {
  uni.setTabBarBadge({
    index: 0,
    text: tabBadgeText.value
  })
  toast.success('已为第 1 个 Tab 增加气泡数量')
}

function removeBadge() {
  uni.removeTabBarBadge({
    index: 0
  })
  toast.success('已清除 Tab 气泡')
}

function showRedDot() {
  uni.showTabBarRedDot({
    index: 1
  })
  toast.success('已在第 2 个 Tab 开启小红点')
}

function hideRedDot() {
  uni.hideTabBarRedDot({
    index: 1
  })
  toast.success('已隐藏 Tab 小红点')
}

function scrollToBottom() {
  uni.pageScrollTo({
    scrollTop: 9999,
    duration: 300
  })
  toast.success('平滑滚动到页面底部')
}

function scrollToTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  })
  toast.success('平滑滚动到页面顶部')
}
</script>

<template>
  <PageShell title="界面交互控制 APIs" description="UniApp 跨端视图交互与控制，包含弹窗反馈、导航栏动态设置、TabBar 微标控制以及页面滚动定位。">
    <view class="interface-api-page">
      <wd-toast selector="interface-toast" />

      <!-- 1. Interactive Feedback -->
      <view class="api-card-panel">
        <view class="panel-header font-bold text-ink mb-2">
          <text>💬 1. 交互反馈 API (Toast / Loading / Modal)</text>
        </view>
        <view class="api-actions-grid flex-wrap gap-2">
          <wd-button type="primary" size="medium" @click="triggerToast">showToast 消息提示</wd-button>
          <wd-button type="success" size="medium" @click="triggerLoading">showLoading 加载状态</wd-button>
          <wd-button type="warning" size="medium" @click="triggerModal">showModal 确认弹窗</wd-button>
          <wd-button type="info" size="medium" @click="triggerActionSheet">showActionSheet 菜单选择</wd-button>
        </view>
      </view>

      <!-- 2. Navigation Bar customization -->
      <view class="api-card-panel mt-3">
        <view class="panel-header font-bold text-ink mb-2">
          <text>导航栏动态定制 API (setNavigationBar)</text>
        </view>
        
        <view class="form-row">
          <text class="row-label font-bold">修改导航栏标题文字</text>
          <view class="flex mt-1">
            <input v-model="navTitle" placeholder="请输入标题文字" class="custom-native-input flex-1" />
            <wd-button type="primary" class="ml-2" @click="setNavTitle">确认修改</wd-button>
          </view>
        </view>

        <view class="form-row mt-3">
          <text class="row-label font-bold">改变导航栏背景色</text>
          <view class="preset-items-picker mt-1 flex">
            <view class="preset-color-cell" style="background-color: #3b82f6;" @click="changeNavColor('#3b82f6')"></view>
            <view class="preset-color-cell ml-2" style="background-color: #22c55e;" @click="changeNavColor('#22c55e')"></view>
            <view class="preset-color-cell ml-2" style="background-color: #ef4444;" @click="changeNavColor('#ef4444')"></view>
            <view class="preset-color-cell ml-2" style="background-color: #0f172a;" @click="changeNavColor('#0f172a')"></view>
          </view>
        </view>

        <view class="form-row mt-3">
          <wd-button type="primary" plain block @click="showNavLoading">开启标题栏加载状态 (showNavigationBarLoading)</wd-button>
        </view>
      </view>

      <!-- 3. TabBar badge controls -->
      <view class="api-card-panel mt-3">
        <view class="panel-header font-bold text-ink mb-2">
          <text>🗂️ 3. TabBar 角标控制 API (setTabBarBadge)</text>
        </view>
        <view class="share-desc-info text-muted mb-2">
          动态改变页面底栏 Tab 的红点或数字提示（注：此操作仅在包含 TabBar 的根页面下展示才有效）：
        </view>
        
        <view class="flex items-center">
          <input v-model="tabBadgeText" placeholder="角标内容，如 99+" class="custom-native-input flex-1" />
          <wd-button type="primary" size="small" class="ml-2" @click="setBadge">设置角标</wd-button>
          <wd-button type="error" size="small" class="ml-2" @click="removeBadge">清除角标</wd-button>
        </view>

        <view class="api-actions-grid gap-2 mt-2 flex">
          <wd-button type="primary" plain size="medium" class="flex-1" @click="showRedDot">开启Tab红点</wd-button>
          <wd-button type="error" plain size="medium" class="flex-1 ml-2" @click="hideRedDot">关闭Tab红点</wd-button>
        </view>
      </view>

      <!-- 4. Scroll APIs -->
      <view class="api-card-panel mt-3">
        <view class="panel-header font-bold text-ink mb-2">
          <text>📜 4. 页面平滑滚动 API (pageScrollTo)</text>
        </view>
        <view class="api-actions-grid gap-2 flex">
          <wd-button type="primary" plain class="flex-1" @click="scrollToBottom">一键滚动到页面最底部</wd-button>
          <wd-button type="primary" plain class="flex-1 ml-2" @click="scrollToTop">一键滚动到最顶部</wd-button>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.interface-api-page {
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

.api-actions-grid {
  display: flex;
  flex-direction: row;
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

.preset-items-picker {
  display: flex;
  gap: 12rpx;
}

.preset-color-cell {
  width: 54rpx;
  height: 54rpx;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.1);
  
  &:active {
    opacity: 0.8;
  }
}

.gap-2 {
  gap: 16rpx;
}

.flex { display: flex; }
.flex-wrap { display: flex; flex-wrap: wrap; }
.flex-column { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.font-bold { font-weight: 800; }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mb-2 { margin-bottom: 16rpx; }
.mb-3 { margin-bottom: 24rpx; }
</style>
