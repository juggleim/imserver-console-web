import utils from "./utils";
import { User } from '../services';
import { RESPONSE } from './enum'

function getRangeDate(num){
  let dayMs = num * 24 * 60 * 60 * 1000;
  let current = utils.formatTime(Date.now(), 'yyyy-MM-dd');
  let time = new Date(`${current} 00:00:00`).getTime() - dayMs;
  let date = utils.formatTime(time);
  let start = new Date(date).getTime();
  let end = new Date().getTime() - 1 * 24 * 60 * 60 * 1000
  return { start, end }
}

function calcYesterday(result){
  let { upMsgs, downMsgs, disMsgs } = result;
  let upMsg = getStatInfo(upMsgs);
  let downMsg = getStatInfo(downMsgs);
  let disMsg = getStatInfo(disMsgs);
  return { upMsg, downMsg, disMsg };
}

function getStatInfo(items){
  let item = items[0] || { count: 0 }
  let qianitem = items[1] || { count: 1 }
  let percent = (item.count - qianitem.count) / qianitem.count * 100;
  let isUp = false;
  if(percent >= 0){
    isUp = true;
  }
  return { 
    isUp: isUp,
    percent: Math.abs(percent.toFixed(2)),
    count: utils.numberWithCommas(item.count)
  };
}

function formatChatData(result){
  let { upMsgs, downMsgs, disMsgs } = result;
  let dates = utils.map(upMsgs, (item) => {
    return utils.formatTime(item.time_mark, 'yyyy-MM-dd');
  }).reverse();
  
  upMsgs = utils.map(upMsgs, (item) => {
    return item.count;
  }).reverse();
  
  downMsgs = utils.map(downMsgs, (item) => {
    return item.count;
  }).reverse();
  
  disMsgs = utils.map(disMsgs, (item) => {
    return item.count;
  }).reverse();
  return { dates, upMsgs, downMsgs, disMsgs };
}

function formatDauChat(result){
  let { items } = result;
  let dates = utils.map(items, (item) => {
    return utils.formatTime(item.time_mark, 'yyyy-MM-dd');
  });
  
  let daus = utils.map(items, (item) => {
    return item.count;
  });
 
  return { dates, daus };
}
function getAvatarNum(content){
  let num = 0;
  if(content.length > 0){
    num = content.charCodeAt(0) % 6;
  }
  return num;
}
function uploadImage(appkey, file, callback){
  User.getFileToken({ app_key: appkey, file_type: 1, ext: 'png' }).then(({ code, data }) => {
    if(!utils.isEqual(code, RESPONSE.SUCCESS)){
      return callback(code);
    }
    compress(file, (thumbnail) => {
      let { pre_sign_resp: { url } } = data;
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange=function(){
        if (utils.isEqual(xhr.readyState, 4)){
          url = url.split('?')[0]
          callback(RESPONSE.SUCCESS, url);
        }
      }
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Content-Type', '');
      xhr.send(thumbnail);
    });
  });
}
let compress = (file, callback, option = {}) => {
    let { scale = 0.2, fileCompressLimit = 500 } = option;
    let size = file.size / 1000;
    
    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      compressImage();
    };
    var compressImage = function () {
      var canvas = document.createElement("canvas");
      let height = img.height;
      let width = img.width;
      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        var thumbnail = new File([blob], 'tb.png', { type: 'image/png' });
        callback(thumbnail, { height, width, type: 'image/png' });
      });
    };
  };
export default {
  getRangeDate,
  calcYesterday,
  formatDauChat,
  formatChatData,
  getAvatarNum,
  uploadImage,
}