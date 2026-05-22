<script setup>
import { reactive, watch, getCurrentInstance } from 'vue';
import Dialog from './dialog.vue';
import utils from '../common/utils';
import { t } from '@/i18n';

const context = getCurrentInstance();
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  channel: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['save', 'hide']);

const state = reactive({
  fields: [],
});

function getFieldLabel(field) {
  return field.labelKey ? t(field.labelKey, {}, field.name) : field.name;
}

function updateFields(channel) {
  state.fields = utils.clone(channel?.children || []);
}

function onSave() {
  for (let i = 0; i < state.fields.length; i++) {
    let field = state.fields[i];
    if (field.type !== 'text') {
      continue;
    }
    let value = utils.isUndefined(field.value) || utils.isNull(field.value) ? '' : field.value.toString().trim();
    if (utils.isEmpty(value)) {
      return context.proxy.$toast({
        icon: 'error',
        text: t('translateConfig.validation.required', { name: getFieldLabel(field) }),
      });
    }
    field.value = value;
  }

  emit('save', {
    uid: props.channel.uid,
    fields: utils.clone(state.fields),
  });
}

function onHide() {
  emit('hide');
}

watch(
  () => [props.show, props.channel],
  () => {
    if (props.show) {
      updateFields(props.channel);
    }
  },
  { immediate: true }
);
</script>

<template>
  <Dialog :title="props.title" :show="props.show" :cls="'cim-r3d-dialog'" @hide="onHide" @save="onSave">
    <div class="row g-2 cim-row">
      <div v-for="field in state.fields" :key="field.key">
        <div class="form-floating cim-from-must cicon cicon-must" v-if="field.type === 'text'">
          <input class="form-control" placeholder="placeholder" type="text" v-model="field.value">
          <label>{{ getFieldLabel(field) }}</label>
        </div>
        <div class="form-control fs-12 mb-4" v-else-if="field.type === 'radios'">
          <div class="form-check-inline mt-6" v-for="radio in field.radios" :key="`${field.key}-${String(radio.value)}`">
            <input class="form-check-input" type="radio" :name="field.key" :value="radio.value" v-model="field.value">
            <label class="form-check-label">{{ radio.labelKey ? t(radio.labelKey, {}, radio.label) : radio.label }}</label>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>
