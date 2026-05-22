import { Application } from "../services";
import { APP_TYPE, RESPONSE } from './enum';
import utils from "./utils";
import { useRouter } from 'vue-router';

function fetch(params, callback){
  let { offset } = params;
  Application.getList(params).then(({ code, data }) => {
    if(!utils.isEqual(code, RESPONSE.SUCCESS)){
      return;
    }
    let { items, offset, has_more } = data;
    let apps = items.map((item) => {
      item.time = utils.formatTime(item.created_time);
      item.type = item.app_type;
      item.kind_key = utils.isEqual(item.app_type, APP_TYPE.PRIVATE) ? 'common.appType.private' : 'common.appType.public';
      return item;
    });
    if(utils.isEqual(offset, '')){
      let app = apps[0] || {};
      setCurrent(app);
    }
    callback({ apps, offset, has_more })
  });
}
let $currentSelectApp = {};
function setCurrent(app){
  $currentSelectApp = app;
}
function getCurrent(){
  return $currentSelectApp;
}

function currentAppKey() {
  let router = useRouter();
  let {
    currentRoute: {
      _rawValue: {
        params: { app_key },
      },
    },
  } = router;
  return app_key;
}

export default {
  fetch,
  setCurrent,
  getCurrent,
  currentAppKey,
}
