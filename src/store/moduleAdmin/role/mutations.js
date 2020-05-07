export default {
  SET_ROLE_ERROR(state, error) {
    state.roleError = error;
  },
  SET_ROLE_FETCHING(state, value) {
    state.roleFetching = value;
  },
};
