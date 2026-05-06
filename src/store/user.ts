import { defineStore } from 'pinia'

export interface UserProfile {
  nickname: string
  phone: string
  role: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const profile = ref<UserProfile | null>(null)

  const isLogin = computed(() => Boolean(token.value))

  function hydrate() {
    token.value = uni.getStorageSync('access-token') || ''
    profile.value = uni.getStorageSync('user-profile') || null
  }

  function login(payload: { phone: string; password: string }) {
    token.value = `mock-token-${Date.now()}`
    profile.value = {
      nickname: payload.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2'),
      phone: payload.phone,
      role: '模板体验用户'
    }
    uni.setStorageSync('access-token', token.value)
    uni.setStorageSync('user-profile', profile.value)
  }

  function register(payload: { nickname: string; phone: string; password: string }) {
    token.value = `mock-token-${Date.now()}`
    profile.value = {
      nickname: payload.nickname,
      phone: payload.phone,
      role: '新注册用户'
    }
    uni.setStorageSync('access-token', token.value)
    uni.setStorageSync('user-profile', profile.value)
  }

  function logout() {
    token.value = ''
    profile.value = null
    uni.removeStorageSync('access-token')
    uni.removeStorageSync('user-profile')
  }

  return {
    token,
    profile,
    isLogin,
    hydrate,
    login,
    register,
    logout
  }
})
