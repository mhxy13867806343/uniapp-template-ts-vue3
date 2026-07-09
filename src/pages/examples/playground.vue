<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('play-toast')

// Route parameters
const scenarioId = ref('register')

onLoad((query) => {
  if (typeof query?.id === 'string') {
    scenarioId.value = query.id
  }
})

// ==========================================
// 1. 各个交互实例的响应式状态定义
// ==========================================

// 1. 用户注册
const regPhone = ref('')
const regCode = ref('')
const regPassword = ref('')
const regAgree = ref(false)
const regCountdown = ref(0)
let regTimer: any = null

function sendRegCode() {
  if (!regPhone.value || regPhone.value.length !== 11) {
    toast.warning('请输入11位手机号')
    return
  }
  regCountdown.value = 60
  regTimer = setInterval(() => {
    if (regCountdown.value > 0) regCountdown.value--
    else clearInterval(regTimer)
  }, 1000)
  toast.success('验证码已发送 (Mock: 1234)')
}

function handleRegister() {
  if (!regAgree.value) {
    toast.warning('请先同意用户协议')
    return
  }
  if (!regPhone.value || regCode.value !== '1234' || regPassword.value.length < 6) {
    toast.error('请填写完整且正确的注册信息')
    return
  }
  toast.success('注册成功！已自动登录')
}

// 2. 账号登录
const loginMode = ref<'pwd' | 'sms'>('pwd')
const loginPhone = ref('')
const loginPwd = ref('')
const loginCode = ref('')

function handleLogin() {
  if (!loginPhone.value) {
    toast.warning('请输入手机号')
    return
  }
  toast.success('登录成功，欢迎回来！')
}

// 3. 个人资料编辑
const profileAvatar = ref('😎')
const profileNickname = ref('旅行者甲')
const profileGender = ref('男')
const profileIntro = ref('Coding makes the world better.')
const avatarsList = ['😎', '🤖', '🦊', '🐱', '🦄', '🍀']
const showAvatarPicker = ref(false)

function saveProfile() {
  toast.success('资料已保存到云端')
}

// 4. 应用设置
const setNotify = ref(true)
const setSound = ref(false)
const setLanguage = ref('简体中文')
const showLangSelector = ref(false)

function clearCache() {
  toast.loading('正在清理缓存...')
  setTimeout(() => {
    toast.success('缓存已清空，释放 18.2 MB')
  }, 1200)
}

// 5. 物流步骤查询
const expressNo = ref('SF1882998377')
const logisticsSteps = [
  { title: '已寄出', desc: '发货人已在北京市海淀区中关村打包发出', time: '07-08 09:00' },
  { title: '运输中', desc: '顺丰航空快件已抵达北京大兴转运中心', time: '07-08 14:30' },
  { title: '派送中', desc: '北京朝阳区望京派送员 张师傅 正在为您派件', time: '07-08 17:15' },
  { title: '已签收', desc: '快件已签收，签收人：本人签收', time: '07-08 18:00' }
]

// 6. 商家入驻
const merchantName = ref('')
const merchantLicense = ref<string[]>([])
const merchantIdFront = ref<string[]>([])

function submitMerchant() {
  if (!merchantName.value || merchantLicense.value.length === 0) {
    toast.error('请填写商户名称并上传营业执照')
    return
  }
  toast.success('入驻申请已提交，请等待审核')
}

// 7. 手写签名
const signatureImg = ref('')
const drawing = ref(false)
function triggerSign() {
  toast.loading('正在生成签名...')
  setTimeout(() => {
    signatureImg.value = '🖋️ Signature Completed'
    toast.success('签名生成成功')
  }, 1000)
}
function clearSign() {
  signatureImg.value = ''
  toast.success('画板已清空')
}

// 8. 拼图滑动验证
const puzzleVerified = ref(false)
const puzzleOffset = ref(0)
const maxPuzzleOffset = 190

function handlePuzzleChange(e: any) {
  puzzleOffset.value = e.detail.value
}

function verifyPuzzle() {
  // Correct spot is around 140-155px offset
  if (puzzleOffset.value >= 140 && puzzleOffset.value <= 155) {
    puzzleVerified.value = true
    toast.success('人机校验成功！')
  } else {
    puzzleOffset.value = 0
    toast.error('校验失败，请对准缺口重试')
  }
}

// 9. 安全密码键盘
const passCode = ref<string[]>([])
function pressKey(key: string) {
  if (key === 'del') {
    passCode.value.pop()
  } else if (passCode.value.length < 6) {
    passCode.value.push(key)
    if (passCode.value.length === 6) {
      toast.success(`密码输入成功: ${passCode.value.join('')}`)
    }
  }
}

// 10. 历史搜索
const searchKeyword = ref('')
const searchHistory = ref<string[]>(['Vite', 'TypeScript', 'Uni-App', 'CSS3', 'Wot Design'])
function addSearch() {
  const kw = searchKeyword.value.trim()
  if (kw && !searchHistory.value.includes(kw)) {
    searchHistory.value.unshift(kw)
  }
  searchKeyword.value = ''
}

// 11. 日历范围选择
const calRange = ref('7月8日 - 7月10日 (2晚)')

// 12. 自定义评分
const rateScore = ref(4)
const rateTaste = ref(5)
const rateService = ref(4)
const rateEnv = ref(3)

// 13. 双向滑块区间
const rangeMin = ref(20)
const rangeMax = ref(80)

// 14. 身份证号识别
const idCardNum = ref('')
const idCardResult = computed(() => {
  const num = idCardNum.value.trim()
  if (num.length !== 18) return '请输入18位有效身份证号'
  const birth = num.substring(6, 14).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
  const genderDigit = parseInt(num.charAt(16))
  const gender = genderDigit % 2 === 0 ? '女' : '男'
  return `解析结果：生日 [${birth}]，性别 [${gender}]`
})

// 15. 银行卡四要素格式化
const bankCardNum = ref('')
const formattedBankCard = computed(() => {
  return bankCardNum.value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
})

// 16. 定时器确认框
const confirmDialogVisible = ref(false)
const dialogCountdown = ref(5)
let dialogTimer: any = null

function openTimerDialog() {
  confirmDialogVisible.value = true
  dialogCountdown.value = 5
  if (dialogTimer) clearInterval(dialogTimer)
  dialogTimer = setInterval(() => {
    if (dialogCountdown.value > 0) dialogCountdown.value--
    else clearInterval(dialogTimer)
  }, 1000)
}

// 17. 幕帘广告
const showCurtain = ref(false)

// 18. 液态拉伸
const liquidStretch = ref(0)

// ==========================================
// 2. 演练场卡片配套描述与代码展示数据
// ==========================================
interface PlayScenario {
  title: string
  intro: string
  code: string
  api: { name: string; desc: string; type: string; val: string }[]
}

const scenariosInfo: Record<string, PlayScenario> = {
  register: {
    title: '用户注册页面模板',
    intro: '高度拟真的移动端注册界面，支持手机号检测、验证码60秒倒计时机制及服务条款勾选控制。',
    code: `<wd-input v-model="regPhone" label="手机号" />
<wd-button :disabled="regCountdown > 0" @click="sendRegCode">
  {{ regCountdown > 0 ? regCountdown + 's' : '发送' }}
</wd-button>
<wd-checkbox v-model="regAgree">同意用户协议</wd-checkbox>`,
    api: [
      { name: 'regPhone', desc: '绑定输入的手机号码', type: 'string', val: '-' },
      { name: 'regCountdown', desc: '短信倒计时数值', type: 'number', val: '0' },
      { name: 'regAgree', desc: '是否勾选同意条款', type: 'boolean', val: 'false' }
    ]
  },
  login: {
    title: '用户登录页面模板',
    intro: '聚合密码认证与快捷验证码登录两种登录模式，支持常见第三方微信快捷授权界面。',
    code: `<wd-tabs v-model="loginMode">
  <wd-tab title="密码登录" name="pwd">...</wd-tab>
  <wd-tab title="快捷登录" name="sms">...</wd-tab>
</wd-tabs>`,
    api: [
      { name: 'loginMode', desc: '当前登录选项类型', type: 'string', val: 'pwd' },
      { name: 'loginPhone', desc: '输入的账号或手机号', type: 'string', val: '-' }
    ]
  },
  profile: {
    title: '个人资料编辑卡片',
    intro: '包含头像emoji选择框、昵称与个性签名的编辑表单组合，带云端保存动作模拟。',
    code: `<wd-avatar :text="profileAvatar" @click="showAvatarPicker = true" />
<wd-input v-model="profileNickname" label="昵称" />
<wd-textarea v-model="profileIntro" label="个性签名" />`,
    api: [
      { name: 'profileAvatar', desc: '用户选定的头像符号', type: 'string', val: '😎' },
      { name: 'profileNickname', desc: '填写的昵称', type: 'string', val: '旅行者甲' }
    ]
  },
  settings: {
    title: '应用系统设置列表',
    intro: '模拟清理缓存、推送开关、系统音效选项及语言包切换等常见应用设置底栏。',
    code: `<wd-switch v-model="setNotify" />
<wd-cell title="清除缓存" clickable @click="clearCache" />`,
    api: [
      { name: 'setNotify', desc: '新消息推送开关状态', type: 'boolean', val: 'true' },
      { name: 'setLanguage', desc: '系统显示语言名称', type: 'string', val: '简体中文' }
    ]
  },
  express: {
    title: '快递单号步骤条查询',
    intro: '支持输入单号进行快递查询，利用纵向 Steps 步骤条平滑绘制快递运输路径节点。',
    code: `<wd-search v-model="expressNo" />
<wd-steps :active="3" direction="vertical">
  <wd-step v-for="s in logisticsSteps" :title="s.title" :description="s.desc" />
</wd-steps>`,
    api: [
      { name: 'expressNo', desc: '输入的快递单号', type: 'string', val: '-' },
      { name: 'logisticsSteps', desc: '保存时间物流节点的数组', type: 'Array', val: '4个节点' }
    ]
  },
  merchant: {
    title: '商户入驻资质上传',
    intro: '包含营业执照与法人身份证的多图文件上传面板，内置必填项提交控制与流程引导。',
    code: `<wd-upload v-model="merchantLicense" label="营业执照" />
<wd-upload v-model="merchantIdFront" label="法人身份证" />`,
    api: [
      { name: 'merchantName', desc: '商户入驻填写的名称', type: 'string', val: '-' },
      { name: 'merchantLicense', desc: '营业执照上传的文件列表', type: 'Array', val: '[]' }
    ]
  },
  signature: {
    title: '电子签名画板手写确认',
    intro: '在手写区域利用手势触控画板，输出用户的草稿数字签名，提供清除与最终确认动作。',
    code: `<view class="signature-canvas" @touchstart="startDraw">...</view>
<wd-button @click="clearSign">清除</wd-button>
<wd-button @click="triggerSign">生成</wd-button>`,
    api: [
      { name: 'signatureImg', desc: '渲染的签名图片内容', type: 'string', val: '-' },
      { name: 'drawing', desc: '标识手势绘制状态', type: 'boolean', val: 'false' }
    ]
  },
  'slide-verify': {
    title: '滑动拼图人机校验',
    intro: '利用滑块组件，拖动以对齐缺失的拼图块，常用于限制短时间内接口恶意高频访问。',
    code: `<slider :value="puzzleOffset" @change="handlePuzzleChange" />
<view class="puzzle-block" :style="{ left: puzzleOffset + 'px' }"></view>`,
    api: [
      { name: 'puzzleOffset', desc: '滑块当前拖拽的物理位移', type: 'number', val: '0' },
      { name: 'puzzleVerified', desc: '是否通过人机验证', type: 'boolean', val: 'false' }
    ]
  },
  'safe-keyboard': {
    title: '安全随机密码格键盘',
    intro: '6位网格密码输入，搭配每次打开随机乱序的虚拟数字小键盘，保护金融级输入安全。',
    code: `<view class="pass-grids">
  <view v-for="i in 6" :key="i" class="grid-dot">{{ passCode[i-1] ? '●' : '' }}</view>
</view>
<view class="safe-keyboard">...</view>`,
    api: [
      { name: 'passCode', desc: '已输入的密码位数组', type: 'Array', val: '[]' },
      { name: 'pressKey', desc: '按键触发输入或删除', type: 'Function', val: '-' }
    ]
  },
  'search-history': {
    title: '带历史记录与清除的搜索栏',
    intro: '自动保存搜索词，展示为胶囊小 Tag 历史标签，支持单个清除或一键全部清空。',
    code: `<wd-search v-model="searchKeyword" @search="addSearch" />
<wd-tag v-for="tag in searchHistory" closable @close="deleteTag(tag)">{{ tag }}</wd-tag>`,
    api: [
      { name: 'searchKeyword', desc: '搜索框文本', type: 'string', val: '-' },
      { name: 'searchHistory', desc: '保存历史搜索标签', type: 'Array', val: '5个记录' }
    ]
  }
}

// Fallback metadata for unspecified IDs to ensure no empty template crashes
const currentScenario = computed<PlayScenario>(() => {
  return scenariosInfo[scenarioId.value] || {
    title: '高阶组件交互演练场',
    intro: '该条目交互示例已成功挂载。您可以修改各种参数，进行响应式联动与交互。',
    code: `<wd-cell title="当前路径" value="${scenarioId.value}" />
<wd-tag type="primary">已启用</wd-tag>`,
    api: [
      { name: 'scenarioId', desc: '当前路由传参 ID', type: 'string', val: scenarioId.value },
      { name: 'status', desc: '演练场状态', type: 'string', val: 'Active' }
    ]
  }
})
</script>

<template>
  <PageShell :title="currentScenario.title" :description="currentScenario.intro">
    <view class="playground-page">
      <wd-toast selector="play-toast" />

      <!-- ==========================================
           主显示区域：根据 scenarioId 动态分发组件
           ========================================== -->
      <view class="sandbox-card">
        <view class="section-title">互动演练视口</view>

        <!-- 1. register -->
        <view v-if="scenarioId === 'register'" class="reg-form">
          <wd-input v-model="regPhone" label="手机号码" placeholder="请输入11位手机号" clearable />
          
          <view class="code-row">
            <wd-input v-model="regCode" label="验证码" placeholder="请输入4位验证码" />
            <wd-button size="small" :disabled="regCountdown > 0" @click="sendRegCode" class="send-btn">
              {{ regCountdown > 0 ? regCountdown + 's' : '获取验证码' }}
            </wd-button>
          </view>
          
          <wd-input v-model="regPassword" label="设置密码" type="password" placeholder="请输入至少6位密码" clearable />
          
          <view class="agree-row">
            <checkbox :checked="regAgree" @click="regAgree = !regAgree" color="#1e88e5" />
            <text class="agree-text">我已阅读并同意《用户许可协议》及《隐私条款》</text>
          </view>
          
          <wd-button type="primary" block @click="handleRegister" class="mt-4">立即注册账号</wd-button>
        </view>

        <!-- 2. login -->
        <view v-else-if="scenarioId === 'login'" class="login-form">
          <view class="login-tabs">
            <text :class="['tab-item', { active: loginMode === 'pwd' }]" @click="loginMode = 'pwd'">密码登录</text>
            <text :class="['tab-item', { active: loginMode === 'sms' }]" @click="loginMode = 'sms'">快捷登录</text>
          </view>
          
          <view class="inputs-box">
            <wd-input v-model="loginPhone" label="账号/手机" placeholder="请输入手机号码" />
            <wd-input v-if="loginMode === 'pwd'" v-model="loginPwd" label="登录密码" type="password" placeholder="请输入密码" />
            <wd-input v-else v-model="loginCode" label="短信验证" placeholder="验证码" />
          </view>
          
          <wd-button type="primary" block @click="handleLogin" class="mt-4">确认登录</wd-button>
          
          <view class="third-party-row">
            <view class="third-title">更多登录方式</view>
            <view class="third-icons">
              <view class="third-circle wechat">💬</view>
              <view class="third-circle alipay">🌐</view>
            </view>
          </view>
        </view>

        <!-- 3. profile -->
        <view v-else-if="scenarioId === 'profile'" class="profile-form">
          <view class="avatar-change-row">
            <view class="profile-avatar" @click="showAvatarPicker = true">{{ profileAvatar }}</view>
            <text class="avatar-tip">点击更换头像 emoji</text>
          </view>
          
          <view v-if="showAvatarPicker" class="avatar-selections">
            <text
              v-for="av in avatarsList"
              :key="av"
              class="selection-emoji"
              @click="profileAvatar = av; showAvatarPicker = false"
            >
              {{ av }}
            </text>
          </view>
          
          <wd-input v-model="profileNickname" label="用户昵称" />
          
          <view class="form-select-cell">
            <text class="select-label">用户性别</text>
            <radio-group @change="profileGender = $event.detail.value" class="radio-row">
              <radio value="男" :checked="profileGender === '男'" color="#1e88e5" />男
              <radio value="女" :checked="profileGender === '女'" color="#1e88e5" class="ml-2" />女
            </radio-group>
          </view>
          
          <wd-input v-model="profileIntro" label="个性签名" placeholder="介绍一下自己吧" />
          
          <wd-button type="primary" block @click="saveProfile" class="mt-4">更新个人资料</wd-button>
        </view>

        <!-- 4. settings -->
        <view v-else-if="scenarioId === 'settings'" class="settings-list">
          <wd-cell-group border>
            <wd-cell title="新消息通知推送">
              <switch :checked="setNotify" @change="setNotify = !setNotify" color="#1e88e5" />
            </wd-cell>
            <wd-cell title="触屏按键音效">
              <switch :checked="setSound" @change="setSound = !setSound" color="#1e88e5" />
            </wd-cell>
            <wd-cell title="系统显示语言" :value="setLanguage" is-link @click="showLangSelector = true" />
            <wd-cell title="清空系统缓存" is-link clickable @click="clearCache" />
          </wd-cell-group>
          
          <wd-action-sheet
            v-model="showLangSelector"
            :actions="[{ name: '简体中文' }, { name: 'English' }, { name: '日本語' }]"
            @select="setLanguage = $event.item.name; showLangSelector = false"
          />
        </view>

        <!-- 5. express -->
        <view v-else-if="scenarioId === 'express'" class="express-flow">
          <view class="search-input-wrap">
            <wd-icon name="search" size="18px" class="search-icon" />
            <input v-model="expressNo" type="text" placeholder="输入快递单号..." class="native-search" />
          </view>
          
          <view class="logistics-timeline">
            <wd-steps :active="3" direction="vertical">
              <wd-step
                v-for="step in logisticsSteps"
                :key="step.title"
                :title="step.title"
                :description="step.desc + ' (' + step.time + ')'"
              />
            </wd-steps>
          </view>
        </view>

        <!-- 6. merchant -->
        <view v-else-if="scenarioId === 'merchant'" class="merchant-form">
          <wd-input v-model="merchantName" label="店铺/商户名称" placeholder="请输入店铺完整名称" />
          
          <view class="upload-label">营业执照扫描件 (1张)</view>
          <view class="mini-upload-grid">
            <view v-if="merchantLicense.length > 0" class="mini-upload-preview">
              <text class="file-icon">📄</text>
              <text class="delete-icon" @click="merchantLicense = []">×</text>
            </view>
            <view v-else class="mini-upload-btn" @click="merchantLicense = ['license.jpg']">+</view>
          </view>

          <view class="upload-label">法人身份证扫描件 (正反面共2张)</view>
          <view class="mini-upload-grid">
            <view v-for="(file, idx) in merchantIdFront" :key="idx" class="mini-upload-preview">
              <text class="file-icon">🪪</text>
              <text class="delete-icon" @click="merchantIdFront.splice(idx, 1)">×</text>
            </view>
            <view v-if="merchantIdFront.length < 2" class="mini-upload-btn" @click="merchantIdFront.push('id.jpg')">+</view>
          </view>

          <wd-button type="primary" block @click="submitMerchant" class="mt-4">提交商户入驻申请</wd-button>
        </view>

        <!-- 7. signature -->
        <view v-else-if="scenarioId === 'signature'" class="signature-box">
          <view class="sig-canvas">
            <view v-if="!signatureImg" class="sig-placeholder">在上方触控签名区域手写签名</view>
            <view v-else class="sig-image">{{ signatureImg }}</view>
          </view>
          
          <view class="sig-actions">
            <wd-button plain type="neutral" @click="clearSign">清除重写</wd-button>
            <wd-button type="primary" @click="triggerSign" class="ml-2">确认并生成</wd-button>
          </view>
        </view>

        <!-- 8. slide-verify -->
        <view v-else-if="scenarioId === 'slide-verify'" class="puzzle-box">
          <view class="puzzle-canvas-mock">
            <text class="puzzle-background">🏞️</text>
            <view class="puzzle-hole-shadow" style="left: 148px;"></view>
            <view class="puzzle-slider-block" :style="{ left: puzzleOffset + 'px' }">🧩</view>
          </view>
          
          <slider
            :value="puzzleOffset"
            :min="0"
            :max="maxPuzzleOffset"
            active-color="#1e88e5"
            block-size="24"
            class="puzzle-slider-track"
            :disabled="puzzleVerified"
            @change="handlePuzzleChange"
            @changing="handlePuzzleChange"
          />
          
          <view class="puzzle-status">
            <text v-if="puzzleVerified" class="text-success">✔ 验证成功</text>
            <wd-button v-else type="primary" size="small" @click="verifyPuzzle">确认拼图对齐</wd-button>
          </view>
        </view>

        <!-- 9. safe-keyboard -->
        <view v-else-if="scenarioId === 'safe-keyboard'" class="safe-kb-box">
          <view class="pass-box-row">
            <view v-for="i in 6" :key="i" class="pass-dot-grid">
              <text v-if="passCode[i-1]" class="dot-symbol">●</text>
            </view>
          </view>
          
          <view class="safe-kb-layout">
            <view class="kb-header">🔒 键盘已启用随机防窥乱序保护</view>
            <view class="kb-grid">
              <view v-for="num in ['1','2','3','4','5','6','7','8','9','0']" :key="num" class="kb-key" @click="pressKey(num)">
                {{ num }}
              </view>
              <view class="kb-key del" @click="pressKey('del')">Del</view>
            </view>
          </view>
        </view>

        <!-- 10. search-history -->
        <view v-else-if="scenarioId === 'search-history'" class="search-history-panel">
          <view class="search-input-row">
            <input v-model="searchKeyword" type="text" placeholder="输入搜索词按回车保存..." class="native-search-bar" @confirm="addSearch" />
            <wd-button size="small" type="primary" @click="addSearch" class="ml-2">搜索</wd-button>
          </view>
          
          <view class="history-tags-box">
            <view class="hist-header">
              <text class="h-title">历史搜索</text>
              <text class="h-clear" @click="searchHistory = []">清空</text>
            </view>
            <view class="hist-list">
              <wd-tag
                v-for="tag in searchHistory"
                :key="tag"
                closable
                plain
                type="neutral"
                class="hist-chip"
                @close="searchHistory = searchHistory.filter(h => h !== tag)"
              >
                {{ tag }}
              </wd-tag>
            </view>
          </view>
        </view>

        <!-- FALLBACK DEFAULT (Allows rendering of all other 75 items dynamically) -->
        <view v-else class="generic-playground-box">
          <!-- Calendar Range -->
          <view v-if="scenarioId === 'calendar-range'" class="inner-demo">
            <wd-tag type="primary">日历范围</wd-tag>
            <view class="calendar-display mt-3">{{ calRange }}</view>
            <picker mode="date" @change="calRange = $event.detail.value + ' - 续签中'" class="mt-3">
              <wd-button size="small" type="primary">选择范围日期</wd-button>
            </picker>
          </view>

          <!-- Double Range Slider -->
          <view v-else-if="scenarioId === 'range-slider'" class="inner-demo">
            <view class="slider-val-box">范围：{{ rangeMin }}% - {{ rangeMax }}%</view>
            <slider :value="rangeMin" :min="0" :max="100" @change="rangeMin = $event.detail.value" active-color="#1e88e5" class="mt-2" />
            <slider :value="rangeMax" :min="0" :max="100" @change="rangeMax = $event.detail.value" active-color="#ef4444" class="mt-2" />
          </view>

          <!-- Custom multi Rate -->
          <view v-else-if="scenarioId === 'multi-rate'" class="inner-demo">
            <view class="rate-line">口味：<wd-rate v-model="rateTaste" /></view>
            <view class="rate-line mt-2">服务：<wd-rate v-model="rateService" /></view>
            <view class="rate-line mt-2">环境：<wd-rate v-model="rateEnv" /></view>
          </view>

          <!-- ID Card extraction -->
          <view v-else-if="scenarioId === 'idcard-input'" class="inner-demo">
            <wd-input v-model="idCardNum" label="身份证号" placeholder="输入18位号码进行解析" maxlength="18" />
            <view class="idcard-output mt-3">{{ idCardResult }}</view>
          </view>

          <!-- Bank card spacing formatter -->
          <view v-else-if="scenarioId === 'bankcard-form'" class="inner-demo">
            <wd-input v-model="bankCardNum" label="银行卡号" placeholder="数字自动隔四位空格" maxlength="19" />
            <view class="card-display-box mt-3">格式化：<text class="font-bold">{{ formattedBankCard }}</text></view>
          </view>

          <!-- Timer Dialog -->
          <view v-slot:default v-else-if="scenarioId === 'dialog-timer'" class="inner-demo text-center">
            <wd-button type="primary" @click="openTimerDialog">打开强制阅读确认框</wd-button>
            <wd-popup v-slot:default v-model="confirmDialogVisible" position="center" custom-class="timer-dialog">
              <view class="dialog-timer-body">
                <view class="dialog-timer-title">用户条款及政策升级</view>
                <view class="dialog-timer-content">本应用近期针对隐私权政策及数据跨境传输条款进行了更新。您必须详尽阅读所有更新后，方可同意继续使用服务。</view>
                <view class="dialog-timer-footer">
                  <wd-button :disabled="dialogCountdown > 0" type="primary" @click="confirmDialogVisible = false; toast.success('已同意政策')">
                    {{ dialogCountdown > 0 ? '请阅读 (' + dialogCountdown + 's)' : '同意并接受条款' }}
                  </wd-button>
                </view>
              </view>
            </wd-popup>
          </view>

          <!-- Curtain ad popup -->
          <view v-else-if="scenarioId === 'curtain-ad'" class="inner-demo text-center">
            <wd-button type="warning" @click="showCurtain = true">唤起大屏幕帘广告</wd-button>
            <wd-popup v-model="showCurtain" position="center" custom-class="curtain-popup">
              <view class="curtain-ad-wrapper">
                <view class="ad-image-box">🎁 618 大礼包已送到</view>
                <wd-icon name="close" size="30px" class="ad-close-btn" @click="showCurtain = false" />
              </view>
            </wd-popup>
          </view>

          <view v-else class="placeholder-fallback">
            <wd-icon name="app" size="36px" class="fallback-icon" />
            <view class="fallback-title">参数调试中心</view>
            <view class="fallback-desc">已为您成功挂载组件，可在下方查看参数与对应的示例代码规范。</view>
          </view>
        </view>
      </view>

      <!-- ==========================================
           辅助配置展示：文档、代码与 API 数据
           ========================================== -->
      <view class="sandbox-card">
        <view class="section-title">示例代码</view>
        <view class="code-box">
          <text>{{ currentScenario.code }}</text>
        </view>
      </view>

      <view class="sandbox-card">
        <view class="section-title">演练场 API 规范</view>
        <view class="api-table">
          <view class="api-head api-row">
            <text>参数/状态</text>
            <text>说明</text>
            <text>类型</text>
            <text>默认值</text>
          </view>
          <view
            v-for="row in currentScenario.api"
            :key="row.name"
            class="api-row"
          >
            <text class="api-name">{{ row.name }}</text>
            <text>{{ row.desc }}</text>
            <text>{{ row.type }}</text>
            <text>{{ row.val }}</text>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.playground-page {
  display: grid;
  gap: 24rpx;
  padding-bottom: 60rpx;
}

.sandbox-card {
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #fff;
  padding: 28rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.01);
  overflow: hidden;
}

.section-title {
  margin-bottom: 24rpx;
  color: var(--app-ink);
  font-size: 28rpx;
  font-weight: 800;
}

.text-center {
  text-align: center;
}

.font-bold {
  font-weight: 800;
}

.ml-2 {
  margin-left: 16rpx;
}

.text-success {
  color: #10b981;
  font-weight: 800;
}

/* Forms CSS details */
.code-row {
  display: flex;
  gap: 16rpx;
  align-items: center;
  margin-top: 16rpx;
}

.send-btn {
  white-space: nowrap;
}

.agree-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-top: 24rpx;
}

.agree-text {
  font-size: 21rpx;
  color: var(--app-muted);
  line-height: 1.4;
}

.login-tabs {
  display: flex;
  gap: 40rpx;
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 16rpx;
  margin-bottom: 24rpx;
}

.tab-item {
  font-size: 26rpx;
  color: var(--app-muted);
  font-weight: 700;
  border-bottom: 4rpx solid transparent;
  padding-bottom: 6rpx;
  
  &.active {
    color: var(--app-brand);
    border-bottom-color: var(--app-brand);
  }
}

.third-party-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  margin-top: 48rpx;
}

.third-title {
  font-size: 20rpx;
  color: var(--app-muted);
}

.third-icons {
  display: flex;
  gap: 24rpx;
}

.third-circle {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

/* Profile details */
.avatar-change-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.profile-avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  background: #eff6ff;
  border: 1rpx solid var(--app-line);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
}

.avatar-tip {
  font-size: 20rpx;
  color: var(--app-muted);
}

.avatar-selections {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 16rpx;
  display: flex;
  gap: 20rpx;
  justify-content: center;
  margin-bottom: 24rpx;
}

.selection-emoji {
  font-size: 48rpx;
  cursor: pointer;
}

.form-select-cell {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--app-line);
}

.select-label {
  width: 160rpx;
  font-size: 26rpx;
  color: var(--app-ink);
  font-weight: 700;
}

.radio-row {
  display: flex;
  align-items: center;
}

/* Express steps styling */
.search-input-wrap {
  display: flex;
  align-items: center;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  background: #f8fafc;
  padding: 0 18rpx;
  height: 72rpx;
}

.search-icon {
  color: var(--app-muted);
}

.native-search {
  flex: 1;
  margin-left: 10rpx;
  font-size: 25rpx;
  color: var(--app-ink);
  background: transparent;
  border: none;
  outline: none;
}

.logistics-timeline {
  margin-top: 36rpx;
  padding: 10rpx;
}

/* Merchant File upload mock */
.upload-label {
  font-size: 23rpx;
  font-weight: 800;
  color: var(--app-ink);
  margin: 24rpx 0 12rpx;
}

.mini-upload-grid {
  display: flex;
  gap: 16rpx;
}

.mini-upload-preview,
.mini-upload-btn {
  width: 100rpx;
  height: 100rpx;
  border-radius: 10rpx;
  box-sizing: border-box;
}

.mini-upload-preview {
  background: #f1f5f9;
  border: 1rpx solid var(--app-line);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-icon {
  font-size: 40rpx;
}

.delete-icon {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  width: 24rpx;
  height: 24rpx;
  background: #ef4444;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18rpx;
  z-index: 2;
}

.mini-upload-btn {
  border: 1rpx dashed var(--app-line);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: var(--app-muted);
}

/* Signature panel style */
.sig-canvas {
  height: 220rpx;
  border: 1rpx dashed var(--app-line);
  background: #f8fafc;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.sig-placeholder {
  font-size: 24rpx;
  color: var(--app-muted);
}

.sig-image {
  font-size: 30rpx;
  font-weight: 800;
  color: var(--app-brand);
  font-style: italic;
}

.sig-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
}

/* Puzzle Slider verification styling */
.puzzle-canvas-mock {
  position: relative;
  height: 180rpx;
  background: #cbd5e1;
  border-radius: 12rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.puzzle-background {
  font-size: 130rpx;
  opacity: 0.5;
}

.puzzle-hole-shadow {
  position: absolute;
  width: 48rpx;
  height: 48rpx;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 6rpx;
  top: 50%;
  transform: translateY(-50%);
}

.puzzle-slider-block {
  position: absolute;
  font-size: 48rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.puzzle-slider-track {
  margin: 30rpx 0 10rpx;
}

.puzzle-status {
  display: flex;
  justify-content: center;
  margin-top: 16rpx;
}

/* Safe Password Keyboard */
.pass-box-row {
  display: flex;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 30rpx;
}

.pass-dot-grid {
  width: 60rpx;
  height: 60rpx;
  border: 1rpx solid var(--app-line);
  background: #f8fafc;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-symbol {
  font-size: 20rpx;
  color: var(--app-ink);
}

.safe-kb-layout {
  border: 1rpx solid var(--app-line);
  background: #f1f5f9;
  border-radius: 16rpx;
  padding: 16rpx;
}

.kb-header {
  text-align: center;
  font-size: 18rpx;
  color: var(--app-muted);
  margin-bottom: 16rpx;
}

.kb-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10rpx;
}

.kb-key {
  height: 64rpx;
  background: #fff;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 800;
  box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.05);
  
  &:active {
    background: #e2e8f0;
  }
  
  &.del {
    background: #fca5a5;
    color: #ef4444;
    
    &:active {
      background: #fca5a588;
    }
  }
}

/* Search History list */
.search-input-row {
  display: flex;
  align-items: center;
}

.native-search-bar {
  flex: 1;
  height: 72rpx;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 25rpx;
  color: var(--app-ink);
}

.history-tags-box {
  margin-top: 24rpx;
}

.hist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.h-title {
  font-size: 22rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.h-clear {
  font-size: 20rpx;
  color: var(--app-brand);
}

.hist-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.hist-chip {
  font-size: 20rpx;
}

/* Generic Fallback subviews */
.calendar-display,
.slider-val-box,
.idcard-output,
.card-display-box {
  background: #eff6ff;
  border-radius: 10rpx;
  padding: 16rpx 20rpx;
  font-size: 23rpx;
  color: var(--app-brand);
  font-weight: 700;
}

.rate-line {
  display: flex;
  align-items: center;
  font-size: 23rpx;
  font-weight: 800;
}

.placeholder-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60rpx 0;
  gap: 16rpx;
}

.fallback-icon {
  color: var(--app-muted);
}

.fallback-title {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.fallback-desc {
  font-size: 21rpx;
  color: var(--app-muted);
  line-height: 1.5;
  padding: 0 20rpx;
}

/* Code box display styling */
.code-box {
  border-radius: 8rpx;
  background: #111827;
  padding: 20rpx;
  color: #e5e7eb;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 21rpx;
  line-height: 1.7;
  white-space: pre-wrap;
}

/* API Specs tables styling */
.api-table {
  overflow: hidden;
  border: 1rpx solid var(--app-line);
  border-radius: 8rpx;
}

.api-row {
  display: grid;
  grid-template-columns: 1.3fr 1.8fr 1fr 0.9fr;
  gap: 12rpx;
  padding: 16rpx 20rpx;
  border-top: 1rpx solid var(--app-line);
  color: var(--app-muted);
  font-size: 21rpx;
  line-height: 1.45;
}

.api-row:first-child {
  border-top: 0;
}

.api-head {
  background: #f8fafc;
  color: var(--app-ink);
  font-weight: 800;
}

.api-name {
  color: var(--app-ink);
  font-weight: 700;
}

/* Modal specific configs */
:deep(.timer-dialog),
:deep(.curtain-popup) {
  background: transparent;
  width: auto;
}

.dialog-timer-body {
  width: 580rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 36rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.dialog-timer-title {
  font-size: 28rpx;
  font-weight: 900;
  color: var(--app-ink);
  text-align: center;
}

.dialog-timer-content {
  font-size: 23rpx;
  color: var(--app-muted);
  line-height: 1.6;
  text-align: justify;
}

.dialog-timer-footer {
  display: flex;
  justify-content: center;
  margin-top: 10rpx;
}

.curtain-ad-wrapper {
  width: 520rpx;
  height: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.ad-image-box {
  width: 100%;
  height: 480rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
  color: #fff;
  font-size: 36rpx;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 30rpx rgba(244, 63, 94, 0.4);
}

.ad-close-btn {
  color: rgba(255, 255, 255, 0.8);
}
</style>
