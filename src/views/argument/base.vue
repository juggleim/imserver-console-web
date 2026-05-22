<script setup>
import { reactive } from 'vue';
import utils from '../../common/utils';
import { Application } from "../../services";
import { useRouter } from "vue-router";
import { t } from '@/i18n';

let router = useRouter();
let { currentRoute: { _rawValue: { params: { app_key } } } } = router;

let state = reactive({
  appInfo: {
    restricted_fields: {}
  },
  isShowSecret: false,
});

function fetchApp() {
  Application.getOne({ app_key }).then(({ data }) => {
    let { cur_user_count, max_user_count } = data;
    utils.formatProps(data, { count: 'num', time: 'date' })
    data.use_percent = Math.floor(cur_user_count / max_user_count) * 100;
    data.raw_expired_time = data.expired_time;
    data.expired_time = data.expired_time == -1 ? '' : utils.formatTime(data.expired_time);
    data.n_app_secret = '********************';
    utils.extend(state.appInfo, data);
  });
}
fetchApp();

function onShowSecret() {
  let isShowSecret = !state.isShowSecret;
  utils.extend(state, { isShowSecret })
}

function getExpireTimeLabel() {
  return state.appInfo.raw_expired_time == -1 ? t('common.label.unlimited') : state.appInfo.expired_time;
}

</script>
<template>
  <div class="mb-4 app-base cim-app-base-page">
    <div class="cim-app-base-card">
      <div class="cim-app-base-head">
        <h2 class="cim-app-base-title">{{ t('appBase.sectionTitle') }}</h2>
      </div>
      <div class="cim-app-base-divider"></div>
      <div class="cim-app-base-list">
        <div class="cim-app-base-item">
          <div class="cim-app-base-label">{{ t('appBase.field.appName') }}</div>
          <div class="cim-app-base-value">{{ state.appInfo.app_name }}</div>
        </div>
        <div class="cim-app-base-item">
          <div class="cim-app-base-label">{{ t('appBase.field.appKey') }}</div>
          <div class="cim-app-base-value">{{ state.appInfo.app_key }}</div>
        </div>
        <div class="cim-app-base-item">
          <div class="cim-app-base-label">{{ t('appBase.field.appSecret') }}</div>
          <div class="cim-app-base-value cim-app-base-secret">
            <span class="cim-secret-text">{{ state.isShowSecret ? state.appInfo.app_secret : state.appInfo.n_app_secret }}</span>
            <button type="button" class="cim-secret-btn" @click="onShowSecret">
              <span class="cicon cicon-hide"></span>
            </button>
          </div>
        </div>
        <div class="cim-app-base-item">
          <div class="cim-app-base-label">{{ t('appBase.field.expireTime') }}</div>
          <div class="cim-app-base-value">{{ getExpireTimeLabel() }}</div>
        </div>
        <div class="cim-app-base-item">
          <div class="cim-app-base-label">{{ t('appBase.field.licenseCount') }}</div>
          <div class="cim-app-base-value">
            {{ state.appInfo.n_max_user_count == -1 ? t('common.label.unlimited') : state.appInfo.n_max_user_count }}
          </div>
        </div>
        <div class="cim-app-base-item">
          <div class="cim-app-base-label">{{ t('appBase.field.status') }}</div>
          <div class="cim-app-base-value">{{ t('appBase.status.online') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
