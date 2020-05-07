import *  as requestServices from "@/services/request";

export default {
  getRoutes: () => {
    return requestServices.clientAdmin.get("/routes").then((res) => res.data);
  },
  getRoute: (id) => {
    return requestServices.clientAdmin
      .get(`/routes/${id}`)
      .then((res) => res.data);
  },
  updateUser: (id, params) => {
    return requestServices.clientAdmin
      .put(`/users/${id}`, params)
      .then((res) => res.data);
  },
  createRoute: (params) => {
    return requestServices.clientAdmin
      .post(`/routes`, params)
      .then((res) => res.data);
  },
};
