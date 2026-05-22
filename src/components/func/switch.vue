<script setup>
  const props = defineProps(['item']);
  const emit = defineEmits(['save']);
  import { reactive, watch } from 'vue';
  import utils from '../../common/utils';
  import { t } from '@/i18n';

  let state = reactive({
    value: Number(props.item.value),
  });

  function onSave(e) {
    let { id } = props.item;
    let checked = e.target.checked;
    let value = Number(checked) + '';
    emit('save', { id, value });
  }

  watch(
    () => props.item.value,
    (value) => {
      utils.extend(state, { value: Number(value) });
    }
  );
</script>

<template>
  <div class="cim-sw-form">
    <div class="cim-form-check form-switch">
      <label class="form-check-label">{{ props.item.labelKey ? t(props.item.labelKey, {}, props.item.name) : props.item.name }}</label>
      <input class="form-check-input" type="checkbox" :checked="state.value" @change="onSave" />
    </div>
  </div>
</template>
