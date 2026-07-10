<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('author-toast')

const authorInfo = {
  name: '方家煜 (Fang Jiayu)',
  bio: '资深全端研发工程师，UniApp & Vue 生态热心贡献者。喜欢倒腾各种好玩、实用的高颜值跨端模板。',
  juejin: 'https://juejin.cn/user/1310273588955581',
  gitee: 'https://gitee.com/fangjiayu/',
  github: 'https://github.com/mhxy13867806343'
}

function handleCopy(url: string, platform: string) {
  uni.setClipboardData({
    data: url,
    success: () => {
      toast.success(`${platform} 链接已复制到剪贴板`)
    }
  })
}
</script>

<template>
  <PageShell title="关于作者" description="作者的掘金主页、Gitee 开源主页和 GitHub 仓库，欢迎 Star 和交流！">
    <view class="author-page">
      <wd-toast selector="author-toast" />

      <!-- Profile Avatar & Card -->
      <view class="author-profile-card flex-column items-center">
        <view class="author-avatar-shadow">
          <view class="author-avatar-img">👨‍💻</view>
        </view>
        <view class="author-name font-bold text-ink mt-3">{{ authorInfo.name }}</view>
        <view class="author-tagline mt-1">Full Stack Developer</view>
        <view class="author-bio mt-3">{{ authorInfo.bio }}</view>
      </view>

      <!-- Platform Links List -->
      <view class="links-panel mt-3">
        <view class="panel-title font-bold text-ink mb-3">作者主页 & 开源仓库</view>

        <view class="platform-link-item flex items-center justify-between">
          <view class="platform-info flex items-center">
            <text class="platform-icon juejin-icon">🔥</text>
            <view class="platform-meta ml-2">
              <text class="platform-name font-bold text-ink">稀土掘金主页</text>
              <text class="platform-url mt-1">{{ authorInfo.juejin }}</text>
            </view>
          </view>
          <wd-button size="small" type="primary" plain @click="handleCopy(authorInfo.juejin, '掘金主页')">复制链接</wd-button>
        </view>

        <view class="platform-link-item flex items-center justify-between mt-3">
          <view class="platform-info flex items-center">
            <text class="platform-icon gitee-icon">🛑</text>
            <view class="platform-meta ml-2">
              <text class="platform-name font-bold text-ink">Gitee 开源空间</text>
              <text class="platform-url mt-1">{{ authorInfo.gitee }}</text>
            </view>
          </view>
          <wd-button size="small" type="warning" plain @click="handleCopy(authorInfo.gitee, 'Gitee空间')">复制链接</wd-button>
        </view>

        <view class="platform-link-item flex items-center justify-between mt-3">
          <view class="platform-info flex items-center">
            <text class="platform-icon github-icon">🐙</text>
            <view class="platform-meta ml-2">
              <text class="platform-name font-bold text-ink">GitHub 个人中心</text>
              <text class="platform-url mt-1">{{ authorInfo.github }}</text>
            </view>
          </view>
          <wd-button size="small" type="neutral" plain @click="handleCopy(authorInfo.github, 'GitHub主页')">复制链接</wd-button>
        </view>
      </view>

      <!-- Footer greetings -->
      <view class="footer-tip text-center mt-4">
        💡 觉得模板好用，欢迎点击复制前往给个 Star 鼓励一下作者！
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.author-page {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* Profile Card Styling */
.author-profile-card {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.01);
  text-align: center;
}

.author-avatar-shadow {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #eff6ff;
  border: 4rpx solid var(--app-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 20rpx rgba(37, 99, 235, 0.15);
}

.author-avatar-img {
  font-size: 70rpx;
}

.author-name {
  font-size: 32rpx;
}

.author-tagline {
  font-size: 21rpx;
  color: var(--app-brand);
  font-weight: 800;
}

.author-bio {
  font-size: 23rpx;
  color: var(--app-muted);
  line-height: 1.6;
}

/* Links panel */
.links-panel {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.01);
}

.panel-title {
  font-size: 26rpx;
  border-left: 6rpx solid var(--app-brand);
  padding-left: 16rpx;
}

.platform-link-item {
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 24rpx;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.platform-info {
  min-width: 0;
  flex: 1;
}

.platform-icon {
  font-size: 44rpx;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}

.juejin-icon { background: #eff6ff; color: #1e88e5; }
.gitee-icon { background: #fef2f2; color: #dc2626; }
.github-icon { background: #f8fafc; color: #0f172a; }

.platform-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.platform-name {
  font-size: 22rpx;
}

.platform-url {
  font-size: 16rpx;
  color: var(--app-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 280rpx;
}

.footer-tip {
  font-size: 19rpx;
  color: var(--app-muted);
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-center { text-align: center; }
.text-ink { color: var(--app-ink); }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-4 { margin-top: 32rpx; }
</style>
