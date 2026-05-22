<script setup>
import { reactive } from 'vue';
import utils from '../../common/utils';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';
let state = reactive({
  files: [
    { name: 'a.png', url: '', isImage: true },
    { name: 'b.png', url: '', isImage: true },
    { name: 'c.pdf', url: '', isImage: false },
    { name: 'd.xls', url: '', isImage: false },
  ]
});
function onRemove(index){
  state.files.splice(index, 1);
}
function onAdd(){
  state.files.push({ name: `${Date.now()}.png`, isImage: true })
}
</script>
<template>
  <PageSection title="新建工单">
    <div class="card-body">
      <div class="tab-content rounded-bottom">
        <div class="tab-pane p-3 active preview">
          <div class="mb-3">
            <label class="form-label" >{{ t('legacyPages.service.orderCreate.field.title') }}</label>
            <input class="form-control">
          </div>
          <div class="mb-3">
            <label class="form-label" >{{ t('legacyPages.service.orderCreate.field.description') }}</label>
            <textarea class="form-control" rows="5"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label" >{{ t('legacyPages.service.orderCreate.field.attachments') }}</label>
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
    </div>
  </PageSection>
</template>
