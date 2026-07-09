<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { useUserStore } from '@/store'
import { navigateTo } from '@/utils/router'

const toast = useToast('register-toast')
const userStore = useUserStore()
const active = ref(0)

const phoneFormRef = ref()
const inviteFormRef = ref()
const companyFormRef = ref()
const creatorFormRef = ref()
const appFormRef = ref()

const phoneForm = reactive({
  nickname: '模板用户',
  phone: '13900139000',
  password: '123456',
  agreement: true
})

const inviteForm = reactive({
  inviteCode: 'UNI2026',
  phone: '13700137000',
  nickname: '邀请用户',
  agreement: true
})

const companyForm = reactive({
  company: '多端科技',
  contact: '王经理',
  phone: '13600136000',
  agreement: true
})

const creatorForm = reactive({
  nickname: '内容主理人',
  category: '运营增长',
  phone: '13500135000',
  agreement: true
})

const appForm = reactive({
  phone: '13400134000',
  device: 'HarmonyOS',
  agreement: true
})

const registerScenes = [
  {
    title: '基础',
    name: '手机号注册',
    desc: '通用账号注册，适合多数业务项目。',
    tone: '#12b76a'
  },
  {
    title: '邀请',
    name: '邀请码注册',
    desc: '适合内测、企业协作和渠道邀请。',
    tone: '#f79009'
  },
  {
    title: '企业',
    name: '企业入驻',
    desc: '适合 SaaS 平台、商家入驻和组织认证。',
    tone: '#1e88e5'
  },
  {
    title: '创作者',
    name: '创作者开通',
    desc: '适合内容社区、活动平台和达人入驻。',
    tone: '#875bf7'
  },
  {
    title: 'App',
    name: 'App 快速注册',
    desc: '适合 App、鸿蒙 App 与本机号注册。',
    tone: '#06aed4'
  }
]

const phoneRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
]

const passwordRules = [
  { required: true, message: '请输入密码' },
  { validator: (value: string) => value.length >= 6, message: '密码至少 6 位' }
]

function requireAgreement(agreement: boolean) {
  if (!agreement) {
    toast.warning('请先同意用户协议')
    return false
  }
  return true
}

async function submitPhone() {
  const result = await phoneFormRef.value?.validate?.()
  if (!result?.valid || !requireAgreement(phoneForm.agreement)) return
  userStore.register(phoneForm)
  finishRegister('手机号注册成功')
}

async function submitInvite() {
  const result = await inviteFormRef.value?.validate?.()
  if (!result?.valid || !requireAgreement(inviteForm.agreement)) return
  userStore.register({ ...inviteForm, password: inviteForm.inviteCode })
  finishRegister('邀请注册成功')
}

async function submitCompany() {
  const result = await companyFormRef.value?.validate?.()
  if (!result?.valid || !requireAgreement(companyForm.agreement)) return
  userStore.register({ nickname: companyForm.contact, phone: companyForm.phone, password: companyForm.company })
  finishRegister('企业入驻已创建')
}

async function submitCreator() {
  const result = await creatorFormRef.value?.validate?.()
  if (!result?.valid || !requireAgreement(creatorForm.agreement)) return
  userStore.register({ nickname: creatorForm.nickname, phone: creatorForm.phone, password: creatorForm.category })
  finishRegister('创作者账号已开通')
}

async function submitApp() {
  const result = await appFormRef.value?.validate?.()
  if (!result?.valid || !requireAgreement(appForm.agreement)) return
  userStore.register({ nickname: `${appForm.device} 用户`, phone: appForm.phone, password: appForm.device })
  finishRegister('App 快速注册成功')
}

function finishRegister(msg: string) {
  toast.success(msg)
  setTimeout(() => {
    uni.switchTab({ url: '/pages/mine/index' })
  }, 400)
}
</script>

<template>
  <PageShell title="注册" description="内置 5 套注册模板，覆盖手机号、邀请、企业、创作者和 App 快速注册。">
    <view class="register-page">
      <wd-toast selector="register-toast" />

      <view class="switch-board">
        <view
          v-for="(item, index) in registerScenes"
          :key="item.title"
          :class="['switch-item', { active: active === index }]"
          :style="{ '--scene-color': item.tone }"
          @click="active = index"
        >
          <view class="switch-dot" />
          <view class="switch-title">{{ item.title }}</view>
        </view>
      </view>

      <view class="register-card" :style="{ '--scene-color': registerScenes[active].tone }">
        <view class="register-head">
          <view>
            <view class="head-label">REGISTER FLOW</view>
            <view class="head-title">{{ registerScenes[active].name }}</view>
            <view class="head-desc">{{ registerScenes[active].desc }}</view>
          </view>
          <view class="head-mark">{{ active + 1 }}/5</view>
        </view>

        <view v-if="active === 0" class="form-zone">
          <wd-form ref="phoneFormRef" :model="phoneForm" :rules="{ nickname: [{ required: true, message: '请输入昵称' }], phone: phoneRules, password: passwordRules }" error-type="message" border>
            <wd-input v-model="phoneForm.nickname" prop="nickname" label="昵称" clearable />
            <wd-input v-model="phoneForm.phone" prop="phone" label="手机号" type="tel" maxlength="11" clearable />
            <wd-input v-model="phoneForm.password" prop="password" label="密码" type="password" clearable />
          </wd-form>
          <wd-checkbox v-model="phoneForm.agreement">同意用户协议和隐私政策</wd-checkbox>
          <wd-button type="primary" block @click="submitPhone">注册并登录</wd-button>
        </view>

        <view v-if="active === 1" class="form-zone invite-zone">
          <view class="invite-ticket">
            <view>内测邀请码</view>
            <view>{{ inviteForm.inviteCode }}</view>
          </view>
          <wd-form ref="inviteFormRef" :model="inviteForm" :rules="{ inviteCode: [{ required: true, message: '请输入邀请码' }], nickname: [{ required: true, message: '请输入昵称' }], phone: phoneRules }" error-type="message" border>
            <wd-input v-model="inviteForm.inviteCode" prop="inviteCode" label="邀请码" clearable />
            <wd-input v-model="inviteForm.nickname" prop="nickname" label="昵称" clearable />
            <wd-input v-model="inviteForm.phone" prop="phone" label="手机号" type="tel" maxlength="11" clearable />
          </wd-form>
          <wd-checkbox v-model="inviteForm.agreement">同意邀请注册规则</wd-checkbox>
          <wd-button type="primary" block @click="submitInvite">验证邀请并注册</wd-button>
        </view>

        <view v-if="active === 2" class="form-zone company-zone">
          <wd-form ref="companyFormRef" :model="companyForm" :rules="{ company: [{ required: true, message: '请输入企业名称' }], contact: [{ required: true, message: '请输入联系人' }], phone: phoneRules }" error-type="message" border>
            <wd-input v-model="companyForm.company" prop="company" label="企业名称" clearable />
            <wd-input v-model="companyForm.contact" prop="contact" label="联系人" clearable />
            <wd-input v-model="companyForm.phone" prop="phone" label="联系电话" type="tel" maxlength="11" clearable />
          </wd-form>
          <view class="feature-row">
            <wd-tag plain type="primary">组织空间</wd-tag>
            <wd-tag plain type="success">成员管理</wd-tag>
            <wd-tag plain type="warning">认证资料</wd-tag>
          </view>
          <wd-checkbox v-model="companyForm.agreement">同意企业入驻协议</wd-checkbox>
          <wd-button type="primary" block @click="submitCompany">创建企业空间</wd-button>
        </view>

        <view v-if="active === 3" class="form-zone creator-zone">
          <wd-form ref="creatorFormRef" :model="creatorForm" :rules="{ nickname: [{ required: true, message: '请输入创作者昵称' }], category: [{ required: true, message: '请输入内容方向' }], phone: phoneRules }" error-type="message" border>
            <wd-input v-model="creatorForm.nickname" prop="nickname" label="昵称" clearable />
            <wd-input v-model="creatorForm.category" prop="category" label="方向" clearable />
            <wd-input v-model="creatorForm.phone" prop="phone" label="手机号" type="tel" maxlength="11" clearable />
          </wd-form>
          <view class="creator-preview">
            <view class="preview-avatar">{{ creatorForm.nickname.slice(0, 1) || 'C' }}</view>
            <view>
              <view class="font-700">{{ creatorForm.nickname }}</view>
              <view class="muted-text mt-1">{{ creatorForm.category }}</view>
            </view>
          </view>
          <wd-checkbox v-model="creatorForm.agreement">同意创作者服务协议</wd-checkbox>
          <wd-button type="primary" block @click="submitCreator">开通创作者</wd-button>
        </view>

        <view v-if="active === 4" class="form-zone app-zone">
          <view class="device-card">
            <view class="device-ring">
              <wd-icon name="mobile" size="30px" />
            </view>
            <view>
              <view class="font-700">App 本机号快速注册</view>
              <view class="muted-text mt-1">预留微信、抖音、App、鸿蒙授权入口。</view>
            </view>
          </view>
          <wd-form ref="appFormRef" :model="appForm" :rules="{ phone: phoneRules, device: [{ required: true, message: '请输入设备来源' }] }" error-type="message" border>
            <wd-input v-model="appForm.phone" prop="phone" label="手机号" type="tel" maxlength="11" clearable />
            <wd-input v-model="appForm.device" prop="device" label="来源" clearable />
          </wd-form>
          <wd-checkbox v-model="appForm.agreement">同意 App 授权协议</wd-checkbox>
          <wd-button type="primary" block @click="submitApp">本机号注册</wd-button>
        </view>

        <view class="register-footer">
          <wd-button type="text" @click="navigateTo('/pages/auth/login')">已有账号？去登录</wd-button>
          <wd-button type="text" @click="navigateTo('/pages/examples/quick-logins')">
            <text class="text-brand ml-2">一键登录与第三方授权 🔗</text>
          </wd-button>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.register-page {
  display: grid;
  gap: 24rpx;
}

.switch-board {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12rpx;
}

.switch-item {
  display: grid;
  justify-items: center;
  gap: 8rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
  color: var(--app-muted);
  font-size: 24rpx;
  padding: 18rpx 8rpx;
}

.switch-item.active {
  border-color: var(--scene-color);
  color: var(--scene-color);
}

.switch-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: currentColor;
}

.register-card {
  overflow: hidden;
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #fff;
}

.register-head {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  background: #f8fbff;
  border-bottom: 1rpx solid var(--app-line);
  padding: 34rpx;
}

.head-label {
  color: var(--scene-color);
  font-size: 22rpx;
  font-weight: 800;
}

.head-title {
  margin-top: 8rpx;
  color: var(--app-ink);
  font-size: 40rpx;
  font-weight: 800;
}

.head-desc {
  margin-top: 12rpx;
  color: var(--app-muted);
  font-size: 25rpx;
  line-height: 1.6;
}

.head-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 74rpx;
  height: 74rpx;
  border-radius: 50%;
  background: var(--scene-color);
  color: #fff;
  font-weight: 800;
}

.form-zone {
  display: grid;
  gap: 24rpx;
  padding: 32rpx;
}

.invite-ticket {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1rpx dashed var(--scene-color);
  border-radius: 12rpx;
  background: #fffbf2;
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 700;
  padding: 24rpx;
}

.feature-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.creator-preview,
.device-card {
  display: flex;
  align-items: center;
  gap: 18rpx;
  border-radius: 12rpx;
  background: #f6f8fb;
  padding: 22rpx;
}

.preview-avatar,
.device-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  background: var(--scene-color);
  color: #fff;
  font-size: 34rpx;
  font-weight: 800;
}

.register-footer {
  display: flex;
  justify-content: center;
  border-top: 1rpx solid var(--app-line);
  padding: 8rpx 0 18rpx;
}
</style>
