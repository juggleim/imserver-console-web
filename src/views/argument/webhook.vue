<script setup>
import { reactive, getCurrentInstance } from 'vue';
import { useRouter } from "vue-router";
import utils from '../../common/utils';
import { Application } from "../../services";
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';
let router = useRouter();
let { currentRoute: { _rawValue: { params: { app_key } } } } = router;
const context = getCurrentInstance();

Application.getEventHook({ app_key }).then(({ data = {} }) => {
  let { event_sub_config, event_sub_switch } = data;
  utils.extend(state, { 
    config: event_sub_config,
    hooks: event_sub_switch
  });
});
let state = reactive({
  hooks: [],
  config: {},
});
function onHookChanged(e){
  utils.forEach(state.hooks, (hook) => {
    utils.forEach(hook.items, (item) => {
      if(utils.isEqual(item.key, e.target.id)){
        item.value = Number(e.target.checked);
      }
    })
  });
  onSaveConfig();
}
function onSaveConfig(){
  let { config, hooks } = state;
  Application.setEventHook({ app_key,  config, hooks }).then(() => {
    context.proxy.$toast({ icon: 'success', text: t('appServices.webhook.feedback.saveSuccess') });
  });
}
</script>
<template>
  <PageSection title-key="menu.app.webhookSettings" shell-class="cim-webhook-page" body-class="cim-webhook-body">
    <div class="cim-webhook-panel">
      <div class="cim-webhook-form">
        <div class="cim-webhook-field">
          <label class="cim-webhook-field-label">{{ t('appServices.webhook.field.eventUrl') }}</label>
          <input
            class="form-control cim-webhook-input"
            type="text"
            v-model="state.config.event_sub_url"
            :placeholder="t('appServices.webhook.placeholder.eventUrl')"
          >
        </div>
        <div class="cim-webhook-field">
          <label class="cim-webhook-field-label">{{ t('appServices.webhook.field.authToken') }}</label>
          <input
            class="form-control cim-webhook-input"
            type="text"
            v-model="state.config.event_sub_auth"
            :placeholder="t('appServices.webhook.placeholder.authToken')"
          >
        </div>
        <div class="cim-webhook-actions">
          <div class="cim-button cim-button-bg cim-webhook-save" @click="onSaveConfig">{{ t('common.dialog.save') }}</div>
        </div>
      </div>
    </div>

    <div class="cim-webhook-groups">
      <div class="cim-webhook-group" v-for="hook in state.hooks" :key="hook.name">
        <div class="cim-webhook-group-title">{{ hook.name }}</div>
        <div class="cim-webhook-group-items">
          <label class="cim-webhook-switch" v-for="item in hook.items" :key="item.key">
            <span class="cim-webhook-switch-label">{{ item.name }}</span>
            <input
              class="cim-webhook-toggle"
              type="checkbox"
              :checked="Boolean(item.value)"
              :id="item.key"
              @change="onHookChanged"
            >
          </label>
        </div>
      </div>
    </div>
  </PageSection>
</template>
