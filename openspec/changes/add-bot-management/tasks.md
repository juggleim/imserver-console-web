## 1. API 与服务层

- [x] 1.1 在 `src/services/api.js` 添加 `BOT_MANAGER_LIST`、`BOT_MANAGER_ADD`、`BOT_MANAGER_UPDATE` 路径常量
- [x] 1.2 新建 `src/services/bot-manager.js`，实现 `getList`、`add`、`update` 方法
- [x] 1.3 在 `src/services/index.js` 导出 `BotManager`

## 2. 路由与菜单

- [x] 2.1 在 `src/router/index.js` 注册 `/argument_botlist/:app_key` 路由（`ArguBotList`）
- [x] 2.2 在 `src/views/layout/menus.js` 用户管理分组下添加「机器人管理」菜单项

## 3. 国际化

- [x] 3.1 在 `src/locales/zh-CN/menu.json` 和 `en-US/menu.json` 添加 `menu.user.bots`
- [x] 3.2 新建 `src/locales/zh-CN/botList.json` 和 `en-US/botList.json`（列表、表单、反馈文案）
- [x] 3.3 在 i18n 入口注册 `botList` 命名空间

## 4. 组件与页面

- [x] 4.1 新建 `src/components/dialog-bot.vue`：创建/编辑机器人表单（nickname、avatar、pinyin、bot_conf、bot_settings）
- [x] 4.2 新建 `src/views/argument/botlist.vue`：参考 `userlist.vue` 实现搜索、列表、分页、创建/编辑操作

## 5. 验证

- [x] 5.1 本地启动后确认侧边栏可进入机器人管理页
- [x] 5.2 验证列表查询、创建、编辑接口调用与 UI 反馈正常
