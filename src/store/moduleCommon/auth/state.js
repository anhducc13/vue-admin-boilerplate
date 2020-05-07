import { configConstants } from "@/constants";

export default {
  [configConstants.CONFIG_ACCESS_TOKEN]: localStorage.getItem(
    configConstants.CONFIG_ACCESS_TOKEN
  ),
  userInfo: null,
};
