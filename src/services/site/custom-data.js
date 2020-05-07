import * as requestServices from "@/services/request";

export default {
  getMenu: () => {
    return requestServices.clientSite
      .get("/custom-data", { params: { code: "menu" } })
      .then((res) => res.data);
  },
};
