<script setup>
import { reactive } from 'vue';
import { INVOICE_TYPE } from "../../common/enum";
import utils from '../../common/utils';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';
let state = reactive({
  records: [
    { id: 1, titleKey: 'legacyPages.sample.companyName', checked: false, recharge: 25000, invoice: 25000, typeKey: 'legacyPages.sample.wechat', time: '2023-10-10 23:03' },
    { id: 2, titleKey: 'legacyPages.sample.companyName', checked: false, recharge: 25000, invoice: 25000, typeKey: 'legacyPages.sample.wechat', time: '2023-10-10 23:03' },
    { id: 3, titleKey: 'legacyPages.sample.companyName', checked: false, recharge: 25000, invoice: 25000, typeKey: 'legacyPages.sample.wechat', time: '2023-10-10 23:03' },
    { id: 4, titleKey: 'legacyPages.sample.companyName', checked: false, recharge: 25000, invoice: 25000, typeKey: 'legacyPages.sample.wechat', time: '2023-10-10 23:03' },
    { id: 5, titleKey: 'legacyPages.sample.companyName', checked: false, recharge: 25000, invoice: 25000, typeKey: 'legacyPages.sample.wechat', time: '2023-10-10 23:03' },
    { id: 6, titleKey: 'legacyPages.sample.companyName', checked: false, recharge: 25000, invoice: 25000, typeKey: 'legacyPages.sample.wechat', time: '2023-10-10 23:03' },
    { id: 7, titleKey: 'legacyPages.sample.companyName', checked: false, recharge: 25000, invoice: 25000, typeKey: 'legacyPages.sample.wechat', time: '2023-10-10 23:03' },
    { id: 8, titleKey: 'legacyPages.sample.companyName', checked: false, recharge: 25000, invoice: 25000, typeKey: 'legacyPages.sample.wechat', time: '2023-10-10 23:03' },
    { id: 9, titleKey: 'legacyPages.sample.companyName', checked: false, recharge: 25000, invoice: 25000, typeKey: 'legacyPages.sample.wechat', time: '2023-10-10 23:03' },
    { id: 10, titleKey: 'legacyPages.sample.companyName', checked: false, recharge: 25000, invoice: 25000, typeKey: 'legacyPages.sample.wechat', time: '2023-10-10 23:03' },
  ],
  radios: [
    { name: 'type', value: INVOICE_TYPE.ONLINE, label: 'VAT Invoice (Electronic)', labelKey: 'legacyPages.invoice.draw.invoiceType.online' },
    { name: 'type', value: INVOICE_TYPE.PAPER, label: 'VAT Invoice (Paper)', labelKey: 'legacyPages.invoice.draw.invoiceType.paper' },
  ],
  total: 0,
  invoiceType: INVOICE_TYPE.ONLINE,
  checkAll: false
});
function onRadieChanged(type){
  state.invoiceType = type;
}
function onCheckboxChanged(item){
  state.records.map((record) => {
    if(utils.isEqual(record.id, item.id)){
      record.checked = !item.checked;
    }
    return record;
  });

  let total = 0;
  utils.each(state.records, (record) => {
    if(record.checked){
      total += record.invoice
    }
  });
  state.total = utils.numberWithCommas(total);
}
function onCheckAll(){
  state.checkAll = !state.checkAll;
  let total = 0;
  state.records.map((record) => {
    record.checked = state.checkAll;
    if(state.checkAll){
      total += record.invoice
    }
    return record;
  });
  state.total = utils.numberWithCommas(total);
}
</script>
<template>
  <PageSection title-key="legacyPages.invoice.draw.title">
    <div class="card-body">
      <div class="tab-content rounded-bottom">
        <div class="tab-pane p-3 active cim-wait-list">
          <table class="table cim-table">
            <thead>
              <tr>
                <th class="cim-td-c">
                  <input class="form-check-input cim-td-select" type="checkbox" @change="onCheckAll()">
                </th>
                <th>{{ t('legacyPages.invoice.draw.table.rechargeSubject') }}</th>
                <th class="cim-td-c">{{ t('legacyPages.invoice.draw.table.rechargeAmount') }}</th>
                <th class="cim-td-c">{{ t('legacyPages.invoice.draw.table.invoiceAmount') }}</th>
                <th class="cim-td-c">{{ t('legacyPages.invoice.draw.table.rechargeType') }}</th>
                <th class="cim-td-c">{{ t('legacyPages.invoice.draw.table.rechargeTime') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in state.records">
                <td class="cim-td-c">
                  <input class="form-check-input cim-td-select" :checked="record.checked"  type="checkbox" @change="onCheckboxChanged(record)">
                </td>
                <td>{{ record.titleKey ? t(record.titleKey) : record.title }}</td>
                <td class="cim-td-c">{{ record.recharge }}</td>
                <td class="cim-td-c">{{ record.invoice }}</td>
                <td class="cim-td-c">{{ record.typeKey ? t(record.typeKey) : record.type }}</td>
                <td class="cim-td-c">{{ record.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="tab-pane p-3 active cim-tab-line">
          <div class="form-check form-check-inline" v-for="radio in state.radios">
            <input class="form-check-input" type="radio" name="radio.name" :value="radio.value" v-model="state.invoiceType" @change="onRadieChanged(radio.value)">
            <label class="form-check-label">{{ radio.labelKey ? t(radio.labelKey, {}, radio.label) : radio.label }}</label>
          </div>
          <div class="form-check form-check-inline">
            <label class="form-check-label cim-invoice-label">{{ t('legacyPages.invoice.draw.total') }}</label>
            <label class="cim-invoice-label cim-invoice-amount"> {{ state.total }} </label>
          </div>
        </div>

        <div class="row g-2 cim-row">
          <div class="col-md">
            <div class="form-floating">
              <input class="form-control" type="email" :placeholder="t('legacyPages.invoice.draw.field.invoiceTitle')">
              <label>{{ t('legacyPages.invoice.draw.field.invoiceTitle') }}</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input class="form-control" type="email" :placeholder="t('legacyPages.invoice.draw.field.taxNumber')">
              <label>{{ t('legacyPages.invoice.draw.field.taxNumber') }}</label>
            </div>
          </div>
        </div>

        <div class="row g-2 cim-row">
          <div class="col-md">
            <div class="form-floating">
              <input class="form-control" type="email" :placeholder="t('legacyPages.invoice.draw.field.receiver')">
              <label>{{ t('legacyPages.invoice.draw.field.receiver') }}</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input class="form-control" type="email" :placeholder="t('legacyPages.invoice.draw.field.phone')">
              <label>{{ t('legacyPages.invoice.draw.field.phone') }}</label>
            </div>
          </div>
        </div>

        <div class="row g-2 cim-row">
          <div class="col-md">
            <div class="form-floating">
              <input class="form-control" type="email" :placeholder="state.invoiceType == INVOICE_TYPE.ONLINE ? t('legacyPages.invoice.draw.field.email') : t('legacyPages.invoice.draw.field.address')">
              <label>{{ state.invoiceType == INVOICE_TYPE.ONLINE ? t('legacyPages.invoice.draw.field.email') : t('legacyPages.invoice.draw.field.address') }}</label>
            </div>
          </div>
          <div class="col-md">
            <div class="form-floating">
              <input class="form-control" type="email" :placeholder="t('legacyPages.invoice.draw.field.remark')">
              <label>{{ t('legacyPages.invoice.draw.field.remark') }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageSection>
</template>
