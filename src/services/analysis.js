import { request } from './request';
import SERVER_PATH from './api';
import utils from '../common/utils';
let getUserChat = (params) => {
  let query = new URLSearchParams(params);
  let str = query.toString();
  let url = `${SERVER_PATH.ANALIYSIS_DAU}?${str}`;
  return request(url, { method: 'GET'});
};
let getMaxConnectChat = (params) => {
  let query = new URLSearchParams(params);
  let str = query.toString();
  let url = `${SERVER_PATH.ANALIYSIS_MAX_CONNECT}?${str}`;
  return request(url, { method: 'GET'});
};
let getMessageChat = (params) => {
  let query = new URLSearchParams(params);
  let str = query.toString();
  let url = `${SERVER_PATH.ANALIYSIS_MESSAGE}?${str}`;
  return request(url, { method: 'GET'});
};
let getRealtimeMessageChat = (params) => {
  let query = new URLSearchParams(params);
  let str = query.toString();
  let url = `${SERVER_PATH.ANALIYSIS_MESSAGE_REALTIME}?${str}`;
  return request(url, { method: 'GET'});
};
let getGroupChat = (params) => {
  return request(SERVER_PATH.USER_DISABLE, {
    method: 'GET',
    body: utils.toJSON(params)
  });
};
let getChatroomChat = (params) => {
  return request(SERVER_PATH.USER_DISABLE, {
    method: 'GET',
    body: utils.toJSON(params)
  });
};

export default {
  getUserChat,
  getMaxConnectChat,
  getMessageChat,
  getRealtimeMessageChat,
  getGroupChat,
  getChatroomChat,
}