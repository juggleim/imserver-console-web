<script setup>
import { reactive, watch, getCurrentInstance, nextTick } from 'vue';
import utils from '../../common/utils';
import { Misc } from "../../services";
import emitter from '../../common/emmit';
import { ErrorType } from "../../common/enum";
import JsonEditor from 'vue3-ts-jsoneditor';
import { apis } from './apis/api';
import { useRouter } from 'vue-router';
import { RESPONSE } from '../../common/enum';
import { t, useI18n } from '@/i18n';
import PageSection from '@/components/page-section.vue';

let router = useRouter();
let context = getCurrentInstance();
let {
    currentRoute: {
      _rawValue: {
        params: { app_key },
      },
    },
  } = router;
const { locale } = useI18n();

const apiCatalogSource = utils.clone(apis);

function translateApiCatalog(type, text) {
  if (!text) {
    return text;
  }
  return t(`tools.api.catalog.${type}.${text}`, {}, text);
}

function localizeApiItem(item) {
  let body = item.body ? utils.clone(item.body) : item.body;
  if (body && body['//']) {
    body['//'] = translateApiCatalog('prompt', body['//']);
  }
  return {
    ...item,
    sourceName: item.name,
    name: translateApiCatalog('name', item.name),
    body,
  };
}

function localizeApiGroup(group) {
  return {
    ...group,
    sourceCategory: group.category,
    category: translateApiCatalog('category', group.category),
    children: group.children.map(localizeApiItem),
  };
}

function syncApiCatalog() {
  const previousGroups = state.apis || [];
  const previousGroupsBySource = previousGroups.reduce((result, group) => {
    result[group.sourceCategory || group.category] = group;
    return result;
  }, {});
  const previousChildrenByUrl = previousGroups.flatMap((group) => group.children || []).reduce((result, item) => {
    result[item.url] = item;
    return result;
  }, {});

  state.apis = apiCatalogSource.map((group) => {
    const localizedGroup = localizeApiGroup(group);
    const previousGroup = previousGroupsBySource[group.category];
    if (previousGroup) {
      localizedGroup.isFold = previousGroup.isFold;
      localizedGroup.isActive = previousGroup.isActive;
    }
    localizedGroup.children = localizedGroup.children.map((child) => {
      const previousChild = previousChildrenByUrl[child.url];
      if (previousChild) {
        child.isActive = previousChild.isActive;
      }
      return child;
    });
    return localizedGroup;
  });

  if (state.currentAPI.url) {
    const currentItem = state.apis.flatMap((group) => group.children || []).find((item) => item.url === state.currentAPI.url);
    state.currentAPI = currentItem || { url: '' };
  }
}

let state = reactive({
  apis: apiCatalogSource.map(localizeApiGroup),
  request: { },
  response: {},
  isJSONContent: false,
  currentAPI: { url: '' }
});
function onShow(item){
  utils.forEach(state.apis, (api) => {
    let _isFold = false;
    let _isActive = false;
    if(utils.isEqual(item.category, api.category)){
      _isFold = !item.isFold;
      _isActive = true;
    }
    // 清理已选中 child 状态
    utils.forEach(api.children, (child) => {
      child.isActive = false;
    });
    api.isFold = _isFold;
    api.isActive = _isActive;
  });
  state.currentAPI = { url: '' };
}
function onAPIClick(item){
  utils.forEach(state.apis, (api) => {
    api.isActive = false;
    utils.forEach(api.children, (child) => {
      child.isActive = utils.isEqual(item.url, child.url);
    });
  });
  state.currentAPI = item;
}
function onInputChange({ text }){
  let content = text.replace(/\n/g, '')
  state.isJSONContent = utils.isJSON(content);
}
function onSend(){
  if(!state.isJSONContent){
    return;
  }
  
  let { request } = state;
  if(utils.isEmpty(request)){
    return;
  }
  if(!utils.isString(request)){
    request = utils.toJSON(request)
  }
  let { currentAPI } = state;
  Misc.ajax({
    path: currentAPI.url,
    app_key: app_key,
    method: currentAPI.method.toUpperCase(),
    body: request
  }).then((result) => {
    state.response = utils.parse(result);
  });
}
watch(() => state.currentAPI, (value) => {
  let item = utils.clone(value);
  state.request = item.body;
  state.response = '';
  if(state.request){
    onInputChange({ text: utils.toJSON(state.request) });
  }
})
watch(locale, () => {
  syncApiCatalog();
});
</script>
<template>
  <PageSection title-key="menu.dev.apiDebug" body-class="cim-api-box">
    <div class="cim-bk-form cim-api-sidebar">
      <ul class="cim-api-sidebar-nav">
        <li class="cim-api-nav-group" v-for="item in state.apis">
          <div class="cim-api-nav-link cicon cim-api-nav-link-toggle" @click="onShow(item)" :class="{'cim-api-nav-link-active': item.isActive}">{{ item.category }}</div>
          <ul class="cim-api-nav-items" :class="{'cim-api-nav-show': item.isFold}">
            <li class="cim-api-nav-item" :class="{'cim-api-nav-item-active': api.isActive}" v-for="api in item.children" @click="onAPIClick(api)">
              <span class="cim-api-nav-method" :class="['cim-api-nav-' + api.method]">{{ api.method }}</span>
              <span class="cim-api-nav-name">{{ api.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="cim-api-main" v-if="state.currentAPI.url">
      <div class="cim-bk-form cim-api-header">
        <div class="cim-api-header-method" :class="['cim-api-header-'+state.currentAPI.method]">{{ state.currentAPI.method }}</div>
        <div class="cim-api-header-url">
          <input type="text" v-model="state.currentAPI.url">
        </div>
        <div class="cim-api-header-buttons">
          <div class="cim-button cim-button-bg" @click="onSend">{{ t('tools.api.send') }}</div>
        </div>
      </div>
      <div class="cim-bk-form cim-api-main-body">
        <div class="cim-api-request">
          <div class="jug-api-rr-header">
            <span>{{ t('tools.api.request') }}</span>
          </div>
          <JsonEditor
            mode="text"
            :mainMenuBar=false
            :navigationBar=false
            :statusBar=false
            :indentation=2
            @change="onInputChange"
            v-model="state.request"
          />
        </div>
        <div class="cim-api-response">
          <div class="jug-api-rr-header">{{ t('tools.api.response') }}</div>
          <JsonEditor
            mode="text"
            :mainMenuBar=false
            :navigationBar=false
            :statusBar=false
            :readOnly=true
            :indentation=2
            v-model="state.response"
          />
        </div>
      </div>
    </div>
  </PageSection>
</template>
