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

  const PAGE_SIZE = 20;

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
  const loading = ref(false);
  const editRef = ref();
  const importRef = ref();
  const queryForm = ref({
    word: '',
  });

  const pagination = ref({
    page: 1,
    pageSize: PAGE_SIZE,
    itemCount: 0,
    pageCount: 1,
    showSizePicker: false,
  });

  function reloadTable() {
    loadData(1);
  }

  function addTable() {
    editRef.value.openModal();
  }

  function importWords() {
    importRef.value.openModal();
  }

  function handleSearch() {
    loadData(1);
  }

  function handleReset() {
    queryForm.value.word = '';
    loadData(1);
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

  reloadTable();

  function loadData(page = 1) {
    loading.value = true;
    Application.getSensitiveList({
      page,
      size: PAGE_SIZE,
      app_key,
      word: queryForm.value.word || '',
    })
      .then((res) => {
        const data = res.data || {};
        state.list = data.items || [];
        const total = data.total || 0;
        const totalPage = data.total_page || Math.max(1, Math.ceil(total / PAGE_SIZE));
        pagination.value = {
          page: data.page || page,
          pageSize: PAGE_SIZE,
          itemCount: total,
          pageCount: totalPage,
          showSizePicker: false,
          prefix: () => t('sensitive.pagination.total', { total, totalPage }),
        };
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function handlePageChange(page) {
    loadData(page);
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
</script>

<template>
  <PageSection title-key="menu.sensitive.config" shell-class="tab-content">
    <template #actions>
      <n-button type="primary" size="small" @click="addTable">{{ t('sensitive.action.add') }}</n-button>
      <n-button type="default" size="small" @click="importWords">{{ t('sensitive.action.import') }}</n-button>
    </template>
    <n-card :bordered="false" class="proCard">
      <n-form inline :model="queryForm" class="sensitive-search-form">
        <n-form-item :label="t('sensitive.field.word')">
          <n-input
            v-model:value="queryForm.word"
            :placeholder="t('sensitive.placeholder.searchWord')"
            clearable
            style="width: 220px"
            @keydown.enter="handleSearch"
          />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button type="primary" size="small" @click="handleSearch">{{ t('common.action.search') }}</n-button>
            <n-button size="small" @click="handleReset">{{ t('sensitive.action.reset') }}</n-button>
          </n-space>
        </n-form-item>
      </n-form>
      <n-data-table
        remote
        ref="table"
        :columns="columns"
        :data="state.list"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        @update:page="handlePageChange"
      />
    </n-card>

    <SensitiveDataEdit ref="editRef" @reloadTable="reloadTable" />
    <ImportWords ref="importRef" @reloadTable="reloadTable" />
  </PageSection>
</template>

<style scoped>
.sensitive-search-form {
  margin-bottom: 16px;
}
</style>
