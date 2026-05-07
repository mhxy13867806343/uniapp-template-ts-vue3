# uniapp-template-ts-vue3

A reusable uni-app application template for H5, WeChat Mini Program, Alipay Mini Program, Douyin Mini Program, App and Harmony App targets.

[中文文档](./README.md)

## Features

- uni-app + Vite 6 + Vue 3.5.x + TypeScript
- Wot Design Uni with easycom and composable API auto imports
- UnoCSS with shared theme variables and cross-platform base styles
- Pinia store setup and common folders such as `store`, `hooks`, `utils`, `pages`, `styles` and `static`
- Built-in utility methods and business hooks: `format.ts`, `validate.ts`, `cache.ts`, `requests.ts`, page pagination, step pagination and back navigation without refresh
- Custom bottom tabbar with five primary pages: Home, Mine, Components, Examples and Other
- Component center grouped by Wot Design Uni categories, with clickable detail examples
- Example center split by complexity: basic, junior, intermediate, advanced and complex
- Basic example includes dynamic form validation, input linkage, Toast, Popup, Calendar, DatetimePicker, DropMenu, NoticeBar and Dialog
- Added switchable dynamic form, music player, playlist list, media search, app update and folder tree examples; the dynamic form supports pickers/radios/detail rows and the app update example covers App, Mini Program, H5 and Harmony targets
- Waterfall example with four feed styles: life, ecommerce, news and moments, with detail pages
- Subscription payment example with membership plans, monthly/yearly billing, WeChat Pay, Alipay and bank card methods
- Business interaction examples for indexed contacts, system messages, first-level/nested comment replies and mobile reply popups
- Home dashboard now includes a utility methods section for dayjs date formatting, number-to-Chinese conversion, special character length, phone/bank-card masking, file size, percentage, query strings, validation, cache and pagination hooks
- Built-in login and registration templates, each with five switchable layouts
- Added pages for plugin setup, style guidelines, i18n and HBX template usage

## Structure

```text
src
├── components        # Shared components, such as PageShell and custom Tabbar
├── hooks             # Composable business hooks
├── locales           # Locale messages
├── pages             # Pages and business examples
├── plugins           # App plugin setup entry
├── static            # Static assets
├── store             # Pinia stores
├── styles            # Global styles
├── types             # Type declarations and auto-import declarations
└── utils             # Utilities, route data and component metadata
```

## Environment Files

The template ships with three environment files:

- `.env.development`
- `.env.test`
- `.env.production`

Use `.env.local` or `.env.*.local` for private local settings. These files are ignored by Git.

## Install

```bash
pnpm install
```

## Development

```bash
pnpm dev:h5
pnpm dev:mp-weixin
pnpm dev:mp-alipay
pnpm dev:mp-toutiao
pnpm dev:app
pnpm dev:app-harmony
```

## Build

```bash
pnpm build:h5
pnpm build:github
pnpm build:mp-weixin
pnpm build:mp-alipay
pnpm build:mp-toutiao
pnpm build:app
pnpm build:app-harmony
```

`pnpm build:github` uses `VITE_PUBLIC_PATH=/uniapp-template-ts-vue3/` from `.env.github` for deployment under the GitHub Pages repository subpath.

## Check

```bash
pnpm typecheck
```

## Auto Imports

`vite.config.ts` configures `unplugin-auto-import` for:

- Vue APIs such as `ref`, `reactive`, `computed` and `watch`
- Pinia APIs such as `defineStore` and `storeToRefs`
- uni-app lifecycle APIs such as `onLoad`, `onShow` and `onReady`
- Wot Design Uni APIs such as `useToast`, `useMessage` and `useNotify`

Generated type declarations are written to `src/types/auto-imports.d.ts`.

## License

[MIT](./LICENSE)
