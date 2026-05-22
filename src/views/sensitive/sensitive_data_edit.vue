<script  setup>
  import { ref } from 'vue';
  import { NModal, useMessage } from 'naive-ui';
  import { useRouter } from 'vue-router';
  import Application from '@/services/application';
  import { showToast } from '@/common/toast';
  import { t } from '@/i18n';

  const emit = defineEmits(['reloadTable']);
  const message = useMessage();
  const loading = ref(false);
  const showModal = ref(false);
  const formValue = ref(newState({}));
  const formRef = ref({});
  const formBtnLoading = ref(false);

  let router = useRouter();
  let {
    currentRoute: {
      _rawValue: {
        params: { app_key },
      },
    },
  } = router;

  const wordTypes = [
    { label: '过滤', labelKey: 'sensitive.type.filter', value: 1 },
    { label: '替换（****）', labelKey: 'sensitive.type.replace', value: 2 },
  ];

  function newState(state = {}) {
    return {
      id: state.id || 0,
      word: state.word || '',
      wordType: state.wordType || 1,
    };
  }

  function openModal() {
    showModal.value = true;
  }

  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate((errors) => {
      if (!errors) {
        Application.addSensitiveWord({ app_key, word: formValue.value.word, word_type: formValue.value.wordType }).then((res) => {
          showToast({ text: t('sensitive.feedback.addSuccess') });
          emit('reloadTable');
          showModal.value = false;
        }).finally(() => {
          formBtnLoading.value = false;
        });
      } else {
        message.error(t('sensitive.feedback.formIncomplete'));
      }
    });
  }

  function closeForm() {
    showModal.value = false;
    loading.value = false;
  }

  defineExpose({ openModal });
</script>


<template>
  <div>
    <n-modal
      v-model:show="showModal"
      :mask-closable="false"
      :show-icon="false"
      preset="dialog"
      transform-origin="center"
      :title="t('sensitive.dialog.addWordTitle')"
      :style="{
        width: 840,
      }"
    >
      <n-scrollbar style="max-height: 87vh" class="pr-5">
        <n-spin :show="loading" :description="t('sensitive.feedback.loading')">
          <n-form
            ref="formRef"
            :model="formValue"
            :label-placement="'left'"
            :label-width="100"
            class="py-4"
          >
            <n-grid cols="1 s:1 m:1 l:1 xl:1 2xl:1" responsive="screen">
              <n-gi span="1">
                <n-form-item :label="t('sensitive.field.word')" path="word">
                  <n-input :placeholder="t('sensitive.placeholder.word')" v-model:value="formValue.word" />
                </n-form-item>
              </n-gi>
              <n-gi span="1">
                <n-form-item :label="t('sensitive.table.filterType')" path="wordType">
                  <n-select
                    :placeholder="t('sensitive.placeholder.filterType')"
                    v-model:value="formValue.wordType"
                    :options="wordTypes.map((item) => ({ ...item, label: t(item.labelKey, {}, item.label) }))"
                  />
                </n-form-item>
              </n-gi>
            </n-grid>
          </n-form>
        </n-spin>
      </n-scrollbar>
      <template #action>
        <n-space>
          <n-button @click="closeForm">{{ t('common.action.cancel') }}</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">{{ t('common.action.confirm') }}</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

