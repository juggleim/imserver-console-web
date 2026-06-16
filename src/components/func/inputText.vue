<script setup>
const props = defineProps(['item']);
const emit = defineEmits(['save'])
import { reactive, watch } from 'vue';
import utils from '../../common/utils';
import { t } from '@/i18n';
let state = reactive({
  value: String(props.item.value || props.item.defaultValue || '')
});

function onSave(){
  let { id } = props.item;
  let { value } = state;
  emit('save', { id, value });
}
watch(() => props.item.value, (value) => {
  let val = String(utils.isEmpty(value) ? (props.item.defaultValue || '') : value);
  utils.extend(state, { value: val });
})
</script>

<template>
   <div class="cim-sw-form">
    <div class="cim-form-check form-switch">
      <label class="form-label">{{ props.item.labelKey ? t(props.item.labelKey, {}, props.item.name) : props.item.name }}</label>
      <input class="form-control form-control1" type="text" v-model="state.value" :placeholder="props.item.defaultValue || ''">
      <div class="cim-button" @click="onSave">{{ t('common.dialog.save') }}</div>
    </div>
  </div>
</template>

<style scoped>
  .form-label {
    width: 100px;
  }
  .form-control1 {
    width: 400px;
    text-align: left;
  }
</style>
