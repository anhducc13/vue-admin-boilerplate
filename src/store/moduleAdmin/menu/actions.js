import { menuService } from "@/services/admin";

export default {
  async getMenuTree({ commit }, type) {
    try { 
      await commit("SET_MENU_FETCHING", true)
      await commit("SET_MENU_ERROR")
      return await menuService.getMenuTree(type);
    } catch (error) {
      console.error(error);
      await commit("SET_MENU_ERROR", error.code || "error.UNKNOWN_ERROR");
    } finally {
      await commit("SET_MENU_FETCHING", false);
    }
  },
  async addMenu({ commit }, {addItem, updateItem}) {
    try { 
      await commit("SET_MENU_FETCHING", true)
      await commit("SET_MENU_ERROR")
      return await menuService.addMenu(addItem, updateItem);
    } catch (error) {
      console.error(error);
      await commit("SET_MENU_ERROR", error.code || "error.UNKNOWN_ERROR");
    } finally {
      await commit("SET_MENU_FETCHING", false);
    }
  },
  async updateMenu({ commit }, updateItems) {
    try { 
      await commit("SET_MENU_FETCHING", true)
      await commit("SET_MENU_ERROR")
      return await menuService.updateMenu(updateItems);
    } catch (error) {
      console.error(error);
      await commit("SET_MENU_ERROR", error.code || "error.UNKNOWN_ERROR");
    } finally {
      await commit("SET_MENU_FETCHING", false);
    }
  },
  async deleteMenu({ commit }, {deleteIds, updateItems}) {
    try { 
      await commit("SET_MENU_FETCHING", true)
      await commit("SET_MENU_ERROR")
      return await menuService.deleteMenu(deleteIds, updateItems);
    } catch (error) {
      console.error(error);
      await commit("SET_MENU_ERROR", error.code || "error.UNKNOWN_ERROR");
    } finally {
      await commit("SET_MENU_FETCHING", false);
    }
  },
};
