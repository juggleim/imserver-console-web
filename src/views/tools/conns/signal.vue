<script setup>
import { getCurrentInstance, nextTick, watch } from 'vue';
import utils from '../../../common/utils';
import Clipboard from 'clipboard.js';
import { t } from '@/i18n';

const context = getCurrentInstance();
const props = defineProps(['conn']);
const emit = defineEmits(['next']);

watch(() => props.conn.list, () => {
  nextTick(() => {
    let { signals } = context.refs;
    if (signals) {
      signals.scrollTop = signals.scrollHeight;
    }
  });
})

function onCopy(item){
  Clipboard.copy(item.real_time || item.timestamp, utils.noop, utils.noop);
  context.proxy.$toast({ icon: 'success', text: t('tools.connection.action.copyTime'), duration: 1500 });
}

</script>
<template>
  <div class="cim-signal-contanier">
    <ul v-if="props.conn.list?.length" class="cim-signals-box" ref="signals">
      <li class="cim-signal fadeinx" v-for="(item, index) in props.conn.list" :key="`${item.action}-${item.real_time || item.timestamp || index}`">
        <div class="cim-signal-header">
          <div class="cim-signal-time" @click="onCopy(item)">{{ item.timeName }}</div>
          <div class="cim-signal-avatar">
            <span class="cim-signal-icon cicon" :class="['cicon-conn-' + item.type]"></span>
            <span class="cim-signal-name">{{ item.title }}</span>
          </div>
        </div>
        
        <div class="cim-signal-body">
          <ul class="cim-signal-list">
            <li class="cim-signal-item" v-for="info in item.infos" :key="`${info.name}-${info.value}`" :class="[info.cls ? info.cls : '']">
              {{ info.name }} {{ info.value }}
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div v-else-if="!props.conn.isLoading" class="cim-tcon-empty">
      <div class="cim-tcon-empty-icon"></div>
      <p class="cim-tcon-empty-text">{{ t('tools.connection.empty.signals') }}</p>
    </div>
    <div class="cim-table-footer"  v-if="props.conn.currentCount >= props.conn.count">
      <nav class="cim-navigation">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Next" @click.prevent="emit('next', { item: props.conn })">
              <span aria-hidden="true">{{ t('tools.connection.action.next') }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="cim-loading" v-if="props.conn.isLoading">
      <div class="loader-dot"></div>
    </div>
  </div>
</template>
