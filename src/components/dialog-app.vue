<script setup>
import ModifyDialog from './dialog.vue';
import { STORAGE, ErrorType, APP_TYPE, DIALOG_TYPE, EVENT_NAME } from "../common/enum";
import { reactive, watch, getCurrentInstance } from 'vue';
import utils from "../common/utils";
import Storage from '../common/storage';
import { Application } from "../services";
import emitter from '../common/emmit';
import { t } from '@/i18n';

const props = defineProps(['title', 'text']);
const emit = defineEmits(['hide'])
const context = getCurrentInstance();
let user = Storage.get(STORAGE.USER_TOKEN);

let state = reactive({
  nameError: '',
  licenseError: '',
  isShowNewEdit: false,
  name: '',
  license: '',
});

function onShowNewEdit(isShow){
  state.isShowNewEdit = isShow;
}
function onInput(){
  utils.extend(state, { nameError: '', licenseError: '' });
}

function onSave(){
  if(user.is_commercial){
    return importApp();
  }
  return createApp();
}

function createApp(){
  let { name } = state;
  if(utils.isEmpty(name)){
    return state.nameError = t('appDialog.validation.nameRequired');
  }
  Application.create({ name }).then(onCompleted);
}

function importApp(){
  let { license } = state;
  if(utils.isEmpty(license)){
    return state.licenseError = t('appDialog.validation.licenseRequired');
  }
  Application.importApp({ license }).then(onCompleted);
}

function onCompleted(result) {
  let { code, msg, data } = result;
  let { is_commercial } = user;
  let icon = 'error';
  let text = is_commercial
    ? t('appDialog.feedback.importFailed', { code, msg })
    : t('appDialog.feedback.createFailed', { code, msg });
  if (utils.isEqual(code, ErrorType.SUCCESS_0.code)) {
    icon = 'success';
    text = is_commercial ? t('appDialog.feedback.importSuccess') : t('appDialog.feedback.createSuccess');
    let { app_key, app_name, app_type } = data;
    let app = { app_key, app_name, app_type, kind_key: 'common.appType.private' };
    emitter.$emit(EVENT_NAME.CREATE_APP_FINISHED, app);
    onHide();
  }
  context.proxy.$toast({icon, text, duration: 4000});
}

function onHide(){
  utils.extend(state, { name: '', license: '' });
  emit('hide', {});
}

watch(() => props.isShow, (value) => {
});

</script>

<template>
  <ModifyDialog
    :cls="'cim-dialog-createapp'"
    :title="user.is_commercial ? t('appDialog.title.import') : t('appDialog.title.create')"
    @hide="onHide"
    @save="onSave"
  >
    <div class="row g-2 cim-row"v-if="user.is_commercial">
      <div class="form-floating cimfrom-floating">
        <input class="form-control" :placeholder="t('appDialog.field.licenseKey')" v-model="state.license" @input="onInput">
        <label>{{ t('appDialog.field.licenseKey') }}</label>
        <div class="invalid-feedback feedback" >{{ state.licenseError }}</div>
      </div>
    </div>
    <div class="row g-2 cim-row" v-else>
      <div class="form-floating cimfrom-floating">
        <input class="form-control" :placeholder="t('appDialog.field.appName')" v-model="state.name" @input="onInput">
        <label>{{ t('appDialog.field.appName') }}</label>
        <div class="invalid-feedback feedback" >{{ state.nameError }}</div>
      </div>
    </div>
  </ModifyDialog>
</template>
