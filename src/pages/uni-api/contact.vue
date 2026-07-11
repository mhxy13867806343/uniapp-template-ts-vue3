<script setup lang="ts">
import { addPhoneContact, chooseContact, getUniErrorMessage } from '@/apis/uni'
import PageShell from '@/components/PageShell.vue'

const toast = useToast('contact-toast')

const form = reactive({
  firstName: 'UniApp 模板',
  mobilePhoneNumber: '13800138000',
  organization: 'HooksVue Studio',
  title: '前端工程师',
  email: 'demo@uniapp.local'
})

const resultText = ref('')
const logs = ref<string[]>([])

function log(message: string) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
  logs.value = logs.value.slice(0, 30)
}

async function handleAddContact() {
  if (!form.firstName.trim()) {
    toast.warning('请输入联系人姓名')
    return
  }
  try {
    await addPhoneContact({ ...form })
    log(`addPhoneContact 成功: ${form.firstName}`)
    toast.success('已发起添加联系人')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`添加联系人失败: ${message}`)
  }
}

async function handleChooseContact() {
  try {
    const result = await chooseContact()
    resultText.value = JSON.stringify(result, null, 2)
    log('chooseContact 成功')
    toast.success('已拉起联系人选择')
  } catch (error) {
    const message = getUniErrorMessage(error)
    toast.error(message)
    log(`选择联系人失败: ${message}`)
  }
}
</script>

<template>
  <PageShell title="联系人 APIs" description="统一测试 addPhoneContact 和 chooseContact，适合 CRM、邀请协作、紧急联系人、售后跟进等场景。">
    <view class="api-page">
      <wd-toast selector="contact-toast" />

      <view class="hero-card">
        <view>
          <view class="hero-title">联系人实验室</view>
          <view class="hero-desc">这里把新增联系人和选择联系人封成两种高频动作。移动端会更适合直接联调，H5 端通常不支持这类系统通讯录能力。</view>
        </view>
        <wd-tag type="primary" plain>通讯录能力</wd-tag>
      </view>

      <view class="panel-card">
        <view class="section-title">新增联系人</view>
        <input v-model="form.firstName" class="native-input" placeholder="姓名" />
        <input v-model="form.mobilePhoneNumber" class="native-input" placeholder="手机号" />
        <input v-model="form.organization" class="native-input" placeholder="公司" />
        <input v-model="form.title" class="native-input" placeholder="职位" />
        <input v-model="form.email" class="native-input" placeholder="邮箱" />
        <view class="action-row">
          <wd-button size="small" type="primary" @click="handleAddContact">addPhoneContact</wd-button>
          <wd-button size="small" plain @click="handleChooseContact">chooseContact</wd-button>
        </view>
      </view>

      <view class="panel-card">
        <view class="section-title">返回结果</view>
        <view class="result-box">{{ resultText || '执行 chooseContact 后，返回结果会显示在这里。' }}</view>
      </view>

      <view class="panel-card">
        <view class="section-title">调用日志</view>
        <view v-if="logs.length" class="log-list">
          <view v-for="item in logs" :key="item" class="log-item">{{ item }}</view>
        </view>
        <view v-else class="empty-card">还没有操作日志。</view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.api-page { display:grid; gap:24rpx; }
.hero-card,.panel-card,.empty-card { background:#fff; border:1rpx solid var(--app-line); border-radius:24rpx; }
.hero-card,.panel-card { padding:28rpx; }
.hero-card { display:flex; justify-content:space-between; gap:20rpx; }
.hero-title,.section-title { color:var(--app-ink); font-weight:800; }
.hero-title { font-size:38rpx; }
.section-title { font-size:30rpx; }
.hero-desc,.log-item,.result-box,.empty-card { margin-top:12rpx; color:var(--app-muted); font-size:25rpx; line-height:1.7; white-space:pre-wrap; word-break:break-all; }
.native-input { width:100%; height:88rpx; margin-top:16rpx; padding:0 22rpx; box-sizing:border-box; border:1rpx solid var(--app-line); border-radius:18rpx; background:#f8fafc; font-size:25rpx; color:var(--app-ink); }
.action-row { display:flex; flex-wrap:wrap; gap:14rpx; margin-top:20rpx; }
.result-box { min-height:180rpx; padding:22rpx; border:1rpx dashed var(--app-line); border-radius:18rpx; background:#f8fafc; }
.log-list { display:grid; gap:16rpx; margin-top:18rpx; }
.empty-card { padding:22rpx; }
</style>
