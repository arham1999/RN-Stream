import Constants from "../constants";

export const loginUserData = payload => (dispatch, getState) => {
  return dispatch({ type: Constants.User.LOGIN_USER_DATA, payload });
};

export const logout = () => (dispatch, getState) => {
  return dispatch({ type: Constants.User.LOGOUT, payload: null });
};