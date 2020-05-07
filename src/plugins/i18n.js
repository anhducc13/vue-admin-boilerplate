import Vue from "vue";
import VueI18n from "vue-i18n";
import store from "@/store";
import vnMessage from "@/assets/i18n/vn.json";
import enMessage from "@/assets/i18n/en.json";

Vue.use(VueI18n);

const messages = {
  vn: vnMessage,
  en: enMessage,
};

const i18n = new VueI18n({
  locale: store.state.moduleAdmin.common.lang,
  messages,
  fallbackLocale: store.state.moduleAdmin.common.lang,
});

export default i18n;
