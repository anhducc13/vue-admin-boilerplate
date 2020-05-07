import { userService } from "@/services/admin";

export default {
  async getUsers({ commit }, { pagination, filter, sort }) {
    try {
      await commit("SET_USER_FETCHING", true);
      await commit("SET_USER_ERROR");
      return await userService.getUsers(pagination, filter, sort);
    } catch (error) {
      console.error(error);
      await commit("SET_USER_ERROR", error.code);
    } finally {
      await commit("SET_USER_FETCHING", false);
    }
  },
  async deleteUser({ commit }, userId) {
    try {
      await commit("SET_USER_FETCHING", true);
      await commit("SET_USER_ERROR");
      return await userService.deleteUser(userId);
    } catch (error) {
      console.error(error);
      await commit("SET_USER_ERROR", error.code);
    } finally {
      await commit("SET_USER_FETCHING", false);
    }
  },
  async deleteUsers({ commit }, userIds) {
    try {
      await commit("SET_USER_FETCHING", true);
      await commit("SET_USER_ERROR");
      return await userService.deleteUsers(userIds);
    } catch (error) {
      console.error(error);
      await commit("SET_USER_ERROR", error.code);
    } finally {
      await commit("SET_USER_FETCHING", false);
    }
  },
  async updateUser({ commit }, { userId, data }) {
    try {
      await commit("SET_USER_FETCHING", true);
      await commit("SET_USER_ERROR");
      return await userService.updateUser(userId, data);
    } catch (error) {
      console.error(error);
      await commit("SET_USER_ERROR", error.code);
    } finally {
      await commit("SET_USER_FETCHING", false);
    }
  },
  async createUser({ commit }, data) {
    try {
      await commit("SET_USER_FETCHING", true);
      await commit("SET_USER_ERROR");
      return await userService.createUser(data);
    } catch (error) {
      console.error(error);
      await commit("SET_USER_ERROR", error.code);
    } finally {
      await commit("SET_USER_FETCHING", false);
    }
  },
  async getUser({ commit }, userId) {
    try {
      await commit("SET_USER_FETCHING", true);
      await commit("SET_USER_ERROR");
      return await userService.getUser(userId);
    } catch (error) {
      console.error(error);
      await commit("SET_USER_ERROR", error.code);
    } finally {
      await commit("SET_USER_FETCHING", false);
    }
  },
};
