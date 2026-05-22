<script setup>
import { reactive, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import utils from '../../common/utils.js';
import { Application } from '../../services';
import { RESPONSE } from '../../common/enum';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';
import StorageDialog from '@/components/dialog-storage.vue';

const context = getCurrentInstance();
const router = useRouter();
const {
  currentRoute: {
    _rawValue: {
      params: { app_key },
    },
  },
} = router;

const STORAGE_CHANNELS = [
  {
    uid: 'aws',
    name: 'AWS',
    nameKey: 'storageConfig.channel.aws',
    avatarText: 'AWS',
    children: [
      { key: 'access_key', name: 'Access Key', type: 'text', value: '' },
      { key: 'secret_key', name: 'Secret Key', type: 'text', value: '', secretValue: '**************' },
      { key: 'endpoint', name: 'Endpoint', type: 'text', value: '' },
      { key: 'region', name: 'Region', type: 'text', value: '' },
      { key: 'bucket', name: 'Bucket Name', type: 'text', value: '' },
    ],
  },
  {
    uid: 'qiniu',
    name: 'Qiniu',
    nameKey: 'storageConfig.channel.qiniu',
    avatarText: 'QN',
    children: [
      { key: 'access_key', name: 'Access Key', type: 'text', value: '' },
      { key: 'secret_key', name: 'Secret Key', type: 'text', value: '', secretValue: '**************' },
      { key: 'domain', name: 'Domain Name', type: 'text', value: '' },
      { key: 'bucket', name: 'Bucket Name', type: 'text', value: '' },
    ],
  },
  {
    uid: 'oss',
    name: 'Alibaba Cloud',
    nameKey: 'storageConfig.channel.oss',
    avatarText: 'OSS',
    children: [
      { key: 'access_key', name: 'Access Key', type: 'text', value: '' },
      { key: 'secret_key', name: 'Secret Key', type: 'text', value: '', secretValue: '**************' },
      { key: 'endpoint', name: 'Endpoint', type: 'text', value: '' },
      { key: 'bucket', name: 'Bucket Name', type: 'text', value: '' },
    ],
  },
  {
    uid: 'minio',
    name: 'MinIO',
    nameKey: 'storageConfig.channel.minio',
    avatarText: 'M',
    children: [
      { key: 'access_key', name: 'Access Key', type: 'text', value: '' },
      { key: 'secret_key', name: 'Secret Key', type: 'text', value: '', secretValue: '**************' },
      { key: 'endpoint', name: 'Endpoint', type: 'text', value: '' },
      {
        key: 'use_ssl',
        name: 'Enable HTTPS',
        labelKey: 'storageConfig.field.useHttps',
        type: 'radios',
        value: false,
        radios: [
          { value: false, label: 'Disable', labelKey: 'storageConfig.option.disabled' },
          { value: true, label: 'Enable', labelKey: 'storageConfig.option.enabled' },
        ],
      },
      { key: 'bucket', name: 'Bucket Name', type: 'text', value: '' },
    ],
  },
];

const state = reactive({
  list: createChannels(),
  current: createChannels()[0],
  isShowDialog: false,
});

function createChannels() {
  return utils.clone(STORAGE_CHANNELS);
}

function getLabel(key, fallback = '') {
  return key ? t(key, {}, fallback) : fallback;
}

function getChannelName(channel) {
  if (!channel) {
    return '';
  }
  return getLabel(channel.nameKey, channel.name);
}

function getFieldLabel(field) {
  return getLabel(field.labelKey, field.name);
}

function isRequestSuccess(code) {
  return utils.isUndefined(code) || utils.isEqual(code, RESPONSE.SUCCESS);
}

function showRequestError(result = {}) {
  let { code = '', msg = '' } = result;
  context.proxy.$toast({
    icon: 'error',
    text: t('common.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`),
  });
}

function hasConfiguredFields(children = []) {
  return children.some((field) => {
    if (field.type === 'radios') {
      return false;
    }
    return !utils.isEmpty(field.value);
  });
}

function hasFieldValue(field) {
  if (field.type === 'radios') {
    return true;
  }
  return !utils.isEmpty(field.value);
}

function getFieldValue(field) {
  if (field.type === 'radios') {
    let option = (field.radios || []).find((item) => utils.isEqual(item.value, field.value));
    return option ? getLabel(option.labelKey, option.label) : t('common.status.unset');
  }
  return field.secretValue || field.value;
}

function getDialogTitle(channel) {
  let name = getChannelName(channel);
  if (channel?.isConfigured) {
    return t('storageConfig.dialog.editConfig');
  }
  return t('storageConfig.action.addConfig', { name }, `Add ${name} Config`);
}

function onShowDialog(isShow, item) {
  state.isShowDialog = isShow;
  if (isShow && item) {
    state.current = item;
  }
}

function syncChannel(item, conf = {}) {
  item.children = utils.map(item.children, (field) => {
    let value = Object.prototype.hasOwnProperty.call(conf, field.key) ? conf[field.key] : field.value;
    return { ...field, value };
  });
  item.isConfigured = hasConfiguredFields(item.children) || item.isConfigured;
}

function updateUsedChannel(channel = '') {
  utils.forEach(state.list, (item) => {
    item.isUsed = utils.isEqual(item.uid, channel);
    if (item.isUsed) {
      state.current = item;
    }
  });
}

async function onSave(params) {
  let { uid, fields } = params;
  let item = state.list.find((channel) => utils.isEqual(channel.uid, uid));
  let isModify = item?.isConfigured;
  let conf = {};

  utils.forEach(fields, (field) => {
    conf[field.key] = field.value;
  });

  let result = await Application.setStorageConfig({
    app_key,
    channel: uid,
    conf,
  });

  if (!isRequestSuccess(result?.code)) {
    return showRequestError(result);
  }

  if (item) {
    item.children = utils.clone(fields);
    item.isConfigured = true;
    if (item.isUsed) {
      state.current = item;
    }
  }

  context.proxy.$toast({
    icon: 'success',
    text: t(isModify ? 'storageConfig.feedback.editSuccess' : 'storageConfig.feedback.addSuccess'),
  });
  onShowDialog(false);
}

async function onEnable(item) {
  let result = await Application.setEnableStorage({ app_key, channel: item.uid });
  if (!isRequestSuccess(result?.code)) {
    return showRequestError(result);
  }
  updateUsedChannel(item.uid);
  context.proxy.$toast({ icon: 'success', text: t('storageConfig.feedback.saveSuccess') });
}

async function onDisable() {
  let result = await Application.setEnableStorage({ app_key, channel: '' });
  if (!isRequestSuccess(result?.code)) {
    return showRequestError(result);
  }
  updateUsedChannel('');
  context.proxy.$toast({ icon: 'success', text: t('storageConfig.feedback.saveSuccess') });
}

async function init() {
  let list = createChannels();
  let enableResult = await Application.getEnableStorage({ app_key });

  if (!isRequestSuccess(enableResult?.code)) {
    showRequestError(enableResult);
    state.list = list;
    state.current = list[0];
    return;
  }

  let { file_confs = [] } = enableResult?.data || {};
  let currentChannel = '';
  let configuredMap = {};

  utils.forEach(file_confs, (conf) => {
    configuredMap[conf.channel] = true;
    if (conf.enable) {
      currentChannel = conf.channel;
    }
  });

  let results = await Promise.all(
    list.map((item) =>
      Application.getStorageConfig({ app_key, channel: item.uid }).catch(() => ({ data: {} }))
    )
  );

  utils.forEach(list, (item, index) => {
    let result = results[index] || {};
    let conf = result?.data?.conf || {};
    item.isUsed = utils.isEqual(item.uid, currentChannel);
    item.isConfigured = Boolean(configuredMap[item.uid]);
    syncChannel(item, conf);
    if (item.isUsed) {
      state.current = item;
    }
  });

  state.list = list;
  if (!currentChannel) {
    state.current = list[0];
  }
}

init();
</script>

<template>
  <PageSection title-key="menu.app.storageSettings" body-class="cim-r3-container">
    <ul class="cim-r3-body">
      <li class="cim-r3-item" v-for="item in state.list" :key="item.uid">
        <div class="cim-r3-item-header">
          <div class="cim-r3-header-info">
            <div class="cim-r3-item-name">
              {{ getChannelName(item) }}
            </div>
          </div>
          <div class="cim-r3-header-status">
            <span class="life-status" v-if="item.isUsed">{{ t('common.status.enabled') }}</span>
            <span class="life-unuse-status success" v-else>{{ t('common.status.disabled') }}</span>
          </div>
        </div>
        <ul class="cim-r3-item-contents">
          <li class="cim-rtc-item-content" v-for="field in item.children" :key="`${item.uid}-${field.key}`">
            <div class="title">{{ getFieldLabel(field) }}:</div>
            <div class="value" v-if="hasFieldValue(field)">{{ getFieldValue(field) }}</div>
            <div class="value unset" v-else>{{ t('common.status.unset') }}</div>
          </li>
        </ul>
        <ul class="cim-r3-item-tools">
          <li class="cim-r3-item-tool cicon wr-update" @click="onShowDialog(true, item)">{{ t('common.action.settings') }}</li>
          <li class="cim-r3-item-tool cicon wr-disable warn" v-if="item.isUsed" @click="onDisable()">{{ t('common.action.disable') }}</li>
          <li class="cim-r3-item-tool cicon wr-enable" v-if="!item.isUsed && item.isConfigured" @click="onEnable(item)">{{ t('common.action.enable') }}</li>
        </ul>
      </li>
    </ul>
    <StorageDialog
      :show="state.isShowDialog"
      :title="getDialogTitle(state.current)"
      :channel="state.current"
      @save="onSave"
      @hide="onShowDialog(false)"
    />
  </PageSection>
</template>