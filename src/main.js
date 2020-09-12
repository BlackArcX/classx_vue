import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Page from './components/Page.vue';

import './registerServiceWorker';
import './format';
// import './components';

import './styles.css';

Vue.config.productionTip = false;

Vue.component('Page', Page);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
