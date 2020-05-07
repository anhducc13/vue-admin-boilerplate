import *  as requestServices from "@/services/request";

const TYPES = ["roles", "permissions", "categories", "tags"];

export default {
  getExtraData: (types) => {
    if (!types) {
      types = TYPES;
    }
    return requestServices.clientAdmin
      .get("/extra-data", { params: { type: types.join(",") } })
      .then((res) => res.data);
  },
};
