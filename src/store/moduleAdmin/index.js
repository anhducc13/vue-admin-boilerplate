import state from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

import common from "./common";
import menu from "./menu";
import role from "./role";
import user from "./user";

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    common,
    menu,
    role,
    user,
  },
};
