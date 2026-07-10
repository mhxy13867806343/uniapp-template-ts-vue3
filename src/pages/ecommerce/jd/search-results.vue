<script setup lang="ts">
import EcommercePageRenderer from '@/components/ecommerce/EcommercePageRenderer.vue'
import { getEcommercePageById } from '@/utils/ecommerceCatalog'

const page = getEcommercePageById('jd-search-results')
</script>

<template>
  <EcommercePageRenderer :page="page" />
</template>
