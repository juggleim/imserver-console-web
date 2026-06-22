import utils from "../../common/utils";
import Storage from "../../common/storage";
import { DEPLOY_TYPE, STORAGE, APP_TYPE } from "../../common/enum";
import MenuFactory from "./menus";

let menugConfig = { state: { menus: [], router: {} } };

let setMenuConfig = (cfg) => {
  utils.extend(menugConfig, cfg);
};

let showMenus = (router) => {
  let { currentRoute: { _rawValue: { name } } } = router;
  let user = Storage.get(STORAGE.USER_TOKEN);
  let menuFactory = MenuFactory(menugConfig)[user.env];

  if(name.indexOf('User') == 0){
    showUserMenus(menuFactory);
  }else if(utils.isInclude(name, 'Fina') || utils.isInclude(name, 'Invoice')){
    showInvoiceMenus(menuFactory);
  }else if(utils.isInclude(name, 'Order')){
    showOrderMenus(menuFactory);
  }else{
    showAppMenus(menuFactory);
  }
};
let showAppMenus = (menuFactory) => {
  let { state } = menugConfig;
  state.menus = menuFactory.getApps(menugConfig);
};
let showOrderMenus = (menuFactory) => {
  let { state } = menugConfig;
  state.menus = menuFactory.getOrders(menugConfig);
};
let showInvoiceMenus = (menuFactory) => {
  let { state } = menugConfig;
  state.menus = menuFactory.getInvoices(menugConfig)
};
let showUserMenus = (menuFactory) => {
  let { state } = menugConfig;
  state.menus = menuFactory.getUsers(menugConfig);
};
let goHomePage = (router) => {
  let user = Storage.get(STORAGE.USER_TOKEN);
  router.replace({ name: 'Dashboard' });
};
let goBasePage = (app) => {
  let { router } = menugConfig;
  let { app_key } = app;
  let user = Storage.get(STORAGE.USER_TOKEN);
  let menuFactory = MenuFactory(menugConfig)[user.env];
  let appMenus = menuFactory.getApps(menugConfig);
  appMenus = appMenus.filter((menu) => {
    return !menu.isHidden;
  });
  router.push({ name: appMenus[1].children[0].name, params: { app_key } });
};
let goLoginPage = () => {
  let { router } = menugConfig;
  router.push({ name: 'Login' });
};
let syncMenuUnfold = (router) => {
  let { state } = menugConfig;
  if (!state.menus || state.menus.length === 0) {
    return;
  }
  let user = Storage.get(STORAGE.USER_TOKEN);
  let menuFactory = MenuFactory(menugConfig)[user.env];
  let { currentRoute: { _rawValue: { name } } } = router;
  let freshMenus = [];
  if (name.indexOf('User') == 0) {
    freshMenus = menuFactory.getUsers(menugConfig);
  } else {
    freshMenus = menuFactory.getApps(menugConfig);
  }
  state.menus.forEach((menu) => {
    let fresh = freshMenus.find((item) => utils.isEqual(item.title, menu.title));
    if (fresh) {
      menu.isUnfold = fresh.isUnfold;
    }
  });
};
let isSameGroup = (menus, name) => {
  let isSame = false;
  for(let i = 0; i < menus.length; i++){
    let menu = menus[i];
    if(utils.isEqual(menu.name, name)){
      isSame = true;
    }
    if(menu.children){
      utils.forEach(menu.children, (child) => {
        if(utils.isEqual(child.name, name)){
          isSame = true;
        }
      });
    }
  }
  return isSame;
};
export default {
  setMenuConfig,
  showMenus,
  syncMenuUnfold,
  goHomePage,
  goBasePage,
  goLoginPage,
  isSameGroup
};
