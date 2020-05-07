import *  as requestServices from "@/services/request";

export default {
  login: (params) => {
    return requestServices.clientCommon
      .post("/auth/login", params)
      .then((res) => res.data);
  },
  getUserInfo: () => {
    return requestServices.clientCommon.get("/auth/me").then((res) => res.data);
  },
};
