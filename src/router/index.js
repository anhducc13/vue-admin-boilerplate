import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import adminRouter from "./adminRoute";
import siteRouter from "./siteRoute";
import store from "@/store";

NProgress.configure({ showSpinner: false });

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [...adminRouter, ...siteRouter],
});

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // const { permissions } = to.meta;
  // let { userInfo } = store.state.moduleCommon.auth;
  // if (!userInfo) {
  //   userInfo = await store.dispatch("moduleCommon/auth/getUserInfo");
  //   next(); // xóa dòng này nếu kích hoạt check permission

  //   // bỏ comment đoạn này để kích hoạt check permission
  //   // const { permissions: curr = [] } = userInfo || {};
  //   // if (!to.path.startsWith("/admin")) {
  //   //   next();
  //   //   return;
  //   // }
  //   // if (to.path === "/admin/login") {
  //   //   if (userInfo) {
  //   //     next({ path: "/admin" });
  //   //     return;
  //   //   }
  //   //   next();
  //   //   return;
  //   // }
  //   // if (to.path.startsWith("/admin/") || to.path === "/admin") {
  //   //   if (userInfo) {
  //   //     if (!permissions || permissions.every((x) => curr.includes(x))) {
  //   //       next();
  //   //       return;
  //   //     } else {
  //   //       next({ path: `/admin/403` });
  //   //       return;
  //   //     }
  //   //   } else {
  //   //     next(`/admin/login?redirect=${to.path}`);
  //   //     return;
  //   //   }
  //   // }
  // } else {
  //   next(); // xóa dòng này nếu kích hoạt check permission

  //   // bỏ comment đoạn này để kích hoạt check permission
  //   // const { permissions: curr = [] } = userInfo || {};
  //   // if (!to.path.startsWith("/admin")) {
  //   //   next();
  //   //   return;
  //   // }
  //   // if (to.path === "/admin/login") {
  //   //   if (userInfo) {
  //   //     next({ path: "/admin" });
  //   //     return;
  //   //   }
  //   //   next();
  //   //   return;
  //   // }
  //   // if (to.path.startsWith("/admin/") || to.path === "/admin") {
  //   //   if (userInfo) {
  //   //     if (!permissions || permissions.every((x) => curr.includes(x))) {
  //   //       next();
  //   //       return;
  //   //     } else {
  //   //       next({ path: `/admin/403` });
  //   //       return;
  //   //     }
  //   //   } else {
  //   //     next(`/admin/login?redirect=${to.path}`);
  //   //     return;
  //   //   }
  //   // }
  // }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
