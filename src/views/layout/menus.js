import utils from '../../common/utils';
import Storage from '../../common/storage';
import { STORAGE, ROLES, MENU_UID, USER_ROLE_TYPE } from '../../common/enum';
import appTools from '../../common/app-tools';

function MenuFactory() {
  let homePage = {
    title: 'menu.home',
    name: 'Dashboard',
    icon: 'cicon-home',
  };
  let isHidden = false;

  let privateMenus = {
    getApps: ({ router }) => {
      var appMenus = [
        homePage,
      ];
      if(isAdmin()){
        appMenus.push({
          title: 'menu.appManagement',
          icon: 'cicon-set',
          isHidden: isHidenMenu(MENU_UID.APP),
          isUnfold: isFold('Argu', router),
          children: [
            { title: 'menu.app.baseInfo', name: 'ArguBase' },
            { title: 'menu.app.featureConfig', name: 'ArguSwitch' },
            { title: 'menu.app.webhookSettings', name: 'ArguCallback' },
            { title: 'menu.app.messageIntercept', name: 'ArguMessageIntercept' },
            { title: 'menu.app.pushSettings', name: 'ArguPush' },
            { title: 'menu.app.storageSettings', name: 'ArguStorage' },
            { title: 'menu.app.translateSettings', name: 'ArguTranslte' },
            { title: 'menu.app.workbenchSettings', name: 'ArguWorkList' },
            { title: 'menu.app.rtcSettings', name: 'ArguRTC' },
            { title: 'menu.app.emailSettings', name: 'ArguEmail' },
            { title: 'menu.app.smsSettings', name: 'ArguSms' },
          ],
        });
      }
      appMenus = appMenus.concat([
        {
          title: 'menu.userManagement',
          icon: 'cicon-user',
          isHidden: isHidenMenu(MENU_UID.APP),
          isUnfold: isFold('Argu', router),
          children: [
            { title: 'menu.user.users', name: 'ArguUserList' },
            { title: 'menu.user.groups', name: 'ArguGroupList' },
            { title: 'menu.user.bots', name: 'ArguBotList' },
          ],
        },
        {
          title: 'menu.sensitive.root',
          icon: 'cicon-app',
          isHidden: isHidenMenu(MENU_UID.SENTSIVE),
          isUnfold: isFold('sensitive', router),
          children: [
            { title: 'menu.sensitive.config', name: 'sensitiveConfig' },
          ],
        },
        {
          title: 'menu.message.root',
          icon: 'cicon-book',
          isHidden: isHidenMenu(MENU_UID.SENTSIVE),
          isUnfold: isFold('sensitive', router),
          children: [
            { title: 'menu.message.conversations', name: 'ArguConversationList' },
          ],
        },
        {
          title: 'menu.analytics.root',
          icon: 'cicon-analysis',
          isHidden: isHidenMenu(MENU_UID.ANALYSE),
          isUnfold: isFold('Analysis', router),
          children: [
            { title: 'menu.analytics.userDaily', name: 'AnalysisUser' },
            { title: 'menu.analytics.messagePrivate', name: 'AnalysisMessage' },
            { title: 'menu.analytics.messageGroup', name: 'AnalysisGroup' },
            { title: 'menu.analytics.messageChatroom', name: 'AnalysisChatroom' },
          ],
        },
        {
          title: 'menu.logs.root',
          icon: 'cicon-logs',
          isHidden: isHidenMenu(MENU_UID.LOG),
          isUnfold: isFold('Logs', router),
          children: [
            { title: 'menu.logs.list', name: 'Logs' },
          ]
        }
      ]);
      if(isAdmin()){
        appMenus.push({
          title: 'menu.dev.root',
          icon: 'cicon-dev',
          isHidden: isHidenMenu(MENU_UID.DEV_TOOL),
          isUnfold: isFold('Tools', router),
          children: [
            { title: 'menu.dev.apiDebug', name: 'ToolsAPI' },
            { title: 'menu.dev.connectionInspect', name: 'ToolsConnection' },
          ]
        });
      }
      return appMenus;
    },
    getUsers: ({ router }) => {
      return [
        {
          title: 'menu.account.root',
          icon: 'cicon-user',
          isUnfold: isFold('User', router),
          children: [
            { title: 'menu.account.settings', name: 'UserSetting' },
            { title: 'menu.account.users', name: 'UserManader', isHidden: isHidenMenu(MENU_UID.USER_MANGER), },
          ],
        },
      ];
    },
  };

  function isFold(type, router) {
    if (utils.isUndefined(router)) {
      return false;
    }
    let {
      currentRoute: {
        _rawValue: { name },
      },
    } = router;
    return utils.isInclude(name, type);
  }

  function isAdmin(){
    let user = Storage.get(STORAGE.USER_TOKEN);
    let roleType = user.role_type;
    return utils.isEqual(roleType, USER_ROLE_TYPE.ADMIN);
  }
  function isHidenMenu(menuId){
    let user = Storage.get(STORAGE.USER_TOKEN);
    let roleId = user.role_id || 0;
    let role = ROLES.find((_role) => { return utils.isEqual(roleId, _role.value);}) || { menuIds: [] }
    let index = utils.find(role.menuIds, (_menuId) => {
      return utils.isEqual(menuId, _menuId);
    })
    return index == -1;
  }

  return {
    private: privateMenus,
  };
}

export default MenuFactory;
