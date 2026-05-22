<script setup>
import { reactive, getCurrentInstance } from 'vue';
import utils from '../../common/utils';
import { useRouter } from "vue-router";
import { GroupManager } from "../../services";
import { ErrorType, STORAGE, RESPONSE, LOG_PULL_STATUS, PLATFORMAS } from '../../common/enum';
import Avatar from "../../components/avatar.vue";
import Storage from "../../common/storage";
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

const context = getCurrentInstance();
let router = useRouter();
let { currentRoute: { _rawValue: { params: { app_key } } } } = router;
let defaultParams = {
  offset: '',
  limit: 50,
  app_key: app_key,
  group_id: '',
  keywords: ''
};
let state = reactive({
  params: utils.clone(defaultParams),
  list: [],
  isFinished: false,
});
function format(date, fmt = 'yyyy-MM-dd') {
  return utils.formatTime(new Date(date).getTime(), fmt);
}
function onDisolve(item, index){
  GroupManager.dissolve({
    app_key: app_key,
    group_ids: [item.group_id]
  }).then((result) => {
    let { code, data, msg = '' } = result;
    if(utils.isEqual(code, RESPONSE.SUCCESS)){
      context.proxy.$toast({ icon: 'success', text: t('appServices.groupList.feedback.dissolved') }); 
      state.list.splice(index, 1);
    }else{
     context.proxy.$toast({ icon: 'error', text: t('common.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`) }); 
    }
  });
}
function onSearch(){
  state.params.offset = '';
  search(true);
}
function onNext(){
  let { offset } = state.params;
  search(false);
}
function search(isForce){
  let params = { ...state.params };
  GroupManager.getList(params).then((result) => {
    let { code, data, msg = '' } = result;
    if(utils.isEqual(code, RESPONSE.SUCCESS)){
      let { items, offset = '' } = data;
      items = utils.map(items, (item) => {
        item.statusName = item.status == 0 ? 'Active' : 'Banned';
        item.phone = item.phone || '-';
        item.account = item.account || '-';
        item.email = item.email || '-';
        item.time = format(item.created_time, 'yyyy-MM-dd hh:mm:ss');
        return item;
      });
      if(offset == ''){
        state.isFinished = true;
      }
      if(isForce){
        state.list = items;
        state.params.offset = '';
      }else{
        state.list = state.list.concat(items);
        state.params.offset = offset;
      }
    }else{
      context.proxy.$toast({ icon: 'error', text: t('common.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`) });
    }
  });
}
search(true)
</script>
<template>
   <PageSection title-key="menu.user.groups" body-class="cim-log-contanier">
    <div class="cim-log-header">
      <ul class="cim-log-header-lf-box">
        <li class="cim-log-lf-item">
          <input class="form-control" type="text" v-model="state.params.group_id" :placeholder="t('appServices.groupList.field.groupId')" autocomplete="off" @keydown.enter="onSearch">
        </li>
        <li class="cim-log-lf-item">
          <input class="form-control" type="text" v-model="state.params.keywords" :placeholder="t('appServices.groupList.field.groupName')" autocomplete="off" @keydown.enter="onSearch">
        </li>
        <li class="cim-log-lf-item">
          <div class="cim-button cim-button-bg" @click="onSearch">{{ t('common.action.search') }}</div>
        </li>
      </ul>
    </div>
    <div class="cim-log-body">
      <table class="table cim-table">
        <thead>
          <tr>
            <th class="cim-td-c">{{ t('appServices.groupList.table.groupName') }}</th>
            <th class="cim-td-c">{{ t('appServices.groupList.table.memberCount') }}</th>
            <th class="cim-td-c">{{ t('appServices.groupList.table.groupId') }}</th>
            <th class="cim-td-c">{{ t('appServices.groupList.table.createdTime') }}</th>
            <!-- <th class="cim-td-c">群主</th>
            <th class="cim-td-c">群主账号</th> -->
            <th class="cim-td-c">{{ t('appServices.groupList.table.operation') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in state.list">
            <td class="cim-td-c cim-td-group-name">
              <div class="cim-userlist-info">
                <Avatar :user-id="item.group_id" :name="item.group_name" :avatar="item.group_portrait" :cls="'cim-small-avatar'"></Avatar>
                <div class="nickname">{{ item.group_name }}</div>
              </div>
            </td>
            <td class="cim-td-c">{{ item.member_count }}</td>
            <td class="cim-td-c">{{ item.group_id }}</td>
            <td class="cim-td-c">{{ item.time}}</td>
            <!-- <td class="cim-td-c">
              <div class="cim-userlist-info">
                <Avatar :user-id="item.owner.user_id" :name="item.owner.nickname" :portrait="item.owner.avatar" :cls="'cim-small-avatar'"></Avatar>
                <div class="nickname">{{ item.owner.nickname || '-' }}</div>
              </div>
            </td>
            <td class="cim-td-c">{{ item.owner.account || '-'}}</td> -->
            <td class="cim-td-c">
              <ul class="cim-table-tools">
                <li class="cim-table-tool">
                  <a class="btn-link" href="#" @click="onDisolve(item, index)">{{ t('appServices.groupList.action.dissolve') }}</a>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="cim-log-footer">
      <nav class="cim-navigation">
        <ul class="pagination">
          <!-- <li class="page-item" v-if="state.params.offset > 1" >
            <a class="page-link" href="#" aria-label="Previous"@click="onPre">
              <span aria-hidden="true">上一页</span>
            </a>
          </li> -->
          <li class="page-item">
            <a class="page-link" href="#" v-if="!state.isFinished"  aria-label="Next" @click="onNext">
              <span aria-hidden="true">{{ t('common.action.nextPage') }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </PageSection>
</template>
