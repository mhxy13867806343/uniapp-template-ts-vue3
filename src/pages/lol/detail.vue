<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PageShell from '@/components/PageShell.vue'

interface HeroDetail {
  heroId: string
  name: string
  alias: string
  title: string
  roles: string[]
  attack: string
  defense: string
  magic: string
  difficulty: string
  hp: string
  mp: string
  movespeed: string
  armor: string
  spellblock: string
  attackrange: string
  selectAudio: string
  banAudio: string
  keywords: string
  introduce: string
}

interface SkinItem {
  skinId: string
  name: string
  mainImg: string
  iconImg: string
  loadingImg: string
  centerImg: string
  description: string
  isBase: string
}

interface SpellItem {
  spellKey: string
  name: string
  description: string
  abilityIconPath: string
  dynamicDescription: string
  costburn: string
  cooldownburn: string
  range: string
}

const heroId = ref('')
const heroInfo = ref<HeroDetail | null>(null)
const skinsList = ref<SkinItem[]>([])
const spellsList = ref<SpellItem[]>([])
const activeSkinIndex = ref(0)
const activeSpellKey = ref('passive')
const isLoading = ref(true)

// Audio playing indicators
let audioContext: UniApp.InnerAudioContext | null = null
const isAudioPlaying = ref(false)
const playingType = ref('') // 'select' | 'ban'

onLoad((options: any) => {
  if (options.heroid) {
    heroId.value = options.heroid
  } else {
    heroId.value = '1' // Default to Annie
  }
})

onMounted(() => {
  fetchHeroDetail()
  // Setup audio player
  audioContext = uni.createInnerAudioContext()
  audioContext.onPlay(() => {
    isAudioPlaying.value = true
  })
  audioContext.onStop(() => {
    isAudioPlaying.value = false
    playingType.value = ''
  })
  audioContext.onEnded(() => {
    isAudioPlaying.value = false
    playingType.value = ''
  })
  audioContext.onError((e) => {
    isAudioPlaying.value = false
    playingType.value = ''
    uni.showToast({ title: '音频播放失败，请稍后重试', icon: 'none' })
  })
})

onUnmounted(() => {
  if (audioContext) {
    audioContext.destroy()
    audioContext = null
  }
})

function fetchHeroDetail() {
  isLoading.value = true
  uni.request({
    url: `https://game.gtimg.cn/images/lol/act/img/js/hero/${heroId.value}.js`,
    method: 'GET',
    success: (res: any) => {
      if (res.data && res.data.hero) {
        heroInfo.value = res.data.hero
        skinsList.value = res.data.skins || []
        spellsList.value = res.data.spells || []
        
        // Find base skin or default first skin
        const baseIndex = skinsList.value.findIndex(s => s.isBase === '1')
        activeSkinIndex.value = baseIndex >= 0 ? baseIndex : 0
        
        // Default spell to passive if present, or first spell
        const passiveSpell = spellsList.value.find(s => s.spellKey === 'passive')
        if (passiveSpell) {
          activeSpellKey.value = 'passive'
        } else if (spellsList.value.length > 0) {
          activeSpellKey.value = spellsList.value[0].spellKey
        }
      } else {
        uni.showToast({ title: '拉取详情失败', icon: 'none' })
      }
    },
    fail: () => {
      uni.showToast({ title: '网络连接失败', icon: 'none' })
    },
    complete: () => {
      isLoading.value = false
    }
  })
}

// Sort spells: passive -> q -> w -> e -> r
const sortedSpells = computed(() => {
  const order = ['passive', 'q', 'w', 'e', 'r']
  return [...spellsList.value].sort((a, b) => {
    return order.indexOf(a.spellKey) - order.indexOf(b.spellKey)
  })
})

const activeSpell = computed(() => {
  return spellsList.value.find(s => s.spellKey === activeSpellKey.value) || null
})

// Play select / ban voice line
function toggleVoice(type: 'select' | 'ban') {
  if (!heroInfo.value || !audioContext) return
  
  const url = type === 'select' ? heroInfo.value.selectAudio : heroInfo.value.banAudio
  if (!url) {
    uni.showToast({ title: '暂无该语言配音文件', icon: 'none' })
    return
  }

  if (isAudioPlaying.value && playingType.value === type) {
    audioContext.stop()
    isAudioPlaying.value = false
    playingType.value = ''
    return
  }

  audioContext.stop()
  audioContext.src = url
  playingType.value = type
  audioContext.play()
}

function selectSkin(index: number) {
  activeSkinIndex.value = index
}

function translateSpellKey(key: string): string {
  if (key === 'passive') return '被动'
  return key.toUpperCase()
}

// Parse description helper to strip HTML or keep breaks
function formatDescription(desc?: string): string {
  if (!desc) return ''
  return desc.replace(/\\n/g, '\n').replace(/<br\s*\/?>/gi, '\n')
}
</script>

<template>
  <PageShell title="英雄详情" description="查看英雄皮肤画廊大图、属性雷达、技能图文解构以及原版背景原声试听。">
    <view class="lol-detail-page">
      <wd-toast />

      <!-- Loading State -->
      <view v-if="isLoading" class="flex-column items-center justify-center py-5">
        <wd-loading size="32px" />
        <text class="text-muted text-xs mt-2">英雄背景档案加载中...</text>
      </view>

      <view v-else-if="heroInfo" class="detail-container">
        
        <!-- 1. Hero Hero Banner (Skin Splash Art Viewer) -->
        <view class="hero-splash-card">
          <!-- Active Skin Main Splash Art -->
          <image
            class="splash-art-image"
            :src="skinsList[activeSkinIndex]?.mainImg"
            mode="aspectFill"
          />
          <!-- Dark gradient overlay -->
          <view class="splash-art-overlay"></view>

          <!-- Core Meta info -->
          <view class="hero-meta-overlay">
            <text class="hero-title-meta">{{ heroInfo.title }}</text>
            <text class="hero-name-meta">{{ heroInfo.name }}</text>
            <view class="flex items-center gap-2 mt-1">
              <wd-tag
                v-for="role in heroInfo.roles"
                :key="role"
                size="small"
                type="warning"
                plain
              >
                {{ role === 'mage' ? '法师' : role === 'support' ? '辅助' : role === 'fighter' ? '战士' : role === 'tank' ? '坦克' : role === 'assassin' ? '刺客' : role === 'marksman' ? '射手' : role }}
              </wd-tag>
            </view>
            <text class="active-skin-title mt-2">{{ skinsList[activeSkinIndex]?.name }}</text>
          </view>
        </view>

        <!-- 2. Voice lines Player -->
        <view class="panel-box mt-3 voice-player-row flex justify-between items-center">
          <view class="flex items-center">
            <view :class="['voice-pulse-icon', { active: isAudioPlaying }]">
              <text v-if="isAudioPlaying">🔊</text>
              <text v-else>🔈</text>
            </view>
            <view class="flex-column ml-2">
              <text class="voice-title font-bold text-white">原声语音试听</text>
              <text class="voice-desc text-muted">点击下方按钮播放英雄出场台词语音</text>
            </view>
          </view>
          
          <view class="flex gap-2">
            <wd-button
              size="small"
              :type="isAudioPlaying && playingType === 'select' ? 'danger' : 'primary'"
              @click="toggleVoice('select')"
            >
              {{ isAudioPlaying && playingType === 'select' ? '停止' : '🔊 选人台词' }}
            </wd-button>
            <wd-button
              size="small"
              plain
              :type="isAudioPlaying && playingType === 'ban' ? 'danger' : 'warning'"
              @click="toggleVoice('ban')"
            >
              {{ isAudioPlaying && playingType === 'ban' ? '停止' : '🔇 禁用台词' }}
            </wd-button>
          </view>
        </view>

        <!-- 3. Skins Horizontal Slider Selection -->
        <view class="panel-box mt-3">
          <view class="panel-header mb-2">
            <text class="panel-title text-white">🎭 皮肤插画画廊 ({{ skinsList.length }}款)</text>
          </view>
          <scroll-view class="skins-scroll-view" scroll-x="true" show-scrollbar="false">
            <view class="skins-scroll-content">
              <view
                v-for="(skin, index) in skinsList"
                :key="skin.skinId"
                :class="['skin-thumb-card', { active: activeSkinIndex === index }]"
                @click="selectSkin(index)"
              >
                <image class="skin-thumb-img" :src="skin.iconImg || skin.loadingImg" mode="aspectFill" />
                <text class="skin-thumb-name">{{ skin.name }}</text>
              </view>
            </view>
          </scroll-view>
          <!-- Skin lore if present -->
          <view v-if="skinsList[activeSkinIndex]?.description" class="skin-lore-box mt-2">
            <text class="skin-lore-text text-muted">“ {{ skinsList[activeSkinIndex].description }} ”</text>
          </view>
        </view>

        <!-- 4. Spells (Skills) Detailed Tab Panel -->
        <view class="panel-box mt-3">
          <view class="panel-header mb-2">
            <text class="panel-title text-white">⚔️ 技能说明书</text>
          </view>
          
          <!-- Spell Icons Row -->
          <view class="spell-icons-row justify-between flex mb-3">
            <view
              v-for="spell in sortedSpells"
              :key="spell.spellKey"
              :class="['spell-icon-wrapper', { active: activeSpellKey === spell.spellKey }]"
              @click="activeSpellKey = spell.spellKey"
            >
              <image class="spell-icon-img" :src="spell.abilityIconPath" mode="aspectFill" />
              <text class="spell-icon-key">{{ translateSpellKey(spell.spellKey) }}</text>
            </view>
          </view>

          <!-- Spell active detail card -->
          <view v-if="activeSpell" class="spell-detail-card">
            <view class="flex justify-between items-center mb-2">
              <text class="spell-detail-name font-bold text-white">{{ activeSpell.name }}</text>
              <wd-tag size="small" type="primary" plain>{{ translateSpellKey(activeSpell.spellKey) }} 技能</wd-tag>
            </view>
            
            <view class="spell-stats-grid mb-2" v-if="activeSpell.spellKey !== 'passive'">
              <view class="spell-stat-col" v-if="activeSpell.cooldownburn">
                <text class="stat-label">冷却：</text>
                <text class="stat-val">{{ activeSpell.cooldownburn }}秒</text>
              </view>
              <view class="spell-stat-col" v-if="activeSpell.costburn">
                <text class="stat-label">消耗：</text>
                <text class="stat-val">{{ activeSpell.costburn }} 蓝量</text>
              </view>
              <view class="spell-stat-col" v-if="activeSpell.range">
                <text class="stat-label">射程：</text>
                <text class="stat-val">{{ activeSpell.range }}</text>
              </view>
            </view>

            <view class="spell-desc-box">
              <text class="spell-desc-txt">{{ formatDescription(activeSpell.description) }}</text>
              <text class="spell-desc-dyn mt-2" v-if="activeSpell.dynamicDescription">【动态简述】{{ activeSpell.dynamicDescription }}</text>
            </view>
          </view>
        </view>

        <!-- 5. Base Statistics Visual Panel -->
        <view class="panel-box mt-3">
          <view class="panel-header mb-2">
            <text class="panel-title text-white">📊 基础属性雷达数值</text>
          </view>
          <view class="attributes-grid">
            <!-- Attack -->
            <view class="attr-row mb-2">
              <view class="flex justify-between text-xs mb-1">
                <text class="text-muted">物理攻击 (Attack)</text>
                <text class="text-white font-bold">{{ heroInfo.attack }}/10</text>
              </view>
              <view class="attr-progress-bar">
                <view class="attr-progress-fill bg-red" :style="{ width: `${Number(heroInfo.attack) * 10}%` }"></view>
              </view>
            </view>
            
            <!-- Defense -->
            <view class="attr-row mb-2">
              <view class="flex justify-between text-xs mb-1">
                <text class="text-muted">防御能力 (Defense)</text>
                <text class="text-white font-bold">{{ heroInfo.defense }}/10</text>
              </view>
              <view class="attr-progress-bar">
                <view class="attr-progress-fill bg-green" :style="{ width: `${Number(heroInfo.defense) * 10}%` }"></view>
              </view>
            </view>

            <!-- Magic -->
            <view class="attr-row mb-2">
              <view class="flex justify-between text-xs mb-1">
                <text class="text-muted">魔法消耗 (Magic)</text>
                <text class="text-white font-bold">{{ heroInfo.magic }}/10</text>
              </view>
              <view class="attr-progress-bar">
                <view class="attr-progress-fill bg-cyan" :style="{ width: `${Number(heroInfo.magic) * 10}%` }"></view>
              </view>
            </view>

            <!-- Difficulty -->
            <view class="attr-row">
              <view class="flex justify-between text-xs mb-1">
                <text class="text-muted">操作难度 (Difficulty)</text>
                <text class="text-white font-bold">{{ heroInfo.difficulty }}/10</text>
              </view>
              <view class="attr-progress-bar">
                <view class="attr-progress-fill bg-purple" :style="{ width: `${Number(heroInfo.difficulty) * 10}%` }"></view>
              </view>
            </view>
          </view>

          <!-- System detail properties grid -->
          <view class="properties-box mt-3 border-top-gray pt-3">
            <view class="properties-grid">
              <view class="property-item">
                <text class="prop-lbl">初始生命值</text>
                <text class="prop-val">{{ heroInfo.hp }}</text>
              </view>
              <view class="property-item">
                <text class="prop-lbl">初始法力值</text>
                <text class="prop-val">{{ heroInfo.mp }}</text>
              </view>
              <view class="property-item">
                <text class="prop-lbl">初始移动速度</text>
                <text class="prop-val">{{ heroInfo.movespeed }}</text>
              </view>
              <view class="property-item">
                <text class="prop-lbl">基础物理护甲</text>
                <text class="prop-val">{{ heroInfo.armor }}</text>
              </view>
              <view class="property-item">
                <text class="prop-lbl">基础魔法抗性</text>
                <text class="prop-val">{{ heroInfo.spellblock }}</text>
              </view>
              <view class="property-item">
                <text class="prop-lbl">普通攻击范围</text>
                <text class="prop-val">{{ heroInfo.attackrange }} px</text>
              </view>
            </view>
          </view>
        </view>

      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.lol-detail-page {
  display: flex;
  flex-direction: column;
  background-color: #0f141c;
  min-height: 100vh;
  padding: 24rpx;
  padding-bottom: 60rpx;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.panel-box {
  background: #19212d;
  border-radius: 20rpx;
  border: 1rpx solid #2a3746;
  padding: 30rpx;
}

.panel-title {
  font-size: 28rpx;
  font-weight: 800;
}

/* Splash Card Banner */
.hero-splash-card {
  width: 100%;
  height: 480rpx;
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
  border: 2rpx solid #c29c53;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.6);
}

.splash-art-image {
  width: 100%;
  height: 100%;
}

.splash-art-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(15,20,28,0.2) 0%, rgba(15,20,28,0.85) 100%);
}

.hero-meta-overlay {
  position: absolute;
  bottom: 24rpx;
  left: 24rpx;
  right: 24rpx;
  display: flex;
  flex-direction: column;
}

.hero-title-meta {
  color: #c29c53;
  font-size: 26rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.hero-name-meta {
  color: #fff;
  font-size: 44rpx;
  font-weight: 900;
  margin-top: 4rpx;
  text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.8);
}

.active-skin-title {
  color: #94a3b8;
  font-size: 22rpx;
}

/* Voice Player Section */
.voice-pulse-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #2a3746;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  
  &.active {
    background: #c29c53;
    animation: voiceRippling 1.2s infinite ease-in-out;
  }
}

@keyframes voiceRippling {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(194, 156, 83, 0.4); }
  50% { transform: scale(1.1); box-shadow: 0 0 0 12rpx rgba(194, 156, 83, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(194, 156, 83, 0); }
}

.voice-title {
  font-size: 26rpx;
}

.voice-desc {
  font-size: 18rpx;
  margin-top: 4rpx;
}

/* Skins Scroll */
.skins-scroll-view {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
}

.skins-scroll-content {
  display: flex;
  flex-direction: row;
  gap: 16rpx;
  padding: 10rpx 4rpx;
}

.skin-thumb-card {
  flex-shrink: 0;
  width: 160rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2rpx solid #2a3746;
  border-radius: 12rpx;
  background: #0f141c;
  padding: 8rpx;
  transition: all 0.2s ease;
  
  &.active {
    border-color: #c29c53;
    background: rgba(194, 156, 83, 0.1);
  }
}

.skin-thumb-img {
  width: 130rpx;
  height: 130rpx;
  border-radius: 8rpx;
  background: #19212d;
}

.skin-thumb-name {
  color: #94a3b8;
  font-size: 16rpx;
  margin-top: 8rpx;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.skin-lore-box {
  background: #0f141c;
  border-radius: 8rpx;
  padding: 16rpx;
  border-left: 6rpx solid #c29c53;
}

.skin-lore-text {
  font-size: 20rpx;
  line-height: 1.5;
}

/* Spells Tab */
.spell-icons-row {
  width: 100%;
  display: flex;
  gap: 12rpx;
}

.spell-icon-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2rpx solid #2a3746;
  border-radius: 12rpx;
  background: #0f141c;
  padding: 10rpx 4rpx;
  cursor: pointer;
  
  &.active {
    border-color: #c29c53;
    background: rgba(194, 156, 83, 0.1);
    
    .spell-icon-key {
      color: #c29c53;
      font-weight: 800;
    }
  }
}

.spell-icon-img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  border: 1rpx solid #2a3746;
}

.spell-icon-key {
  color: #94a3b8;
  font-size: 16rpx;
  margin-top: 6rpx;
}

.spell-detail-card {
  background: #0f141c;
  border: 1rpx solid #2a3746;
  border-radius: 16rpx;
  padding: 24rpx;
}

.spell-detail-name {
  font-size: 26rpx;
}

.spell-stats-grid {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}

.spell-stat-col {
  font-size: 20rpx;
}

.stat-label {
  color: #94a3b8;
}

.stat-val {
  color: #f3f4f6;
  font-weight: bold;
}

.spell-desc-box {
  display: flex;
  flex-direction: column;
}

.spell-desc-txt {
  color: #cbd5e1;
  font-size: 22rpx;
  line-height: 1.6;
}

.spell-desc-dyn {
  color: #c29c53;
  font-size: 20rpx;
  line-height: 1.5;
  background: rgba(194, 156, 83, 0.05);
  border-radius: 8rpx;
  padding: 10rpx;
}

/* Attributes progress indicators */
.attr-row {
  display: flex;
  flex-direction: column;
}

.attr-progress-bar {
  width: 100%;
  height: 12rpx;
  background: #0f141c;
  border-radius: 6rpx;
  overflow: hidden;
}

.attr-progress-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.4s ease-out;
}

.bg-red { background: #ef4444; }
.bg-green { background: #10b981; }
.bg-cyan { background: #06b6d4; }
.bg-purple { background: #8b5cf6; }

/* System properties table */
.border-top-gray {
  border-top: 1rpx solid #2a3746;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.property-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20rpx;
  padding: 6rpx 0;
}

.prop-lbl {
  color: #94a3b8;
}

.prop-val {
  color: #f3f4f6;
  font-weight: bold;
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-white { color: #fff; }
.text-muted { color: #94a3b8; }
.text-xs { font-size: 20rpx; }
.text-sm { font-size: 24rpx; }
.mr-2 { margin-right: 16rpx; }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mb-2 { margin-bottom: 16rpx; }
.mb-3 { margin-bottom: 24rpx; }
.py-5 { padding-top: 40rpx; padding-bottom: 40rpx; }
.px-2 { padding-left: 16rpx; padding-right: 16rpx; }
.gap-2 { gap: 16rpx; }
</style>
