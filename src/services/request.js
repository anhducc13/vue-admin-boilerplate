import axios from "axios";
import Vue from "@/main";
import Cookies from "js-cookie";
import store from "@/store";
import { notification } from "ant-design-vue";
import { configConstants } from "@/constants";
import ServerDownModal from "@/components/shared/Modals/ServerDownModal";

const TYPE_TOKEN = "Bearer";

const handleExpiredAccessToken = async (error, globalLoading = false) => {
  if (!error || !error.response || error.status >= 500) {
    if (!window["pp-server-maintenance-modal"]) {
      window["pp-server-maintenance-modal"] =
        configConstants.SERVER_MAINTENANCE_MODAL;
      Vue.$modal.show(
        ServerDownModal,
        null,
        {
          adaptive: true,
          name: configConstants.SERVER_MAINTENANCE_MODAL,
          height: "auto",
          minWidth: 570,
          clickToClose: false,
        },
        {
          closed: () => {
            window["pp-server-maintenance-modal"] = null;
          },
        }
      );
    }
    return Promise.reject(error.response.data);
  } else {
    const originalRequest = error.config;
    if (
      error.response.data.code === configConstants.CODE_EXPIRED_ACCESS_TOKEN &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const {
          data: { data },
        } = await axios.post(
          `${configConstants.VUE_APP_API_URL_COMMON}/auth/refresh-token`,
          {
            refreshToken: Cookies.get(configConstants.CONFIG_REFRESH_TOKEN),
          }
        );
        store.dispatch("moduleCommon/auth/setAccessToken", data.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `${TYPE_TOKEN} ${data.accessToken}`;
        const { data: newData } = await axios(originalRequest);
        return Promise.resolve(newData);
      } catch (error) {
        if (globalLoading) {
          notification.error({
            message: Vue.$t("REQUEST_ERROR"),
          });
        }
        return Promise.reject(error.response.data);
      }
    }
    if (globalLoading) {
      const { code, message } = error.response.data;
      notification.error({
        message: Vue.$t(`error.${code}`),
      });
    }
    return Promise.reject(error.response.data);
  }
};

const client = axios.create({
  baseURL: configConstants.VUE_APP_API_URL,
  timeout: configConstants.VUE_APP_API_TIMEOUT,
});

client.interceptors.request.use(
  (config) => {
    const token =
      store.state.moduleCommon.auth[configConstants.CONFIG_ACCESS_TOKEN];
    config.headers["Authorization"] = `${TYPE_TOKEN} ${token}`;
    return config;
  },
  (error) => error.response.data
);

client.interceptors.response.use(
  (response) => response.data,
  (error) => handleExpiredAccessToken(error)
);

const clientCommon = axios.create({
  baseURL: configConstants.VUE_APP_API_URL_COMMON,
  timeout: configConstants.VUE_APP_API_TIMEOUT,
});

clientCommon.interceptors.request.use(
  (config) => {
    const token =
      store.state.moduleCommon.auth[configConstants.CONFIG_ACCESS_TOKEN];
    config.headers["Authorization"] = `${TYPE_TOKEN} ${token}`;
    return config;
  },
  (error) => error.response.data
);

clientCommon.interceptors.response.use(
  (response) => response.data,
  (error) => handleExpiredAccessToken(error)
);

const clientAdmin = axios.create({
  baseURL: configConstants.VUE_APP_API_URL_ADMIN,
  timeout: configConstants.VUE_APP_API_TIMEOUT,
});

clientAdmin.interceptors.request.use(
  (config) => {
    const token =
      store.state.moduleCommon.auth[configConstants.CONFIG_ACCESS_TOKEN];
    config.headers["Authorization"] = `${TYPE_TOKEN} ${token}`;
    return config;
  },
  (error) => error.response.data
);

clientAdmin.interceptors.response.use(
  (response) => response.data,
  (error) => handleExpiredAccessToken(error)
);

const clientSite = axios.create({
  baseURL: configConstants.VUE_APP_API_URL_STIE,
  timeout: configConstants.VUE_APP_API_TIMEOUT,
});

clientSite.interceptors.request.use(
  (config) => {
    const token =
      store.state.moduleCommon.auth[configConstants.CONFIG_ACCESS_TOKEN];
    config.headers["Authorization"] = `${TYPE_TOKEN} ${token}`;
    return config;
  },
  (error) => error.response.data
);

clientSite.interceptors.response.use(
  (response) => response.data,
  (error) => handleExpiredAccessToken(error)
);

export {
  client,
  clientCommon,
  clientSite,
  clientAdmin,
};
