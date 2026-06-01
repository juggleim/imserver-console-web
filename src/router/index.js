import { createRouter, createWebHistory } from 'vue-router'
import { Layout } from '@/views/layout';
import { STORAGE } from "../common/enum";
import Storage from "../common/storage";
import utils from '../common/utils';

let routes = [{
  path: '/',
  name: 'Root',
  component: Layout,
  children: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component:  () => import('@/views/dashboard.vue'),
      meta: {}
    },
    {
      path: '/app_manager',
      name: 'AppManader',
      component:  () => import('@/views/app/manager.vue'),
      meta: {
        titles: ['应用管理', '应用列表'],
        showHeaderApps: true
      }
    },
    {
      path: '/app_import',
      name: 'AppImport',
      component:  () => import('@/views/app/import.vue'),
      meta: {
        titles: ['应用管理', '应用导入'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_base/:app_key',
      name: 'ArguBase',
      component:  () => import('@/views/argument/base.vue'),
      meta: {
        titles: ['应用管理', '基本信息'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_switch/:app_key',
      name: 'ArguSwitch',
      component:  () => import('@/views/argument/switch.vue'),
      meta: {
        titles: ['应用管理', '服务开关'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_webhook/:app_key',
      name: 'ArguCallback',
      component:  () => import('@/views/argument/webhook.vue'),
      meta: {
        titles: ['应用管理', '回调设置'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_message_intercept/:app_key',
      name: 'ArguMessageIntercept',
      component:  () => import('@/views/argument/message_intercept.vue'),
      meta: {
        titles: ['应用管理', '消息拦截'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_push/:app_key',
      name: 'ArguPush',
      component:  () => import('@/views/argument/push.vue'),
      meta: {
        titles: ['应用管理', '推送配置'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_storage/:app_key',
      name: 'ArguStorage',
      component:  () => import('@/views/argument/storage.vue'),
      meta: {
        titles: ['应用管理', '存储配置'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_translate/:app_key',
      name: 'ArguTranslte',
      component:  () => import('@/views/argument/translate.vue'),
      meta: {
        titles: ['应用管理', '翻译配置'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_worklist/:app_key',
      name: 'ArguWorkList',
      component:  () => import('@/views/argument/worklist.vue'),
      meta: {
        titles: ['应用管理', '工作台'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_grouplist/:app_key',
      name: 'ArguGroupList',
      component:  () => import('@/views/argument/grouplist.vue'),
      meta: {
        titles: ['应用管理', '群组管理'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_userlist/:app_key',
      name: 'ArguUserList',
      component:  () => import('@/views/argument/userlist.vue'),
      meta: {
        titles: ['应用管理', '用户管理'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_botlist/:app_key',
      name: 'ArguBotList',
      component:  () => import('@/views/argument/botlist.vue'),
      meta: {
        titles: ['应用管理', '机器人管理'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_conversationlist/:app_key',
      name: 'ArguConversationList',
      component:  () => import('@/views/argument/conversationlist.vue'),
      meta: {
        titles: ['消息管理', '会话列表'],
        showHeaderApps: true
      }
    },
    // {
    //   path: '/argument_audit/:app_key',
    //   name: 'ArguAudit',
    //   component:  () => import('@/views/argument/audit.vue'),
    //   meta: {
    //     titles: ['应用管理', '内容审核'],
    //     showHeaderApps: true
    //   }
    // },
    {
      path: '/argument_rtc/:app_key',
      name: 'ArguRTC',
      component:  () => import('@/views/argument/rtc.vue'),
      meta: {
        titles: ['应用管理', '实时音视频'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_email/:app_key',
      name: 'ArguEmail',
      component:  () => import('@/views/argument/email.vue'),
      meta: {
        titles: ['应用管理', '邮箱配置'],
        showHeaderApps: true
      }
    },
    {
      path: '/argument_sms/:app_key',
      name: 'ArguSms',
      component:  () => import('@/views/argument/sms.vue'),
      meta: {
        titles: ['应用管理', '短信配置'],
        showHeaderApps: true
      }
    },
    // {
    //   path: '/argument_ai/:app_key',
    //   name: 'ArguAI',
    //   component:  () => import('@/views/argument/ai.vue'),
    //   meta: {
    //     titles: ['应用管理', 'AIGC'],
    //     showHeaderApps: true
    //   }
    // },
    {
      path: '/sensitive/:app_key',
      name: 'sensitiveConfig',
      component:  () => import('@/views/sensitive/sensitive.vue'),
      meta: {
        titles: ['敏感词管理', '敏感词配置'],
        showHeaderApps: true
      }
    },
    {
      path: '/tools_api/:app_key',
      name: 'ToolsAPI',
      component:  () => import('@/views/tools/api.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/tools_connection/:app_key',
      name: 'ToolsConnection',
      component:  () => import('@/views/tools/connection.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/logs/:app_key',
      name: 'Logs',
      component:  () => import('@/views/logs/list.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/analysis_user/:app_key',
      name: 'AnalysisUser',
      component:  () => import('@/views/analysis/user.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/analysis_message/:app_key',
      name: 'AnalysisMessage',
      component:  () => import('@/views/analysis/message.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/analysis_group/:app_key',
      name: 'AnalysisGroup',
      component:  () => import('@/views/analysis/group.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/analysis_chatroom/:app_key',
      name: 'AnalysisChatroom',
      component:  () => import('@/views/analysis/chatroom.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/finance_dashboard',
      name: 'FinaDash',
      component:  () => import('@/views/finance/dashboard.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/finance_recharde',
      name: 'FinaRecharge',
      component:  () => import('@/views/finance/recharge.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/finance_rechardes',
      name: 'FinaRechardeList',
      component:  () => import('@/views/finance/recharge_list.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/finance_bill',
      name: 'FinaBill',
      component:  () => import('@/views/finance/bill.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/invoces',
      name: 'InvoiceList',
      component:  () => import('@/views/invoice/darw_list.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/invoce',
      name: 'Invoice',
      component:  () => import('@/views/invoice/draw.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/orders',
      name: 'OrderList',
      component:  () => import('@/views/service/order_list.vue'),
      meta: {
        titles: ['技术支持', '我的工单']
      }
    },
    {
      path: '/order',
      name: 'Order',
      component:  () => import('@/views/service/order_create.vue'),
      meta: {
        titles: ['技术支持', '创建工单']
      }
    },
    {
      path: '/user_notice',
      name: 'UserNotice',
      component:  () => import('@/views/user/notice.vue'),
      meta: {
        titles: []
      }
    },
    {
      path: '/user_setting',
      name: 'UserSetting',
      component:  () => import('@/views/user/setting.vue'),
      meta: {
        titles: ['账户信息', '账户设置']
      }
    },
    {
      path: '/user_enterprise',
      name: 'UserEnterprise',
      component:  () => import('@/views/user/enterprise.vue'),
      meta: {
        titles: ['账户信息', '企业认证']
      }
    },
    {
      path: '/user_manager',
      name: 'UserManader',
      component:  () => import('@/views/user/manager.vue'),
      meta: {
        titles: ['账户信息', '用户管理']
      }
    },
    {
      path: '/user_role',
      name: 'UserRole',
      component:  () => import('@/views/user/role.vue'),
      meta: {
        titles: ['账户信息', '角色管理']
      }
    },
  ],
},
{
  path: '/404',
  name: '404',
  component: () => import('@/views/404.vue'),
},
{
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  redirect: '/404',
},
{
  path: '/login',
  name: 'Login',
  component:  () => import('@/views/login/login.vue'),
}];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})
router.beforeEach((to, from, next)=> {
  let user = Storage.get(STORAGE.USER_TOKEN);
  if (!utils.isEmpty(user) || utils.isEqual(to.name, 'Login')) {
    next();
  }else{
    next({ name: 'Login'})
  }
})
export async function setupRouter(app) {
  app.use(router);
  await router.isReady();
}
