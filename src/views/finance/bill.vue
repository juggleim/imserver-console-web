<script setup>
import { reactive } from 'vue';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';
let state = reactive({
  orders: [
  { id: 1, titleKey: 'legacyPages.sample.companyName', type: 1, amount: 25000, time: '2023-10-10 23:03' },
  { id: 1, titleKey: 'legacyPages.sample.companyName', type: 1, amount: 25000, time: '2023-10-10 23:03' },
  { id: 1, titleKey: 'legacyPages.sample.companyName', type: 2, amount: 25000, time: '2023-10-10 23:03' },
  { id: 1, titleKey: 'legacyPages.sample.companyName', type: 2, amount: 25000, time: '2023-10-10 23:03' },
  { id: 1, titleKey: 'legacyPages.sample.companyName', type: 1, amount: 25000, time: '2023-10-10 23:03' },
  ]
});
</script>
<template>
   <PageSection title-key="legacyPages.finance.bill.title">
    <table class="table cim-table">
      <thead>
        <tr>
          <th scope="col" class="cim-td-c">{{ t('legacyPages.finance.table.invoiceTitle') }}</th>
          <th scope="col">{{ t('legacyPages.finance.table.invoiceAmount') }}</th>
          <th scope="col" class="cim-td-c">{{ t('legacyPages.finance.table.invoiceType') }}</th>
          <th scope="col" class="cim-td-c">{{ t('legacyPages.finance.table.status') }}</th>
          <th scope="col" class="cim-td-c">{{ t('legacyPages.finance.table.invoiceTime') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in state.orders">
          <td class="cim-td-c">{{ order.titleKey ? t(order.titleKey) : order.title }}</td>
          <td class="cim-td-c">{{ order.amount }}</td>
          <td>{{ order.type == 1 ? t('legacyPages.finance.invoiceType.normal') : t('legacyPages.finance.invoiceType.special') }}</td>
          <td class="cim-td-c">{{ t('legacyPages.finance.status.sent') }}</td>
          <td class="cim-td-c">{{ order.time }}</td>
        </tr>
      </tbody>
    </table>

    <nav class="cim-navigation">
      <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">«</span></a>
        </li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">»</span></a></li>
      </ul>
    </nav>
  </PageSection>
</template>
