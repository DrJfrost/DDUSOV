import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import scholarAPI from './modules/scholarApi.store';

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';
export default new Vuex.Store({
   modules: {
      scholarAPI,
   },
   strict: debug,
   plugins: debug? [ createLogger() ] : [],
})