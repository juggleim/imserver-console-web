<script setup>
import { reactive } from 'vue';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';
let state = reactive({
  orders: [
    { num: '10001', titleKey: 'legacyPages.sample.serviceTitleAndroid', time: '2023-10-10 23:03' },
    { num: '10002', titleKey: 'legacyPages.sample.serviceTitleIos', time: '2023-10-10 23:03' },
    { num: '10003', titleKey: 'legacyPages.sample.serviceTitleGeneric', time: '2023-10-10 23:03' },
    { num: '10004', titleKey: 'legacyPages.sample.serviceTitleGeneric', time: '2023-10-10 23:03' },
    { num: '10005', titleKey: 'legacyPages.sample.serviceTitleGeneric', time: '2023-10-10 23:03' },
    { num: '10006', titleKey: 'legacyPages.sample.serviceTitleGeneric', time: '2023-10-10 23:03' },
    { num: '10007', titleKey: 'legacyPages.sample.serviceTitleGeneric', time: '2023-10-10 23:03' },
    { num: '10008', titleKey: 'legacyPages.sample.serviceTitleGeneric', time: '2023-10-10 23:03' },
    { num: '10009', titleKey: 'legacyPages.sample.serviceTitleAndroid', time: '2023-10-10 23:03' },
    { num: '10010', titleKey: 'legacyPages.sample.serviceTitleAndroid', time: '2023-10-10 23:03' },
    { num: '10011', titleKey: 'legacyPages.sample.serviceTitleAndroid', time: '2023-10-10 23:03' },
    { num: '10012', titleKey: 'legacyPages.sample.serviceTitleAndroid', time: '2023-10-10 23:03' },
    { num: '10013', titleKey: 'legacyPages.sample.serviceTitleAndroid', time: '2023-10-10 23:03' },
    { num: '10014', titleKey: 'legacyPages.sample.serviceTitleAndroid', time: '2023-10-10 23:03' },
    { num: '10015', titleKey: 'legacyPages.sample.serviceTitleAndroid', time: '2023-10-10 23:03' },
    { num: '10016', titleKey: 'legacyPages.sample.serviceTitleAndroid', time: '2023-10-10 23:03' },
  ]
});

</script>
<template>
  <PageSection title="工单列表">
    <table class="table cim-table">
      <thead>
        <tr>
          <th scope="col" class="cim-td-c">{{ t('legacyPages.service.orderList.table.orderNo') }}</th>
          <th scope="col">{{ t('legacyPages.service.orderList.table.title') }}</th>
          <th scope="col" class="cim-td-c">{{ t('legacyPages.service.orderList.table.status') }}</th>
          <th scope="col" class="cim-td-c">{{ t('legacyPages.service.orderList.table.replyTime') }}</th>
          <th scope="col">{{ t('legacyPages.service.orderList.table.operation') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in state.orders">
          <td class="cim-td-c">{{ order.num }}</td>
          <td>{{ order.titleKey ? t(order.titleKey) : order.title }}</td>
          <td class="cim-td-c">{{ t('legacyPages.service.orderList.status.processing') }}</td>
          <td class="cim-td-c">{{ order.time }}</td>
          <td>
            <a class="btn-link cim-btn-link" type="button">{{ t('common.action.view') }}</a>
          </td>
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
