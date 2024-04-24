import {
  USER_PANEL_NOTIFICATION_COUNT,
  USER_PANEL_CHAT_ONLINE,
  USER_PANEL_FULLSCREEN_TOGGLE,
  USER_PANEL_PROFILE_PIC_MENU_ANCHOR_EL,
  USER_PANEL_SETTINGS_MENU_ANCHOR_EL,
  USER_PANEL_CHAT_ONLINE_INPUT,

} from "../ActionTypes";
import {LocalStorage} from "../../auth/LocalStorage";

export const setUserPanelNotificationCount = (userPanelNotificationCount) => {
  return {
    type: USER_PANEL_NOTIFICATION_COUNT,
    payload: {
      userPanelNotificationCount: userPanelNotificationCount,
    },
  };
};
export const setUserPanelChatOnline = (userPanelChatOnline) => {

  return {
    type: USER_PANEL_CHAT_ONLINE,
    payload: {
      userPanelChatOnline: userPanelChatOnline,
    },
  };
};
export const setUserPanelChatOnlineInput = (userPanelChatOnlineInput) => {
  return {
    type: USER_PANEL_CHAT_ONLINE_INPUT,
    payload: {
      userPanelChatOnlineInput: userPanelChatOnlineInput,
    },
  };
};

export const setUserPanelFullscreenToggle = (userPanelFullscreenToggle) => {
  return {
    type: USER_PANEL_FULLSCREEN_TOGGLE,
    payload: {
      userPanelFullscreenToggle: userPanelFullscreenToggle,
    },
  };
};

export const setUserPanelSettingsMenuAnchorEl = (userPanelSettingsMenuAnchorEl) => {
  return {
    type: USER_PANEL_SETTINGS_MENU_ANCHOR_EL,
    payload: {
      userPanelSettingsMenuAnchorEl: userPanelSettingsMenuAnchorEl,
    },
  };
};
export const setUserPanelProfilePicMenuAnchorEl = (
  userPanelProfilePicMenuAnchorEl
) => {
  return {
    type: USER_PANEL_PROFILE_PIC_MENU_ANCHOR_EL,
    payload: {
      userPanelProfilePicMenuAnchorEl: userPanelProfilePicMenuAnchorEl,
    },
  };
};

