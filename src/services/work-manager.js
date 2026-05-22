import { request } from './request';
import SERVER_PATH from './api';
import utils from '../common/utils';

function getList(params = {}){
  let { limit = 200, page = 1, app_key } = params;
  let url = `${SERVER_PATH.WORK_MANAGER_LIST}?app_key=${app_key}&count=${limit}&page=${page}`;
  return request(url, {
    method: 'GET'
  });
}

function add(data){
  return request(SERVER_PATH.WORK_MANAGER_ADD, {
    method: 'POST',
    body: utils.toJSON(data)
  });
}

function update(data){
  return request(SERVER_PATH.WORK_MANAGER_UPDATE, {
    method: 'POST',
    body: utils.toJSON(data)
  });
}

function remove(data){
  return request(SERVER_PATH.WORK_MANAGER_DELETE, {
    method: 'POST',
    body: utils.toJSON(data)
  });
}

export default {
  getList,
  add,
  update,
  remove,
}