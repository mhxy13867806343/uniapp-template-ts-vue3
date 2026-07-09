<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('advanced-search-toast')

// Search & UI States
const searchKeyword = ref('')
const selectedCategory = ref('宝贝') // 宝贝 | 店铺 | 商品
const showCategorySelect = ref(false)
const showResults = ref(false)
const activeSort = ref('综合') // 综合 | 销量 | 价格 | 品牌
const priceSortOrder = ref('desc') // desc | asc
const showFilterDrawer = ref(false)
const activeFilterCategory = ref('价格区间')

// Category Options
const categoryOptions = ['宝贝', '店铺', '商品']

// Search History
const searchHistory = ref<string[]>(['袜子', '电池', '15pro', 'Docker'])

// Hot recommendation tags
const hotRecommendations = [
  { rank: 1, name: '纯棉抗菌防臭袜', tag: '热' },
  { rank: 2, name: '1号南孚电池' },
  { rank: 3, name: '12v锂电池充电器' },
  { rank: 4, name: '一加13 旗舰', tag: '新' },
  { rank: 5, name: '1t高速固态硬盘' },
  { rank: 6, name: '超弹运动防臭短袜' }
]

// Autosuggestions mock list based on typing "1" or similar
const autosuggestions = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw) return []
  
  if (kw === '1') {
    return [
      '1号电池',
      '12v电池',
      '1元e卡',
      '100zz 羽毛球拍',
      '一加13 手机',
      '15pro 手机壳',
      '一加13t Pro',
      '14pro Max 钢化膜',
      '1t固态硬盘 极速',
      '13手机壳 防摔'
    ]
  }
  
  // Generic autocomplete
  return [
    `${kw} 抗菌防臭款`,
    `${kw} 旗舰新品`,
    `${kw} 性价比推荐`,
    `${kw} 同款特惠`,
    `正品包邮 ${kw}`
  ]
})

// Filter data lists
const filterCategories = [
  { name: '价格区间' },
  { name: '精选服务' },
  { name: '商品发货地' },
  { name: '热门品牌' },
  { name: '面料俗称' }
]

const filterOptionsMap = reactive<Record<string, { label: string; selected: boolean }[]>>({
  '价格区间': [
    { label: '0-3 元', selected: false },
    { label: '3-6 元', selected: false },
    { label: '6-11 元', selected: false },
    { label: '11 元以上', selected: false }
  ],
  '精选服务': [
    { label: '退货包运费', selected: false },
    { label: '正品险保障', selected: false },
    { label: '24小时发货', selected: false },
    { label: '假一赔十', selected: false },
    { label: '极速退款', selected: false }
  ],
  '商品发货地': [
    { label: '浙江', selected: false },
    { label: '河南', selected: false },
    { label: '江西', selected: false },
    { label: '陕西', selected: false },
    { label: '吉林', selected: false },
    { label: '上海', selected: false },
    { label: '北京', selected: false },
    { label: '福建', selected: false }
  ],
  '热门品牌': [
    { label: 'Nike 耐克', selected: false },
    { label: 'Adidas 阿迪达斯', selected: false },
    { label: '南极人', selected: false },
    { label: '恒源祥', selected: false }
  ],
  '面料俗称': [
    { label: '纯棉', selected: false },
    { label: '精梳棉', selected: false },
    { label: '聚酯纤维', selected: false }
  ]
})

// Mock Search Results Product list
const mockProducts = [
  { id: 1, name: '7A抗菌防臭袜子男士款夏季吸汗透气短袜', price: '1.98', sales: '已拼13.9万+', tag: '先用后付', cover: '🧦' },
  { id: 2, name: '一次性纯棉袜子男款日抛免洗免邮出差旅行袜', price: '4.89', sales: '已拼93.5万+', tag: '免费送货上门', cover: '🧦' },
  { id: 3, name: '超能量5号电池家用高容量玩具遥控器电池', price: '9.90', sales: '已拼45.2万+', tag: '正品保障', cover: '🔋' },
  { id: 4, name: '1号大容量高能电池燃气灶热水器专用电池', price: '12.80', sales: '已拼18.4万+', tag: '破损包退', cover: '🔋' }
]

function selectCategoryOption(cat: string) {
  selectedCategory.value = cat
  showCategorySelect.value = false
  toast.success(`切换搜索类型为: ${cat}`)
}

function handleSearch(kw: string) {
  if (!kw.trim()) {
    toast.warning('请输入搜索词')
    return
  }
  searchKeyword.value = kw
  showResults.value = true
  if (!searchHistory.value.includes(kw)) {
    searchHistory.value = [kw, ...searchHistory.value].slice(0, 10)
  }
  toast.success(`搜素：${kw}`)
}

function clearHistory() {
  searchHistory.value = []
  toast.success('历史记录已清除')
}

// Sorting logic
function changeSort(sortType: string) {
  activeSort.value = sortType
  if (sortType === '价格') {
    priceSortOrder.value = priceSortOrder.value === 'desc' ? 'asc' : 'desc'
    toast.success(`按价格 ${priceSortOrder.value === 'desc' ? '从高到低' : '从低到高'} 排序`)
  } else {
    toast.success(`按 ${sortType} 排序`)
  }
}

// Filter drawer item selection
function toggleFilterOption(option: { label: string; selected: boolean }) {
  option.selected = !option.selected
}

function resetFilters() {
  Object.keys(filterOptionsMap).forEach(key => {
    filterOptionsMap[key].forEach(opt => opt.selected = false)
  })
  toast.success('筛选已重置')
}

function confirmFilters() {
  showFilterDrawer.value = false
  const activeCount = Object.values(filterOptionsMap)
    .flatMap(arr => arr)
    .filter(opt => opt.selected).length
  toast.success(`筛选成功：已选择 ${activeCount} 项过滤参数`)
}

// Reset view back to search homepage
function resetSearchPage() {
  showResults.value = false
  searchKeyword.value = ''
}
</script>

<template>
  <PageShell title="电商智能搜索" description="完美实现输入框分类下拉联想词列表，以及精细化分类侧滑筛选抽屉。">
    <view class="advanced-search-page">
      <wd-toast selector="advanced-search-toast" />

      <!-- ==========================================
           1. E-COMMERCE SEARCH BAR HEADER
           ========================================== -->
      <view class="search-bar-header flex items-center">
        <!-- Category selector dropdown trigger -->
        <view class="category-dropdown-trigger flex items-center" @click="showCategorySelect = !showCategorySelect">
          <text class="cat-label font-bold">{{ selectedCategory }}</text>
          <text class="arrow-down-icon ml-1">▼</text>
        </view>

        <!-- Main text input field -->
        <view class="search-input-field-wrap flex-1 ml-2 relative-context">
          <input
            v-model="searchKeyword"
            placeholder="请输入您的商品需求"
            class="main-search-input"
            confirm-type="search"
            @confirm="handleSearch(searchKeyword)"
          />
          <text v-if="searchKeyword" class="clear-icon" @click="searchKeyword = ''">×</text>
        </view>

        <!-- Action Search Button (Orange theme) -->
        <view class="search-submit-btn font-bold text-center ml-2" @click="handleSearch(searchKeyword)">
          搜索
        </view>

        <!-- Category Dropdown floating pane -->
        <view v-if="showCategorySelect" class="floating-category-select-pane">
          <view
            v-for="opt in categoryOptions"
            :key="opt"
            class="category-option-row text-center font-bold"
            @click="selectCategoryOption(opt)"
          >
            {{ opt }}
          </view>
        </view>
      </view>

      <!-- ==========================================
           2. TYPING AUTOSUGGEST DROPDOWN OVERLAY (Screenshot 1)
           ========================================== -->
      <view v-if="searchKeyword && !showResults" class="autosuggest-dropdown-panel mt-2">
        <view
          v-for="suggest in autosuggestions"
          :key="suggest"
          class="suggest-row flex items-center justify-between"
          @click="handleSearch(suggest)"
        >
          <text class="suggest-txt">{{ suggest }}</text>
          <text class="arrow-north-west">↗</text>
        </view>
      </view>

      <!-- ==========================================
           3. SEARCH PRE-STATE HOMEPAGE (History & Hot recommend)
           ========================================== -->
      <scroll-view v-if="!searchKeyword && !showResults" scroll-y class="search-prep-body mt-3">
        <!-- History Tags -->
        <view v-if="searchHistory.length > 0" class="history-section-box">
          <view class="section-title-row flex justify-between items-center">
            <text class="font-bold text-ink">历史搜索</text>
            <text class="delete-history-btn" @click="clearHistory">🗑️ 清空</text>
          </view>
          <view class="history-tags-grid mt-2">
            <view
              v-for="h in searchHistory"
              :key="h"
              class="history-tag-chip"
              @click="handleSearch(h)"
            >
              {{ h }}
            </view>
          </view>
        </view>

        <!-- Hot Recommendations -->
        <view class="hot-section-box mt-4">
          <view class="section-title font-bold text-ink mb-2">热门推荐</view>
          <view class="hot-cards-list">
            <view
              v-for="hot in hotRecommendations"
              :key="hot.rank"
              class="hot-item-row flex items-center"
              @click="handleSearch(hot.name)"
            >
              <text :class="['hot-rank-no', { 'top': hot.rank <= 3 }]">{{ hot.rank }}</text>
              <text class="hot-name flex-1 ml-2 text-ink">{{ hot.name }}</text>
              <wd-tag v-if="hot.tag" :type="hot.tag === '热' ? 'danger' : 'warning'" size="small">{{ hot.tag }}</wd-tag>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- ==========================================
           4. SEARCH RESULTS VIEW (Screenshot 2)
           ========================================== -->
      <view v-if="showResults" class="search-results-viewport mt-2">
        <!-- Active search keyword chip -->
        <view class="active-keyword-banner flex items-center justify-between">
          <view class="keyword-chip flex items-center">
            <text class="chip-text font-bold">{{ searchKeyword }}</text>
            <text class="chip-close-btn ml-1" @click="resetSearchPage">×</text>
          </view>
          <text class="results-meta-txt">为您找到相关好物</text>
        </view>

        <!-- Sub Sorting & Filter Bar -->
        <view class="sorting-filter-sub-bar mt-2 flex justify-between">
          <view :class="['sort-tab', { active: activeSort === '综合' }]" @click="changeSort('综合')">
            综合 ▼
          </view>
          <view :class="['sort-tab', { active: activeSort === '销量' }]" @click="changeSort('销量')">
            销量
          </view>
          <view :class="['sort-tab', { active: activeSort === '价格' }]" @click="changeSort('价格')">
            价格 <text class="price-arrow-icon">{{ priceSortOrder === 'desc' ? '↓' : '↑' }}</text>
          </view>
          <view :class="['sort-tab', { active: activeSort === '品牌' }]" @click="changeSort('品牌')">
            品牌
          </view>
          <view class="sort-tab filter-trigger font-bold text-red" @click="showFilterDrawer = true">
            筛选 ☰
          </view>
        </view>

        <!-- Product Cards Grid list -->
        <scroll-view scroll-y class="products-grid-scroll mt-2">
          <view class="products-grid-layout">
            <view
              v-for="p in mockProducts"
              :key="p.id"
              class="product-card-cell flex-column"
              @click="toast.success(`查看商品：${p.name}`)"
            >
              <view class="product-cover-box text-center">{{ p.cover }}</view>
              <view class="product-info-box mt-2">
                <view class="product-name font-bold text-ink">{{ p.name }}</view>
                <view class="product-tag-row mt-1">
                  <wd-tag size="small" type="danger" plain>{{ p.tag }}</wd-tag>
                </view>
                <view class="product-price-sales-row mt-2 flex items-center justify-between">
                  <text class="price-val font-bold text-red">¥{{ p.price }}</text>
                  <text class="sales-val">{{ p.sales }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- ==========================================
           5. MULTI-LEVEL FILTER DRAWER (Screenshot 2 right side)
           ========================================== -->
      <wd-popup
        v-model="showFilterDrawer"
        position="right"
        :z-index="2050"
        custom-style="z-index: 2050 !important; width: 85vw; height: 100vh;"
      >
        <view class="filter-drawer-container flex-column">
          <!-- Drawer Header -->
          <view class="filter-drawer-head font-bold">高级筛选</view>

          <!-- Middle Split layout: Left scroll vertical menu, Right grid options -->
          <view class="filter-body-split flex-1 flex">
            <!-- Left scroll category menu -->
            <scroll-view scroll-y class="filter-left-menu">
              <view
                v-for="cat in filterCategories"
                :key="cat.name"
                :class="['filter-menu-item', { active: activeFilterCategory === cat.name }]"
                @click="activeFilterCategory = cat.name"
              >
                {{ cat.name }}
              </view>
            </scroll-view>

            <!-- Right scroll grid content options -->
            <scroll-view scroll-y class="filter-right-grid-pane">
              <view class="active-category-headline font-bold mb-3">
                {{ activeFilterCategory }} 选择
              </view>

              <!-- Optional Min-Max price inputs (only for price ranges) -->
              <view v-if="activeFilterCategory === '价格区间'" class="price-range-inputs flex items-center mb-3">
                <input type="number" placeholder="最低价" class="min-max-input" />
                <text class="hyphen mx-2">-</text>
                <input type="number" placeholder="最高价" class="min-max-input" />
              </view>

              <!-- Tag select grid -->
              <view class="filter-tags-grid">
                <view
                  v-for="opt in filterOptionsMap[activeFilterCategory]"
                  :key="opt.label"
                  :class="['filter-select-chip', { selected: opt.selected }]"
                  @click="toggleFilterOption(opt)"
                >
                  {{ opt.label }}
                </view>
              </view>
            </scroll-view>
          </view>

          <!-- Bottom Fixed Action bar -->
          <view class="filter-footer-actions flex">
            <view class="footer-btn btn-reset font-bold text-center flex-1" @click="resetFilters">
              重置
            </view>
            <view class="footer-btn btn-confirm font-bold text-center flex-1" @click="confirmFilters">
              确定 (1万+件商品)
            </view>
          </view>
        </view>
      </wd-popup>

    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.advanced-search-page {
  position: relative;
  height: calc(100vh - 120rpx);
  display: flex;
  flex-direction: column;
  padding-bottom: 30rpx;
}

/* ==========================================
   E-COMMERCE SEARCH BAR HEADER STYLE
   ========================================== */
.search-bar-header {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 99rpx;
  padding: 10rpx 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.02);
  position: relative;
}

.category-dropdown-trigger {
  padding: 8rpx 16rpx;
  border-right: 1rpx solid var(--app-line);
  cursor: pointer;
}

.cat-label {
  font-size: 21rpx;
  color: var(--app-ink);
}

.arrow-down-icon {
  font-size: 14rpx;
  color: var(--app-muted);
}

.main-search-input {
  border: none;
  background: transparent;
  font-size: 21rpx;
  color: var(--app-ink);
  width: 100%;
}

.clear-icon {
  position: absolute;
  right: 12rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: var(--app-muted);
  padding: 8rpx;
  z-index: 3;
}

.search-submit-btn {
  background: linear-gradient(135deg, #ff5000 0%, #ff2000 100%);
  color: #fff;
  border-radius: 99rpx;
  font-size: 21rpx;
  padding: 12rpx 36rpx;
  cursor: pointer;
  
  &:active {
    opacity: 0.9;
  }
}

.floating-category-select-pane {
  position: absolute;
  left: 20rpx;
  top: 90rpx;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.15);
  width: 140rpx;
  z-index: 10;
}

.category-option-row {
  padding: 18rpx 0;
  font-size: 20rpx;
  color: var(--app-ink);
  border-bottom: 1rpx solid var(--app-line);
  
  &:last-child {
    border-bottom: none;
  }
}

/* ==========================================
   AUTOSUGGEST DROPDOWN PANEL (Screenshot 1)
   ========================================== */
.autosuggest-dropdown-panel {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
  max-height: 60vh;
  overflow-y: auto;
  z-index: 8;
}

.suggest-row {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid var(--app-line);
  cursor: pointer;
  
  &:active {
    background: #f8fafc;
  }
}

.suggest-txt {
  font-size: 21rpx;
  color: var(--app-ink);
}

.arrow-north-west {
  font-size: 22rpx;
  color: var(--app-muted);
}

/* Search Prep screen */
.search-prep-body {
  flex: 1;
  min-height: 0;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 24rpx;
}

.delete-history-btn {
  font-size: 18rpx;
  color: var(--app-muted);
  cursor: pointer;
}

.history-tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.history-tag-chip {
  background: #f1f5f9;
  border-radius: 8rpx;
  font-size: 19rpx;
  color: var(--app-ink);
  padding: 8rpx 20rpx;
  border: 1rpx solid var(--app-line);
  cursor: pointer;
}

.hot-cards-list {
  display: grid;
  gap: 16rpx;
}

.hot-item-row {
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 14rpx;
  cursor: pointer;
}

.hot-rank-no {
  font-size: 22rpx;
  font-weight: 800;
  color: var(--app-muted);
  width: 32rpx;
  text-align: center;
  
  &.top {
    color: #ff5000;
  }
}

.hot-name {
  font-size: 20rpx;
}

/* ==========================================
   SEARCH RESULTS VIEWPORT STYLE
   ========================================== */
.search-results-viewport {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.active-keyword-banner {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
}

.keyword-chip {
  background: #fee2e2;
  border: 1rpx solid #fecaca;
  color: #ef4444;
  border-radius: 99rpx;
  padding: 4rpx 20rpx;
}

.chip-text {
  font-size: 20rpx;
}

.chip-close-btn {
  font-size: 24rpx;
  cursor: pointer;
}

.results-meta-txt {
  font-size: 17rpx;
  color: var(--app-muted);
}

/* Sub-sorting and filtering strip */
.sorting-filter-sub-bar {
  background: #fff;
  border-bottom: 2rpx solid var(--app-line);
  padding: 18rpx 16rpx;
}

.sort-tab {
  font-size: 20rpx;
  color: var(--app-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4rpx;
  
  &.active {
    color: #ff5000;
    font-weight: 800;
  }
}

.price-arrow-icon {
  font-size: 16rpx;
}

.products-grid-scroll {
  flex: 1;
  min-height: 0;
}

.products-grid-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  padding-bottom: 60rpx;
}

.product-card-cell {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 20rpx;
  cursor: pointer;
  
  &:active {
    opacity: 0.9;
  }
}

.product-cover-box {
  height: 180rpx;
  background: #f8fafc;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80rpx;
}

.product-name {
  font-size: 19rpx;
  line-height: 1.4;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  height: 52rpx;
}

.price-val {
  font-size: 23rpx;
}

.sales-val {
  font-size: 16rpx;
  color: var(--app-muted);
}

/* ==========================================
   MULTI-LEVEL FILTER DRAWER STYLING
   ========================================== */
.filter-drawer-container {
  height: 100vh;
  background: #f8fafc;
}

.filter-drawer-head {
  padding: 32rpx;
  background: #fff;
  border-bottom: 1rpx solid var(--app-line);
  font-size: 22rpx;
  color: var(--app-ink);
}

.filter-body-split {
  overflow: hidden;
}

.filter-left-menu {
  width: 180rpx;
  background: #f1f5f9;
  border-right: 1rpx solid var(--app-line);
}

.filter-menu-item {
  padding: 28rpx 16rpx;
  font-size: 19rpx;
  color: var(--app-muted);
  text-align: center;
  cursor: pointer;
  border-bottom: 1rpx solid var(--app-line);
  
  &.active {
    background: #fff;
    color: #ff5000;
    font-weight: 800;
  }
}

.filter-right-grid-pane {
  flex: 1;
  background: #fff;
  padding: 28rpx;
}

.active-category-headline {
  font-size: 20rpx;
  color: var(--app-ink);
}

.price-range-inputs {
  gap: 12rpx;
}

.min-max-input {
  flex: 1;
  height: 60rpx;
  background: #f1f5f9;
  border-radius: 8rpx;
  font-size: 18rpx;
  text-align: center;
  color: var(--app-ink);
}

.hyphen {
  font-size: 24rpx;
  color: var(--app-muted);
}

.filter-tags-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.filter-select-chip {
  background: #f1f5f9;
  border: 1rpx solid var(--app-line);
  border-radius: 8rpx;
  padding: 16rpx 8rpx;
  font-size: 18rpx;
  text-align: center;
  color: var(--app-ink);
  cursor: pointer;
  
  &.selected {
    background: #ffebeb;
    border-color: #ff5000;
    color: #ff5000;
    font-weight: 800;
  }
}

/* Bottom Fixed Action bar */
.filter-footer-actions {
  background: #fff;
  border-top: 1rpx solid var(--app-line);
  padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom));
  gap: 16rpx;
}

.footer-btn {
  padding: 22rpx 0;
  border-radius: 99rpx;
  font-size: 21rpx;
  cursor: pointer;
}

.btn-reset {
  background: #f1f5f9;
  color: var(--app-ink);
  border: 1rpx solid var(--app-line);
}

.btn-confirm {
  background: linear-gradient(135deg, #ff5000 0%, #ff2000 100%);
  color: #fff;
}

.flex { display: flex; }
.flex-column { display: flex; flex-direction: column; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.font-bold { font-weight: 800; }
.text-ink { color: var(--app-ink); }
.text-red { color: #ff5000; }
.ml-1 { margin-left: 8rpx; }
.ml-2 { margin-left: 16rpx; }
.mt-1 { margin-top: 8rpx; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-4 { margin-top: 32rpx; }
.relative-context { position: relative; }
.mx-2 { margin-left: 16rpx; margin-right: 16rpx; }
</style>
