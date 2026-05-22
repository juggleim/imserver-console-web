import { get, request } from './request';
import SERVER_PATH from './api';
import utils from '../common/utils';

function create({ name }) {
  let data = { app_name: name };
  return request(SERVER_PATH.APP_CREATE, {
    method: 'POST',
    body: utils.toJSON(data),
  });
}

function importApp({ license }) {
  let data = { license };
  return request(SERVER_PATH.APP_IMPORT, {
    method: 'POST',
    body: utils.toJSON(data),
  });
}

function updateLicense(data) {
  return request(SERVER_PATH.APP_UPDATE_LICENSE, {
    method: 'POST',
    body: utils.toJSON(data),
  });
}

function updateSetting({ id, value, app_key }) {
  let configs = {};
  configs[id] = String(value);
  return request(SERVER_PATH.APP_SETTING_UPDATE, {
    method: 'POST',
    body: utils.toJSON({ app_key, configs }),
  });
}

function getSetting(data) {
  return request(SERVER_PATH.APP_SETTING_GET, {
    method: 'POST',
    body: utils.toJSON(data),
  });
}

function getList(params = {}) {
  let { limit = 50, offset ='', account = '' } = params;
  let url = `${SERVER_PATH.APP_GET_LIST}?limit=${limit}&offset=${offset}&account=${account}`;
  return request(url, {
    method: 'GET',
  });
}

function getOne({ app_key }) {
  let url = `${SERVER_PATH.APP_GET_ONE}?app_key=${app_key}`;
  return request(url, {
    method: 'GET',
  });
}

function setEventHook({ app_key, config, hooks }) {
  let sw = {};
  utils.forEach(hooks, (hook) => {
    utils.forEach(hook.items, (item) => {
      sw[item.key] = item.value;
    });
  });
  let data = {
    app_key: app_key,
    event_sub_config: config,
    event_sub_switch: sw,
  };
  return request(SERVER_PATH.APP_EVENT_SET, {
    method: 'POST',
    body: utils.toJSON(data),
  });
}

function getEventHook({ app_key }) {
  let url = `${SERVER_PATH.APP_EVENT_GET}?app_key=${app_key}`;
  return request(url, {
    method: 'GET',
  });
}

function getInterceptorList({ app_key }) {
  return get(SERVER_PATH.APP_INTERCEPTOR_LIST, { app_key });
}

function addInterceptor(params) {
  return request(SERVER_PATH.APP_INTERCEPTOR_ADD, {
    method: 'POST',
    body: utils.toJSON(params),
  });
}

function updateInterceptor(params) {
  return request(SERVER_PATH.APP_INTERCEPTOR_UPDATE, {
    method: 'POST',
    body: utils.toJSON(params),
  });
}

function getInterceptorConditionList({ app_key, interceptor_id }) {
  return get(SERVER_PATH.APP_INTERCEPTOR_CONDITION_LIST, { app_key, interceptor_id });
}

function addInterceptorCondition(params) {
  return request(SERVER_PATH.APP_INTERCEPTOR_CONDITION_ADD, {
    method: 'POST',
    body: utils.toJSON(params),
  });
}

function updateInterceptorCondition(params) {
  return request(SERVER_PATH.APP_INTERCEPTOR_CONDITION_UPDATE, {
    method: 'POST',
    body: utils.toJSON(params),
  });
}

function deleteInterceptorCondition(params) {
  return request(SERVER_PATH.APP_INTERCEPTOR_CONDITION_DELETE, {
    method: 'POST',
    body: utils.toJSON(params),
  });
}

function setAndroidPushConfig(state) {
  let url = `${SERVER_PATH.APP_ANDROID_UPDATE}`;

  return request(url, {
    method: 'POST',
    body: utils.toJSON(state),
  });
}

function getAndroidPushConfig(params) {
  return get(SERVER_PATH.APP_ANDROID_GET, params);
}

function uploadIosPushConfig(params) {
  let { app_key, cert_pwd, file, voipFile, voip_cert_pwd, is_product } = params;
  let form = new FormData();
  if(file.name){
    form.append('ioscer', file);
    form.append('cert_path', file.name);
  }
  form.append('app_key', app_key);
  form.append('package', params.package);
  form.append('cert_pwd', cert_pwd);
  form.append('is_product', is_product);
  if(voipFile.name){
    form.append('voip_ioscer', voipFile);
    form.append('voip_cert_path', voipFile.name);
    form.append('voip_cert_pwd', voip_cert_pwd);
  }
  return request(SERVER_PATH.APP_IOS_UPLOAD, {
    method: 'POST',
    body: form,
  });
}

function setIosPushConfig(data) {
  return request(SERVER_PATH.APP_IOS_UPDATE, {
    method: 'POST',
    body: utils.toJSON(data),
  });
}

function getIosPushConfig(params) {
  return get(SERVER_PATH.APP_IOS_GET, params);
}

function uploadFile(file) {
  let data = new FormData();
  data.append('file', file);
  return request(SERVER_PATH.UPLOAD_FILE, {
    method: 'POST',
    body: data,
  });
}

function getStorageConfig(params) {
  return get(SERVER_PATH.STORAGE_GET, params);
}

function setStorageConfig(state) {
  let url = `${SERVER_PATH.STORAGE_SET}`;

  return request(url, {
    method: 'POST',
    body: utils.toJSON(state),
  });
}

function getEnableStorage(params) {
  return get(SERVER_PATH.ENABLE_STORAGE_GET, params);
}

function setEnableStorage(state) {
  let url = `${SERVER_PATH.ENABLE_STORAGE_SET}`;

  return request(url, {
    method: 'POST',
    body: utils.toJSON(state),
  });
}

function getLogList(params) {
  return get(SERVER_PATH.LOG_LIST, params);
}

function getSensitiveConf(appKey) {
  return get(SERVER_PATH.APP_SENSITIVE_GET, { app_key: appKey });
}

function setSensitiveConf(appKey, conf) {
  return request(SERVER_PATH.APP_SENSITIVE_SET, {
    method: 'POST',
    body: utils.toJSON({ app_key: appKey, ...conf }),
  });
}

/**
 * 获取敏感词列表
 * @param  {page: number, pageSize: number, appKey: string} params
 * @returns {Promise<never>}
 */
function getSensitiveList(params) {
  return get(SERVER_PATH.APP_SENSITIVE_WORDS_GET, params);
}

function addSensitiveWord(params) {
  return request(SERVER_PATH.APP_SENSITIVE_WORDS_ADD, {
    method: 'POST',
    body: utils.toJSON(params),
  });
}

function updateSensitiveWord(appKey, word, filterType) {
  return request(SERVER_PATH.APP_SENSITIVE_WORDS_UPDATE, {
    method: 'POST',
    body: utils.toJSON({ appKey, word, filterType }),
  });
}

function deleteSensitiveWord(params) {
  return request(SERVER_PATH.APP_SENSITIVE_WORDS_DELETE, {
    method: 'POST',
    body: utils.toJSON(params),
  });
}

function importSensitiveWords(appKey, file) {
  let data = new FormData();
  data.append('file', file);
  data.append('appKey', appKey);
  return request(SERVER_PATH.APP_SENSITIVE_WORDS_IMPORT, {
    method: 'POST',
    body: data,
  });
}
function getFcmPushConfig(params) {
  return get(SERVER_PATH.APP_FCM_GET, params);
}
function uploadFcmPushConfig(params) {
  let { app_key, file } = params;
  let form = new FormData();
  form.append('fcm_conf', file);
  form.append('app_key', app_key);
  form.append('package', params.package);
  form.append('conf_path', file.name);
  return request(SERVER_PATH.APP_FCM_UPLOAD, {
    method: 'POST',
    body: form,
  });
}
export default {
  create,
  importApp,
  updateLicense,
  updateSetting,
  getSetting,
  getList,
  getOne,
  setEventHook,
  getEventHook,
  getInterceptorList,
  addInterceptor,
  updateInterceptor,
  getInterceptorConditionList,
  addInterceptorCondition,
  updateInterceptorCondition,
  deleteInterceptorCondition,
  setAndroidPushConfig,
  getAndroidPushConfig,
  uploadFile,
  getIosPushConfig,
  setIosPushConfig,
  uploadIosPushConfig,
  getStorageConfig,
  setStorageConfig,
  getEnableStorage,
  setEnableStorage,
  getLogList,
  getSensitiveConf,
  setSensitiveConf,
  getSensitiveList,
  addSensitiveWord,
  updateSensitiveWord,
  deleteSensitiveWord,
  importSensitiveWords,
  getFcmPushConfig,
  uploadFcmPushConfig,  
};
