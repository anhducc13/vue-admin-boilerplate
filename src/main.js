import Vue from "vue";
import App from "./App.vue";
import store from "@/store";

import i18n from "@/plugins/i18n";
import router from "./router";

import "@/extensions";
import "@/plugins";

import AdminLayout from "@/layouts/AdminLayout";
import WrapperLayout from "@/layouts/WrapperLayout";

Vue.config.productionTip = false;

Vue.component("admin-layout", AdminLayout);
Vue.component("wrapper-layout", WrapperLayout);

const vueApp = new Vue({
  el: "#app",
  i18n,
  store,
  router,
  render: h => h(App)
});

export default vueApp;
