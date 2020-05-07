import Cookies from "js-cookie";
import vueApp from "@/main";

export default {
  SET_DEVICE: (state, isMobile) => {
    state.isMobile = isMobile;
  },
  SET_MENU: (state, menu) => {
    state.menu = menu;
  },
  SET_LOADING: (state, isLoading) => {
    state.loading = isLoading;
  },
  SET_LANG: (state, lang) => {
    state.lang = lang;
    vueApp.$i18n.locale = lang;
    Cookies.set("lang", lang);
  },
  SET_EXTRA_DATA: (state, extraData) => {
    const { extraData: old } = state;
    state.extraData = { ...old, ...extraData };
  },
};
