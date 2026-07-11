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

// Tab Selection: base (皮肤/技能) | strategy (出装/符文)
const activeTab = ref('base')

// Live Strategy Guides State
const rankInfo = ref<any>(null)
const strategyDetail = ref<any>(null)
const selectedStrategyLane = ref('')

// Global mapper caches
const itemsMap = ref<Record<string, any>>({})
const runesMap = ref<Record<string, any>>({})

const laneNamesMap: Record<string, string> = {
  top: '上单',
  jungle: '打野',
  mid: '中单',
  bottom: '射手',
  support: '辅助'
}

onLoad((options: any) => {
  if (options.heroid) {
    heroId.value = options.heroid
  } else {
    heroId.value = '1' // Default to Annie
  }
})

onMounted(() => {
  fetchHeroDetail()
  fetchStrategyData()
  loadGlobalMappers()

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
  audioContext.onError(() => {
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

function fetchStrategyData() {
  // 1. Fetch Rank Info
  uni.request({
    url: 'https://lol.qq.com/act/lbp/common/guides/guideschampion_rank.js',
    method: 'GET',
    success: (res: any) => {
      if (typeof res.data === 'string') {
        try {
          const txt = res.data
          const start = txt.indexOf('{')
          const end = txt.lastIndexOf('}')
          const jsonStr = txt.substring(start, end + 1)
          const d = JSON.parse(jsonStr)
          if (d && d.list && d.list[heroId.value]) {
            rankInfo.value = d.list[heroId.value]
          }
        } catch (e) {
          console.error('Parse guideschampion_rank.js error', e)
        }
      }
    }
  })

  // 2. Fetch Strategy Detail
  uni.request({
    url: `https://lol.qq.com/act/lbp/common/guides/champDetail/champDetail_${heroId.value}.js`,
    method: 'GET',
    success: (res: any) => {
      if (typeof res.data === 'string') {
        try {
          const txt = res.data
          const start = txt.indexOf('{')
          const end = txt.lastIndexOf('}')
          const jsonStr = txt.substring(start, end + 1)
          const d = JSON.parse(jsonStr)
          if (d && d.list) {
            strategyDetail.value = d.list
            
            // Set default active lane
            const lanes = Object.keys(d.list.championLane || {})
            if (lanes.length > 0) {
              selectedStrategyLane.value = lanes[0]
            }
          }
        } catch (e) {
          console.error('Parse champDetail error', e)
        }
      }
    }
  })
}

function loadGlobalMappers() {
  // Check memory cache
  const cachedItems = (window as any).lol_items_cache
  const cachedRunes = (window as any).lol_runes_cache

  if (cachedItems) {
    itemsMap.value = cachedItems
  } else {
    uni.request({
      url: 'https://game.gtimg.cn/images/lol/act/img/js/items/items.js',
      method: 'GET',
      success: (res: any) => {
        if (res.data && res.data.items) {
          itemsMap.value = res.data.items
          ;(window as any).lol_items_cache = res.data.items
        }
      }
    })
  }

  if (cachedRunes) {
    runesMap.value = cachedRunes
  } else {
    uni.request({
      url: 'https://game.gtimg.cn/images/lol/act/img/js/runeList/rune_list.js',
      method: 'GET',
      success: (res: any) => {
        if (res.data && res.data.rune) {
          runesMap.value = res.data.rune
          ;(window as any).lol_runes_cache = res.data.rune
        }
      }
    })
  }
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

// --- Strategy Tab Computed Properties ---
const availableLanes = computed(() => {
  if (!strategyDetail.value || !strategyDetail.value.championLane) return []
  return Object.keys(strategyDetail.value.championLane)
})

const activeLaneData = computed(() => {
  if (!strategyDetail.value || !selectedStrategyLane.value) return null
  return strategyDetail.value.championLane[selectedStrategyLane.value] || null
})

// Recommended Starter Items
const recommendedStarters = computed(() => {
  if (!activeLaneData.value) return []
  try {
    const obj = JSON.parse(activeLaneData.value.itemoutjson)
    const rec = obj['1']
    if (!rec || !rec.itemid) return []
    return rec.itemid.split('&').map((id: string) => {
      const item = itemsMap.value[id]
      return {
        id,
        name: item ? item.name : '出门装',
        icon: item ? item.iconPath : `https://game.gtimg.cn/images/lol/act/img/item/${id}.png`
      }
    })
  } catch (e) {
    return []
  }
})

// Recommended Core Items
const recommendedCores = computed(() => {
  if (!activeLaneData.value) return []
  try {
    const obj = JSON.parse(activeLaneData.value.core3itemjson)
    const result = []
    for (let k of ['1', '2']) {
      const rec = obj[k]
      if (rec && rec.itemid) {
        const items = rec.itemid.split('&').map((id: string) => {
          const item = itemsMap.value[id]
          return {
            id,
            name: item ? item.name : '核心装备',
            icon: item ? item.iconPath : `https://game.gtimg.cn/images/lol/act/img/item/${id}.png`
          }
        })
        result.push({
          winrate: (rec.winrate / 100).toFixed(2),
          showrate: (rec.showrate / 100).toFixed(2),
          items
        })
      }
    }
    return result
  } catch (e) {
    return []
  }
})

// Recommended Shoes
const recommendedShoes = computed(() => {
  if (!activeLaneData.value) return []
  try {
    const obj = JSON.parse(activeLaneData.value.shoesjson)
    return Object.values(obj).slice(0, 3).map((rec: any) => {
      const id = rec.itemid
      const item = itemsMap.value[id]
      return {
        id,
        name: item ? item.name : '备选鞋子',
        icon: item ? item.iconPath : `https://game.gtimg.cn/images/lol/act/img/item/${id}.png`,
        winrate: (rec.winrate / 100).toFixed(2),
        showrate: (rec.showrate / 100).toFixed(2)
      }
    })
  } catch (e) {
    return []
  }
})

// Recommended Runes (Perks) mapping
const recommendedRunes = computed(() => {
  if (!activeLaneData.value) return null
  try {
    const mainViceObj = JSON.parse(activeLaneData.value.mainviceperk)
    const detailObj = JSON.parse(activeLaneData.value.perkdetail)
    
    const firstMainVice = mainViceObj['1']
    if (!firstMainVice) return null
    
    const detailRec = detailObj['1'] && detailObj['1']['1']
    if (!detailRec || !detailRec.perk) return null
    
    const runeIds = detailRec.perk.split('&')
    const runes = runeIds.map((id: string) => {
      const r = runesMap.value[id]
      return {
        id,
        name: r ? r.name : '印记',
        icon: r ? r.icon : 'https://game.gtimg.cn/images/lol/act/img/rune/StatModsHealthPlusIcon.png',
        shortdesc: r ? r.shortdesc : ''
      }
    })

    return {
      mainName: firstMainVice.mainname,
      viceName: firstMainVice.viceperk,
      winrate: (firstMainVice.winrate / 100).toFixed(2),
      showrate: (firstMainVice.showrate / 100).toFixed(2),
      runes
    }
  } catch (e) {
    return null
  }
})

// Skill Upgrades max orders
const recommendedSkillMaxOrder = computed(() => {
  if (!activeLaneData.value) return ''
  try {
    const obj = JSON.parse(activeLaneData.value.skilljson)
    const rec = obj['1']
    if (!rec || !rec.qwe) return ''
    return rec.qwe.split('&').map((code: string) => {
      if (code === '1') return 'Q'
      if (code === '2') return 'W'
      if (code === '3') return 'E'
      return '?'
    }).join(' > ')
  } catch (e) {
    return ''
  }
})

// Skill 15 level up grids
const recommendedSkill15List = computed(() => {
  if (!activeLaneData.value) return []
  try {
    const obj = JSON.parse(activeLaneData.value.skilljson)
    const rec = obj['1']
    if (!rec || !rec.sk) return []
    return rec.sk.split('&').map((code: string, idx: number) => {
      let name = '?'
      if (code === '1') name = 'Q'
      else if (code === '2') name = 'W'
      else if (code === '3') name = 'E'
      else if (code === '4') name = 'R'
      return {
        level: idx + 1,
        name
      }
    })
  } catch (e) {
    return []
  }
})
</script>

<template>
  <PageShell title="英雄详情" description="查看英雄皮肤画廊大图、属性雷达、技能图文解构以及推荐符文装备加点攻略。">
    <view class="lol-detail-page">
      <wd-toast />

      <!-- Loading State -->
      <view v-if="isLoading" class="flex-column items-center justify-center py-5">
        <wd-loading size="32px" />
        <text class="text-muted text-xs mt-2">英雄档案加载中...</text>
      </view>

      <view v-else-if="heroInfo" class="detail-container">
        
        <!-- 1. Hero Banner (Skin Splash Art Viewer) -->
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
              <text v-slot:default v-if="isAudioPlaying">🔊</text>
              <text v-slot:default v-else>🔈</text>
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
              {{ isAudioPlaying && playingType === 'select' ? '停止' : '🔊 选人' }}
            </wd-button>
            <wd-button
              size="small"
              plain
              :type="isAudioPlaying && playingType === 'ban' ? 'danger' : 'warning'"
              @click="toggleVoice('ban')"
            >
              {{ isAudioPlaying && playingType === 'ban' ? '停止' : '禁用' }}
            </wd-button>
          </view>
        </view>

        <!-- 3. Navigation Tabs -->
        <view class="detail-tabs-wrapper mt-2">
          <wd-tabs v-model="activeTab" custom-class="strategy-tabs-nav">
            <wd-tab title="🎬 皮肤与技能" name="base" />
            <wd-tab title="📊 攻略与出装符文" name="strategy" />
          </wd-tabs>
        </view>

        <!-- SECTION A: Base Info (Skins & Skills & Basic Attributes) -->
        <view v-if="activeTab === 'base'" class="flex-column gap-3">
          
          <!-- Skins Gallery -->
          <view class="panel-box mt-2">
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

          <!-- Skills Guide -->
          <view class="panel-box mt-2">
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

          <!-- Attributes Meter -->
          <view class="panel-box mt-2">
            <view class="panel-header mb-2">
              <text class="panel-title text-white">📊 基础属性雷达</text>
            </view>
            <view class="attributes-grid">
              <view class="attr-row mb-2">
                <view class="flex justify-between text-xs mb-1">
                  <text class="text-muted">物理攻击 (Attack)</text>
                  <text class="text-white font-bold">{{ heroInfo.attack }}/10</text>
                </view>
                <view class="attr-progress-bar">
                  <view class="attr-progress-fill bg-red" :style="{ width: `${Number(heroInfo.attack) * 10}%` }"></view>
                </view>
              </view>
              
              <view class="attr-row mb-2">
                <view class="flex justify-between text-xs mb-1">
                  <text class="text-muted">防御能力 (Defense)</text>
                  <text class="text-white font-bold">{{ heroInfo.defense }}/10</text>
                </view>
                <view class="attr-progress-bar">
                  <view class="attr-progress-fill bg-green" :style="{ width: `${Number(heroInfo.defense) * 10}%` }"></view>
                </view>
              </view>

              <view class="attr-row mb-2">
                <view class="flex justify-between text-xs mb-1">
                  <text class="text-muted">魔法消耗 (Magic)</text>
                  <text class="text-white font-bold">{{ heroInfo.magic }}/10</text>
                </view>
                <view class="attr-progress-bar">
                  <view class="attr-progress-fill bg-cyan" :style="{ width: `${Number(heroInfo.magic) * 10}%` }"></view>
                </view>
              </view>

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

        <!-- SECTION B: Strategy Guide & Live Builds Statistics -->
        <view v-if="activeTab === 'strategy'" class="flex-column gap-3">
          
          <!-- Lane Switcher (e.g. bottom, support) -->
          <view class="panel-box mt-2">
            <view class="flex items-center justify-between mb-2">
              <text class="panel-title text-white">🛣️ 国服分路选择数据</text>
              <text class="text-muted text-xs">数据更新: {{ activeLaneData ? activeLaneData.dtstatdate : '同步中' }}</text>
            </view>
            
            <view class="flex gap-2">
              <view
                v-for="lane in availableLanes"
                :key="lane"
                :class="['lane-btn', { active: selectedStrategyLane === lane }]"
                @click="selectedStrategyLane = lane"
              >
                ⚔️ {{ laneNamesMap[lane] || lane }}
              </view>
            </view>
          </view>

          <!-- Core metrics Win Rate, Pick Rate, Ban Rate -->
          <view v-if="activeLaneData" class="metrics-grid">
            <view class="metric-card">
              <text class="metric-val text-gold">{{ (activeLaneData.lanewinrate / 100).toFixed(2) }}%</text>
              <text class="metric-lbl">胜率 (Win Rate)</text>
              <text class="metric-rank">分路排行第 {{ activeLaneData.champlanorder }} 位</text>
            </view>
            <view class="metric-card">
              <text class="metric-val text-brand">{{ (activeLaneData.lanshowrate / 100).toFixed(2) }}%</text>
              <text class="metric-lbl">登场率 (Pick Rate)</text>
              <text class="metric-rank">分路出场比率 {{ (activeLaneData.lanrate / 100).toFixed(2) }}%</text>
            </view>
            <view class="metric-card">
              <text class="metric-val text-red">{{ rankInfo ? (rankInfo.banrate / 100).toFixed(2) : '0.00' }}%</text>
              <text class="metric-lbl">禁用率 (Ban Rate)</text>
              <text class="metric-rank">全分路总Ban比率</text>
            </view>
          </view>

          <!-- Recommended Skill Order -->
          <view v-if="activeLaneData" class="panel-box mt-1">
            <view class="panel-header mb-2 flex justify-between items-center">
              <text class="panel-title text-white">☝️ 推荐技能加点加成</text>
              <text class="text-gold text-xs font-bold">{{ recommendedSkillMaxOrder }}</text>
            </view>
            
            <scroll-view class="skill-levels-scroll" scroll-x="true" show-scrollbar="false">
              <view class="skill-levels-content">
                <view v-for="item in recommendedSkill15List" :key="item.level" class="level-skill-card">
                  <text class="level-number">L{{ item.level }}</text>
                  <view :class="['skill-badge-letter', 'sk-' + item.name.toLowerCase()]">
                    {{ item.name }}
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>

          <!-- Recommended Runes Grid -->
          <view v-if="activeLaneData && recommendedRunes" class="panel-box mt-1">
            <view class="panel-header mb-3 flex justify-between items-center">
              <text class="panel-title text-white">🔮 核心符文建议天赋</text>
              <text class="text-muted text-xs">{{ recommendedRunes.mainName }} + {{ recommendedRunes.viceName }} (登场率 {{ recommendedRunes.showrate }}%)</text>
            </view>
            
            <view class="runes-recommendation-grid">
              <view
                v-for="rune in recommendedRunes.runes"
                :key="rune.id"
                class="rune-icon-box"
              >
                <image class="rune-icon-image" :src="rune.icon" mode="aspectFit" />
                <text class="rune-icon-name font-bold">{{ rune.name }}</text>
                <text class="rune-icon-desc text-muted">{{ rune.shortdesc }}</text>
              </view>
            </view>
          </view>

          <!-- Recommended Builds (Starter, Core, Shoes) -->
          <view v-if="activeLaneData" class="panel-box mt-1">
            <view class="panel-header mb-3">
              <text class="panel-title text-white">🎒 神装搭配推荐列表</text>
            </view>

            <!-- Starter items -->
            <view class="build-category-row mb-3">
              <view class="category-meta-header flex justify-between items-center mb-2">
                <text class="category-title text-white">🥾 出门装推荐</text>
              </view>
              <view class="items-list-row flex gap-2">
                <view v-for="(item, idx) in recommendedStarters" :key="idx" class="item-icon-tag">
                  <image class="item-img" :src="item.icon" mode="aspectFill" />
                  <text class="item-txt">{{ item.name }}</text>
                </view>
              </view>
            </view>

            <!-- Core 3 items builds -->
            <view class="build-category-row mb-3 border-top-gray pt-3">
              <view class="category-meta-header mb-2">
                <text class="category-title text-white">⚔️ 核心三件套方案</text>
              </view>
              
              <view class="core-builds-list flex-column gap-3">
                <view
                  v-for="(build, idx) in recommendedCores"
                  :key="idx"
                  class="core-build-row p-2"
                >
                  <view class="flex items-center justify-between mb-2">
                    <wd-tag size="small" type="primary">方案 {{ idx + 1 }}</wd-tag>
                    <text class="text-muted text-xs">胜率: <text class="text-gold font-bold">{{ build.winrate }}%</text> (选率 {{ build.showrate }}%)</text>
                  </view>
                  
                  <view class="flex items-center gap-1">
                    <template v-for="(item, iIdx) in build.items" :key="iIdx">
                      <view class="item-icon-tag">
                        <image class="item-img" :src="item.icon" mode="aspectFill" />
                        <text class="item-txt">{{ item.name }}</text>
                      </view>
                      <text v-if="iIdx < build.items.length - 1" class="item-arrow-sign">➔</text>
                    </template>
                  </view>
                </view>
              </view>
            </view>

            <!-- Shoes recommended -->
            <view class="build-category-row border-top-gray pt-3">
              <view class="category-meta-header mb-2">
                <text class="category-title text-white">🧦 备选鞋子胜率</text>
              </view>
              
              <view class="shoes-recommend-row flex gap-2">
                <view v-for="shoe in recommendedShoes" :key="shoe.id" class="shoe-metric-box">
                  <image class="shoe-img" :src="shoe.icon" mode="aspectFill" />
                  <view class="flex-column ml-1">
                    <text class="shoe-name">{{ shoe.name }}</text>
                    <text class="shoe-stats text-gold font-bold">{{ shoe.winrate }}% 胜率</text>
                  </view>
                </view>
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

/* Navigation tabs cyber overlay */
:deep(.strategy-tabs-nav) {
  --tabs-nav-bg: #19212d;
  --tabs-title-color: #94a3b8;
  --tabs-title-active-color: #c29c53;
  --tabs-line-color: #c29c53;
  border-radius: 12rpx;
  border: 1rpx solid #2a3746;
  overflow: hidden;
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

/* --- Strategy Section CSS --- */
.lane-btn {
  border: 1px solid #2a3746;
  background: #0f141c;
  color: #94a3b8;
  border-radius: 30rpx;
  padding: 10rpx 24rpx;
  font-size: 22rpx;
  transition: all 0.2s ease;
  
  &.active {
    border-color: #c29c53;
    background: rgba(194, 156, 83, 0.15);
    color: #c29c53;
    font-weight: bold;
    box-shadow: 0 0 8rpx rgba(194, 156, 83, 0.3);
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 10rpx;
}

.metric-card {
  background: #19212d;
  border: 1px solid #2a3746;
  border-radius: 16rpx;
  padding: 20rpx 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metric-val {
  font-size: 32rpx;
  font-weight: 900;
}

.metric-lbl {
  color: #94a3b8;
  font-size: 16rpx;
  margin-top: 6rpx;
}

.metric-rank {
  color: #64748b;
  font-size: 14rpx;
  margin-top: 4rpx;
}

.text-gold { color: #c29c53; }
.text-brand { color: var(--app-brand, #3b82f6); }
.text-red { color: #ef4444; }

/* Skill upgrades flow chart */
.skill-levels-scroll {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
}

.skill-levels-content {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
  padding: 10rpx 4rpx;
}

.level-skill-card {
  flex-shrink: 0;
  width: 72rpx;
  background: #0f141c;
  border: 1rpx solid #2a3746;
  border-radius: 10rpx;
  padding: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.level-number {
  font-size: 16rpx;
  color: #64748b;
}

.skill-badge-letter {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  font-weight: 900;
  margin-top: 8rpx;
  color: #0f141c;
}

.sk-q { background: #3b82f6; color: #fff; }
.sk-w { background: #a855f7; color: #fff; }
.sk-e { background: #f97316; color: #fff; }
.sk-r { background: #eab308; color: #fff; }

/* Runes grid styling */
.runes-recommendation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20rpx;
}

.rune-icon-box {
  background: #0f141c;
  border: 1rpx solid #2a3746;
  border-radius: 16rpx;
  padding: 16rpx 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.rune-icon-image {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #19212d;
}

.rune-icon-name {
  color: #fff;
  font-size: 18rpx;
  margin-top: 10rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.rune-icon-desc {
  font-size: 14rpx;
  color: #64748b;
  margin-top: 4rpx;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

/* Builds panels */
.category-title {
  font-size: 24rpx;
  font-weight: bold;
}

.item-icon-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120rpx;
}

.item-img {
  width: 72rpx;
  height: 72rpx;
  border-radius: 8rpx;
  border: 1px solid #2a3746;
  background: #0f141c;
}

.item-txt {
  color: #94a3b8;
  font-size: 16rpx;
  margin-top: 6rpx;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.core-build-row {
  background: #0f141c;
  border-radius: 12rpx;
  border: 1rpx solid #2a3746;
}

.item-arrow-sign {
  color: #64748b;
  font-size: 28rpx;
  line-height: 72rpx;
  padding: 0 4rpx;
}

.shoe-metric-box {
  flex: 1;
  background: #0f141c;
  border-radius: 12rpx;
  border: 1px solid #2a3746;
  padding: 10rpx;
  display: flex;
  align-items: center;
}

.shoe-img {
  width: 60rpx;
  height: 60rpx;
  border-radius: 8rpx;
}

.shoe-name {
  color: #fff;
  font-size: 18rpx;
}

.shoe-stats {
  font-size: 16rpx;
  margin-top: 2rpx;
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
.ml-1 { margin-left: 10rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mb-2 { margin-bottom: 16rpx; }
.mb-3 { margin-bottom: 24rpx; }
.py-5 { padding-top: 40rpx; padding-bottom: 40rpx; }
.px-2 { padding-left: 16rpx; padding-right: 16rpx; }
.gap-2 { gap: 16rpx; }
.gap-3 { gap: 24rpx; }
.p-2 { padding: 16rpx; }
</style>
