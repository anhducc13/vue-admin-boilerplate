import Cookies from "js-cookie";
import { configConstants } from "@/constants";
import nav from "@/_nav";

export default {
  isMobile: false,
  menu: nav,
  loading: false,
  lang: Cookies.get("lang") || configConstants.LANG_KEY_VN,
  extraData: null,
};
