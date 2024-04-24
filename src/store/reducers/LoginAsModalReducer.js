import {
  LOGIN_AS_MODAL_TOGGLE
} from "../ActionTypes";

export const LoginAsModalReducer = (
  state = {
    loginAsModalToggle: false,
   
  },
  action
) => {
  switch (action.type) {
    case LOGIN_AS_MODAL_TOGGLE:
      return Object.assign({}, state, {
        loginAsModalToggle: action.payload.loginAsModalToggle,
      });
    
    default:
      return state;
  }
};
