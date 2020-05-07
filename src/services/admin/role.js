import *  as requestServices from "@/services/request";
import { parameterHelper } from "@/helpers";

export default {
  getRoles: (pagination, filter, sort) => {
    const params = parameterHelper.getParams(pagination, sort, filter);
    return requestServices.clientAdmin
      .get("/roles", { params })
      .then((res) => res.data);
  },
  getRole: (id) => {
    return requestServices.clientAdmin
      .get(`/roles/${id}`)
      .then((res) => res.data);
  },
  updateRole: (id, params) => {
    return requestServices.clientAdmin
      .put(`/roles/${id}`, params)
      .then((res) => res.data);
  },
  createRole: (params) => {
    return requestServices.clientAdmin
      .post(`/roles`, params)
      .then((res) => res.data);
  },
  deleteRole: (id) => {
    return requestServices.clientAdmin
      .delete(`/roles/${id}`)
      .then((res) => res.data);
  },
  deleteRoles: (roleIds) => {
    return requestServices.clientAdmin
      .delete(`/roles/delete-many`, { data: { roleIds } })
      .then((res) => res.data);
  },
  getPermissionsByRoleId: (id) => {
    return requestServices.clientAdmin
      .get(`/roles/${id}/permissions`)
      .then((res) => res.data);
  },
  assignPermissions: (roleId, permissionIds) => {
    return requestServices.clientAdmin
      .post(`/roles/${roleId}/permissions`, { permissionIds })
      .then((res) => res.data);
  },
};
