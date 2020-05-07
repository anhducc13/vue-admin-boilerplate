const LANG_KEY_VN = "vn";
const LANG_KEY_EN = "en";
const CONFIG_ACCESS_TOKEN = "ACCESS_TOKEN";
const CONFIG_REFRESH_TOKEN = "REFRESH_TOKEN";
const CODE_EXPIRED_ACCESS_TOKEN = "EXPIRED_ACCESS_TOKEN";
const SERVER_MAINTENANCE_MODAL = "server-maintenance-modal";
const translateStatus = {
  draft: "publishOption.DRAFT",
  "shared draft": "publishOption.SHARED_DRAFT",
  published: "publishOption.JOBBOARD",
  request: "publishOption.REQUEST",
  external: "publishOption.EXTERBAL_AGENCIES",
  open: "publishOption.INTERNAL",
  completed: "publishOption.COMPLETED",
  closed: "publishOption.CLOSED",
  tooltip: {
    draft: "publishOption.TOOLTIP_STATUS_DRAFT",
    "shared draft": "publishOption.TOOLTIP_STATUS_SHARED_DRAFT",
    published: "publishOption.TOOLTIP_STATUS_JOBBOARD",
    request: "publishOption.TOOLTIP_STATUS_REQUEST",
    external: "publishOption.TOOLTIP_STATUS_AGENCIES",
    open: "publishOption.TOOLTIP_STATUS_CONNECTED_TO_POOL",
    completed: "publishOption.TOOLTIP_STATUS_COMPLETE",
    closed: "publishOption.TOOLTIP_STATUS_CLOSE",
  },
};
const selectRecord = [
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 200, label: "200" },
  { value: -1, label: "shared.ALL" },
];
const format = {
  DATE_CREATED: "DD/MM/YYYY",
};
const PREFIX = "/api/v1";
const VUE_APP_API_URL = process.env.VUE_APP_API_URL + PREFIX;
export default {
  VUE_APP_API_URL_COMMON: `${VUE_APP_API_URL}/common`,
  VUE_APP_API_URL_STIE: VUE_APP_API_URL,
  VUE_APP_API_URL_ADMIN: `${VUE_APP_API_URL}/admin`,
  VUE_APP_PUBLIC_URL: process.env.VUE_APP_API_URL + "/uploads",
  VUE_APP_PLUGIN_URL: process.env.VUE_APP_API_URL + "/plugins",
  VUE_APP_API_TIMEOUT: process.env.VUE_APP_API_TIMEOUT,
  LANG_KEY_EN,
  LANG_KEY_VN,
  CONFIG_ACCESS_TOKEN,
  CONFIG_REFRESH_TOKEN,
  CODE_EXPIRED_ACCESS_TOKEN,
  SERVER_MAINTENANCE_MODAL,
  translateStatus,
  selectRecord,
  format,
};
