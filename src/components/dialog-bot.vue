<script setup>
import Dialog from './dialog.vue';
import { reactive, computed, getCurrentInstance, watch } from 'vue';
import utils from '../common/utils';
import { t } from '@/i18n';

const context = getCurrentInstance();
const props = defineProps(['show', 'item']);
const emit = defineEmits(['save', 'hide']);

const defaultState = {
  bot_id: '',
  nickname: '',
  avatar: '',
  url: '',
  api_key: '',
  is_stream: false,
  only_mentioned: false,
};

let state = reactive(utils.clone(defaultState));

const isEdit = computed(() => Boolean(props.item && props.item.bot_id));

function onSave() {
  let botId = (state.bot_id || '').trim();
  if (!isEdit.value && utils.isEmpty(botId)) {
    return context.proxy.$toast({ icon: 'error', text: t('botList.validation.botIdRequired') });
  }
  if (utils.isEqual(state.nickname.length, 0)) {
    return context.proxy.$toast({ icon: 'error', text: t('botList.validation.nicknameRequired') });
  }
  let payload = {
    nickname: state.nickname,
    avatar: state.avatar,
    bot_conf: {
      url: state.url,
      api_key: state.api_key,
      is_stream: state.is_stream,
    },
    bot_settings: {
      only_mentioned: state.only_mentioned,
    },
  };
  if (botId) {
    payload.bot_id = botId;
  }
  emit('save', payload);
}

function onHide() {
  emit('hide', {});
}

function fillState(item = {}) {
  let botConf = item.bot_conf || {};
  let botSettings = item.bot_settings || {};
  utils.extend(state, {
    bot_id: item.bot_id || '',
    nickname: item.nickname || '',
    avatar: item.avatar || '',
    url: botConf.url || '',
    api_key: botConf.api_key || '',
    is_stream: !!botConf.is_stream,
    only_mentioned: !!botSettings.only_mentioned,
  });
}

watch(
  () => props.show,
  (val) => {
    if (!val) {
      utils.extend(state, utils.clone(defaultState));
      return;
    }
    fillState(props.item || {});
  },
);
</script>

<template>
  <Dialog
    :title="isEdit ? t('botList.dialog.editTitle') : t('botList.dialog.createTitle')"
    :show="props.show"
    :btn-title="t('botList.dialog.save')"
    :cls="'cim-bot-dialog'"
    @hide="onHide"
    @save="onSave"
  >
    <div class="cim-bot-form">
      <section class="cim-bot-section">
        <div class="cim-bot-section-title">{{ t('botList.section.basic') }}</div>
        <div class="cim-bot-section-body">
          <div
            class="form-floating cim-bot-field-full"
            :class="{ 'cim-from-must cicon cicon-must': !isEdit }"
          >
            <input
              v-if="isEdit"
              class="form-control"
              :value="state.bot_id"
              disabled
            />
            <input
              v-else
              class="form-control"
              :placeholder="t('botList.field.botId')"
              v-model="state.bot_id"
            />
            <label>{{ t('botList.field.botId') }}</label>
          </div>
          <div class="form-floating cim-from-must cicon cicon-must">
            <input class="form-control" :placeholder="t('botList.field.nickname')" v-model="state.nickname" />
            <label>{{ t('botList.field.nickname') }}</label>
          </div>
          <div class="form-floating">
            <input class="form-control" :placeholder="t('botList.field.avatar')" v-model="state.avatar" />
            <label>{{ t('botList.field.avatar') }}</label>
          </div>
        </div>
      </section>

      <div class="cim-bot-divider"></div>

      <section class="cim-bot-section">
        <div class="cim-bot-section-title">{{ t('botList.section.callback') }}</div>
        <div class="cim-bot-section-body">
          <div class="form-floating cim-bot-field-full">
            <input class="form-control" :placeholder="t('botList.field.webhookUrl')" v-model="state.url" />
            <label>{{ t('botList.field.webhookUrl') }}</label>
          </div>
          <div class="form-floating cim-bot-field-full">
            <input class="form-control" :placeholder="t('botList.field.apiKey')" v-model="state.api_key" />
            <label>{{ t('botList.field.apiKey') }}</label>
          </div>
          <div class="form-check cim-bot-field-full">
            <input class="form-check-input" type="checkbox" id="bot-is-stream" v-model="state.is_stream" />
            <label class="form-check-label" for="bot-is-stream">{{ t('botList.field.isStream') }}</label>
          </div>
        </div>
      </section>

      <div class="cim-bot-divider"></div>

      <section class="cim-bot-section">
        <div class="cim-bot-section-title">{{ t('botList.section.message') }}</div>
        <div class="cim-bot-section-body">
          <div class="form-check cim-bot-field-full">
            <input class="form-check-input" type="checkbox" id="bot-only-mentioned" v-model="state.only_mentioned" />
            <label class="form-check-label" for="bot-only-mentioned">{{ t('botList.field.onlyMentioned') }}</label>
          </div>
        </div>
      </section>
    </div>
  </Dialog>
</template>
