<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('address-toast')

interface Address {
  id: number
  name: string
  phone: string
  area: string
  detail: string
  isDefault: boolean
}

// Initial Address Data
const addresses = ref<Address[]>([
  { id: 1, name: '张小凡', phone: '13812345678', area: '北京市朝阳区', detail: '建国路 88 号 SOHO现代城 A座 1802室', isDefault: true },
  { id: 2, name: '碧瑶', phone: '13987654321', area: '上海市浦东新区', detail: '世纪大道 100 号 环球金融中心 75层', isDefault: false },
  { id: 3, name: '陆雪琪', phone: '18655556666', area: '浙江省杭州市西湖区', detail: '文三路 475 号 天堂软件园 B幢 5楼', isDefault: false }
])

// Checkout Selected Address
const selectedAddress = ref<Address | null>(addresses.value[0])

// Modal States
const showSheet = ref(false)
const sheetView = ref<'list' | 'form'>('list') // 'list' or 'form'
const searchKeyword = ref('')

// Form States (for creating/editing)
const editingId = ref<number | null>(null) // null means adding new
const formName = ref('')
const formPhone = ref('')
const formArea = ref('')
const formDetail = ref('')
const formDefault = ref(false)

// Filtered Addresses based on search keyword
const filteredAddresses = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return addresses.value
  return addresses.value.filter(
    addr => addr.name.toLowerCase().includes(keyword) || 
            addr.phone.includes(keyword) || 
            addr.area.toLowerCase().includes(keyword) || 
            addr.detail.toLowerCase().includes(keyword)
  )
})

function openAddressSheet() {
  sheetView.value = 'list'
  searchKeyword.value = ''
  showSheet.value = true
}

function selectAddress(addr: Address) {
  selectedAddress.value = addr
  showSheet.value = false
  toast.success(`收货地址已切换为：${addr.name}`)
}

// Enter address editing/adding form view
function enterFormView(addr?: Address) {
  if (addr) {
    // Edit existing
    editingId.value = addr.id
    formName.value = addr.name
    formPhone.value = addr.phone
    formArea.value = addr.area
    formDetail.value = addr.detail
    formDefault.value = addr.isDefault
  } else {
    // Add new
    editingId.value = null
    formName.value = ''
    formPhone.value = ''
    formArea.value = '北京市朝阳区'
    formDetail.value = ''
    formDefault.value = false
  }
  sheetView.value = 'form'
}

function leaveFormView() {
  sheetView.value = 'list'
}

// Save address logic (handles create and update)
function saveAddress() {
  if (!formName.value.trim()) {
    toast.warning('请输入收货人姓名')
    return
  }
  if (!formPhone.value.trim() || formPhone.value.trim().length !== 11) {
    toast.warning('请输入11位有效的手机号')
    return
  }
  if (!formDetail.value.trim()) {
    toast.warning('请输入详细收件地址')
    return
  }

  const isDefaultFlag = formDefault.value

  if (isDefaultFlag) {
    // Turn off other defaults
    addresses.value.forEach(addr => addr.isDefault = false)
  }

  if (editingId.value !== null) {
    // Edit
    const targetIdx = addresses.value.findIndex(a => a.id === editingId.value)
    if (targetIdx > -1) {
      addresses.value[targetIdx] = {
        id: editingId.value,
        name: formName.value.trim(),
        phone: formPhone.value.trim(),
        area: formArea.value,
        detail: formDetail.value.trim(),
        isDefault: isDefaultFlag
      }
      // If we edited the currently selected address, update it too
      if (selectedAddress.value && selectedAddress.value.id === editingId.value) {
        selectedAddress.value = addresses.value[targetIdx]
      }
      toast.success('收货地址已修改')
    }
  } else {
    // Add New
    const newAddress: Address = {
      id: Date.now(),
      name: formName.value.trim(),
      phone: formPhone.value.trim(),
      area: formArea.value,
      detail: formDetail.value.trim(),
      isDefault: isDefaultFlag
    }
    addresses.value.push(newAddress)
    if (isDefaultFlag || addresses.value.length === 1) {
      selectedAddress.value = newAddress
    }
    toast.success('收货地址添加成功')
  }

  sheetView.value = 'list'
}

function deleteAddress(id: number) {
  // If deleting selected address, clear it
  if (selectedAddress.value && selectedAddress.value.id === id) {
    selectedAddress.value = null
  }
  addresses.value = addresses.value.filter(a => a.id !== id)
  // Auto select default if available
  if (!selectedAddress.value && addresses.value.length > 0) {
    selectedAddress.value = addresses.value.find(a => a.isDefault) || addresses.value[0]
  }
  toast.success('地址删除成功')
}
</script>

<template>
  <PageShell title="可搜索地址选择" description="底部弹出收纳板，内置地址搜索、左右滑动快捷管理以及就地过渡编辑表单。">
    <view class="address-selector-page">
      <wd-toast selector="address-toast" />

      <!-- Checkout address display card -->
      <view class="checkout-simulator-card">
        <view class="simulator-header">
          <text class="sim-brand">🛒 结算中心</text>
          <text class="sim-mode">快递配送</text>
        </view>

        <!-- Selected Address Row -->
        <view class="selected-address-area" @click="openAddressSheet">
          <wd-icon name="location" size="24px" class="loc-icon" />
          <view v-if="selectedAddress" class="addr-details">
            <view class="addr-user-info">
              <text class="user-name">{{ selectedAddress.name }}</text>
              <text class="user-phone">{{ selectedAddress.phone }}</text>
              <wd-tag v-if="selectedAddress.isDefault" type="primary" size="small" class="ml-2">默认</wd-tag>
            </view>
            <view class="addr-text">{{ selectedAddress.area }} {{ selectedAddress.detail }}</view>
          </view>
          <view v-else class="addr-empty-msg">点击选择配送地址</view>
          <wd-icon name="arrow-right" size="18px" class="arrow-right-icon" />
        </view>

        <!-- Order Summary mockup -->
        <view class="order-bill-brief">
          <view class="bill-line">
            <text class="bill-label">商品金额</text>
            <text class="bill-val">¥329.00</text>
          </view>
          <view class="bill-line">
            <text class="bill-label">运费 (满减免运)</text>
            <text class="bill-val font-green">免邮</text>
          </view>
          <view class="bill-divider"></view>
          <view class="bill-line total">
            <text class="bill-label">合计应付</text>
            <text class="bill-val total-price">¥329.00</text>
          </view>
        </view>

        <wd-button type="primary" block size="large" class="checkout-btn">提交订单</wd-button>
      </view>

      <!-- Advanced Address Picker Bottom Sheet -->
      <wd-popup
        v-model="showSheet"
        position="bottom"
        safe-area-inset-bottom
        root-portal
        custom-class="address-sheet-popup"
        :z-index="1200"
      >
        <view class="sheet-container">
          <!-- LIST VIEW -->
          <template v-if="sheetView === 'list'">
            <view class="sheet-header">
              <text class="sheet-title">收货地址</text>
              <wd-icon name="add" size="20px" class="add-icon" @click="enterFormView()" />
            </view>

            <!-- Search input within popup -->
            <view class="popup-search-row">
              <view class="popup-search-input">
                <wd-icon name="search" size="16px" class="search-icon" />
                <input
                  v-model="searchKeyword"
                  type="text"
                  placeholder="搜索收货人姓名/手机号..."
                  class="native-search-field"
                />
              </view>
            </view>

            <scroll-view scroll-y class="address-scroll-list">
              <view v-if="filteredAddresses.length > 0" class="address-list-content">
                <!-- Address Card with Actions inside Sheet -->
                <view
                  v-for="addr in filteredAddresses"
                  :key="addr.id"
                  :class="['address-picker-card', { active: selectedAddress?.id === addr.id }]"
                >
                  <view class="picker-card-left" @click="selectAddress(addr)">
                    <view class="card-user-line">
                      <text class="c-name">{{ addr.name }}</text>
                      <text class="c-phone">{{ addr.phone }}</text>
                      <wd-tag v-if="addr.isDefault" type="primary" size="small" plain class="ml-1">默认</wd-tag>
                    </view>
                    <view class="card-detail-line">{{ addr.area }} {{ addr.detail }}</view>
                  </view>
                  
                  <!-- Actions Column -->
                  <view class="picker-card-actions">
                    <wd-icon name="edit" size="18px" class="action-icon edit" @click="enterFormView(addr)" />
                    <wd-icon name="delete" size="18px" class="action-icon delete" @click="deleteAddress(addr.id)" />
                  </view>
                </view>
              </view>

              <view v-else class="empty-list-view">
                <text class="empty-emoji">📍</text>
                <text class="empty-text-msg">没有找到匹配的地址</text>
              </view>
            </scroll-view>

            <view class="sheet-footer">
              <wd-button type="primary" block @click="enterFormView()">新增收货地址</wd-button>
            </view>
          </template>

          <!-- INLINE FORM VIEW (No Page Redirect) -->
          <template v-else-if="sheetView === 'form'">
            <view class="sheet-header">
              <wd-icon name="arrow-left" size="20px" class="back-icon" @click="leaveFormView" />
              <text class="sheet-title">{{ editingId !== null ? '编辑地址' : '新增收货地址' }}</text>
              <view class="header-placeholder"></view>
            </view>

            <scroll-view scroll-y class="address-form-body">
              <view class="form-inputs-group">
                <!-- Name -->
                <view class="form-row">
                  <text class="form-label">收货人</text>
                  <input
                    v-model="formName"
                    type="text"
                    placeholder="请输入收件人姓名"
                    class="form-input-field"
                  />
                </view>

                <!-- Phone -->
                <view class="form-row">
                  <text class="form-label">手机号码</text>
                  <input
                    v-model="formPhone"
                    type="number"
                    placeholder="请输入11位手机号"
                    class="form-input-field"
                    maxlength="11"
                  />
                </view>

                <!-- Area -->
                <view class="form-row">
                  <text class="form-label">所在地区</text>
                  <input
                    v-model="formArea"
                    type="text"
                    placeholder="比如: 浙江省杭州市西湖区"
                    class="form-input-field"
                  />
                </view>

                <!-- Detailed Address -->
                <view class="form-row textarea">
                  <text class="form-label">详细地址</text>
                  <textarea
                    v-model="formDetail"
                    placeholder="请输入街道、楼牌号等详细地址信息"
                    class="form-textarea-field"
                  />
                </view>

                <!-- Default Switch -->
                <view class="form-row flex-between">
                  <text class="form-label">设为默认收货地址</text>
                  <switch :checked="formDefault" @change="formDefault = !formDefault" color="#1e88e5" />
                </view>
              </view>
            </scroll-view>

            <view class="sheet-footer double-btn">
              <wd-button plain type="neutral" block @click="leaveFormView">取消</wd-button>
              <wd-button type="primary" block @click="saveAddress" class="ml-2">保存地址</wd-button>
            </view>
          </template>
        </view>
      </wd-popup>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.address-selector-page {
  display: grid;
  gap: 24rpx;
}

.checkout-simulator-card {
  border: 1rpx solid var(--app-line);
  border-radius: 20rpx;
  background: #fff;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.02);
}

.simulator-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 16rpx;
}

.sim-brand {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.sim-mode {
  font-size: 24rpx;
  color: var(--app-brand);
  font-weight: 700;
}

.selected-address-area {
  display: flex;
  align-items: center;
  background: #eff6ff;
  border: 2rpx dashed var(--app-brand);
  border-radius: 16rpx;
  padding: 24rpx 20rpx;
  cursor: pointer;
}

.loc-icon {
  color: var(--app-brand);
  margin-right: 18rpx;
}

.addr-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.addr-user-info {
  display: flex;
  align-items: center;
}

.user-name {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.user-phone {
  font-size: 26rpx;
  color: var(--app-muted);
  margin-left: 16rpx;
}

.ml-2 {
  margin-left: 16rpx;
}

.ml-1 {
  margin-left: 8rpx;
}

.addr-text {
  font-size: 23rpx;
  color: #475467;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.addr-empty-msg {
  flex: 1;
  font-size: 28rpx;
  color: var(--app-brand);
  font-weight: 700;
}

.arrow-right-icon {
  color: var(--app-brand);
  margin-left: 12rpx;
}

.order-bill-brief {
  background: #f8fafc;
  border-radius: 12rpx;
  padding: 18rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.bill-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
  color: var(--app-muted);
  
  &.total {
    font-size: 28rpx;
    color: var(--app-ink);
    font-weight: 800;
  }
}

.bill-label {
  font-weight: 700;
}

.bill-val {
  color: var(--app-ink);
  font-weight: 700;
  
  &.font-green {
    color: #10b981;
  }
  
  &.total-price {
    color: #ef4444;
    font-size: 32rpx;
    font-weight: 900;
  }
}

.bill-divider {
  border-top: 1rpx solid var(--app-line);
  margin: 6rpx 0;
}

/* Bottom Sheet Address Select styling */
:deep(.address-sheet-popup) {
  border-radius: 32rpx 32rpx 0 0;
  background: #fff;
  overflow: hidden;
}

.sheet-container {
  display: flex;
  flex-direction: column;
  height: 900rpx;
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

.add-icon,
.back-icon {
  color: var(--app-ink);
}

.header-placeholder {
  width: 40rpx;
}

.popup-search-row {
  padding: 16rpx 36rpx;
  border-bottom: 1rpx solid var(--app-line);
}

.popup-search-input {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 12rpx;
  padding: 0 20rpx;
  height: 72rpx;
}

.search-icon {
  color: var(--app-muted);
}

.native-search-field {
  flex: 1;
  margin-left: 10rpx;
  font-size: 26rpx;
  color: var(--app-ink);
  background: transparent;
  border: none;
  outline: none;
}

.address-scroll-list {
  flex: 1;
  overflow-y: auto;
}

.address-list-content {
  padding: 24rpx 36rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.address-picker-card {
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  transition: all 0.2s ease;
  
  &.active {
    border-color: var(--app-brand);
    background: #f0f7ff;
  }
}

.picker-card-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-user-line {
  display: flex;
  align-items: center;
}

.c-name {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.c-phone {
  font-size: 25rpx;
  color: var(--app-muted);
  margin-left: 12rpx;
}

.card-detail-line {
  font-size: 23rpx;
  color: #475467;
  line-height: 1.4;
}

.picker-card-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-left: 20rpx;
}

.action-icon {
  color: var(--app-muted);
  padding: 8rpx;
  
  &.edit {
    color: #1e88e5;
  }
  
  &.delete {
    color: #ef4444;
  }
}

.empty-list-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 0;
  gap: 16rpx;
}

.empty-emoji {
  font-size: 80rpx;
}

.empty-text-msg {
  font-size: 26rpx;
  color: var(--app-muted);
}

.sheet-footer {
  padding: 24rpx 36rpx calc(24rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid var(--app-line);
  background: #fff;
  
  &.double-btn {
    display: flex;
  }
}

/* Address Form Body styling */
.address-form-body {
  flex: 1;
  overflow-y: auto;
}

.form-inputs-group {
  padding: 24rpx 36rpx;
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid var(--app-line);
  padding: 24rpx 0;
  
  &.textarea {
    flex-direction: column;
    align-items: flex-start;
    gap: 16rpx;
  }
  
  &.flex-between {
    justify-content: space-between;
  }
}

.form-label {
  width: 160rpx;
  font-size: 26rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.form-input-field {
  flex: 1;
  font-size: 26rpx;
  color: var(--app-ink);
}

.form-textarea-field {
  width: 100%;
  height: 120rpx;
  font-size: 26rpx;
  color: var(--app-ink);
  line-height: 1.5;
}
</style>
