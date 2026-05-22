<script setup>
import { computed, reactive, watch } from 'vue';
import BaseSelect from '@/components/base-select.vue';
import utils from '../../common/utils';
import { t } from '@/i18n';

const props = defineProps(['item']);
const emit = defineEmits(['save'])

let state = reactive({
  value: props.item.options[0].key
});

const selectOptions = computed(() => {
  return props.item.options.map((op) => ({
    value: op.key,
    label: op.labelKey ? t(op.labelKey, {}, op.value) : op.value,
  }));
});

function onSave(){
  let { id } = props.item;
  let { value } = state;
  emit('save', { id, value });
}
watch(() => props.item.value, (value) => {
  utils.extend(state, { value });
})
</script>

<template>
  <div class="cim-sw-form">
    <div class="cim-form-check form-switch">
      <label class="form-check-label">{{ props.item.labelKey ? t(props.item.labelKey, {}, props.item.name) : props.item.name }}</label>
      <BaseSelect
        class-name="form-select"
        :model-value="state.value"
        :options="selectOptions"
        @update:modelValue="state.value = $event"
      />
      <div class="cim-button" @click="onSave">{{ t('common.dialog.save') }}</div>
    </div>
  </div>
</template>
