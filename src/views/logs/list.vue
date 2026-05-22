<script setup>
import { computed, reactive, getCurrentInstance } from 'vue';
import utils from '../../common/utils';
import PullLogDialog from '../../components/dialog-pull-log.vue';
import { useRouter } from "vue-router";
import { Log } from "../../services";
import { RESPONSE, LOG_PULL_STATUS } from '../../common/enum';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

const context = getCurrentInstance();
let router = useRouter();
let { currentRoute: { _rawValue: { params: { app_key } } } } = router;
let defaultParams = {
  offset: 1,
  limit: 50,
  app_key: app_key,
  user_id: '',
  description: ''
};
let state = reactive({
  isShowPullDialog: false,
  params: utils.clone(defaultParams),
  list: [ ],
  range: {
    start: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  }
});
function format(date, fmt = 'yyyy-MM-dd') {
  return utils.formatTime(new Date(date).getTime(), fmt);
}

const formattedRange = computed(() => {
  return `${format(state.range.start)} ${t('common.word.to')} ${format(state.range.end)}`;
});

const hasPreviousPage = computed(() => state.params.offset > 1);
const hasNextPage = computed(() => state.list.length >= state.params.limit);

function getStatusTone(status) {
  if (utils.isEqual(status, LOG_PULL_STATUS.COMPLETE)) {
    return 'is-success';
  }
  if (utils.isEqual(status, LOG_PULL_STATUS.SUCCESS)) {
    return 'is-info';
  }
  if (utils.isEqual(status, LOG_PULL_STATUS.FAIL) || utils.isEqual(status, LOG_PULL_STATUS.UPLOAD_FAIL)) {
    return 'is-danger';
  }
  if (utils.isEqual(status, LOG_PULL_STATUS.WITHOUT)) {
    return 'is-muted';
  }
  return 'is-pending';
}

function onShowPullDialog(isShow){
  state.isShowPullDialog = isShow;
}
function onCreatePull(params){
  let data = { ...params, app_key };
  Log.create(data).then((result) => {
    let { code, msg } = result;
    if(utils.isEqual(code, RESPONSE.SUCCESS)){
      utils.extend(state.params, utils.clone(defaultParams))
      onShowPullDialog(false);
      search();
    }else{
      context.proxy.$toast({ icon: 'error', text: t('logs.feedback.requestFailed', { code, msg }) });
    }
  });
}
function onSearch(){
  search();
}
function onNext(){
  let { offset } = state.params;
  offset += 1;
  utils.extend(state.params, { offset });
  search();
}
function onPre(){
  let { offset } = state.params;
  offset -= 1;
  utils.extend(state.params, { offset });
  search();
}
function onDownload(item){
  Log.download({ id: item.id, app_key }).then((blob) => {
    downloadLog(blob, `imlog-${format(Date.now(), 'yyyyMMddhhmmss')}.txt`);
  });

  function downloadLog(blob, filename) {
    const a = document.createElement('a')
    a.download = filename
    const blobUrl = URL.createObjectURL(blob)
    a.href = blobUrl
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)
  }
}
function search(){
  let { start, end } = state.range;
  let params = { ...state.params, start: start.getTime(), end: end.getTime() };
  Log.getList(params).then((result) => {
    let { code, data, msg = '' } = result;
    if(utils.isEqual(code, RESPONSE.SUCCESS)){
      let { items } = data;
      items = utils.map(items, (item) => {
        let { created_time, start, end, state: status } = item;
        // let index = utils.find(PLATFORMAS, (item) => { return item.value == platform});
        // let plat = PLATFORMAS[index] || { name: '' }
        // let platformName = plat.name;
        let statusName = t(`logs.status.${status}`, {}, LOG_PULL_STATUS[status]);
        let startName = format(start, 'yyyy-MM-dd hh:mm:ss');
        let endName = format(end, 'yyyy-MM-dd hh:mm:ss');
        let createName = format(created_time, 'yyyy-MM-dd hh:mm:ss');
        utils.extend(item, {  statusName, startName, endName, createName });
        return item;
      });
      state.list = items.reverse();
    }else{
      context.proxy.$toast({ icon: 'error', text: t('logs.feedback.requestFailed', { code, msg }) });
    }
  });
}
search()

</script>
<template>
   <PageSection title-key="menu.logs.list" shell-class="cim-log-list-page" body-class="cim-log-list-body">
    <div class="cim-log-toolbar">
      <div class="cim-log-toolbar-fields">
        <div class="cim-log-toolbar-field cim-log-toolbar-field-range">
          <VDatePicker v-model.range="state.range">
            <template #default="{ togglePopover }">
              <button type="button" class="cim-log-field cim-log-date-field" @click="togglePopover">
                <span class="cim-log-date-icon" aria-hidden="true"></span>
                <span>{{ formattedRange }}</span>
              </button>
            </template>
          </VDatePicker>
        </div>
        <div class="cim-log-toolbar-field">
          <input
            v-model="state.params.user_id"
            class="cim-log-field"
            type="text"
            :placeholder="t('logs.field.userId')"
            autocomplete="off"
            @keydown.enter="onSearch"
          >
        </div>
        <div class="cim-log-toolbar-field">
          <input
            v-model="state.params.description"
            class="cim-log-field"
            type="text"
            :placeholder="t('logs.field.description')"
            autocomplete="off"
            @keydown.enter="onSearch"
          >
        </div>
        <button type="button" class="cim-log-action-button is-primary" @click="onSearch">{{ t('logs.action.search') }}</button>
      </div>
      <button type="button" class="cim-log-action-button is-outline" @click="onShowPullDialog(true)">{{ t('logs.action.pullLogs') }}</button>
    </div>

    <div class="cim-log-table-wrap">
      <table class="table cim-log-table">
        <colgroup>
          <col class="cim-col-user">
          <col class="cim-col-platform">
          <col class="cim-col-collect">
          <col class="cim-col-pull">
          <col class="cim-col-status">
          <col class="cim-col-remark">
          <col class="cim-col-operation">
        </colgroup>
        <thead>
          <tr>
            <th>{{ t('logs.field.userId') }}</th>
            <th>{{ t('logs.field.platform') }}</th>
            <th>{{ t('logs.table.collectTime') }}</th>
            <th>{{ t('logs.table.pullTime') }}</th>
            <th>{{ t('logs.table.status') }}</th>
            <th>{{ t('logs.table.remark') }}</th>
            <th>{{ t('logs.table.operation') }}</th>
          </tr>
        </thead>
        <tbody v-if="state.list.length">
          <tr v-for="item in state.list" :key="item.id || `${item.user_id}-${item.created_time}`">
            <td>{{ item.user_id || '--' }}</td>
            <td>{{ item.platform || '--' }}</td>
            <td>
              <div class="cim-log-time-text">{{ item.startName }} {{ t('common.word.to') }} {{ item.endName }}</div>
            </td>
            <td>{{ item.createName }}</td>
            <td>
              <div class="cim-log-status-cell" :class="getStatusTone(item.state)">
                <span class="cim-log-status-icon" aria-hidden="true"></span>
                <span>{{ item.statusName }}</span>
              </div>
            </td>
            <td>
              <div class="cim-log-remark-text">{{ item.description || '--' }}</div>
            </td>
            <td>
              <a
                v-if="utils.isEqual(item.state, LOG_PULL_STATUS.COMPLETE) && item.log_url"
                class="cim-log-download-link"
                :href="item.log_url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ t('logs.action.download') }}
              </a>
              <button
                v-else-if="utils.isEqual(item.state, LOG_PULL_STATUS.COMPLETE)"
                type="button"
                class="cim-log-download-link is-button"
                @click="onDownload(item)"
              >
                {{ t('logs.action.download') }}
              </button>
              <span v-else class="cim-log-download-link is-disabled">--</span>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7" class="cim-log-empty-cell">--</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="hasPreviousPage || hasNextPage" class="cim-log-footer">
      <div class="cim-log-pagination">
        <button type="button" class="cim-log-page-button" :disabled="!hasPreviousPage" @click="onPre">
          {{ t('logs.action.previous') }}
        </button>
        <button type="button" class="cim-log-page-button" :disabled="!hasNextPage" @click="onNext">
          {{ t('logs.action.next') }}
        </button>
      </div>
    </div>
    <PullLogDialog :show="state.isShowPullDialog" :title="t('logs.dialog.title')" :text="t('common.action.confirm')" :type="state.dialogType" @hide="onShowPullDialog(false)" @save="onCreatePull"></PullLogDialog>
  </PageSection>
</template>
