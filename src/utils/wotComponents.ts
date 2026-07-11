export interface ComponentItem {
  name: string
  title: string
  path: string
  group: string
}

export interface ComponentGroup {
  title: string
  items: ComponentItem[]
}

export interface ApiRow {
  name: string
  description: string
  type: string
  defaultValue: string
}

export interface EventRow {
  name: string
  description: string
  payload: string
}

export interface SlotRow {
  name: string
  description: string
}

const rawGroups = [
  {
    title: '基础',
    items: [
      ['Button', '按钮', 'button'],
      ['Icon', '图标', 'icon'],
      ['Text', '文本', 'text'],
      ['Layout', '布局', 'layout'],
      ['Cell', '单元格', 'cell'],
      ['Fab', '悬浮按钮', 'fab'],
      ['Transition', '动画', 'transition'],
      ['Resize', '监听元素尺寸变化', 'resize'],
      ['ConfigProvider', '全局配置', 'config-provider'],
      ['RootPortal', '根节点', 'root-portal']
    ]
  },
  {
    title: '导航',
    items: [
      ['Navbar', '导航栏', 'navbar'],
      ['Tabbar', '标签栏', 'tabbar'],
      ['Tabs', '标签页', 'tabs'],
      ['Segmented', '分段器', 'segmented'],
      ['Sidebar', '侧边栏', 'sidebar'],
      ['Pagination', '分页', 'pagination'],
      ['IndexBar', '索引栏', 'index-bar'],
      ['Backtop', '回到顶部', 'backtop'],
      ['Tour', '漫游', 'tour']
    ]
  },
  {
    title: '录入',
    items: [
      ['Form', '表单', 'form'],
      ['Input', '输入框', 'input'],
      ['Textarea', '文本域', 'textarea'],
      ['PasswordInput', '密码输入框', 'password-input'],
      ['Keyboard', '虚拟键盘', 'keyboard'],
      ['InputNumber', '计数器', 'input-number'],
      ['Search', '搜索框', 'search'],
      ['Checkbox', '复选框', 'checkbox'],
      ['Radio', '单选框', 'radio'],
      ['Switch', '开关', 'switch'],
      ['Rate', '评分', 'rate'],
      ['Slider', '滑块', 'slider'],
      ['Picker', '选择器', 'picker'],
      ['PickerView', '选择器视图', 'picker-view'],
      ['SelectPicker', '单复选选择器', 'select-picker'],
      ['Cascader', '级联选择器', 'cascader'],
      ['Calendar', '日历选择器', 'calendar'],
      ['CalendarView', '日历面板', 'calendar-view'],
      ['DatetimePicker', '时间选择器', 'datetime-picker'],
      ['DatetimePickerView', '时间选择器视图', 'datetime-picker-view'],
      ['Upload', '上传', 'upload'],
      ['Signature', '签名', 'signature'],
      ['SlideVerify', '滑动验证', 'slide-verify']
    ]
  },
  {
    title: '反馈',
    items: [
      ['Popup', '弹出层', 'popup'],
      ['Overlay', '遮罩层', 'overlay'],
      ['Dialog', '弹框', 'dialog'],
      ['ActionSheet', '动作面板', 'action-sheet'],
      ['DropMenu', '下拉菜单', 'drop-menu'],
      ['Popover', '气泡', 'popover'],
      ['Tooltip', '文字提示', 'tooltip'],
      ['FloatingPanel', '浮动面板', 'floating-panel'],
      ['Loading', '加载', 'loading'],
      ['Progress', '进度条', 'progress'],
      ['Circle', '环形进度条', 'circle'],
      ['Toast', '轻提示', 'toast'],
      ['Notify', '消息通知', 'notify'],
      ['NoticeBar', '通知栏', 'notice-bar'],
      ['SwipeAction', '滑动操作', 'swipe-action'],
      ['SortButton', '排序按钮', 'sort-button'],
      ['Empty', '缺省提示', 'empty'],
      ['CountDown', '倒计时', 'count-down'],
      ['CountTo', '数字滚动', 'count-to']
    ]
  },
  {
    title: '展示',
    items: [
      ['Avatar', '头像', 'avatar'],
      ['Badge', '徽标', 'badge'],
      ['Tag', '标签', 'tag'],
      ['Card', '卡片', 'card'],
      ['Divider', '分割线', 'divider'],
      ['Gap', '间隔槽', 'gap'],
      ['Grid', '宫格', 'grid'],
      ['Collapse', '折叠面板', 'collapse'],
      ['Steps', '步骤条', 'steps'],
      ['Sticky', '粘性布局', 'sticky'],
      ['Skeleton', '骨架屏', 'skeleton'],
      ['Loadmore', '加载更多', 'loadmore'],
      ['Img', '图片', 'img'],
      ['ImagePreview', '图片预览', 'image-preview'],
      ['VideoPreview', '视频预览', 'video-preview'],
      ['ImgCropper', '图片裁剪', 'img-cropper'],
      ['Swiper', '轮播图', 'swiper'],
      ['Table', '表格', 'table'],
      ['Watermark', '水印', 'watermark'],
      ['Curtain', '幕帘', 'curtain']
    ]
  },
  {
    title: '组合式API',
    items: [
      ['useUpload', '上传', 'use-upload'],
      ['useCountDown', '倒计时', 'use-count-down'],
      ['useToast', '轻提示', 'use-toast'],
      ['useMessage', '弹框', 'use-message'],
      ['useNotify', '消息通知', 'use-notify'],
      ['useConfigProvider', '全局配置', 'use-config-provider']
    ]
  }
] as const

export const componentGroups: ComponentGroup[] = rawGroups.map((group) => ({
  title: group.title,
  items: group.items.map(([name, title, path]) => ({
    name,
    title,
    path,
    group: group.title
  }))
}))

export const componentList = componentGroups.flatMap((group) => group.items)

export function findComponent(path?: string) {
  return componentList.find((item) => item.path === path)
}

export function getComponentCode(item: ComponentItem) {
  const codeMap: Record<string, string> = {
    button: `<wd-button>主要按钮</wd-button>
<wd-button type="success">成功按钮</wd-button>
<wd-button type="info">信息按钮</wd-button>
<wd-button type="warning">警告按钮</wd-button>
<wd-button type="danger">危险按钮</wd-button>

<wd-button disabled>禁用按钮</wd-button>
<wd-button loading>加载中</wd-button>

<wd-button variant="plain">镂空按钮</wd-button>
<wd-button variant="dashed">虚线按钮</wd-button>
<wd-button variant="soft">柔和按钮</wd-button>
<wd-button variant="text">文字按钮</wd-button>

<wd-button size="mini">迷你按钮</wd-button>
<wd-button size="small">小号按钮</wd-button>
<wd-button size="medium">中号按钮</wd-button>
<wd-button size="large">大号按钮</wd-button>

<wd-button variant="plain" hairline>细边框</wd-button>
<wd-button variant="plain" round>圆角按钮</wd-button>

<wd-button custom-class="button-shadow">主要按钮</wd-button>
<wd-button type="success" custom-class="button-shadow">成功按钮</wd-button>

<wd-button icon="edit-outline" />
<wd-button icon="download">下载</wd-button>
<wd-button icon="setting">设置</wd-button>

<wd-button block>块状按钮</wd-button>`,
    'index-bar': `<wd-index-bar>
  <wd-index-anchor index="A" />
  <wd-cell title="阿里云服务" />
  <wd-cell title="爱采购活动" />
  <wd-index-anchor index="B" />
  <wd-cell title="百度广告投放" />
</wd-index-bar>`,
    backtop: `<wd-backtop :scroll-top="scrollTop" />
<scroll-view :scroll-y="true" @scroll="handleScroll">
  <!-- 长内容列表 -->
</scroll-view>`,
    tour: `<wd-tour v-model="visible" :steps="steps" />
<wd-button @click="visible = true">开始引导</wd-button>`,
    tabs: `<wd-tabs v-model="activeTab">
  <wd-tab title="全部">全部内容</wd-tab>
  <wd-tab title="待处理">待处理内容</wd-tab>
  <wd-tab title="已完成">已完成内容</wd-tab>
</wd-tabs>`,
    form: `<wd-form ref="formRef" :model="form" :rules="rules" error-type="message" border>
  <wd-input v-model="form.name" label="客户姓名" prop="name" clearable />
  <wd-input v-model="form.phone" label="手机号" prop="phone" type="tel" maxlength="11" clearable />
  <wd-input v-model="form.password" label="密码" prop="password" type="password" clearable />
  <wd-textarea v-model="form.remark" label="补充说明" maxlength="80" show-word-limit />
</wd-form>`,
    input: `<wd-form ref="formRef" :model="form" :rules="rules" error-type="message" border>
  <wd-input
    v-model="form.name"
    label="客户姓名"
    prop="name"
    placeholder="支持 clearable / 校验 / 双向绑定"
    clearable
    @blur="formRef?.validate?.('name')"
  />
  <wd-input
    v-model="form.phone"
    label="手机号"
    prop="phone"
    type="tel"
    maxlength="11"
    clearable
    @blur="formRef?.validate?.('phone')"
  />
  <wd-input v-model="form.password" label="密码" type="password" clearable />
  <wd-input v-model="form.readonlyValue" label="只读态" readonly />
  <wd-input v-model="form.disabledValue" label="禁用态" disabled />
</wd-form>`,
    textarea: `<wd-textarea
  v-model="remark"
  label="备注信息"
  maxlength="80"
  show-word-limit
  placeholder="支持长文本、字数统计和双向绑定"
/>
<wd-textarea model-value="只读内容" label="只读示例" readonly />`,
    'password-input': `<wd-password-input v-model="code" :length="6" />
<wd-button size="small" plain @click="code = ''">清空</wd-button>
<wd-button size="small" type="primary" @click="code = '246810'">填充示例</wd-button>`,
    keyboard: `<wd-keyboard v-model="keyboardVisible" @input="handleInput" @delete="handleDelete" />
<text>当前值：{{ value }}</text>`,
    'input-number': `<wd-input-number
  v-model="count"
  :min="1"
  :max="99"
  :step="1"
/>
<text>当前数量：{{ count }}</text>`,
    search: `<wd-search v-model="keyword" placeholder="搜索组件、页面或客户" />
<wd-tag plain type="primary" @click="keyword = '客户中心'">客户中心</wd-tag>
<wd-tag plain type="primary" @click="keyword = '表单校验'">表单校验</wd-tag>`,
    popup: `<wd-popup v-model="visible" position="bottom" closable root-portal safe-area-inset-bottom>
  <view class="popup-body">这里放筛选条件或详情内容</view>
</wd-popup>`,
    'action-sheet': `<wd-action-sheet
  v-model="visible"
  :actions="[{ name: '简体中文' }, { name: 'English' }]"
  @select="handleSelect"
/>`,
    'drop-menu': `<wd-drop-menu>
  <wd-drop-menu-item v-model="channel" title="渠道" :options="channelOptions" root-portal />
  <wd-drop-menu-item v-model="sort" title="排序" :options="sortOptions" root-portal />
</wd-drop-menu>`,
    calendar: `<wd-calendar
  v-model="range"
  type="daterange"
  label="拜访日期"
  title="选择拜访日期"
  placeholder="请选择日期范围"
  clearable
  show-confirm
  root-portal
/>`,
    'datetime-picker': `<wd-datetime-picker
  v-model="visitTime"
  type="time"
  label="预约时间"
  title="选择时间"
  placeholder="请选择时间"
  clearable
  root-portal
/>`,
    'calendar-view': `<wd-calendar-view v-model="date" />
<text>当前选中：{{ date }}</text>`,
    'datetime-picker-view': `<wd-datetime-picker-view v-model="currentTime" type="time" />
<text>{{ currentTime }}</text>`,
    upload: `<wd-upload v-model="fileList" label="营业执照" />
<wd-upload v-model="imageList" label="门店照片" />`,
    signature: `<wd-signature v-model="signature" />
<wd-button size="small" plain @click="signature = ''">清空签名</wd-button>`,
    'slide-verify': `<wd-slide-verify @success="handleSuccess" />
<text>用于滑块验证和人机校验</text>`,
    empty: `<wd-empty description="暂无数据">
  <wd-button size="small" type="primary">刷新</wd-button>
</wd-empty>`,
    grid: `<wd-grid :column="4">
  <wd-grid-item icon="home" text="首页" />
  <wd-grid-item icon="user" text="客户" />
  <wd-grid-item icon="chart" text="报表" />
  <wd-grid-item icon="setting" text="设置" />
</wd-grid>`,
    collapse: `<wd-collapse v-model="activeNames">
  <wd-collapse-item title="基础信息" name="base">这里放订单详情或说明文档</wd-collapse-item>
</wd-collapse>`,
    steps: `<wd-steps :active="1" vertical>
  <wd-step title="提交申请" description="用户发起资料提交" />
  <wd-step title="负责人审批" description="审批人确认预算范围" />
  <wd-step title="配置发布" description="通过后同步到多端" />
</wd-steps>`,
    swiper: `<wd-swiper :list="bannerList" autoplay />
`,
    img: `<wd-img width="100%" height="180" src="https://example.com/banner.png" />`,
    'image-preview': `<wd-image-preview :urls="images" :model-value="visible" />
<wd-button size="small" @click="visible = true">预览大图</wd-button>`,
    'video-preview': `<wd-video-preview v-model="visible" url="https://example.com/demo.mp4" />`,
    'img-cropper': `<wd-img-cropper v-model="visible" :img-src="imageUrl" />
<wd-button size="small" @click="visible = true">开始裁剪</wd-button>`,
    transition: `<wd-transition :show="visible" name="fade">
  <view class="card">带过渡的内容</view>
</wd-transition>`,
    resize: `<wd-resize @change="handleResize">
  <view class="panel">监听容器尺寸变化</view>
</wd-resize>`,
    'config-provider': `<wd-config-provider :theme-vars="{ colorTheme: '#386eff' }">
  <wd-button>主题按钮</wd-button>
</wd-config-provider>`,
    'root-portal': `<wd-popup v-model="visible" root-portal position="bottom">
  <view class="popup-body">挂到根节点的浮层内容</view>
</wd-popup>`,
    icon: `<wd-icon name="home" size="20px" />
<wd-icon name="user" size="20px" />
<wd-icon name="setting" size="20px" />
<wd-icon name="success" size="20px" />`,
    text: `<text class="title">重点标题</text>
<text class="desc">适合承载信息层级、说明文本和摘要内容。</text>`,
    layout: `<view class="layout-grid">
  <view class="main">主内容区</view>
  <view class="aside">侧信息</view>
  <view class="actions">操作区</view>
</view>`,
    cell: `<wd-cell-group border>
  <wd-cell title="订单信息" value="查看详情" is-link />
  <wd-cell title="联系人" label="辅助说明" value="林知夏" />
</wd-cell-group>`,
    tabbar: `<wd-tabbar v-model="active">
  <wd-tabbar-item :name="0" title="首页" icon="home" />
  <wd-tabbar-item :name="1" title="组件" icon="app" />
  <wd-tabbar-item :name="2" title="我的" icon="user" />
</wd-tabbar>`,
    navbar: `<view class="nav-bar">
  <wd-icon name="arrow-left" />
  <text>订单详情</text>
  <wd-icon name="more" />
</view>`,
    checkbox: `<wd-checkbox-group v-model="checked">
  <wd-checkbox model-value="a">短信提醒</wd-checkbox>
  <wd-checkbox model-value="b">邮件同步</wd-checkbox>
</wd-checkbox-group>`,
    radio: `<wd-radio-group v-model="value">
  <wd-radio value="a">标准版</wd-radio>
  <wd-radio value="b">专业版</wd-radio>
</wd-radio-group>`,
    switch: `<wd-switch v-model="enabled" />`,
    rate: `<wd-rate v-model="score" />`,
    slider: `<wd-slider v-model="progress" />`,
    loading: `<wd-loading />
<wd-loading type="ring" />`,
    segmented: `<view class="segmented-demo">
  <view class="segmented-item segmented-item--active">总览</view>
  <view class="segmented-item">明细</view>
  <view class="segmented-item">趋势</view>
</view>`,
    sidebar: `<view class="sidebar-demo">
  <view class="sidebar-nav">客户概览</view>
  <view class="sidebar-panel">右侧内容区域</view>
</view>`,
    pagination: `<wd-button size="small" plain>上一页</wd-button>
<text>第 3 / 8 页</text>
<wd-button size="small" type="primary">下一页</wd-button>`,
    picker: `<wd-cell title="套餐版本" value="企业版" is-link clickable />
<wd-tag type="primary">企业版</wd-tag>`,
    'picker-view': `<view class="wheel-demo">
  <view class="wheel-item">2026年</view>
  <view class="wheel-item">07月</view>
  <view class="wheel-item">11日</view>
</view>`,
    'select-picker': `<wd-tag type="primary">短信提醒</wd-tag>
<wd-tag plain>邮件同步</wd-tag>
<wd-tag plain>系统通知</wd-tag>`,
    cascader: `<wd-tag type="primary" plain>华东</wd-tag>
<wd-tag type="primary" plain>上海</wd-tag>
<wd-tag type="primary" plain>浦东新区</wd-tag>`,
    avatar: `<wd-avatar>W</wd-avatar>
<wd-avatar shape="square">UI</wd-avatar>`,
    badge: `<wd-badge :model-value="8">
  <wd-button size="small">消息</wd-button>
</wd-badge>`,
    tag: `<wd-tag type="primary">标签</wd-tag>
<wd-tag type="success">成功</wd-tag>
<wd-tag type="warning">警告</wd-tag>`,
    card: `<wd-card title="经营周报">
  <view>适合放摘要信息、运营指标和内容模块。</view>
</wd-card>`,
    dialog: `uni.showModal({
  title: '确认操作',
  content: '这里演示 Dialog 常见的二次确认场景。',
  confirmText: '确认',
  cancelText: '取消'
})`,
    overlay: `<view class="overlay-demo">
  <view class="page-content">被遮罩的页面内容</view>
  <view class="overlay-mask">Overlay</view>
</view>`,
    popover: `<wd-button size="small" type="primary">触发目标</wd-button>
<view class="popover-bubble">更多操作气泡面板</view>`,
    tooltip: `<wd-button size="small" type="primary">触发目标</wd-button>
<view class="tooltip-bubble">轻量文字提示信息</view>`,
    'floating-panel': `<view class="floating-panel">
  <view class="handle" />
  <view>浮动面板内容</view>
</view>`,
    progress: `<wd-progress :percentage="68" />
<wd-button size="small" plain>-10</wd-button>
<wd-button size="small" type="primary">+10</wd-button>`,
    circle: `<view class="circle-demo">
  <text>68%</text>
</view>`,
    toast: `const toast = useToast()
toast.show('操作成功')`,
    notify: `const notify = useNotify()
notify.showNotify('消息通知')`,
    'notice-bar': `<wd-notice-bar text="Wot UI 详情页已补充更多真实预览效果。" />`,
    'swipe-action': `<view class="swipe-row">
  <view>订单 #20260711001</view>
  <view>标记 / 删除</view>
</view>`,
    'sort-button': `<view class="sort-chip sort-chip--active">默认排序</view>
<view class="sort-chip">最近更新</view>
<view class="sort-chip">优先级最高</view>`,
    'count-down': `<view class="timer-cell">01</view>
<view class="timer-cell">26</view>
<wd-button size="small" type="primary">开始</wd-button>`,
    'count-to': `<view class="metric-chip">1,286</view>
<view class="metric-chip">86%</view>
<view class="metric-chip">¥28k</view>`,
    divider: `<view class="divider-demo">
  <view class="line" />
  <text>分割线</text>
  <view class="line" />
</view>`,
    gap: `<view class="gap-demo">
  <view>区块 A</view>
  <view class="gap-spacer" />
  <view>区块 B</view>
</view>`,
    sticky: `<view class="sticky-header">吸顶筛选栏</view>
<view>向下滚动时头部会固定在顶部</view>`,
    skeleton: `<view class="skeleton-demo">
  <view class="avatar" />
  <view class="line" />
</view>`,
    loadmore: `<view class="loadmore-list">订单汇总 / 客户标签 / 经营日报</view>
<wd-button size="small" plain>加载更多</wd-button>`,
    fab: `<view class="fab-button">＋</view>
<wd-button size="small" plain>联系顾问</wd-button>`,
    table: `<view class="table-row table-head">
  <text>渠道</text><text>订单</text><text>转化率</text>
</view>
<view class="table-row">
  <text>小程序</text><text>126</text><text>18%</text>
</view>`,
    watermark: `<view class="watermark-box">
  <text class="watermark">CONFIDENTIAL</text>
  <view>受保护内容区域</view>
</view>`,
    curtain: `<wd-curtain v-model="visible" src="https://example.com/curtain.png">
  <view class="curtain-content">开屏活动内容</view>
</wd-curtain>
<wd-button size="small" plain @click="visible = true">重新打开</wd-button>`,
    'use-count-down': `const { start, pause, reset } = useCountDown({
  time: 60000
})
start()`,
    'use-toast': `const toast = useToast()
toast.show('操作成功')`,
    'use-message': `const message = useMessage()
message.confirm({ title: '确认提交吗？' })`,
    'use-notify': `const notify = useNotify()
notify.showNotify('消息通知')`,
    'use-upload': `const { startUpload, uploadList } = useUpload()
startUpload(files)
console.log(uploadList.value)`,
    'use-config-provider': `const config = useConfigProvider()
config.setConfig({
  themeVars: {
    colorTheme: '#386eff'
  }
})`
  }

  if (item.path.startsWith('use-')) {
    if (item.name === 'useToast') {
      return `const toast = useToast()
toast.show('操作成功')`
    }

    if (item.name === 'useMessage') {
      return `const message = useMessage()
message.confirm({ title: '确认提交吗？' })`
    }

    if (item.name === 'useNotify') {
      return `const notify = useNotify()
notify.showNotify('消息通知')`
    }

    if (codeMap[item.path]) {
      return codeMap[item.path]
    }

    return `const api = ${item.name}()
// 根据业务场景调用返回的方法`
  }

  if (codeMap[item.path]) {
    return codeMap[item.path]
  }

  return `<wd-${item.path}>${item.title}</wd-${item.path}>`
}

export function getComponentApi(item: ComponentItem): ApiRow[] {
  const composableApiMap: Record<string, ApiRow[]> = {
    'use-toast': [
      { name: 'useToast()', description: '创建轻提示实例。', type: 'Function', defaultValue: '-' },
      { name: 'show(options)', description: '显示轻提示内容。', type: 'Function', defaultValue: '-' },
      { name: 'close()', description: '关闭当前提示。', type: 'Function', defaultValue: '-' }
    ],
    'use-message': [
      { name: 'useMessage()', description: '创建弹框能力实例。', type: 'Function', defaultValue: '-' },
      { name: 'confirm(options)', description: '弹出确认框并返回结果。', type: 'Function', defaultValue: '-' },
      { name: 'alert(options)', description: '弹出提醒框。', type: 'Function', defaultValue: '-' }
    ],
    'use-notify': [
      { name: 'useNotify()', description: '创建顶部通知实例。', type: 'Function', defaultValue: '-' },
      { name: 'showNotify(options)', description: '显示通知内容。', type: 'Function', defaultValue: '-' },
      { name: 'closeNotify()', description: '关闭当前通知。', type: 'Function', defaultValue: '-' }
    ],
    'use-count-down': [
      { name: 'useCountDown(options)', description: '创建倒计时状态与控制器。', type: 'Function', defaultValue: '-' },
      { name: 'start / pause / reset', description: '开始、暂停和重置倒计时。', type: 'Function', defaultValue: '-' },
      { name: 'time', description: '剩余倒计时时间。', type: 'Ref<number>', defaultValue: '0' }
    ],
    'use-upload': [
      { name: 'useUpload()', description: '创建上传队列与上传控制方法。', type: 'Function', defaultValue: '-' },
      { name: 'startUpload(files)', description: '开始处理上传任务。', type: 'Function', defaultValue: '-' },
      { name: 'uploadList', description: '当前上传队列状态。', type: 'Ref<Array>', defaultValue: '[]' }
    ],
    'use-config-provider': [
      { name: 'useConfigProvider()', description: '创建全局配置控制器。', type: 'Function', defaultValue: '-' },
      { name: 'setConfig(options)', description: '动态设置主题变量和组件默认配置。', type: 'Function', defaultValue: '-' },
      { name: 'themeVars', description: '当前主题变量集合。', type: 'object', defaultValue: '{}' }
    ]
  }

  const componentApiMap: Record<string, ApiRow[]> = {
    button: [
      { name: 'type', description: '按钮主题类型。', type: `'primary' | 'success' | 'info' | 'warning' | 'danger'`, defaultValue: 'primary' },
      { name: 'variant', description: '按钮变体风格。', type: `'base' | 'plain' | 'dashed' | 'soft' | 'text'`, defaultValue: 'base' },
      { name: 'size', description: '按钮尺寸。', type: `'mini' | 'small' | 'medium' | 'large'`, defaultValue: 'medium' },
      { name: 'block / round / loading / disabled', description: '控制块状、圆角、加载和禁用状态。', type: 'boolean', defaultValue: 'false' },
      { name: 'click', description: '点击按钮时触发。', type: 'Event', defaultValue: '-' }
    ],
    tabs: [
      { name: 'v-model', description: '当前激活标签。', type: 'string | number', defaultValue: '-' },
      { name: 'title', description: '标签标题。', type: 'string', defaultValue: '-' },
      { name: 'change', description: '标签切换时触发。', type: 'Event', defaultValue: '-' }
    ],
    input: [
      { name: 'v-model', description: '输入框绑定值。', type: 'string', defaultValue: "''" },
      { name: 'label / placeholder', description: '标签与占位提示。', type: 'string', defaultValue: '-' },
      { name: 'clearable / readonly / disabled', description: '清空、只读和禁用状态。', type: 'boolean', defaultValue: 'false' },
      { name: 'prop', description: '配合表单校验时的字段名。', type: 'string', defaultValue: '-' },
      { name: 'blur / change', description: '失焦与内容变化时触发。', type: 'Event', defaultValue: '-' }
    ],
    form: [
      { name: 'model', description: '表单数据对象。', type: 'object', defaultValue: '{}' },
      { name: 'rules', description: '校验规则集合。', type: 'object', defaultValue: '{}' },
      { name: 'error-type', description: '校验错误展示方式。', type: 'string', defaultValue: 'message' },
      { name: 'validate / reset / clearValidate', description: '校验、重置和清空校验方法。', type: 'Function', defaultValue: '-' }
    ],
    popup: [
      { name: 'v-model', description: '控制弹层显示隐藏。', type: 'boolean', defaultValue: 'false' },
      { name: 'position', description: '弹层出现位置。', type: `'center' | 'bottom' | 'top' | 'left' | 'right'`, defaultValue: 'center' },
      { name: 'closable / root-portal', description: '显示关闭按钮及挂载到根节点。', type: 'boolean', defaultValue: 'false' },
      { name: 'open / close', description: '弹层打开和关闭时触发。', type: 'Event', defaultValue: '-' }
    ],
    dialog: [
      { name: 'title / content', description: '弹框标题与正文内容。', type: 'string', defaultValue: '-' },
      { name: 'confirmText / cancelText', description: '确认与取消按钮文本。', type: 'string', defaultValue: '-' },
      { name: 'success', description: '确认或取消后返回结果。', type: 'PromiseResult', defaultValue: '-' }
    ],
    calendar: [
      { name: 'v-model', description: '当前日期或日期范围。', type: 'string | string[]', defaultValue: '-' },
      { name: 'type', description: '日期选择模式。', type: `'date' | 'daterange'`, defaultValue: 'date' },
      { name: 'shortcuts', description: '快捷日期配置。', type: 'Array', defaultValue: '[]' },
      { name: 'confirm', description: '确认选择后触发。', type: 'Event', defaultValue: '-' }
    ],
    upload: [
      { name: 'v-model', description: '上传文件列表。', type: 'Array', defaultValue: '[]' },
      { name: 'accept / multiple', description: '文件类型与是否多选。', type: 'string | boolean', defaultValue: '-' },
      { name: 'success / fail / remove', description: '上传成功、失败和移除文件时触发。', type: 'Event', defaultValue: '-' }
    ],
    'notice-bar': [
      { name: 'text', description: '滚动公告文案。', type: 'string', defaultValue: '-' },
      { name: 'scrollable', description: '是否自动滚动。', type: 'boolean', defaultValue: 'true' },
      { name: 'prefix / color', description: '前缀图标和自定义颜色。', type: 'string', defaultValue: '-' }
    ],
    table: [
      { name: 'columns', description: '表格列配置。', type: 'Array', defaultValue: '[]' },
      { name: 'data', description: '表格数据源。', type: 'Array', defaultValue: '[]' },
      { name: 'row-click', description: '点击行数据时触发。', type: 'Event', defaultValue: '-' }
    ],
    'input-number': [
      { name: 'v-model', description: '当前数值。', type: 'number', defaultValue: '0' },
      { name: 'min / max / step', description: '最小值、最大值和步长配置。', type: 'number', defaultValue: '-' },
      { name: 'disabled / readonly', description: '禁用态与只读态。', type: 'boolean', defaultValue: 'false' },
      { name: 'change', description: '数值变化时触发。', type: 'Event', defaultValue: '-' }
    ],
    search: [
      { name: 'v-model', description: '搜索关键字。', type: 'string', defaultValue: "''" },
      { name: 'placeholder / maxlength', description: '搜索占位与最大长度。', type: 'string | number', defaultValue: '-' },
      { name: 'focus / blur / search', description: '聚焦、失焦和触发搜索时的回调。', type: 'Event', defaultValue: '-' }
    ],
    checkbox: [
      { name: 'v-model', description: '多选值集合。', type: 'Array<string | number>', defaultValue: '[]' },
      { name: 'shape / disabled', description: '多选形态与禁用状态。', type: 'string | boolean', defaultValue: '-' },
      { name: 'change', description: '多选结果变化时触发。', type: 'Event', defaultValue: '-' }
    ],
    radio: [
      { name: 'v-model', description: '当前选中值。', type: 'string | number', defaultValue: '-' },
      { name: 'shape / disabled', description: '单选形态与禁用状态。', type: 'string | boolean', defaultValue: '-' },
      { name: 'change', description: '选中项变化时触发。', type: 'Event', defaultValue: '-' }
    ],
    switch: [
      { name: 'v-model', description: '开关状态。', type: 'boolean', defaultValue: 'false' },
      { name: 'disabled / size', description: '禁用状态和尺寸配置。', type: 'boolean | string', defaultValue: '-' },
      { name: 'change', description: '状态切换时触发。', type: 'Event', defaultValue: '-' }
    ],
    rate: [
      { name: 'v-model', description: '当前评分值。', type: 'number', defaultValue: '0' },
      { name: 'count / size / color', description: '星级总数、尺寸和颜色。', type: 'number | string', defaultValue: '-' },
      { name: 'change', description: '评分变化时触发。', type: 'Event', defaultValue: '-' }
    ],
    slider: [
      { name: 'v-model', description: '当前滑块值。', type: 'number', defaultValue: '0' },
      { name: 'min / max / step', description: '最小值、最大值和步进值。', type: 'number', defaultValue: '-' },
      { name: 'change', description: '拖动结束或数值更新时触发。', type: 'Event', defaultValue: '-' }
    ],
    picker: [
      { name: 'v-model', description: '当前选择值。', type: 'string | number', defaultValue: '-' },
      { name: 'columns', description: '可选项数据。', type: 'Array', defaultValue: '[]' },
      { name: 'confirm / cancel', description: '确认与取消时触发。', type: 'Event', defaultValue: '-' }
    ],
    cascader: [
      { name: 'v-model', description: '当前级联路径值。', type: 'Array<string | number>', defaultValue: '[]' },
      { name: 'options', description: '级联选项数据源。', type: 'Array', defaultValue: '[]' },
      { name: 'change / finish', description: '路径变化和选择完成时触发。', type: 'Event', defaultValue: '-' }
    ],
    overlay: [
      { name: 'v-model', description: '控制遮罩显示隐藏。', type: 'boolean', defaultValue: 'false' },
      { name: 'z-index / duration', description: '层级和动画时长。', type: 'number', defaultValue: '-' },
      { name: 'click', description: '点击遮罩时触发。', type: 'Event', defaultValue: '-' }
    ],
    toast: [
      { name: 'icon / position / duration', description: '图标、位置和展示时长。', type: 'string | number', defaultValue: '-' },
      { name: 'message', description: '提示文案内容。', type: 'string', defaultValue: '-' },
      { name: 'close', description: '关闭提示时触发。', type: 'Event', defaultValue: '-' }
    ],
    notify: [
      { name: 'message', description: '通知文案内容。', type: 'string', defaultValue: '-' },
      { name: 'type / duration', description: '通知类型和持续时间。', type: 'string | number', defaultValue: '-' },
      { name: 'close', description: '关闭通知时触发。', type: 'Event', defaultValue: '-' }
    ],
    empty: [
      { name: 'description', description: '空状态描述文案。', type: 'string', defaultValue: '-' },
      { name: 'image / image-size', description: '插图资源和显示尺寸。', type: 'string | number', defaultValue: '-' },
      { name: 'slot', description: '支持自定义底部操作区。', type: 'Slot', defaultValue: '-' }
    ],
    swiper: [
      { name: 'list', description: '轮播图数据源。', type: 'Array', defaultValue: '[]' },
      { name: 'autoplay / interval', description: '自动轮播和轮播间隔。', type: 'boolean | number', defaultValue: '-' },
      { name: 'change', description: '切换轮播项时触发。', type: 'Event', defaultValue: '-' }
    ],
    fab: [
      { name: 'icon / direction', description: '主按钮图标和展开方向。', type: 'string', defaultValue: '-' },
      { name: 'active', description: '是否处于展开状态。', type: 'boolean', defaultValue: 'false' },
      { name: 'click', description: '点击主按钮或子操作时触发。', type: 'Event', defaultValue: '-' }
    ],
    transition: [
      { name: 'show', description: '控制过渡内容显示隐藏。', type: 'boolean', defaultValue: 'false' },
      { name: 'name / duration', description: '过渡名称和时长。', type: 'string | number', defaultValue: '-' },
      { name: 'before-enter / after-leave', description: '进入前和离开后钩子。', type: 'Event', defaultValue: '-' }
    ],
    'config-provider': [
      { name: 'theme-vars', description: '全局主题变量配置。', type: 'object', defaultValue: '{}' },
      { name: 'locale', description: '组件国际化语言配置。', type: 'object', defaultValue: '-' },
      { name: 'slot', description: '包裹业务组件并统一注入配置。', type: 'Slot', defaultValue: '-' }
    ]
  }

  if (item.path.startsWith('use-')) {
    if (composableApiMap[item.path]) {
      return composableApiMap[item.path]
    }

    return [
      { name: item.name, description: '创建并返回对应组件能力。', type: 'Function', defaultValue: '-' },
      { name: 'options', description: '调用参数，按具体 API 传入。', type: 'object | string', defaultValue: '-' },
      { name: 'return', description: '返回可调用方法或响应式状态。', type: 'object', defaultValue: '-' }
    ]
  }

  if (componentApiMap[item.path]) {
    return componentApiMap[item.path]
  }

  return [
    { name: 'v-model / modelValue', description: '组件绑定值。', type: 'string | number | boolean | array', defaultValue: '-' },
    { name: 'type', description: '组件类型或主题类型。', type: 'string', defaultValue: 'default' },
    { name: 'disabled', description: '是否禁用。', type: 'boolean', defaultValue: 'false' },
    { name: 'customClass', description: '自定义根节点类名。', type: 'string', defaultValue: '-' },
    { name: 'click / change', description: '点击或值变化时触发。', type: 'Event', defaultValue: '-' }
  ]
}

const componentSummaryMap: Record<string, string> = {
  button: '适合主要操作、次操作和危险操作的统一按钮入口。',
  icon: '适合页面点缀、功能入口和状态表达的轻量图标。',
  cell: '适合设置列表、资料详情和信息分组展示。',
  tabbar: '适合底部主导航、多频道切换和全局入口分发。',
  navbar: '适合顶部标题栏、返回操作和页面级工具入口。',
  tabs: '适合内容切换、频道切换和模块分栏。',
  segmented: '适合在同一区域中快速切换不同视图或状态。',
  sidebar: '适合分类侧栏、后台菜单和分区导航。',
  'index-bar': '适合通讯录、城市列表和按字母索引的长列表。',
  backtop: '适合长页面快速回顶和内容型页面的辅助操作。',
  tour: '适合新手引导、功能介绍和关键路径提示。',
  pagination: '适合长列表翻页、表格数据和内容分页浏览。',
  form: '适合统一承载校验、录入和复杂字段提交流程。',
  input: '适合账号录入、资料录入和搜索前置输入。',
  textarea: '适合备注说明、意见反馈和长文本录入。',
  'password-input': '适合验证码、支付密码和一次性安全码输入。',
  keyboard: '适合安全键盘、数字键盘和自定义输入面板。',
  'input-number': '适合数量调整、库存件数和预算数值录入。',
  search: '适合商品搜索、客户检索和关键字过滤。',
  checkbox: '适合多选偏好、标签筛选和协议确认。',
  radio: '适合单选方案、支付方式和状态切换。',
  switch: '适合开关类配置、消息提醒和功能启停。',
  rate: '适合服务评价、内容评分和满意度反馈。',
  slider: '适合区间选择、阈值调整和预算比例控制。',
  picker: '适合单列选项、类型切换和数据枚举。',
  'picker-view': '适合自定义选择器视图和多列滚轮联动。',
  'select-picker': '适合单复选筛选器和标签式选项集合。',
  cascader: '适合区域选择、类目选择和层级路径选择。',
  calendar: '适合日期范围预约、拜访排期和请假选择。',
  'calendar-view': '适合内嵌日历、计划看板和行程排布。',
  'datetime-picker': '适合时刻选择、预约时间和履约时间配置。',
  'datetime-picker-view': '适合内嵌时间视图和时间滚轮组合选择。',
  upload: '适合图片附件、资质材料和多文件提交流程。',
  signature: '适合电子签名、确认签署和触控手写场景。',
  'slide-verify': '适合滑块验证、风控校验和机器人拦截。',
  popup: '适合底部抽屉、中心弹层和局部交互承载。',
  overlay: '适合遮罩引导、背景变暗和模态交互衬底。',
  dialog: '适合删除确认、发布确认和关键操作二次提醒。',
  'action-sheet': '适合底部动作列表、语言切换和分享入口。',
  'drop-menu': '适合列表筛选、负责人切换和排序条件设置。',
  popover: '适合操作气泡、菜单提示和局部浮层说明。',
  tooltip: '适合文字提示、表单说明和轻量悬浮反馈。',
  'floating-panel': '适合底部浮动内容区和可拖拽面板展示。',
  loading: '适合请求等待、任务执行和状态占位反馈。',
  progress: '适合上传进度、流程进度和任务完成度展示。',
  circle: '适合环形进度、得分显示和达成率展示。',
  toast: '适合轻提示、成功反馈和非阻断消息反馈。',
  notify: '适合顶部消息通知、风险提醒和运营广播。',
  'notice-bar': '适合滚动公告、版本提醒和活动通知。',
  'swipe-action': '适合列表侧滑操作、快捷删除和批量处理。',
  'sort-button': '适合排序切换、升降序控制和筛选入口。',
  empty: '适合空列表、无搜索结果和首次进入引导。',
  'count-down': '适合抢购倒计时、活动剩余时间和时间提醒。',
  'count-to': '适合数字翻牌、经营统计和数据动效呈现。',
  avatar: '适合用户头像、成员信息和联系人列表。',
  badge: '适合未读数、状态角标和消息提醒。',
  tag: '适合状态标记、分类标签和筛选标识。',
  card: '适合摘要内容、运营面板和模块化信息块。',
  divider: '适合分区间隔、信息断点和内容分组。',
  gap: '适合区块留白、模块间距和内容节奏控制。',
  grid: '适合快捷入口、工作台宫格和服务导航。',
  collapse: '适合 FAQ、订单详情和模块折叠阅读。',
  steps: '适合流程节点、物流轨迹和引导步骤展示。',
  sticky: '适合吸顶标题、筛选栏和长页辅助导航。',
  skeleton: '适合首屏加载、列表占位和异步内容骨架。',
  loadmore: '适合列表分页、上拉加载和滚动追加场景。',
  img: '适合图片展示、商品主图和媒体封面呈现。',
  'image-preview': '适合大图浏览、相册预览和图片查看器。',
  'video-preview': '适合视频播放预览和媒体弹层浏览。',
  'img-cropper': '适合头像裁剪、封面裁切和图片编辑前处理。',
  swiper: '适合 banner 轮播、图集浏览和活动会场展示。',
  table: '适合报表表格、运营数据和对账信息展示。',
  watermark: '适合内容保护、信息标记和安全展示。',
  curtain: '适合开屏广告、会场首屏和活动承接展示。',
  fab: '适合悬浮主操作、快捷入口和高频动作集合。',
  transition: '适合动效切换、过渡展示和内容显隐编排。',
  resize: '适合监听尺寸变化、响应式布局和面板自适应。',
  'config-provider': '适合全局主题、国际化和统一配置注入。',
  'root-portal': '适合将浮层渲染到根节点并统一管理层级。',
  'use-toast': '适合在组合式逻辑里快速调用轻提示能力。',
  'use-upload': '适合在逻辑层处理上传流程、状态和结果回调。',
  'use-count-down': '适合在组合式逻辑中统一管理倒计时状态。',
  'use-message': '适合在逻辑层统一弹出确认与提示消息框。',
  'use-notify': '适合在逻辑层发出顶部通知与状态反馈。',
  'use-config-provider': '适合在逻辑层统一接入主题、语言和全局组件配置。'
}

const groupSceneMap: Record<string, string[]> = {
  基础: ['通用操作区', '资料展示区', '系统基础交互'],
  导航: ['频道切换', '内容分区', '页面导航'],
  录入: ['表单录入', '筛选条件', '业务提交流程'],
  反馈: ['状态反馈', '消息提示', '弹层交互'],
  展示: ['信息展示', '数据摘要', '列表内容呈现'],
  组合式API: ['逻辑层调用', '全局反馈', '跨页面消息触发']
}

const componentScenesMap: Record<string, string[]> = {
  button: ['表单提交按钮', '底部主操作栏', '弹窗确认动作'],
  navbar: ['详情页标题栏', '顶部返回栏', '页面工具入口'],
  tabs: ['订单状态切换', '频道分栏', '多视图切换'],
  segmented: ['轻量视图切换', '状态分段选择', '统计维度切换'],
  sidebar: ['榜单左侧导航', '后台功能分区', '分类菜单'],
  'index-bar': ['联系人索引', '城市选择', '品牌字母导航'],
  backtop: ['长列表回顶', '文章详情页', '运营会场'],
  tour: ['新手引导', '版本功能介绍', '重点区域提示'],
  input: ['登录注册表单', '客户资料录入', '筛选关键词输入'],
  'password-input': ['支付密码输入', '短信验证码输入', '一次性安全码'],
  keyboard: ['数字键盘', '安全键盘', '自定义按键区'],
  search: ['商品搜索框', '客户检索栏', '媒体资源搜索'],
  picker: ['单项枚举选择', '状态切换', '套餐选择'],
  'picker-view': ['滚轮时间视图', '内嵌多列选择', '日期列切换'],
  'select-picker': ['标签多选', '通知方式配置', '批量筛选'],
  cascader: ['地址级联', '类目级联', '组织路径选择'],
  popup: ['底部筛选抽屉', '中心确认层', '详情扩展浮层'],
  overlay: ['背景遮罩', '模态层衬底', '聚焦引导'],
  dialog: ['删除确认', '发布确认', '风险提醒'],
  'action-sheet': ['语言切换', '分享动作', '快捷操作集合'],
  'drop-menu': ['列表筛选', '状态过滤', '排序切换'],
  upload: ['营业执照上传', '工单附件提交', '图片资料补充'],
  signature: ['电子签名', '签收确认', '手写授权'],
  'slide-verify': ['人机验证', '安全校验', '防刷验证'],
  calendar: ['拜访日期选择', '请假日期选择', '活动日期范围'],
  'calendar-view': ['排班日历', '活动排期', '计划面板'],
  'datetime-picker': ['预约时段选择', '履约时间配置', '日程提醒'],
  'datetime-picker-view': ['时间滚轮选择', '内嵌时间卡片', '时刻面板'],
  progress: ['上传进度', '任务完成率', '流程推进'],
  circle: ['环形进度', '任务达成率', '目标完成情况'],
  'notice-bar': ['滚动公告', '运营通知', '系统升级提醒'],
  'swipe-action': ['列表快捷删除', '消息操作', '订单标记处理'],
  'sort-button': ['排序控制', '升降序切换', '结果重排'],
  empty: ['空列表占位', '无搜索结果', '首次进入引导'],
  'count-down': ['活动倒计时', '秒杀剩余时间', '支付剩余时间'],
  'count-to': ['数据翻牌', '经营指标增长', '结果动效数字'],
  grid: ['工作台入口', '服务宫格', '功能导航'],
  collapse: ['FAQ 折叠', '订单详情分组', '说明文档分段'],
  steps: ['物流轨迹', '流程指引', '阶段任务'],
  sticky: ['吸顶筛选栏', '标题固定区', '长页分区头'],
  skeleton: ['首屏骨架', '内容加载中', '详情页占位'],
  loadmore: ['分页加载', '滚动追加', '列表底部状态'],
  img: ['封面图片', '商品主图', '卡片插图'],
  'image-preview': ['图片大图查看', '相册浏览', '商品详情预览'],
  'video-preview': ['视频试看', '课程预览', '媒体弹层'],
  'img-cropper': ['头像裁剪', '海报裁切', '上传前编辑'],
  swiper: ['活动 banner', '商品主图', '运营会场轮播'],
  table: ['报表表格', '渠道对比', '费用明细'],
  watermark: ['保密内容展示', '截图防护', '信息标记'],
  curtain: ['开屏广告', '活动承接页', '首屏促销'],
  fab: ['悬浮新建', '快速联系', '高频动作入口'],
  'use-config-provider': ['全局主题切换', '组件默认配置', '应用级语言设置']
}

export function getComponentSummary(item: ComponentItem) {
  const summary = componentSummaryMap[item.path]
  if (summary) {
    return summary
  }

  return `${item.title}组件，适合 ${groupSceneMap[item.group]?.join('、') || '常规业务页面'} 场景。`
}

export function getComponentScenes(item: ComponentItem) {
  const scenes = componentScenesMap[item.path]
  if (scenes) {
    return scenes
  }

  return groupSceneMap[item.group] || ['常规业务页面', '组件中心示例', '移动端交互场景']
}

export function getComponentDocUrl(item: ComponentItem) {
  const docPathMap: Record<string, string> = {
    'use-upload': 'upload',
    'use-count-down': 'count-down',
    'use-toast': 'toast',
    'use-message': 'dialog',
    'use-notify': 'notify',
    'use-config-provider': 'config-provider'
  }

  const docPath = docPathMap[item.path] || item.path
  return `https://wot-ui.cn/component/${docPath}.html`
}

export function getComponentEvents(item: ComponentItem): EventRow[] {
  const eventMap: Record<string, EventRow[]> = {
    button: [
      { name: 'click', description: '点击按钮时触发。', payload: 'event' }
    ],
    icon: [
      { name: 'click', description: '点击图标时触发。', payload: 'event' }
    ],
    navbar: [
      { name: 'click-left', description: '点击左侧返回区域时触发。', payload: 'event' },
      { name: 'click-right', description: '点击右侧操作区域时触发。', payload: 'event' }
    ],
    tabbar: [
      { name: 'change', description: '底部标签切换时触发。', payload: 'name' }
    ],
    tabs: [
      { name: 'change', description: '切换标签时触发。', payload: '{ index, name }' }
    ],
    input: [
      { name: 'input', description: '输入内容变化时触发。', payload: 'string' },
      { name: 'blur', description: '输入框失焦时触发。', payload: 'event' },
      { name: 'focus', description: '输入框聚焦时触发。', payload: 'event' }
    ],
    form: [
      { name: 'submit', description: '表单提交时触发。', payload: 'model' },
      { name: 'validate', description: '执行校验后返回结果。', payload: '{ valid, errors }' }
    ],
    textarea: [
      { name: 'input', description: '文本域内容变化时触发。', payload: 'string' },
      { name: 'focus', description: '文本域聚焦时触发。', payload: 'event' },
      { name: 'blur', description: '文本域失焦时触发。', payload: 'event' }
    ],
    search: [
      { name: 'search', description: '点击搜索或回车时触发。', payload: 'string' },
      { name: 'clear', description: '点击清空按钮时触发。', payload: '-' }
    ],
    'password-input': [
      { name: 'change', description: '密码位变化时触发。', payload: 'string' },
      { name: 'complete', description: '密码输入完成时触发。', payload: 'string' }
    ],
    keyboard: [
      { name: 'input', description: '点击键盘按键输入时触发。', payload: 'string' },
      { name: 'delete', description: '点击删除键时触发。', payload: '-' },
      { name: 'close', description: '关闭键盘时触发。', payload: '-' }
    ],
    'input-number': [
      { name: 'change', description: '数值变化时触发。', payload: 'number' },
      { name: 'overlimit', description: '超过边界值时触发。', payload: '{ action, value }' }
    ],
    picker: [
      { name: 'confirm', description: '确认选择时触发。', payload: '{ value, selectedItems }' },
      { name: 'cancel', description: '取消选择时触发。', payload: '-' }
    ],
    'picker-view': [
      { name: 'change', description: '滚轮选项切换时触发。', payload: 'Array<number>' }
    ],
    'select-picker': [
      { name: 'confirm', description: '确认筛选时触发。', payload: 'Array<string | number>' },
      { name: 'change', description: '选项变化时触发。', payload: 'Array<string | number>' }
    ],
    cascader: [
      { name: 'change', description: '级联路径变化时触发。', payload: 'Array<string | number>' },
      { name: 'finish', description: '选择完成时触发。', payload: '{ value, selectedOptions }' }
    ],
    popup: [
      { name: 'open', description: '弹层打开时触发。', payload: '-' },
      { name: 'close', description: '弹层关闭时触发。', payload: '-' }
    ],
    overlay: [
      { name: 'click', description: '点击遮罩层时触发。', payload: 'event' }
    ],
    dialog: [
      { name: 'confirm', description: '点击确认时触发。', payload: 'event' },
      { name: 'cancel', description: '点击取消时触发。', payload: 'event' }
    ],
    calendar: [
      { name: 'confirm', description: '确认日期后触发。', payload: 'string | string[]' },
      { name: 'change', description: '日期变化时触发。', payload: 'string | string[]' }
    ],
    upload: [
      { name: 'success', description: '文件上传成功时触发。', payload: '{ file, response }' },
      { name: 'fail', description: '文件上传失败时触发。', payload: '{ file, error }' },
      { name: 'remove', description: '移除文件时触发。', payload: 'file' }
    ],
    signature: [
      { name: 'confirm', description: '确认签名时触发。', payload: 'string | tempFilePath' },
      { name: 'clear', description: '清空签名时触发。', payload: '-' }
    ],
    'slide-verify': [
      { name: 'success', description: '滑动验证通过时触发。', payload: '-' },
      { name: 'fail', description: '滑动验证失败时触发。', payload: '-' },
      { name: 'refresh', description: '重新生成校验轨道时触发。', payload: '-' }
    ],
    'action-sheet': [
      { name: 'select', description: '点击动作项时触发。', payload: '{ item, index }' },
      { name: 'close', description: '关闭面板时触发。', payload: '-' }
    ],
    'drop-menu': [
      { name: 'change', description: '筛选项变化时触发。', payload: 'value' }
    ],
    popover: [
      { name: 'open', description: '气泡层展示时触发。', payload: '-' },
      { name: 'close', description: '气泡层关闭时触发。', payload: '-' }
    ],
    tooltip: [
      { name: 'open', description: '提示展示时触发。', payload: '-' },
      { name: 'close', description: '提示关闭时触发。', payload: '-' }
    ],
    'floating-panel': [
      { name: 'height-change', description: '面板高度变化时触发。', payload: 'number' }
    ],
    loading: [
      { name: 'change', description: '加载状态切换时触发。', payload: 'type' }
    ],
    progress: [
      { name: 'change', description: '进度值变化时触发。', payload: 'number' }
    ],
    circle: [
      { name: 'change', description: '环形进度值变化时触发。', payload: 'number' }
    ],
    toast: [
      { name: 'show', description: '显示轻提示时触发。', payload: 'options | string' },
      { name: 'close', description: '关闭轻提示时触发。', payload: '-' }
    ],
    notify: [
      { name: 'show', description: '展示通知时触发。', payload: 'options | string' },
      { name: 'close', description: '关闭通知时触发。', payload: '-' }
    ],
    switch: [
      { name: 'change', description: '开关状态变化时触发。', payload: 'boolean' }
    ],
    rate: [
      { name: 'change', description: '评分值变化时触发。', payload: 'number' }
    ],
    slider: [
      { name: 'change', description: '滑块值变化时触发。', payload: 'number' }
    ],
    checkbox: [
      { name: 'change', description: '多选值变化时触发。', payload: 'string[]' }
    ],
    radio: [
      { name: 'change', description: '单选值变化时触发。', payload: 'string | number' }
    ],
    'notice-bar': [
      { name: 'click', description: '点击通知栏时触发。', payload: 'event' }
    ],
    'swipe-action': [
      { name: 'open', description: '展开侧滑操作区时触发。', payload: '-' },
      { name: 'close', description: '关闭侧滑操作区时触发。', payload: '-' }
    ],
    'sort-button': [
      { name: 'change', description: '排序方式变化时触发。', payload: 'string' }
    ],
    empty: [
      { name: 'click', description: '点击空状态附加操作时触发。', payload: 'event' }
    ],
    'count-down': [
      { name: 'change', description: '倒计时变化时触发。', payload: 'number' },
      { name: 'finish', description: '倒计时结束时触发。', payload: '-' }
    ],
    'count-to': [
      { name: 'finish', description: '数字滚动结束时触发。', payload: 'number' }
    ],
    avatar: [
      { name: 'click', description: '点击头像时触发。', payload: 'event' }
    ],
    badge: [
      { name: 'click', description: '点击徽标或挂载元素时触发。', payload: 'event' }
    ],
    tag: [
      { name: 'click', description: '点击标签时触发。', payload: 'event' }
    ],
    card: [
      { name: 'click', description: '点击卡片区域时触发。', payload: 'event' }
    ],
    grid: [
      { name: 'click', description: '点击宫格项时触发。', payload: '{ item, index }' }
    ],
    collapse: [
      { name: 'change', description: '折叠面板展开项变化时触发。', payload: 'Array<string | number>' }
    ],
    steps: [
      { name: 'change', description: '步骤切换时触发。', payload: 'number' }
    ],
    sticky: [
      { name: 'scroll', description: '滚动吸顶状态变化时触发。', payload: '{ isFixed, scrollTop }' }
    ],
    loadmore: [
      { name: 'click', description: '触发加载更多时触发。', payload: 'event' }
    ],
    'image-preview': [
      { name: 'change', description: '预览图片切换时触发。', payload: 'number' },
      { name: 'close', description: '关闭预览层时触发。', payload: '-' }
    ],
    'video-preview': [
      { name: 'play', description: '开始播放时触发。', payload: '-' },
      { name: 'pause', description: '暂停播放时触发。', payload: '-' }
    ],
    'img-cropper': [
      { name: 'confirm', description: '确认裁剪时触发。', payload: 'tempFilePath' },
      { name: 'cancel', description: '取消裁剪时触发。', payload: '-' }
    ],
    swiper: [
      { name: 'change', description: '轮播项切换时触发。', payload: 'number' },
      { name: 'click', description: '点击轮播项时触发。', payload: '{ item, index }' }
    ],
    table: [
      { name: 'row-click', description: '点击表格行时触发。', payload: 'rowData' }
    ],
    curtain: [
      { name: 'close', description: '关闭幕帘时触发。', payload: '-' },
      { name: 'click', description: '点击幕帘内容时触发。', payload: 'event' }
    ],
    fab: [
      { name: 'click', description: '点击悬浮主按钮或子操作时触发。', payload: 'event | action' }
    ],
    transition: [
      { name: 'before-enter', description: '进入动画开始前触发。', payload: '-' },
      { name: 'after-leave', description: '离开动画结束后触发。', payload: '-' }
    ],
    resize: [
      { name: 'change', description: '监听区域尺寸变化时触发。', payload: '{ width, height }' }
    ],
    'config-provider': [
      { name: 'change', description: '全局配置或主题变更时触发。', payload: 'config' }
    ],
    'root-portal': [
      { name: 'mounted', description: '内容挂载到根节点后触发。', payload: '-' }
    ],
    'use-toast': [
      { name: 'show', description: '显示轻提示。', payload: 'options | string' }
    ],
    'use-message': [
      { name: 'confirm', description: '显示确认弹框并返回结果。', payload: 'options' }
    ],
    'use-notify': [
      { name: 'showNotify', description: '显示顶部通知。', payload: 'options | string' }
    ],
    'use-upload': [
      { name: 'startUpload', description: '启动上传流程。', payload: 'files' }
    ],
    'use-count-down': [
      { name: 'start / pause / reset', description: '开始、暂停和重置倒计时。', payload: '-' }
    ],
    'use-config-provider': [
      { name: 'setConfig', description: '动态设置主题与全局配置。', payload: 'config' }
    ]
  }

  return eventMap[item.path] || [
    { name: 'click / change', description: '点击或值变化时触发。', payload: 'event | value' }
  ]
}

export function getComponentSlots(item: ComponentItem): SlotRow[] {
  const slotMap: Record<string, SlotRow[]> = {
    button: [
      { name: 'default', description: '按钮内容区域。' }
    ],
    cell: [
      { name: 'title', description: '自定义标题内容。' },
      { name: 'value', description: '自定义右侧内容。' }
    ],
    popup: [
      { name: 'default', description: '弹层主体内容。' }
    ],
    tabs: [
      { name: 'default', description: '标签页内容区域。' },
      { name: 'title', description: '自定义标签标题内容。' }
    ],
    form: [
      { name: 'default', description: '表单字段项内容。' }
    ],
    input: [
      { name: 'prefix', description: '输入框前置内容。' },
      { name: 'suffix', description: '输入框后置内容。' }
    ],
    textarea: [
      { name: 'suffix', description: '文本域底部附加说明或操作。' }
    ],
    search: [
      { name: 'prefix', description: '搜索框前置图标或标签。' },
      { name: 'suffix', description: '搜索框右侧附加操作。' }
    ],
    checkbox: [
      { name: 'default', description: '复选项内容区域。' }
    ],
    radio: [
      { name: 'default', description: '单选项内容区域。' }
    ],
    calendar: [
      { name: 'default', description: '日历弹层主体内容。' },
      { name: 'footer', description: '底部确认区。' }
    ],
    'action-sheet': [
      { name: 'default', description: '自定义动作面板主体内容。' },
      { name: 'action', description: '自定义动作项内容。' }
    ],
    'drop-menu': [
      { name: 'title', description: '自定义菜单标题。' },
      { name: 'default', description: '自定义筛选面板内容。' }
    ],
    popover: [
      { name: 'reference', description: '触发气泡的参考节点。' },
      { name: 'default', description: '气泡内容区域。' }
    ],
    tooltip: [
      { name: 'reference', description: '触发提示的参考节点。' },
      { name: 'default', description: '提示内容区域。' }
    ],
    'notice-bar': [
      { name: 'prefix', description: '通知栏左侧图标或标记。' },
      { name: 'suffix', description: '通知栏右侧操作区。' }
    ],
    'swipe-action': [
      { name: 'default', description: '列表主体内容。' },
      { name: 'right', description: '右侧操作按钮区域。' }
    ],
    card: [
      { name: 'title', description: '自定义卡片标题。' },
      { name: 'default', description: '卡片主体内容。' }
    ],
    badge: [
      { name: 'default', description: '徽标挂载的目标内容。' },
      { name: 'content', description: '自定义徽标内容。' }
    ],
    dialog: [
      { name: 'default', description: '自定义弹框正文。' },
      { name: 'footer', description: '自定义底部按钮区域。' }
    ],
    empty: [
      { name: 'default', description: '自定义空状态附加内容。' },
      { name: 'image', description: '自定义空状态插图。' }
    ],
    collapse: [
      { name: 'title', description: '折叠面板标题内容。' },
      { name: 'default', description: '折叠面板主体内容。' }
    ],
    steps: [
      { name: 'title', description: '步骤标题内容。' },
      { name: 'description', description: '步骤描述内容。' }
    ],
    grid: [
      { name: 'icon', description: '宫格项图标内容。' },
      { name: 'text', description: '宫格项文字内容。' }
    ],
    swiper: [
      { name: 'default', description: '自定义轮播项内容。' },
      { name: 'indicator', description: '自定义指示器内容。' }
    ],
    upload: [
      { name: 'default', description: '自定义上传触发区域。' },
      { name: 'preview', description: '自定义文件预览内容。' }
    ]
  }

  return slotMap[item.path] || [
    { name: 'default', description: '组件默认内容区域。' }
  ]
}
