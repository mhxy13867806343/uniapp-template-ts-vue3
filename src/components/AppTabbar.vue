<script setup lang="ts">
import { getActiveTabName, switchTabByName, tabbarItems, type TabbarName } from '@/utils/tabbar'

const active = ref<TabbarName>('home')

function syncActive() {
  active.value = getActiveTabName()
}

function handleTap(name: TabbarName) {
  active.value = name
  switchTabByName(name)
}

function handleChange({ value }: { value: TabbarName | string | number }) {
  handleTap(value as TabbarName)
}

onShow(syncActive)
syncActive()
</script>

<template>
  <wd-tabbar
    v-model="active"
    fixed
    placeholder
    bordered
    safe-area-inset-bottom
    custom-class="app-tabbar"
    active-color="var(--app-brand)"
    inactive-color="var(--app-muted)"
    :z-index="900"
    @change="handleChange"
  >
    <template v-for="item in tabbarItems" :key="item.name">
      <wd-tabbar-item
        v-if="item.name === 'components'"
        :name="item.name"
        custom-class="app-tabbar-item app-tabbar-item--center"
      >
        <template #icon>
          <view class="app-tabbar-center">
            <view class="app-tabbar-center__button">
              <wd-icon name="app" size="26px" custom-class="app-tabbar-center__icon" />
            </view>
            <text class="app-tabbar-center__title">{{ item.title }}</text>
          </view>
        </template>
      </wd-tabbar-item>

      <wd-tabbar-item
        v-else
        :name="item.name"
        :title="item.title"
        :icon="item.icon"
        custom-class="app-tabbar-item"
      />
    </template>
  </wd-tabbar>
</template>

<style lang="scss" scoped>
:deep(.app-tabbar) {
  height: 112rpx;
  overflow: visible;
  box-shadow: 0 -8rpx 24rpx rgb(16 24 40 / 8%);
}

:deep(.app-tabbar-item) {
  overflow: visible;
}

:deep(.app-tabbar-item--center) {
  align-items: flex-start;
}

.app-tabbar-center {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 4rpx;
  transform: translateY(-28rpx);
}

.app-tabbar-center__button {
  display: flex;
  width: 96rpx;
  height: 96rpx;
  align-items: center;
  justify-content: center;
  border: 8rpx solid #fff;
  border-radius: 50%;
  background: var(--app-brand);
  box-shadow: 0 12rpx 28rpx rgb(30 136 229 / 32%);
}

:deep(.app-tabbar-center__icon) {
  color: #fff;
}

.app-tabbar-center__title {
  color: var(--app-brand);
  font-size: 22rpx;
  line-height: 1;
}
</style>
