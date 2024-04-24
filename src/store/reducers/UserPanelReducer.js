import {
  USER_PANEL_NOTIFICATION_COUNT,
  USER_PANEL_CHAT_ONLINE,
  USER_PANEL_CHAT_ONLINE_INPUT,
  USER_PANEL_FULLSCREEN_TOGGLE,
  USER_PANEL_PROFILE_PIC_MENU_ANCHOR_EL,
  USER_PANEL_SETTINGS_MENU_ANCHOR_EL
} from "../ActionTypes";

export const UserPanelReducer = (
  state = {
    userPanelNotificationCount: 0,
    userPanelChatOnline: false,
    userPanelChatOnlineInput:false,
    userPanelFullscreenToggle: false,
    userPanelProfilePicMenuAnchorEl: null,
    userPanelSettingsMenuAnchorEl: null,

  },
  action
) => {
  switch (action.type) {

    case USER_PANEL_NOTIFICATION_COUNT:
      return Object.assign({}, state, {
        userPanelNotificationCount: action.payload.userPanelNotificationCount,
      });
    case USER_PANEL_CHAT_ONLINE_INPUT:
      return Object.assign({}, state, {
        userPanelChatOnlineInput: action.payload.userPanelChatOnlineInput,
      });
      case USER_PANEL_CHAT_ONLINE:
        return Object.assign({}, state, {
          userPanelChatOnline: action.payload.userPanelChatOnline,
        });
    case USER_PANEL_FULLSCREEN_TOGGLE:
      return Object.assign({}, state, {
        userPanelFullscreenToggle: action.payload.userPanelFullscreenToggle,
      });
    case USER_PANEL_SETTINGS_MENU_ANCHOR_EL:
      return Object.assign({}, state, {
        userPanelSettingsMenuAnchorEl:
          action.payload.userPanelSettingsMenuAnchorEl,
      });
    case USER_PANEL_PROFILE_PIC_MENU_ANCHOR_EL:
      return Object.assign({}, state, {
        userPanelProfilePicMenuAnchorEl:
          action.payload.userPanelProfilePicMenuAnchorEl,
      });
    default:
      return state;
  }
};
