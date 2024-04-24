import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxMessageData,
  setChatBoxPendingChatCount,
  setChatBoxTypingMessageDetails,
  setChatBoxRecentChatListDataTotalCount,
} from "../../store/actions/ChatBoxActions";
import { setUsersListSubscriptionData } from "../../store/actions/UsersListActions";
import { setUserPanelChatOnline } from "../../store/actions/UserPanelActions";
import _ from "lodash";
import moment from "moment";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import PanelType from "../../auth/PanelType";
import includes from "./includes";
const ChatSubscription = (props) => {
  const MarkAllMessageChatRead = gql`
    mutation MarkAllMessageChatRead($customerId: String!, $pageId: String!) {
      markallmessagechatread(customerId: $customerId, pageId: $pageId) {
        success
        error
        result
      }
    }
  `;

  let [markAllMessageChatRead, {}] = useMutation(MarkAllMessageChatRead);

  const ReceiptReadStatusChangedSubscription = gql`
    subscription ReceiptReadStatusChanged {
      receiptreadstatuschanged {
        customerId
        pageId
        receiptreadtimestamp
      }
    }
  `;

  const { data: receiptReadStatusChangedSubscriptionResult } = useSubscription(
    ReceiptReadStatusChangedSubscription
  );

  useEffect(() => {
    if (
      receiptReadStatusChangedSubscriptionResult &&
      receiptReadStatusChangedSubscriptionResult.receiptreadstatuschanged
    ) {
      var prevChatData = _.find(
        props.chatBoxMessageData,
        (itm) =>
          itm.customerId ==
            receiptReadStatusChangedSubscriptionResult.receiptreadstatuschanged
              .customerId &&
          itm.pageId ==
            receiptReadStatusChangedSubscriptionResult.receiptreadstatuschanged
              .pageId
      );

      if (prevChatData) {
        var prevMarkReceiptReadChatItem = _.find(
          prevChatData.messages,
          (itm) => itm.receiptreadtimestamp
        );
        if (prevMarkReceiptReadChatItem)
          prevMarkReceiptReadChatItem.receiptreadtimestamp = undefined;

        var outgoingMessageLastItem = _.last(
          _.filter(prevChatData.messages, (itm) => itm.type == "outgoing")
        );
        if (outgoingMessageLastItem)
          outgoingMessageLastItem.receiptreadtimestamp =
            receiptReadStatusChangedSubscriptionResult.receiptreadstatuschanged.receiptreadtimestamp;

        props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));
      }
    }
  }, [receiptReadStatusChangedSubscriptionResult]);
  const DeliveryStatusChangedSubscription = gql`
    subscription DeliveryStatusChanged {
      deliverystatuschanged {
        customerId
        pageId
        deliverytimestamp
      }
    }
  `;

  const { data: deliveryStatusChangedSubscriptionResult } = useSubscription(
    DeliveryStatusChangedSubscription
  );

  useEffect(() => {
    if (
      deliveryStatusChangedSubscriptionResult &&
      deliveryStatusChangedSubscriptionResult.deliverystatuschanged
    ) {
      var prevChatData = _.find(
        props.chatBoxMessageData,
        (itm) =>
          itm.customerId ==
            deliveryStatusChangedSubscriptionResult.deliverystatuschanged
              .customerId &&
          itm.pageId ==
            deliveryStatusChangedSubscriptionResult.deliverystatuschanged.pageId
      );

      if (prevChatData) {
        var prevMarkDeliveredChatItem = _.find(
          prevChatData.messages,
          (itm) => itm.deliverytimestamp
        );

        if (prevMarkDeliveredChatItem)
          prevMarkDeliveredChatItem.deliverytimestamp = undefined;

        var outgoingMessageLastItem = _.last(
          _.filter(prevChatData.messages, (itm) => itm.type == "outgoing")
        );

        if (outgoingMessageLastItem)
          outgoingMessageLastItem.deliverytimestamp =
            deliveryStatusChangedSubscriptionResult.deliverystatuschanged.deliverytimestamp;

        props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));
      }
    }
  }, [deliveryStatusChangedSubscriptionResult]);
  const MarkAllMessageChatReadSubscription = gql`
    subscription MarkAllMessageChatRead {
      markallmessagechatread {
        agentId
        customerId
        pageId
      }
    }
  `;

  const { data: markAllMessageChatReadSubscriptionResult } = useSubscription(
    MarkAllMessageChatReadSubscription
  );

  useEffect(() => {
    if (
      markAllMessageChatReadSubscriptionResult &&
      markAllMessageChatReadSubscriptionResult.markallmessagechatread
    ) {
      var findChatBoxRecentChatListData = _.find(
        props.chatBoxRecentChatListData,
        (item) =>
          item.pageId ==
            markAllMessageChatReadSubscriptionResult.markallmessagechatread
              .pageId &&
          item.customerId ==
            markAllMessageChatReadSubscriptionResult.markallmessagechatread
              .customerId
      );

      if (findChatBoxRecentChatListData) {
        findChatBoxRecentChatListData.read = true;
        props.setChatBoxRecentChatListData(
          _.cloneDeep(props.chatBoxRecentChatListData)
        );
      }
    }
  }, [markAllMessageChatReadSubscriptionResult]);
  const ChatDetailAddedSubscription = gql`
    subscription ChatDetailAdded {
      chatdetailadded {
        id
        customerId
        pageId
        messageId
        messagetext
        messagetimestamp
        messagetype
        agentId
        alternateagentId
        read
        marknottoaddinchatcircle
      }
    }
  `;

  const {
    error: chatDetailAddedSubscriptionError,
    data: chatDetailAddedSubscriptionResult,
  } = useSubscription(ChatDetailAddedSubscription);

  useEffect(() => {
    if (chatDetailAddedSubscriptionError) {
      console.log(
        "chatDetailAddedSubscriptionError",
        chatDetailAddedSubscriptionError
      );
    }
  }, [chatDetailAddedSubscriptionError]);

  useEffect(() => {
    if (
      chatDetailAddedSubscriptionResult &&
      chatDetailAddedSubscriptionResult.chatdetailadded
    ) {
      if (
        chatDetailAddedSubscriptionResult.chatdetailadded.agentId ==
          props.authUserId ||
        new includes().checkToAddItemOnChatList(
          chatDetailAddedSubscriptionResult.chatdetailadded.agentId,
          props.usersListData,
          props.authPanelType,
          props.usersListSelectedUser,
          props.chatBoxRecentChatListShowAllListToggle,
          props.chatBoxRecentChatListShowAllListByManagerToggle
        )
      ) {
        var prevChatData = _.find(
          props.chatBoxMessageData,
          (itm) =>
            itm.customerId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.customerId &&
            itm.pageId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.pageId
        );

        var messageText =
          chatDetailAddedSubscriptionResult.chatdetailadded.messagetype ==
          "followuplabel"
            ? JSON.parse(
                chatDetailAddedSubscriptionResult.chatdetailadded.messagetext
              )
            : chatDetailAddedSubscriptionResult.chatdetailadded.messagetext;

        messageText =
          chatDetailAddedSubscriptionResult.chatdetailadded.messagetype ==
          "followuplabel"
            ? `${messageText[0]} at ${moment
                .unix(messageText[1] / 1000)
                .format("yyyy-MM-DD hh:mm A")}`
            : messageText;

        if (prevChatData) {
          var AddData = false;
          if (
            chatDetailAddedSubscriptionResult.chatdetailadded.messagetype ==
              "followuplabel" ||
            chatDetailAddedSubscriptionResult.chatdetailadded.messagetype ==
              "label"
          ) {
            AddData = true;
          } else {
            var findMessageIfExistByMessageId = _.find(
              prevChatData.messages,
              (item) =>
                item.messageId ==
                chatDetailAddedSubscriptionResult.chatdetailadded.messageId
            );
            AddData = !findMessageIfExistByMessageId;
          }

          if (AddData) {
            prevChatData.messages.push({
              loading: false,
              messageId:
                chatDetailAddedSubscriptionResult.chatdetailadded.messageId,
              text: messageText,
              timestamp:
                chatDetailAddedSubscriptionResult.chatdetailadded
                  .messagetimestamp,
              type: chatDetailAddedSubscriptionResult.chatdetailadded
                .messagetype,
              read: chatDetailAddedSubscriptionResult.chatdetailadded.read,
            });

            props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));
          }
          /// changing message to read if its open and message is incoming
          var selectedChatsOnFloatingTabpanelItem = _.find(
            props.chatBoxSelectedChatsOnFloating,
            (itm) => itm.selected == true
          );
          if (
            selectedChatsOnFloatingTabpanelItem &&
            selectedChatsOnFloatingTabpanelItem.customerId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.customerId &&
            selectedChatsOnFloatingTabpanelItem.pageId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.pageId
          ) {
            if (!chatDetailAddedSubscriptionResult.chatdetailadded.read) {
              markAllMessageChatRead({
                variables: {
                  customerId:
                    chatDetailAddedSubscriptionResult.chatdetailadded
                      .customerId,
                  pageId:
                    chatDetailAddedSubscriptionResult.chatdetailadded.pageId,
                },
              });
            }
          }
        }

        var prevRecentChatData = _.find(
          props.chatBoxRecentChatListData,
          (itm) =>
            itm.customerId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.customerId &&
            itm.pageId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.pageId
        );
        var labels = [];
        if (!prevRecentChatData) {
          props.setChatBoxRecentChatListDataTotalCount(
            props.chatBoxRecentChatListDataTotalCount + 1
          );
        }
        if (
          prevRecentChatData &&
          prevRecentChatData.labels &&
          prevRecentChatData.labels.length > 0
        )
          labels = prevRecentChatData.labels;

        if (
          chatDetailAddedSubscriptionResult.chatdetailadded.messagetype ==
          "label"
        )
          labels.push(
            chatDetailAddedSubscriptionResult.chatdetailadded.messagetext
          );

        _.remove(
          props.chatBoxRecentChatListData,
          (item) =>
            item.pageId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.pageId &&
            item.customerId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.customerId
        );

        if (chatDetailAddedSubscriptionResult.chatdetailadded.messagetype)
          props.chatBoxRecentChatListData.unshift({
            agentId: chatDetailAddedSubscriptionResult.chatdetailadded.agentId,
            pageId: chatDetailAddedSubscriptionResult.chatdetailadded.pageId,
            customerId:
              chatDetailAddedSubscriptionResult.chatdetailadded.customerId,
            pageName: "",
            customerName: "",
            lastMessage: messageText,
            lastMessageTimeStamp:
              chatDetailAddedSubscriptionResult.chatdetailadded
                .messagetimestamp,
            selected: false,
            messageId:
              chatDetailAddedSubscriptionResult.chatdetailadded.messageId,
            read: chatDetailAddedSubscriptionResult.chatdetailadded.read,
            loading: false,
            labels: labels,
            marknottoaddinchatcircle:
              chatDetailAddedSubscriptionResult.chatdetailadded
                .marknottoaddinchatcircle,
          });

        props.setChatBoxRecentChatListData(
          _.cloneDeep(props.chatBoxRecentChatListData)
        );
      }
    }
  }, [chatDetailAddedSubscriptionResult]);

  const PendingChatCountChangedSubscription = gql`
    subscription PendingChatCountChanged {
      pendingchatcountchanged {
        result
      }
    }
  `;

  const {
    data: pendingChatCountChangedSubscriptionResult,
    error: pendingChatCountChangedSubscriptionError,
  } = useSubscription(PendingChatCountChangedSubscription);

  useEffect(() => {
    if (
      pendingChatCountChangedSubscriptionResult &&
      pendingChatCountChangedSubscriptionResult.pendingchatcountchanged
    ) {
      var pendingChatCount = JSON.parse(
        pendingChatCountChangedSubscriptionResult.pendingchatcountchanged.result
      );
      if (
        props.authPanelType != PanelType.MANAGER &&
        props.authPanelType != PanelType.SUPERADMIN
      ) {
        _.remove(
          pendingChatCount,
          (item) => !props.authUserPagesAssigned.includes(item.pageId)
        );
      } else {
        var userPagesAllAdded = _.map(
          props.authPagesData,
          (item) => item.pageId
        );
        _.remove(
          pendingChatCount,
          (item) => !userPagesAllAdded.includes(item.pageId)
        );
      }

      props.setChatBoxPendingChatCount(pendingChatCount.length);
    }
  }, [pendingChatCountChangedSubscriptionResult]);

  useEffect(() => {
    if (pendingChatCountChangedSubscriptionError) {
      alert(pendingChatCountChangedSubscriptionError);
    }
  }, [pendingChatCountChangedSubscriptionError]);

  const ChatLabelRemoveSubscription = gql`
    subscription ChatLabelRemove {
      chatlabelremove {
        success
        error
        result
      }
    }
  `;

  const {
    data: chatLabelRemoveSubscriptionResult,
    error: chatLabelRemoveSubscriptionError,
  } = useSubscription(ChatLabelRemoveSubscription);

  useEffect(() => {
    if (
      chatLabelRemoveSubscriptionResult &&
      chatLabelRemoveSubscriptionResult.chatlabelremove
    ) {
      var chatLabelRemoveResult = JSON.parse(
        chatLabelRemoveSubscriptionResult.chatlabelremove.result
      );

      if (chatLabelRemoveResult) {
        var prevRecentChatData = _.find(
          props.chatBoxRecentChatListData,
          (itm) =>
            itm.customerId == chatLabelRemoveResult.removeData.customerId &&
            itm.pageId == chatLabelRemoveResult.removeData.pageId
        );
        if (prevRecentChatData) {
          _.remove(
            prevRecentChatData.labels,
            (item) => item == chatLabelRemoveResult.removeData.messagetext
          );

          prevRecentChatData.lastMessage =
            chatLabelRemoveResult.lastChatDetails.messagetext;
          prevRecentChatData.lastMessageTimeStamp = moment(
            chatLabelRemoveResult.lastChatDetails.messagetimestamp
          );
          prevRecentChatData.messageId =
            chatLabelRemoveResult.lastChatDetails.messageId;
          prevRecentChatData.read = chatLabelRemoveResult.lastChatDetails.read;
          prevRecentChatData.marknottoaddinchatcircle =
            chatLabelRemoveResult.lastChatDetails.marknottoaddinchatcircle;

          props.setChatBoxRecentChatListData(
            _.cloneDeep(props.chatBoxRecentChatListData)
          );

          var prevChatData = _.find(
            props.chatBoxMessageData,
            (itm) =>
              itm.customerId == chatLabelRemoveResult.removeData.customerId &&
              itm.pageId == chatLabelRemoveResult.removeData.pageId
          );

          if (prevChatData) {
            _.remove(
              prevChatData.messages,
              (item) =>
                item.text == chatLabelRemoveResult.removeData.messagetext &&
                item.type == chatLabelRemoveResult.removeData.messagetype
            );
            props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));
          }
        }
      }
    }
  }, [chatLabelRemoveSubscriptionResult]);

  useEffect(() => {
    if (chatLabelRemoveSubscriptionError) {
      alert(chatLabelRemoveSubscriptionError);
    }
  }, [chatLabelRemoveSubscriptionError]);

  const SubscriptionDataChangedSubscription = gql`
    subscription SubscriptionDataChanged {
      subscriptiondatachanged {
        success
        error
        result
      }
    }
  `;

  const {
    data: subscriptionDataChangedSubscriptionResult,
    error: subscriptionDataChangedSubscriptionError,
  } = useSubscription(SubscriptionDataChangedSubscription);

  useEffect(() => {
    if (
      subscriptionDataChangedSubscriptionResult &&
      subscriptionDataChangedSubscriptionResult.subscriptiondatachanged
    ) {
      const subData = JSON.parse(
        subscriptionDataChangedSubscriptionResult.subscriptiondatachanged.result
      );
      props.setUsersListSubscriptionData(subData);
      const findCurrentSubUserData = _.find(
        subData,
        (dataSub) => dataSub.agentId == props.authUserId
      );

      if (findCurrentSubUserData) {
        if (findCurrentSubUserData.isOnline != props.userPanelChatOnline)
          props.setUserPanelChatOnline(findCurrentSubUserData.isOnline);
      }
    }
  }, [subscriptionDataChangedSubscriptionResult]);

  useEffect(() => {
    if (subscriptionDataChangedSubscriptionError) {
      alert(subscriptionDataChangedSubscriptionError);
    }
  }, [subscriptionDataChangedSubscriptionError]);

  const MessageTypingStatusChangedSubscription = gql`
    subscription MessageTypingStatusChanged {
      messagetypingstatuschanged {
        customerId
        pageId
        agentId
        userId
        username
      }
    }
  `;

  const { data: messageTypingStatusChangedSubscriptionResult } =
    useSubscription(MessageTypingStatusChangedSubscription);

  useEffect(() => {
    if (
      messageTypingStatusChangedSubscriptionResult &&
      messageTypingStatusChangedSubscriptionResult.messagetypingstatuschanged
    ) {
      const agentIdOfTypingPerson =
        messageTypingStatusChangedSubscriptionResult.messagetypingstatuschanged
          .agentId;
      const userIdOfTypingPerson =
        messageTypingStatusChangedSubscriptionResult.messagetypingstatuschanged
          .userId;

      if (userIdOfTypingPerson != props.authUserId) {
        const usernameOfTypingPerson =
          messageTypingStatusChangedSubscriptionResult
            .messagetypingstatuschanged.username;
        const customerIdOfTypingPerson =
          messageTypingStatusChangedSubscriptionResult
            .messagetypingstatuschanged.customerId;
        const pageIdOfTypingPerson =
          messageTypingStatusChangedSubscriptionResult
            .messagetypingstatuschanged.pageId;

        var itemData = _.find(
          props.chatBoxSelectedChatsOnFloating,
          (itm) => itm.selected == true
        );
        if (
          itemData &&
          customerIdOfTypingPerson == itemData.customerId &&
          pageIdOfTypingPerson == itemData.pageId
        ) {
          props.setChatBoxTypingMessageDetails(usernameOfTypingPerson);
        }

        var prevChatData = _.find(
          props.chatBoxRecentChatListData,
          (itm) =>
            customerIdOfTypingPerson == itm.customerId &&
            pageIdOfTypingPerson == itm.pageId
        );

        if (prevChatData)
          prevChatData.typingMessageDetails = usernameOfTypingPerson;

        props.setChatBoxRecentChatListData(
          _.cloneDeep(props.chatBoxRecentChatListData)
        );
      }
    }
  }, [messageTypingStatusChangedSubscriptionResult]);

  return <div></div>;
};

const mapStateToProps = (state) => {
  return {
    ...state.UserPanelReducer,
    ...state.ChatBoxReducer,
    ...state.AuthReducer,
    ...state.UsersListReducer,
    ...state.ManagersListReducer,
  };
};
export default connect(mapStateToProps, {
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxMessageData,
  setChatBoxPendingChatCount,
  setUserPanelChatOnline,
  setUsersListSubscriptionData,
  setChatBoxTypingMessageDetails,
  setChatBoxRecentChatListDataTotalCount,
})(ChatSubscription);
