<script setup>
import BaseSelect from '@/components/base-select.vue';
import { useI18n } from '@/i18n';

const props = defineProps({
  className: {
    type: String,
    default: '',
  },
  wrapperClass: {
    type: String,
    default: '',
  },
});

const { locale, localeOptions, setLocale } = useI18n();

function onChange(value) {
  setLocale(value);
}
</script>

<template>
  <BaseSelect
    :class-name="props.className"
    :wrapper-class="props.wrapperClass"
    :model-value="locale"
    :options="localeOptions"
    aria-label="Language"
    @change="onChange"
  />
</template>
