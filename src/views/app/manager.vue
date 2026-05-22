<script setup>
import { reactive, getCurrentInstance } from 'vue';
import ModifyDialog from '../../components/dialog.vue';
import { ErrorType } from "../../common/enum";
import utils from '../../common/utils';
import { Application } from "../../services";
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

let context = getCurrentInstance();

let defaultApp = {
  name: '',
  count: 0
}

let state = reactive({
  apps: [],
  isShowEdit: false,
  licenses: [
    { value: 1, label: '0-200' },
    { value: 2, label: '200-500' },
    { value: 3, label: '500-1000' },
  ],
  app: utils.clone(defaultApp)
});

function onShowEdit(isShow){
  state.isShowEdit = isShow;
}

function onSave(){
  let app = { name: '', count: '' };
  Application.create(app).then(({ code, msg }) => {
    let icon = 'error', text = msg;
    if(utils.isEqual(code, ErrorType.SUCCESS_0.code)){
      icon = 'success';
      text = t('legacyPages.app.feedback.createSuccess');
      state.apps.push(app);
      state.app = utils.clone(defaultApp);
    }
    context.proxy.$toast({ icon, text, duration: 4000 });
  });
}

function getApps(){
  Application.getList().then(({ data: { items } }) => {
    let apps = items.map((item) => {
      item.created_time = utils.formatTime(item.created_time);
      item.ended_time = utils.formatTime(item.ended_time);
      item.user_count = utils.numberWithCommas(item.user_count)
      return item;
    });
    state.apps = apps;
  });
}
getApps();
</script>
<template>
  <PageSection title-key="legacyPages.app.title.list">
    <template #actions>
      <div class="cicon cicon-add cim-button cim-button-bg" @click="onShowEdit(true)" @save="onSave()">{{ t('common.action.create') }}</div>
    </template>
    <table class="table cim-table">
      <thead>
        <tr>
          <th scope="col">{{ t('legacyPages.app.table.appName') }}</th>
          <th scope="col">{{ t('legacyPages.app.table.licenseCount') }}</th>
          <th scope="col">{{ t('legacyPages.app.table.expireTime') }}</th>
          <th scope="col">{{ t('legacyPages.app.table.createdTime') }}</th>
          <th scope="col">{{ t('legacyPages.app.table.operation') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in state.apps">
          <td>{{ app.app_name }}</td>
          <td>{{ app.user_count }}</td>
          <td>{{ app.ended_time }}</td>
          <td>{{ app.created_time }}</td>
          <td>
            <!-- <a class="btn-link cim-btn-link" type="button" @click="onShowEdit(true)">修改</a> -->
            <a class="btn-link cim-btn-link" type="button" @click="">{{ t('common.action.view') }}</a>
          </td>
        </tr>
      </tbody>
    </table>
    <ModifyDialog :show="state.isShowEdit" :title="t('appDialog.title.create')" @hide="onShowEdit(false)">
      <div class="row g-2 cim-row">
          <div class="form-floating">
            <input class="form-control" :placeholder="t('appDialog.field.appName')">
            <label>{{ t('appDialog.field.appName') }}</label>
          </div>
          <div class="form-floating">
            <select class="form-select">
              <option :value="license.value" v-for="license in state.licenses">{{ license.label }}</option>
            </select>
            <label>{{ t('legacyPages.app.table.licenseCount') }}</label>
          </div>
      </div>
    </ModifyDialog>
  </PageSection>
</template>
