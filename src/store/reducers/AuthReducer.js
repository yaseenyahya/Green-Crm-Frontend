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

export const AuthReducer = (
  state = {
    authSettings: null,
    authUserId: null,
    authPanelType: null,
    authPagesData: [],
    authUserPagesAssigned: [],
    authUserSwitchAccountSettings:null,
    authUserName:null,
    authUserWsSubscriptionReady:false,
    authMainAppBarHeight:64,
  },
  action
) => {
  switch (action.type) {
    case AUTH_SETTINGS:
      return Object.assign({}, state, {
        authSettings: action.payload.authSettings,
      });
    case AUTH_USERID:
      return Object.assign({}, state, {
        authUserId: action.payload.authUserId,
      });
    case AUTH_PANELTYPE:
      return Object.assign({}, state, {
        authPanelType: action.payload.authPanelType,
      });
    case AUTH_PAGES_DATA:
      return Object.assign({}, state, {
        authPagesData: action.payload.authPagesData,
      });
    case AUTH_USER_PAGES_ASSIGNED:
      return Object.assign({}, state, {
        authUserPagesAssigned: action.payload.authUserPagesAssigned,
      });
      case AUTH_USER_SWITCH_ACCOUNT_SETTINGS:
        return Object.assign({}, state, {
          authUserSwitchAccountSettings: action.payload.authUserSwitchAccountSettings,
        });
        case AUTH_USER_NAME:
          return Object.assign({}, state, {
            authUserName: action.payload.authUserName,
          });
          case AUTH_USER_WS_SUBSCRIPTION_READY:
            return Object.assign({}, state, {
              authUserWsSubscriptionReady: action.payload.authUserWsSubscriptionReady,
            });
            case AUTH_MAIN_APPBAR_HEIGHT:
              return Object.assign({}, state, {
                authMainAppBarHeight: action.payload.authMainAppBarHeight,
              });
    default:
      return state;
  }
};
