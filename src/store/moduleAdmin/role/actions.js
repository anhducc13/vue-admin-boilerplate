import { roleService } from "@/services/admin";

export default {
  async getRoles({ commit }, {pagination, filter, sort}) {
    try { 
      await commit("SET_ROLE_FETCHING", true)
      await commit("SET_ROLE_ERROR")
      return await roleService.getRoles(pagination, filter, sort);
    } catch (error) {
      console.error(error);
      await commit("SET_ROLE_ERROR", error.code);
    } finally {
      await commit("SET_ROLE_FETCHING", false);
    }
  },
  async getRole({ commit }, id) {
    try { 
      await commit("SET_ROLE_FETCHING", true)
      await commit("SET_ROLE_ERROR")
      return await roleService.getRole(id);
    } catch (error) {
      console.error(error);
      await commit("SET_ROLE_ERROR", error.code);
    } finally {
      await commit("SET_ROLE_FETCHING", false);
    }
  },
  async deleteRole({ commit }, roleId) {
    try { 
      await commit("SET_ROLE_FETCHING", true)
      await commit("SET_ROLE_ERROR")
      return await roleService.deleteRole(roleId);
    } catch (error) {
      console.error(error);
      await commit("SET_ROLE_ERROR", error.code);
    } finally {
      await commit("SET_ROLE_FETCHING", false);
    }
  },
  async deleteRoles({ commit }, roleIds) {
    try { 
      await commit("SET_ROLE_FETCHING", true)
      await commit("SET_ROLE_ERROR")
      return await roleService.deleteRoles(roleIds);
    } catch (error) {
      console.error(error);
      await commit("SET_ROLE_ERROR", error.code);
    } finally {
      await commit("SET_ROLE_FETCHING", false);
    }
  },
  async updateRole({ commit }, {roleId, data}) {
    try {
      await commit("SET_ROLE_FETCHING", true)
      await commit("SET_ROLE_ERROR")
      return await roleService.updateRole(roleId, data);
    } catch (error) {
      console.error(error);
      await commit("SET_ROLE_ERROR", error.code);
    } finally {
      await commit("SET_ROLE_FETCHING", false);
    }
  },
  async createRole({ commit }, data) { 
    try {
      await commit("SET_ROLE_FETCHING", true)
      await commit("SET_ROLE_ERROR")
      return await roleService.createRole(data);
    } catch (error) {
      console.error(error);
      await commit("SET_ROLE_ERROR", error.code);
    } finally {
      await commit("SET_ROLE_FETCHING", false);
    }
  },
  async getPermissionsByRoleId({ commit }, id) {
    try { 
      await commit("SET_ROLE_FETCHING", true)
      await commit("SET_ROLE_ERROR")
      return await roleService.getPermissionsByRoleId(id);
    } catch (error) {
      console.error(error);
      await commit("SET_ROLE_ERROR", error.code);
    } finally {
      await commit("SET_ROLE_FETCHING", false);
    }
  },
  async assignPermissions({ commit }, {roleId, permissionIds}) {
    try { 
      await commit("SET_ROLE_FETCHING", true)
      await commit("SET_ROLE_ERROR")
      return await roleService.assignPermissions(roleId, permissionIds);
    } catch (error) {
      console.error(error);
      await commit("SET_ROLE_ERROR", error.code);
    } finally {
      await commit("SET_ROLE_FETCHING", false);
    }
  },
};
