import { computed, reactive } from 'vue';
import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui';
import Storage from '@/common/storage';
import { STORAGE } from '@/common/enum';
import { resources } from './resources';

export const DEFAULT_LOCALE = 'zh-CN';
export const FALLBACK_LOCALE = 'zh-CN';

export const LOCALE_OPTIONS = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
];

const naiveLocaleMap = {
  'zh-CN': {
    locale: zhCN,
    dateLocale: dateZhCN,
  },
  'en-US': {
    locale: enUS,
    dateLocale: dateEnUS,
  },
};

const state = reactive({
  locale: DEFAULT_LOCALE,
  fallbackLocale: FALLBACK_LOCALE,
  isReady: false,
  source: 'default',
  lastError: '',
});

function isSupportedLocale(locale) {
  return Object.prototype.hasOwnProperty.call(resources, locale);
}

function normalizeLocale(input) {
  if (typeof input !== 'string') {
    return DEFAULT_LOCALE;
  }
  const lowerInput = input.toLowerCase();
  if (lowerInput.startsWith('en')) {
    return 'en-US';
  }
  if (lowerInput.startsWith('zh')) {
    return 'zh-CN';
  }
  return DEFAULT_LOCALE;
}

function resolveLocaleFromStorage() {
  const storedLocale = Storage.get(STORAGE.LOCALE);
  if (typeof storedLocale !== 'string') {
    return null;
  }
  const locale = normalizeLocale(storedLocale);
  return isSupportedLocale(locale) ? locale : null;
}

function resolveLocaleFromBrowser() {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LOCALE;
  }
  const locale = normalizeLocale(navigator.language || navigator.userLanguage);
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

function getMessage(locale, key) {
  return key.split('.').reduce((result, current) => {
    if (result && typeof result === 'object' && current in result) {
      return result[current];
    }
    return undefined;
  }, resources[locale]);
}

function formatMessage(message, params = {}) {
  if (typeof message !== 'string') {
    return '';
  }
  return message.replace(/\{(\w+)\}/g, (_, key) => {
    if (key in params) {
      return `${params[key]}`;
    }
    return `{${key}}`;
  });
}

function storeLocale(locale) {
  Storage.set(STORAGE.LOCALE, locale);
}

export function initI18n() {
  const localeFromStorage = resolveLocaleFromStorage();
  if (localeFromStorage) {
    state.locale = localeFromStorage;
    state.source = 'storage';
    state.isReady = true;
    return state.locale;
  }

  const localeFromBrowser = resolveLocaleFromBrowser();
  state.locale = localeFromBrowser;
  state.source = 'browser';
  state.isReady = true;
  storeLocale(state.locale);
  return state.locale;
}

export function setLocale(nextLocale) {
  const locale = normalizeLocale(nextLocale);
  if (!isSupportedLocale(locale)) {
    return false;
  }
  state.locale = locale;
  state.source = 'storage';
  state.lastError = '';
  state.isReady = true;
  storeLocale(locale);
  return true;
}

export function getNaiveLocaleConfig(locale = state.locale) {
  return naiveLocaleMap[locale] || naiveLocaleMap[DEFAULT_LOCALE];
}

export function t(key, params = {}, fallback = '') {
  const currentMessage = getMessage(state.locale, key);
  if (typeof currentMessage === 'string') {
    return formatMessage(currentMessage, params);
  }

  const fallbackMessage = getMessage(state.fallbackLocale, key);
  if (typeof fallbackMessage === 'string') {
    return formatMessage(fallbackMessage, params);
  }

  if (fallback) {
    return formatMessage(fallback, params);
  }

  return getMessage(FALLBACK_LOCALE, 'common.feedback.missing') || '文案待补充';
}

export function useI18n() {
  return {
    locale: computed(() => state.locale),
    localeOptions: LOCALE_OPTIONS,
    isReady: computed(() => state.isReady),
    t,
    setLocale,
  };
}

export function installI18n(app) {
  app.config.globalProperties.$t = t;
  app.config.globalProperties.$setLocale = setLocale;
}

export function getCurrentLocale() {
  return state.locale;
}

export function getLocaleState() {
  return state;
}
