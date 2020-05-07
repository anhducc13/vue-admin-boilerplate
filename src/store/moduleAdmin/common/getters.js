export default {
  allCategories: (state) => {
    if (
      state.extraData &&
      state.extraData.categories &&
      state.extraData.categories.length
    ) {
      return state.extraData.categories;
    }
    return [];
  },
  allRoles: (state) => {
    if (
      state.extraData &&
      state.extraData.roles &&
      state.extraData.roles.length
    ) {
      return state.extraData.roles;
    }
    return [];
  },
  allPermissions: (state) => {
    if (
      state.extraData &&
      state.extraData.permissions &&
      state.extraData.permissions.length
    ) {
      return state.extraData.permissions;
    }
    return [];
  },
  allTags: (state) => {
    if (
      state.extraData &&
      state.extraData.tags &&
      state.extraData.tags.length
    ) {
      return state.extraData.tags;
    }
    return [];
  },
};
