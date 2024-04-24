import {
  CHAT_BOX_RECENT_SEARCH_INPUT_TEXT,
  CHAT_BOX_RECENT_SEARCH_TEXT,
  CHAT_BOX_RECENT_SEARCH_CHAT_IDS,
  CHAT_BOX_RECENT_CHAT_LIST_DATA,
  CHAT_BOX_MESSAGE_DATA,
  CHAT_BOX_SELECTED_CHATS_ON_FLOATING,
  CHAT_BOX_LABELS_POPOVER_ANCHOR_EL,
  CHAT_BOX_CUSTOMER_FORM_DATA,
  CHAT_BOX_MASSAGE_TEXT_INPUT ,
  CHAT_BOX_WINDOW_SIZE ,
  CHAT_BOX_RECENT_CHAT_LIST_SEARCH_FILTER_DATA ,
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
import {LocalStorage} from "../../auth/LocalStorage";
export const setChatBoxRecentSearchInputText = (chatBoxRecentSearchInputText) => {
  return {
    type: CHAT_BOX_RECENT_SEARCH_INPUT_TEXT,
    payload: {
      chatBoxRecentSearchInputText: chatBoxRecentSearchInputText,
    },
  };
};
export const setChatBoxRecentSearchText = (chatBoxRecentSearchText) => {
  return {
    type: CHAT_BOX_RECENT_SEARCH_TEXT,
    payload: {
      chatBoxRecentSearchText: chatBoxRecentSearchText,
    },
  };
};
export const setChatBoxRecentSearchChatIds = (chatBoxRecentSearchChatIds) => {
  return {
    type: CHAT_BOX_RECENT_SEARCH_CHAT_IDS,
    payload: {
      chatBoxRecentSearchChatIds: chatBoxRecentSearchChatIds,
    },
  };
};

export const setChatBoxRecentChatListData = (chatBoxRecentChatListData) => {
  return {
    type: CHAT_BOX_RECENT_CHAT_LIST_DATA,
    payload: {
      chatBoxRecentChatListData: chatBoxRecentChatListData,
    },
  };
};
export const setChatBoxRecentChatListShowAllListToggle = (chatBoxRecentChatListShowAllListToggle) => {
  return {
    type: CHAT_BOX_RECENT_CHAT_LIST_SHOW_ALL_LIST_TOGGLE,
    payload: {
      chatBoxRecentChatListShowAllListToggle: chatBoxRecentChatListShowAllListToggle,
    },
  };
};
export const setChatBoxRecentChatListShowAllListByManagerToggle = (chatBoxRecentChatListShowAllListByManagerToggle) => {
  return {
    type: CHAT_BOX_RECENT_CHAT_LIST_SHOW_ALL_LIST_BY_MANAGER_TOGGLE,
    payload: {
      chatBoxRecentChatListShowAllListByManagerToggle: chatBoxRecentChatListShowAllListByManagerToggle,
    },
  };
};
export const setChatBoxRecentChatListShowAllListByManagerButtonToggle = (chatBoxRecentChatListShowAllListByManagerButtonToggle) => {
  return {
    type: CHAT_BOX_RECENT_CHAT_LIST_SHOW_ALL_LIST_BY_MANAGER_BUTTON_TOGGLE,
    payload: {
      chatBoxRecentChatListShowAllListByManagerButtonToggle: chatBoxRecentChatListShowAllListByManagerButtonToggle,
    },
  };
};
export const setChatBoxSelectedChatsOnFloating = (chatBoxSelectedChatsOnFloating) => {
  return {
    type: CHAT_BOX_SELECTED_CHATS_ON_FLOATING,
    payload: {
      chatBoxSelectedChatsOnFloating: chatBoxSelectedChatsOnFloating,
    },
  };
};
export const setChatBoxMessageData = (chatBoxMessageData) => {
  return {
    type: CHAT_BOX_MESSAGE_DATA,
    payload: {
      chatBoxMessageData: chatBoxMessageData,
    },
  };
};
export const setChatBoxLabelsPopoverAnchorEl = (chatBoxLabelsPopoverAnchorEl) => {
  return {
    type: CHAT_BOX_LABELS_POPOVER_ANCHOR_EL,
    payload: {
      chatBoxLabelsPopoverAnchorEl: chatBoxLabelsPopoverAnchorEl,
    },
  };
};
export const setChatBoxCustomerFormData = (chatBoxCustomerFormData) => {
  return {
    type: CHAT_BOX_CUSTOMER_FORM_DATA,
    payload: {
      chatBoxCustomerFormData: chatBoxCustomerFormData,
    },
  };
};
export const setChatBoxMessageTextInput = (chatBoxMessageTextInput) => {
  return {
    type: CHAT_BOX_MASSAGE_TEXT_INPUT,
    payload: {
      chatBoxMessageTextInput: chatBoxMessageTextInput,
    },
  };
};
export const setChatBoxWindowSize = (chatBoxWindowSize) => {
  return {
    type: CHAT_BOX_WINDOW_SIZE,
    payload: {
      chatBoxWindowSize: chatBoxWindowSize,
    },
  };
};
export const setChatBoxRecentChatListSearchSearchFilterData = (chatBoxRecentChatListSearchSearchFilterData) => {
  return {
    type: CHAT_BOX_RECENT_CHAT_LIST_SEARCH_FILTER_DATA,
    payload: {
      chatBoxRecentChatListSearchSearchFilterData: chatBoxRecentChatListSearchSearchFilterData,
    },
  };
};
export const setChatBoxFacebookIDsWithProfileDetails = (chatBoxFacebookIDsWithProfileDetails) => {
  LocalStorage.setChatBoxFacebookIDsWithProfileDetails(chatBoxFacebookIDsWithProfileDetails);
  return {
    type:   CHAT_BOX_FACEBOOK_IDS_WITH_PROFILE_DETAILS,
    payload: {
      chatBoxFacebookIDsWithProfileDetails: chatBoxFacebookIDsWithProfileDetails,
    },
  };
};
export const setChatBoxSubscriptionStatus = (chatBoxSubscriptionStatus) => {
 
  return {
    type:   CHAT_BOX_SUBSCRIPTION_STATUS,
    payload: {
      chatBoxSubscriptionStatus: chatBoxSubscriptionStatus,
    },
  };
};
export const setChatBoxMessageTextBoxHeight = (chatBoxMessageTextBoxHeight) => {
 
  return {
    type:   CHAT_BOX_MESSAGE_TEXTBOX_HEIGHT,
    payload: {
      chatBoxMessageTextBoxHeight: chatBoxMessageTextBoxHeight,
    },
  };
};
export const setChatBoxSearchText = (chatBoxSearchText) => {
 
  return {
    type:   CHAT_BOX_SEARCH_TEXT,
    payload: {
      chatBoxSearchText: chatBoxSearchText,
    },
  };
};
export const setChatBoxContainerChatSearchToggle = (chatBoxContainerChatSearchToggle) => {
 
  return {
    type:   CHAT_BOX_CONTAINER_CHAT_SEARCH_TOGGLE,
    payload: {
      chatBoxContainerChatSearchToggle: chatBoxContainerChatSearchToggle,
    },
  };
};
export const setChatBoxContainerChatSearchCount = (chatBoxContainerChatSearchCount) => {
 
  return {
    type:   CHAT_BOX_CONTAINER_CHAT_SEARCH_COUNT,
    payload: {
      chatBoxContainerChatSearchCount: chatBoxContainerChatSearchCount,
    },
  };
};
export const setChatBoxContainerChatSearchUpButtonToggle = (chatBoxContainerChatSearchUpButtonToggle) => {
 
  return {
    type:   CHAT_BOX_CONTAINER_CHAT_SEARCH_UP_BUTTON_TOGGLE,
    payload: {
      chatBoxContainerChatSearchUpButtonToggle: chatBoxContainerChatSearchUpButtonToggle,
    },
  };
};
export const setChatBoxContainerChatSearchDownButtonToggle = (chatBoxContainerChatSearchDownButtonToggle) => {
 
  return {
    type:   CHAT_BOX_CONTAINER_CHAT_SEARCH_DOWN_BUTTON_TOGGLE,
    payload: {
      chatBoxContainerChatSearchDownButtonToggle: chatBoxContainerChatSearchDownButtonToggle,
    },
  };
};
export const setChatBoxPendingChatCount = (
  chatBoxPendingChatCount
) => {
  return {
    type: CHAT_BOX_PENDING_CHAT_COUNT,
    payload: {
      chatBoxPendingChatCount: chatBoxPendingChatCount,
    },
  };
};
export const setChatBoxPendingChatCountDetailContainerAncherEl = (
  chatBoxPendingChatCountDetailContainerAncherEl
) => {
  return {
    type: CHAT_BOX_PENDING_CHAT_COUNT_DETAIL_CONTAINER_ANCHER_EL,
    payload: {
      chatBoxPendingChatCountDetailContainerAncherEl: chatBoxPendingChatCountDetailContainerAncherEl,
    },
  };
};
export const setChatBoxPendingChatCountDetails = (
  chatBoxPendingChatCountDetails
) => {
  return {
    type: CHAT_BOX_PENDING_CHAT_COUNT_DETAILS,
    payload: {
      chatBoxPendingChatCountDetails: chatBoxPendingChatCountDetails,
    },
  };
};

export const setChatBoxMarkNotToAddInChatCircleForLabel = (
  chatBoxMarkNotToAddInChatCircleForLabel
) => {
  return {
    type: CHAT_BOX_MARK_NOT_TO_ADD_IN_CHAT_CIRCLE_FOR_LABEL,
    payload: {
      chatBoxMarkNotToAddInChatCircleForLabel: chatBoxMarkNotToAddInChatCircleForLabel,
    },
  };
};
export const setChatBoxTypingMessageDetails = (
  chatBoxTypingMessageDetails
) => {
  return {
    type: CHAT_BOX_TYPING_MESSAGE_DETAILS,
    payload: {
      chatBoxTypingMessageDetails: chatBoxTypingMessageDetails,
    },
  };
};
export const setChatBoxRecentChatListDataTotalCount = (
  chatBoxRecentChatListDataTotalCount
) => {
  return {
    type: CHAT_BOX_RECENT_CHAT_LIST_DATA_TOTAL_COUNT,
    payload: {
      chatBoxRecentChatListDataTotalCount: chatBoxRecentChatListDataTotalCount,
    },
  };
};