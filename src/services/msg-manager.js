import { request } from './request';
import SERVER_PATH from './api';
import utils from '../common/utils';

function getConversations(params = {}){
  let { limit = 50, start, app_key, target_id, channel_type } = params;
  let url = `${SERVER_PATH.MSG_MANAGER_CONVER_LIST}?app_key=${app_key}&count=${limit}&start=${start}&target_id=${target_id}&channel_type=${channel_type}`;
  return request(url, {
    method: 'GET'
  });
}

function getMessages(params = {}){
  let { limit = 50, start = 0, app_key, sender_id, channel_type, receiver_id } = params;
  let url = `${SERVER_PATH.MSG_MANAGER_HISTORY_LIST}?app_key=${app_key}&count=${limit}&channel_type=${channel_type}&from_id=${sender_id}&target_id=${receiver_id}&start=${start}`;
  return request(url, {
    method: 'GET'
  });
}

function recallMessage(params = {}){
  return request(SERVER_PATH.MSG_MANAGER_HISTORY_RECALL, {
    method: 'POST',
    body: utils.toJSON(params),
  });
}

function deleteMessages(params = {}){
  return request(SERVER_PATH.MSG_MANAGER_HISTORY_DELETE, {
    method: 'POST',
    body: utils.toJSON(params),
  });
}

export default {
  getConversations,
  getMessages,
  recallMessage,
  deleteMessages
}
