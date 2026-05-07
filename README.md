# uniapp-template-ts-vue3

通用 uni-app 应用模板，面向 H5、微信小程序、支付宝小程序、抖音小程序、App 和鸿蒙 App。

[English](./README.en.md)

## 特性

- uni-app + Vite 6 + Vue 3.5.x + TypeScript
- Wot Design Uni 组件体系，已配置 easycom 和组合式 API 自动导入
- UnoCSS 原子化样式，统一主题变量和跨端基础样式
- Pinia 状态管理，内置 `store/hooks/utils/pages/styles/static` 等常用目录
- 内置工具方法和业务 hooks：`format.ts`、`validate.ts`、`cache.ts`、`requests.ts`、页码分页、步长分页、返回上一页不刷新
- 自定义底部 Tabbar，5 个主页面：首页、我的、组件、示例、其他
- 组件中心按 Wot Design Uni 分类展示，支持点击进入组件示例详情
- 示例中心按复杂度拆分：基础、初级、中级、高级、复杂
- 基础示例覆盖动态表单验证、输入联动、Toast、Popup、Calendar、DatetimePicker、DropMenu、NoticeBar、Dialog
- 新增可切换动态表单、音乐播放器、歌单列表、影视检索、应用更新和文件夹树形结构示例，动态表单支持下拉/单选/明细行，应用更新按 App、小程序、H5、鸿蒙四端展示
- 瀑布流示例覆盖生活、电商、新闻、朋友圈四种导航形态，并带详情承接
- 订阅支付示例覆盖会员套餐、月/年切换、微信支付、支付宝和银行卡支付方式
- 业务互动示例覆盖字母索引联系人、系统消息、一级/二级评论回复和移动端回复弹层
- 首页新增工具方法展示区，展示 dayjs 时间格式化、数字转中文、特殊字符长度、手机号/银行卡脱敏、文件大小、百分比、Query、校验、缓存和分页 hooks
- 内置登录/注册模板，各 5 套可切换方案
- 增加插件体系、样式规范、多语言和 HBX 模板说明页面

## 目录结构

```text
src
├── components        # 通用组件，例如 PageShell、自定义 Tabbar
├── hooks             # 组合式业务 Hook
├── locales           # 多语言文案
├── pages             # 页面与业务示例
├── plugins           # 应用插件安装入口
├── static            # 静态资源
├── store             # Pinia 状态
├── styles            # 全局样式
├── types             # 类型声明与自动导入声明
└── utils             # 工具函数、路由与组件数据
```

## 环境变量

模板提供了三套环境文件：

- `.env.development`
- `.env.test`
- `.env.production`

本地私有配置请使用 `.env.local` 或 `.env.*.local`，这些文件已被 `.gitignore` 排除。

## 安装

```bash
pnpm install
```

## 开发

```bash
pnpm dev:h5
pnpm dev:mp-weixin
pnpm dev:mp-alipay
pnpm dev:mp-toutiao
pnpm dev:app
pnpm dev:app-harmony
```

## 构建

```bash
pnpm build:h5
pnpm build:github
pnpm build:mp-weixin
pnpm build:mp-alipay
pnpm build:mp-toutiao
pnpm build:app
pnpm build:app-harmony
```

`pnpm build:github` 会使用 `.env.github` 中的 `VITE_PUBLIC_PATH=/uniapp-template-ts-vue3-blog/`，用于部署到 GitHub Pages 仓库子路径。

线上预览：[https://mhxy13867806343.github.io/uniapp-template-ts-vue3-blog/](https://mhxy13867806343.github.io/uniapp-template-ts-vue3-blog/)

## 校验

```bash
pnpm typecheck
```

## 自动导入

`vite.config.ts` 已配置 `unplugin-auto-import`，默认自动导入：

- Vue API：`ref`、`reactive`、`computed`、`watch` 等
- Pinia：`defineStore`、`storeToRefs`
- uni-app 生命周期：`onLoad`、`onShow`、`onReady` 等
- Wot Design Uni API：`useToast`、`useMessage`、`useNotify` 等

自动导入类型会输出到 `src/types/auto-imports.d.ts`。

## 许可证

[MIT](./LICENSE)
