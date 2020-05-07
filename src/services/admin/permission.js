import *  as requestServices from "@/services/request";

export default {
  getPermissions: () => {
    return requestServices.clientAdmin
      .get("/permissions")
      .then((res) => res.data);
  },
  getPermission: (id) => {
    return requestServices.clientAdmin
      .get(`/permissions/${id}`)
      .then((res) => res.data);
  },
  updateUser: (id, params) => {
    return requestServices.clientAdmin
      .put(`/users/${id}`, params)
      .then((res) => res.data);
  },
  createPermission: (params) => {
    return requestServices.clientAdmin
      .post(`/permissions`, params)
      .then((res) => res.data);
  },
  deleteUser: (id) => {
    return requestServices.clientAdmin
      .delete(`/users/${id}`)
      .then((res) => res.data);
  },
  deleteUsers: (userIds) => {
    return requestServices.clientAdmin
      .delete(`/users/delete-many`, { data: { userIds } })
      .then((res) => res.data);
  },
};
