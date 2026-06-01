import { request } from './request';
import SERVER_PATH from './api';
import utils from '../common/utils';

function getList(params = {}) {
  let { limit = 50, offset, app_key, user_id, keywords } = params;
  let url = `${SERVER_PATH.BOT_MANAGER_LIST}?app_key=${app_key}&user_id=${user_id}&name=${keywords}&count=${limit}&offset=${offset}`;
  return request(url, {
    method: 'GET',
  });
}

function add(data) {
  return request(SERVER_PATH.BOT_MANAGER_ADD, {
    method: 'POST',
    body: utils.toJSON(data),
  });
}

function update(data) {
  return request(SERVER_PATH.BOT_MANAGER_UPDATE, {
    method: 'POST',
    body: utils.toJSON(data),
  });
}

export default {
  getList,
  add,
  update,
};
