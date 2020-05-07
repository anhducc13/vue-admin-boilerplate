import *  as requestServices from "@/services/request";
import { parameterHelper } from "@/helpers";

export default {
  getUsers: (pagination, filter, sort) => {
    const params = parameterHelper.getParams(pagination, sort, filter);
    return requestServices.clientAdmin
      .get("/users", { params })
      .then((res) => res.data);
  },
  getUser: (id) => {
    return requestServices.clientAdmin
      .get(`/users/${id}`)
      .then((res) => res.data);
  },
  updateUser: (id, params) => {
    return requestServices.clientAdmin
      .put(`/users/${id}`, params)
      .then((res) => res.data);
  },
  createUser: (params) => {
    return requestServices.clientAdmin
      .post(`/users`, params)
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
