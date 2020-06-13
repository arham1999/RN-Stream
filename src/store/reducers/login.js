import Constants from "../constants";

const initialState = {
  isLogin: false,
  user: false
};

export const loginReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case Constants.User.LOGIN_USER_DATA:
      return { ...state, user: payload, isLogin: true };
    case Constants.User.LOGOUT:
      return initialState;
    default:
      return state;
  }
};
