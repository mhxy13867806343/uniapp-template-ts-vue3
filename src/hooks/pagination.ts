export interface PagePaginationOptions {
  page?: number
  pageSize?: number
  total?: number
}

export interface StepPaginationOptions {
  offset?: number
  step?: number
  total?: number
}

export function usePagePagination(options: PagePaginationOptions = {}) {
  const page = ref(options.page || 1)
  const pageSize = ref(options.pageSize || 10)
  const total = ref(options.total || 0)

  const params = computed(() => ({
    page: page.value,
    pageSize: pageSize.value
  }))

  const totalPage = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  const hasMore = computed(() => page.value < totalPage.value)

  function setPage(value: number) {
    page.value = Math.max(1, value)
  }

  function setPageSize(value: number) {
    pageSize.value = Math.max(1, value)
    page.value = 1
  }

  function setTotal(value: number) {
    total.value = Math.max(0, value)
  }

  function nextPage() {
    if (!hasMore.value) return false
    page.value += 1
    return true
  }

  function reset() {
    page.value = options.page || 1
    pageSize.value = options.pageSize || 10
    total.value = options.total || 0
  }

  return {
    page,
    pageSize,
    total,
    params,
    totalPage,
    hasMore,
    setPage,
    setPageSize,
    setTotal,
    nextPage,
    reset
  }
}

export function useStepPagination(options: StepPaginationOptions = {}) {
  const offset = ref(options.offset || 0)
  const step = ref(options.step || 20)
  const total = ref(options.total || 0)

  const limit = computed(() => step.value)
  const visibleCount = computed(() => offset.value + limit.value)
  const hasMore = computed(() => total.value === 0 || visibleCount.value < total.value)
  const params = computed(() => ({
    offset: offset.value,
    limit: limit.value
  }))

  function setTotal(value: number) {
    total.value = Math.max(0, value)
  }

  function setStep(value: number) {
    step.value = Math.max(1, value)
    offset.value = options.offset || 0
  }

  function nextStep() {
    if (!hasMore.value) return false
    offset.value += step.value
    return true
  }

  function reset() {
    offset.value = options.offset || 0
    step.value = options.step || 20
    total.value = options.total || 0
  }

  return {
    offset,
    step,
    limit,
    total,
    visibleCount,
    params,
    hasMore,
    setTotal,
    setStep,
    nextStep,
    reset
  }
}
