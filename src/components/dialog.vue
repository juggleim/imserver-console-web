<script setup>
import { t } from '@/i18n';

const props = defineProps(['show', 'title', 'cls']);
const emit = defineEmits(['close', 'save'])

function onClose(){
  emit('close');
}
function onSave(){
  emit('save');
}
function onHide(){
  emit('hide')
}
</script>

<template>
  <div>
    <div class="modal fade" :class="[props.show ? 'cim-modal show' : '', props.cls]">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <div class="cim-title">{{ props.title }}</div>
          <div class="cicon cicon-close" @click="onHide()"></div>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <div class="cim-button" @click="onSave()">{{ t('common.dialog.save') }}</div>
        </div>
      </div>
    </div>
    
  </div>
  <div class="modal-backdrop show" v-if="props.show"></div>
  </div>
</template>
