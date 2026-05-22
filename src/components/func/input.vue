<script setup>
const props = defineProps(['item']);
const emit = defineEmits(['save'])
import { reactive, watch } from 'vue';
import utils from '../../common/utils';
import { t } from '@/i18n';
let state = reactive({
  value: Number(props.item.value)
});

function onSave(){
  let { id } = props.item;
  let { value } = state;
  emit('save', { id, value });
}
watch(() => props.item.value, (value) => {
  let val = Number(value);
  if(val > 0){
    utils.extend(state, { value: val });
  }
})
</script>

<template>
   <div class="cim-sw-form">
    <div class="cim-form-check form-switch">
      <label class="form-check-label">{{ props.item.labelKey ? t(props.item.labelKey, {}, props.item.name) : props.item.name }}</label>
      <input class="form-control" type="number" v-model="state.value">
      <div class="cim-button" @click="onSave">{{ t('common.dialog.save') }}</div>
    </div>
  </div>
</template>
