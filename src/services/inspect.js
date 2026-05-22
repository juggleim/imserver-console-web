import { request, downloadFile } from './request';
import SERVER_PATH from './api';
import utils from '../common/utils';

function getConns(params){
  let { count = 50, start, app_key, user_id } = params;
  let url = `${SERVER_PATH.CONN_GET_LIST}?app_key=${app_key}&user_id=${user_id}&count=${count}&start=${start}`;
  return request(url, { method: 'GET' });
}

function getConn(params){
  let { count = 50, start, app_key, session } = params;
  let url = `${SERVER_PATH.CONN_GET_ONE}?app_key=${app_key}&session=${session}&count=${count}&start=${start}`;
  return request(url, { method: 'GET' });
}

export default {
  getConns,
  getConn,
}