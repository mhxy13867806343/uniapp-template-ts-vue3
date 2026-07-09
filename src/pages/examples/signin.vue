<script setup lang="ts">
import PageShell from '@/components/PageShell.vue'

const toast = useToast('sign-toast')

// Active check-in ID (0 represents catalog/lobby, 1-25 represents specific views)
const activeId = ref(0)

onLoad((query) => {
  if (typeof query?.id === 'string') {
    activeId.value = parseInt(query.id) || 0
  }
})

// Go back to catalog
function goBackToCatalog() {
  activeId.value = 0
  // Clean query param
  uni.redirectTo({
    url: '/pages/examples/signin'
  })
}

// Select template from catalog
function selectTemplate(id: number) {
  activeId.value = id
  uni.navigateTo({
    url: `/pages/examples/signin?id=${id}`
  })
}

// ==========================================
// 25个签到模板的数据与交互状态定义
// ==========================================
const checkinLogged = ref(false)
const scoreTotal = ref(100)

const templatesList = [
  { id: 1, title: '7天连续签到', desc: '经典一字排开的七日累积高额奖池设计。', tag: '经典' },
  { id: 2, title: '30天日历签到', desc: '网格日历模式，支持查看整个月打卡漏签。', tag: '日历' },
  { id: 3, title: '补签卡特权签到', desc: '支持消耗补签卡补签历史日期的补签系统。', tag: '功能' },
  { id: 4, title: '阶梯翻倍签到', desc: '周期积分递增，第3/7日解锁宝箱惊喜。', tag: '趣味' },
  { id: 5, title: '积分任务组合签到', desc: '需完成浏览、分享等前置任务方可打卡。', tag: '任务' },
  { id: 6, title: '极简一键签到', desc: '巨幅纯净水波纹动效按钮，触觉回弹极致。', tag: '极简' },
  { id: 7, title: 'VIP 尊享乘数签到', desc: '金黑轻奢质感卡片，VIP专属倍数乘算。', tag: 'VIP' },
  { id: 8, title: '合伙人团队签到', desc: '团队累计满打卡人数，全队瓜分大额礼包。', tag: '社交' },
  { id: 9, title: '盲盒惊喜签到', desc: '签到即拆盲盒，随机抽免邮、大额红包。', tag: '游戏' },
  { id: 10, title: '翻牌九宫格签到', desc: '九张卡片背面朝上，点击翻转抽超级积分。', tag: '游戏' },
  { id: 11, title: '金币砸金蛋签到', desc: '趣味砸金蛋拟真碎裂，敲出金币爆屏动效。', tag: '游戏' },
  { id: 12, title: '每日运势抽签签到', desc: '国潮抽签桶，抽运势签附赠每日程序员金句。', tag: '国潮' },
  { id: 13, title: '种树浇水养成签到', desc: '收集打卡水滴浇灌虚拟果树，成长期果实兑现。', tag: '养成' },
  { id: 14, title: '关卡地图闯关签到', desc: '蛇形游乐园地图，每天签到点亮一个关卡。', tag: '关卡' },
  { id: 15, title: '视频广告双倍签到', desc: '打卡后弹窗引导看视频，翻倍积分收益。', tag: '商业' },
  { id: 16, title: '早起瓜分契约金签到', desc: '投入契约积分挑战打卡，瓜分未打卡者积分。', tag: '挑战' },
  { id: 17, title: '早起挑战赛签到', desc: '限制每日早上 5:00 - 8:00 黄金时段打卡。', tag: '时效' },
  { id: 18, title: '地理围栏定位签到', desc: '校对当前 GPS 位置，在公司/门店范围内解锁。', tag: '硬件' },
  { id: 19, title: '运动步数同步签到', desc: '今日步数达 5000 步同步后，即可签到打卡。', tag: '硬件' },
  { id: 20, title: '语音指令签到', desc: '按住朗读特定短语，识别音波完成打卡。', tag: '硬件' },
  { id: 21, title: '答题式知识签到', desc: '回答一个技术/常识单选题，答对后成功签到。', tag: '问答' },
  { id: 22, title: '国风水墨书法签到', desc: '墨竹山水背景，搭配印章及楷体打卡标签。', tag: '主题' },
  { id: 23, title: '赛博朋克霓虹签到', desc: '迷幻紫绿荧光线条，霓虹灯管闪烁打卡动效。', tag: '主题' },
  { id: 24, title: '像素怀旧街机签到', desc: '红白机像素风格、复古红心血量条打卡。', tag: '主题' },
  { id: 25, title: '情侣双人契约签到', desc: '双人爱心进度联动，均打卡才能获取双倍甜蜜。', tag: '情侣' }
]

// Custom logic variables for specific signins
// Day status for 7-day streak
const streakDays = ref([
  { day: 1, val: 10, signed: true },
  { day: 2, val: 10, signed: true },
  { day: 3, val: 20, signed: false },
  { day: 4, val: 10, signed: false },
  { day: 5, val: 10, signed: false },
  { day: 6, val: 15, signed: false },
  { day: 7, val: 50, signed: false }
])

function signStreakDay(dayNum: number) {
  if (checkinLogged.value) return
  const target = streakDays.value.find(d => d.day === dayNum)
  if (target && !target.signed) {
    target.signed = true
    checkinLogged.value = true
    scoreTotal.value += target.val
    toast.success(`第 ${dayNum} 天签到成功，获得 ${target.val} 积分`)
  }
}

// 3. Retroactive Card
const retroRetroCards = ref(2)
const retroDays = ref([
  { date: '07-06', signed: true, missed: false },
  { date: '07-07', signed: false, missed: true },
  { date: '07-08', signed: true, missed: false },
  { date: '07-09', signed: false, missed: false } // Today
])

function signRetroToday() {
  const today = retroDays.value[3]
  if (!today.signed) {
    today.signed = true
    toast.success('今日打卡成功！')
  }
}

function retroSignDay(index: number) {
  if (retroRetroCards.value <= 0) {
    toast.warning('您没有补签卡了！')
    return
  }
  const day = retroDays.value[index]
  if (day.missed && !day.signed) {
    day.signed = true
    day.missed = false
    retroRetroCards.value--
    toast.success('消耗补签卡 x1，补签成功！')
  }
}

// 5. Tasks Sign-in
const task1Done = ref(false)
const task2Done = ref(false)

// 9. Blindbox
const blindboxOpened = ref(false)
const blindboxPrize = ref('')
const prizes = ['免邮券 🎫', '50 积分 🪙', '大额返现红包 🧧', '谢谢参与 🍀', '保温杯一个 🥤']

function openBlindbox() {
  if (blindboxOpened.value) return
  const randomPrize = prizes[Math.floor(Math.random() * prizes.length)]
  blindboxPrize.value = randomPrize
  blindboxOpened.value = true
  toast.success(`获得：${randomPrize}`)
}

// 10. Card Flip
const flipCards = ref([
  { id: 1, flipped: false, prize: '10 积分' },
  { id: 2, flipped: false, prize: '优惠券' },
  { id: 3, flipped: false, prize: '50 积分' },
  { id: 4, flipped: false, prize: '谢谢参与' },
  { id: 5, flipped: false, prize: '20 积分' },
  { id: 6, flipped: false, prize: '免费包邮' },
  { id: 7, flipped: false, prize: '双倍积分卡' },
  { id: 8, flipped: false, prize: '5 积分' },
  { id: 9, flipped: false, prize: '80 积分' }
])

function flipCard(idx: number) {
  if (flipCards.value.some(c => c.flipped)) {
    toast.warning('每天只能翻一张卡片！')
    return
  }
  flipCards.value[idx].flipped = true
  toast.success(`恭喜抽中：${flipCards.value[idx].prize}`)
}

// 11. Egg Smash
const eggSmashed = ref(false)

// 12. Fortune Cookie
const fortuneSlip = ref('')
const fortuneQuotes = [
  '大吉：宜合并分支，忌加班修Bug',
  '中吉：今日编译一次过，顺顺利利',
  '大吉：适合重构祖传代码，神清气爽',
  '小吉：今天吃香喝辣，多喝热水'
]

function drawFortune() {
  if (fortuneSlip.value) return
  fortuneSlip.value = fortuneQuotes[Math.floor(Math.random() * fortuneQuotes.length)]
  toast.success('解签成功！')
}

// 13. Tree Watering
const treeProgress = ref(40)
const waterAmount = ref(10)

function waterTree() {
  if (waterAmount.value <= 0) {
    toast.warning('今天的水滴用光了！')
    return
  }
  waterAmount.value -= 10
  treeProgress.value = Math.min(treeProgress.value + 20, 100)
  toast.success('浇水成功！成长值 +20')
}

// 15. Ad double
const showAdModal = ref(false)
const pointsAd = ref(20)

// 18. GPS
const gpsCoords = ref('经度: 121.50, 纬度: 31.24')
const inGpsRange = ref(true)

// 19. Steps
const stepsCount = ref(4200)

function syncSteps() {
  stepsCount.value = 6520
  toast.success('同步成功！今日步数达 6,520')
}

// 21. Quiz Signin
const quizAnswered = ref(false)
const quizSelected = ref('')

function checkQuizAnswer(ans: string) {
  quizSelected.value = ans
  quizAnswered.value = true
  if (ans === 'b') {
    toast.success('回答正确！成功签到')
  } else {
    toast.error('回答错误，无法获得今天积分')
  }
}
</script>

<template>
  <PageShell title="签到打卡中心" description="精选 25 种适配移动端业务与趣味游戏的高阶签到组件演示。">
    <view class="signin-center-page">
      <wd-toast selector="sign-toast" />

      <!-- ==========================================
           签到大厅（目录视图） - activeId === 0
           ========================================== -->
      <view v-if="activeId === 0" class="signin-lobby">
        <view class="lobby-header-card">
          <view class="lobby-title">签到设计模板库</view>
          <view class="lobby-desc">包含 25 个完全不同的交互设计模式，采用 query 路由传参渲染。</view>
        </view>

        <view class="lobby-grid">
          <view
            v-for="t in templatesList"
            :key="t.id"
            class="lobby-item"
            @click="selectTemplate(t.id)"
          >
            <view class="item-meta">
              <text class="item-id">#{{ String(t.id).padStart(2, '0') }}</text>
              <wd-tag size="small" type="primary" plain>{{ t.tag }}</wd-tag>
            </view>
            <view class="item-title">{{ t.title }}</view>
            <view class="item-desc">{{ t.desc }}</view>
          </view>
        </view>
      </view>

      <!-- ==========================================
           签到演示画布 - activeId 1 至 25
           ========================================== -->
      <view v-else class="signin-sandbox">
        <!-- Floating header to go back -->
        <view class="sandbox-header">
          <wd-button size="small" type="neutral" icon="arrow-left" plain @click="goBackToCatalog">返回目录</wd-button>
          <text class="sandbox-title">{{ templatesList[activeId - 1]?.title }}</text>
        </view>

        <!-- Dynamic Templates Views -->
        <view class="sandbox-body">
          
          <!-- ID 1: 7-Day Streak -->
          <view v-if="activeId === 1" class="sig-view-1">
            <view class="points-summary">当前累积：<text class="num font-bold">{{ scoreTotal }}</text> 积分</view>
            <view class="horizontal-days mt-3">
              <view
                v-for="d in streakDays"
                :key="d.day"
                :class="['day-bubble', { active: d.signed }]"
                @click="signStreakDay(d.day)"
              >
                <text class="bubble-day">D{{ d.day }}</text>
                <text class="bubble-val">+{{ d.val }}</text>
                <view v-if="d.signed" class="check-mark">✔</view>
              </view>
            </view>
            <wd-button type="primary" block :disabled="checkinLogged" class="mt-4" @click="checkinLogged = true; scoreTotal += 20; toast.success('签到成功')">
              {{ checkinLogged ? '今日已签到' : '立即签到' }}
            </wd-button>
          </view>

          <!-- ID 2: 30-Day Monthly calendar -->
          <view v-slot:default v-else-if="activeId === 2" class="sig-view-2">
            <view class="calendar-grid-header">2026年7月 签到板</view>
            <view class="calendar-grid">
              <view
                v-for="i in 30"
                :key="i"
                :class="['cal-day', { checked: i <= 8 }]"
              >
                <text class="cal-num">{{ i }}</text>
                <text v-if="i <= 8" class="cal-tick">✔</text>
              </view>
            </view>
          </view>

          <!-- ID 3: Retroactive Card -->
          <view v-else-if="activeId === 3" class="sig-view-3">
            <view class="retro-status">
              <text>我的补签卡：<text class="font-bold text-brand">{{ retroRetroCards }} 张</text></text>
            </view>

            <view class="retro-list mt-3">
              <view
                v-for="(day, idx) in retroDays"
                :key="idx"
                class="retro-item"
              >
                <text class="retro-date">{{ day.date }}</text>
                <view class="retro-action">
                  <wd-tag v-if="day.signed" type="success">已打卡</wd-tag>
                  <wd-button v-else-if="day.missed" size="small" type="warning" plain @click="retroSignDay(idx)">补签</wd-button>
                  <wd-button v-else size="small" type="primary" @click="signRetroToday">签到</wd-button>
                </view>
              </view>
            </view>
          </view>

          <!-- ID 4: Staggered points -->
          <view v-else-if="activeId === 4" class="sig-view-4">
            <view class="chest-flow">
              <view
                v-for="i in [1, 2, 3, 4, 5]"
                :key="i"
                class="chest-node"
              >
                <view :class="['node-circle', { active: i <= 3 }]">D{{ i }}</view>
                <view v-if="i === 3 || i === 5" class="chest-box-icon">🎁</view>
              </view>
            </view>
            <wd-button type="primary" block @click="toast.success('开启惊喜宝箱，获得双倍卡！')" class="mt-4">签到并开启宝箱</wd-button>
          </view>

          <!-- ID 5: Task based -->
          <view v-else-if="activeId === 5" class="sig-view-5">
            <view class="task-line">
              <text class="task-title">任务一：浏览推荐商品 10 秒</text>
              <wd-button size="small" :type="task1Done ? 'success' : 'primary'" plain @click="task1Done = true">
                {{ task1Done ? '已完成' : '去完成' }}
              </wd-button>
            </view>
            <view class="task-line mt-3">
              <text class="task-title">任务二：分享给好友群聊</text>
              <wd-button size="small" :type="task2Done ? 'success' : 'primary'" plain @click="task2Done = true">
                {{ task2Done ? '已完成' : '去完成' }}
              </wd-button>
            </view>

            <wd-button type="primary" block :disabled="!task1Done || !task2Done" class="mt-4" @click="toast.success('任务签到成功，获得 100 积分')">
              {{ (!task1Done || !task2Done) ? '请先完成上方任务' : '立即签到' }}
            </wd-button>
          </view>

          <!-- ID 6: Minimal One-Tap -->
          <view v-else-if="activeId === 6" class="sig-view-6">
            <view class="tap-circle-container">
              <view :class="['pulse-circle-btn', { signed: checkinLogged }]" @click="checkinLogged = true; toast.success('签到成功')">
                <text class="tap-txt">{{ checkinLogged ? 'DONE' : 'TAP' }}</text>
              </view>
            </view>
          </view>

          <!-- ID 7: VIP Premium -->
          <view v-else-if="activeId === 7" class="sig-view-7">
            <view class="vip-gold-card">
              <view class="vip-title">👑 VIP 尊享特权通道</view>
              <view class="vip-body">
                <view class="vip-desc">黄金会员签到尊享 1.5 倍倍率加速奖励</view>
                <view class="vip-calc">基础 20 积分 → 专享 30 积分</view>
              </view>
              <wd-button type="warning" block class="mt-3" @click="toast.success('VIP 特权签到成功 +30积分')">尊享签到</wd-button>
            </view>
          </view>

          <!-- ID 8: Team check-in -->
          <view v-else-if="activeId === 8" class="sig-view-8">
            <view class="team-progress-card">
              <view class="team-header">👥 极速合伙人小队打卡</view>
              <view class="team-bar mt-2">
                <wd-progress :percentage="60" />
              </view>
              <view class="team-desc mt-2">今日全队已打卡 3/5 人，再有 2 人全队可得大额红包！</view>
              <wd-button type="primary" block class="mt-3" @click="toast.success('您今日已成功为团队签到')">为小队打卡</wd-button>
            </view>
          </view>

          <!-- ID 9: Blindbox -->
          <view v-else-if="activeId === 9" class="sig-view-9 text-center">
            <view class="blindbox-cube" @click="openBlindbox">
              <text class="cube-icon">{{ blindboxOpened ? '🎁' : '📦' }}</text>
              <text class="cube-label">{{ blindboxOpened ? '盲盒已开启' : '点击开启神秘盲盒' }}</text>
            </view>
            <view v-if="blindboxOpened" class="prize-tag mt-3">恭喜抽中：{{ blindboxPrize }}</view>
          </view>

          <!-- ID 10: 9-Grid Flip -->
          <view v-else-if="activeId === 10" class="sig-view-10">
            <view class="grid-three-flip">
              <view
                v-for="(card, idx) in flipCards"
                :key="card.id"
                :class="['flip-cell', { flipped: card.flipped }]"
                @click="flipCard(idx)"
              >
                <view class="cell-front">?</view>
                <view class="cell-back">{{ card.prize }}</view>
              </view>
            </view>
          </view>

          <!-- ID 11: Egg Smash -->
          <view v-else-if="activeId === 11" class="sig-view-11 text-center">
            <view class="egg-container" @click="eggSmashed = true; toast.success('砸蛋成功！金币 +50')">
              <text class="egg-icon">{{ eggSmashed ? '💥' : '🥚' }}</text>
              <text class="egg-label">{{ eggSmashed ? '金蛋已被金锤砸碎' : '点击金蛋砸碎领积分' }}</text>
            </view>
          </view>

          <!-- ID 12: Fortune slip -->
          <view v-else-if="activeId === 12" class="sig-view-12 text-center">
            <view class="fortune-box">
              <text class="fortune-pot">🏮</text>
              <wd-button type="primary" plain :disabled="fortuneSlip !== ''" @click="drawFortune" class="mt-3">
                {{ fortuneSlip !== '' ? '今日运势已定' : '摇一摇抽取今日神签' }}
              </wd-button>
              <view v-if="fortuneSlip" class="fortune-slip-paper mt-3">{{ fortuneSlip }}</view>
            </view>
          </view>

          <!-- ID 13: Tree Watering -->
          <view v-else-if="activeId === 13" class="sig-view-13">
            <view class="tree-display">
              <text class="tree-icon">🌳</text>
              <text class="tree-growth">树木成长值: {{ treeProgress }}%</text>
            </view>
            <view class="tree-actions mt-3">
              <text class="water-bag">我的水壶：{{ waterAmount }}g 水</text>
              <wd-button size="small" type="success" :disabled="waterAmount <= 0" @click="waterTree">去浇水</wd-button>
            </view>
          </view>

          <!-- ID 14: Quest Map -->
          <view v-else-if="activeId === 14" class="sig-view-14">
            <view class="winding-map">
              <view class="map-node pos1 active">D1</view>
              <view class="map-node pos2 active">D2</view>
              <view class="map-node pos3 current" @click="toast.success('第三关通关成功！')">D3</view>
              <view class="map-node pos4">D4</view>
              <view class="map-node pos5">D5</view>
            </view>
          </view>

          <!-- ID 15: Ad Double -->
          <view v-else-if="activeId === 15" class="sig-view-15 text-center">
            <wd-button type="primary" @click="showAdModal = true">今日签到</wd-button>
            <wd-popup v-model="showAdModal" position="center" custom-class="ad-popup">
              <view class="ad-popup-box">
                <view class="ad-title">签到奖励</view>
                <view class="ad-desc">恭喜获得 10 积分！观看 15 秒广告视频可将奖励翻倍！</view>
                <view class="ad-actions mt-3">
                  <wd-button size="small" plain type="neutral" @click="showAdModal = false; toast.success('已领 10 积分')">直接领取</wd-button>
                  <wd-button size="small" type="primary" class="ml-2" @click="showAdModal = false; toast.success('看视频完成，获得 20 积分')">看视频双倍</wd-button>
                </view>
              </view>
            </wd-popup>
          </view>

          <!-- ID 16: Contract Pledge -->
          <view v-else-if="activeId === 16" class="sig-view-16">
            <view class="pledge-card">
              <view class="pledge-header">挑战契约金打卡</view>
              <view class="pledge-body mt-2">
                <text>当前奖池：<text class="font-bold text-orange">18,800 积分</text></text>
                <text class="block-txt mt-1">支付 5 积分契约金，明日早起按时打卡即平分奖池！</text>
              </view>
              <wd-button type="primary" block class="mt-3" @click="toast.success('加入早起打卡战队')">支付 5 积分并加入</wd-button>
            </view>
          </view>

          <!-- ID 17: Early Bird -->
          <view v-else-if="activeId === 17" class="sig-view-17 text-center">
            <view class="early-clock">⏰ 早起时段 (05:00 - 08:00)</view>
            <view class="time-tip mt-2">当前时间已超时 (Mock)</view>
            <wd-button type="primary" block disabled class="mt-3">不在时段内</wd-button>
          </view>

          <!-- ID 18: GPS Geofenced -->
          <view v-else-if="activeId === 18" class="sig-view-18">
            <view class="gps-card">
              <view class="gps-coords">{{ gpsCoords }}</view>
              <view class="gps-range mt-2 text-green">✔ 距离办公地点 25m (范围内)</view>
              <wd-button type="success" block class="mt-3" @click="toast.success('GPS 范围内签到成功')">打卡签到</wd-button>
            </view>
          </view>

          <!-- ID 19: Steps -->
          <view v-else-if="activeId === 19" class="sig-view-19">
            <view class="steps-sync-card">
              <view class="step-num font-bold">{{ stepsCount }} / 5000 步</view>
              <view class="step-bar mt-2">
                <wd-progress :percentage="Math.min(stepsCount / 50, 100)" />
              </view>
              <view class="steps-actions mt-3">
                <wd-button size="small" type="neutral" plain @click="syncSteps">同步微信步数</wd-button>
                <wd-button size="small" type="primary" :disabled="stepsCount < 5000" class="ml-2" @click="toast.success('运动步数打卡成功')">运动签到</wd-button>
              </view>
            </view>
          </view>

          <!-- ID 20: Voice -->
          <view v-else-if="activeId === 20" class="sig-view-20 text-center">
            <view class="voice-box">朗读以下口令签到：</view>
            <view class="voice-phrase mt-2 font-bold text-brand">"祝我天天开心，敲代码无Bug"</view>
            <wd-button type="primary" block class="mt-3">按住麦克风开始朗读</wd-button>
          </view>

          <!-- ID 21: Trivia Quiz -->
          <view v-else-if="activeId === 21" class="sig-view-21">
            <view class="quiz-question">【问答打卡】Rust中所有权生命周期标示用什么符号?</view>
            <view class="quiz-options mt-3">
              <wd-button size="small" :type="quizSelected === 'a' ? 'danger' : 'neutral'" plain @click="checkQuizAnswer('a')">A. & (引用)</wd-button>
              <wd-button size="small" :type="quizSelected === 'b' ? 'success' : 'neutral'" plain class="mt-2" @click="checkQuizAnswer('b')">B. 'a (生命周期)</wd-button>
              <wd-button size="small" :type="quizSelected === 'c' ? 'danger' : 'neutral'" plain class="mt-2" @click="checkQuizAnswer('c')">C. * (解引用)</wd-button>
            </view>
          </view>

          <!-- ID 22: Ink theme -->
          <view v-else-if="activeId === 22" class="sig-view-22 theme-ink text-center">
            <view class="ink-content">
              <view class="ink-poetry">“墨染千峰翠，山水入画来”</view>
              <view class="ink-seal">日签</view>
            </view>
            <wd-button type="primary" block class="mt-4" @click="toast.success('水墨打卡完成')">行书打卡</wd-button>
          </view>

          <!-- ID 23: Cyberpunk neon -->
          <view v-else-if="activeId === 23" class="sig-view-23 theme-cyber">
            <view class="cyber-header text-neon-blue">SYSTEM ONLINE</view>
            <view class="cyber-box mt-3 text-neon-pink">
              NEON MATRIX CHECKIN
            </view>
            <wd-button type="primary" block class="mt-4" @click="toast.success('赛博霓虹打卡成功')">TRIGGER MATRIX</wd-button>
          </view>

          <!-- ID 24: Pixel Retro -->
          <view v-else-if="activeId === 24" class="sig-view-24 theme-pixel text-center">
            <view class="pixel-hearts">HP: ❤ ❤ ❤</view>
            <view class="pixel-arcade mt-3">STAGE 1-1 CHECKIN</view>
            <wd-button type="primary" block class="mt-4" @click="toast.success('像素关卡打卡成功')">START ROUND</wd-button>
          </view>

          <!-- ID 25: Couple check-in -->
          <view v-else-if="activeId === 25" class="sig-view-25">
            <view class="couple-card">
              <view class="couple-avatars">
                <view class="c-av boy">👦 已打卡</view>
                <view class="c-heart">💖 18天连续</view>
                <view class="c-av girl active" @click="toast.success('女方今日打卡成功')">👧 未打卡</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<style lang="scss" scoped>
.signin-center-page {
  padding-bottom: 60rpx;
}

/* ==========================================
   签到大厅目录列表样式
   ========================================== */
.signin-lobby {
  display: grid;
  gap: 28rpx;
}

.lobby-header-card {
  background: linear-gradient(135deg, var(--app-brand) 0%, #3b82f6 100%);
  border-radius: 16rpx;
  padding: 36rpx;
  color: #fff;
  box-shadow: 0 8rpx 20rpx rgba(30, 136, 229, 0.2);
}

.lobby-title {
  font-size: 32rpx;
  font-weight: 900;
  margin-bottom: 12rpx;
}

.lobby-desc {
  font-size: 22rpx;
  opacity: 0.85;
  line-height: 1.5;
}

.lobby-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.lobby-item {
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.01);
  
  &:active {
    background: #f1f5f9;
  }
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-id {
  font-size: 20rpx;
  color: var(--app-muted);
  font-weight: 800;
}

.item-title {
  font-size: 24rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.item-desc {
  font-size: 18rpx;
  color: var(--app-muted);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ==========================================
   签到演示沙盒样式
   ========================================== */
.signin-sandbox {
  border: 1rpx solid var(--app-line);
  border-radius: 16rpx;
  background: #fff;
  padding: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.02);
}

.sandbox-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  border-bottom: 1rpx solid var(--app-line);
  padding-bottom: 20rpx;
  margin-bottom: 24rpx;
}

.sandbox-title {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--app-brand);
}

.sandbox-body {
  background: #f8fafc;
  border: 1rpx solid var(--app-line);
  border-radius: 12rpx;
  padding: 24rpx;
  min-height: 380rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.font-bold { font-weight: 800; }
.text-brand { color: var(--app-brand); }
.text-red { color: #ef4444; }
.text-orange { color: #f97316; }
.mt-2 { margin-top: 16rpx; }
.mt-3 { margin-top: 24rpx; }
.mt-4 { margin-top: 32rpx; }
.ml-2 { margin-left: 16rpx; }
.text-center { text-align: center; }

/* Sub-views CSS details */
/* ID 1: 7-Day Streak */
.points-summary {
  font-size: 24rpx;
  color: var(--app-ink);
  
  .num { font-size: 36rpx; color: var(--app-brand); }
}

.horizontal-days {
  display: flex;
  justify-content: space-between;
  gap: 8rpx;
}

.day-bubble {
  flex: 1;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 10rpx;
  padding: 10rpx 4rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  position: relative;
  
  &.active {
    background: #eff6ff;
    border-color: #3b82f6;
    
    .bubble-day,
    .bubble-val {
      color: #3b82f6;
    }
  }
}

.bubble-day { font-size: 16rpx; color: var(--app-muted); }
.bubble-val { font-size: 18rpx; color: var(--app-ink); font-weight: 800; }
.check-mark {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  width: 20rpx;
  height: 20rpx;
  background: #10b981;
  color: #fff;
  border-radius: 50%;
  font-size: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ID 2: 30-Day Monthly */
.calendar-grid-header {
  font-size: 23rpx;
  font-weight: 800;
  color: var(--app-ink);
  margin-bottom: 12rpx;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8rpx;
}

.cal-day {
  height: 48rpx;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 6rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &.checked {
    background: #e6f4ea;
    border-color: #34a853;
    
    .cal-num { color: #34a853; }
  }
}

.cal-num { font-size: 18rpx; color: var(--app-ink); }
.cal-tick {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 10rpx;
  color: #34a853;
}

/* ID 3: Retro */
.retro-status {
  font-size: 22rpx;
  color: var(--app-ink);
}

.retro-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.retro-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 1rpx solid var(--app-line);
  border-radius: 8rpx;
  padding: 10rpx 16rpx;
}

.retro-date {
  font-size: 20rpx;
  color: var(--app-ink);
  font-weight: 700;
}

/* ID 4: Chests */
.chest-flow {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    height: 4rpx;
    background: var(--app-line);
    width: 80%;
    z-index: 1;
  }
}

.chest-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  z-index: 2;
}

.node-circle {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #fff;
  border: 4rpx solid var(--app-line);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16rpx;
  font-weight: 800;
  
  &.active {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #3b82f6;
  }
}

.chest-box-icon {
  font-size: 26rpx;
}

/* ID 5: Tasks */
.task-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 8rpx;
  padding: 12rpx 16rpx;
  border: 1rpx solid var(--app-line);
}

.task-title {
  font-size: 21rpx;
  color: var(--app-ink);
}

/* ID 6: Minimal */
.tap-circle-container {
  display: flex;
  justify-content: center;
}

.pulse-circle-btn {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: #3b82f6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
  animation: pulseBtn 1.5s infinite;
  
  &.signed {
    background: #10b981;
    animation: none;
    box-shadow: none;
  }
}

.tap-txt {
  font-size: 28rpx;
  font-weight: 900;
}

@keyframes pulseBtn {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
  70% { box-shadow: 0 0 0 24rpx rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

/* ID 7: VIP premium */
.vip-gold-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 2rpx solid #fbbf24;
  border-radius: 12rpx;
  padding: 24rpx;
  color: #fef08a;
}

.vip-title {
  font-size: 24rpx;
  font-weight: 800;
}

.vip-desc {
  font-size: 20rpx;
  opacity: 0.85;
}

.vip-calc {
  font-size: 21rpx;
  font-weight: 700;
  color: #fbbf24;
  margin-top: 10rpx;
}

/* ID 8: Team checkin */
.team-progress-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1rpx solid var(--app-line);
}

.team-header {
  font-size: 22rpx;
  font-weight: 850;
  color: var(--app-ink);
}

.team-desc {
  font-size: 18rpx;
  color: var(--app-muted);
}

/* ID 9: Blindbox */
.blindbox-cube {
  width: 220rpx;
  height: 220rpx;
  background: #fdf4ff;
  border: 2rpx dashed #d946ef;
  border-radius: 16rpx;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  cursor: pointer;
  
  &:active {
    background: #fae8ff;
  }
}

.cube-icon {
  font-size: 64rpx;
}

.cube-label {
  font-size: 18rpx;
  color: #c084fc;
  font-weight: 700;
}

.prize-tag {
  font-size: 22rpx;
  color: #d946ef;
  font-weight: 800;
}

/* ID 10: 9-Grid Flip */
.grid-three-flip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
}

.flip-cell {
  height: 100rpx;
  perspective: 500px;
  position: relative;
  
  &.flipped {
    .cell-front { transform: rotateY(180deg); }
    .cell-back { transform: rotateY(0deg); }
  }
}

.cell-front,
.cell-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  font-size: 21rpx;
  font-weight: 800;
  box-sizing: border-box;
  transition: transform 0.6s ease;
}

.cell-front {
  background: #3b82f6;
  color: #fff;
}

.cell-back {
  background: #ec4899;
  color: #fff;
  transform: rotateY(180deg);
}

/* ID 11: Egg Smash */
.egg-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.egg-icon {
  font-size: 80rpx;
  cursor: pointer;
}

.egg-label {
  font-size: 20rpx;
  color: #d97706;
  font-weight: 700;
}

/* ID 12: Fortune pot */
.fortune-pot {
  font-size: 80rpx;
}

.fortune-slip-paper {
  background: #fef2f2;
  border: 1rpx solid #fecaca;
  color: #dc2626;
  font-size: 22rpx;
  font-weight: 800;
  border-radius: 8rpx;
  padding: 12rpx 20rpx;
  display: inline-block;
}

/* ID 13: Tree */
.tree-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.tree-icon {
  font-size: 90rpx;
}

.tree-growth {
  font-size: 22rpx;
  font-weight: 800;
  color: #16a34a;
}

.tree-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 8rpx;
  padding: 12rpx 20rpx;
  border: 1rpx solid var(--app-line);
}

.water-bag {
  font-size: 20rpx;
  color: var(--app-ink);
}

/* ID 14: Winding map */
.winding-map {
  position: relative;
  height: 280rpx;
  border: 1rpx dashed var(--app-line);
  background: #fff;
  border-radius: 12rpx;
}

.map-node {
  position: absolute;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #cbd5e1;
  color: #fff;
  font-size: 16rpx;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.active {
    background: #3b82f6;
  }
  
  &.current {
    background: #f97316;
    animation: pulseNode 1.5s infinite;
  }
}

.pos1 { left: 40rpx; top: 40rpx; }
.pos2 { left: 160rpx; top: 80rpx; }
.pos3 { left: 80rpx; top: 160rpx; }
.pos4 { left: 220rpx; top: 190rpx; }
.pos5 { left: 340rpx; top: 100rpx; }

@keyframes pulseNode {
  0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.5); }
  70% { box-shadow: 0 0 0 12rpx rgba(249, 115, 22, 0); }
  100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
}

/* ID 15: Ad double */
.ad-popup-box {
  width: 500rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.ad-title {
  font-size: 24rpx;
  font-weight: 850;
  color: var(--app-ink);
}

.ad-desc {
  font-size: 20rpx;
  color: var(--app-muted);
  line-height: 1.4;
  margin-top: 10rpx;
}

.ad-actions {
  display: flex;
  justify-content: flex-end;
}

/* ID 16: Pledge */
.pledge-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1rpx solid var(--app-line);
}

.pledge-header {
  font-size: 22rpx;
  font-weight: 800;
  color: var(--app-ink);
}

.pledge-body {
  font-size: 19rpx;
  color: var(--app-muted);
}

.block-txt {
  display: block;
}

/* ID 17: Early Clock */
.early-clock {
  font-size: 24rpx;
  font-weight: 800;
  color: #d97706;
}

.time-tip {
  font-size: 19rpx;
  color: var(--app-muted);
}

/* ID 18: GPS */
.gps-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1rpx solid var(--app-line);
}

.gps-coords {
  font-size: 21rpx;
  font-family: monospace;
  color: var(--app-ink);
}

.gps-range {
  font-size: 19rpx;
  font-weight: 700;
}

/* ID 19: Steps */
.steps-sync-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1rpx solid var(--app-line);
}

.step-num {
  font-size: 26rpx;
  color: var(--app-ink);
}

.steps-actions {
  display: flex;
  justify-content: flex-end;
}

/* ID 20: Voice */
.voice-box {
  font-size: 21rpx;
  color: var(--app-muted);
}

.voice-phrase {
  font-size: 24rpx;
}

/* ID 21: Quiz */
.quiz-question {
  font-size: 21rpx;
  font-weight: 800;
  color: var(--app-ink);
  line-height: 1.4;
}

.quiz-options {
  display: flex;
  flex-direction: column;
}

/* ID 22: Ink Style theme */
.theme-ink {
  background-color: #fafaf9;
  border: 2rpx solid #e7e5e4;
  border-radius: 12rpx;
  padding: 30rpx;
}

.ink-content {
  border: 2rpx solid #44403c;
  border-radius: 4rpx;
  padding: 20rpx;
  position: relative;
}

.ink-poetry {
  font-family: Georgia, serif;
  font-size: 26rpx;
  color: #1c1917;
  writing-mode: vertical-rl;
  margin: 0 auto;
  height: 200rpx;
  line-height: 1.5;
}

.ink-seal {
  position: absolute;
  bottom: 12rpx;
  right: 12rpx;
  border: 2rpx solid #b91c1c;
  color: #b91c1c;
  font-size: 14rpx;
  padding: 2rpx 4rpx;
  transform: rotate(-10deg);
}

/* ID 23: Cyberpunk neon style */
.theme-cyber {
  background-color: #0f172a;
  border: 2rpx solid #10b981;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 0 14rpx rgba(16, 185, 129, 0.3);
}

.cyber-header {
  font-family: 'Courier New', Courier, monospace;
  font-size: 26rpx;
  font-weight: 900;
  letter-spacing: 4rpx;
}

.cyber-box {
  border: 1rpx solid #ec4899;
  border-radius: 8rpx;
  padding: 20rpx;
  background: #020617;
  font-size: 21rpx;
  font-family: monospace;
  box-shadow: 0 0 10rpx rgba(236, 72, 153, 0.2);
}

.text-neon-blue { color: #38bdf8; text-shadow: 0 0 8rpx #38bdf8; }
.text-neon-pink { color: #f472b6; text-shadow: 0 0 8rpx #f472b6; }

/* ID 24: Pixel retro style */
.theme-pixel {
  background-color: #022c22;
  border: 4rpx solid #10b981;
  border-radius: 0;
  padding: 30rpx;
}

.pixel-hearts {
  font-family: monospace;
  font-size: 22rpx;
  color: #ef4444;
}

.pixel-arcade {
  font-family: monospace;
  font-size: 23rpx;
  color: #fbbf24;
}

/* ID 25: Couple checkin */
.couple-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1rpx solid var(--app-line);
}

.couple-avatars {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.c-av {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18rpx;
  background: #f1f5f9;
  border: 1rpx solid var(--app-line);
  color: var(--app-muted);
  
  &.active {
    background: #fdf2f8;
    border-color: #ec4899;
    color: #ec4899;
    font-weight: 800;
  }
}

.c-heart {
  font-size: 21rpx;
  color: #ef4444;
}
</style>
