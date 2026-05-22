<script setup>
import { getCurrentInstance, reactive } from 'vue';
import { useRouter } from 'vue-router';
import utils from '../../common/utils';
import { Application } from '../../services';
import { RESPONSE } from '../../common/enum';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

const context = getCurrentInstance();
const router = useRouter();
const { currentRoute: { _rawValue: { params: { app_key } } } } = router;
const transparentDragImage = new Image();
transparentDragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
let ruleSeed = 0;

function createRule(data = {}) {
  ruleSeed += 1;
  return {
    local_id: `rule-${Date.now()}-${ruleSeed}`,
    id: data.id || '',
    channel_type: data.channel_type ? String(data.channel_type) : '*',
    sender_id: data.sender_id || '',
    target_id: data.target_id || data.receiver_id || '',
    msg_type: data.msg_type || '',
  };
}

let state = reactive({
  config: {
    event_sub_url: '',
  },
  interceptor_id: '',
  initial_request_url: '',
  initial_rules: [],
  rules: [createRule()],
  draggingRuleId: '',
  dragOverRuleId: '',
});

function normalizeRule(rule = {}) {
  return {
    id: rule.id || '',
    channel_type: rule.channel_type ? String(rule.channel_type) : '',
    msg_type: rule.msg_type || '',
    sender_id: rule.sender_id || '',
    receiver_id: rule.receiver_id || rule.target_id || '',
  };
}

function getRuleComparable(rule = {}) {
  let normalizedRule = normalizeRule(rule);
  return {
    channel_type: normalizedRule.channel_type,
    msg_type: normalizedRule.msg_type,
    sender_id: normalizedRule.sender_id,
    receiver_id: normalizedRule.receiver_id,
  };
}

function isRuleEmpty(rule = {}) {
  let comparableRule = getRuleComparable(rule);
  return !comparableRule.channel_type && !comparableRule.msg_type && !comparableRule.sender_id && !comparableRule.receiver_id;
}

function getRulePayload(rule, interceptorId) {
  return {
    app_key,
    interceptor_id: interceptorId,
    ...getRuleComparable(rule),
  };
}

function getActiveRules() {
  return state.rules.filter((rule) => {
    return !isRuleEmpty(rule) || Boolean(rule.id);
  });
}

function setRules(items = []) {
  if (items.length === 0) {
    state.initial_rules = [];
    state.rules = [createRule()];
    return;
  }
  state.initial_rules = utils.clone(items).map((item) => normalizeRule(item));
  state.rules = items.map((item) => createRule(item));
}

function getInterceptorIdFromResponse(result = {}) {
  let data = result?.data || {};
  return data.id || data.interceptor_id || data?.item?.id || '';
}

function getConditionIdFromResponse(result = {}) {
  let data = result?.data || {};
  return data.id || data.condition_id || data?.item?.id || '';
}

function showRequestError(error) {
  let code = error?.code ?? error?.status ?? '';
  let msg = error?.msg || error?.message || '';
  context.proxy.$toast({ icon: 'error', text: t('common.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`) });
}

function ensureSuccess(result) {
  let { code, msg = '' } = result || {};
  if (!utils.isEqual(code, RESPONSE.SUCCESS)) {
    throw { code, msg };
  }
  return result;
}

async function loadRules(interceptorId) {
  if (!interceptorId) {
    setRules([]);
    return;
  }
  let result = await Application.getInterceptorConditionList({ app_key, interceptor_id: interceptorId });
  let { data = {} } = ensureSuccess(result);
  setRules(data.items || []);
}

async function getFirstInterceptor() {
  let result = await Application.getInterceptorList({ app_key });
  let { data = {} } = ensureSuccess(result);
  return (data.items || [])[0] || null;
}

async function loadInterceptors() {
  let interceptor = await getFirstInterceptor();
  if (!interceptor) {
    state.interceptor_id = '';
    state.initial_request_url = '';
    state.config.event_sub_url = '';
    setRules([]);
    return;
  }
  state.interceptor_id = interceptor.id;
  state.initial_request_url = interceptor.request_url || '';
  state.config.event_sub_url = interceptor.request_url || '';
  await loadRules(interceptor.id);
}

async function loadPageData() {
  try {
    await loadInterceptors();
  } catch (error) {
    showRequestError(error);
  }
}

async function ensureInterceptorSaved() {
  let requestUrl = state.config.event_sub_url.trim();
  state.config.event_sub_url = requestUrl;
  let interceptorId = state.interceptor_id;

  if (!interceptorId) {
    let addResult = ensureSuccess(await Application.addInterceptor({
      app_key,
      request_url: requestUrl,
      intercept_type: 0,
    }));
    interceptorId = getInterceptorIdFromResponse(addResult);
    if (!interceptorId) {
      let interceptor = await getFirstInterceptor();
      interceptorId = interceptor?.id || '';
    }
    if (!interceptorId) {
      throw { code: '', msg: 'Interceptor ID not found after creation' };
    }
    state.interceptor_id = interceptorId;
    state.initial_request_url = requestUrl;
    return interceptorId;
  }

  if (!utils.isEqual(requestUrl, state.initial_request_url)) {
    ensureSuccess(await Application.updateInterceptor({
      id: interceptorId,
      app_key,
      request_url: requestUrl,
      intercept_type: 0,
    }));
    state.initial_request_url = requestUrl;
  }

  return interceptorId;
}

async function syncRules(interceptorId) {
  let currentRules = getActiveRules();
  let currentRuleIds = currentRules.filter((rule) => rule.id).map((rule) => rule.id);
  let initialRuleMap = {};
  let initialRuleIds = state.initial_rules.filter((rule) => rule.id).map((rule) => rule.id);
  let hasOrderChanged = JSON.stringify(initialRuleIds) !== JSON.stringify(currentRuleIds);

  state.initial_rules.forEach((rule) => {
    if (rule.id) {
      initialRuleMap[rule.id] = rule;
    }
  });

  for (let i = 0; i < state.initial_rules.length; i += 1) {
    let initialRule = state.initial_rules[i];
    if (initialRule.id && !currentRuleIds.includes(initialRule.id)) {
      ensureSuccess(await Application.deleteInterceptorCondition({
        id: initialRule.id,
        app_key,
      }));
    }
  }

  if (hasOrderChanged) {
    for (let i = 0; i < state.initial_rules.length; i += 1) {
      let initialRule = state.initial_rules[i];
      if (!initialRule.id || !currentRuleIds.includes(initialRule.id)) {
        continue;
      }
      ensureSuccess(await Application.deleteInterceptorCondition({
        id: initialRule.id,
        app_key,
      }));
    }

    for (let i = 0; i < currentRules.length; i += 1) {
      let rule = currentRules[i];
      let addResult = ensureSuccess(await Application.addInterceptorCondition(getRulePayload(rule, interceptorId)));
      rule.id = getConditionIdFromResponse(addResult);
    }
    return;
  }

  for (let i = 0; i < currentRules.length; i += 1) {
    let rule = currentRules[i];
    let payload = getRulePayload(rule, interceptorId);
    if (!rule.id) {
      let addResult = ensureSuccess(await Application.addInterceptorCondition(payload));
      rule.id = getConditionIdFromResponse(addResult);
      continue;
    }

    let initialRule = initialRuleMap[rule.id];
    if (!initialRule) {
      continue;
    }

    if (JSON.stringify(getRuleComparable(rule)) !== JSON.stringify(getRuleComparable(initialRule))) {
      ensureSuccess(await Application.updateInterceptorCondition({
        id: rule.id,
        ...payload,
      }));
    }
  }
}

async function onSaveConfig() {
  if (!state.config.event_sub_url) {
    context.proxy.$toast({ icon: 'error', text: t('appServices.messageIntercept.feedback.callbackRequired') });
    return;
  }
  try {
    let interceptorId = await ensureInterceptorSaved();
    await syncRules(interceptorId);
    await loadInterceptors();
    context.proxy.$toast({ icon: 'success', text: t('appServices.messageIntercept.feedback.saveSuccess') });
  } catch (error) {
    showRequestError(error);
  }
}

function addRule(index) {
  state.rules.splice(index + 1, 0, createRule());
}

function deleteRule(index) {
  if (state.rules.length === 1) {
    state.rules.splice(0, 1, createRule());
    return;
  }
  state.rules.splice(index, 1);
}

function moveRule(sourceIndex, targetIndex) {
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return;
  }
  const [movedRule] = state.rules.splice(sourceIndex, 1);
  state.rules.splice(targetIndex, 0, movedRule);
}

function onDragStart(ruleId, event) {
  state.draggingRuleId = ruleId;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', ruleId);
    event.dataTransfer.setDragImage(transparentDragImage, 0, 0);
  }
}

function onDragOver(ruleId) {
  if (!state.draggingRuleId || utils.isEqual(state.draggingRuleId, ruleId)) {
    return;
  }
  state.dragOverRuleId = ruleId;
}

function onDrop(ruleId, event) {
  const sourceRuleId = state.draggingRuleId || event.dataTransfer?.getData('text/plain');
  const sourceIndex = state.rules.findIndex((rule) => utils.isEqual(rule.local_id, sourceRuleId));
  const targetIndex = state.rules.findIndex((rule) => utils.isEqual(rule.local_id, ruleId));
  moveRule(sourceIndex, targetIndex);
  onDragEnd();
}

function onDragEnd() {
  state.draggingRuleId = '';
  state.dragOverRuleId = '';
}

loadPageData();
</script>

<template>
  <PageSection
    title-key="menu.app.messageIntercept"
    shell-class="mi-page-shell"
    body-class="mi-page-body"
  >
    <div class="mi-board">
      <div class="mi-board-body">
        <div class="mi-callback-row">
          <div class="mi-inline-label">{{ t('appServices.messageIntercept.section.callback') }}</div>
          <input
            v-model="state.config.event_sub_url"
            class="form-control mi-inline-input"
            type="text"
            :placeholder="t('appServices.messageIntercept.placeholder.eventUrl')"
          >
          <div class="cim-button cim-button-bg cim-webhook-save" @click.stop="onSaveConfig">
            {{ t('common.dialog.save') }}
          </div>
        </div>

        <div class="mi-rules-row">
          <div class="mi-inline-label mi-rules-label">{{ t('appServices.messageIntercept.section.rules') }}</div>
          <div class="mi-rule-stack">
            <article
              v-for="(rule, index) in state.rules"
              :key="rule.local_id"
              :class="[
                'mi-rule-card',
                utils.isEqual(state.draggingRuleId, rule.local_id) ? 'is-dragging' : '',
                utils.isEqual(state.dragOverRuleId, rule.local_id) ? 'is-drop-target' : ''
              ]"
              @dragover.prevent="onDragOver(rule.local_id)"
              @drop.prevent="onDrop(rule.local_id, $event)"
            >
              <select v-model="rule.channel_type" class="form-select mi-rule-control">
                <option value="*">{{ t('appServices.conversationList.channel.all') }}</option>
                <option value="1">{{ t('appServices.conversationList.channel.private') }}</option>
                <option value="2">{{ t('appServices.conversationList.channel.group') }}</option>
              </select>

              <input
                v-model="rule.sender_id"
                class="form-control mi-rule-control"
                type="text"
                :placeholder="t('appServices.messageIntercept.field.senderId')"
              >

              <input
                v-model="rule.target_id"
                class="form-control mi-rule-control"
                type="text"
                :placeholder="t('appServices.messageIntercept.field.targetId')"
              >

              <input
                v-model="rule.msg_type"
                class="form-control mi-rule-control"
                type="text"
                :placeholder="t('appServices.messageIntercept.field.messageType')"
              >

              <button
                type="button"
                class="mi-icon-button mi-icon-button-drag is-drag"
                draggable="true"
                :title="t('appServices.messageIntercept.action.drag')"
                @dragstart="onDragStart(rule.local_id, $event)"
                @dragend="onDragEnd"
              ></button>
              <button
                type="button"
                class="mi-icon-button mi-icon-button-add"
                :title="t('common.action.add')"
                @click="addRule(index)"
              ></button>
              <button
                type="button"
                class="mi-icon-button mi-icon-button-delete"
                :title="t('common.action.delete')"
                @click="deleteRule(index)"
              ></button>
            </article>
          </div>
        </div>
      </div>
    </div>
  </PageSection>
</template>
