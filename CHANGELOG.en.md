# Changelog

## 0.1.0

- Initialized the uni-app + Vue 3.5.x + TypeScript + Vite 6 template.
- Added Wot Design Uni, UnoCSS, Pinia and API auto imports.
- Added development and build scripts for H5, WeChat Mini Program, Alipay Mini Program, Douyin Mini Program, App and Harmony App.
- Added five primary pages and a custom bottom tabbar: Home, Mine, Components, Examples and Other.
- Added a Wot Design Uni component center grouped by official categories, with clickable detail examples.
- Added a business example center covering basic, junior, intermediate, advanced and complex scenarios.
- Added dynamic form validation, input linkage, Toast, Popup, Calendar, DatetimePicker, DropMenu, NoticeBar and Dialog to the basic example.
- Added five switchable login templates: password, SMS code, enterprise tenant, admin security and quick authorization login.
- Added five switchable registration templates: phone, invite code, company onboarding, creator onboarding and App quick registration.
- Added pages for plugin setup, style guidelines, i18n and HBX template usage.
- Added a waterfall feed example and detail page with life, ecommerce, news and moments styles, including ecommerce product details.
- Added a subscription payment template with plan selection, monthly/yearly billing, WeChat Pay, Alipay and bank card methods.
- Added indexed contacts, system messages and comment interaction examples.
- Enhanced the comment example with first-level comments, nested replies, replying to nested comments, review handling, and fixed the mobile reply popup overlap with the bottom tabbar.
- Added switchable dynamic form, music player, playlist list, media search, app update and folder tree examples; media search supports swipeable channels, more categories, search history and hot searches, and the dynamic form was enhanced with pickers, radios, textarea notes and editable detail rows.
- Extended `src/utils/format.ts` with dayjs date formatting, date ranges, weekday text, countdowns, currency formatting, number-to-Chinese conversion, special character length, visual-length truncation, phone/ID/bank-card masking, file size, percentage, compact numbers, signed numbers, boolean labels, list text, address joining, query stringify/parse, relative time and duration formatting.
- Added `src/utils/validate.ts` for required checks, regex checks, length checks, phone, email, URL, Chinese names, ID-card checksum, bank-card Luhn, plate numbers, strong passwords and composed validation.
- Extended `src/utils/cache.ts`, a uni storage wrapper with namespace support, TTL expiration, payload reads, remaining TTL, update merging, sync/async reads and writes, getOrSet, expired-cache cleanup and namespace clearing.
- Added `src/hooks/requests.ts`, `src/hooks/pagination.ts` and `src/hooks/useBackRefresh.ts` for request wrappers, page pagination, step pagination and back navigation without refresh.
- Added a utility methods section below Today Tasks on the home dashboard with live formatter output, cache status and hook parameter examples.
- Added Chinese README, English README, License and Git ignore rules.
