<script setup>
import { reactive } from 'vue';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';
let state = reactive({
  files: [
    { name: 'a.png', url: '', isImage: true },
  ]
});
</script>
<template>
   <PageSection title-key="tools.enterprise.title" shell-class="ent-body">
    <div class="cim-us-table">
      <div class="row cim-ab-row">
        <label class="col-sm-2 col-form-label cim-td-r cicon cicon-require">{{ t('tools.enterprise.field.companyName') }}</label>
        <div class="col-sm-9">
          <input class="form-control" type="text"  :value="t('tools.enterprise.sample.companyName')">
        </div>
      </div>

      <div class="row cim-ab-row">
        <label class="col-sm-2 col-form-label cim-td-r cicon cicon-require">{{ t('tools.enterprise.field.address') }}</label>
        <div class="col-sm-9">
          <input class="form-control" type="text"  :value="t('tools.enterprise.sample.address')">
        </div>
      </div>

      <div class="row cim-ab-row">
        <label class="col-sm-2 col-form-label cim-td-r cicon cicon-require">{{ t('tools.enterprise.field.socialCode') }}</label>
        <div class="col-sm-9">
          <input class="form-control" type="text"  value="">
        </div>
      </div>

      <div class="row cim-ab-row">
        <label class="col-sm-2 col-form-label cim-td-r cicon cicon-require">{{ t('tools.enterprise.field.legalPerson') }}</label>
        <div class="col-sm-9">
          <input class="form-control" type="text"  value="">
        </div>
      </div>
      
      <div class="row cim-ab-row">
        <label class="col-sm-2 col-form-label cim-td-r cicon cicon-require">{{ t('tools.enterprise.field.phone') }}</label>
        <div class="col-sm-9">
          <input class="form-control" type="text"  value="">
        </div>
      </div>

      <div class="row cim-ab-row">
        <label class="col-sm-2 col-form-label cim-td-r cicon cicon-require ent-website">{{ t('tools.enterprise.field.website') }}</label>
        <div class="col-sm-9">
          <input class="form-control" type="text"  value="">
        </div>
      </div>

      <div class="row cim-ab-row">
        <label class="col-sm-2 col-form-label cim-td-r cicon cicon-require">{{ t('tools.enterprise.field.businessLicense') }}</label>
        <div class="col-sm-9">
          <div class="form-control cim-form-files">
              <div class="cim-form-file cicon cicon-add cim-form-add" @click="onAdd()"></div>
              <div class="cim-form-file" v-for="(file, index)  in state.files" :class="{'cim-form-image':file.isImage}">
                <div class="cicon cicon-close cim-from-file-close" @click="onRemove(index)"></div>
                <div class="cim-form-filename">{{ file.name }}</div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </PageSection>
</template>
