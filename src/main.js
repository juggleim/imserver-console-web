import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import VCalendar from 'v-calendar';
// import { create, NButton, NIcon, NUpload, NUploadDragger } from 'naive-ui';

import Toast from './components/toast';
import Chat from './components/chat';
import { initI18n, installI18n } from './i18n';

import 'v-calendar/style.css';
import './assets/scss/iconfont.css';
import './assets/scss/style.scss';
import './assets/scss/custom/_header.css';
import './assets/scss/custom/_main.css';
import './assets/scss/custom/_order.css';
import './assets/scss/custom/_invoice.css';
import './assets/scss/_custom.css';
import naive from 'naive-ui'

// if(location.search == '?debug'){
//   var vConsole = new window.VConsole();
// }

async function init() {
  // const naive = create({
  //   components: [
  //     NUpload,
  //     NUploadDragger,
  //     NButton,
  //     NIcon,
  //   ],
  // });

  initI18n();
  const app = createApp(App);
  installI18n(app);
  Toast.install(app);
  Chat.install(app);
  await setupRouter(app);
  app.use(VCalendar, {});
  app.use(naive)
  app.mount('#app');
}

init();
