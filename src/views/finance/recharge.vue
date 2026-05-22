<script setup>
import { reactive } from 'vue';
import utils from '../../common/utils';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

let TAB_NAME = {
  ONLINE: 'online',
  PUBLIC: 'public'
};
let state = reactive({
  activeTab: TAB_NAME.ONLINE 
});

function onTab(name){
  utils.extend(state, { activeTab: name });
}
</script>
<template>
  <PageSection title-key="legacyPages.finance.dashboard.recharge">
    <ul class="nav nav-underline-border">
      <li class="nav-item"><a class="nav-link cicon cicon-money1" @click="onTab(TAB_NAME.ONLINE)" :class="{'active': utils.isEqual(state.activeTab, TAB_NAME.ONLINE)}">{{ t('legacyPages.finance.recharge.tab.online') }}</a></li>
      <li class="nav-item"><a class="nav-link cicon cicon-money2" @click="onTab(TAB_NAME.PUBLIC)" :class="{'active': utils.isEqual(state.activeTab, TAB_NAME.PUBLIC)}">{{ t('legacyPages.finance.recharge.tab.public') }}</a></li>
    </ul>
    <div class="tab-content">
      <div class="tab-pane p-3" :class="{'active': utils.isEqual(state.activeTab, TAB_NAME.ONLINE)}">
        <div class="row cim-ab-row">
          <label class="col-sm-1 col-form-label">{{ t('legacyPages.finance.recharge.field.rechargeAccount') }}</label>
          <div class="col-sm-4">
            <div class="form-control-plaintext">10929298490</div>
          </div>
          <div class="col-sm-4"></div>
        </div>
        <div class="row cim-ab-row">
          <label class="col-sm-1 col-form-label">{{ t('legacyPages.finance.recharge.field.accountBalance') }}</label>
          <div class="col-sm-4">
            <div class="form-control-plaintext">30293.00 {{ t('common.word.yuan') }}</div>
          </div>
          <div class="col-sm-4"></div>
        </div>
        <div class="row cim-ab-row">
          <label class="col-sm-1 col-form-label">{{ t('legacyPages.finance.recharge.field.rechargeAmount') }}</label>
          <div class="col-sm-2">
            <div class="form-control-plaintext cim-ra-input">
              <input class="form-control" type="number">
              <span>{{ t('common.word.yuan') }}</span>
            </div>
          </div>
          <div class="col-sm-4"></div>
        </div>

        <div class="row cim-ab-row">
          <label class="col-sm-1 col-form-label">{{ t('legacyPages.finance.recharge.field.payType') }}</label>
          <div class="col-sm-6">
            <div class="form-control-plaintext cim-ra-paies">
              <div class="cim-ra-pay cicon cicon-wechatpay">{{ t('legacyPages.finance.recharge.payType.wechat') }}</div>
              <div class="cim-ra-pay cicon cicon-alipay  cim-ra-pay-selected">{{ t('legacyPages.finance.recharge.payType.alipay') }}</div>
            </div>
          </div>
          <div class="col-sm-4"></div>
        </div>
        
        <div class="row cim-ab-row">
          <label class="col-sm-1 col-form-label"></label>
          <div class="col-sm-6">
            <div class="cim-ra-qr"></div>
          </div>
          <div class="col-sm-4"></div>
        </div>
      </div>

      <div class="tab-pane p-3" :class="{'active': utils.isEqual(state.activeTab, TAB_NAME.PUBLIC)}">
        <div class="row cim-ab-row">
          <label class="col-sm-1 col-form-label">{{ t('legacyPages.finance.recharge.field.receiverName') }}</label>
          <div class="col-sm-4">
            <div class="form-control-plaintext">{{ t('legacyPages.sample.receiverCompany') }}</div>
          </div>
          <div class="col-sm-4"></div>
        </div>
        <div class="row cim-ab-row">
          <label class="col-sm-1 col-form-label">{{ t('legacyPages.finance.recharge.field.receiverAccount') }}</label>
          <div class="col-sm-4">
            <div class="form-control-plaintext">110293840383</div>
          </div>
          <div class="col-sm-4"></div>
        </div>
        <div class="row cim-ab-row">
          <label class="col-sm-1 col-form-label">{{ t('legacyPages.finance.recharge.field.receiverBank') }}</label>
          <div class="col-sm-4">
            <div class="form-control-plaintext">{{ t('legacyPages.sample.receiverBank') }}</div>
          </div>
          <div class="col-sm-4"></div>
        </div>
      </div>
    </div>
  </PageSection>
</template>
