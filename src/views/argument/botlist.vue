<script setup>
import { reactive, getCurrentInstance } from 'vue';
import utils from '../../common/utils';
import { useRouter } from 'vue-router';
import { BotManager } from '../../services';
import { RESPONSE } from '../../common/enum';
import Avatar from '../../components/avatar.vue';
import DialogBot from '../../components/dialog-bot.vue';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

const context = getCurrentInstance();
let router = useRouter();
let {
  currentRoute: {
    _rawValue: {
      params: { app_key },
    },
  },
} = router;

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
  isShowDialog: false,
  currentBot: {},
});

function format(date, fmt = 'yyyy-MM-dd') {
  return utils.formatTime(new Date(date).getTime(), fmt);
}

function onSearch() {
  state.params.offset = '';
  state.isFinished = false;
  search(true);
}

function onNext() {
  search(false);
}

function onShowDialog(isShow) {
  state.isShowDialog = isShow;
  if (!isShow) {
    state.currentBot = {};
  }
}

function onCreate() {
  state.currentBot = {};
  onShowDialog(true);
}

function onEdit(item) {
  state.currentBot = item;
  onShowDialog(true);
}

function onSave(data) {
  let isEdit = !utils.isEmpty(state.currentBot.bot_id);
  let request = isEdit
    ? BotManager.update({ app_key, ...data })
    : BotManager.add({ app_key, ...data });
  request.then((result) => {
    let { code, msg = '' } = result;
    if (utils.isEqual(code, RESPONSE.SUCCESS)) {
      context.proxy.$toast({
        icon: 'success',
        text: isEdit ? t('botList.feedback.updateSuccess') : t('botList.feedback.createSuccess'),
      });
      onShowDialog(false);
      onSearch();
    } else {
      context.proxy.$toast({
        icon: 'error',
        text: t('botList.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`),
      });
    }
  });
}

function search(isSearch) {
  let params = { ...state.params };
  BotManager.getList(params).then((result) => {
    let { code, data, msg = '' } = result;
    if (utils.isEqual(code, RESPONSE.SUCCESS)) {
      let { items, offset = '' } = data;
      items = utils.map(items, (item) => {
        item.time = format(item.created_time, 'yyyy-MM-dd hh:mm:ss');
        item.webhookUrl = (item.bot_conf && item.bot_conf.url) || '-';
        item.onlyMentionedName = item.bot_settings && item.bot_settings.only_mentioned
          ? t('botList.status.yes')
          : t('botList.status.no');
        return item;
      });
      if (isSearch) {
        state.list = items;
        state.params.offset = offset;
      } else {
        state.list = state.list.concat(items);
        state.params.offset = offset;
      }
      if (offset == '' && !isSearch) {
        state.isFinished = true;
      }
    } else {
      context.proxy.$toast({
        icon: 'error',
        text: t('botList.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`),
      });
    }
  });
}

search(true);
</script>

<template>
  <PageSection title-key="menu.user.bots" body-class="cim-log-contanier">
    <div class="cim-log-header">
      <ul class="cim-log-header-lf-box">
        <li class="cim-log-lf-item">
          <input
            class="form-control"
            type="text"
            v-model="state.params.user_id"
            :placeholder="t('botList.field.botId')"
            autocomplete="off"
            @keydown.enter="onSearch"
          />
        </li>
        <li class="cim-log-lf-item">
          <input
            class="form-control"
            type="text"
            v-model="state.params.keywords"
            :placeholder="t('botList.field.nickname')"
            autocomplete="off"
            @keydown.enter="onSearch"
          />
        </li>
        <li class="cim-log-lf-item">
          <div class="cim-button cim-button-bg" @click="onSearch">{{ t('common.action.search') }}</div>
        </li>
        <li class="cim-log-lf-item">
          <div class="cim-button cim-button-bg" @click="onCreate">{{ t('botList.action.create') }}</div>
        </li>
      </ul>
    </div>
    <div class="cim-log-body">
      <table class="table cim-table">
        <thead>
          <tr>
            <th class="cim-td-c">{{ t('botList.table.nickname') }}</th>
            <th class="cim-td-c">{{ t('botList.table.botId') }}</th>
            <th class="cim-td-c">{{ t('botList.table.createdTime') }}</th>
            <th class="cim-td-c">{{ t('botList.table.webhookUrl') }}</th>
            <th class="cim-td-c">{{ t('botList.table.onlyMentioned') }}</th>
            <th class="cim-td-c">{{ t('botList.table.operation') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in state.list" :key="item.bot_id">
            <td class="cim-td-c">
              <div class="cim-userlist-info">
                <Avatar
                  :user-id="item.bot_id"
                  :name="item.nickname"
                  :avatar="item.avatar"
                  :cls="'cim-small-avatar'"
                ></Avatar>
                <div class="nickname">{{ item.nickname }}</div>
              </div>
            </td>
            <td class="cim-td-c">{{ item.bot_id }}</td>
            <td class="cim-td-c">{{ item.time }}</td>
            <td class="cim-td-c">{{ item.webhookUrl }}</td>
            <td class="cim-td-c">{{ item.onlyMentionedName }}</td>
            <td class="cim-td-c">
              <ul class="cim-table-tools">
                <li class="cim-table-tool">
                  <a class="btn-link" href="#" @click.prevent="onEdit(item)">{{ t('botList.action.edit') }}</a>
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
          <li class="page-item">
            <a class="page-link" href="#" v-if="!state.isFinished" aria-label="Next" @click.prevent="onNext">
              <span aria-hidden="true">{{ t('common.action.nextPage') }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <DialogBot :show="state.isShowDialog" :item="state.currentBot" @hide="onShowDialog(false)" @save="onSave" />
  </PageSection>
</template>
