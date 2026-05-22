<script setup>
import { reactive, getCurrentInstance } from 'vue';
import utils from '../../common/utils';
import { useRouter } from "vue-router";
import { UserManager } from "../../services";
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
  user_id: '',
  keywords: '',
};
let state = reactive({
  params: utils.clone(defaultParams),
  list: [],
  isFinished: false,
});
function format(date, fmt = 'yyyy-MM-dd') {
  return utils.formatTime(new Date(date).getTime(), fmt);
}

function onSearch(){
  search(true);
}
function onNext(){
  let { offset } = state.params;
  search(false);
}
function onUnban(item){
  UserManager.unban({ app_key, items: [{ user_id: item.user_id }] }).then(result => {
    onCallback(result, t('userManager.userList.feedback.unbanned'));
  });
  item.status = 0;
  item.statusName = t('userManager.userList.status.normal');
}
function onBan(item){
  //end_time: 0, end_time_offset: 600000
  UserManager.ban({ app_key, items: [{ user_id: item.user_id }] }).then(result => {
    onCallback(result, t('userManager.userList.feedback.banned'));
  });
  item.status = 1;
  item.statusName = t('userManager.userList.status.blocked');
}
function onCallback(result, text){
  let { code, msg } = result;
  if(utils.isEqual(code, RESPONSE.SUCCESS)){
    context.proxy.$toast({ icon: 'success', text: text });
  }else{
    context.proxy.$toast({ icon: 'error', text: t('userManager.userList.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`) });
  }
}
function search(isSearch){
  let params = { ...state.params };
  UserManager.getList(params).then((result) => {
    let { code, data, msg = '' } = result;
    if(utils.isEqual(code, RESPONSE.SUCCESS)){
      let { items, offset = '' } = data;
      items = utils.map(items, (item) => {
        item.statusName = item.status == 0 ? t('userManager.userList.status.normal') : t('userManager.userList.status.blocked');
        item.phone = item.phone || '-';
        item.account = item.account || '-';
        item.email = item.email || '-';
        item.time = format(item.created_time, 'yyyy-MM-dd hh:mm:ss');
        return item;
      });
      if(isSearch){
        state.list = items;
      }else{
        state.list = state.list.concat(items);
        state.params.offset = offset;
      }
      if(offset == '' && !isSearch){
        state.isFinished = true;
      }
    }else{
      context.proxy.$toast({ icon: 'error', text: `Error: ${code} ${msg}` });
    }
  });
}
search(true)

</script>
<template>
   <PageSection title-key="menu.user.users" body-class="cim-log-contanier">
    <div class="cim-log-header">
      <ul class="cim-log-header-lf-box">
        <li class="cim-log-lf-item">
          <input class="form-control" type="text" v-model="state.params.user_id" :placeholder="t('userManager.userList.field.userId')" autocomplete="off" @keydown.enter="onSearch">
        </li>
        <li class="cim-log-lf-item">
          <input class="form-control" type="text" v-model="state.params.keywords" :placeholder="t('userManager.userList.field.userName')" autocomplete="off" @keydown.enter="onSearch">
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
            <th class="cim-td-c">{{ t('userManager.userList.table.nickname') }}</th>
            <th class="cim-td-c">{{ t('userManager.userList.table.userId') }}</th>
            <th class="cim-td-c">{{ t('userManager.userList.table.registeredTime') }}</th>
            <th class="cim-td-c">{{ t('userManager.userList.table.account') }}</th>
            <th class="cim-td-c">{{ t('userManager.userList.table.phone') }}</th>
            <th class="cim-td-c">{{ t('userManager.userList.table.email') }}</th>
            <th class="cim-td-c">{{ t('userManager.userList.table.status') }}</th>
            <th class="cim-td-c">{{ t('userManager.userList.table.operation') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in state.list">
            <td class="cim-td-c">
              <div class="cim-userlist-info">
                <Avatar :user-id="item.user_id" :name="item.nickname" :avatar="item.avatar" :cls="'cim-small-avatar'"></Avatar>
                <div class="nickname">{{ item.nickname }}</div>
              </div>
            </td>
            <td class="cim-td-c">{{ item.user_id }}</td>
            <td class="cim-td-c">{{ item.time}}</td>
            <td class="cim-td-c">{{ item.account}}</td>
            <td class="cim-td-c">{{ item.phone}}</td>
            <td class="cim-td-c">{{ item.email}}</td>
            <td class="cim-td-c display_layout">
              <span class="cicon cim-log-status" :class="['cicon-user-state-' + item.status]">{{ item.statusName }}</span>
            </td>
            <td class="cim-td-c">
              <ul class="cim-table-tools">
                <li class="cim-table-tool">
                  <a class="btn-link" href="#" v-if="item.status == 0" @click="onBan(item)">{{ t('common.action.ban') }}</a>
                  <a class="btn-link" href="#" v-else  @click="onUnban(item)">{{ t('common.action.unban') }}</a>
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
