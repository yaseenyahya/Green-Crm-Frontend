import _ from "lodash";
import PanelType from "../../auth/PanelType";
import expressConfig from "../../config/express.json";
export default class includes {
  showChatBoxUsersList(authPanelType) {
    if (
      authPanelType == PanelType.MANAGER ||
      authPanelType == PanelType.SUPERADMIN
    ) {
      return true;
    }
    return false;
  }
  fetch(query, variables) {
    const env = process.env.NODE_ENV || "development";
    const config = expressConfig[env];
    return fetch(
      `${config.graphql_domain}:${config.port}/${config.graphql_endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          variables: variables,
        }),
      }
    );
  }
  showChatBoxManagersList(authPanelType) {
    if (authPanelType == PanelType.SUPERADMIN) {
      return true;
    }
    return false;
  }
  isLabelSearch(searchText) {
    var value = searchText.toLowerCase();
    return value.startsWith("l:");
  }
  getEmptyRecentListMessage(
    authPanelType,
    usersListSelectedUser,
    chatBoxRecentChatListShowAllListToggle
  ) {
    if (
      (authPanelType == PanelType.MANAGER ||
        authPanelType == PanelType.SUPERADMIN) &&
      chatBoxRecentChatListShowAllListToggle
    )
      return "No chat found.";
    else if (
      (authPanelType == PanelType.MANAGER ||
        authPanelType == PanelType.SUPERADMIN) &&
      !usersListSelectedUser
    )
      return "No user selected.";
    else return "No chat found.";
  }
  getEmptyUsersListMessage(authPanelType, usersListSelectedUser) {
    if (authPanelType == PanelType.MANAGER && !usersListSelectedUser)
      return "No user selected.";
    else if (authPanelType == PanelType.SUPERADMIN && !usersListSelectedUser)
      return "No manager selected.";
    else return "No user found.";
  }
  chatBoxRecentShowAllChatListToggleButtonToPanelType(authPanelType) {
    return (
      authPanelType == PanelType.MANAGER ||
      authPanelType == PanelType.SUPERADMIN
    );
  }
  showRecentListIsLoadingAccordingToPanelType(
    chatBoxSubscriptionStatus,
    authPanelType,
    usersListSelectedUser,
    chatBoxRecentChatListDataTotalCount,
    chatBoxRecentChatListShowAllListToggle
  ) {
    if (!chatBoxSubscriptionStatus) {
      return true;
    } else if (
      (authPanelType == PanelType.MANAGER ||
        authPanelType == PanelType.SUPERADMIN) &&
      chatBoxRecentChatListShowAllListToggle &&
      chatBoxRecentChatListDataTotalCount == null
    ) {
      return true;
    } else if (
      (authPanelType == PanelType.MANAGER ||
        authPanelType == PanelType.SUPERADMIN) &&
      !usersListSelectedUser
    ) {
      return false;
    } else if (chatBoxRecentChatListDataTotalCount != null) {
      return false;
    } else return true;
  }
  checkToAddItemOnChatList(
    agentId,
    usersListData,
    authPanelType,
    usersListSelectedUser,
    chatBoxRecentChatListShowAllListToggle,
    chatBoxRecentChatListShowAllListByManagerToggle
  ) {
    if (
      (authPanelType == PanelType.MANAGER ||
        authPanelType == PanelType.SUPERADMIN) &&
      usersListSelectedUser &&
      usersListSelectedUser == agentId
    ) {
      return true;
    } else if (
      authPanelType == PanelType.SUPERADMIN &&
      !chatBoxRecentChatListShowAllListByManagerToggle &&
      chatBoxRecentChatListShowAllListToggle
    ) {
      return true;
    } else if (
      authPanelType == PanelType.SUPERADMIN &&
      chatBoxRecentChatListShowAllListByManagerToggle &&
      chatBoxRecentChatListShowAllListToggle &&
      _.find(usersListData, (item) => item.id == agentId)
    ) {
      return true;
    } else if (
      authPanelType == PanelType.MANAGER &&
      chatBoxRecentChatListShowAllListToggle &&
      _.find(usersListData, (item) => item.id == agentId)
    ) {
      return true;
    } else {
      return false;
    }
  }
  getUserIdForRecentsChatQuery(
    authUserId,
    authPanelType,
    usersListSelectedUser,
    chatBoxRecentChatListShowAllListToggle
  ) {
    if (
      (authPanelType == PanelType.MANAGER ||
        authPanelType == PanelType.SUPERADMIN) &&
      chatBoxRecentChatListShowAllListToggle
    ) {
      return undefined;
    } else if (
      (authPanelType == PanelType.MANAGER ||
        authPanelType == PanelType.SUPERADMIN) &&
      !usersListSelectedUser
    ) {
      return "";
    } else if (
      (authPanelType == PanelType.MANAGER ||
        authPanelType == PanelType.SUPERADMIN) &&
      usersListSelectedUser
    )
      return usersListSelectedUser;
    else {
      return authUserId;
    }
  }
  getManagerIdForRecentsChatQuery(
    authUserId,
    authPanelType,
    managersListSelectedManager,
    chatBoxRecentChatListShowAllListByManagerToggle,
    chatBoxRecentChatListShowAllListToggle
  ) {
    if (
      authPanelType == PanelType.MANAGER &&
      chatBoxRecentChatListShowAllListToggle
    ) {
      return authUserId;
    } else if (
      authPanelType == PanelType.SUPERADMIN &&
      chatBoxRecentChatListShowAllListToggle &&
      managersListSelectedManager &&
      chatBoxRecentChatListShowAllListByManagerToggle
    ) {
      return managersListSelectedManager;
    } else {
      return undefined;
    }
  }
  getUserIdForChatContainerQuery(itemData) {
    if (itemData) {
      return itemData.agentId;
    }
    return null;
  }

  getUserIdForUserListQuery(
    authUserId,
    authPanelType,
    managersListSelectedManager
  ) {
    if (authPanelType == PanelType.SUPERADMIN && !managersListSelectedManager) {
      return null;
    } else if (
      authPanelType == PanelType.SUPERADMIN &&
      managersListSelectedManager
    )
      return managersListSelectedManager;
    else {
      return authUserId;
    }
  }
  bindItemToRecentChatByUser(
    item,
    usersListData,
    setUsersListData,
    setUsersListSelectedUser
  ) {
    var findPreviousSelectedItem = _.find(
      usersListData,
      (itm) => itm.selected == true
    );

    if (findPreviousSelectedItem) {
      findPreviousSelectedItem.selected = false;
    }
    var findItem = _.find(usersListData, (itm) => itm.id == item.id);

    if (findItem) {
      findItem.selected = true;
      setUsersListData(_.cloneDeep(usersListData));
    }

    setUsersListSelectedUser(item.id);
  }
  bindItemToMainChat(
    item,
    chatBoxRecentChatListData,
    setChatBoxRecentChatListData,
    chatBoxSelectedChatsOnFloating,

    setChatBoxSelectedChatsOnFloating,
    setChatBoxMarkNotToAddInChatCircleForLabel
  ) {
    var findPreviousSelectedItem = _.find(
      chatBoxRecentChatListData,
      (itm) => itm.selected == true
    );

    if (findPreviousSelectedItem) {
      findPreviousSelectedItem.selected = false;
    }
    var findItem = _.find(
      chatBoxRecentChatListData,
      (itm) => itm.customerId == item.customerId
    );

    if (findItem) {
      findItem.selected = true;
      setChatBoxRecentChatListData(_.cloneDeep(chatBoxRecentChatListData));
    }

    var findPreviousChatsOnFloatingSelectedItem = _.find(
      chatBoxSelectedChatsOnFloating,
      (itm) => itm.selected == true
    );

    if (findPreviousChatsOnFloatingSelectedItem) {
      findPreviousChatsOnFloatingSelectedItem.selected = false;
    }
    // if (props.chatBoxSelectedChatOnMain) {
    var chatBoxSelectedChatsOnFloatingAlreadyAvailable = _.find(
      chatBoxSelectedChatsOnFloating,
      (itm) => itm.customerId == item.customerId
    );
    if (chatBoxSelectedChatsOnFloatingAlreadyAvailable == undefined)
      chatBoxSelectedChatsOnFloating.push(findItem);
    else chatBoxSelectedChatsOnFloatingAlreadyAvailable.selected = true;
    // } else {
    //   props.setChatBoxSelectedChatOnMain(findItem);
    // }
    setChatBoxSelectedChatsOnFloating(
      _.cloneDeep(chatBoxSelectedChatsOnFloating)
    );

    setChatBoxMarkNotToAddInChatCircleForLabel(
      Boolean(item.marknottoaddinchatcircle)
    );
  }
  timer = (ms) => new Promise((res) => setTimeout(res, ms));
  async resolvePageInfo(
    pageId,
    chatBoxFacebookIDsWithProfileDetails,
    setChatBoxFacebookIDsWithProfileDetails,
    callback,
    authPagesData
  ) {
    var isWait = false;
    while (window.FB == undefined) {
      isWait = true;
      await this.timer(1000);
    }
    if (isWait) await this.timer(2000);
    var result = null;
    var findItemAvail = _.find(
      chatBoxFacebookIDsWithProfileDetails,
      (item) => item.id == pageId
    );

    if (!findItemAvail) {
      var pageDataForAccessToken = _.find(
        authPagesData,
        (pages) => pages.pageId == pageId
      );

      if (pageDataForAccessToken) {
        window.FB &&
          window.FB.api(
            `/${pageId}?fields=name,picture&access_token=${pageDataForAccessToken.accesstoken}`,
            {
              redirect: "0",
            },
            function (responsePicture) {
              if (responsePicture && !responsePicture.error) {
                result = {
                  type: "page",
                  id: pageId,
                  image: responsePicture.picture.data.url,
                  name: responsePicture.name,
                };
                chatBoxFacebookIDsWithProfileDetails.push(result);
                setChatBoxFacebookIDsWithProfileDetails(
                  chatBoxFacebookIDsWithProfileDetails
                );
                callback(result);
              }
            }
          );
      }
    } else {
      callback(findItemAvail);
    }
  }
  async resolveClientInfo(
    customerId,
    pageId,
    chatBoxFacebookIDsWithProfileDetails,
    setChatBoxFacebookIDsWithProfileDetails,
    callback,
    authPagesData
  ) {
    console.log("trigger avatar resolving start");
    while (window.FB == undefined) {
      console.log("trigger avatar resolving on pending ", window.FB);
      await this.timer(1000);
    }
    console.log("trigger avatar resolved");
    var result = null;
    var findItemAvail = _.find(
      chatBoxFacebookIDsWithProfileDetails,
      (item) => item.id == customerId
    );

    if (!findItemAvail) {
      var pageDataForAccessToken = _.find(
        authPagesData,
        (pages) => pages.pageId == pageId
      );

      if (pageDataForAccessToken) {
        window.FB &&
          window.FB.api(
            `/${customerId}?fields=first_name,last_name,picture.height(50).width(50)&access_token=${pageDataForAccessToken.accesstoken}`,
            {
              redirect: "0",
            },
            (responsePicture) => {
              if (responsePicture && !responsePicture.error) {
                result = {
                  type: "customer",
                  id: customerId,
                  image: responsePicture.picture.data.url,
                  name:
                    responsePicture.first_name +
                    " " +
                    responsePicture.last_name,
                };
                chatBoxFacebookIDsWithProfileDetails.push(result);
                setChatBoxFacebookIDsWithProfileDetails(
                  chatBoxFacebookIDsWithProfileDetails
                );
                callback(result);
              }
            }
          );
      }
    } else {
      callback(findItemAvail);
    }
  }
  setSubscriptionReadyIfUserIdIsAvailable(
    authUserId,
    wsLink,
    setAuthUserWsSubscriptionReady
  ) {
    if (authUserId) {
      const env = process.env.NODE_ENV || "development";
      const config = expressConfig[env];
      wsLink.subscriptionClient.url = `${config.graphql_subscription_domain}:${config.port}/${config.graphql_subscription_endpoint}?userId=${authUserId}`;
      wsLink.subscriptionClient.connect();
      //wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () =>
      // wsLink.subscriptionClient.maxConnectTimeGenerator.max;
      setAuthUserWsSubscriptionReady(true);
    } else {
      wsLink.subscriptionClient.url = undefined;
      wsLink.subscriptionClient.close(true, true);
      setAuthUserWsSubscriptionReady(false);
    }
  }
}
