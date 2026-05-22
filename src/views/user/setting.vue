<script setup>
import { reactive, getCurrentInstance } from 'vue';
import ModifyDialog from '../../components/dialog.vue';
import { STORAGE, ErrorType } from "../../common/enum";
import Storage from "../../common/storage";
import utils from '../../common/utils';
import { User } from "../../services";
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

let context = getCurrentInstance();
let state = reactive({
  isShowEdit: false,
  user: Storage.get(STORAGE.USER_TOKEN),
  pwd: '',
  newPwd: '',
  pwdErrorMsg: '',
  newPwdErrorMsg: ''
});

function onShowEdit(isShow){
  state.isShowEdit = isShow;
}
function onInput(name){
  let events = {
    pwd: () => {
      state.pwdErrorMsg = '';
    },
    newPwd: () => {
      state.newPwdErrorMsg = '';
    }
  };
  events[name]();
}
function onSave(){
  let { newPwd, pwd, user } = state;
  if(utils.isEmpty(pwd)){
    return state.pwdErrorMsg = t('accountSettings.validation.currentPasswordRequired');
  }
  if(utils.isEmpty(newPwd)){
    return state.newPwdErrorMsg = t('accountSettings.validation.newPasswordRequired');
  }
  User.updatePwd({
    account: user.account,
    password: pwd,
    new_password: newPwd
  }).then(({ code, msg }) => {
    if(utils.isEqual(code, ErrorType.SUCCESS_0.code)){
      onShowEdit(false);
      context.proxy.$toast({
        text: t('accountSettings.feedback.success'),
        icon: 'success'
      });
    }else if(utils.isEqual(code, ErrorType.USER_OLDPWD_WRONG.code)){
      state.newPwdErrorMsg = t(ErrorType.USER_OLDPWD_WRONG.key);
    }else{
      context.proxy.$toast({
        text: `${code}: ${msg}`,
        icon: 'error'
      });
    }
  });
}
</script>
<template>
  <PageSection title-key="menu.account.settings">
    <div class="cim-us-table">
      <div class="row cim-ab-row cim-us-row">
        <label class="col-sm-1 col-form-label">{{ t('accountSettings.field.accountName') }}</label>
        <div class="col-sm-2">
          <input class="form-control-plaintext" type="text" readonly :value="state.user.account">
        </div>
        <div class="col-sm-4">
          <!-- <a class="btn-link cim-btn-link" type="button" @click="onShowEdit(true)">修改</a> -->
        </div>
      </div>

      <div class="row cim-ab-row cim-us-row">
        <label class="col-sm-1 col-form-label">{{ t('accountSettings.field.accountPassword') }}</label>
        <div class="col-sm-2">
          <input class="form-control-plaintext" type="text" readonly value="**** ****">
        </div>
        <div class="col-sm-4">
          <a class="btn-link cim-btn-link" type="button" @click="onShowEdit(true)">{{ t('accountSettings.action.edit') }}</a>
        </div>
      </div>

      <!-- <div class="row cim-ab-row cim-us-row">
        <label class="col-sm-1 col-form-label">Registered At</label>
        <div class="col-sm-2">
          <input class="form-control-plaintext" type="text" readonly value="2024-01-01 18:09:20">
        </div>
        <div class="col-sm-4">
        </div>
      </div> -->
    </div>

    <ModifyDialog :show="state.isShowEdit" :title="t('accountSettings.dialog.title')" @hide="onShowEdit(false)" @save="onSave()">
      <div class="row g-2 cim-row">
          <div class="form-floating">
            <input class="form-control" :placeholder="t('accountSettings.field.accountName')" :value="state.user.account" disabled>
            <label>{{ t('accountSettings.field.accountName') }}</label>
          </div>
          <div class="form-floating">
            <input class="form-control" :placeholder="t('accountSettings.field.currentPassword')" v-model="state.pwd" @input="onInput('pwd')">
            <label>{{ t('accountSettings.field.currentPassword') }}</label>
            <div class="invalid-feedback feedback" v-if="state.pwdErrorMsg">{{ state.pwdErrorMsg }}</div>
          </div>
          <div class="form-floating">
            <input class="form-control" :placeholder="t('accountSettings.field.newPassword')" v-model="state.newPwd" @input="onInput('newPwd')">
            <label>{{ t('accountSettings.field.newPassword') }}</label>
            <div class="invalid-feedback feedback" v-if="state.newPwdErrorMsg">{{ state.newPwdErrorMsg }}</div>
          </div>
      </div>
    </ModifyDialog>
  </PageSection>
</template>
