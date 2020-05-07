import { configConstants } from "@/constants";

export default {
  SET_USER_INFO: (state, info) => {
    state.userInfo = info;
  },
  SET_ACCESS_TOKEN: (state, token) => {
    state[configConstants.CONFIG_ACCESS_TOKEN] = token;
    if (token) {
      localStorage.setItem(configConstants.CONFIG_ACCESS_TOKEN, token);
    } else {
      localStorage.removeItem(configConstants.CONFIG_ACCESS_TOKEN);
    }
  },
  SET_USER_ERROR(state, error) {
    state.userError = error;
  },
  SET_USER_FETCHING(state, value) {
    state.userFetching = value;
  },
};
