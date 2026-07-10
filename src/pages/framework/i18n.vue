<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { localeOptions, type AppLocale } from '@/locales'
import { useI18n } from '@/hooks/useI18n'

const { locale, setLocale, t } = useI18n()
const toast = useToast('i18n-toast')

// Sandbox states
const inputUsername = ref('开发体验官')
const rawAmount = ref(8848.5)

// Compute Localized Currency Format
const localizedCurrency = computed(() => {
  if (locale.value === 'zh-CN') {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(rawAmount.value)
  } else {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rawAmount.value)
  }
})

// Compute Localized Date Format
const localizedDate = computed(() => {
  const date = new Date('2026-07-10T12:00:00')
  if (locale.value === 'zh-CN') {
    return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'full', timeStyle: 'short' }).format(date)
  } else {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(date)
  }
})

function chooseLocale(value: AppLocale) {
  setLocale(value)
  toast.success(value === 'zh-CN' ? '已成功切换为：中文' : 'Switched Language to: English')
}
</script>

<template>
  <PageShell title="多语言 i18n 体系" description="模版内置轻量型 i18n 多语言管理器，可通过响应式 hook 一键在全局环境切换国际化翻译词条。">
    <view class="i18n-framework-page">
      <wd-toast selector="i18n-toast" />

      <!-- 1. Language selector list -->
      <view class="panel-section">
        <view class="section-head font-bold mb-2">
          <text>🌐 选择语言环境 (Switch Locale)</text>
        </view>
        <view class="share-desc-info text-muted mb-3">
          点击下方条目切换当前的语言包上下文，下面的文本与组件提示词将同步翻译改变：
        </view>

        <wd-cell-group border class="locale-selector-group">
          <wd-cell
            v-for="item in localeOptions"
            :key="item.value"
            :title="item.label"
            clickable
            @click="chooseLocale(item.value)"
          >
            <template #value>
              <wd-tag v-if="locale === item.value" type="primary">Active</wd-tag>
              <text v-else class="text-muted">点击切换</text>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <!-- 2. Interpolation sandbox playground -->
      <view class="panel-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>🧪 动态文本插值翻译沙盒 (Translation Sandbox)</text>
        </view>
        
        <view class="form-row">
          <text class="row-label font-bold">键入您的用户名</text>
          <input v-model="inputUsername" placeholder="请输入名字..." class="custom-native-input mt-1" />
        </view>

        <!-- Simulated Welcome Card -->
        <view class="welcome-preview-card mt-3">
          <view class="font-bold welcome-title">
            {{ locale === 'zh-CN' ? `👋 欢迎您，${inputUsername}！` : `👋 Welcome back, ${inputUsername}!` }}
          </view>
          <view class="welcome-desc mt-1">
            {{ locale === 'zh-CN' ? '系统已自动识别您的多语言身份并完成排版。' : 'The system has dynamically parsed your active profile translation.' }}
          </view>
        </view>
      </view>

      <!-- 3. Localized date and Currency parser -->
      <view class="panel-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>💶 本地化货币与长日期格式化 (Intl Parser)</text>
        </view>
        <view class="share-desc-info text-muted mb-3">
          除了基础词汇外，模版对金额符号、千分位、以及中英文日期排版习惯进行了自适应调整：
        </view>

        <view class="local-parser-grid flex-column">
          <view class="parser-row flex justify-between p-2 mb-2">
            <text class="row-label font-bold">测试商品价格</text>
            <text class="row-val font-bold text-brand">{{ localizedCurrency }}</text>
          </view>

          <view class="parser-row flex justify-between p-2">
            <text class="row-label font-bold">发布会时间线</text>
            <text class="row-val text-ink" style="font-size: 19rpx;">{{ localizedDate }}</text>
          </view>
        </view>
      </view>

      <!-- 4. Word translations grid -->
      <view class="panel-section mt-3">
        <view class="section-head font-bold mb-2">
          <text>📖 全局字典互译对照表</text>
        </view>
        <view class="i18n-grid">
          <view class="flex-column p-2">
            <text class="dict-key text-muted">app.name</text>
            <text class="dict-val font-bold text-ink mt-1">{{ t('app.name') }}</text>
          </view>
          <view class="flex-column p-2">
            <text class="dict-key text-muted">app.slogan</text>
            <text class="dict-val font-bold text-ink mt-1">{{ t('app.slogan') }}</text>
          </view>
          <view class="flex-column p-2">
            <text class="dict-key text-muted">auth.login</text>
            <text class="dict-val font-bold text-ink mt-1">{{ t('auth.login') }}</text>
          </view>
          <view class="flex-column p-2">
            <text class="dict-key text-muted">auth.register</text>
            <text class="dict-val font-bold text-ink mt-1">{{ t('auth.register') }}</text>
          </view>
        </view>
      </view>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.i18n-framework-page {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.panel-section {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 28rpx;
}

.share-desc-info {
  font-size: 21rpx;
  line-height: 1.5;
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

.welcome-preview-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1rpx solid #bfdbfe;
  border-radius: 16rpx;
  padding: 24rpx;
}

.welcome-title {
  font-size: 24rpx;
  color: #1e40af;
}

.welcome-desc {
  font-size: 17rpx;
  color: #1e3a8a;
  opacity: 0.8;
}

.local-parser-grid {
  display: flex;
  flex-direction: column;
}

.parser-row {
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #f8fafc;
}

.i18n-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.i18n-grid > view {
  border-radius: 12rpx;
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
}

.dict-key {
  font-family: monospace;
  font-size: 15rpx;
}

.dict-val {
  font-size: 21rpx;
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
.mt-3 { margin-top: 24rpx; }
.mb-2 { margin-bottom: 16rpx; }
.mb-3 { margin-bottom: 24rpx; }
.p-2 { padding: 16rpx; }
</style>
