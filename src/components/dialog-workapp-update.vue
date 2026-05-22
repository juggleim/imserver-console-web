<script setup>
import Dialog from './dialog.vue';
import { reactive, getCurrentInstance, watch } from 'vue';
import utils from '../common/utils';
import common from '../common/common';
import { RESPONSE } from '../common/enum';
import { useRouter } from "vue-router";
import Avatar from "./avatar.vue";
import { t } from '@/i18n';

const context = getCurrentInstance();
const props = defineProps(['title','text', 'show', 'item']);
const emit = defineEmits(['save', 'hide'])
let router = useRouter();

let state = reactive({
  app_id: '',
  app_name: '',
  app_icon: '',
  app_url: '',
  app_order: 1,
});

function onSave(){
  let { app_id, app_name, app_icon, app_url, app_order } = state;
  if(utils.isEqual(app_name.length, 0)){
    return context.proxy.$toast({ icon: 'error', text: t('appServices.worklist.validation.appNameRequired') });
  }
  if(utils.isEqual(app_icon.length, 0)){
    return context.proxy.$toast({ icon: 'error', text: t('appServices.worklist.validation.appIconRequired') });
  }
  if(utils.isEqual(app_url.length, 0)){
    return context.proxy.$toast({ icon: 'error', text: t('appServices.worklist.validation.appUrlRequired') });
  }
  emit('save', { app_id, app_name, app_icon, app_url, app_order });
}
function onHide(e){
  emit('hide', {});
}
function onFileAdd(e){
  e.target.parentElement.parentElement.children[0].click();
}
function onFileSelect(event) {
  const file = event.target.files[0];
  let { currentRoute: { _rawValue: { params: { app_key } } } } = router;
  common.uploadImage(app_key, file, (code, url) => {
    if(!RESPONSE.SUCCESS == code){
      return context.proxy.$toast({ icon: 'error', text: t('appServices.worklist.feedback.uploadError', { code }, `Upload Error: ${code}`) });
    }
    state.app_icon = url;
  });
}
watch(() => props.show, (val) => {
  if(!val){
    utils.extend(state, { app_name: '', app_url: '', app_icon: '', app_order: 1 });
  }
  if(val){
    utils.extend(state, {
      app_id: props.item.app_id || '',
      app_name: props.item.app_name || '',
      app_icon: props.item.app_icon || '',
      app_url: props.item.app_url || '',
      app_order: props.item.app_order || 1,
    })
  }
});
</script>

<template>
 <Dialog :title="props.title" :show="props.show" :btn-title="props.text" :cls="'cim-pull-dialog'" @hide="onHide" @save="onSave" >
    <div class="row g-2 cim-row cim-dialog-pull-row">
      <div class="form-floating cim-from-must cicon cicon-must">
        <input class="form-control" :placeholder="t('appServices.worklist.field.appName')" v-model="state.app_name">
        <label>{{ t('appServices.worklist.field.appName') }}</label>
      </div>
      <!-- <div class="form-floating cim-from-must cicon cicon-must">
        <input class="form-control" placeholder="应用图标" v-model="state.app_icon">
        <label>应用图标</label>
      </div> -->
      <div class="form-floating cim-from-must cicon cicon-must">
        <input type="file" style="display: none;" @change="onFileSelect" />
        <div class="cicon cim-form-add cim-upload form-control workinfo-avatar">
          <Avatar v-if="state.app_icon" :user-id="state.app_id" :name="state.app_name" :avatar="state.app_icon" :cls="'cim-small-avatar'"></Avatar>
          <div class="cicon cim-form-add cim-upload" @click="onFileAdd">{{ t('appServices.worklist.action.uploadIcon') }}</div>
        </div>
        <label>{{ t('appServices.worklist.field.appIcon') }}</label>
      </div>

      <div class="form-floating cim-from-must cicon cicon-must">
        <input class="form-control" :placeholder="t('appServices.worklist.field.appUrl')" v-model="state.app_url">
        <label>{{ t('appServices.worklist.field.appUrl') }}</label>
      </div>
      <div class="form-floating cim-from-must cicon cicon-must">
        <input class="form-control" type="number" :placeholder="t('appServices.worklist.field.appOrder')" v-model="state.app_order">
        <label>{{ t('appServices.worklist.field.appOrder') }}</label>
      </div>
    </div>
 </Dialog>
</template>
