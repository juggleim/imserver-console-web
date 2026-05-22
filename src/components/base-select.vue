<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  className: {
    type: String,
    default: '',
  },
  wrapperClass: {
    type: String,
    default: '',
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  labelKey: {
    type: String,
    default: 'label',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const rootRef = ref(null);
const isOpen = ref(false);

const selectedOption = computed(() => {
  return props.options.find((option) => option[props.valueKey] === props.modelValue) || props.options[0] || null;
});

function closeMenu() {
  isOpen.value = false;
}

function toggleMenu() {
  if (props.disabled) {
    return;
  }
  isOpen.value = !isOpen.value;
}

function selectOption(option) {
  const nextValue = option[props.valueKey];
  emit('update:modelValue', nextValue);
  emit('change', nextValue);
  closeMenu();
}

function isSelected(option) {
  return option[props.valueKey] === props.modelValue;
}

function onDocumentPointerDown(event) {
  if (!rootRef.value || rootRef.value.contains(event.target)) {
    return;
  }
  closeMenu();
}

function onTriggerKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
    event.preventDefault();
    if (!isOpen.value) {
      toggleMenu();
    }
    return;
  }

  if (event.key === 'Escape') {
    closeMenu();
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown);
});
</script>

<template>
  <div
    ref="rootRef"
    :class="['cim-base-select', props.wrapperClass, { 'is-disabled': props.disabled, 'is-open': isOpen }]"
  >
    <button
      type="button"
      :class="['cim-base-select__trigger', props.className]"
      :disabled="props.disabled"
      :aria-label="props.ariaLabel || undefined"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleMenu"
      @keydown="onTriggerKeydown"
    >
      <span class="cim-base-select__label">
        {{ selectedOption ? selectedOption[props.labelKey] : '' }}
      </span>
      <span class="cim-base-select__arrow" aria-hidden="true"></span>
    </button>

    <ul
      v-show="isOpen"
      class="cim-base-select__menu"
      role="listbox"
      :aria-label="props.ariaLabel || undefined"
    >
      <li
        v-for="option in props.options"
        :key="option[props.valueKey]"
        :class="['cim-base-select__option', { 'is-selected': isSelected(option) }]"
        role="option"
        :aria-selected="isSelected(option)"
        @click="selectOption(option)"
      >
        {{ option[props.labelKey] }}
      </li>
    </ul>
  </div>
</template>
