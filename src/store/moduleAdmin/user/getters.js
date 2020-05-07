export default {
  username: state => {
    return state.userInfo ? state.userInfo.userName : "";
  },
  avatar: state => {
    return state.userInfo ? state.userInfo.avatar : "";
  },
  isAdmin: state => {
    return state.userInfo && state.userInfo.role
      ? state.userInfo.role.roleAcp
      : undefined;
  },
  userError: state => state.userError,
  userFetching: state => state.userFetching
};
