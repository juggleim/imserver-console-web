import { request } from './request';
import SERVER_PATH from './api';
import utils from '../common/utils';

function getList(params = {}){
  let { limit = 50, offset, app_key, group_id, keywords } = params;
  let url = `${SERVER_PATH.GROUP_MANAGER_LIST}?app_key=${app_key}&group_id=${group_id}&name=${keywords}&count=${limit}&offset=${offset}`;
  return request(url, {
    method: 'GET'
  });
}

function dissolve(params = {}){
  let { group_ids, app_key } = params;
  let url = `${SERVER_PATH.GROUP_MANAGER_DISSOLVE}`;
  return request(url, {
    method: 'POST',
    body: utils.toJSON({
      app_key: app_key,
      group_ids: group_ids,
    })
  });
}

export default {
  getList,
  dissolve
}