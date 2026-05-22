<script setup>
  import { computed, defineProps, reactive } from 'vue';
  import UploadFile from '../../components/func/uploadfile.vue';
import utils from '@/common/utils';
import { t } from '@/i18n';

  const emit = defineEmits(['save']);
  // const state = ref({} as Record<string, any>);

  let contextState = reactive({
    currentFile: {},
    currentVoIPFile: {},
  });
  const props = defineProps({
    fields: {
      type: Array,
      required: true,
    },
    state: {
      type: Object,
    },
    btnType: {
      type: Number
    }
  });

  const state = computed(() => {
    return props.state;
  });

  const type = computed(() => {
    return props.btnType;
  });

  function onSave() {
    let { currentFile, currentVoIPFile } = contextState;
    state.value.file = currentFile;
    state.value.voipFile = currentVoIPFile;
    emit('save', state.value);
  }
  function onFileAdd(e){
    e.target.parentElement.childNodes[0].click();
  }
  function onFileRemove(e){
    contextState.currentFile = {};
    e.target.parentElement.childNodes[0].value = '';
  }
  function onVoIPFileRemove(e){
    contextState.currentVoIPFile = {};
    e.target.parentElement.childNodes[0].value = '';
  }
  function onFileSelect(event) {
    const file = event.target.files[0];
    contextState.currentFile = file;
    // Application.uploadFile(file).then((res) => {
    //   value.value = res.data.path;
    //   emit('update:value', res.data.path);
    //   context.proxy.$toast({ icon: 'success', text: 'Upload success', duration: 4000 });
    // });
  }
  function onVoIPFileSelect(event) {
    const file = event.target.files[0];
    contextState.currentVoIPFile = file;
  }
</script>

<template>
  <div class="cim-form-args">
    <div
      class="form-floating form50"
      v-for="field in fields"
      :key="field.name"
    >
      <input
        type="text"
        class="form-control mb-4"
        placeholder="AA"
        v-model="state[field.name]"
        v-if="field.type === 'input_text'"
      />
      <div class="form-control" v-if="field.type === 'switch'">
        <n-switch :checked-value="1" :unchecked-value="0" v-model:value="state[field.name]" />
      </div>
     
      <div class="form-control fs-12  mb-4" v-if="field.type === 'radios'">
        <div class="form-check-inline mt-6" v-for="radio in field.radios">
          <input class="form-check-input" type="radio" name="radio.name" :value="radio.value" v-model="state[field.name]">
          <label class="form-check-label">{{ radio.labelKey ? t(radio.labelKey, {}, radio.label) : radio.label }}</label>
        </div>
      </div>

      <div class="form-control mb-4 form-file-control" v-if="field.type === 'file'">
        <input type="file" style="display: none;" @change="onFileSelect" />
        <div class="cim-form-name" :class="{ 'mgr-1rm': state[field.name] }">{{ contextState.currentFile.name || state[field.name] }}</div>
        <div class="cicon cim-form-add cim-upload cim-form-remove" v-if="contextState.currentFile.name" @click="onFileRemove">{{ t('common.form.removeCertificate') }}</div>
        <div class="cicon cim-form-add cim-upload" @click="onFileAdd">{{ t('common.form.addCertificate') }}</div>
      </div>

      <div class="form-control mb-4 form-file-control" v-if="field.type === 'voipfile'">
        <input type="file" style="display: none;" @change="onVoIPFileSelect" />
        <div class="cim-form-name" :class="{ 'mgr-1rm': state[field.name] }">{{ contextState.currentVoIPFile.name || state[field.name] }}</div>
        <div class="cicon cim-form-add cim-upload cim-form-remove" v-if="contextState.currentVoIPFile.name" @click="onVoIPFileRemove">{{ t('common.form.removeCertificate') }}</div>
        <div class="cicon cim-form-add cim-upload" @click="onFileAdd">{{ t('common.form.addCertificate') }}</div>
      </div>

      <label>{{ field.labelKey ? t(field.labelKey, {}, field.label) : field.label }}</label>
    </div>
    <div class="row form100">
      <div class="offset-sm-4">
        <div class="cim-button cim-button-bg fs-12" @click="onSave">{{ t('common.form.saveInfo') }}</div>
      </div>
    </div>
  </div>
</template>
