<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Boolean, null],
    default: null,
  },
  align: {
    type: String,
    default: 'left', // left | right
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  menuClass: {
    type: String,
    default: '',
  },
  rootClass: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'open', 'close', 'toggle']);

const rootRef = ref(null);
const internalOpen = ref(false);

const isControlled = computed(() => props.modelValue !== null);
const isOpen = computed(() => (isControlled.value ? props.modelValue : internalOpen.value));

function setOpen(next) {
  if (props.disabled) return;
  if (isControlled.value) {
    emit('update:modelValue', next);
  } else {
    internalOpen.value = next;
  }
  emit(next ? 'open' : 'close');
}

function toggle() {
  emit('toggle');
  setOpen(!isOpen.value);
}

function close() {
  setOpen(false);
}

function onDocumentPointerDown(event) {
  if (!rootRef.value || rootRef.value.contains(event.target)) return;
  close();
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    close();
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown);
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      'cim-base-dropdown',
      props.rootClass,
      `is-align-${props.align}`,
      { 'is-open': isOpen, 'is-disabled': props.disabled },
    ]"
  >
    <div class="cim-base-dropdown__trigger">
      <slot name="trigger" :open="isOpen" :toggle="toggle" :close="close" />
    </div>
    <div v-show="isOpen" :class="['cim-base-dropdown__menu', props.menuClass]" role="menu">
      <slot name="menu" :open="isOpen" :toggle="toggle" :close="close" />
    </div>
  </div>
</template>

