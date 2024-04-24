import {
  MANAGERS_LIST_DATA,
  MANAGERS_LIST_SELECTED_MANAGER,
} from "../ActionTypes";

export const ManagersListReducer = (
  state = {
    managersListData: [],
    managersListSelectedManager: null,
  },
  action
) => {
  switch (action.type) {
    case MANAGERS_LIST_DATA:
      return Object.assign({}, state, {
        managersListData: action.payload.managersListData,
      });
    case MANAGERS_LIST_SELECTED_MANAGER:
      return Object.assign({}, state, {
        managersListSelectedManager: action.payload.managersListSelectedManager,
      });
    default:
      return state;
  }
};
