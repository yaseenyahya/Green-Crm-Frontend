import {
  USERS_LIST_SEARCH_INPUT_TEXT,
  USERS_LIST_SEARCH_TEXT,
  USERS_LIST_DATA,
  USERS_LIST_SUBSCRIPTION_DATA,
  USERS_LIST_SELECTED_USER,
  USERS_LIST_CONTEXT_MENU_POS_AND_OBJECT_DETAILS
} from "../ActionTypes";

export const setUsersListSearchInputText = (usersListSearchInputText) => {
  return {
    type: USERS_LIST_SEARCH_INPUT_TEXT,
    payload: {
      usersListSearchInputText: usersListSearchInputText,
    },
  };
};
export const setUsersListSearchText = (usersListSearchText) => {
  return {
    type: USERS_LIST_SEARCH_TEXT,
    payload: {
      usersListSearchText: usersListSearchText,
    },
  };
};
export const setUsersListData = (usersListData) => {
  return {
    type: USERS_LIST_DATA,
    payload: {
      usersListData: usersListData,
    },
  };
};
export const setUsersListSubscriptionData = (usersListSubscriptionData) => {
  return {
    type: USERS_LIST_SUBSCRIPTION_DATA,
    payload: {
      usersListSubscriptionData: usersListSubscriptionData,
    },
  };
};
export const setUsersListSelectedUser = (usersListSelectedUser) => {
  return {
    type: USERS_LIST_SELECTED_USER,
    payload: {
      usersListSelectedUser: usersListSelectedUser,
    },
  };
};
export const setUsersListContextMenuPosAndObjectDetails = (usersListContextMenuPosAndObjectDetails) => {
  return {
    type: USERS_LIST_CONTEXT_MENU_POS_AND_OBJECT_DETAILS,
    payload: {
      usersListContextMenuPosAndObjectDetails: usersListContextMenuPosAndObjectDetails,
    },
  };
};
