<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { useUserStore } from '@/store'
import { useI18n } from '@/hooks/useI18n'
import { localeOptions } from '@/locales'
import { navigateTo } from '@/utils/router'

const toast = useToast('settings-toast')
const userStore = useUserStore()

// Localization
const { locale, setLocale } = useI18n()
const activeLocale = ref(locale.value)

watch(() => locale.value, (newVal) => {
  activeLocale.value = newVal
})

const currentLocaleLabel = computed(() => {
  const found = localeOptions.find(item => item.value === locale.value)
  return found ? found.label : '简体中文'
})

function onLocaleConfirm({ value }: any) {
  setLocale(value)
  toast.success(`切换语言成功: ${value === 'zh-CN' ? '中文' : 'English'}`)
}

// Slider Font size adjustment
const fontSizeScale = ref(100) // 80% to 140%
const fontSizeClass = computed(() => {
  if (fontSizeScale.value < 90) return 'font-small'
  if (fontSizeScale.value > 120) return 'font-huge'
  if (fontSizeScale.value > 105) return 'font-large'
  return 'font-normal'
})

// Cache clean simulation
const cacheSize = ref('128.4 MB')
const cleaning = ref(false)

function cleanCache() {
  if (cacheSize.value === '0.0 MB') {
    toast.warning('无需重复清理')
    return
  }
  cleaning.value = true
  toast.loading('正在扫描深度清理中...')
  setTimeout(() => {
    cleaning.value = false
    cacheSize.value = '0.0 MB'
    toast.success('缓存数据已全部清除')
  }, 1600)
}

// Switches
const pushSound = ref(true)
const doNotDisturb = ref(false)

// Actions
function changePassword() {
  toast.warning('演示通道已开启，请前往绑定手机验证')
}

function closeAccount() {
  uni.showModal({
    title: '安全警告',
    content: '注销后您的所有开发演练状态和缓存都会清空，确定要注销此体验账号吗？',
    confirmColor: '#ef4444',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        toast.success('账号注销成功')
        setTimeout(() => {
          uni.switchTab({ url: '/pages/mine/index' })
        }, 500)
      }
    }
  })
}

function handleLogout() {
  uni.showModal({
    title: '退出确认',
    content: '确定要安全退出当前登录身份吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        toast.success('安全退出成功')
        setTimeout(() => {
          uni.switchTab({ url: '/pages/mine/index' })
        }, 500)
      }
    }
  })
}

function showAbout() {
  uni.showToast({
    title: '当前版本: 0.1.0 (PRO)',
    icon: 'none'
  })
}
</script>

<template>
  <PageShell title="应用设置" description="支持账号安全验证、多语言一键切换、系统缓存清理、以及界面显示设置。">
    <view :class="['settings-page', fontSizeClass]">
      <wd-toast selector="settings-toast" />

      <!-- Category 1: Account Security -->
      <view class="settings-group-title">账号与安全</view>
      <wd-cell-group border>
        <wd-cell title="绑定手机号" :value="userStore.profile?.phone || '未绑定'" />
        <wd-cell title="修改密码" is-link clickable @click="changePassword" />
        <wd-cell title="账号注销" is-link clickable @click="closeAccount" />
      </wd-cell-group>

      <!-- Category 2: General settings -->
      <view class="settings-group-title mt-3">通用设置</view>
      <wd-cell-group border>
        <!-- Language Select Picker -->
        <wd-picker
          v-model="activeLocale"
          :columns="localeOptions"
          label-key="label"
          value-key="value"
          title="选择系统语言"
          @confirm="onLocaleConfirm"
        >
          <wd-cell title="多语言切换" is-link :value="currentLocaleLabel" />
        </wd-picker>

        <!-- Cache Clean -->
        <wd-cell title="清除系统缓存" :value="cacheSize" is-link clickable @click="cleanCache" />

        <!-- Font size scaling adjustment cell -->
        <view class="custom-slider-cell">
          <view class="slider-title-row flex justify-between">
            <text class="slider-title">调整字体大小</text>
            <text class="slider-val">{{ fontSizeScale }}%</text>
          </view>
          <view class="slider-wrap mt-2">
            <slider
              v-model="fontSizeScale"
              :value="fontSizeScale"
              :min="80"
              :max="140"
              :step="10"
              activeColor="var(--app-brand)"
              block-size="20"
              @change="(e: any) => fontSizeScale = e.detail.value"
            />
          </view>
        </view>
      </wd-cell-group>

      <!-- Category 3: Sounds and Notifications -->
      <view class="settings-group-title mt-3">通知与声音</view>
      <wd-cell-group border>
        <view class="switch-cell flex items-center justify-between">
          <text class="switch-label">新消息声音提示</text>
          <wd-switch v-model="pushSound" />
        </view>
        <view class="switch-cell flex items-center justify-between">
          <text class="switch-label">勿扰模式 (DND)</text>
          <wd-switch v-model="doNotDisturb" />
        </view>
      </wd-cell-group>

      <!-- Category 4: About & Legal Documents -->
      <view class="settings-group-title mt-3">关于与协议</view>
      <wd-cell-group border>
        <wd-cell title="帮助中心" is-link clickable @click="navigateTo('/pages/other/help')" />
        <wd-cell title="隐私协议" is-link clickable @click="navigateTo('/pages/other/privacy')" />
        <wd-cell title="关于本应用" value="v0.1.0" is-link clickable @click="showAbout" />
      </wd-cell-group>

      <!-- Logout Button -->
      <view class="logout-btn-wrap mt-4" v-if="userStore.isLogin">
        <wd-button type="error" block @click="handleLogout">退出当前账号</wd-button>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.settings-page {
  padding-bottom: 80rpx;
  transition: font-size 0.2s ease;
}

/* Dynamic font sizes configurations */
.font-small {
  --cell-font-size: 17rpx;
  --title-font-size: 19rpx;
  font-size: 16rpx;
}
.font-normal {
  --cell-font-size: 21rpx;
  --title-font-size: 23rpx;
  font-size: 20rpx;
}
.font-large {
  --cell-font-size: 24rpx;
  --title-font-size: 26rpx;
  font-size: 23rpx;
}
.font-huge {
  --cell-font-size: 28rpx;
  --title-font-size: 30rpx;
  font-size: 26rpx;
}

.settings-group-title {
  font-size: var(--title-font-size, 23rpx);
  color: var(--app-muted);
  padding: 16rpx 24rpx 8rpx;
  font-weight: 700;
}

/* Custom picker & slider padding */
.custom-slider-cell {
  background: #fff;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid var(--app-line);
}

.slider-title-row {
  display: flex;
  justify-content: space-between;
}

.slider-title {
  font-size: var(--cell-font-size, 21rpx);
  color: var(--app-ink);
}

.slider-val {
  font-size: var(--cell-font-size, 21rpx);
  color: var(--app-brand);
  font-weight: 800;
}

.slider-wrap {
  width: 100%;
}

/* Switch styling cells */
.switch-cell {
  background: #fff;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid var(--app-line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:first-child {
    border-top: none;
  }
}

.switch-label {
  font-size: var(--cell-font-size, 21rpx);
  color: var(--app-ink);
}

/* Logout wrap */
.logout-btn-wrap {
  padding: 0 32rpx;
}

/* Overriding wot design default cell fonts size for scaling demonstration */
:deep(.wd-cell__title) {
  font-size: var(--cell-font-size, 21rpx) !important;
}
:deep(.wd-cell__value) {
  font-size: var(--cell-font-size, 21rpx) !important;
}

.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-4 { margin-top: 32rpx; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
</style>
