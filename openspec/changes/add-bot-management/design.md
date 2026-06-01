## Context

管理控制台（`imserver-console-web`）在 `src/views/argument/` 下已有 `userlist.vue`（用户管理）与 `grouplist.vue`（群组管理），均通过 service 层调用 `/admingateway/apps/...` 接口，采用 cursor 分页（`offset` + `count`）模式。

后端 `imserver-console` 已在 `routers/router.go` 注册机器人接口：

| 方法 | 路径 | Handler |
|------|------|---------|
| GET | `/apps/bots/list` | `QryBots` |
| POST | `/apps/bots/add` | `AddBot` |
| POST | `/apps/bots/update` | `UpdateBot` |

数据模型（`apis/models/bot.go`）：

- **Bot**: `bot_id`, `nickname`, `avatar`, `pinyin`, `user_type`, `bot_conf`, `bot_settings`, `created_time`
- **BotConf**: `bot_id`, `url`, `api_key`, `is_stream`
- **BotSettings**: `only_mentioned`
- **BotReq**（add/update）: `app_key`, `bot_id`, `nickname`, `avatar`, `pinyin`, `bot_conf`, `bot_settings`

列表查询参数：`app_key`（必填）, `user_id`, `name`, `offset`, `count`, `order`（正序时 > 0）。

## Goals / Non-Goals

**Goals:**

- 在用户管理菜单分组下新增「机器人管理」页面，交互与列表风格对齐用户管理
- 实现列表查询、创建、编辑三种操作的前端闭环
- 遵循现有项目约定：Vue 3 Composition API、`PageSection`、`services/` 分层、i18n 双语

**Non-Goals:**

- 机器人删除、封禁（后端未提供接口）
- 修改后端 API 或数据模型
- 机器人消息调试、Webhook 测试等扩展能力

## Decisions

### 1. 页面位置与路由命名

- **决策**: 路由 `/argument_botlist/:app_key`，组件名 `ArguBotList`，文件 `src/views/argument/botlist.vue`
- **理由**: 与 `argument_userlist`、`argument_grouplist` 命名一致
- **备选**: 放在「应用管理」分组 — 机器人属于用户体系，与用户/群组同级更合理

### 2. Service 层结构

- **决策**: 新建 `src/services/bot-manager.js`，在 `api.js` 增加 `BOT_MANAGER_LIST/ADD/UPDATE` 常量
- **理由**: 与 `user-manager.js`、`group-manager.js` 模式一致
- **方法**:
  - `getList({ app_key, user_id, keywords, offset, limit })` → GET list
  - `add(data)` → POST add（`nickname` 必填）
  - `update(data)` → POST update（`bot_id` 必填）

### 3. 创建/编辑 UI

- **决策**: 新建 `src/components/dialog-bot.vue`，复用现有 Dialog 组件模式（参考 `dialog-workapp-update.vue`）
- **理由**: 表单字段较多（基础信息 + bot_conf + bot_settings），弹窗比内联编辑更清晰
- **表单字段**:
  - 创建：nickname（必填）、avatar、pinyin、bot_conf（url、api_key、is_stream）、bot_settings（only_mentioned）
  - 编辑：bot_id（只读）、同上可编辑字段

### 4. 列表页功能范围

- **决策**: 列表展示 nickname/avatar、bot_id、created_time、bot_conf.url、only_mentioned；搜索 bot_id + nickname；分页加载
- **理由**: 对齐用户管理列表模式，展示运营最关心的标识与配置摘要
- **操作列**: 「编辑」按钮打开 dialog；「创建机器人」按钮在 header 区域

### 5. i18n 组织

- **决策**: `menu.json` 增加 `menu.user.bots`；新建 `botList.json`（zh-CN / en-US）存放页面文案
- **理由**: 与 `groupList` 在 `appServices.json` 的模式类似，机器人文案独立文件便于维护

## Risks / Trade-offs

- **[Risk] ApiKey 敏感信息在列表明文展示** → 列表仅显示 URL 与是否流式，ApiKey 仅在编辑弹窗中展示/修改
- **[Risk] 创建时 bot_id 由后端/SDK 生成** → 前端创建表单不填 bot_id，成功后刷新列表；编辑时使用返回的 bot_id
- **[Risk] 分页 offset 与用户列表实现细节不一致** → 严格复用 `userlist.vue` 的 search/onNext 逻辑

## Migration Plan

纯前端增量变更，无数据迁移。部署步骤：

1. 合并代码并构建前端静态资源
2. 确保后端 `imserver-console` 已包含 Bot 路由
3. 无需配置变更（API 前缀仍为 `/admingateway/`）

回滚：移除路由与菜单项即可，不影响已有功能。

## Open Questions

- 创建机器人时 `bot_id` 是否允许前端指定？当前后端 `AddBot` 仅校验 `app_key` 与 `nickname`，`bot_id` 可选 — 首版不提供前端输入，由后端生成。
