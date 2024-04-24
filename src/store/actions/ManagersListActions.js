import {
  MANAGERS_LIST_DATA,
  MANAGERS_LIST_SELECTED_MANAGER,
} from "../ActionTypes";

export const setManagersListData = (managersListData) => {
  return {
    type: MANAGERS_LIST_DATA,
    payload: {
      managersListData: managersListData,
    },
  };
};
export const setManagersListSelectedManager = (managersListSelectedManager) => {
  return {
    type: MANAGERS_LIST_SELECTED_MANAGER,
    payload: {
      managersListSelectedManager: managersListSelectedManager,
    },
  };
};