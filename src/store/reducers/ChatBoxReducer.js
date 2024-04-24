import {
  CHAT_BOX_RECENT_SEARCH_INPUT_TEXT,
  CHAT_BOX_RECENT_SEARCH_TEXT,
  CHAT_BOX_RECENT_SEARCH_CHAT_IDS,
  CHAT_BOX_RECENT_CHAT_LIST_DATA,
  CHAT_BOX_MESSAGE_DATA,
  CHAT_BOX_SELECTED_CHATS_ON_FLOATING,
  CHAT_BOX_LABELS_POPOVER_ANCHOR_EL,
  CHAT_BOX_CUSTOMER_FORM_DATA,
  CHAT_BOX_MASSAGE_TEXT_INPUT,
  CHAT_BOX_WINDOW_SIZE,
  CHAT_BOX_RECENT_CHAT_LIST_SEARCH_FILTER_DATA,
  CHAT_BOX_FACEBOOK_IDS_WITH_PROFILE_DETAILS,
  CHAT_BOX_SUBSCRIPTION_STATUS,
  CHAT_BOX_MESSAGE_TEXTBOX_HEIGHT,
  CHAT_BOX_SEARCH_TEXT,
  CHAT_BOX_CONTAINER_CHAT_SEARCH_TOGGLE,
  CHAT_BOX_CONTAINER_CHAT_SEARCH_COUNT,
  CHAT_BOX_CONTAINER_CHAT_SEARCH_UP_BUTTON_TOGGLE,
  CHAT_BOX_CONTAINER_CHAT_SEARCH_DOWN_BUTTON_TOGGLE,
  CHAT_BOX_PENDING_CHAT_COUNT,
  CHAT_BOX_PENDING_CHAT_COUNT_DETAIL_CONTAINER_ANCHER_EL,
  CHAT_BOX_PENDING_CHAT_COUNT_DETAILS,
  CHAT_BOX_MARK_NOT_TO_ADD_IN_CHAT_CIRCLE_FOR_LABEL,
  CHAT_BOX_TYPING_MESSAGE_DETAILS,
  CHAT_BOX_RECENT_CHAT_LIST_DATA_TOTAL_COUNT,
  CHAT_BOX_RECENT_CHAT_LIST_SHOW_ALL_LIST_TOGGLE,
CHAT_BOX_RECENT_CHAT_LIST_SHOW_ALL_LIST_BY_MANAGER_TOGGLE,
CHAT_BOX_RECENT_CHAT_LIST_SHOW_ALL_LIST_BY_MANAGER_BUTTON_TOGGLE
} from "../ActionTypes";
import { LocalStorage } from "../../auth/LocalStorage";
export const ChatBoxReducer = (
  state = {
    chatBoxRecentSearchInputText: "",
    chatBoxRecentSearchText: "",
    chatBoxRecentSearchChatIds:[],
    chatBoxRecentChatListData: [],
    chatBoxRecentChatListShowAllListToggle:false,
    chatBoxRecentChatListShowAllListByManagerToggle:false,
    chatBoxRecentChatListShowAllListByManagerButtonToggle:false,
 
    chatBoxMessageData: [],
    chatBoxSelectedChatsOnFloating: [],
    ChatBoxMessageBoxHeight: 300,
    chatBoxLabelsPopoverAnchorEl: null,
    chatBoxCustomerFormData: [],

    chatBoxMessageTextInput: "",
    chatBoxWindowSize: {
      width: undefined,
      height: undefined,
    },
    chatBoxRecentChatListSearchSearchFilterData: null,
    chatBoxFacebookIDsWithProfileDetails:
      LocalStorage.getChatBoxFacebookIDsWithProfileDetails() || [],
    chatBoxSubscriptionStatus: false,
    chatBoxMessageTextBoxHeight: 38,
    chatBoxSearchText: "",
    chatBoxContainerChatSearchToggle: false,
    chatBoxContainerChatSearchCount:0,
    chatBoxContainerChatSearchUpButtonToggle:true,
    chatBoxContainerChatSearchDownButtonToggle:true,
    chatBoxPendingChatCount:0,
    chatBoxPendingChatCountDetailContainerAncherEl:null,
    chatBoxPendingChatCountDetails:[],
    chatBoxMarkNotToAddInChatCircleForLabel:false,
    chatBoxTypingMessageDetails:null,
    chatBoxRecentChatListDataTotalCount:null
    
  },
  action
) => {
  switch (action.type) {
    case CHAT_BOX_RECENT_SEARCH_INPUT_TEXT:
      return Object.assign({}, state, {
        chatBoxRecentSearchInputText:
          action.payload.chatBoxRecentSearchInputText,
      });
    case CHAT_BOX_RECENT_SEARCH_TEXT:
      return Object.assign({}, state, {
        chatBoxRecentSearchText: action.payload.chatBoxRecentSearchText,
      });
      case CHAT_BOX_RECENT_SEARCH_CHAT_IDS:
        return Object.assign({}, state, {
          chatBoxRecentSearchChatIds: action.payload.chatBoxRecentSearchChatIds,
        });
    case CHAT_BOX_RECENT_CHAT_LIST_DATA:
      return Object.assign({}, state, {
        chatBoxRecentChatListData: action.payload.chatBoxRecentChatListData,
      });
      case CHAT_BOX_RECENT_CHAT_LIST_SHOW_ALL_LIST_TOGGLE:
        return Object.assign({}, state, {
          chatBoxRecentChatListShowAllListToggle: action.payload.chatBoxRecentChatListShowAllListToggle,
        });
        case CHAT_BOX_RECENT_CHAT_LIST_SHOW_ALL_LIST_BY_MANAGER_TOGGLE:
          return Object.assign({}, state, {
            chatBoxRecentChatListShowAllListByManagerToggle: action.payload.chatBoxRecentChatListShowAllListByManagerToggle,
          });
          case CHAT_BOX_RECENT_CHAT_LIST_SHOW_ALL_LIST_BY_MANAGER_BUTTON_TOGGLE:
            return Object.assign({}, state, {
              chatBoxRecentChatListShowAllListByManagerButtonToggle: action.payload.chatBoxRecentChatListShowAllListByManagerButtonToggle,
            });
    case CHAT_BOX_SELECTED_CHATS_ON_FLOATING:
      return Object.assign({}, state, {
        chatBoxSelectedChatsOnFloating:
          action.payload.chatBoxSelectedChatsOnFloating,
      });
    case CHAT_BOX_MESSAGE_DATA:
      return Object.assign({}, state, {
        chatBoxMessageData: action.payload.chatBoxMessageData,
      });
    case CHAT_BOX_LABELS_POPOVER_ANCHOR_EL:
      return Object.assign({}, state, {
        chatBoxLabelsPopoverAnchorEl:
          action.payload.chatBoxLabelsPopoverAnchorEl,
      });
    case CHAT_BOX_CUSTOMER_FORM_DATA:
      return Object.assign({}, state, {
        chatBoxCustomerFormData: action.payload.chatBoxCustomerFormData,
      });
    case CHAT_BOX_MASSAGE_TEXT_INPUT:
      return Object.assign({}, state, {
        chatBoxMessageTextInput: action.payload.chatBoxMessageTextInput,
      });
    case CHAT_BOX_WINDOW_SIZE:
      return Object.assign({}, state, {
        chatBoxWindowSize: action.payload.chatBoxWindowSize,
      });
    case CHAT_BOX_RECENT_CHAT_LIST_SEARCH_FILTER_DATA:
      return Object.assign({}, state, {
        chatBoxRecentChatListSearchSearchFilterData:
          action.payload.chatBoxRecentChatListSearchSearchFilterData,
      });
    case CHAT_BOX_FACEBOOK_IDS_WITH_PROFILE_DETAILS:
      return Object.assign({}, state, {
        chatBoxFacebookIDsWithProfileDetails:
          action.payload.chatBoxFacebookIDsWithProfileDetails,
      });
    case CHAT_BOX_SUBSCRIPTION_STATUS:
      return Object.assign({}, state, {
        chatBoxSubscriptionStatus: action.payload.chatBoxSubscriptionStatus,
      });
    case CHAT_BOX_MESSAGE_TEXTBOX_HEIGHT:
      return Object.assign({}, state, {
        chatBoxMessageTextBoxHeight: action.payload.chatBoxMessageTextBoxHeight,
      });
    case CHAT_BOX_SEARCH_TEXT:
      return Object.assign({}, state, {
        chatBoxSearchText: action.payload.chatBoxSearchText,
      });
    case CHAT_BOX_CONTAINER_CHAT_SEARCH_TOGGLE:
      return Object.assign({}, state, {
        chatBoxContainerChatSearchToggle:
          action.payload.chatBoxContainerChatSearchToggle,
      });
      case CHAT_BOX_CONTAINER_CHAT_SEARCH_COUNT:
      return Object.assign({}, state, {
        chatBoxContainerChatSearchCount:
          action.payload.chatBoxContainerChatSearchCount,
      });
      case CHAT_BOX_CONTAINER_CHAT_SEARCH_UP_BUTTON_TOGGLE:
        return Object.assign({}, state, {
          chatBoxContainerChatSearchUpButtonToggle:
            action.payload.chatBoxContainerChatSearchUpButtonToggle,
        });
        case CHAT_BOX_CONTAINER_CHAT_SEARCH_DOWN_BUTTON_TOGGLE:
          return Object.assign({}, state, {
            chatBoxContainerChatSearchDownButtonToggle:
              action.payload.chatBoxContainerChatSearchDownButtonToggle,
          });
          case  CHAT_BOX_PENDING_CHAT_COUNT:
            return Object.assign({}, state, {
              chatBoxPendingChatCount:
                action.payload.chatBoxPendingChatCount,
            });
            case  CHAT_BOX_PENDING_CHAT_COUNT_DETAIL_CONTAINER_ANCHER_EL:
              return Object.assign({}, state, {
                chatBoxPendingChatCountDetailContainerAncherEl:
                  action.payload.chatBoxPendingChatCountDetailContainerAncherEl,
              });
              case  CHAT_BOX_PENDING_CHAT_COUNT_DETAILS:
                return Object.assign({}, state, {
                  chatBoxPendingChatCountDetails:
                    action.payload.chatBoxPendingChatCountDetails,
                });
            case CHAT_BOX_MARK_NOT_TO_ADD_IN_CHAT_CIRCLE_FOR_LABEL:
              return Object.assign({}, state, {
                chatBoxMarkNotToAddInChatCircleForLabel:
                  action.payload.chatBoxMarkNotToAddInChatCircleForLabel,
              });
              case CHAT_BOX_TYPING_MESSAGE_DETAILS:
                return Object.assign({}, state, {
                  chatBoxTypingMessageDetails:
                    action.payload.chatBoxTypingMessageDetails,
                });
                case CHAT_BOX_RECENT_CHAT_LIST_DATA_TOTAL_COUNT:
                  return Object.assign({}, state, {
                    chatBoxRecentChatListDataTotalCount:
                      action.payload.chatBoxRecentChatListDataTotalCount,
                  });
    default:
      return state;
  }
};
