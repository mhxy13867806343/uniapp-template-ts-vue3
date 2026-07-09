<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const currentUpdateTime = '2026年7月10日'
const currentEffectiveTime = '2026年7月10日'

const sections = [
  {
    title: '一、 我们如何收集您的个人信息',
    content: '在您使用本应用的登录注册、意见反馈等功能时，我们可能会收集您的基本信息：如手机号、设备型号、系统版本以及网络状态等。对于特定功能演示（如GPS打卡），在获得您的明确授权后，我们可能会收集您的位置信息。'
  },
  {
    title: '二、 我们如何使用收集到的信息',
    content: '我们收集到的信息将仅被用于：(1) 提供、保障及维护应用基础服务的正常运转；(2) 优化本套模板的交互反馈与排障诊断。我们绝不会将您的个人数据用于除上述目的之外的商业广告派发或未经授权的第三方转让。'
  },
  {
    title: '三、 第三方 SDK 服务集成说明',
    content: '为了提供定位、微信小程序分享等核心能力，本应用可能嵌入了部分合作方的第三方 SDK 服务（如微信分享 SDK、微信定位服务）。我们仅会分享为您提供特定功能所必需的信息，并已签署严格的数据安全与保密协议。'
  },
  {
    title: '四、 您的数据权利与保护机制',
    content: '我们重视您对个人信息的关注，提供了数据查看、注销账户以及取消授权的对应通道。所有的敏感交易和密码输入均进行了端侧的不可逆哈希加密，并通过 HTTPS 安全通道传输，全面保障数据在存储和流转中的绝对安全。'
  },
  {
    title: '五、 隐私协议政策的变更与生效',
    content: '随着模板功能的升级和法律法规的更新，我们可能会不定期地对本协议进行修改。当本协议内容发生重大变更时，我们会通过在首页或重要页面弹出通知的方式提示您重新查阅并确认。'
  }
]
</script>

<template>
  <PageShell title="隐私协议" description="本应用高度重视用户隐私保护，特此公示本隐私权保护声明政策详情。">
    <view class="privacy-policy-page">
      
      <!-- Headline summary card -->
      <view class="policy-hero-card">
        <view class="hero-title">隐私权保护声明政策</view>
        <view class="hero-dates mt-2">
          <view class="date-row">更新日期：{{ currentUpdateTime }}</view>
          <view class="date-row mt-1">生效日期：{{ currentEffectiveTime }}</view>
        </view>
      </view>

      <!-- Protocol sections -->
      <view class="policy-sections-list mt-3">
        <view
          v-for="sec in sections"
          :key="sec.title"
          class="policy-block"
        >
          <view class="block-title">{{ sec.title }}</view>
          <view class="block-content mt-2">{{ sec.content }}</view>
        </view>
      </view>

      <!-- Secure disclaimer -->
      <view class="disclaimer-info mt-4">
        <text class="lock-icon">🔒</text>
        <text class="disclaimer-txt">
          本模板由团队开源维护，我们将全力采用业界领先的数据加密和容器安全手段，保护每一名测试用户的基本数据隐私权安全。
        </text>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.privacy-policy-page {
  padding-bottom: 80rpx;
}

.policy-hero-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 16rpx;
  padding: 36rpx;
  color: #fff;
  border: 1rpx solid #334155;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.hero-title {
  font-size: 28rpx;
  font-weight: 900;
  color: #f8fafc;
}

.hero-dates {
  display: flex;
  flex-direction: column;
}

.date-row {
  font-size: 18rpx;
  color: #94a3b8;
}

/* Document content details */
.policy-sections-list {
  display: grid;
  gap: 28rpx;
}

.policy-block {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 24rpx;
}

.block-title {
  font-size: 22rpx;
  font-weight: 850;
  color: var(--app-ink);
  border-bottom: 2rpx solid var(--app-line);
  padding-bottom: 12rpx;
}

.block-content {
  font-size: 19rpx;
  color: var(--app-muted);
  line-height: 1.5;
  text-align: justify;
}

/* Disclaimer badge at bottom */
.disclaimer-info {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  background: #f1f5f9;
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1rpx solid var(--app-line);
}

.lock-icon {
  font-size: 28rpx;
}

.disclaimer-txt {
  font-size: 18rpx;
  color: var(--app-muted);
  line-height: 1.4;
}

.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-4 { margin-top: 32rpx; }
.font-bold { font-weight: 800; }
</style>
