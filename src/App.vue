<script setup lang="ts">
function hideNativeTabBar() {
  uni.hideTabBar?.({
    animation: false,
    fail: () => {}
  })
}

onLaunch(() => {
  console.log('App Launch')
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
