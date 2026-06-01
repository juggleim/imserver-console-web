## Why

IM 管理控制台已支持用户管理与群组管理，但后端已提供机器人（Bot）的查询、创建与更新接口，前端缺少对应的管理入口。运营人员无法在控制台内查看、创建和配置应用下的机器人，需要补齐该能力以完成用户/群组/机器人统一的应用侧用户体系管理。

## What Changes

- 在「用户管理」菜单分组下，与「用户管理」「群组管理」同级新增「机器人管理」页面
- 新增机器人列表页：支持按 `bot_id`、`nickname` 搜索，分页加载（cursor offset）
- 新增创建机器人能力：填写昵称及 Bot 配置（URL、ApiKey、流式、仅 @ 回复等）
- 新增编辑机器人能力：更新昵称、头像、拼音及 Bot 配置
- 新增前端 service 层对接后端 `/apps/bots/list`、`/apps/bots/add`、`/apps/bots/update` 接口
- 新增路由、侧边栏菜单项及中英文 i18n 文案

## Capabilities

### New Capabilities

- `bot-management`: 应用内机器人的列表查询、创建与编辑，包括 UI 页面、API 封装、路由与菜单集成

### Modified Capabilities

（无 — 项目尚无既有 OpenSpec 能力定义需变更）

## Impact

- **路由**: `src/router/index.js` — 新增 `/argument_botlist/:app_key`
- **菜单**: `src/views/layout/menus.js` — 用户管理分组下新增菜单项
- **视图**: `src/views/argument/botlist.vue`（新建，参考 `userlist.vue`）
- **组件**: 可选新建 `dialog-bot.vue` 用于创建/编辑表单
- **服务**: `src/services/api.js`、`src/services/bot-manager.js`（新建）、`src/services/index.js`
- **i18n**: `src/locales/zh-CN/`、`src/locales/en-US/` — menu 与 botList 文案
- **后端依赖**: `imserver-console` 已有 Bot API，无需后端改动
