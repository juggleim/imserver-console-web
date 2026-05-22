<script setup>
  import { h, ref, reactive } from 'vue';
  import { NButton, NTag, useDialog } from 'naive-ui';
  import { Application } from '@/services';
  import { useRouter } from 'vue-router';
  import { showToast } from '@/common/toast';
  import SensitiveDataEdit from './sensitive_data_edit.vue';
  import ImportWords from './importWords.vue';
  import { t } from '@/i18n';
  import PageSection from '@/components/page-section.vue';

  let router = useRouter();
  let {
    currentRoute: {
      _rawValue: {
        params: { app_key },
      },
    },
  } = router;

  let state = reactive({
    list: []
  });
  const tab = ref(0);
  const loading = ref(false);
  const editRef = ref();
  const importRef = ref();
  const queryForm = ref({
    word: '',
  });

  function reloadTable() {
    loadData({ page: 1, size: 10, app_key });
  }

  function addTable() {
    editRef.value.openModal();
  }

  function importWords() {
    importRef.value.openModal();
  }

  function handleSearch() {
    loading.value = true;
    loadData({ page: 1, size: 10, app_key });
  }

  function handleReset() {
    queryForm.value.word = '';
    loadData({ page: 1, size: 10, appKey: app_key });
  }

  const columns = ref([
    {
      title: t('sensitive.table.word'),
      key: 'word',
    },
    {
      title: t('sensitive.table.filterType'),
      key: 'word_type',
      render(row) {
        return h(
          NTag,
          { type: row.word_type === 1 ? 'success' : 'info' },
          {
            default: () => {
              return row.word_type === 1 ? t('sensitive.type.filter') : t('sensitive.type.replace');
            },
          }
        );
      },
    },
    {
      title: t('sensitive.table.operation'),
      key: 'actions',
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'error',
            onClick: () => handleDelete(row),
          },
          { default: () => t('sensitive.action.delete') }
        );
      },
    },
  ]);
  const data = [];
  const pagination = ref({});
  reloadTable();
  
  function loadData(params) {
    loading.value = true;
    Application.getSensitiveList({ ...params, word: queryForm.value.word || '' })
      .then((res) => {
        state.list = res.data.items || [];
        pagination.value = {
          page: res.data.page,
          itemCount: res.data.total,
          pageSize: 10,
        };
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function handlePageChange(page) {
    loading.value = true;
    Application.getSensitiveList({
      page: page,
      size: 10,
      appKey: app_key,
      word: queryForm.value.word || '',
    })
      .then((res) => {
        data.value = res.data.list;
        pagination.value = {
          page: res.data.page,
          itemCount: res.data.total,
          pageSize: 10,
        };
      })
      .finally(() => {
        loading.value = false;
      });
  }

  const dialog = useDialog();

  function handleDelete(record) {
    dialog.warning({
      title: t('sensitive.dialog.warningTitle'),
      content: t('sensitive.dialog.warningContent'),
      positiveText: t('common.action.confirm'),
      negativeText: t('common.action.cancel'),
      onPositiveClick: () => {
        Application.deleteSensitiveWord({ app_key, word: record.word }).then((res) => {
          if (res.code === 0) {
            showToast({ text: t('sensitive.feedback.deleteSuccess') });
          }
          reloadTable();
        });
      },
    });
  }

  // const model = ref({
  //   handler_type: 1,
  //   replace_char: '*',
  // });

  // Application.getSensitiveConf(app_key).then((res) => {
  //   console.log(res);
  //   model.value = res.data;
  // });

  // function handleSave() {
  //   Application.setSensitiveConf(app_key, model.value).then((res) => {
  //     console.log(res);
  //     window.$toast({ icon: 'success', text: '保存成功' });
  //   });
  // }
</script>

<template>
  <PageSection title-key="menu.sensitive.config" shell-class="tab-content">
    <template #actions>
      <n-button type="primary" size="small" @click="addTable">{{ t('sensitive.action.add') }}</n-button>
      <n-button type="default" size="small" @click="importWords">{{ t('sensitive.action.import') }}</n-button>
    </template>
    <n-card :bordered="false" class="proCard">
      <!-- <n-form ref="formRef" inline :label-width="80" :model="queryForm">
        <n-form-item label="Sensitive Word" path="model.logType" style="width: 200px">
          <n-input v-model:value="queryForm.word" placeholder="Sensitive Word" />
        </n-form-item>
        <n-form-item>
          <n-button
            attr-type="button"
            type="primary"
            style="margin-right: 10px"
            @click="handleSearch"
          >
            Search
          </n-button>
          <n-button attr-type="button" type="default" @click="handleReset"> Reset</n-button>
        </n-form-item>
      </n-form> -->
      <n-data-table
        remote
        ref="table"
        :columns="columns"
        :data="state.list"
        :loading="loading"
        :row-key="(row) => row.id"
        @update:page="handlePageChange"
      />
    </n-card>
    <!-- :pagination="pagination" -->

    <SensitiveDataEdit ref="editRef" @reloadTable="reloadTable" />
    <ImportWords ref="importRef" @reloadTable="reloadTable" />
  </PageSection>
</template>
