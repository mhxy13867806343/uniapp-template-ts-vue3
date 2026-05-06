<script setup lang="ts">
import { useAppStore, useUserStore } from '@/store'

const appStore = useAppStore()
const userStore = useUserStore()

function hideNativeTabBar() {
  uni.hideTabBar?.({
    animation: false,
    fail: () => {}
  })
}

onLaunch(() => {
  console.log('App Launch')
  appStore.initLocale()
  userStore.hydrate()
  hideNativeTabBar()
})

onShow(() => {
  console.log('App Show')
  hideNativeTabBar()
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
page {
  min-height: 100%;
  background: #f6f8fb;
}
</style>
