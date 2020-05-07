import *  as requestServices from "@/services/request";

export default {
  getMenuTree: (type) => {
    const params = { type };
    return requestServices.clientAdmin
      .get("/menus", { params })
      .then((res) => res.data);
  },
  addMenu: (addItem, updateItem) => {
    return requestServices.clientAdmin
      .post("/menus/add", {
        addItem,
        updateItem,
      })
      .then((res) => res.data);
  },
  updateMenu: (updateItems) => {
    return requestServices.clientAdmin
      .post("/menus/update", {
        updateItems,
      })
      .then((res) => res.data);
  },
  deleteMenu: (deleteIds, updateItems) => {
    return requestServices.clientAdmin
      .post("/menus/delete", {
        deleteIds,
        updateItems,
      })
      .then((res) => res.data);
  },
};
