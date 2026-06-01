<script setup>
  import { getCurrentInstance, reactive, ref } from 'vue';
  import utils from '../../common/utils.js';
  import { Application } from '../../services';
  import { useRouter } from 'vue-router';
import { RESPONSE } from '../../common/enum';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

  let router = useRouter();
  let {
    currentRoute: {
      _rawValue: {
        params: { app_key },
      },
    },
  } = router;

  const context = getCurrentInstance();

  let settings = [
    {
      type: 'Huawei',
      name: 'Huawei',
      nameKey: 'appServices.push.channel.Huawei',
      state: ref({
        package: '',
        app_id: '',
        app_secret: '',
      }),
      fields: [
        {
          name: 'package',
          label: 'Package Name',
          labelKey: 'appServices.push.field.package',
          type: 'input_text',
        },
        {
          name: 'app_id',
          label: 'App Id',
          type: 'input_text',
        },
        {
          name: 'app_secret',
          label: 'App Secret',
          type: 'input_text',
        },
      ],
    },
    {
      type: 'Xiaomi',
      name: 'Xiaomi',
      nameKey: 'appServices.push.channel.Xiaomi',
      state: ref({
        package: '',
        app_secret: '',
      }),
      fields: [
        {
          name: 'package',
          label: 'Package Name',
          labelKey: 'appServices.push.field.package',
          type: 'input_text',
        },
        {
          name: 'app_secret',
          label: 'App Secret',
          type: 'input_text',
        },
        {
          name: 'channel_id',
          label: 'ChannelId',
          type: 'input_text',
        },
      ],
    },
    {
      type: 'Oppo',
      name: 'OPPO',
      nameKey: 'appServices.push.channel.Oppo',
      state: ref({
        package: '',
        app_key: '',
        master_secret: '',
      }),
      fields: [
        {
          name: 'package',
          label: 'Package Name',
          labelKey: 'appServices.push.field.package',
          type: 'input_text',
        },
        {
          name: 'app_key',
          label: 'App Key',
          type: 'input_text',
        },
        {
          name: 'master_secret',
          label: 'Master Secret',
          type: 'input_text',
        },
        {
          name: 'channel_id',
          label: 'ChannelId',
          type: 'input_text',
        },
      ],
    },
    {
      type: 'Vivo',
      name: 'VIVO',
      nameKey: 'appServices.push.channel.Vivo',
      state: ref({
        package: '',
        app_id: '',
        app_key: '',
        app_secret: '',
      }),
      fields: [
        {
          name: 'package',
          label: 'Package Name',
          labelKey: 'appServices.push.field.package',
          type: 'input_text',
        },
        {
          name: 'app_id',
          label: 'App Id',
          type: 'input_text',
        },
        {
          name: 'app_key',
          label: 'App Key',
          type: 'input_text',
        },
        {
          name: 'app_secret',
          label: 'App Secret',
          type: 'input_text',
        },
      ],
    },
    {
      type: 'ios',
      name: 'iOS',
      nameKey: 'appServices.push.channel.ios',
      state: ref({
        package: '',
        cert_path: '',
        cert_pwd: '',
        voip_ioscer: '',
        voip_cert_path: '',
        voip_cert_pwd: '',
        is_product: 0,
      }),
      fields: [
        {
          name: 'package',
          label: 'Package Name',
          labelKey: 'appServices.push.field.package',
          type: 'input_text',
        },
        {
          name: 'cert_path',
          label: 'Certificate File',
          labelKey: 'appServices.push.field.certFile',
          type: 'file',
        },
        {
          name: 'cert_pwd',
          label: 'Certificate Password',
          labelKey: 'appServices.push.field.certPassword',
          type: 'input_text',
        },
        {
          name: 'voip_cert_pwd',
          label: 'VoIP Certificate Password',
          labelKey: 'appServices.push.field.voipCertPassword',
          type: 'input_text',
        },
        {
          name: 'voip_cert_path',
          label: 'VoIP Certificate File',
          labelKey: 'appServices.push.field.voipCertFile',
          type: 'voipfile',
        },
        {
          name: 'is_product',
          label: 'Certificate Environment',
          labelKey: 'appServices.push.field.certEnv',
          type: 'radios',
          radios: [
          { name: 'type', value: 0, label: 'Development', labelKey: 'appServices.push.option.dev' },
          { name: 'type', value: 1, label: 'Production', labelKey: 'appServices.push.option.prod' },
          ]
        },
      ],
    },
    {
      type: 'fcm',
      name: 'FCM',
      nameKey: 'appServices.push.channel.fcm',
      state: ref({
        package: '',
        conf_path: '',
        app_key: '',
        fcm_conf: '',
      }),
      fields: [
        {
          name: 'package',
          label: 'Package Name',
          labelKey: 'appServices.push.field.package',
          type: 'input_text',
        },
        {
          name: 'fcm_conf',
          label: 'Certificate File',
          labelKey: 'appServices.push.field.certFile',
          type: 'file',
        },
      ],
    },
    {
      type: 'Jpush',
      name: 'Jpush',
      nameKey: 'appServices.push.channel.Jpush',
      state: ref({
        package: '',
        app_key: '',
        master_secret: '',
      }),
      fields: [
        {
          name: 'package',
          label: 'Package Name',
          labelKey: 'appServices.push.field.package',
          type: 'input_text',
        },
        {
          name: 'app_key',
          label: 'AppKey',
          labelKey: 'appServices.push.field.appKey',
          type: 'input_text',
        },
        {
          name: 'master_secret',
          label: 'MasterSecret',
          labelKey: 'appServices.push.field.masterSecret',
          type: 'input_text',
        },
      ],
    },
    {
      type: 'Honor',
      name: 'Honor',
      nameKey: 'appServices.push.channel.Honor',
      state: ref({
        package: '',
        app_id: '',
        app_key: '',
        app_secret: '',
      }),
      fields: [
        {
          name: 'package',
          label: 'Package Name',
          labelKey: 'appServices.push.field.package',
          type: 'input_text',
        },
        {
          name: 'app_id',
          label: 'AppId',
          labelKey: 'appServices.push.field.appId',
          type: 'input_text',
        },
        {
          name: 'app_key',
          label: 'AppKey',
          labelKey: 'appServices.push.field.appKey',
          type: 'input_text',
        },
        {
          name: 'app_secret',
          label: 'AppSecret',
          labelKey: 'appServices.push.field.appSecret',
          type: 'input_text',
        },
      ],
    },
    {
      type: 'Getui',
      name: 'Getui',
      nameKey: 'appServices.push.channel.Getui',
      state: ref({
        package: '',
        app_id: '',
        app_key: '',
        master_secret: '',
      }),
      fields: [
        {
          name: 'package',
          label: 'Package Name',
          labelKey: 'appServices.push.field.package',
          type: 'input_text',
        },
        {
          name: 'app_id',
          label: 'AppId',
          labelKey: 'appServices.push.field.appId',
          type: 'input_text',
        },
        {
          name: 'app_key',
          label: 'AppKey',
          labelKey: 'appServices.push.field.appKey',
          type: 'input_text',
        },
        {
          name: 'master_secret',
          label: 'MasterSecret',
          labelKey: 'appServices.push.field.masterSecret',
          type: 'input_text',
        },
      ],
    },
  ];

  const channel = ref(settings[0].type);
  const uploadState = reactive(
    settings.reduce((result, setting) => {
      result[setting.type] = {
        file: {},
        voipFile: {},
      };
      return result;
    }, {})
  );
  const fileInputRefs = reactive({});

  function onTab(setting) {
    channel.value = setting.type;
    search();
  }

  function getSettingName(setting) {
    return setting.nameKey ? t(setting.nameKey, {}, setting.name) : setting.name;
  }

  function getFieldLabel(field) {
    return field.labelKey ? t(field.labelKey, {}, field.label) : field.label;
  }

  function getFieldPlaceholder(field) {
    const label = getFieldLabel(field);
    return /^[A-Za-z]/.test(label) ? `请输入 ${label}` : `请输入${label}`;
  }

  function getFileKey(settingType, fieldName) {
    return `${settingType}:${fieldName}`;
  }

  function setFileInputRef(settingType, fieldName, element) {
    const key = getFileKey(settingType, fieldName);
    if (element) {
      fileInputRefs[key] = element;
    } else {
      delete fileInputRefs[key];
    }
  }

  function triggerFileSelect(settingType, fieldName) {
    fileInputRefs[getFileKey(settingType, fieldName)]?.click();
  }

  function onFileSelect(settingType, fieldType, event) {
    const file = event.target.files?.[0] || {};
    if (fieldType === 'voipfile') {
      uploadState[settingType].voipFile = file;
      return;
    }
    uploadState[settingType].file = file;
  }

  function onFileRemove(settingType, fieldType, fieldName) {
    if (fieldType === 'voipfile') {
      uploadState[settingType].voipFile = {};
    } else {
      uploadState[settingType].file = {};
    }
    const input = fileInputRefs[getFileKey(settingType, fieldName)];
    if (input) {
      input.value = '';
    }
  }

  function getSelectedFileName(settingType, fieldType) {
    if (fieldType === 'voipfile') {
      return uploadState[settingType].voipFile?.name || '';
    }
    return uploadState[settingType].file?.name || '';
  }

  function getFieldValue(setting, field) {
    return getSelectedFileName(setting.type, field.type) || setting.state.value[field.name] || '';
  }

  function onSubmit(setting) {
    setting.state.value.file = uploadState[setting.type].file || {};
    setting.state.value.voipFile = uploadState[setting.type].voipFile || {};
    onSave(setting.state.value);
  }

  function onSave(item) {
    if (channel.value.startsWith('ios')) {
      let { file, voipFile } = item;
      if(file.name || voipFile.name){
        return Application.uploadIosPushConfig({
          app_key,
          package: item.package,
          cert_pwd: item.cert_pwd,
          file: item.file,
          is_product: item.is_product,
          voip_cert_pwd: item.voip_cert_pwd,
          voipFile: item.voipFile,
        }).then(() => {
          context.proxy.$toast({ icon: 'success', text: t('appServices.push.feedback.saveSuccess') });
        });
      }

      Application.setIosPushConfig({
        app_key,
        package: item.package,
        cert_pwd: item.cert_pwd,
        voip_cert_pwd: item.voip_cert_pwd,
        is_product: item.is_product,
      }).then(() => {
        context.proxy.$toast({ icon: 'success', text: t('appServices.push.feedback.saveSuccess') });
      });

    } else if(channel.value.startsWith('fcm')){
      Application.uploadFcmPushConfig({
        app_key,
        package: item.package,
        file: item.file,
      }).then(() => {
        context.proxy.$toast({ icon: 'success', text: t('appServices.push.feedback.saveSuccess') });
      });
    } else {
      Application.setAndroidPushConfig({
        app_key,
        push_channel: channel.value,
        package: item.package,
        extra: item,
      }).then(() => {
        context.proxy.$toast({ icon: 'success', text: t('appServices.push.feedback.saveSuccess') });
      });
    }
  }

  async function search() {
    if (channel.value.startsWith('ios')) {
      const res = await Application.getIosPushConfig({ app_key, push_channel: channel.value });
      let { data } = res;
      if(!data){
        data = { is_product: 0 };
      }
      utils.forEach(settings, (item) => {
        if (item.type === channel.value) {
          item.state.value = {
            ...item.state.value,
            package: data.package,
            cert_path: data.cert_path,
            cert_pwd: data.cert_pwd,
            voip_cert_pwd: data.voip_cert_pwd,
            voip_cert_path: data.voip_cert_path,
            is_product: data.is_product,
          };
        }
      });
    }  else if(channel.value.startsWith('fcm')){
      const res = await Application.getFcmPushConfig({ app_key, push_channel: channel.value });
      let { data } = res;
      if(!data){
        data = { is_product: 0 };
      }
      utils.forEach(settings, (item) => {
        if (item.type === channel.value) {
          item.state.value = {
            ...item.state.value,
            package: data.package,
            fcm_conf: data.conf_path,
          };
        }
      });
    }else {
      const res = await Application.getAndroidPushConfig({ app_key, push_channel: channel.value });
      let { code,  data = {} } = res;
      if(!utils.isEqual(code, RESPONSE.SUCCESS)){
        return  context.proxy.$toast({ icon: 'error', text: t('appServices.push.feedback.queryFailed') });;
      }
      utils.forEach(settings, (item) => {
        if (item.type === channel.value) {
          item.state.value = {
            ...item.state.value,
            package: data.package,
            ...data.extra,
          };
        }
      });
    }
  }

  search();
</script>
<template>
  <PageSection title-key="menu.app.pushSettings" shell-class="cim-push-page" body-class="cim-push-content">
    <ul class="nav nav-underline-border cim-push-tabs" role="tablist">
      <li class="nav-item sw-nav-item" v-for="setting in settings" @click="onTab(setting)">
        <a
          class="nav-link cicon cicon-free"
          :class="{ active: utils.isEqual(channel, setting.type) }"
          >{{ getSettingName(setting) }}</a
        >
      </li>
    </ul>
    <div class="tab-content cim-push-tab-content">
      <div
        class="tab-pane cim-push-pane"
        v-for="setting in settings"
        :key="setting.type"
        :class="{ active: utils.isEqual(channel, setting.type) }"
      >
        <div class="cim-push-form-wrap">
          <div class="cim-push-form">
            <div
              class="cim-push-field"
              v-for="field in setting.fields"
              :key="field.name"
            >
              <label class="cim-push-field-label">{{ getFieldLabel(field) }}</label>

              <input
                v-if="field.type === 'input_text'"
                v-model="setting.state.value[field.name]"
                class="form-control cim-push-input"
                type="text"
                :placeholder="getFieldPlaceholder(field)"
              >

              <div
                v-else-if="field.type === 'file' || field.type === 'voipfile'"
                class="cim-push-upload"
              >
                <input
                  :ref="(element) => setFileInputRef(setting.type, field.name, element)"
                  class="cim-push-upload-input"
                  type="file"
                  @change="onFileSelect(setting.type, field.type, $event)"
                >
                <div class="cim-push-upload-name">{{ getFieldValue(setting, field) }}</div>
                <div
                  v-if="getSelectedFileName(setting.type, field.type)"
                  class="cim-push-upload-action cim-push-upload-remove"
                  @click="onFileRemove(setting.type, field.type, field.name)"
                >
                  {{ t('common.form.removeCertificate') }}
                </div>
                <div
                  class="cim-push-upload-action"
                  @click="triggerFileSelect(setting.type, field.name)"
                >
                  {{ t('common.form.addCertificate') }}
                </div>
              </div>

              <div
                v-else-if="field.type === 'radios'"
                class="cim-push-radios"
              >
                <label
                  class="cim-push-radio"
                  v-for="radio in field.radios"
                  :key="`${field.name}-${radio.value}`"
                >
                  <input
                    v-model="setting.state.value[field.name]"
                    class="form-check-input"
                    type="radio"
                    :name="`${setting.type}-${field.name}`"
                    :value="radio.value"
                  >
                  <span class="cim-push-radio-text">
                    {{ radio.labelKey ? t(radio.labelKey, {}, radio.label) : radio.label }}
                  </span>
                </label>
              </div>
            </div>

            <div class="cim-push-actions">
              <div class="cim-button cim-button-bg cim-push-save" @click="onSubmit(setting)">
                {{ t('common.dialog.save') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageSection>
</template>
