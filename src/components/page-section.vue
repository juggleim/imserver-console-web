<script setup>
import { computed, useSlots } from 'vue';
import { t } from '@/i18n';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  titleKey: {
    type: String,
    default: '',
  },
  shellClass: {
    type: [String, Array, Object],
    default: '',
  },
  bodyClass: {
    type: [String, Array, Object],
    default: '',
  },
});

const slots = useSlots();

const displayTitle = computed(() => {
  if (props.titleKey) {
    return t(props.titleKey, {}, props.title);
  }
  return props.title;
});

const hasActions = computed(() => Boolean(slots.actions));
</script>

<template>
  <div :class="['mb-4 app-base cim-page-shell', props.shellClass]">
    <div class="cim-page-head">
      <h2 class="cim-page-title">{{ displayTitle }}</h2>
      <div v-if="hasActions" class="cim-page-head-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div :class="['cim-page-content', props.bodyClass]">
      <slot></slot>
    </div>
  </div>
</template>
