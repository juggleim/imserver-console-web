<script setup>
import { reactive, getCurrentInstance } from 'vue';
import utils from '../../common/utils';
import DialogWorkappUpdate from '../../components/dialog-workapp-update.vue';
import { useRouter } from "vue-router";
import { WorkManager } from "../../services";
import { ErrorType, STORAGE, RESPONSE, LOG_PULL_STATUS, PLATFORMAS } from '../../common/enum';
import Storage from "../../common/storage";
import Avatar from "../../components/avatar.vue";
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

const context = getCurrentInstance();
let router = useRouter();
let { currentRoute: { _rawValue: { params: { app_key } } } } = router;
let defaultParams = {
  offset: '',
  limit: 50,
  
};
let state = reactive({
  isShowUpdate: false,
  currentApp: {},
  params: utils.clone(defaultParams),
  list: [],
});
function onShowUpdate(isShow){
  state.isShowUpdate = isShow;
  if(!isShow){
    state.currentApp = {};
  }
}
function onUpdate(data){
  let { app_id } = data;
  if(utils.isEmpty(app_id)){
    WorkManager.add({ app_key, ...data }).then((result) => {
      let { code, msg, data } = result;
      if(utils.isEqual(code, RESPONSE.SUCCESS)){
        onShowUpdate(false);
        state.list.push(data);
        state.list = utils.quickSort(state.list, (item, pivot) => {
          return item.app_order < pivot.app_order;
        });
      }else{
        context.proxy.$toast({ icon: 'error', text: t('common.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`) });
      }
    });
    return;
  }
  WorkManager.update({ app_key, ...data }).then((result) => {
    let { code, msg } = result;
    if(utils.isEqual(code, RESPONSE.SUCCESS)){
      onShowUpdate(false);
      let index = utils.find(state.list, (item) => {
        return item.app_id == app_id;
      });
      if(index > -1){
        utils.extend(state.list[index], data);
      }
      state.list = utils.quickSort(state.list, (item, pivot) => {
        return item.app_order < pivot.app_order;
      });
    }else{
      context.proxy.$toast({ icon: 'error', text: t('common.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`) });
    }
  });
  
}
function onAddApp(){
  onShowUpdate(true);
}
function onModify(item){
  state.currentApp = item;
  onShowUpdate(true);
}
function onRemove(index){
  let item = state.list[index];
  WorkManager.remove({ app_key, app_ids: [item.app_id] }).then((result) => {
    let { code, msg } = result;
    if(utils.isEqual(code, RESPONSE.SUCCESS)){
      state.list.splice(index, 1);
    }else{
      context.proxy.$toast({ icon: 'error', text: t('common.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`) });
    }
  });
  
}
function getTitle(){
  return utils.isEmpty(state.currentApp) ?  t('appServices.worklist.title.addApp') : t('appServices.worklist.title.editApp');
}
function getAppList(){
  WorkManager.getList({ app_key }).then((result) => {
    let { code, data, msg = '' } = result;
    if(utils.isEqual(code, RESPONSE.SUCCESS)){
      let { items } = data;
      state.list = items;
    }else{
      context.proxy.$toast({ icon: 'error', text: t('common.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`) });
    }
  });
}
getAppList();

</script>
<template>
   <PageSection title-key="menu.app.workbenchSettings" body-class="cim-log-contanier">
    <template #actions>
      <div class="cim-button cim-button-bg" @click="onAddApp">{{ t('appServices.worklist.title.addApp') }}</div>
    </template>
    <div class="cim-worklist-body">
      <div class="cim-worklist-preview-box">
        <div class="header">{{ t('appServices.worklist.section.preview') }}</div>
        <div class="preview-body">
          <div class="iphone">
            <ul class="cim-ul-list">
              <li class="cim-li-item" v-for="item in state.list">
                <div class="cim-workinfo-item">
                  <Avatar :user-id="item.app_id" :name="item.app_name" :avatar="item.app_icon" :cls="'cim-small-avatar'"></Avatar>
                  <div class="nickname">{{ item.app_name }}</div>
                </div>
                <div class="cicon cicon-right-arrow"></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="cim-worklist-data-box">
        <table class="table cim-table">
          <thead>
            <tr>
              <th class="cim-td-c">{{ t('appServices.worklist.table.appInfo') }}</th>
              <th class="cim-td-c">{{ t('appServices.worklist.table.appUrl') }}</th>
              <th class="cim-td-c">{{ t('appServices.worklist.table.appOrder') }}</th>
              <th class="cim-td-c">{{ t('appServices.worklist.table.operation') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in state.list">
              <td class="cim-td-c cim-workinfo">
                <div class="cim-workinfo-item">
                  <Avatar :user-id="item.app_id" :name="item.app_name" :avatar="item.app_icon" :cls="'cim-small-avatar'"></Avatar>
                  <div class="nickname">{{ item.app_name }}</div>
                </div>
              </td>
              <td class="cim-td-c">
                <a :href="item.app_url" target="_blank">{{ item.app_url }}</a>
              </td>
              <td class="cim-td-c">{{ item.app_order }}</td>
              <td class="cim-td-c">
                <ul class="cim-table-tools">
                  <li class="cim-table-tool">
                    <a class="btn-link" href="#" @click="onModify(item)">{{ t('common.action.edit') }}</a>
                    <a class="btn-link" href="#" @click="onRemove(index)">{{ t('common.action.delete') }}</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
    <DialogWorkappUpdate :show="state.isShowUpdate" :item="state.currentApp" :title="getTitle()" :text="t('common.action.confirm')" @hide="onShowUpdate(false)" @save="onUpdate"></DialogWorkappUpdate>
  </PageSection>
</template>
