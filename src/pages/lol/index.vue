<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageShell from '@/components/PageShell.vue'

interface HeroItem {
  heroId: string
  name: string
  alias: string
  title: string
  roles: string[]
  isWeekFree: string
  selectAudio: string
  banAudio: string
  keywords: string
}

const rawHeroList = ref<HeroItem[]>([])
const searchQuery = ref('')
const selectedRole = ref('all') // all, fighter, mage, assassin, tank, marksman, support
const showWeekFreeOnly = ref(false)
const isLoading = ref(true)

const rolesMap: Record<string, string> = {
  all: '全部',
  fighter: '战士',
  mage: '法师',
  assassin: '刺客',
  tank: '坦克',
  marksman: '射手',
  support: '辅助'
}

onMounted(() => {
  fetchHeroList()
})

function fetchHeroList() {
  isLoading.value = true
  uni.request({
    url: 'https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js',
    method: 'GET',
    success: (res: any) => {
      if (res.data && res.data.hero) {
        rawHeroList.value = res.data.hero
      } else {
        uni.showToast({ title: '获取数据失败', icon: 'none' })
      }
    },
    fail: () => {
      uni.showToast({ title: '网络请求失败', icon: 'none' })
    },
    complete: () => {
      isLoading.value = false
    }
  })
}

// Filtered heroes computed
const filteredHeroes = computed(() => {
  return rawHeroList.value.filter(hero => {
    // 1. Role filter
    if (selectedRole.value !== 'all' && !hero.roles.includes(selectedRole.value)) {
      return false
    }
    // 2. Weekly free filter
    if (showWeekFreeOnly.value && hero.isWeekFree !== '1') {
      return false
    }
    // 3. Search query matching
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchName = hero.name.toLowerCase().includes(q)
      const matchTitle = hero.title.toLowerCase().includes(q)
      const matchAlias = hero.alias.toLowerCase().includes(q)
      const matchKeywords = hero.keywords.toLowerCase().includes(q)
      return matchName || matchTitle || matchAlias || matchKeywords
    }
    return true
  })
})

function selectRole(role: string) {
  selectedRole.value = role
}

function navToDetail(heroId: string) {
  uni.navigateTo({
    url: `/pages/lol/detail?heroid=${heroId}`
  })
}
</script>

<template>
  <PageShell title="英雄联盟宇宙" description="直连腾讯官方实时英雄数据库接口，快捷检索全英雄详情、配音及精美原画皮肤。">
    <view class="lol-list-page">
      <wd-toast />

      <!-- Top Search & Option controls -->
      <view class="search-panel-box">
        <wd-search
          v-model="searchQuery"
          placeholder="输入英雄名称、称号或拼音 (例如: 安妮/Annie)"
          hide-cancel
          custom-class="lol-search-input"
        />
        
        <view class="flex justify-between items-center mt-2 px-2">
          <text class="hero-count-label text-muted text-xs">共 {{ filteredHeroes.length }} 个英雄</text>
          <view class="flex items-center" @click="showWeekFreeOnly = !showWeekFreeOnly">
            <wd-tag :type="showWeekFreeOnly ? 'primary' : 'default'" round clickable>
              {{ showWeekFreeOnly ? '🌱 已限周免' : '🌱 筛选周免' }}
            </wd-tag>
          </view>
        </view>
      </view>

      <!-- Roles Tabs selector -->
      <scroll-view class="horizontal-tabs-scroll" scroll-x="true" show-scrollbar="false">
        <view class="horizontal-tabs-content">
          <view
            v-for="(label, roleKey) in rolesMap"
            :key="roleKey"
            :class="['role-tab-item', { active: selectedRole === roleKey }]"
            @click="selectRole(roleKey)"
          >
            {{ label }}
          </view>
        </view>
      </scroll-view>

      <!-- Loading skeleton -->
      <view v-if="isLoading" class="flex-column items-center justify-center py-5">
        <wd-loading size="32px" />
        <text class="text-muted text-xs mt-2">拉取腾讯官方英雄列表中...</text>
      </view>

      <!-- Empty state -->
      <view v-else-if="!filteredHeroes.length" class="flex-column items-center justify-center py-5">
        <text class="text-muted text-sm">未能匹配到对应的英雄</text>
      </view>

      <!-- Hero list grid -->
      <view v-else class="hero-cards-grid mt-2">
        <view
          v-for="hero in filteredHeroes"
          :key="hero.heroId"
          class="hero-card-cell"
          @click="navToDetail(hero.heroId)"
        >
          <image
            class="hero-card-avatar"
            :src="`https://game.gtimg.cn/images/lol/act/img/champion/${hero.alias}.png`"
            mode="aspectFill"
            lazy-load
          />
          <view class="hero-card-meta">
            <text class="hero-name-txt font-bold">{{ hero.title }}</text>
            <text class="hero-title-txt text-muted">{{ hero.name }}</text>
          </view>
          <!-- Weekly free badge -->
          <view v-if="hero.isWeekFree === '1'" class="week-free-badge">免</view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.lol-list-page {
  display: flex;
  flex-direction: column;
  background-color: #111827;
  min-height: 100vh;
  padding: 20rpx;
  padding-bottom: 60rpx;
}

.search-panel-box {
  background: #1f2937;
  border-radius: 16rpx;
  border: 1rpx solid #374151;
  padding: 20rpx;
}

:deep(.lol-search-input) {
  background-color: #111827 !important;
  border-radius: 10rpx !important;
  color: #fff !important;
}

.hero-count-label {
  color: #9ca3af;
}

/* Horizontal Role Tabs */
.horizontal-tabs-scroll {
  width: 100%;
  white-space: nowrap;
  margin-top: 20rpx;
  overflow: hidden;
}

.horizontal-tabs-content {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
  padding: 6rpx 4rpx;
}

.role-tab-item {
  flex-shrink: 0;
  border: 1rpx solid #374151;
  background: #1f2937;
  color: #9ca3af;
  padding: 12rpx 32rpx;
  font-size: 24rpx;
  border-radius: 30rpx;
  transition: all 0.2s ease;
  
  &.active {
    background: #c29c53; // LOL gold accent
    border-color: #c29c53;
    color: #111827;
    font-weight: 800;
    box-shadow: 0 0 10rpx rgba(194, 156, 83, 0.4);
  }
}

/* Hero Cards Grid */
.hero-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16rpx;
}

.hero-card-cell {
  background: #1f2937;
  border: 1rpx solid #374151;
  border-radius: 12rpx;
  padding: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: #2563eb10;
    border-color: #c29c53;
  }
}

.hero-card-avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  border: 3rpx solid #374151;
  background: #111827;
}

.hero-card-meta {
  margin-top: 10rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rpx;
  width: 100%;
}

.hero-name-txt {
  color: #f3f4f6;
  font-size: 22rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-title-txt {
  color: #9ca3af;
  font-size: 16rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.week-free-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #10b981;
  color: #fff;
  font-size: 14rpx;
  padding: 4rpx 10rpx;
  border-bottom-left-radius: 8rpx;
  font-weight: 800;
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 800; }
.text-muted { color: #9ca3af; }
.text-xs { font-size: 20rpx; }
.text-sm { font-size: 24rpx; }
.mt-2 { margin-top: 16rpx; }
.py-5 { padding-top: 40rpx; padding-bottom: 40rpx; }
.px-2 { padding-left: 16rpx; padding-right: 16rpx; }
</style>
