<script setup>
import { reactive, getCurrentInstance } from 'vue';
import FInput from "../../components/func/input.vue";
import FSwitch from "../../components/func/switch.vue";
import FInputModal from "../../components/func/input-modal.vue";
import FSelect from "../../components/func/select.vue";
import { FUNC_TYPE } from "../../common/enum";
import utils from '../../common/utils';
import { Application } from "../../services";
import { useRouter } from "vue-router";
import { t } from '@/i18n';

let router = useRouter();
let { currentRoute: { _rawValue: { params: { app_key } } } } = router;

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
    ] 
  },
  {
    type: 'message', 
    name: 'Message Settings',
    labelKey: 'switchConfig.section.message',
    list: [ 
      { id: 'is_hide_msg_before_join_group', type: 'switch', name: 'Fetch history sent before joining a group', labelKey: 'switchConfig.item.is_hide_msg_before_join_group', value: 0 },
      { id: 'not_check_grp_member', type: 'switch', name: 'Allow non-members to fetch group messages', labelKey: 'switchConfig.item.not_check_grp_member', value: 0 },
      { id: 'his_msg_save_day', type: 'select', name: 'Message retention (days)', labelKey: 'switchConfig.item.his_msg_save_day', value: '7', options: [{ key: '7', value: '7 days', labelKey: 'switchConfig.option.save7days' }, { key: '360', value: '1 year', labelKey: 'switchConfig.option.save1year' }] },
    ] 
  },
  {
    type: 'group', 
    name: 'Group Settings',
    labelKey: 'switchConfig.section.group',
    list: [ 
      { id: 'max_grp_member_count', type: 'input', name: 'Group member limit', labelKey: 'switchConfig.item.max_grp_member_count', value: 1000 },
    ] 
  },
  {
    type: 'chatroom', 
    name: 'Chatroom Settings',
    labelKey: 'switchConfig.section.chatroom',
    list: [ 
      { id: 'chrm_msg_cache_max_count', type: 'input', name: 'Chatroom message bucket size', labelKey: 'switchConfig.item.chrm_msg_cache_max_count', value: 50 },
      { id: 'chrm_att_max_count', type: 'input', name: 'Chatroom attribute limit', labelKey: 'switchConfig.item.chrm_att_max_count', value: 100 },
      { id: 'chrm_event_ntf', type: 'switch', name: 'Enable chatroom event notifications', labelKey: 'switchConfig.item.chrm_event_ntf', value: false },
      { id: 'chrm_event_cache_max_count', type: 'input', name: 'Chatroom event bucket size', labelKey: 'switchConfig.item.chrm_event_cache_max_count', value: 50 },
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
function search(){
  let config_keys = [];
  iterate(settings, (item) => {
    config_keys.push(item.id);
  });
  Application.getSetting({ app_key, config_keys }).then(({ data}) => {
    let { configs } = data;
    iterate(state.settings, (item) => {
      utils.forEach(configs, (v, k) => {
        if(utils.isEqual(item.id, k)){
          item.value = v;
        }
      });
    });
  });
}
search();
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
        <a class="cim-switch-tab" :class="{ 'active': utils.isEqual(state.current, setting.type) }">
          {{ setting.labelKey ? t(setting.labelKey, {}, setting.name) : setting.name }}
        </a>
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
              <FSelect v-if="utils.isEqual(item.type, FUNC_TYPE.SELECT)" :item="item" @save="onSave"></FSelect>
              <FSwitch v-if="utils.isEqual(item.type, FUNC_TYPE.SWITCH)" :item="item" @save="onSave"></FSwitch>
              <FInputModal v-if="utils.isEqual(item.type, FUNC_TYPE.INPUT_MODAL)" :item="item" @save="onSave"></FInputModal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
