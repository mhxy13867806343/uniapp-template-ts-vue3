<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

interface Product {
  id: number
  name: string
  category: string
  price: number
  date: string
  status: string
  image: string
}

const toast = useToast('filter-toast')

// Mock Data
const allProducts: Product[] = [
  { id: 1, name: 'iPhone 15 Pro Max', category: '电子', price: 9999, date: '2026-07-01', status: '在售', image: '📱' },
  { id: 2, name: '极简机械键盘', category: '电子', price: 599, date: '2026-07-03', status: '在售', image: '⌨️' },
  { id: 3, name: '抗皱长袖衬衫', category: '服装', price: 299, date: '2026-06-25', status: '在售', image: '👕' },
  { id: 4, name: '人体工学网椅', category: '家居', price: 1299, date: '2026-06-10', status: '缺货', image: '🪑' },
  { id: 5, name: 'Vue 3 实战指南', category: '图书', price: 89, date: '2026-07-06', status: '在售', image: '📚' },
  { id: 6, name: '降噪无线耳机', category: '电子', price: 1999, date: '2026-07-05', status: '缺货', image: '🎧' },
  { id: 7, name: '纯棉百搭T恤', category: '服装', price: 99, date: '2026-07-02', status: '在售', image: '👕' },
  { id: 8, name: '智能扫地机器人', category: '家居', price: 3299, date: '2026-05-20', status: '预售', image: '🧹' }
]

// Filter States
const showDrawer = ref(false)
const searchKeyword = ref('')
const selectedCategories = ref<string[]>([])
const minPrice = ref<string>('')
const maxPrice = ref<string>('')
const datePreset = ref<string>('all') // all, today, week, month
const selectedStatuses = ref<string[]>([])

// Confirmed Filters (that actually apply to the list)
const activeFilters = ref({
  categories: [] as string[],
  minPrice: null as number | null,
  maxPrice: null as number | null,
  datePreset: 'all',
  statuses: [] as string[]
})

// UI data options
const categoriesList = ['电子', '服装', '家居', '图书']
const statusList = ['在售', '预售', '缺货']
const datePresets = [
  { label: '全部时间', value: 'all' },
  { label: '今天', value: 'today' },
  { label: '最近7天', value: 'week' },
  { label: '最近30天', value: 'month' }
]

// Computed Products List
const filteredProducts = computed(() => {
  return allProducts.filter((product) => {
    // 关键字搜索
    if (searchKeyword.value.trim() && !product.name.includes(searchKeyword.value.trim())) {
      return false
    }
    // 分类过滤
    if (activeFilters.value.categories.length > 0 && !activeFilters.value.categories.includes(product.category)) {
      return false
    }
    // 价格区间过滤
    if (activeFilters.value.minPrice !== null && product.price < activeFilters.value.minPrice) {
      return false
    }
    if (activeFilters.value.maxPrice !== null && product.price > activeFilters.value.maxPrice) {
      return false
    }
    // 状态过滤
    if (activeFilters.value.statuses.length > 0 && !activeFilters.value.statuses.includes(product.status)) {
      return false
    }
    // 日期范围过滤
    if (activeFilters.value.datePreset !== 'all') {
      const now = new Date('2026-07-07') // mock当前时间
      const productDate = new Date(product.date)
      const diffTime = now.getTime() - productDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (activeFilters.value.datePreset === 'today' && diffDays > 1) {
        return false
      }
      if (activeFilters.value.datePreset === 'week' && diffDays > 7) {
        return false
      }
      if (activeFilters.value.datePreset === 'month' && diffDays > 30) {
        return false
      }
    }
    return true
  })
})

// Toggle selection helpers
function toggleCategory(cat: string) {
  const index = selectedCategories.value.indexOf(cat)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(cat)
  }
}

// Toggle status selection
function toggleStatus(status: string) {
  const index = selectedStatuses.value.indexOf(status)
  if (index > -1) {
    selectedStatuses.value.splice(index, 1)
  } else {
    selectedStatuses.value.push(status)
  }
}

// Reset Drawer inputs
function resetFilters() {
  selectedCategories.value = []
  minPrice.value = ''
  maxPrice.value = ''
  datePreset.value = 'all'
  selectedStatuses.value = []
  toast.success('已重置筛选条件')
}

// Apply Filters
function applyFilters() {
  const min = minPrice.value ? parseFloat(minPrice.value) : null
  const max = maxPrice.value ? parseFloat(maxPrice.value) : null

  if (min !== null && max !== null && min > max) {
    toast.error('最低价不能大于最高价')
    return
  }

  activeFilters.value = {
    categories: [...selectedCategories.value],
    minPrice: min,
    maxPrice: max,
    datePreset: datePreset.value,
    statuses: [...selectedStatuses.value]
  }

  showDrawer.value = false
  toast.success(`筛选成功，共找到 ${filteredProducts.value.length} 件商品`)
}

// Remove single active filter tag from UI list
function removeCategoryFilter(cat: string) {
  activeFilters.value.categories = activeFilters.value.categories.filter(c => c !== cat)
  selectedCategories.value = [...activeFilters.value.categories]
}

function removeStatusFilter(status: string) {
  activeFilters.value.statuses = activeFilters.value.statuses.filter(s => s !== status)
  selectedStatuses.value = [...activeFilters.value.statuses]
}

function clearPriceFilter() {
  activeFilters.value.minPrice = null
  activeFilters.value.maxPrice = null
  minPrice.value = ''
  maxPrice.value = ''
}

function clearDateFilter() {
  activeFilters.value.datePreset = 'all'
  datePreset.value = 'all'
}

const hasActiveFilters = computed(() => {
  return activeFilters.value.categories.length > 0 ||
    activeFilters.value.minPrice !== null ||
    activeFilters.value.maxPrice !== null ||
    activeFilters.value.datePreset !== 'all' ||
    activeFilters.value.statuses.length > 0
})

function clearAllFilters() {
  resetFilters()
  activeFilters.value = {
    categories: [],
    minPrice: null,
    maxPrice: null,
    datePreset: 'all',
    statuses: []
  }
}
</script>

<template>
  <PageShell title="高级筛选抽屉" description="右侧抽屉式多维度筛选，支持分类、价格区间校验及日期范围筛选。">
    <view class="filter-drawer-page">
      <wd-toast selector="filter-toast" />

      <!-- Top Tools -->
      <view class="search-bar-row">
        <view class="search-input-wrap">
          <wd-icon name="search" size="18px" class="search-icon" />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索商品名称..."
            class="native-search-input"
          />
        </view>
        <wd-button type="primary" size="medium" @click="showDrawer = true">
          <view class="btn-inner">
            <wd-icon name="filter" size="16px" />
            <text class="ml-1">筛选</text>
          </view>
        </wd-button>
      </view>

      <!-- Active Filters Display -->
      <view v-if="hasActiveFilters" class="active-chips-box">
        <view class="chips-title">已选条件:</view>
        <view class="chips-list">
          <wd-tag
            v-for="cat in activeFilters.categories"
            :key="cat"
            closable
            type="primary"
            class="chip-tag"
            @close="removeCategoryFilter(cat)"
          >
            {{ cat }}
          </wd-tag>
          <wd-tag
            v-for="status in activeFilters.statuses"
            :key="status"
            closable
            type="warning"
            class="chip-tag"
            @close="removeStatusFilter(status)"
          >
            {{ status }}
          </wd-tag>
          <wd-tag
            v-if="activeFilters.minPrice !== null || activeFilters.maxPrice !== null"
            closable
            type="error"
            class="chip-tag"
            @close="clearPriceFilter"
          >
            价格: ¥{{ activeFilters.minPrice ?? 0 }} - ¥{{ activeFilters.maxPrice ?? '不限' }}
          </wd-tag>
          <wd-tag
            v-if="activeFilters.datePreset !== 'all'"
            closable
            type="success"
            class="chip-tag"
            @close="clearDateFilter"
          >
            时间: {{ datePresets.find(p => p.value === activeFilters.datePreset)?.label }}
          </wd-tag>
          <text class="clear-all-link" @click="clearAllFilters">清除全部</text>
        </view>
      </view>

      <!-- Products Grid -->
      <view class="results-stats">
        共找到 <text class="highlight-count">{{ filteredProducts.length }}</text> 件商品
      </view>

      <view v-if="filteredProducts.length > 0" class="products-grid">
        <view v-for="item in filteredProducts" :key="item.id" class="product-card">
          <view class="product-cover">{{ item.image }}</view>
          <view class="product-info">
            <view class="product-name">{{ item.name }}</view>
            <view class="product-category-row">
              <wd-tag size="small" type="primary" plain>{{ item.category }}</wd-tag>
              <wd-tag size="small" :type="item.status === '在售' ? 'success' : 'warning'" plain class="ml-1">
                {{ item.status }}
              </wd-tag>
            </view>
            <view class="price-date-row">
              <text class="product-price">¥{{ item.price }}</text>
              <text class="product-date">{{ item.date }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty-placeholder">
        <wd-icon name="warning" size="48px" class="empty-icon" />
        <view class="empty-text">没有找到符合条件的商品</view>
        <wd-button type="primary" plain size="small" @click="clearAllFilters" class="mt-3">
          重置所有筛选
        </wd-button>
      </view>

      <!-- Advanced Right Filter Drawer -->
      <wd-popup
        v-model="showDrawer"
        position="right"
        custom-class="filter-drawer-popup"
        :z-index="1200"
      >
        <view class="drawer-container">
          <view class="drawer-header">
            <text class="drawer-title">高级筛选</text>
            <wd-icon name="close" size="20px" class="close-icon" @click="showDrawer = false" />
          </view>

          <scroll-view scroll-y class="drawer-body">
            <!-- Categories -->
            <view class="filter-section">
              <view class="section-title">商品分类</view>
              <view class="grid-buttons">
                <view
                  v-for="cat in categoriesList"
                  :key="cat"
                  :class="['grid-btn', { active: selectedCategories.includes(cat) }]"
                  @click="toggleCategory(cat)"
                >
                  {{ cat }}
                </view>
              </view>
            </view>

            <!-- Price Range -->
            <view class="filter-section">
              <view class="section-title">价格区间 (元)</view>
              <view class="price-inputs">
                <input
                  v-model="minPrice"
                  type="number"
                  placeholder="最低价"
                  class="price-input"
                />
                <text class="price-divider">-</text>
                <input
                  v-model="maxPrice"
                  type="number"
                  placeholder="最高价"
                  class="price-input"
                />
              </view>
            </view>

            <!-- Quick Date Preset -->
            <view class="filter-section">
              <view class="section-title">发布时间</view>
              <view class="grid-buttons">
                <view
                  v-for="preset in datePresets"
                  :key="preset.value"
                  :class="['grid-btn', { active: datePreset === preset.value }]"
                  @click="datePreset = preset.value"
                >
                  {{ preset.label }}
                </view>
              </view>
            </view>

            <!-- Statuses -->
            <view class="filter-section">
              <view class="section-title">销售状态</view>
              <view class="grid-buttons">
                <view
                  v-for="status in statusList"
                  :key="status"
                  :class="['grid-btn', { active: selectedStatuses.includes(status) }]"
                  @click="toggleStatus(status)"
                >
                  {{ status }}
                </view>
              </view>
            </view>
          </scroll-view>

          <!-- Drawer Footer Actions -->
          <view class="drawer-footer">
            <wd-button plain type="neutral" block @click="resetFilters">重置</wd-button>
            <wd-button type="primary" block @click="applyFilters" class="ml-2">确定</wd-button>
          </view>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.filter-drawer-page {
  display: grid;
  gap: 20rpx;
}

.search-bar-row {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  padding: 0 20rpx;
  height: 80rpx;
}

.search-icon {
  color: var(--app-muted);
}

.native-search-input {
  flex: 1;
  margin-left: 12rpx;
  font-size: 28rpx;
  color: var(--app-ink);
  background: transparent;
  border: none;
  outline: none;
}

.btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ml-1 {
  margin-left: 8rpx;
}

.ml-2 {
  margin-left: 16rpx;
}

.mt-3 {
  margin-top: 24rpx;
}

.active-chips-box {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  padding: 20rpx;
}

.chips-title {
  color: var(--app-muted);
  font-size: 24rpx;
  margin-top: 4rpx;
  white-space: nowrap;
}

.chips-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  align-items: center;
}

.chip-tag {
  font-size: 22rpx;
}

.clear-all-link {
  color: var(--app-brand);
  font-size: 24rpx;
  font-weight: 700;
  margin-left: 8rpx;
  cursor: pointer;
}

.results-stats {
  font-size: 26rpx;
  color: var(--app-muted);
  font-weight: 700;
}

.highlight-count {
  color: var(--app-brand);
  font-weight: 900;
  margin: 0 6rpx;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.product-card {
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.product-cover {
  height: 220rpx;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80rpx;
}

.product-info {
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.product-name {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--app-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-category-row {
  display: flex;
  align-items: center;
}

.price-date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6rpx;
}

.product-price {
  font-size: 32rpx;
  font-weight: 900;
  color: #ef4444;
}

.product-date {
  font-size: 22rpx;
  color: var(--app-muted);
}

.empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  border: 1rpx dashed var(--app-line);
  border-radius: 16rpx;
  background: #fff;
}

.empty-icon {
  color: var(--app-muted);
}

.empty-text {
  margin-top: 18rpx;
  color: var(--app-muted);
  font-size: 28rpx;
  font-weight: 700;
}

/* Right Filter Drawer Styles */
:deep(.filter-drawer-popup) {
  height: 100%;
  width: 600rpx;
  background: #fff;
  border-radius: 0;
}

.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: env(safe-area-inset-top);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid var(--app-line);
}

.drawer-title {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--app-ink);
}

.close-icon {
  color: var(--app-muted);
}

.drawer-body {
  flex: 1;
  padding: 30rpx;
  overflow-y: auto;
}

.filter-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--app-ink);
  margin-bottom: 20rpx;
}

.grid-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.grid-btn {
  background: #f1f5f9;
  border: 1rpx solid transparent;
  color: var(--app-muted);
  border-radius: 10rpx;
  padding: 18rpx 0;
  text-align: center;
  font-size: 26rpx;
  font-weight: 700;
  transition: all 0.2s ease;

  &.active {
    background: #eff6ff;
    border-color: var(--app-brand);
    color: var(--app-brand);
  }
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.price-input {
  flex: 1;
  height: 72rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
  text-align: center;
  font-size: 26rpx;
  color: var(--app-ink);
  background: #f8fafc;
}

.price-divider {
  color: var(--app-muted);
}

.drawer-footer {
  display: flex;
  padding: 24rpx 30rpx calc(24rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid var(--app-line);
  background: #fff;
}
</style>
