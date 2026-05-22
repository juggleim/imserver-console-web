<script setup>
import Dialog from './dialog.vue';
import { reactive, getCurrentInstance, watch } from 'vue';
import utils from '../common/utils';
import { t } from '@/i18n';

const context = getCurrentInstance();
const props = defineProps(['domains']);
const emit = defineEmits(['save', 'hide'])

let state = reactive({
  domains: props.domains,
  text: props.domains.join(';\n')
});

function onSave(){
  let { text } = state;
  let domains = text.split(';')
  domains = utils.filter(domains, (domain) => {
    return !utils.isEmpty(domain);
  });
  domains = utils.map(domains, (domain) => {
    return domain.replace('\n', '');
  });
  for(let i = 0; i < domains.length; i++){
    let domain = domains[i];
    
    if(!utils.isURL(domain)){
      return context.proxy.$toast({ icon: 'error', text: t('switchConfig.domainDialog.invalid', { domain }) });
    }
  }
  emit('save', { domains });
}
function onHide(e){
  emit('hide', {});
}
watch(() => props.domains, () => {
  utils.extend(state, { 
    domains: props.domains,
    text: props.domains.join(';\n')
  });
})
</script>

<template>
 <Dialog :title="t('switchConfig.domainDialog.title')" :btn-title="t('common.dialog.save')" :class="['cim-security-dialog']" @hide="onHide" @save="onSave" >
    <div class="form-floating">
      <textarea class="form-control" style="width: 36rem;height: 10rem;resize: none;" placeholder=" " v-model="state.text"></textarea>
      <label>{{ t('switchConfig.domainDialog.hint') }}</label>
    </div>
    <div class="form-example">
      <div class="title">{{ t('switchConfig.domainDialog.exampleTitle') }}</div>
      <ul>
        <li>https://example.com;http://im.fake.com;http://127.0.0.1:8305</li>
        <li class="warn">{{ t('switchConfig.domainDialog.warning') }}</li>
      </ul>
    </div>
 </Dialog>
</template>
