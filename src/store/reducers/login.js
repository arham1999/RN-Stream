import Constants from "../constants";

const initialState = {
  user: null
};

export const loginReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case Constants.User.LOGIN_USER_DATA:
      return { ...state, user: payload };
    case Constants.User.LOGOUT:
      return initialState;
    default:
      return state;
  }
};
