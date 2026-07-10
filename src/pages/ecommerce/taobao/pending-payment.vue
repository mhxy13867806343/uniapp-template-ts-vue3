<script setup lang="ts">
import EcommercePageRenderer from '@/components/ecommerce/EcommercePageRenderer.vue'
import { getEcommercePageById } from '@/utils/ecommerceCatalog'

const page = getEcommercePageById('taobao-pending-payment')
</script>

<template>
  <EcommercePageRenderer :page="page" />
</template>
