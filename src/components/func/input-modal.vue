<script setup>
import DialogDomain from '../../components/dialog-modify-domain.vue';

const props = defineProps(['item']);
const emit = defineEmits(['save'])
import { reactive, watch } from 'vue';
import utils from '../../common/utils';
import { t } from '@/i18n';
let state = reactive({
  isShowModal: false,
  domains: []
});

function onSave({ domains }){
  let { id } = props.item;
  state.domains = domains;
  emit('save', { id, value: utils.toJSON({ domains }) });
  onShowModal(false);
}
function onShowModal(isShow){
  state.isShowModal = isShow;
}
watch(() => props.item.value, (value) => {
  value = value || '{ "domains": [] }';
  let val = utils.parse(value);
  utils.extend(state, { domains: val.domains });
})
</script>

<template>
   <div class="cim-sw-form">
    <div class="cim-form-check form-switch">
      <label class="form-check-label">{{ props.item.labelKey ? t(props.item.labelKey, {}, props.item.name) : props.item.name }}</label>
      <div class="cim-secrity-dm-content">
        <ul>
          <li v-if="state.domains.length == 0">{{ t('common.status.unset') }}</li>
          <li v-else>{{ state.domains.join(';') }}</li>
        </ul>
      </div>
      <div class="cim-button" @click="onShowModal(true)">{{ t('common.action.edit') }}</div>
    </div>
  </div>
  <DialogDomain :show="state.isShowModal" :domains="state.domains" @hide="onShowModal(false)" @save="onSave"></DialogDomain>
</template>
