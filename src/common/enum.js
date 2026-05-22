import utils from "./utils";

export let INVOICE_TYPE = {
  ONLINE: 1,
  PAPER: 2
};

let ErrorMessages = [
  { code: 200, msg: '成功', key: 'errors.api.SUCCESS', name: 'SUCCESS' },
  { code: 0, msg: '成功', key: 'errors.api.SUCCESS_0', name: 'SUCCESS_0' },
  { code: 1003, msg: '用户名密码不匹配', key: 'errors.api.USER_LOGIN_FAILED', name: 'USER_LOGIN_FAILED' },
  { code: 1016, msg: '用户已被禁用，请联系管理员', key: 'errors.api.USER_BLOCKED', name: 'USER_BLOCKED' },
  { code: 1012, msg: '用户已存在，换个名字吧', key: 'errors.api.USER_EXISTS', name: 'USER_EXISTS' },
  { code: 1001, msg: '原密码不正确', key: 'errors.api.USER_OLDPWD_WRONG', name: 'USER_OLDPWD_WRONG' },
  { code: 1006, msg: '应用已存在', key: 'errors.api.APP_EXISTS', name: 'APP_EXISTS' },
  { code: 1001, msg: '登录身份过期', key: 'errors.api.USER_TOKEN_EXPIRE', name: 'USER_TOKEN_EXPIRE' },
];

export let Errors = ErrorMessages;

function getErrorType() {
  let errors = {};
  utils.forEach(ErrorMessages, (error) => {
    let { name, code, msg, key } = error;
    errors[name] = { code, msg, key };
  });
  return errors;
}
export let ErrorType = getErrorType();

export let STORAGE = {
  PREFIX: 'jgadmin',
  USER_TOKEN: 'user_auth_token',
  APP_KEY: 'app_key',
  LOCALE: 'locale',
}
export let USER_STATE = {
  ENABLE: 0,
  DISABLE: 1
};
export let DEPLOY_TYPE = {
  PUBLIC: 1,
  PRIVATE: 2
};
export let APP_TYPE = {
  PRIVATE: 0,
  SPECIAL: 1,
  PUBLIC: 2,
};
export let EVENT_NAME = {
  CREATE_APP: 'app_create',
  CREATE_APP_FINISHED: 'app_create_finished',

  ON_LOGOUT: 'app_logout',
};
export let FUNC_TYPE = {
  INPUT: 'input',
  INPUT_TEXT: 'input_text',
  INPUT_MODAL: 'input_modal',
  SELECT: 'select',
  SWITCH: 'switch',
  UPLOAD_FILE: 'upload_file',
};
export let APP_STATUS = {
  NORMAL: 0,
  ONLINE: 1,
  BLOCKED: 2,
};
export let RESPONSE = {
  SUCCESS: 0,
  UNATHORIZED: 401,
  USER_SENDCODE_ERROR: 10514,
  USER_SEARCH_ERROR: 10509,
};

export let DIALOG_TYPE = {
  UPGRADE: 1,
  DELAY: 2,
  CREATE: 3
};
export let LOG_PULL_STATUS = {
  NONE: 0,
  SUCCESS: 1,
  FAIL: 2,
  COMPLETE: 3,
  UPLOAD_FAIL: 4,
  WITHOUT: 5,
  0: '待执行',
  1: '指令成功已发',
  2: '指令发送失败',
  3: '日志上传完成',
  4: '日志上传失败',
  5: '客户端无日志'
};

export let SIGNAL_TYPE = {
  CONNECTED: 1,
  DISCONNECTED: 2,
  USER: 3,
  SERVER: 4,
  REPLY: 5,
}

export let STAT_TYPE = {
  UP: 1,
  DISPATCH: 2,
  DOWN: 3,
};

export let METHOD_MAP = {
  connect: { title: '连接成功' },
  disconnect: { title: '断开连接' },
  qry_ack: { title: 'Q_ACK' },
  u_pub_ack: { title: 'U_PUB_ACK' },
  s_pub_ack: { title: 'S_PUB_ACK' },
  qry_hismsgs: { title: '获取历史消息' },
  qry_convers: { title: '获取会话列表' },
  qry_top_convers: { title: '获取指定会话' },
  sync_convers: { title: '同步会话' },
  sync_msgs: { title: '同步消息' },
  recall_msg: { title: '撤回消息' },
  qry_mention_msgs: { title: '获取 @ 消息列表' },
  ntf: { title: '服务端通知消息' },
  msg: { title: '服务端直发消息' },
  c_user_ntf: { title: '聊天室同步通知' },
  g_msg: { title: '发送群组消息' },
  p_msg: { title: '发送单聊消息' },
  c_msg: { title: '发送聊天室消息' },
  qry_merged_msgs: { title: '获取合并消息' },
  qry_first_unread_msg: { title: '获取会话第一条未读消息' },
  clear_unread: { title: '清理会话未读' },
  del_convers: { title: '删除会话' },
  add_conver: { title: '插入会话' },
  qry_conver: { title: '获取单个会话' },
  undisturb_convers: { title: '会话免打扰' },
  top_convers: { title: '会话置顶' },
  qry_total_unread_count: { title: '获取未读总数' },
  clear_total_unread: { title: '清理未读总数' },
  mark_unread: { title: '标记未读' },
  set_user_undisturb: { title: '设置用户免打扰' },
  get_user_undisturb: { title: '获取用户免打扰' },
  mark_read: { title: '设置消息已读' },
  qry_read_detail: { title: '获取群消息已读详情' },
  modify_msg: { title: '修改消息' },
  clean_hismsg: { title: '清空会话消息' },
  del_hismsg: { title: '删除会话消息' },
  qry_hismsg_by_ids: { title: '根据 ID 查询历史消息' },
  file_cred: { title: '获取文件上传凭证' },
  qry_user_info: { title: '查询用户信息' },
  c_join: { title: '加入聊天室' },
  c_quit: { title: '退出聊天室' },
  c_sync_msgs: { title: '同步聊天室消息' },
  c_sync_atts: { title: '同步聊天室消息 KV' },
  c_batch_add_att: { title: '设置聊天室 KV' },
  c_batch_del_att: { title: '删除聊天室 KV' },
};
export let IM_ERRORS = [
{ code: 0, msg: '成功'	},
{ code: 11000, msg: '默认错误'	},
{ code: 11001, msg: 'Appkey 未赋值'	},
{ code: 11002, msg: 'Token 未赋值'	},
{ code: 11003, msg: 'App不存在'	},
{ code: 11004, msg: 'Token不合法'	},
{ code: 11005, msg: 'Token校验失败'	},
{ code: 11006, msg: 'Token已过期'	},
{ code: 11007, msg: '需要重新链接'	},
{ code: 11008, msg: '不支持的平台类型'	},
{ code: 11009, msg: 'App已被封禁'	},
{ code: 11010, msg: '用户被封禁'	},
{ code: 11011, msg: '被踢下线'	},
{ code: 11012, msg: '注销登录'	},
{ code: 11013, msg: '不支持的信令'	},
{ code: 11014, msg: '用户数超限'	},
{ code: 11015, msg: '缺少必填参数'},
{ code: 10100, msg: '默认错误'	},
{ code: 10101, msg: '用户数量超限'	},
{ code: 10102, msg: '用户不存在'	},
{ code: 10103, msg: '不支持的用户属性'},
{ code: 12000, msg: '默认错误'	},
{ code: 12001, msg: '消息存储失败'	},
{ code: 12002, msg: '消息删除失败'	},
{ code: 12003, msg: '消息更新失败'	},
{ code: 12004, msg: '消息格式不合法'	},
{ code: 12005, msg: '被对方拉黑'	},
{ code: 12006, msg: '消息扩展，字段重复'	},
{ code: 12007, msg: '消息命中敏感词策略，被拦截'},
{ code: 13000, msg: '默认错误'	},
{ code: 13001, msg: '群组不存在'	},
{ code: 13002, msg: '用户不是群组成员'	},
{ code: 13003, msg: '群组被禁言'	},
{ code: 13004, msg: '群成员被禁言'	},
{ code: 13005, msg: '群成员数量已达上限'	},
{ code: 13006, msg: '查不到对应群组快照'},
{ code: 14000, msg: '默认错误'	},
{ code: 14001, msg: '非聊天室成员'	},
{ code: 14002, msg: '属性已满'	},
{ code: 14003, msg: 'key已被占用'	},
{ code: 14004, msg: '属性不存在'	},
{ code: 14005, msg: '聊天室不存在'	},
{ code: 14006, msg: '聊天室已被销毁'	},
{ code: 14007, msg: '已被禁言'	},
{ code: 14008, msg: '已被封禁'},
{ code: 15000, msg: '默认错误'	},
{ code: 15001, msg: '未配置文件存储引擎'	},
{ code: 15001, msg: '文件上传，预签名错误'},
]

export let CONVERSATION_TYPE = { 
  PRIVATE: 1,
  GROUP: 2,
  CHATROOM: 3
}

export let ANA_DATE_RANGES = [
  { title: '7 天', titleKey: 'analysis.range.7days', name: 7, isActive: true },
  { title: '14 天', titleKey: 'analysis.range.14days', name: 14, isActive: false },
  { title: '30 天', titleKey: 'analysis.range.30days', name: 30, isActive: false },
]

export let PLATFORMAS = [
  { name: 'Android', labelKey: '', value: 'Android' },
  { name: 'iOS', labelKey: '', value: 'iOS' },
  { name: 'Web', labelKey: '', value: 'Web' },
  { name: 'PC', labelKey: '', value: 'PC' }, 
];

export let MENU_UID = {
  APP: 1,
  SENTSIVE: 2,
  ANALYSE: 3,
  LOG: 4,
  DEV_TOOL: 5,
  USER_MANGER: 6,
  
};


export let R3D_USE_TYPE = {
  ENABLE: 1,
  DISABLE: 2
};
export let TRANSLATE_CHANNELS = [
  { uid: 'baidu', name: '百度翻译', icon: 'baidu', isUsed: false, 
    children: [
      { name: 'APIKey', type: 'text', key: 'api_key', value: '' }, 
      { name: 'SecretKey', type: 'text', key: 'secret_key', value: '', secretValue: '**************' },
      { name: '是否启用', type: 'select', key: 'is_used', value: R3D_USE_TYPE.DISABLE, children: [
        { label: '启用', value: R3D_USE_TYPE.ENABLE },
        { label: '禁用', value: R3D_USE_TYPE.DISABLE },
      ] },
    ] 
  },
  { uid: 'deepl', name: 'DeepL', icon: 'deepl', isUsed: false, 
    children: [
      { name: 'AuthKey', type: 'text', key: 'auth_key', value: '' },
      { name: '是否启用', type: 'select', key: 'is_used', value: R3D_USE_TYPE.DISABLE, children: [
        { label: '启用', value: R3D_USE_TYPE.ENABLE },
        { label: '禁用', value: R3D_USE_TYPE.DISABLE },
      ] },
    ] 
  },
];

export let RTC_CHANNELS = [
  { uid: 'zego_conf', name: '即构', icon: 'zego', isUsed: false, 
    children: [
      { name: 'AppId', type: 'number', key: 'app_id', value: '' }, 
      { name: 'Secret', type: 'text', key: 'secret', value: '', secretValue: '**************' },
      // { name: '是否启用', type: 'select', key: 'is_used', value: R3D_USE_TYPE.DISABLE, children: [
      //   { label: '启用', value: R3D_USE_TYPE.ENABLE },
      //   { label: '禁用', value: R3D_USE_TYPE.DISABLE },
      // ] },
    ] 
  },
  { uid: 'agora_conf', name: '声网', icon: 'agora', isUsed: false, 
    children: [
      { name: 'AppId', type: 'text', key: 'app_id', value: '' }, 
      { name: 'Certificate', type: 'text', key: 'app_certificate', value: '', secretValue: '**************' },
      // { name: '是否启用', type: 'select', key: 'is_used', value: R3D_USE_TYPE.DISABLE, children: [
      //   { label: '启用', value: R3D_USE_TYPE.ENABLE },
      //   { label: '禁用', value: R3D_USE_TYPE.DISABLE },
      // ] },
    ] 
  },
  { uid: 'livekit_conf', name: 'LiveKit', icon: 'livekit', isUsed: false, 
    children: [
      { name: 'AppKey', type: 'text', key: 'app_key', value: '' }, 
      { name: 'Secret', type: 'text', key: 'app_secret', value: '', secretValue: '**************' },
      { name: 'Url', type: 'text', key: 'service_url', value: '' },
      // { name: '是否启用', type: 'select', key: 'is_used', value: R3D_USE_TYPE.DISABLE, children: [
      //   { label: '启用', value: R3D_USE_TYPE.ENABLE },
      //   { label: '禁用', value: R3D_USE_TYPE.DISABLE },
      // ] },
    ] 
  }
];
export let EMAIL_CHANNELS = [
  { uid: 'ali', name: '阿里云', icon: 'ali', isUsed: false, 
    children: [
      { name: 'AppId', type: 'text', key: 'access_key', value: '' }, 
      { name: 'Secret', type: 'text', key: 'access_secret', value: '', secretValue: '**************' },
      { name: 'FromEmail', type: 'text', key: 'from_email', value: '' },
      { name: 'FromAlias', type: 'text', key: 'from_alias', value: '' },
      { name: '是否启用', type: 'select', key: 'is_used', value: R3D_USE_TYPE.DISABLE, children: [
        { label: '启用', value: R3D_USE_TYPE.ENABLE },
        { label: '禁用', value: R3D_USE_TYPE.DISABLE },
      ] },
    ] 
  },
  { uid: 'engagelab', name: 'EngageLab', icon: 'engagelab', isUsed: false, 
    children: [
      { name: 'Url', type: 'text', key: 'url', value: '' }, 
      { name: 'API_User', type: 'text', key: 'api_user', value: '' },
      { name: 'API_Key', type: 'text', key: 'api_key', value: '', secretValue: '**************' },
      { name: 'FromEmail', type: 'text', key: 'from_email', value: '' },
      { name: '是否启用', type: 'select', key: 'is_used', value: R3D_USE_TYPE.DISABLE, children: [
        { label: '启用', value: R3D_USE_TYPE.ENABLE },
        { label: '禁用', value: R3D_USE_TYPE.DISABLE },
      ] },
    ] 
  },
];
export let SMS_CHANNELS = [
  { uid: 'baidu', name: '百度', icon: 'baidu', isUsed: false, 
    children: [
      { name: 'APIKey', type: 'text', key: 'api_key', value: '' }, 
      { name: 'SecretKey', type: 'text', key: 'secret_key', value: '', secretValue: '**************' },
      { name: 'Endpoint', type: 'text', key: 'endpoint', value: '' },
      { name: '模版', type: 'text', key: 'template', value: '' },
      { name: '签名 ID', type: 'text', key: 'signature_id', value: '' },
      { name: '是否启用', type: 'select', key: 'is_used', value: R3D_USE_TYPE.DISABLE, children: [
        { label: '启用', value: R3D_USE_TYPE.ENABLE },
        { label: '禁用', value: R3D_USE_TYPE.DISABLE },
      ] },
    ] 
  },
  { uid: 'smsbao', name: '短信宝', icon: 'smsbao', isUsed: false, 
    children: [
      { name: '名称', type: 'text', key: 'username', value: '' }, 
      { name: '密码', type: 'text', key: 'password', value: '', secretValue: '**************' },
      { name: '模版', type: 'text', key: 'template', value: '' },
      { name: '是否启用', type: 'select', key: 'is_used', value: R3D_USE_TYPE.DISABLE, children: [
        { label: '启用', value: R3D_USE_TYPE.ENABLE },
        { label: '禁用', value: R3D_USE_TYPE.DISABLE },
      ] },
    ] 
  },
];
export let USER_ROLE_TYPE = {
  ADMIN: 0,
  USER: 1,
}
export let ROLES = [
  { name: '超级管理员', labelKey: 'userManager.role.admin', value: USER_ROLE_TYPE.ADMIN, menuIds: [ MENU_UID.APP, MENU_UID.SENTSIVE, MENU_UID.ANALYSE, MENU_UID.LOG, MENU_UID.DEV_TOOL, MENU_UID.USER_MANGER] },
  { name: '普通用户', labelKey: 'userManager.role.user', value: USER_ROLE_TYPE.USER, menuIds: [MENU_UID.ANALYSE] },
];
