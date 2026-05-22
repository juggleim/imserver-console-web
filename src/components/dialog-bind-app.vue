<script setup>
import Dialog from './dialog.vue';
import { reactive, watch, getCurrentInstance } from 'vue';
import utils from '../common/utils';
import { Application, User } from "../services/index";
import { t } from '@/i18n';

const context = getCurrentInstance();
const props = defineProps(['title','text', 'account', 'show']);
const emit = defineEmits(['save', 'hide'])

let state = reactive({
  appList: [],
  bandAppList: [],
  removeBindList: [],
});

async function onSave(){
  if(state.removeBindList.length > 0){
    await User.unBindApp({
      account: props.account,
      app_keys: state.removeBindList.map((item) => item.app_key)
    });
  }

  User.bindApp({
    account: props.account,
    app_keys: state.bandAppList.map((item) => item.app_key)
  }).then((res) => {
    context.proxy.$toast({ icon: 'success', text: t('userManager.feedback.bindSuccess') });
    emit('save', {});
  });
}
function onHide(e){
  emit('hide', {});
}
function onSelect(item, index){
  state.bandAppList.push(item);
  state.appList.splice(index, 1);
}
function onRemove(item, index){
  state.appList.push(item);
  state.bandAppList.splice(index, 1);
  if(item.isBind){
    state.removeBindList.push(item);
  }
}
async function getApps(){
  let res = await Application.getList();
  let appList = res.data.items || [];

  let bindRes = await Application.getList({ account: props.account });
  let bindAppList = bindRes.data.items || [];
  bindAppList = bindAppList.map((item) => {
    return { ...item, isBind: true };
  });

  state.appList = utils.filter(appList, (item) => {
    let index = utils.find(bindAppList, (bindItem) => {
      return bindItem.app_key == item.app_key;
    });
    return index == -1;
  });
  state.bandAppList = bindAppList;
}
watch(() => props.show,(val) => {
  if(val){
    getApps();
  }else{
    utils.extend(state, { appList: [], bandAppList: [], removeBindList: [] })
  }
});



</script>

<template>
 <Dialog :title="props.title" :show="props.show" :btn-title="props.text"  @hide="onHide" @save="onSave" :cls="'cim-dialog-bind-modal'">
    <div class="cim-dialog-bind-app">
      <div class="cim-dialog-bind-box left">
        <div class="bind-header">{{ t('userManager.bindDialog.availableApps') }}</div>
        <ul class="bind-apps">
          <li class="bind-app" v-for="(item, index) in state.appList">
            <div class="bind-app-info">
              <div class="bind-app-name">{{ item.app_name }}</div>
              <div class="bind-app-appkey">{{ item.app_key }}</div>
            </div>
            <div class="tools">
              <div class="tool">
                <span class="cicon cicon-add" @click="onSelect(item, index)"></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="cim-dialog-bind-box right">
        <div class="bind-header">{{ t('userManager.bindDialog.boundApps') }}</div>
        <ul class="bind-apps">
          <li class="bind-app" v-for="(item, index) in state.bandAppList">
            <div class="bind-app-info">
              <div class="bind-app-name">{{ item.app_name }}</div>
              <div class="bind-app-appkey">{{ item.app_key }}</div>
            </div>
            <div class="tools">
              <div class="tool">
                <span class="cicon cicon-close" @click="onRemove(item, index)"></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
 </Dialog>
</template>
