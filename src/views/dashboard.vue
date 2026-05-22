<script setup>
import { reactive, getCurrentInstance, nextTick } from 'vue';
import { APP_TYPE, APP_STATUS, EVENT_NAME, ErrorType, STORAGE, USER_ROLE_TYPE } from "../common/enum";
import utils from '../common/utils';
import { Application } from "../services";
import menuTools from './layout/menu-tools';
import appTools from '../common/app-tools';
import emitter from '../common/emmit';
import Storage from '../common/storage';
import { t } from '@/i18n';

const context = getCurrentInstance();
let currentUser = Storage.get(STORAGE.USER_TOKEN);

let state = reactive({
  apps: [ ],
});
function onCopyAppKey(appkey) {
  if (!appkey) {
    return;
  }
  const text = String(appkey);

  async function tryCopy() {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  }

  function fallbackCopy() {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', 'true');
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    el.style.top = '-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  }

  tryCopy()
    .then((ok) => ok || fallbackCopy())
    .then((ok) => {
      context.proxy.$toast({
        icon: ok ? 'success' : 'warn',
        text: ok ? t('common.feedback.copySuccess') : t('common.feedback.copyFailed'),
      });
    })
    .catch(() => {
      context.proxy.$toast({ icon: 'warn', text: t('common.feedback.copyFailed') });
    });
}
let dashboardApp = {
  offset: '',
  has_more: true,
  isAdmin: currentUser.role_type == USER_ROLE_TYPE.ADMIN,
};
function getApps(isFirst, callback = utils.noop){
  if(!dashboardApp.has_more){
    callback();
    return context.proxy.$toast({ icon: 'warn', text: t('common.feedback.noMore') });
  }
  Application.getList({ offset: dashboardApp.offset }).then(({ code, data }) => {
    let error = ErrorType.USER_TOKEN_EXPIRE;
    if(utils.isEqual(code, error.code)){
      context.proxy.$toast({ icon: 'error', text: error.msg });
      return menuTools.goLoginPage();
    }
    let { items, offset, has_more } = data;
    utils.extend(dashboardApp, { offset, has_more });

    let apps = items.map((item) => {
      item.raw_ended_time = item.ended_time;
      item.created_time = utils.formatTime(item.created_time);
      item.ended_time = item.ended_time == -1 ? '' : utils.formatTime(item.ended_time);
      item.cur_user_count = utils.numberWithCommas(item.cur_user_count);
      item.max_user_count = utils.numberWithCommas(item.max_user_count);
      item.kind_key = utils.isEqual(item.app_type, APP_TYPE.PRIVATE) ? 'common.appType.private' : 'common.appType.public';
      return item;
    });
    if(isFirst){
      state.apps = apps;
    }else{
      utils.forEach(apps, (app) => {
        state.apps.push(app);
      })
    }
    callback();
  });
}
getApps(true);

function getCreateActionLabel() {
  return currentUser.is_commercial ? t('common.action.import') : t('common.action.create');
}

function getExpireTimeLabel(app) {
  return app.raw_ended_time == -1 ? t('common.label.unlimited') : app.ended_time;
}

function onViewDetail(app){
  appTools.setCurrent(app);
  menuTools.goBasePage(app);
}
function onCreateApp(){
  emitter.$emit(EVENT_NAME.CREATE_APP);
}

function getAppStatusValue(app) {
  const raw = app?.app_status ?? app?.status ?? app?.appStatus;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : APP_STATUS.NORMAL;
}

function getAppStatusLabel(app) {
  const status = getAppStatusValue(app);
  if (status === APP_STATUS.ONLINE) {
    return t('dashboard.status.online');
  }
  if (status === APP_STATUS.BLOCKED) {
    return t('dashboard.status.blocked');
  }
  return t('dashboard.status.normal');
}

function getAppStatusClass(app) {
  const status = getAppStatusValue(app);
  if (status === APP_STATUS.ONLINE) {
    return 'is-online';
  }
  if (status === APP_STATUS.BLOCKED) {
    return 'is-blocked';
  }
  return 'is-normal';
}

let canscroll = true;
nextTick(() => {
  let { dashApps } = context.refs;
  dashApps.addEventListener("scroll", () => {
    let scrollTop = dashApps.scrollTop;
    let scrollHeight = dashApps.scrollHeight;
    let rectHeight = dashApps.getBoundingClientRect().height;
    let isNeedLoad = scrollHeight - scrollTop - rectHeight < 50;
    if (isNeedLoad && canscroll) {
      canscroll = false;
      getApps(false, () => {
        canscroll = true;
      });
    }
  });
});


</script>
<template>
  <div class="card-body cim-db-page">
    <div class="cim-db-grid" ref="dashApps">
      <div
        class="cim-db-card cim-db-card--create"
        v-if="dashboardApp.isAdmin"
        @click="onCreateApp"
      >
        <div class="cim-db-card-header">
          <div class="cim-db-card-title">{{ getCreateActionLabel() }}</div>
        </div>
        <div class="cim-db-card-body cim-db-create-body" aria-hidden="true">
          <span class="cim-db-create-icon cicon cicon-add"></span>
        </div>
      </div>

      <div class="cim-db-card" v-for="app in state.apps" :key="app.app_key">
        <div class="cim-db-card-header">
          <div class="cim-db-card-title">{{ app.app_name || app.name }}</div>
        </div>

        <div class="cim-db-card-body">
          <div class="cim-db-row">
            <div class="cim-db-left">{{ t('common.label.appName') }}</div>
            <div class="cim-db-right">{{ app.app_name || app.name }}</div>
          </div>

          <div class="cim-db-row">
            <div class="cim-db-left">{{ t('common.label.appKey') }}</div>
            <div class="cim-db-right">
              <span class="cim-db-mono">{{ app.app_key }}</span>
              <button class="cim-db-copy" type="button" @click="onCopyAppKey(app.app_key)"></button>
            </div>
          </div>

          <div class="cim-db-row">
            <div class="cim-db-left">{{ t('common.label.createdTime') }}</div>
            <div class="cim-db-right">{{ app.created_time }}</div>
          </div>

          <div class="cim-db-row">
            <div class="cim-db-left">{{ t('common.label.expireTime') }}</div>
            <div class="cim-db-right">{{ getExpireTimeLabel(app) }}</div>
          </div>

          <div class="cim-db-row">
            <div class="cim-db-left">{{ t('common.label.deploymentType') }}</div>
            <div class="cim-db-right">
              <span class="cim-db-pill" :class="{ 'is-private': utils.isEqual(app.app_type, APP_TYPE.PRIVATE) }">
                {{ t(app.kind_key) }}
              </span>
            </div>
          </div>

          <div class="cim-db-row">
            <div class="cim-db-left">{{ t('dashboard.field.appStatus') }}</div>
            <div class="cim-db-right">
              <span class="cim-db-status" :class="getAppStatusClass(app)">
                {{ getAppStatusLabel(app) }}
              </span>
            </div>
          </div>

          <div class="cim-db-row">
            <div class="cim-db-left">{{ t('common.label.maxUsers') }}</div>
            <div class="cim-db-right">{{ app.max_user_count == -1 ? t('common.label.unlimited') : app.max_user_count}}</div>
          </div>
        </div>

        <div class="cim-db-card-footer">
          <button class="cim-db-detail" type="button" @click="onViewDetail(app)">{{ t('common.action.viewDetails') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
