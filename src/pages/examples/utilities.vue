<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import {
  formatDateTime,
  formatRelativeTime,
  formatWeekday,
  formatDateRange,
  formatCountdown,
  formatCurrency,
  formatPercent,
  formatSignedNumber,
  formatCompactNumber,
  formatFileSize,
  formatDuration,
  maskPhone,
  maskBankCard,
  formatBankCard,
  formatQuery,
  numberToChinese,
  getSpecialLength,
  truncateBySpecialLength
} from '@/utils/format'
import {
  zip,
  range as pyRange,
  chunk as rustChunk,
  groupBy,
  titleCase,
  slugify,
  safeRun,
  uniqBy,
  compact
} from '@/utils/poly'

const toast = useToast('util-toast')
const activeTab = ref('all')

// Tab list
const tabs = [
  { title: '全部', name: 'all' },
  { title: 'Python/Rust 风格', name: 'language' },
  { title: '时间与日期', name: 'datetime' },
  { title: '数据格式化', name: 'format' },
  { title: '脱敏与校验', name: 'security' }
]

// ==========================================
// 交互状态绑定
// ==========================================

// 1. Python/Rust: zip
const zipKeys = ref('Apple, Banana, Orange, Peach')
const zipValues = ref('10, 15, 22, 8')
const zipResult = computed(() => {
  const k = zipKeys.value.split(',').map(s => s.trim())
  const v = zipValues.value.split(',').map(s => s.trim())
  return zip(k, v)
})

// 2. Python: range
const rangeStart = ref(0)
const rangeEnd = ref(10)
const rangeStep = ref(2)
const rangeResult = computed(() => {
  return pyRange(rangeStart.value, rangeEnd.value, rangeStep.value)
})

// 3. Rust: chunks
const chunkSource = ref('1,2,3,4,5,6,7,8,9')
const chunkSize = ref(3)
const chunkResult = computed(() => {
  const arr = chunkSource.value.split(',').map(s => s.trim())
  return rustChunk(arr, chunkSize.value)
})

// 4. GroupBy
const groupInput = ref([
  { name: '西瓜', cat: '水果' },
  { name: '西红柿', cat: '蔬菜' },
  { name: '苹果', cat: '水果' },
  { name: '土豆', cat: '蔬菜' },
  { name: '牛肉', cat: '肉类' }
])
const groupResult = computed(() => {
  return groupBy(groupInput.value, x => x.cat)
})

// 5. Python Style text cases
const rawCaseStr = ref('python_AND_rust_are_AWESOME!')
const slugResult = computed(() => slugify(rawCaseStr.value))
const titleResult = computed(() => titleCase(rawCaseStr.value.replace(/_/g, ' ')))

// 6. Rust Result: safeRun
const jsonRaw = ref('{"name": "Gemini", "year": 2026}')
const safeResult = computed(() => {
  return safeRun(() => JSON.parse(jsonRaw.value))
})

// 7. Date inputs
const rawDateInput = ref(Date.now())
const relativeTargetTime = ref(Date.now() - 3600000 * 3) // 3 hours ago

// 8. Number converters
const chineseNumInput = ref(20261024.5)
const byteSizeInput = ref(134217728) // 128 MB

// 9. Mask forms
const inputPhone = ref('13800138000')
const inputCard = ref('6222888866661234')
</script>

<template>
  <PageShell title="工具方法百宝箱" description="集成高频业务格式化函数，以及 Python/Rust 强类型语言好用的 API 实现。">
    <view class="utilities-page">
      <wd-toast selector="util-toast" />

      <!-- Tabs Category Navigator -->
      <wd-tabs v-model="activeTab" class="sticky-tabs">
        <wd-tab v-for="t in tabs" :key="t.name" :title="t.title" :name="t.name" />
      </wd-tabs>

      <!-- TAB 1: Python/Rust style APIs -->
      <view v-if="['all', 'language'].includes(activeTab)" class="category-block">
        <view class="category-header">🐍 Python / 🦀 Rust 风格高阶 API</view>

        <!-- 1. Zip Pairs -->
        <view class="utility-panel">
          <view class="panel-head">
            <text class="panel-title">① zip([A], [B]) 打包合并</text>
            <wd-tag type="primary">Python / Rust</wd-tag>
          </view>
          <view class="panel-intro">并行将两个数组对应索引值配对成元组，按最短长度截断。</view>
          
          <view class="interactive-sandbox">
            <wd-input v-model="zipKeys" label="键数组" placeholder="逗号分隔" />
            <wd-input v-model="zipValues" label="值数组" placeholder="逗号分隔" class="mt-2" />
            
            <view class="output-box mt-3">
              <view class="output-label">运行结果 (Zipped Pairs)：</view>
              <view class="output-code">{{ JSON.stringify(zipResult) }}</view>
            </view>
          </view>
        </view>

        <!-- 2. Range list -->
        <view class="utility-panel">
          <view class="panel-head">
            <text class="panel-title">② range(start, stop, step) 范围生成</text>
            <wd-tag type="primary">Python</wd-tag>
          </view>
          <view class="panel-intro">快捷生成等差数列列表，支持自定义步长和负向数列。</view>

          <view class="interactive-sandbox">
            <view class="grid-three">
              <wd-input-number v-model="rangeStart" label="起始值" />
              <wd-input-number v-model="rangeEnd" label="结束值" class="ml-2" />
              <wd-input-number v-model="rangeStep" label="步长" class="ml-2" />
            </view>

            <view class="output-box mt-3">
              <view class="output-label">生成列表 (Range List)：</view>
              <view class="output-code">{{ JSON.stringify(rangeResult) }}</view>
            </view>
          </view>
        </view>

        <!-- 3. Chunks -->
        <view class="utility-panel">
          <view class="panel-head">
            <text class="panel-title">③ chunk(array, size) 分块划分</text>
            <wd-tag type="warning">Rust (.chunks)</wd-tag>
          </view>
          <view class="panel-intro">按指定长度大小对一维数组进行分组平铺切割成二维数组。</view>

          <view class="interactive-sandbox">
            <wd-input v-model="chunkSource" label="原数组" placeholder="逗号分隔" />
            <view class="flex items-center mt-2">
              <text class="label-txt">每块大小：</text>
              <wd-input-number v-model="chunkSize" :min="1" />
            </view>

            <view class="output-box mt-3">
              <view class="output-label">切块结果 (Chunked Rows)：</view>
              <view class="output-code">{{ JSON.stringify(chunkResult) }}</view>
            </view>
          </view>
        </view>

        <!-- 4. GroupBy -->
        <view class="utility-panel">
          <view class="panel-head">
            <text class="panel-title">④ groupBy(array, key_fn) 按属性分类</text>
            <wd-tag type="warning">Python (itertools)</wd-tag>
          </view>
          <view class="panel-intro">自定义分类特征函数，对对象数组进行多维哈希聚类分组。</view>

          <view class="interactive-sandbox">
            <view class="data-preview-list">
              <text class="data-badge" v-for="g in groupInput" :key="g.name">{{ g.name }}({{ g.cat }})</text>
            </view>

            <view class="output-box mt-3">
              <view class="output-label">聚类分组结果 (Grouped Object)：</view>
              <view class="output-code">{{ JSON.stringify(groupResult, null, 2) }}</view>
            </view>
          </view>
        </view>

        <!-- 5. Cases transformation -->
        <view class="utility-panel">
          <view class="panel-head">
            <text class="panel-title">⑤ titleCase / slugify 字符转换</text>
            <wd-tag type="primary">Python</wd-tag>
          </view>
          <view class="panel-intro">首字母大写转换 (titleCase) 与符合 URL 链接规范的横线小写字串转化 (slugify)。</view>

          <view class="interactive-sandbox">
            <wd-input v-model="rawCaseStr" label="待转换文本" />

            <view class="output-grid mt-3">
              <view class="out-col">
                <text class="col-head">Title Case (首字母大写)</text>
                <text class="col-val">{{ titleResult }}</text>
              </view>
              <view class="out-col">
                <text class="col-head">Slugify (URL格式化)</text>
                <text class="col-val">{{ slugResult }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 6. SafeRun Result -->
        <view class="utility-panel">
          <view class="panel-head">
            <text class="panel-title">⑥ safeRun(() => T) 安全异常防护</text>
            <wd-tag type="warning">Rust (Result)</wd-tag>
          </view>
          <view class="panel-intro">包裹可能抛出错误的危险同步操作（如JSON解析），返回带 ok 的 Result 对象而不发生崩溃。</view>

          <view class="interactive-sandbox">
            <wd-input v-model="jsonRaw" label="JSON文本" placeholder="输入合法的或非法的JSON" />

            <view class="output-box mt-3">
              <view class="output-label">执行结果 (Safe Run Result)：</view>
              <view :class="['output-code', safeResult.ok ? 'text-green' : 'text-red']">
                {{ JSON.stringify(safeResult) }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- TAB 2: Date & Time -->
      <view v-if="['all', 'datetime'].includes(activeTab)" class="category-block">
        <view class="category-header">⏰ 高阶日期时间辅助</view>

        <view class="utility-panel">
          <view class="panel-head">
            <text class="panel-title">⑦ 格式化、相对时间与星期</text>
            <wd-tag type="success">dayjs</wd-tag>
          </view>
          <view class="panel-intro">日期时间多样化格式拼接输出、动态相对时间（刚刚、几小时前）及本地化星期解析。</view>

          <view class="interactive-sandbox flex-col gap-2">
            <view class="time-row">
              <text class="time-label">输入时间戳：</text>
              <text class="time-val">{{ rawDateInput }}</text>
            </view>
            <view class="time-row">
              <text class="time-label">常规格式化：</text>
              <text class="time-val text-brand">{{ formatDateTime(rawDateInput, 'YYYY年MM月DD日 HH:mm:ss') }}</text>
            </view>
            <view class="time-row">
              <text class="time-label">星期转换：</text>
              <text class="time-val text-brand">{{ formatWeekday(rawDateInput, '本周') }}</text>
            </view>
            
            <view class="divider-line"></view>

            <view class="flex items-center justify-between">
              <text class="time-label">相对目标时间：</text>
              <wd-button size="small" type="primary" plain @click="relativeTargetTime = Date.now() - 3600000 * 2">设为2小时前</wd-button>
            </view>
            <view class="time-row">
              <text class="time-label">计算相对时间：</text>
              <text class="time-val text-orange font-bold">{{ formatRelativeTime(relativeTargetTime) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- TAB 3: Data Format -->
      <view v-if="['all', 'format'].includes(activeTab)" class="category-block">
        <view class="category-header">📊 商业化数据格式化</view>

        <view class="utility-panel">
          <view class="panel-head">
            <text class="panel-title">⑧ 数字与中文化金额、文件大小转换</text>
          </view>
          <view class="panel-intro">数字大额自动转换为中文繁体文字（支持小数）、金融货币格式、网络字节大小智能适配展示。</view>

          <view class="interactive-sandbox">
            <wd-input v-model="chineseNumInput" type="number" label="数值" />
            <view class="time-row mt-3">
              <text class="time-label">中文读数：</text>
              <text class="time-val text-brand font-bold">{{ numberToChinese(chineseNumInput) }}</text>
            </view>
            <view class="time-row mt-2">
              <text class="time-label">金融货币：</text>
              <text class="time-val text-red font-bold">{{ formatCurrency(chineseNumInput) }}</text>
            </view>

            <view class="divider-line"></view>

            <wd-input v-model="byteSizeInput" type="number" label="文件字节 (B)" />
            <view class="time-row mt-3">
              <text class="time-label">转换文件大小：</text>
              <text class="time-val text-brand font-bold">{{ formatFileSize(byteSizeInput) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- TAB 4: Desensitization & Validation -->
      <view v-if="['all', 'security'].includes(activeTab)" class="category-block">
        <view class="category-header">🔒 安全脱敏与格式遮罩</view>

        <view class="utility-panel">
          <view class="panel-head">
            <text class="panel-title">⑨ 银行卡、手机号脱敏与四位空格格式化</text>
          </view>
          <view class="panel-intro">对敏感手机、银行卡字符串进行中部防泄漏星号打码，或自动插入空格增强可读性。</view>

          <view class="interactive-sandbox">
            <wd-input v-model="inputPhone" label="手机号输入" maxlength="11" />
            <view class="time-row mt-3">
              <text class="time-label">脱敏输出：</text>
              <text class="time-val text-orange font-bold">{{ maskPhone(inputPhone) }}</text>
            </view>

            <view class="divider-line"></view>

            <wd-input v-model="inputCard" label="银行卡号输入" maxlength="19" />
            <view class="time-row mt-3">
              <text class="time-label">脱敏输出：</text>
              <text class="time-val text-orange font-bold">{{ maskBankCard(inputCard) }}</text>
            </view>
            <view class="time-row mt-2">
              <text class="time-label">四位空格格式化：</text>
              <text class="time-val text-brand font-bold">{{ formatBankCard(inputCard) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.utilities-page {
  display: grid;
  gap: 28rpx;
  padding-bottom: 60rpx;
}

.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f8fafc;
}

.category-block {
  display: grid;
  gap: 20rpx;
}

.category-header {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--app-brand);
  margin-top: 10rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid var(--app-brand);
}

.utility-panel {
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #fff;
  padding: 24rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.01);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.panel-title {
  font-size: 24rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.panel-intro {
  font-size: 19rpx;
  color: var(--app-muted);
  line-height: 1.4;
  margin-bottom: 20rpx;
}

.interactive-sandbox {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 20rpx;
}

.grid-three {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.gap-2 {
  gap: 12rpx;
}

.ml-2 {
  margin-left: 16rpx;
}

.mt-2 {
  margin-top: 16rpx;
}

.mt-3 {
  margin-top: 24rpx;
}

.label-txt {
  font-size: 23rpx;
  font-weight: 700;
  color: var(--app-ink);
  width: 140rpx;
}

.data-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.data-badge {
  background: #f1f5f9;
  border: 1rpx solid var(--app-line);
  border-radius: 8rpx;
  padding: 4rpx 12rpx;
  font-size: 18rpx;
  font-weight: 700;
  color: var(--app-ink);
}

/* Output Box Styling */
.output-box {
  background: #1e293b;
  border-radius: 8rpx;
  padding: 16rpx;
}

.output-label {
  font-size: 18rpx;
  color: #94a3b8;
  margin-bottom: 8rpx;
}

.output-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 21rpx;
  font-weight: 800;
  color: #38bdf8;
  white-space: pre-wrap;
  word-break: break-all;
  
  &.text-green {
    color: #34d399;
  }
  
  &.text-red {
    color: #f87171;
  }
}

/* Cases conversion column display */
.output-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.out-col {
  background: #eff6ff;
  border: 1rpx solid #bfdbfe;
  border-radius: 8rpx;
  padding: 12rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.col-head {
  font-size: 18rpx;
  color: var(--app-muted);
}

.col-val {
  font-size: 20rpx;
  font-weight: 800;
  color: var(--app-brand);
}

/* Time & datetime rows styling */
.time-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.time-label {
  font-size: 21rpx;
  color: var(--app-muted);
}

.time-val {
  font-size: 21rpx;
  font-weight: 700;
  color: var(--app-ink);
  
  &.text-brand { color: var(--app-brand); }
  &.text-red { color: #ef4444; }
  &.text-orange { color: #f97316; }
}

.divider-line {
  height: 1rpx;
  background: var(--app-line);
  margin: 10rpx 0;
}
</style>
