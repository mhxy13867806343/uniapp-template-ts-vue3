<script setup lang="ts">
import AppTabbar from './AppTabbar.vue'

defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <view class="page-root">
    <view class="page-section pt-5">
      <view class="text-7 font-700 leading-tight">{{ title }}</view>
      <view v-if="description" class="muted-text mt-2 leading-6">{{ description }}</view>
    </view>

    <view class="page-section">
      <slot />
    </view>

    <AppTabbar />
  </view>
</template>
