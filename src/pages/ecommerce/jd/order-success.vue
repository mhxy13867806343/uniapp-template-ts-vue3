<script setup lang="ts">
import EcommercePageRenderer from '@/components/ecommerce/EcommercePageRenderer.vue'
import { getEcommercePageById } from '@/utils/ecommerceCatalog'

const page = getEcommercePageById('jd-order-success')
</script>

<template>
  <EcommercePageRenderer :page="page" />
</template>
