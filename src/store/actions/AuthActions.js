import {
  AUTH_SETTINGS,
  AUTH_USERID,
  AUTH_PANELTYPE,
  AUTH_PAGES_DATA,
  AUTH_USER_PAGES_ASSIGNED,
  AUTH_USER_SWITCH_ACCOUNT_SETTINGS,
  AUTH_USER_NAME,
  AUTH_USER_WS_SUBSCRIPTION_READY,
  AUTH_MAIN_APPBAR_HEIGHT
} from "../ActionTypes";

export const setAuthSettings = (authSettings) => {
  return {
    type: AUTH_SETTINGS,
    payload: {
      authSettings: authSettings,
    },
  };
};
export const setAuthPanelType = (authPanelType) => {
  return {
    type: AUTH_PANELTYPE,
    payload: {
      authPanelType: authPanelType,
    },
  };
};
export const setAuthUserId = (authUserId) => {
  return {
    type: AUTH_USERID,
    payload: {
      authUserId: authUserId,
    },
  };
};
export const setAuthPagesData = (authPagesData) => {
  return {
    type: AUTH_PAGES_DATA,
    payload: {
      authPagesData: authPagesData,
    },
  };
};
export const setAuthUserPagesAssigned = (authUserPagesAssigned) => {
  return {
    type: AUTH_USER_PAGES_ASSIGNED,
    payload: {
      authUserPagesAssigned: authUserPagesAssigned,
    },
  };
};
export const setAuthUserSwitchAccountSettings = (authUserSwitchAccountSettings) => {
  return {
    type: AUTH_USER_SWITCH_ACCOUNT_SETTINGS,
    payload: {
      authUserSwitchAccountSettings: authUserSwitchAccountSettings,
    },
  };
};
export const setAuthUserName = (authUserName) => {
  return {
    type: AUTH_USER_NAME,
    payload: {
      authUserName: authUserName,
    },
  };
};
export const setAuthUserWsSubscriptionReady = (authUserWsSubscriptionReady) => {
  return {
    type: AUTH_USER_WS_SUBSCRIPTION_READY,
    payload: {
      authUserWsSubscriptionReady: authUserWsSubscriptionReady,
    },
  };
};
export const setAuthMainAppBarHeight = (authMainAppBarHeight) => {
  return {
    type: AUTH_MAIN_APPBAR_HEIGHT,
    payload: {
      authMainAppBarHeight: authMainAppBarHeight,
    },
  };
};