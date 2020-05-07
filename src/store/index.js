import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import state from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

import moduleCommon from "./moduleCommon";
import moduleAdmin from "./moduleAdmin";

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state,
  getters,
  mutations,
  actions,
  modules: {
    moduleAdmin,
    moduleCommon,
  },
});

export default store;
