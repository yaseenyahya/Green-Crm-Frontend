import {
  LOGIN_AS_MODAL_TOGGLE
} from "../ActionTypes";

export const setLoginAsModalToggle = (loginAsModalToggle) => {
  return {
    type: LOGIN_AS_MODAL_TOGGLE,
    payload: {
      loginAsModalToggle: loginAsModalToggle,
    },
  };
};

