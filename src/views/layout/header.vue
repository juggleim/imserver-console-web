<script setup>
import {useRouter} from "vue-router";
import { getCurrentInstance, reactive, watch, nextTick } from 'vue';
import utils from "../../common/utils";
import Storage from "../../common/storage";
import {APP_TYPE, DEPLOY_TYPE, ErrorType, EVENT_NAME, STORAGE, USER_ROLE_TYPE} from "../../common/enum";
import menuTools from '../layout/menu-tools';
import appTools from '../../common/app-tools';
import emitter from '../../common/emmit';
import CreateDialog from '../../components/dialog-app.vue';
import LangSwitcher from '@/components/lang-switcher.vue';
import { useI18n } from '@/i18n';
import BaseDropdown from '@/components/base-dropdown.vue';

const context = getCurrentInstance();
const router = useRouter();
const { t } = useI18n();

let currentUser = Storage.get(STORAGE.USER_TOKEN);
let defaultApp = {app_name: '', kind: '', kind_key: ''};
let defaultNewApp = {name: '', licenseKey: ''}
let state = reactive({
  isPublic: utils.isEqual(currentUser.type, DEPLOY_TYPE.PUBLIC),
  isAdmin: utils.isEqual(currentUser.role_type, USER_ROLE_TYPE.ADMIN),
  isCollapse: false,
  isShowSetting: false,
  isShowDropdwonMenu: false,
  breadcumbs: [],
  showHeaderApps: false,
  apps: [],
  currentApp: utils.clone(defaultApp),

  newApp: utils.clone(defaultNewApp),
  isShowNewEdit: false,
  newAppNameErrorMsg: '',
  licenses: [
    {value: 1, label: '0-200'},
    {value: 2, label: '200-500'},
    {value: 3, label: '500-1000'},
  ],
});
const props = defineProps(['path']);
const emit = defineEmits(['collapse'])

function onClick() {
  state.isCollapse = !state.isCollapse;
  if (utils.isMobile()) {
    state.isCollapse = true;
  }
  emit('collapse', state.isCollapse);
}

function onSetting() {
  state.isShowSetting = !state.isShowSetting;
}

function getAppName(app) {
  return app.app_name || t('common.header.selectApp');
}

function getAppKind(app) {
  if (app.kind_key) {
    return t(app.kind_key);
  }
  return app.kind || '';
}

function getCreateActionLabel() {
  return currentUser.is_commercial ? t('common.action.import') : t('common.action.create');
}

let onNavigate = (name) => {
  if (utils.isEqual(name, 'Login')) {
    Storage.remove(STORAGE.USER_TOKEN);
  }
  appTools.setCurrent(utils.clone(defaultApp))
  router.push({name});
}

let useRouterCurrent = reactive(router);

watch(useRouterCurrent, (n) => {
  let {currentRoute: {meta: {titles}, name}} = n;
  let current = appTools.getCurrent();
  if (utils.isEqual(name, 'Dashboard')) {
    current = utils.clone(defaultApp);
  }
  utils.extend(state, {
    breadcumbs: titles,
    currentApp: current
  });
});

let appsOffset = '';
let appHasMore = true;
appTools.fetch({ offset: appsOffset }, ({ apps, offset }) => {
  state.apps = apps;
  appsOffset = offset;
  let {currentRoute: {_rawValue: {params: {app_key}}}} = router;
  let app = apps.filter((app) => {
    return utils.isEqual(app.app_key, app_key);
  })[0] || {};
  let current = utils.isEmpty(app) ? utils.clone(defaultApp) : app;
  let isFirst = true;
  onDropclick(current, isFirst);
})

function onDropclick(app, isFirst) {
  if (!isFirst) {
    menuTools.goBasePage(app);
  }
  appTools.setCurrent(utils.clone(app));
  utils.extend(state.currentApp, appTools.getCurrent())
  state.isShowDropdwonMenu = false;
}

function onHomePage() {
  menuTools.goHomePage(router);
}

function onHideDropmenu() {
  utils.extend(state, {
    isShowDropdwonMenu: false,
    isShowSetting: false
  });
}

function onShowNewEdit(isShow) {
  utils.extend(state, { isShowNewEdit: isShow, isShowDropdwonMenu: false });
}

emitter.$on(EVENT_NAME.CREATE_APP_FINISHED, (app) => {
  let index = utils.find(state.apps, (_app) => {
    return utils.isEqual(_app.app_key, app.app_key);
  });
  if(index == -1){
    state.apps.unshift(app);
  }
  appTools.setCurrent(utils.clone(app));
  utils.extend(state.currentApp, appTools.getCurrent())
  menuTools.goBasePage(app);
});

emitter.$on(EVENT_NAME.CREATE_APP, () => {
  onShowNewEdit(true);
});
emitter.$on(EVENT_NAME.ON_LOGOUT, () => {
  router.push({ name: 'Login' });
});
let canscroll = true;
nextTick(() => {
  let { appList } = context.refs;
  if(!appList){
    return;
  }
  appList.addEventListener("scroll", () => {
    let scrollTop = appList.scrollTop;
    let scrollHeight = appList.scrollHeight;
    let rectHeight = appList.getBoundingClientRect().height;
    let isNeedLoad = scrollHeight - scrollTop - rectHeight < 100;
    if (isNeedLoad && canscroll) {
      if(!appHasMore){
        return;
      }
      canscroll = false;
      appTools.fetch({ offset: appsOffset }, ({ apps, offset, has_more }) => {
        appsOffset = offset;
        appHasMore = has_more;
        utils.forEach(apps, (app) => {
          state.apps.push(app);
        });
        canscroll = true;
      })
    }
  });
});

</script>
<template>
  <header class="cim-topbar">
    <div class="cim-topbar-inner">
      <div class="cim-topbar-brand" @click="onHomePage()">
        <span class="cim-topbar-title">{{ t('common.header.brand') }}</span>
      </div>

      <BaseDropdown
        root-class="cim-topbar-app"
        menu-class="cim-topbar-appmenu"
        v-model="state.isShowDropdwonMenu"
      >
        <template #trigger="{ toggle }">
          <button class="cim-topbar-apptrigger" type="button" @click="toggle">
            <span class="cim-topbar-appsummary">
              {{ getAppName(state.currentApp) }}
              <template v-if="getAppKind(state.currentApp)">
                {{ ` ${getAppKind(state.currentApp)}` }}
              </template>
            </span>
            <span class="cim-topbar-arrow" aria-hidden="true"></span>
          </button>
        </template>
        <template #menu="{ close }">
          <div class="cim-topbar-appmenu-inner" ref="appList">
            <div class="cim-topbar-appmenu-create" v-if="state.isAdmin">
              <button class="cim-topbar-create" type="button" @click="onShowNewEdit(true); close();">
                {{ getCreateActionLabel() }}
              </button>
            </div>

            <ul class="cim-topbar-appitems">
              <li
                class="cim-topbar-appitem"
                v-for="app in state.apps"
                :key="app.app_key"
                @click.stop="onDropclick(app); close();"
              >
                <div class="cim-topbar-appitem-name">{{ app.app_name }}</div>
                <div
                  class="cim-topbar-appitem-kind"
                  :class="{ 'is-private': utils.isEqual(app.app_type, APP_TYPE.PRIVATE) }"
                >
                  {{ getAppKind(app) }}
                </div>
              </li>
            </ul>
          </div>
        </template>
      </BaseDropdown>

      <div class="cim-topbar-actions">
        <button class="cim-topbar-doc" type="button" @click="onNavigate('OrderList')">
          {{ t('common.header.docs') }}
        </button>

        <LangSwitcher
          wrapper-class="cim-topbar-lang"
          class-name="cim-topbar-lang-trigger"
        />

        <BaseDropdown
          align="right"
          root-class="cim-topbar-user"
          menu-class="cim-topbar-usermenu"
          v-model="state.isShowSetting"
        >
          <template #trigger="{ toggle }">
            <button class="cim-topbar-avatar" type="button" @click="toggle">
              <img class="cim-topbar-avatar-img" src="../../assets/images/header/avatar.png" alt="avatar">
            </button>
          </template>
          <template #menu="{ close }">
            <button
              class="cim-topbar-useritem is-setting"
              type="button"
              v-if="state.isAdmin"
              @click="onNavigate('UserSetting'); close();"
            >
              {{ t('common.header.accountSettings') }}
            </button>
            <button class="cim-topbar-useritem is-logout" type="button" @click="onNavigate('Login'); close();">
              {{ t('common.header.logout') }}
            </button>
          </template>
        </BaseDropdown>
      </div>
    </div>
  </header>
  <CreateDialog :show="state.isShowNewEdit" @hide="onShowNewEdit(false)"></CreateDialog>
</template>
