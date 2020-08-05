import Vue from 'vue';
import Vuex from 'vuex';

import classes from './modules/classes';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    classes,
  },
});
