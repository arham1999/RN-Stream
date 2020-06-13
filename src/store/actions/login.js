import Constants from "../constants";

export const loginUserData = payload => {
  return (dispatch, getState) => {
    dispatch({
      type: Constants.User.LOGIN_USER_DATA,
      payload
    });
  };
};

export const logout = () => (dispatch, getState) =>
  dispatch({ type: Constants.User.LOGOUT, payload: null });
