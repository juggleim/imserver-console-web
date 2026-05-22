<script setup>
import { reactive } from 'vue';
import ModifyDialog from '../../components/dialog.vue';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

let state = reactive({
  users: [
    { name: 'Alex Zhang', time: '2023-10-10 23:03', account: 'alex@example.com', status: 'Enabled', statusKey: 'common.status.enabled' },
    { name: 'Taylor Chen', time: '2023-10-10 23:03', account: 'taylor@example.com', status: 'Enabled', statusKey: 'common.status.enabled' },
    { name: 'Jordan Lin', time: '2023-10-10 23:03', account: 'jordan@example.com', status: 'Enabled', statusKey: 'common.status.enabled' },
  ],
  radios: [
    { name: 'type', value: 1, label: 'Enable', labelKey: 'common.action.enable' },
    { name: 'type', value: 2, label: 'Disable', labelKey: 'common.action.disable' },
  ],
  isOpen: 1,
  isShowEdit: false
});

function onShowEdit(isShow) {
  state.isShowEdit = isShow;
}

</script>
<template>
  <PageSection title-key="tools.role.title">
    <template #actions>
      <div class="cicon cicon-add cim-button cim-button-bg" @click="onShowEdit(true)">{{ t('tools.role.action.addUser') }}</div>
    </template>
    <table class="table cim-table">
      <thead>
        <tr>
          <th>{{ t('tools.role.table.name') }}</th>
          <th>{{ t('tools.role.table.account') }}</th>
          <th>{{ t('tools.role.table.status') }}</th>
          <th>{{ t('tools.role.table.createdTime') }}</th>
          <th class="cim-td-c">{{ t('tools.role.table.operation') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in state.users">
          <td>{{ user.name }}</td>
          <td>{{ user.account }}</td>
          <td>{{ t(user.statusKey || '', {}, user.status) }}</td>
          <td>{{ user.time }}</td>
          <td class="cim-td-c">
            <a class="btn-link cim-btn-link" type="button" @click="onShowEdit(true)">{{ t('common.action.edit') }}</a>
            <a class="btn-link cim-btn-link" type="button">{{ t('common.action.disable') }}</a>
          </td>
        </tr>
      </tbody>
    </table>
    <ModifyDialog :show="state.isShowEdit" :title="t('tools.role.action.addUser')" @hide="onShowEdit(false)">
      <div class="row g-2 cim-row">
        <div class="form-floating">
          <input class="form-control" :placeholder="t('tools.role.field.name')">
          <label>{{ t('tools.role.field.name') }}</label>
        </div>
        <div class="form-floating">
          <input class="form-control" :placeholder="t('tools.role.field.password')">
          <label>{{ t('tools.role.field.password') }}</label>
        </div>
        <div class="form-floating">
          <div class="form-control">
            <div class="form-check form-check-inline" v-for="radio in state.radios">
              <input class="form-check-input" type="radio" name="radio.name" :value="radio.value"
                v-model="state.isOpen" @change="onRadieChanged(radio.value)">
              <label class="form-check-label">{{ t(radio.labelKey || '', {}, radio.label) }}</label>
            </div>
          </div>
          <label>{{ t('tools.role.field.status') }}</label>
        </div>
      </div>
    </ModifyDialog>
  </PageSection>
</template>
