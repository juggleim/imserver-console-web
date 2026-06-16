<script setup>
import { reactive, watch } from 'vue';
import utils from '../../common/utils';
import { t } from '@/i18n';

const props = defineProps(['item']);
const emit = defineEmits(['save']);

let state = reactive({
  value: props.item.value || props.item.options[0]?.key || '',
});

function onChange(key) {
  if (utils.isEqual(state.value, key)) {
    return;
  }
  state.value = key;
  emit('save', { id: props.item.id, value: key });
}

watch(() => props.item.value, (value) => {
  if (!utils.isEmpty(value)) {
    utils.extend(state, { value });
  }
});
</script>

<template>
  <div class="cim-sw-form">
    <div class="cim-form-check cim-sw-radio-group">
      <label class="form-check-label">{{ props.item.labelKey ? t(props.item.labelKey, {}, props.item.name) : props.item.name }}</label>
      <div class="cim-sw-radios">
        <label
          class="form-check form-check-inline cim-sw-radio"
          v-for="op in props.item.options"
          :key="op.key"
        >
          <input
            class="form-check-input"
            type="radio"
            :name="props.item.id"
            :value="op.key"
            :checked="utils.isEqual(state.value, op.key)"
            @change="onChange(op.key)"
          >
          <span class="form-check-label">{{ op.labelKey ? t(op.labelKey, {}, op.value) : op.value }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cim-sw-radio-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.cim-sw-radios {
  display: flex;
  align-items: center;
  gap: 24px;
}

.cim-sw-radio {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  cursor: pointer;
}
</style>
