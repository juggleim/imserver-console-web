<script setup>
import { reactive, getCurrentInstance } from 'vue';
import ModifyDialog from '../../components/dialog.vue';
import BindAppDialog from '../../components/dialog-bind-app.vue';
import { USER_STATE, ErrorType, ROLES, USER_ROLE_TYPE } from "../../common/enum";
import utils from '../../common/utils';
import { User } from "../../services";
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

let context = getCurrentInstance();
let defaltUser = {
  account: '',
  password: '',
  confirmPasswrod: '',
  state: USER_STATE.ENABLE,
  role: USER_ROLE_TYPE.ADMIN
}
let state = reactive({
  users: [],
  roles: utils.clone(ROLES),
  radios: [
    { name: 'type', value: USER_STATE.ENABLE, label: 'Enable', labelKey: 'userManager.action.enable' },
    { name: 'type', value: USER_STATE.DISABLE, label: 'Disable', labelKey: 'userManager.action.disable' },
  ],
  isShowEdit: false,
  user: utils.clone(defaltUser),

  accountErrorMsg: '',
  pwdErrorMsg: '',
  conPwdErrorMsg: '',

  isShowBindApp: false,
  selectUser: {},
});

User.getUsers().then(({ data }) => {
  let { items } = data;
  state.users = items.map((item) => {
    item.time = utils.formatTime(item.created_time)
    return item;
  })
});
function onShowEdit(isShow, user) {
  state.isShowEdit = isShow;
  if(user){
    state.user = user;
  }
  if(!isShow){
    state.user = utils.clone(defaltUser);
  }
}
function onShowBindApp(isShow, user){
  state.isShowBindApp = isShow;
  state.selectUser = isShow ? user : {};
}
function onRadieChanged(type){
  state.user.state = type;
}
function onOperate(user){
  let userState;
  if(utils.isEqual(user.state, USER_STATE.ENABLE)){
    userState = USER_STATE.DISABLE;
  }
  if(utils.isEqual(user.state, USER_STATE.DISABLE)){
    userState = USER_STATE.ENABLE;
  }
  User.disable({ 
    accounts: [user.account],
    is_disable: userState
  }).then(() => {
    state.users.map((_user) => {
      if(utils.isEqual(user.account, _user.account)){
        utils.extend(_user, { state: userState });
      }
      return _user;
    });
    context.proxy.$toast({
      icon: 'success',
      text: t('userManager.feedback.operateSuccess'),
      duration: 4000
    })
  })
}
function onDelete(index){
  let user = state.users[index];
  User.remove({ accounts: [user.account] }).then(() => {
    state.users.splice(index, 1);
    context.proxy.$toast({
      icon: 'success',
      text: t('userManager.feedback.deleteSuccess'),
      duration: 4000
    });
  });
}
function onSave(){
  let { user } = state;
  let { account, password, confirmPasswrod, role } = user;
  if(utils.isEmpty(account)){
    return state.accountErrorMsg = t('userManager.validation.accountRequired');
  }
  if(utils.isEmpty(password)){
    return state.pwdErrorMsg = t('userManager.validation.passwordRequired');
  }
  if(!utils.isEqual(confirmPasswrod, password)){
    return state.conPwdErrorMsg = t('userManager.validation.passwordMismatch');
  }
  if(user.created_time){
    return User.updatePwd({
      account: account,
      password: password,
      new_password: confirmPasswrod,
      role_type: role,
    }).then(({ code, msg }) => {
      if(utils.isEqual(code, ErrorType.SUCCESS_0.code)){
        context.proxy.$toast({
          icon: 'success',
          text: t('userManager.feedback.passwordUpdated'),
          duration: 3000
        });
      }else{
        context.proxy.$toast({
          icon: 'error',
          text: `${code}:${msg}`,
          duration: 3000
        });
      }
    });
  }
  User.add({ account, password, state: user.state, role_type: role }).then(({ code }) => {
    let icon = 'success', text = t('userManager.feedback.saveSuccess');
    if(utils.isEqual(code, ErrorType.SUCCESS_0.code)){
      user.time = utils.formatTime(Date.now());
      state.users.push(user);
      onShowEdit(false);
    }else if(utils.isEqual(code, ErrorType.USER_EXISTS.code)){
      icon = 'error';
      text = t(ErrorType.USER_EXISTS.key);
    }else{
      icon = 'error';
      text = t('userManager.feedback.saveFailed');
    }
    context.proxy.$toast({
      icon,
      text,
      duration: 4000
    });
  });
}
function onInput(name){
  let events = {
    account: () => {
      state.accountErrorMsg = '';
    },
    pwd: () => {
      state.pwdErrorMsg = '';
    },
    confirm: () => {
      state.conPwdErrorMsg = '';
    }
  };
  events[name]();
}
function onBindApp(){
  let { selectUser } = state;
  onShowBindApp(false, {});
}
</script>
<template>
  <PageSection title-key="menu.account.users">
    <template #actions>
      <div class="cicon cicon-add cim-button cim-button-bg" @click="onShowEdit(true)">{{ t('userManager.action.addUser') }}</div>
    </template>
    <table class="table cim-table">
      <thead>
        <tr>
          <th>{{ t('userManager.table.account') }}</th>
          <th>{{ t('userManager.table.role') }}</th>
          <th>{{ t('userManager.table.password') }}</th>
          <th>{{ t('userManager.table.status') }}</th>
          <th>{{ t('userManager.table.createdTime') }}</th>
          <th class="cim-td-c">{{ t('userManager.table.operation') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in state.users">
          <td>{{ user.account }}</td>
          <td>{{ user.role_type == USER_ROLE_TYPE.ADMIN ? t('userManager.role.admin') : t('userManager.role.user') }}</td>
          <td>**** ****</td>
          <td class="cicon" :class="{ 'cicon-success': user.state == USER_STATE.ENABLE, 'cicon-error': user.state == USER_STATE.DISABLE }">
            {{ user.state == USER_STATE.ENABLE ? t('common.status.enabled') : t('common.status.disabled') }}
          </td>
          <td>{{ user.time }}</td>
          <td class="cim-td-c cim-td-operate">
            <a class="btn-link cim-btn-link" type="button" v-if="user.role_type == USER_ROLE_TYPE.USER"  @click="onShowBindApp(true, user)">{{ t('userManager.action.bindApp') }}</a>
            <!-- <a class="btn-link cim-btn-link" type="button" @click="onShowEdit(true, user)">修改</a> -->
            <a class="btn-link cim-btn-link" type="button" v-if="user.role_type == USER_ROLE_TYPE.USER" @click="onOperate(user)">{{ user.state == USER_STATE.DISABLE ? t('userManager.action.enable') : t('userManager.action.disable')}}</a>
            <a class="btn-link cim-btn-link" type="button" v-if="user.role_type == USER_ROLE_TYPE.USER" @click="onDelete(index)">{{ t('userManager.action.delete') }}</a>
          </td>
        </tr>
      </tbody>
    </table>
    <ModifyDialog :show="state.isShowEdit" :title="t('userManager.dialog.title')" @hide="onShowEdit(false)" @save="onSave()">
      <div class="row g-2 cim-row">
        <div class="form-floating">
          <input class="form-control" :disabled="state.user.created_time" v-model="state.user.account" type="text" :placeholder="t('userManager.field.account')" autocomplete="off"  @input="onInput('account')">
          <label>{{ t('userManager.field.account') }}</label>
          <div class="invalid-feedback feedback" v-if="state.accountErrorMsg">{{ state.accountErrorMsg }}</div>
        </div>
        <div class="form-floating">
          <input class="form-control" v-model="state.user.password" type="text" :placeholder="t('userManager.field.password')" @input="onInput('pwd')">
          <label>{{ t('userManager.field.password') }}</label>
          <div class="invalid-feedback feedback" v-if="state.pwdErrorMsg">{{ state.pwdErrorMsg }}</div>
        </div>
        <div class="form-floating">
          <input class="form-control" v-model="state.user.confirmPasswrod" type="text" :placeholder="t('userManager.field.confirmPassword')" @input="onInput('confirm')">
          <label>{{ t('userManager.field.confirmPassword') }}</label>
          <div class="invalid-feedback feedback" v-if="state.conPwdErrorMsg">{{ state.conPwdErrorMsg }}</div>
        </div>
        <div class="form-floating">
          <select class="form-select" v-model="state.user.role">
            <option :value="item.value" v-for="item in state.roles" >{{ item.labelKey ? t(item.labelKey, {}, item.name) : item.name }}</option>
          </select>
          <label>{{ t('userManager.field.userRole') }}</label>
        </div>
        <!-- <div class="form-floating">
          <div class="form-control">
            <div class="form-check form-check-inline" v-for="radio in state.radios">
              <input class="form-check-input" type="radio" name="radio.name" :value="radio.value"
                v-model="state.user.state" @change="onRadieChanged(radio.value)">
              <label class="form-check-label">{{ radio.label }}</label>
            </div>
          </div>
          <label>Enabled</label>
        </div> -->
        <input type="password" autocomplete="new-password" style="display: none;" />
      </div>
    </ModifyDialog>

    <BindAppDialog :show="state.isShowBindApp" :title="t('userManager.dialog.bindTitle')" :account="state.selectUser.account" @hide="onShowBindApp(false)" @save="onBindApp()"></BindAppDialog>
  </PageSection>
</template>
