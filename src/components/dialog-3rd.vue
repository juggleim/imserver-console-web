<script setup>
import Dialog from './dialog.vue';
import { reactive, getCurrentInstance, watch } from 'vue';
import utils from '../common/utils';
import { R3D_USE_TYPE } from '../common/enum';
import { t } from '@/i18n';

const context = getCurrentInstance();
const props = defineProps(['show', 'title','channel', 'list', 'custom']);
const emit = defineEmits(['save', 'hide'])

let state = reactive({
  channelUid: utils.clone(props.channel.uid),
  channels: utils.clone(props.list),
  fields: []
});

function onSave(){
  let { fields, channelUid } = state;
  for(let i = 0; i < fields.length; i++){
    let filed = fields[i];
    if(utils.isEmpty(filed.value)){
      let fieldName = filed.displayLabelKey ? t(filed.displayLabelKey, {}, filed.name) : filed.name;
      return context.proxy.$toast({ icon: 'error', text: t('translateConfig.validation.required', { name: fieldName }) });
    }
    if(filed.type == 'text'){
      filed.value = filed.value.toString();
    }
  }
  emit('save', { uid: channelUid, fields: utils.clone(fields) });
}
function onHide(e){
  emit('hide', {});
}
function updateFileds(channel){
  let fields = utils.map(channel.children, (field) => {
    if(utils.isEqual(field.key, 'is_used')){
      field.value = props.channel.isUsed ? R3D_USE_TYPE.ENABLE : R3D_USE_TYPE.DISABLE;
    }
    return field;
  });
  utils.extend(state, { fields: utils.clone(fields), channelUid: channel.uid });
}
updateFileds(props.channel);

watch(() => props.show, () => {
  if(props.show){
    updateFileds(props.channel);
  }
});


</script>

<template>
 <Dialog :title="props.title" :show="props.show" :cls="'cim-r3d-dialog'" @hide="onHide" @save="onSave" >
    <div class="row g-2 cim-row">
      <div>
        <div class="form-floating">
          <select class="form-select" v-model="state.channelUid" :disabled="true">
            <option :value="item.uid" v-for="item in props.list" >{{ item.displayNameKey ? t(item.displayNameKey, {}, item.name) : item.name }}</option>
          </select>
          <label>{{ props.custom }}</label>
        </div>
      </div>
      <div v-for="field in state.fields">
        <div class="form-floating cim-from-must cicon cicon-must" v-if="field.type == 'text' || field.type == 'number'">
          <input class="form-control" placeholder="placeholder" :type="field.type" v-model="field.value">
          <label>{{ field.displayLabelKey ? t(field.displayLabelKey, {}, field.name) : field.name }}</label>
        </div>
        <div class="form-floating" v-if="field.type == 'select'">
          <select class="form-select" v-model="field.value">
            <option :value="child.value" v-for="child in field.children" >{{ child.displayLabelKey ? t(child.displayLabelKey, {}, child.label) : child.label }}</option>
          </select>
          <label>{{ field.displayLabelKey ? t(field.displayLabelKey, {}, field.name) : field.name }}</label>
        </div>
      </div>
      
    </div>
 </Dialog>
</template>
