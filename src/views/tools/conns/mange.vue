<script setup>
import { reactive, getCurrentInstance } from 'vue';
import { RESPONSE } from "../../../common/enum";
import { useRouter } from "vue-router";
import utils from '../../../common/utils';
import { Inspect } from "../../../services";
import { t } from '@/i18n';

const emit = defineEmits(['create'])

let router = useRouter();
let { currentRoute: { _rawValue: { params: { app_key } } } } = router;

const SEARCH_TYPE = {
  NEXT: 1,
  RESET: 2,
};

let context = getCurrentInstance();
let state = reactive({
  params: {
    user_id: '',
    start: new Date(Date.now() - 2 * 60 * 60 * 1000),
    count: 15,
  },
  list: [],
  currentCount: 0,
});

function onSearch(){
  let { start, count, user_id } = state.params;
  start = new Date(start).getTime();
  search({start, app_key, count, user_id}, SEARCH_TYPE.RESET);
}

function onNext(){
  let { list, params } = state;
  let { count, user_id } = params;
  let index = list.length - 1;
  let start = list[index].timestamp;
  search({start, app_key, count, user_id}, SEARCH_TYPE.NEXT)
}

function search(params, type){
  if(state.isLoading){
    return;
  }
  state.isLoading = true;
  let { list } = state;
  Inspect.getConns(params).then((result) => {
    let { code, msg, data } = result;
    utils.extend(state, { isLoading: false });
    if(utils.isEqual(code, RESPONSE.SUCCESS)){
      let { logs } = data;
      logs = utils.map(logs, (log) => {
        let { timestamp } = log;
        log.connTimeName = format(timestamp, 'yyyy-MM-dd hh:mm:ss')
        return log;
      })
      if(utils.isEqual(type, SEARCH_TYPE.NEXT)){
        list = list.concat(logs);
      }else{
        list = logs;
      }
      utils.extend(state, { list, currentCount: logs.length });
    }else{
      context.proxy.$toast({ icon: 'error', text: t('tools.connection.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`) });
    }
  })
}

function onCreate(item){
  emit('create', { ...item, count: 20, start: item.timestamp, currentCount: 0, isClose: true, list: [], isLoading: true });
}
function format(date, fmt = 'yyyy-MM-dd hh:mm') {
  return utils.formatTime(new Date(date).getTime(), fmt);
}
</script>
<template>
  <div class="cim-tconmanger-box cim-table-box">
    <div class="cim-table-header cim-log-header">
      <ul class="cim-table-header-lf-box">
        <li class="cim-table-lf-item">
          <VDatePicker v-model="state.params.start" mode="dateTime" is24hr>
            <template #default="{ togglePopover }">
              <div class="form-control cim-as-date-content" @click="togglePopover">{{ format(state.params.start) }}</div>
            </template>
          </VDatePicker>
        </li>
        <li class="cim-table-lf-item">
          <input class="form-control" type="text" v-model="state.params.user_id" :placeholder="t('tools.connection.field.userId')" autocomplete="off" @keydown.enter="onSearch">
        </li>
        <li class="cim-table-lf-item">
          <div class="cim-button cim-button-bg" @click="onSearch">{{ t('tools.connection.action.search') }}</div>
        </li>
      </ul>
    </div>
    <div class="cim-table-body">
      <table class="table cim-table">
        <thead>
          <tr>
            <th class="cim-td-c">{{ t('tools.connection.table.connectTime') }}</th>
            <th class="cim-td-c">{{ t('tools.connection.field.userId') }}</th>
            <th class="cim-td-c">{{ t('tools.connection.table.sessionId') }}</th>
            <!-- <th class="cim-td-c">SDK 版本</th> -->
            <th class="cim-td-c">{{ t('tools.connection.table.platform') }}</th>
            <th class="cim-td-c">{{ t('tools.connection.table.clientIp') }}</th>
            <th class="cim-td-c">{{ t('tools.connection.table.operation') }}</th>
          </tr>
        </thead>
        <tbody v-if="state.list.length">
          <tr v-for="item in state.list" :key="`${item.session}-${item.timestamp}`">
            <td class="cim-td-c">{{ item.connTimeName }}</td>
            <td class="cim-td-c">{{ item.user_id }}</td>
            <td class="cim-td-c">{{ item.session }}</td>
            <!-- <td class="cim-td-c">{{ item.version }}</td> -->
            <td class="cim-td-c">{{ item.platform }}</td>
            <td class="cim-td-c">{{ item.client_ip }}</td>
            <td class="cim-td-c">
              <ul class="cim-table-tools">
                <li class="cim-table-tool">
                  <a class="btn-link" href="#" @click.prevent="onCreate(item)">{{ t('tools.connection.action.viewDetails') }}</a>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="cim-td-c cim-tcon-empty-cell">
              <div class="cim-tcon-empty">
                <div class="cim-tcon-empty-icon"></div>
                <p class="cim-tcon-empty-text">{{ t('tools.connection.empty.connections') }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="cim-table-footer">
      <nav class="cim-navigation">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" href="#" v-if="state.currentCount >= state.params.count"  aria-label="Next" @click.prevent="onNext">
              <span aria-hidden="true">{{ t('tools.connection.action.next') }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="cim-loading" v-if="state.isLoading">
      <div class="loader-dot"></div>
    </div>
  </div>
</template>
