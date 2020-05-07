import Cookies from "js-cookie";
import { authService } from "@/services/common";
import { configConstants } from "@/constants";
import { availableNav } from "@/helpers/permission";
import nav from "@/_nav";

export default {
  async login({ commit, dispatch }, paramsLogin) {
    const {
      accessToken,
      refreshToken,
      refreshTokenExpiredTime,
    } = await authService.login(paramsLogin);
    Cookies.set(configConstants.CONFIG_REFRESH_TOKEN, refreshToken, {
      expires: refreshTokenExpiredTime / 60 / 60 / 24,
    });
    commit("SET_ACCESS_TOKEN", accessToken);
    await dispatch("getUserInfo");
  },
  async getUserInfo({ commit, state }) {
    try {
      if (state[configConstants.CONFIG_ACCESS_TOKEN]) {
        const { user: userInfo } = await authService.getUserInfo();
        commit("SET_USER_INFO", userInfo);
        // bỏ comment kích hoạt permission
        // const { permissions = [] } = userInfo;
        // commit("moduleAdmin/common/SET_MENU", availableNav(nav, permissions), { root: true });
        commit("moduleAdmin/common/SET_MENU", nav, { root: true });
        return Promise.resolve(userInfo);
      } else {
        commit("SET_USER_INFO", null);
        const permissions = [];
        commit("moduleAdmin/common/SET_MENU", availableNav(nav, permissions), {
          root: true,
        });
        return null;
      }
    } catch (err) {
      commit("moduleAdmin/common/SET_MENU", [], { root: true });
      return Promise.resolve(null);
    }
  },
  logout({ commit }) {
    Cookies.remove(configConstants.CONFIG_REFRESH_TOKEN);
    commit("SET_ACCESS_TOKEN", null);
    commit("moduleAdmin/common/SET_MENU", [], { root: true });
  },
  setAccessToken: ({ commit }, token) => {
    commit("SET_ACCESS_TOKEN", token);
  },
};
