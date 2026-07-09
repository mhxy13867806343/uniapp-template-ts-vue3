<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'
import { useUserStore } from '@/store'
import { navigateTo } from '@/utils/router'

const toast = useToast('login-toast')
const userStore = useUserStore()
const active = ref(0)

const passwordFormRef = ref()
const codeFormRef = ref()
const enterpriseFormRef = ref()
const adminFormRef = ref()
const quickFormRef = ref()

const passwordForm = reactive({
  phone: '13800138000',
  password: '123456'
})

const codeForm = reactive({
  phone: '13600136000',
  code: '246810'
})

const enterpriseForm = reactive({
  tenant: 'demo',
  account: 'admin',
  password: '123456'
})

const adminForm = reactive({
  username: 'super-admin',
  password: '123456',
  captcha: '8K2P'
})

const quickForm = reactive({
  phone: '13500135000',
  agreement: true
})

const loginScenes = [
  {
    title: '密码',
    name: '手机号密码',
    desc: '适合常规业务 App、H5 和小程序账号体系。',
    icon: 'user'
  },
  {
    title: '验证码',
    name: '短信验证码',
    desc: '适合轻量登录、活动页和新用户快速进入。',
    icon: 'chat'
  },
  {
    title: '企业',
    name: '租户登录',
    desc: '适合 SaaS、后台工作台和多组织业务。',
    icon: 'home'
  },
  {
    title: '管理端',
    name: '安全登录',
    desc: '适合管理员、风控和高权限操作入口。',
    icon: 'lock'
  },
  {
    title: '快捷',
    name: '一键登录',
    desc: '适合 App/小程序授权登录后的兜底页。',
    icon: 'check'
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

async function submitPassword() {
  const result = await passwordFormRef.value?.validate?.()
  if (!result?.valid) return
  userStore.login(passwordForm)
  finishLogin('手机号密码登录成功')
}

async function submitCode() {
  const result = await codeFormRef.value?.validate?.()
  if (!result?.valid) return
  userStore.login({ phone: codeForm.phone, password: codeForm.code })
  finishLogin('验证码登录成功')
}

async function submitEnterprise() {
  const result = await enterpriseFormRef.value?.validate?.()
  if (!result?.valid) return
  userStore.login({ phone: '13800138000', password: enterpriseForm.password })
  finishLogin('企业租户登录成功')
}

async function submitAdmin() {
  const result = await adminFormRef.value?.validate?.()
  if (!result?.valid) return
  userStore.login({ phone: '13900139000', password: adminForm.password })
  finishLogin('管理端登录成功')
}

async function submitQuick() {
  const result = await quickFormRef.value?.validate?.()
  if (!result?.valid) return
  if (!quickForm.agreement) {
    toast.warning('请先同意授权协议')
    return
  }
  userStore.login({ phone: quickForm.phone, password: 'quick-login' })
  finishLogin('快捷登录成功')
}

function finishLogin(msg: string) {
  toast.success(msg)
  setTimeout(() => {
    uni.switchTab({ url: '/pages/mine/index' })
  }, 400)
}
</script>

<template>
  <PageShell title="登录" description="内置 5 套登录模板，可按项目选择密码、验证码、企业、管理端或快捷授权。">
    <view class="login-page">
      <wd-toast selector="login-toast" />

      <view class="login-hero">
        <view>
          <view class="hero-kicker">AUTH CENTER</view>
          <view class="hero-title">欢迎回来</view>
          <view class="hero-desc">{{ loginScenes[active].desc }}</view>
        </view>
        <view class="hero-icon">
          <wd-icon :name="loginScenes[active].icon" size="26px" />
        </view>
      </view>

      <view class="login-shell">
        <wd-tabs v-model="active" slidable animated>
          <wd-tab
            v-for="item in loginScenes"
            :key="item.title"
            :title="item.title"
          />
        </wd-tabs>

        <view class="scene-title">{{ loginScenes[active].name }}</view>

        <view v-if="active === 0" class="scene-panel">
          <wd-form ref="passwordFormRef" :model="passwordForm" :rules="{ phone: phoneRules, password: passwordRules }" error-type="message" border>
            <wd-input v-model="passwordForm.phone" prop="phone" label="手机号" type="tel" maxlength="11" clearable />
            <wd-input v-model="passwordForm.password" prop="password" label="密码" type="password" clearable />
          </wd-form>
          <wd-button type="primary" block @click="submitPassword">登录</wd-button>
        </view>

        <view v-if="active === 1" class="scene-panel code-panel">
          <wd-form ref="codeFormRef" :model="codeForm" :rules="{ phone: phoneRules, code: [{ required: true, message: '请输入验证码' }] }" error-type="message" border>
            <wd-input v-model="codeForm.phone" prop="phone" label="手机号" type="tel" maxlength="11" clearable />
            <wd-input v-model="codeForm.code" prop="code" label="验证码" maxlength="6" clearable>
              <template #suffix>
                <wd-button size="small" plain>获取</wd-button>
              </template>
            </wd-input>
          </wd-form>
          <wd-button type="primary" block @click="submitCode">验证码登录</wd-button>
        </view>

        <view v-if="active === 2" class="scene-panel enterprise-panel">
          <view class="tenant-card">
            <view class="tenant-logo">S</view>
            <view>
              <view class="font-700">SaaS 租户入口</view>
              <view class="muted-text mt-1">支持企业标识、账号和密码组合</view>
            </view>
          </view>
          <wd-form ref="enterpriseFormRef" :model="enterpriseForm" :rules="{ tenant: [{ required: true, message: '请输入企业标识' }], account: [{ required: true, message: '请输入账号' }], password: passwordRules }" error-type="message" border>
            <wd-input v-model="enterpriseForm.tenant" prop="tenant" label="企业" clearable />
            <wd-input v-model="enterpriseForm.account" prop="account" label="账号" clearable />
            <wd-input v-model="enterpriseForm.password" prop="password" label="密码" type="password" clearable />
          </wd-form>
          <wd-button type="primary" block @click="submitEnterprise">进入企业空间</wd-button>
        </view>

        <view v-if="active === 3" class="scene-panel admin-panel">
          <wd-form ref="adminFormRef" :model="adminForm" :rules="{ username: [{ required: true, message: '请输入管理员账号' }], password: passwordRules, captcha: [{ required: true, message: '请输入图形验证码' }] }" error-type="message" border>
            <wd-input v-model="adminForm.username" prop="username" label="账号" clearable />
            <wd-input v-model="adminForm.password" prop="password" label="密码" type="password" clearable />
            <wd-input v-model="adminForm.captcha" prop="captcha" label="验证码" clearable />
          </wd-form>
          <view class="security-line">已启用图形验证码、登录审计、异常设备提醒占位。</view>
          <wd-button type="primary" block @click="submitAdmin">安全登录</wd-button>
        </view>

        <view v-if="active === 4" class="scene-panel quick-panel">
          <view class="quick-card">
            <view class="quick-mark">UNI</view>
            <view class="quick-title">一键授权登录</view>
            <view class="quick-desc">可对接微信、抖音、App 本机号或鸿蒙账号能力。</view>
          </view>
          <wd-form ref="quickFormRef" :model="quickForm" :rules="{ phone: phoneRules }" error-type="message" border>
            <wd-input v-model="quickForm.phone" prop="phone" label="兜底手机号" type="tel" maxlength="11" clearable />
          </wd-form>
          <view class="agreement-row">
            <wd-checkbox v-model="quickForm.agreement">同意授权协议</wd-checkbox>
          </view>
          <wd-button type="primary" block @click="submitQuick">授权并登录</wd-button>
        </view>

        <view class="login-footer">
          <wd-button type="text" @click="navigateTo('/pages/auth/register')">没有账号？去注册</wd-button>
          <wd-button type="text" @click="navigateTo('/pages/examples/quick-logins')">
            <text class="text-brand ml-2">一键登录与第三方授权 🔗</text>
          </wd-button>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.login-page {
  display: grid;
  gap: 24rpx;
}

.login-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  border-radius: 12rpx;
  background: linear-gradient(135deg, #182230, #1e88e5);
  color: #fff;
  padding: 36rpx;
}

.hero-kicker {
  opacity: 0.78;
  font-size: 22rpx;
  font-weight: 700;
}

.hero-title {
  margin-top: 8rpx;
  font-size: 42rpx;
  font-weight: 800;
}

.hero-desc {
  margin-top: 12rpx;
  opacity: 0.86;
  font-size: 25rpx;
  line-height: 1.6;
}

.hero-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
}

.login-shell {
  overflow: hidden;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #fff;
}

.scene-title {
  padding: 28rpx 32rpx 0;
  color: var(--app-ink);
  font-size: 34rpx;
  font-weight: 800;
}

.scene-panel {
  display: grid;
  gap: 24rpx;
  padding: 28rpx 32rpx 32rpx;
}

.tenant-card {
  display: flex;
  align-items: center;
  gap: 18rpx;
  border-radius: 12rpx;
  background: #f5f8ff;
  padding: 22rpx;
}

.tenant-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: 12rpx;
  background: var(--app-brand);
  color: #fff;
  font-weight: 800;
}

.security-line,
.quick-desc {
  color: var(--app-muted);
  font-size: 25rpx;
  line-height: 1.6;
}

.quick-card {
  border-radius: 14rpx;
  background: #101828;
  color: #fff;
  padding: 32rpx;
}

.quick-mark {
  width: fit-content;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.16);
  font-size: 22rpx;
  font-weight: 800;
  padding: 8rpx 18rpx;
}

.quick-title {
  margin-top: 24rpx;
  font-size: 38rpx;
  font-weight: 800;
}

.agreement-row {
  margin-top: -8rpx;
}

.login-footer {
  display: flex;
  justify-content: center;
  border-top: 1rpx solid var(--app-line);
  padding: 8rpx 0 18rpx;
}
</style>
