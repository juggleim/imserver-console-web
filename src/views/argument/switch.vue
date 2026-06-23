<script setup>
import { reactive, getCurrentInstance, watch } from 'vue';
import FInput from "../../components/func/input.vue";
import FInputText from "../../components/func/inputText.vue";
import FSwitch from "../../components/func/switch.vue";
import FInputModal from "../../components/func/input-modal.vue";
import FSelect from "../../components/func/select.vue";
import { FUNC_TYPE } from "../../common/enum";
import utils from '../../common/utils';
import { Application } from "../../services";
import { useRoute } from "vue-router";
import { t } from '@/i18n';

const route = useRoute();

const context = getCurrentInstance();

let settings = [
{
    type: 'app', 
    name: 'App Settings',
    labelKey: 'switchConfig.section.app',
    list: [ 
      { id: 'token_effective_minute', type: 'input', name: 'Token validity (hours)', labelKey: 'switchConfig.item.token_effective_minute', value: 0 },
      { id: 'kick_mode', type: 'switch', name: 'Allow multi-end login on the same device', labelKey: 'switchConfig.item.kick_mode', value: 0 },
      { id: 'security_domains', type: FUNC_TYPE.INPUT_MODAL, name: 'Security domains', labelKey: 'switchConfig.item.security_domains', value: '{ "domains": [] }' },
      { id: 'open_status_sub', type: 'switch', name: 'Enable status subscription', labelKey: 'switchConfig.item.open_status_sub', value: 0 },
      { id: 'open_griend_status_sub', type: 'switch', name: 'Friends subscribe by default', labelKey: 'switchConfig.item.open_griend_status_sub', value: 0 },
      { id: 'record_connect_logs', type: 'switch', name: 'Enable connection logs', labelKey: 'switchConfig.item.record_connect_logs', value: 0 },
      { id: 'check_user_device', type: 'switch', name: 'Enable device binding check', labelKey: 'switchConfig.item.check_user_device', value: 0 },
    ] 
  },
  {
    type: 'message', 
    name: 'Message Settings',
    labelKey: 'switchConfig.section.message',
    list: [ 
      { id: 'is_open_push', type: 'switch', name: 'Enable push', labelKey: 'switchConfig.item.is_open_push', value: 1 },
      { id: 'push_language', type: FUNC_TYPE.INPUT_TEXT, name: 'Default push language', labelKey: 'switchConfig.item.push_language', value: 'en_US', defaultValue: 'en_US' },
      { id: 'record_msg_logs', type: 'switch', name: 'Enable message logs', labelKey: 'switchConfig.item.record_msg_logs', value: 0 },
      { id: 'open_remark', type: 'switch', name: 'Enable friend remarks', labelKey: 'switchConfig.item.open_remark', value: 0 },
      { id: 'global_private_mute', type: 'switch', name: 'Mute all private chats', labelKey: 'switchConfig.item.global_private_mute', value: 0 },
      { id: 'msg_friend_check', type: 'switch', name: 'Validate friend relationship when sending messages', labelKey: 'switchConfig.item.msg_friend_check', value: 0 },
      { id: 'his_msg_save_day', type: 'select', name: 'Message retention (days)', labelKey: 'switchConfig.item.his_msg_save_day', value: '7', options: [{ key: '7', value: '7 days', labelKey: 'switchConfig.option.save7days' }, { key: '360', value: '1 year', labelKey: 'switchConfig.option.save1year' }] },
    ] 
  },
  {
    type: 'group', 
    name: 'Group Settings',
    labelKey: 'switchConfig.section.group',
    list: [ 
      { id: 'is_hide_msg_before_join_group', type: 'switch', name: 'Fetch history sent before joining a group', labelKey: 'switchConfig.item.is_hide_msg_before_join_group', value: 0 },
      { id: 'not_check_grp_member', type: 'switch', name: 'Allow non-members to fetch group messages', labelKey: 'switchConfig.item.not_check_grp_member', value: 0 },
      { id: 'global_group_mute', type: 'switch', name: 'Mute all group chats', labelKey: 'switchConfig.item.global_group_mute', value: 0 },
      { id: 'max_grp_member_count', type: 'input', name: 'Group member limit', labelKey: 'switchConfig.item.max_grp_member_count', value: 10000, defaultValue: 10000 },
    ] 
  },
  {
    type: 'conversation',
    name: 'Conversation Settings',
    labelKey: 'switchConfig.section.conversation',
    list: [
      { id: 'record_global_convers', type: 'switch', name: 'Record global conversations', labelKey: 'switchConfig.item.record_global_convers', value: 0 },
      { id: 'open_conver_tags', type: 'switch', name: 'Enable conversation tags', labelKey: 'switchConfig.item.open_conver_tags', value: 0 },
      { id: 'max_user_conver_tags', type: 'input', name: 'Max conversation tags per user', labelKey: 'switchConfig.item.max_user_conver_tags', value: 100, defaultValue: 100 },
    ]
  },
  {
    type: 'chatroom', 
    name: 'Chatroom Settings',
    labelKey: 'switchConfig.section.chatroom',
    list: [ 
      { id: 'chrm_msg_cache_max_count', type: 'input', name: 'Chatroom message bucket size', labelKey: 'switchConfig.item.chrm_msg_cache_max_count', value: 50, defaultValue: 50 },
      { id: 'chrm_att_max_count', type: 'input', name: 'Chatroom attribute limit', labelKey: 'switchConfig.item.chrm_att_max_count', value: 100, defaultValue: 100 },
      { id: 'chrm_event_ntf', type: 'switch', name: 'Enable chatroom event notifications', labelKey: 'switchConfig.item.chrm_event_ntf', value: false },
      { id: 'chrm_event_cache_max_count', type: 'input', name: 'Chatroom event bucket size', labelKey: 'switchConfig.item.chrm_event_cache_max_count', value: 50, defaultValue: 50 },
    ] 
  },
  {
    type: 'public',
    name: 'Public Account Settings',
    labelKey: 'switchConfig.section.public',
    list: [
      { id: 'open_public_channel', type: 'switch', name: 'Enable public accounts', labelKey: 'switchConfig.item.open_public_channel', value: 0 },
    ]
  },
  {
    type: 'moment',
    name: 'Moments Settings',
    labelKey: 'switchConfig.section.moment',
    list: [
      { id: 'moment_mode', type: 'select', name: 'Moments mode', labelKey: 'switchConfig.item.moment_mode', value: 'friend', defaultValue: 'friend', options: [{ key: 'friend', value: 'Friend mode', labelKey: 'switchConfig.option.momentFriend' }, { key: 'global', value: 'Global mode', labelKey: 'switchConfig.option.momentGlobal' }] },
    ]
  },
];
let state = reactive({
  settings: settings,
  current: settings[0].type
});

function onTab(setting){
  utils.extend(state, {
    current: setting.type
  });
}

function onSave(item){
  let app_key = route.params.app_key;
  if(utils.isEmpty(app_key)){
    return;
  }
  Application.updateSetting({...item, app_key}).then(() => {
    context.proxy.$toast({ icon: 'success', text: t('switchConfig.feedback.saveSuccess') });
  });
}
function iterate(list, callback){
  utils.forEach(list, (item) => {
    utils.forEach(item.list, (i) => {
      callback(i);
    });
  });
}

function resolveSwitchConfigValue(item, rawValue) {
  if (item.id === 'token_effective_minute' && rawValue) {
    return Number(rawValue) / 60;
  }
  const hasDefault = item.defaultValue !== undefined && item.defaultValue !== null && item.defaultValue !== '';
  if (utils.isEmpty(rawValue) && hasDefault) {
    return item.defaultValue;
  }
  if (item.type === FUNC_TYPE.INPUT && hasDefault && (utils.isEmpty(rawValue) || Number(rawValue) <= 0)) {
    return item.defaultValue;
  }
  return rawValue;
}

function search(){
  let app_key = route.params.app_key;
  if(utils.isEmpty(app_key)){
    return;
  }
  let config_keys = [];
  iterate(settings, (item) => {
    config_keys.push(item.id);
  });
  Application.getSetting({ app_key, config_keys }).then(({ data }) => {
    if(utils.isEmpty(data)){
      return;
    }
    let { configs } = data;
    iterate(state.settings, (item) => {
      utils.forEach(configs, (v, k) => {
        if(utils.isEqual(item.id, k)){
          item.value = resolveSwitchConfigValue(item, v);
        }
      });
    });
  });
}
watch(() => route.params.app_key, () => {
  search();
}, { immediate: true });
</script>
<template>
  <div class="mb-4 app-base cim-switch-page">
    <div class="cim-switch-head">
      <h2 class="cim-switch-title">{{ t('menu.app.featureConfig') }}</h2>
    </div>

    <ul class="cim-switch-tabs" role="tablist">
      <li
        class="cim-switch-tab-item"
        v-for="setting in state.settings"
        :key="setting.type"
        @click="onTab(setting)"
      >
        <span class="cim-switch-tab" :class="{ 'active': utils.isEqual(state.current, setting.type) }">
          {{ setting.labelKey ? t(setting.labelKey, {}, setting.name) : setting.name }}
        </span>
      </li>
    </ul>

    <div class="cim-switch-content">
      <div
        class="cim-switch-panel"
        v-for="setting in state.settings"
        :key="setting.type"
        v-show="utils.isEqual(state.current, setting.type)"
      >
        <div class="cim-switch-list">
          <div class="cim-switch-item" v-for="item in setting.list" :key="item.id">
              <FInput v-if="utils.isEqual(item.type, FUNC_TYPE.INPUT)" :item="item" @save="onSave"></FInput>
              <FInputText v-if="utils.isEqual(item.type, FUNC_TYPE.INPUT_TEXT)" :item="item" @save="onSave"></FInputText>
              <FSelect v-if="utils.isEqual(item.type, FUNC_TYPE.SELECT)" :item="item" @save="onSave"></FSelect>
              <FSwitch v-if="utils.isEqual(item.type, FUNC_TYPE.SWITCH)" :item="item" @save="onSave"></FSwitch>
              <FInputModal v-if="utils.isEqual(item.type, FUNC_TYPE.INPUT_MODAL)" :item="item" @save="onSave"></FInputModal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
