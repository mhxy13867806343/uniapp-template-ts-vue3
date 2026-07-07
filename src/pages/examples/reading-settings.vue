<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('settings-toast')

// Reading Setting States
const fontSize = ref(18) // font-size in px (14 to 28)
const lineSpacings = [
  { label: '紧凑', value: 1.4 },
  { label: '标准', value: 1.6 },
  { label: '宽松', value: 1.8 },
  { label: '极宽', value: 2.0 }
]
const activeLineSpacing = ref(1.6)

const fontFamilies = [
  { name: '默认系统体', value: 'system-ui' },
  { name: '优雅衬线体', value: 'Georgia, serif' },
  { name: '现代等宽体', value: 'Courier New, monospace' }
]
const activeFontFamily = ref('system-ui')

interface ThemePreset {
  id: string
  name: string
  bg: string
  text: string
  border: string
}

const themes: ThemePreset[] = [
  { id: 'white', name: '极简白', bg: '#ffffff', text: '#1e293b', border: '#e2e8f0' },
  { id: 'sepia', name: '护眼黄', bg: '#f4eccd', text: '#451a03', border: '#eab308' },
  { id: 'mint', name: '清新绿', bg: '#ecfdf5', text: '#064e3b', border: '#10b981' },
  { id: 'slate', name: '商务灰', bg: '#f1f5f9', text: '#0f172a', border: '#94a3b8' },
  { id: 'dark', name: '深色夜', bg: '#0f172a', text: '#cbd5e1', border: '#334155' }
]
const activeThemeId = ref('sepia')

// Current active style details
const currentTheme = computed(() => {
  return themes.find(t => t.id === activeThemeId.value) || themes[1]
})

// Modal visibility
const showSettings = ref(false)

function openSettings() {
  showSettings.value = true
}

function resetSettings() {
  fontSize.value = 18
  activeLineSpacing.value = 1.6
  activeFontFamily.value = 'system-ui'
  activeThemeId.value = 'sepia'
  toast.success('已恢复阅读默认设置')
}

// Adjust font size helpers
function changeFontSize(amount: number) {
  const target = fontSize.value + amount
  if (target >= 14 && target <= 28) {
    fontSize.value = target
  }
}
</script>

<template>
  <PageShell title="阅读偏好设置" description="底部控制面板包含字号滑动微调、多套主题实时响应以及行高字体即时切换。">
    <view class="reading-settings-page">
      <wd-toast selector="settings-toast" />

      <!-- Reader Viewport (Instantly Styled) -->
      <view
        class="reader-viewport"
        :style="{
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
          fontFamily: activeFontFamily,
          lineHeight: activeLineSpacing
        }"
      >
        <view class="reader-header">
          <text class="article-category">软件开发与美学</text>
          <text class="article-title">第四章：写出有“空气感”的代码</text>
        </view>

        <view class="reader-body" :style="{ fontSize: fontSize + 'px' }">
          <view class="paragraph">
            好的代码，就像是一间摆放得体的艺术长廊，不仅需要架构上的严谨度，还需要阅读上的“空气感”。所谓空气感，指的是代码缩进合理、空行适度，以及变量命名具有自解释性。当你一眼望去，能够清晰地感受到逻辑在其中的流淌。
          </view>
          <view class="paragraph">
            正如我们在进行 Web 界面设计时一样，适度的留白与间距（Gaps）能够给用户的视线提供喘息的余地。文字的大小、对比度和排版高度，直接决定了用户的阅读留存率。
          </view>
          <view class="paragraph">
            在本页面中，我们通过响应式的数据联动，将底部的弹出菜单（Popup）与背后的阅读器渲染器进行双向绑定。滑动下方的滑块，或是任意点选一套调色 presets，便可获得无需刷新的实时渲染体验。
          </view>
        </view>

        <view class="reader-footer">
          <text class="page-num">1 / 1 页 · 384 字</text>
        </view>
      </view>

      <!-- Float Control Panel trigger -->
      <view class="floating-trigger-row">
        <wd-button type="primary" size="medium" @click="openSettings">
          <view class="btn-inner">
            <wd-icon name="setting" size="18px" />
            <text class="ml-1">个性化排版设置</text>
          </view>
        </wd-button>
      </view>

      <!-- Interactive Typography & Theme Settings Bottom Sheet -->
      <wd-popup
        v-model="showSettings"
        position="bottom"
        safe-area-inset-bottom
        root-portal
        custom-class="settings-sheet-popup"
        :z-index="1200"
      >
        <view class="settings-sheet-container">
          <view class="sheet-header">
            <text class="sheet-title">阅读偏好设置</text>
            <text class="reset-link" @click="resetSettings">恢复默认</text>
          </view>

          <scroll-view scroll-y class="sheet-body">
            <!-- Themes Row -->
            <view class="setting-section">
              <view class="section-label">阅读底色</view>
              <view class="themes-row">
                <view
                  v-for="t in themes"
                  :key="t.id"
                  :class="['theme-picker-circle', { active: activeThemeId === t.id }]"
                  :style="{ backgroundColor: t.bg, borderColor: activeThemeId === t.id ? t.border : '#e2e8f0' }"
                  @click="activeThemeId = t.id"
                >
                  <text class="theme-picker-indicator" :style="{ color: t.text }">Aa</text>
                </view>
              </view>
              <view class="theme-selected-name">已选模式：{{ currentTheme.name }}</view>
            </view>

            <!-- Font Size adjustment -->
            <view class="setting-section">
              <view class="section-label">字体大小</view>
              <view class="font-size-adjuster">
                <view
                  :class="['size-btn', { disabled: fontSize <= 14 }]"
                  @click="changeFontSize(-1)"
                >
                  A-
                </view>
                <view class="size-display">{{ fontSize }}px</view>
                <view
                  :class="['size-btn', { disabled: fontSize >= 28 }]"
                  @click="changeFontSize(1)"
                >
                  A+
                </view>
                <!-- Native Slider styled -->
                <slider
                  v-model="fontSize"
                  :min="14"
                  :max="28"
                  :step="1"
                  active-color="#1e88e5"
                  block-size="20"
                  class="font-slider"
                  @change="(e: any) => fontSize = e.detail.value"
                />
              </view>
            </view>

            <!-- Line height selector -->
            <view class="setting-section">
              <view class="section-label">行间间距</view>
              <view class="spacing-grid">
                <view
                  v-for="spacing in lineSpacings"
                  :key="spacing.value"
                  :class="['spacing-btn', { active: activeLineSpacing === spacing.value }]"
                  @click="activeLineSpacing = spacing.value"
                >
                  {{ spacing.label }} ({{ spacing.value }})
                </view>
              </view>
            </view>

            <!-- Font selector -->
            <view class="setting-section">
              <view class="section-label">字体家族</view>
              <view class="fonts-list">
                <view
                  v-for="font in fontFamilies"
                  :key="font.value"
                  :class="['font-family-btn', { active: activeFontFamily === font.value }]"
                  @click="activeFontFamily = font.value"
                >
                  {{ font.name }}
                </view>
              </view>
            </view>
          </scroll-view>

          <!-- Apply / Done button -->
          <view class="sheet-footer">
            <wd-button type="primary" block @click="showSettings = false">保存偏好并返回</wd-button>
          </view>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.reading-settings-page {
  display: grid;
  gap: 24rpx;
}

.reader-viewport {
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  padding: 36rpx;
  box-sizing: border-box;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  min-height: 600rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.reader-header {
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
  padding-bottom: 18rpx;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.article-category {
  font-size: 22rpx;
  font-weight: 700;
  opacity: 0.7;
}

.article-title {
  font-size: 32rpx;
  font-weight: 900;
}

.reader-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  transition: font-size 0.2s ease;
}

.paragraph {
  text-indent: 2em;
  text-align: justify;
}

.reader-footer {
  margin-top: 36rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
  padding-top: 18rpx;
}

.page-num {
  font-size: 22rpx;
  opacity: 0.6;
}

.floating-trigger-row {
  display: flex;
  justify-content: center;
}

.btn-inner {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.ml-1 {
  margin-left: 8rpx;
}

/* Settings Sheet styles */
:deep(.settings-sheet-popup) {
  border-radius: 32rpx 32rpx 0 0;
  background: #fff;
  overflow: hidden;
}

.settings-sheet-container {
  display: flex;
  flex-direction: column;
  height: 850rpx;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 36rpx;
  border-bottom: 1rpx solid var(--app-line);
}

.sheet-title {
  font-size: 30rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.reset-link {
  font-size: 24rpx;
  font-weight: 700;
  color: var(--app-brand);
}

.sheet-body {
  flex: 1;
  padding: 24rpx 36rpx;
  overflow-y: auto;
}

.setting-section {
  margin-bottom: 36rpx;
}

.section-label {
  font-size: 25rpx;
  font-weight: 800;
  color: var(--app-ink);
  margin-bottom: 18rpx;
}

.themes-row {
  display: flex;
  gap: 24rpx;
}

.theme-picker-circle {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  border: 4rpx solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);

  &.active {
    transform: scale(1.1);
  }
}

.theme-picker-indicator {
  font-size: 28rpx;
  font-weight: 800;
}

.theme-selected-name {
  font-size: 22rpx;
  color: var(--app-muted);
  margin-top: 12rpx;
}

.font-size-adjuster {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 16rpx 20rpx;
}

.size-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 10rpx;
  background: #fff;
  border: 1rpx solid var(--app-line);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 800;
  color: var(--app-ink);
  
  &.disabled {
    opacity: 0.4;
  }
}

.size-display {
  font-size: 26rpx;
  font-weight: 900;
  color: var(--app-ink);
  width: 80rpx;
  text-align: center;
}

.font-slider {
  flex: 1;
  margin: 0 10rpx;
}

.spacing-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12rpx;
}

.spacing-btn {
  background: #f1f5f9;
  border: 1rpx solid transparent;
  color: var(--app-muted);
  border-radius: 10rpx;
  padding: 16rpx 0;
  text-align: center;
  font-size: 23rpx;
  font-weight: 700;
  transition: all 0.2s ease;

  &.active {
    background: #eff6ff;
    border-color: var(--app-brand);
    color: var(--app-brand);
  }
}

.fonts-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.font-family-btn {
  background: #f1f5f9;
  border: 1rpx solid transparent;
  color: var(--app-muted);
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
  font-size: 25rpx;
  font-weight: 700;
  transition: all 0.2s ease;

  &.active {
    background: #eff6ff;
    border-color: var(--app-brand);
    color: var(--app-brand);
  }
}

.sheet-footer {
  padding: 24rpx 36rpx calc(24rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid var(--app-line);
  background: #fff;
}
</style>
