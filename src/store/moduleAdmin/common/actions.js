import { extraDataService } from "@/services/admin";

export default {
  setDevice({ commit }, isMobile) {
    commit("SET_DEVICE", isMobile);
    if (isMobile) {
      commit("SET_OPEN_MENU_MOBILE", false);
      commit("TOGGLE_SIDEBAR", false);
    }
  },
  setMenu({ commit }, menu) {
    commit("SET_MENU", menu);
  },
  setLoading({ commit }, isLoading) {
    commit("SET_LOADING", isLoading);
  },
  setLang({ commit }, lang) {
    commit("SET_LANG", lang);
  },
  fetchExtraData({ commit }, types) {
    extraDataService.getExtraData(types).then((res) => {
      commit("SET_EXTRA_DATA", res);
    });
  },
};
