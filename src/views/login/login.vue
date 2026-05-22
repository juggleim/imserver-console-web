<script setup>
import { useRouter } from "vue-router";
import { User } from "../../services";
import { reactive, computed, getCurrentInstance } from 'vue';
import { ErrorType, STORAGE, DEPLOY_TYPE, Errors } from "../../common/enum";
import utils from "../../common/utils";
import Stroage from "../../common/storage";
import menuTools from "../layout/menu-tools";
import { t } from '@/i18n';
import LangSwitcher from '@/components/lang-switcher.vue';

let context = getCurrentInstance();
const router = useRouter();
let state = reactive({
  account: '',
  password: '',
  pwdErrorMsg: '',
  accountErrorMsg: '',
  loginErrorMsg: '',
  isSending: false,
});

const featureCards = computed(() => {
  return [1, 2, 3, 4, 5, 6].map((index) => ({
    title: t(`login.hero.cards.${index}.title`),
  }));
});

function onLogin(){
  if (state.isSending) {
    return;
  }
  let { account, password } = state;
  state.accountErrorMsg = '';
  state.pwdErrorMsg = '';
  state.loginErrorMsg = '';

  if(utils.isEmpty(account)){
    return state.accountErrorMsg = t('login.validation.accountRequired');
  }
  if(utils.isEmpty(password)){
    return state.pwdErrorMsg = t('login.validation.passwordRequired');
  }

  state.isSending = true;
  User.login({ account, password }).then(({ code, data }) => {
    if(utils.isEqual(code, ErrorType.SUCCESS_0.code)){
      data.type = utils.isEqual(data.env, 'private') ? DEPLOY_TYPE.PRIVATE : DEPLOY_TYPE.PUBLIC;
      Stroage.set(STORAGE.USER_TOKEN,  data);
      context.proxy.$toast({
        text: t('login.feedback.success'),
        icon: 'success'
      });
      return menuTools.goHomePage(router);
    }

    let error = Errors.find((item) => { return utils.isEqual(item.code, code)}) || {}
    state.loginErrorMsg = error.key ? t(error.key) : t('login.feedback.failedWithCode', { code })
  }).finally(() => {
    state.isSending = false;
  });
}

function onInput(name){
  let events = {
    pwd: () => {
      state.pwdErrorMsg = '';
    },
    account: () => {
      state.accountErrorMsg = '';
    }
  };
  state.loginErrorMsg = '';
  events[name]();
}
</script>
<template>
  <div class="cim-login-page">
    <div class="cim-login-shell">
      <header class="cim-login-header">
        <LangSwitcher
          class-name="cim-login-language-field"
          wrapper-class="cim-login-language"
        />
      </header>

      <div class="cim-login-main">
        <section class="cim-login-showcase">
          <h1 class="cim-login-showcase-title">{{ t('login.hero.title') }}</h1>

          <div class="cim-login-feature-grid">
            <article
              v-for="(item, index) in featureCards"
              :key="item.title"
              class="cim-login-feature-card"
              :class="`is-feature-${index + 1}`"
            >
              <div class="cim-login-feature-icon"></div>
              <div class="cim-login-feature-watermark"></div>
              <h2>{{ item.title }}</h2>
            </article>
          </div>
        </section>

        <section class="cim-login-panel">
          <div class="cim-login-card">
            <div class="cim-login-card-heading">
              <h2>{{ t('login.title') }}</h2>
            </div>

            <div class="login-input-group">
              <label class="cim-login-field">
                <span class="cim-login-field-icon is-account"></span>
                <input
                  class="form-control"
                  type="text"
                  v-model="state.account"
                  :placeholder="t('login.field.account')"
                  @input="onInput('account')"
                >
              </label>
              <div class="invalid-feedback feedback" :class="{ 'is-visible': !!state.accountErrorMsg }">{{ state.accountErrorMsg || '\u00A0' }}</div>
            </div>

            <div class="login-input-group">
              <label class="cim-login-field">
                <span class="cim-login-field-icon is-password"></span>
                <input
                  class="form-control"
                  type="password"
                  v-model="state.password"
                  :placeholder="t('login.field.password')"
                  @input="onInput('pwd')"
                  @keydown.enter="onLogin()"
                >
              </label>
              <div class="invalid-feedback feedback" :class="{ 'is-visible': !!state.pwdErrorMsg }">{{ state.pwdErrorMsg || '\u00A0' }}</div>
            </div>

            <div class="login-input-group">
              <button
                class="btn btn-primary cim-login-button"
                type="button"
                :disabled="state.isSending"
                @click="onLogin()"
              >
                {{ t('common.action.login') }}
              </button>
            </div>

            <div class="invalid-feedback feedback login-feedback" :class="{ 'is-visible': !!state.loginErrorMsg }">{{ state.loginErrorMsg || '\u00A0' }}</div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
