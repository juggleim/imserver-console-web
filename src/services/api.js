import { CONFIG } from './config'
import utils from '../common/utils'
let SERVER_PATH = {
  USER_LOGIN: 'login',
  USER_ADD: 'accounts/add',
  USER_DELETE: 'accounts/delete',
  USER_DISABLE: 'accounts/disable',
  USER_UPDATE_PWD: 'accounts/updpass',
  USER_LIST: 'accounts/list',
  USER_BIND_APP: 'accounts/bindapps',
  USER_UNBIND_APP: 'accounts/unbindapps',
  USER_FILE_TOKEN: 'apps/file_cred',

  APP_CREATE: 'apps/create',
  APP_IMPORT: 'apps/active',
  APP_UPDATE_LICENSE: 'apps/updlicense',
  APP_SETTING_UPDATE: 'apps/configs/set',
  APP_SETTING_GET: 'apps/configs/get',
  APP_GET_LIST: 'apps/list',
  APP_GET_ONE: 'apps/info',
  
  APP_EVENT_SET: 'apps/eventsubconfig/set',
  APP_EVENT_GET: 'apps/eventsubconfig/get',
  APP_INTERCEPTOR_LIST: 'apps/interceptors/list',
  APP_INTERCEPTOR_ADD: 'apps/interceptors/add',
  APP_INTERCEPTOR_UPDATE: 'apps/interceptors/update',
  APP_INTERCEPTOR_CONDITION_LIST: 'apps/interceptors/conditions/list',
  APP_INTERCEPTOR_CONDITION_ADD: 'apps/interceptors/conditions/add',
  APP_INTERCEPTOR_CONDITION_UPDATE: 'apps/interceptors/conditions/update',
  APP_INTERCEPTOR_CONDITION_DELETE: 'apps/interceptors/conditions/delete',
  APP_ANDROID_UPDATE: 'apps/androidpushconf/set',
  APP_ANDROID_GET: 'apps/androidpushconf/get',

  APP_IOS_UPDATE: 'apps/iospushcer/set',
  APP_IOS_UPLOAD: 'apps/iospushcer/upload',
  APP_IOS_GET: 'apps/iospushcer/get',

  APP_FCM_GET: 'apps/fcmpushconf/get',
  APP_FCM_UPLOAD: 'apps/fcmpushconf/upload',

  UPLOAD_FILE: 'common/upload',

  STORAGE_GET: 'apps/fileconf/get',
  STORAGE_SET: 'apps/fileconf/set',
  ENABLE_STORAGE_GET: 'apps/fileconf/switch/get',
  ENABLE_STORAGE_SET: 'apps/fileconf/switch/set',

  APP_SENSITIVE_SET: 'apps/sensitiveconf/set',
  APP_SENSITIVE_GET: 'apps/sensitiveconf/get',
  APP_SENSITIVE_WORDS_GET: 'apps/sensitivewords/list',
  APP_SENSITIVE_WORDS_ADD: 'apps/sensitivewords/add',
  APP_SENSITIVE_WORDS_UPDATE: 'apps/sensitivewords/update',
  APP_SENSITIVE_WORDS_DELETE: 'apps/sensitivewords/delete',
  APP_SENSITIVE_WORDS_IMPORT: 'apps/sensitivewords/import',

  MISC_REQUEST: 'imapiagent',

  LOG_GET_LIST: 'apps/clientlogs/list',
  LOG_CREATE_PULL: 'apps/clientlogs/notify',
  LOG_DOWNLOAD: 'apps/clientlogs/download',
  
  CONN_GET_LIST: 'apps/serverlogs/userconnect',
  CONN_GET_ONE: 'apps/serverlogs/connect',
  
  R3D_TRANSLTE_GET: 'apps/translate/get',
  R3D_TRANSLTE_SET: 'apps/translate/set',

  R3D_RTC_GET: 'apps/rtcconf/get',
  R3D_RTC_SET: 'apps/rtcconf/set',

  R3D_EMAIL_GET: 'apps/email/get',
  R3D_EMAIL_SET: 'apps/email/set',

  R3D_SMS_GET: 'apps/sms/get',
  R3D_SMS_SET: 'apps/sms/set',
  
  ANALIYSIS_MESSAGE: 'apps/statistic/msg',
  ANALIYSIS_DAU: 'apps/statistic/useractivity',

  USER_MANAGER_LIST: 'apps/users/list',
  USER_MANAGER_BAN: 'apps/users/ban',
  USER_MANAGER_UNBAN: 'apps/users/unban',

  GROUP_MANAGER_LIST: 'apps/groups/list',
  GROUP_MANAGER_DISSOLVE: 'apps/groups/dissolve',

  BOT_MANAGER_LIST: 'apps/bots/list',
  BOT_MANAGER_ADD: 'apps/bots/add',
  BOT_MANAGER_UPDATE: 'apps/bots/update',
  
  WORK_MANAGER_ADD: 'apps/applications/add',
  WORK_MANAGER_UPDATE: 'apps/applications/update',
  WORK_MANAGER_DELETE: 'apps/applications/delete',
  WORK_MANAGER_LIST: 'apps/applications/list',
  
  MSG_MANAGER_CONVER_LIST: 'apps/convers/list',
  MSG_MANAGER_HISTORY_LIST: 'apps/historymsgs/list',
  MSG_MANAGER_HISTORY_RECALL: 'apps/historymsgs/recall',
  MSG_MANAGER_HISTORY_DELETE: 'apps/historymsgs/del',
};
utils.forEach(SERVER_PATH, (url, name) => {
  SERVER_PATH[name] = `${CONFIG.API}${url}`;
});

export default SERVER_PATH;
