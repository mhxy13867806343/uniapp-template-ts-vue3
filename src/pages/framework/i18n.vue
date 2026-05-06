<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { localeOptions, type AppLocale } from '@/locales'
import { useI18n } from '@/hooks/useI18n'

const { locale, setLocale, t } = useI18n()

function chooseLocale(value: AppLocale) {
  setLocale(value)
  uni.showToast({
    title: value === 'zh-CN' ? '已切换中文' : 'Switched to English',
    icon: 'none'
  })
}
</script>

<template>
  <PageShell title="多语言" description="内置轻量 i18n 示例，后续可以平滑替换为 vue-i18n。">
    <view class="grid gap-3">
      <view class="panel">
        <view class="font-700 mb-3">语言选择</view>
        <wd-cell-group border>
          <wd-cell
            v-for="item in localeOptions"
            :key="item.value"
            :title="item.label"
            :value="locale === item.value ? '当前' : ''"
            clickable
            is-link
            @click="chooseLocale(item.value)"
          />
        </wd-cell-group>
      </view>

      <view class="panel">
        <view class="font-700">{{ t('app.name') }}</view>
        <view class="muted-text mt-2 leading-6">{{ t('app.slogan') }}</view>
        <view class="i18n-grid">
          <view>{{ t('auth.login') }}</view>
          <view>{{ t('auth.register') }}</view>
          <view>{{ t('framework.plugins') }}</view>
          <view>{{ t('framework.styles') }}</view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.i18n-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 24rpx;
}

.i18n-grid > view {
  border-radius: 10rpx;
  background: #f6f8fb;
  color: var(--app-ink);
  font-size: 26rpx;
  padding: 18rpx;
}
</style>
