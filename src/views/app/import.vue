<script setup>
import { reactive, getCurrentInstance } from 'vue';
import ModifyDialog from '../../components/dialog.vue';
import { ErrorType } from "../../common/enum";
import utils from '../../common/utils';
import { Application } from "../../services";
import { useRouter } from "vue-router";
import appTools from '../../common/app-tools';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

let context = getCurrentInstance();
let router = useRouter();

let defaltApp = {
  name: '',
  licenseKey: ''
}

let state = reactive({
  apps: [],
  isShowEdit: false,
  nameErrorMsg: '',
  licenseErrorMsg: '',
  app: utils.clone(defaltApp)
});

function onShowEdit(isShow){
  state.isShowEdit = isShow;
}

function onSave(){
  let { app } = state;
  if(utils.isEmpty(app.name)){
    return state.nameErrorMsg = t('appDialog.validation.nameRequired');
  }
  if(utils.isEmpty(app.licenseKey)){
    return state.licenseErrorMsg = t('appDialog.validation.licenseRequired');
  }

  Application.create(app).then(({ code, msg }) => {
    let icon = 'error', text = t('appDialog.feedback.importFailed', { code, msg }, `Import failed: ${code} ${msg}`);
    if(utils.isEqual(code, ErrorType.SUCCESS_0.code)){
      icon = 'success';
      text = t('appDialog.feedback.importSuccess');
      state.apps.push(app);
      state.app = utils.clone(defaltApp);
    }
    context.proxy.$toast({ icon, text, duration: 4000 });
  });
}

function getApps(){
  Application.getList().then(({ data: { items } }) => {
    let apps = items.map((item) => {
      item.created_time = utils.formatTime(item.created_time);
      item.ended_time = utils.formatTime(item.ended_time);
      item.cur_user_count = utils.numberWithCommas(item.cur_user_count)
      item.max_user_count = utils.numberWithCommas(item.max_user_count)
      return item;
    });
    state.apps = apps;
  });
}
getApps();
function onInput(){
  state.nameErrorMsg = '';
  state.licenseErrorMsg = '';
}
function onViewDetal(app){
  appTools.setCurrent(app);
  router.push({ name: 'ArguBase', params: { app_key: app.app_key } });
}
</script>
<template>
  <PageSection title-key="legacyPages.app.title.list">
    <template #actions>
      <div class="cicon cicon-add cim-button cim-button-bg" @click="onShowEdit(true)" @save="onSave()">{{ t('common.action.import') }}</div>
    </template>
    <table class="table cim-table">
      <thead>
        <tr>
          <th>{{ t('legacyPages.app.table.appName') }}</th>
          <th class="jd-td-c">{{ t('legacyPages.app.table.usedLicenseCount') }}</th>
          <th class="jd-td-c">{{ t('legacyPages.app.table.unusedLicenseCount') }}</th>
          <th class="jd-td-c">{{ t('legacyPages.app.table.expireTime') }}</th>
          <th class="jd-td-c">{{ t('legacyPages.app.table.createdTime') }}</th>
          <th>{{ t('legacyPages.app.table.operation') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in state.apps">
          <td>{{ app.app_name }}</td>
          <td class="jd-td-c">{{ app.cur_user_count }}</td>
          <td class="jd-td-c">{{ app.max_user_count }}</td>
          <td class="jd-td-c">{{ app.ended_time }}</td>
          <td class="jd-td-c">{{ app.created_time }}</td>
          <td>
            <!-- <a class="btn-link cim-btn-link" type="button" @click="onShowEdit(true)">修改</a> -->
            <a class="btn-link cim-btn-link" type="button" @click="onViewDetal(app)">{{ t('common.action.view') }}</a>
          </td>
        </tr>
      </tbody>
    </table>
    <ModifyDialog :show="state.isShowEdit" :title="t('appDialog.title.import')" @hide="onShowEdit(false)" @save="onSave()">
      <div class="row g-2 cim-row">
          <div class="form-floating">
            <input class="form-control" v-model="state.app.name" :placeholder="t('appDialog.field.appName')"  @input="onInput()">
            <label>{{ t('appDialog.field.appName') }}</label>
            <div class="invalid-feedback feedback" v-if="state.nameErrorMsg">{{ state.nameErrorMsg }}</div>
          </div>
          <div class="form-floating">
            <input class="form-control" v-model="state.app.licenseKey" placeholder="License Key"  @input="onInput()">
            <label>License Key</label>
            <div class="invalid-feedback feedback" v-if="state.licenseErrorMsg">{{ state.licenseErrorMsg }}</div>
          </div>
      </div>
    </ModifyDialog>
  </PageSection>
</template>
