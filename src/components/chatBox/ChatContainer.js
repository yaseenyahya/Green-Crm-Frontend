import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Tooltip,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  CircularProgress,
  Popover,
  TextareaAutosize
} from "@material-ui/core";
import useResizeObserver from "use-resize-observer";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxLabelsPopoverAnchorEl,
  setChatBoxCustomerFormData,
  setChatBoxMessageData,
  setChatBoxWindowSize,
  setChatBoxMessageTextInput,
  setChatBoxMessageTextBoxHeight,
  setChatBoxContainerChatSearchToggle,
  setChatBoxSearchText,
  setChatBoxContainerChatSearchCount,
  setChatBoxContainerChatSearchUpButtonToggle,
  setChatBoxContainerChatSearchDownButtonToggle,
  setChatBoxTypingMessageDetails,
} from "../../store/actions/ChatBoxActions";
import {
  setFollowUpDialogToggle,
  setFollowUpDialogDateTime,
} from "../../store/actions/FollowUpDialogActions";
import _ from "lodash";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import LabelsList from "./LabelsList";
import clsx from "clsx";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ChatBoxCustomerFormModal from "./ChatBoxCustomerFormModal";
import moment from "moment";
import { useSnackbar } from "notistack";
import FollowUpDialog from "./FollowUpDialog";
import FacebookAvatar from "./FacebookAvatar";
import FacebookTypography from "./FacebookTypography";
import ErrorIcon from "@material-ui/icons/Error";
import CheckIcon from "@material-ui/icons/Check";
import highlightSearchIncludes from "./highlightSearchIncludes";
import ClearIcon from "@material-ui/icons/Clear";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import includes from "./includes";
import ChatContainerTypingMessageStatus from "./ChatContainerTypingMessageStatus";
import ChatContainerUserNameTypography from "./ChatContainerUserNameTypography";
const useStyles = makeStyles((theme) => ({
  chatTabHeaderContainer: {
    display: "flex",
  },
  chatsTabText: {
    display: "inline",
    color: "white",
    marginLeft: 5,
    width: 150,
    whiteSpace: "nowrap",
    overflow: "hidden",
    flexGrow: 1,
  },
  chatsTabContainer: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  chatsCloseButton: {
    color: "white",
    marginLeft: 15,
  },
  chatsTabPageImage: {
    marginRight: 2,
    background: "#737272",
  },
  messageBox: {
    background: "white",
    overflow: "auto",
  },

  messageInputRoot: {
    width: "100%",
    background: "white",
    borderTop: "1px solid gray",
  },
  messageInput: {
    height: 41,

    padding: "0px 4px",
    borderBottom: 0,
  },
  sendMessageButton: {
    padding: "0 9px",
    alignSelf: "flex-end",
    background: "#b5b3b3",
    height: 41,
    borderRadius: 0,
    "&:hover": {
      background: "#9c9c9c",
    },
  },
  messageTextAndSendContainer: {
    display: "flex",
    background: "white",
  },
  incomingMessage: {
    background: "#cccbcb",
    borderRadius: 20,
    display: "inline-block",
    padding: 15,
    margin: 5,
    whiteSpace: "pre-wrap",
  },
  outgoingMessage: {
    background: "#66c047",
    borderRadius: 20,
    display: "inline-block",
    color: "white",
    padding: 15,
    margin: 5,
    whiteSpace: "pre-wrap",
  },
  outgoingMessageContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  loadingCircularProgress: {
    margin: "auto",
    display: "block",
    marginTop: 20,
  },
  formAddButton: {
    color: "white",
    background: "#f50057",
    marginRight: 5,
    "&:hover": {
      background: "#e14079",
    },
  },
  labelAddButton: {
    borderRadius: 0,
    alignSelf: "flex-end",
    height: 41,
  },
  addLabelsPopoverPaper: {
    borderRadius: 0,
  },
  userLabel: {
    textAlign: "center",
    borderBottom: "1px solid gray",
    margin: "25px 55px",
    fontSize: 15,
    display: "block",
  },
  chatMessageProgress: {
    width: "19px!important",
    height: "19px!important",
    marginTop: "auto",
    marginBottom: "auto",
  },
  errorMessage: {
    color: "#f50057",
    marginTop: "auto",
    marginBottom: "auto",
  },
  messageTextBox: {
    padding: "0 6px",
    border: "1px solid gray",
    outline: "none",
    font: "inherit",
    maxHeight: 180,
    flex: 1,
    minHeight: 30,
    paddingTop: 8,
    overflow: "auto!important",
  },
  unreadMessage: {
    background: "red",
  },
  readMessage: {
    background: "red",
  },
  seenMessageIcon: {
    width: 16,
    height: 16,
  },
  deliveredMessageIconContainer: {
    border: "1px solid gray",
    alignSelf: "flex-end",
    borderRadius: "50%",
    display: "flex",
    marginBottom: 8,
  },
  deliveredMessageIcon: {
    fontSize: 14,
  },
  seenMessageIconContainer: {
    display: "flex",
    marginBottom: 8,
    alignSelf: "flex-end",
  },
  clearSearchButton: {
    padding: 0,
    padding: 10,
  },
  chatBoxSearchToolbar: {
    order: 1,
    width: 140,
  },
  chatBoxSearchDownButton: {
    padding: 0,
  },
  chatBoxSearchUpButton: {
    padding: 0,
  },
  chatBoxSearchTextFieldInput: {
    border: "1px solid gray",
    padding: 10,
  },
  chatBoxSearchTextFieldInputRoot: {
    borderRadius: 0,
    padding: 0,
  },
  chatBoxSearchText: {
    width: "100%",
  },
}));
const ChatContainer = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const AddChatToFacebookQuery = gql`
    mutation AddChatToFacebook(
      $customerId: String!
      $pageId: String!
      $message: String!
      $outgoingMessageId: String!
      $accesstoken: String
    ) {
      addchattofacebook(
        customerId: $customerId
        pageId: $pageId
        message: $message
        outgoingMessageId: $outgoingMessageId
        accesstoken: $accesstoken
      ) {
        success
        error
        result
      }
    }
  `;

  let [
    addChatToFacebook,
    {
      loading: addChatToFacebookQueryLoading,
      error: addChatToFacebookQueryError,
      data: addChatToFacebookQueryResult,
    },
  ] = useMutation(AddChatToFacebookQuery);
  useEffect(() => {
    if (addChatToFacebookQueryError) {
      addChatToFacebookQueryError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [addChatToFacebookQueryError]);

  var messages = _.find(
    props.chatBoxMessageData,
    (itm) =>
      itm.customerId == props.itemData.customerId &&
      itm.pageId == props.itemData.pageId
  );

  useEffect(() => {
    if (
      addChatToFacebookQueryResult &&
      addChatToFacebookQueryResult.addchattofacebook
    ) {
      if (addChatToFacebookQueryResult.addchattofacebook.success) {
        if (messages) {
          var result = JSON.parse(
            addChatToFacebookQueryResult.addchattofacebook.result
          );
          var findItem = _.find(
            messages.messages,
            (item) => item.outgoingMessageId == result.outgoingMessageId
          );

          if (findItem) {
            _.remove(
              messages.messages,
              (item) => item.messageId == result.message_id
            ); // removing if its already been added in subscription

            findItem.loading = false;
            findItem.messageId = result.message_id;

            props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));
          }
        }
      } else {
        if (messages) {
          enqueueSnackbar(
            addChatToFacebookQueryResult.addchattofacebook.error,
            {
              variant: "error",
            }
          );
          var result = JSON.parse(
            addChatToFacebookQueryResult.addchattofacebook.result
          );
          var findItem = _.find(
            messages.messages,
            (item) => item.outgoingMessageId == result.outgoingMessageId
          );

          if (findItem) {
            findItem.loading = false;
            findItem.error =
              addChatToFacebookQueryResult.addchattofacebook.error;
            props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));
          }
        }
      }
    }
  }, [addChatToFacebookQueryResult]);

  const AddChatDetailQuery = gql`
    mutation AddChatDetail(
      $customerId: String!
      $pageId: String!
      $messageId: String
      $messagetext: String!
      $messagetimestamp: String!
      $messagetype: String!
      $agentId: ID!
      $alternateagentId: ID
      $read: Int!
    ) {
      addchatdetail(
        customerId: $customerId
        pageId: $pageId
        messageId: $messageId
        messagetext: $messagetext
        messagetimestamp: $messagetimestamp
        messagetype: $messagetype
        agentId: $agentId
        alternateagentId: $alternateagentId
        read: $read
      ) {
        success
        error
      }
    }
  `;

  let [
    addChatDetail,
    {
      loading: addChatDetailQueryLoading,
      error: addChatDetailQueryError,
      data: addChatDetailQueryResult,
    },
  ] = useMutation(AddChatDetailQuery);
  useEffect(() => {
    if (addChatDetailQueryError) {
      //error
    }
  }, [addChatDetailQueryError]);

  useEffect(() => {
    if (addChatDetailQueryResult && addChatDetailQueryResult.addchatdetail) {
      if (addChatDetailQueryResult.addchatdetail.success) {
      } else {
        //error
      }
    }
  }, [addChatDetailQueryResult]);

  const ChatDetailsByAgentCutomerPageIdQuery = gql`
    query ChatDetailsByAgentCutomerPageId(
      $userID: ID!
      $customerId: String!
      $pageId: String!
      $markChatRead: Boolean!
    ) {
      chatdetailsbyagentcutomerpageid(
        userID: $userID
        customerId: $customerId
        pageId: $pageId
        markChatRead: $markChatRead
      ) {
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
        deliverytimestamp
        receiptreadtimestamp
      }
    }
  `;

  let [
    chatDetailsByAgentCutomerPageId,
    {
      loading: chatDetailsByAgentCutomerPageIdQueryLoading,
      error: chatDetailsByAgentCutomerPageIdQueryError,
      data: chatDetailsByAgentCutomerPageIdQueryResult,
    },
  ] = useLazyQuery(ChatDetailsByAgentCutomerPageIdQuery, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (chatDetailsByAgentCutomerPageIdQueryError) {
      setTimeout(() => {
        callChatDetailsByAgentCutomerPageId();
      }, 1000);
    }
  }, [chatDetailsByAgentCutomerPageIdQueryError]);

  useEffect(() => {
    if (
      chatDetailsByAgentCutomerPageIdQueryResult &&
      chatDetailsByAgentCutomerPageIdQueryResult.chatdetailsbyagentcutomerpageid
    ) {
      var chatData = {
        pageId: props.itemData.pageId,
        customerId: props.itemData.customerId,
        messages: [],
      };
      chatDetailsByAgentCutomerPageIdQueryResult.chatdetailsbyagentcutomerpageid.map(
        (messages) => {
          var messageText =
            messages.messagetype == "followuplabel"
              ? JSON.parse(messages.messagetext)
              : messages.messagetext;

          messageText =
            messages.messagetype == "followuplabel"
              ? `${messageText[0]} at ${moment
                  .unix(messageText[1] / 1000)
                  .format("yyyy-MM-DD hh:mm A")}`
              : messageText;

          chatData.messages.push({
            loading: false,
            text: messageText,
            timestamp: messages.messagetimestamp,
            type: messages.messagetype,
            messageId: messages.messageId,
            deliverytimestamp: messages.deliverytimestamp,
            receiptreadtimestamp: messages.receiptreadtimestamp,
          });
        }
      );
      var prevChatData = _.find(
        props.chatBoxMessageData,
        (itm) =>
          itm.customerId == props.itemData.customerId &&
          itm.pageId == props.itemData.pageId
      );
      if (!prevChatData) {
        props.chatBoxMessageData.push(chatData);
      } else {
        prevChatData.messages = chatData.messages;
      }

      props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));
    }
  }, [chatDetailsByAgentCutomerPageIdQueryResult]);

  useEffect(() => {
    if (props.itemData) {
      props.setChatBoxTypingMessageDetails(null);
      if (
        props.chatBoxRecentSearchText != "" &&
        props.chatBoxRecentSearchChatIds.length > 0
      ) {
        props.setChatBoxContainerChatSearchToggle(true);
        props.setChatBoxSearchText(props.chatBoxRecentSearchText);
      }
      callChatDetailsByAgentCutomerPageId();
    }
  }, [props.itemData]);

  useEffect(() => {
    if (props.chatBoxSubscriptionStatus)
      if (props.itemData) callChatDetailsByAgentCutomerPageId();
  }, [props.chatBoxSubscriptionStatus]);

  var userIdForChatContainerQuery = new includes().getUserIdForChatContainerQuery(props.itemData);

  const callChatDetailsByAgentCutomerPageId = () => {
    chatDetailsByAgentCutomerPageId({
      variables: {
        userID: userIdForChatContainerQuery,
        customerId: props.itemData.customerId,
        pageId: props.itemData.pageId,
        markChatRead: !props.itemData.read,
      },
    });
  };

  const messageContainerRef = useRef(null);
  useEffect(() => {
    if (messageContainerRef.current)
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
  }, [messages]);

  const popoverActions = React.useRef();
  const mainContainerRef = React.useRef();

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      props.setChatBoxWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeyDown, false);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, []); // Empty array ensures that effect is only run on mount
  const chatBoxContainerChatSearchToggleRef = useRef(null);
  chatBoxContainerChatSearchToggleRef.current =
    props.chatBoxContainerChatSearchToggle;

  const handleKeyDown = (event) => {
    if (event.keyCode == 70 && event.ctrlKey) {
      event.preventDefault();

      if (chatBoxContainerChatSearchToggleRef.current) {
        props.setChatBoxSearchText("");
        props.setChatBoxContainerChatSearchToggle(false);
      } else {
        props.setChatBoxContainerChatSearchToggle(true);
      }
    }
  };
  function guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }

  const addMessageInputText = () => {
    if (props.chatBoxMessageTextInput != "") {
      var pageDataForAccessToken = _.find(
        props.authPagesData,
        (pages) => pages.pageId == props.itemData.pageId
      );
      if (pageDataForAccessToken) {
        var uid = guidGenerator();
        messages.messages.push({
          loading: true,
          text: props.chatBoxMessageTextInput,
          timestamp: moment().unix() * 1000,
          type: "outgoing",
          messageId: null,
          outgoingMessageId: uid,
        });
        addChatToFacebook({
          variables: {
            customerId: props.itemData.customerId,
            pageId: props.itemData.pageId,
            message: props.chatBoxMessageTextInput,
            outgoingMessageId: uid,
            accesstoken: pageDataForAccessToken.accesstoken,
          },
        });

        props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));

        props.setChatBoxMessageTextInput("");
      } else {
        enqueueSnackbar(`${props.itemData.pageId} page id not found.`, {
          variant: "error",
        });
      }
    }
  };

  const chatBoxMessageTextInputRef = useRef(null);

  const setChatBoxMessageTextInput = () => {
    if (chatBoxMessageTextInputRef.current) {
      props.setChatBoxMessageTextBoxHeight(
        chatBoxMessageTextInputRef.current.clientHeight
      );
    }
  };
  useEffect(() => {
    setChatBoxMessageTextInput();
  }, [chatBoxMessageTextInputRef]);

  var outgoingMessageSeenLastItem =
    messages &&
    _.last(
      _.filter(
        messages.messages,
        (mess) => mess.type == "outgoing" && mess.receiptreadtimestamp
      )
    );

  var outgoingMessageDeliveredLastItem =
    messages &&
    _.last(
      _.filter(
        messages.messages,
        (mess) =>
          mess.type == "outgoing" &&
          mess.deliverytimestamp &&
          !mess.receiptreadtimestamp
      )
    );

  var searchCount = 0;

  var allLabelsUsed =
    messages && _.filter(messages.messages, (mess) => mess.type == "label");

  useEffect(() => {
    if (props.chatBoxSearchText != "") {
      if (messageContainerRef.current) {
        props.setChatBoxContainerChatSearchCount(0);
        new highlightSearchIncludes().showNextSearch(
          0,
          messageContainerRef.current,
          props.setChatBoxContainerChatSearchCount,
          props.setChatBoxContainerChatSearchUpButtonToggle,
          props.setChatBoxContainerChatSearchDownButtonToggle
        );
      } else {
        props.setChatBoxContainerChatSearchUpButtonToggle(false);
        props.setChatBoxContainerChatSearchDownButtonToggle(false);
      }
    } else {
      props.setChatBoxContainerChatSearchUpButtonToggle(false);
      props.setChatBoxContainerChatSearchDownButtonToggle(false);
    }
  }, [props.chatBoxSearchText, messageContainerRef, props.itemData, messages]);

  const MessageTypingStatusChanged = gql`
    mutation MessageTypingStatusChanged(
      $customerId: String!
      $pageId: String!
      $agentId: ID!
      $userId: ID!
      $username: String!
    ) {
      messagetypingstatuschanged(
        customerId: $customerId
        pageId: $pageId
        agentId: $agentId
        userId: $userId
        username: $username
      ) {
        agentId
        userId
        username
      }
    }
  `;

  let [messageTypingStatusChanged, {}] = useMutation(
    MessageTypingStatusChanged
  );

  var chatBoxMessageTextInputTimeOutForMessageTypingStatus = null;
  useEffect(() => {
    if (chatBoxMessageTextInputTimeOutForMessageTypingStatus)
      chatBoxMessageTextInputTimeOutForMessageTypingStatus.clear();

    if (props.chatBoxMessageTextInput != "") {
      chatBoxMessageTextInputTimeOutForMessageTypingStatus = setTimeout(
        () => {
          messageTypingStatusChanged({
            variables: {
              customerId: props.itemData.customerId,
              pageId: props.itemData.pageId,
              agentId:userIdForChatContainerQuery,
              userId: props.authUserId,
              username: props.authUserName,
            },
          });
        },

        500
      );
    }
  }, [props.chatBoxMessageTextInput]);

  return (
    <Container
      maxWidth={false}
      ref={mainContainerRef}
      disableGutters={true}
      className={props.chatMainContainerStyles}
    >
      {!messages || chatDetailsByAgentCutomerPageIdQueryLoading ? (
        <CircularProgress
          className={classes.loadingCircularProgress}
          size={24}
        />
      ) : (
        <>
          <Container
            maxWidth={false}
            disableGutters={true}
            className={clsx(
              classes.chatTabHeaderContainer,
              props.chatTabHeaderStyles
            )}
          >
            <FollowUpDialog
              addFollowLabel={() => {
                addChatDetail({
                  variables: {
                    customerId: props.itemData.customerId,
                    pageId: props.itemData.pageId,
                    messageId: null,
                    messagetext: JSON.stringify([
                      "Follow Up",
                      props.followUpDialogDateTime,
                    ]),
                    messagetimestamp: (moment().unix() * 1000).toString(),
                    messagetype: "followuplabel",
                    agentId: userIdForChatContainerQuery,
                    alternateagentId: props.authUserId,
                    read: 1,
                  },
                });
                props.setFollowUpDialogToggle(false);
              }}
            />
            {props.chatBoxRecentChatListShowAllListToggle &&
           <ChatContainerUserNameTypography agentId={userIdForChatContainerQuery}/>
            }
            <Button
              className={classes.formAddButton}
              onClick={() => {
                props.chatBoxCustomerFormData.push({
                  modalData: {
                    modalWidth: 350,
                    modalHeight:
                      props.chatBoxWindowSize.height -
                      props.authMainAppBarHeight -
                      50,
                    modalX: 0,
                    modalY: 0,
                  },
                  customerData: props.itemData,
                  formData: [],
                });
                props.setChatBoxCustomerFormData(
                  _.cloneDeep(props.chatBoxCustomerFormData)
                );
              }}
            >
              <NoteAddIcon className={classes.formAddButtonIcon} />
              <Typography className={classes.formAddButtonText}>
                Add Form
              </Typography>
            </Button>
            <Tooltip
              title={`${props.itemData.customerName}  @${props.itemData.pageName}`}
              aria-label={`${props.itemData.customerName}  @${props.itemData.pageName}`}
            >
              <span className={classes.chatsTabContainer}>
                <FacebookAvatar
                  key={props.itemData.pageId}
                  type={"page"}
                  item={props.itemData}
                  variant={"rounded"}
                  className={classes.chatsTabPageImage}
                ></FacebookAvatar>
                <FacebookAvatar
                  key={props.itemData.customerId}
                  type={"customer"}
                  item={props.itemData}
                  variant={"rounded"}
                  className={classes.chatsTabCustomerImage}
                ></FacebookAvatar>
                <FacebookTypography
                  pageNameChange={(name) => {
                    var findItem = _.find(
                      props.chatBoxSelectedChatsOnFloating,
                      (list) =>
                        list.pageId == props.itemData.pageId &&
                        list.customerId == props.itemData.customerId
                    );
                    if (findItem) {
                      if (findItem.pageName != name) {
                        findItem.pageName = name;
                        props.setChatBoxSelectedChatsOnFloating(
                          _.cloneDeep(props.chatBoxSelectedChatsOnFloating)
                        );
                      }
                    }
                  }}
                  customerNameChange={(name) => {
                    var findItem = _.find(
                      props.chatBoxSelectedChatsOnFloating,
                      (list) =>
                        list.pageId == props.itemData.pageId &&
                        list.customerId == props.itemData.customerId
                    );

                    if (findItem) {
                      if (findItem.customerName != name) {
                        findItem.customerName = name;
                        props.setChatBoxSelectedChatsOnFloating(
                          _.cloneDeep(props.chatBoxSelectedChatsOnFloating)
                        );
                      }
                    }
                  }}
                  item={props.itemData}
                  className={classes.chatsTabText}
                ></FacebookTypography>
                <IconButton
                  className={classes.chatsCloseButton}
                  size="small"
                  onClick={() => {
                    _.remove(
                      props.chatBoxSelectedChatsOnFloating,
                      (itm) => itm.customerId == props.itemData.customerId
                    );
                    props.setChatBoxSelectedChatsOnFloating(
                      _.cloneDeep(props.chatBoxSelectedChatsOnFloating)
                    );
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Container>
          <Container maxWidth={false} disableGutters={true}>
            {props.chatBoxContainerChatSearchToggle && (
              <Container disableGutters={true}>
                <TextField
                  autoFocus={true}
                  value={props.chatBoxSearchText}
                  onInput={(e) => {
                    props.setChatBoxSearchText(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <Container
                        disableGutters={true}
                        className={classes.chatBoxSearchToolbar}
                      >
                        <IconButton
                          disabled={
                            !props.chatBoxContainerChatSearchUpButtonToggle
                          }
                          className={classes.chatBoxSearchUpButton}
                          onClick={() => {
                            new highlightSearchIncludes().showPrevSearch(
                              props.chatBoxContainerChatSearchCount,
                              messageContainerRef.current,
                              props.setChatBoxContainerChatSearchCount,
                              props.setChatBoxContainerChatSearchUpButtonToggle,
                              props.setChatBoxContainerChatSearchDownButtonToggle
                            );
                          }}
                        >
                          <ArrowDropUpIcon fontSize="large" />
                        </IconButton>
                        <IconButton
                          className={classes.chatBoxSearchDownButton}
                          disabled={
                            !props.chatBoxContainerChatSearchDownButtonToggle
                          }
                          onClick={() => {
                            new highlightSearchIncludes().showNextSearch(
                              props.chatBoxContainerChatSearchCount,
                              messageContainerRef.current,
                              props.setChatBoxContainerChatSearchCount,
                              props.setChatBoxContainerChatSearchUpButtonToggle,
                              props.setChatBoxContainerChatSearchDownButtonToggle
                            );
                          }}
                        >
                          <ArrowDropDownIcon fontSize="large" />
                        </IconButton>
                        <IconButton
                          className={classes.clearSearchButton}
                          onClick={() => {
                            props.setChatBoxSearchText("");
                            props.setChatBoxContainerChatSearchToggle(false);
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Container>
                    ),
                    classes: {
                      input: classes.chatBoxSearchTextFieldInput,
                      root: classes.chatBoxSearchTextFieldInputRoot,
                    },
                  }}
                  className={classes.chatBoxSearchText}
                  InputAdornmentProps={{
                    position: "end",
                    style: { order: 2, marginLeft: 0 },
                  }}
                  placeholder="Search"
                  variant={"outlined"}
                ></TextField>
              </Container>
            )}
            <Container
              ref={messageContainerRef}
              maxWidth={false}
              disableGutters={true}
              style={{
                height:
                  props.chatBoxSelectedChatsOnFloating.length > 1
                    ? `calc(100vh - ${
                        props.authMainAppBarHeight
                      }px - 102.5px - ${
                        props.chatBoxMessageTextBoxHeight
                      }px - ${
                        props.chatBoxContainerChatSearchToggle ? "46" : "0"
                      }px - ${
                        new includes().showChatBoxManagersList(props.authPanelType) ? "52" : "0"
                      }px)`
                    : `calc(100vh - ${props.authMainAppBarHeight}px - 50px - ${
                        props.chatBoxMessageTextBoxHeight
                      }px - ${
                        props.chatBoxContainerChatSearchToggle ? "46" : "0"
                      }px - ${
                        new includes().showChatBoxManagersList(props.authPanelType) ? "52" : "0"
                      }px)`,
              }}
              className={classes.messageBox}
            >
              {chatDetailsByAgentCutomerPageIdQueryLoading ? (
                <CircularProgress
                  className={classes.loadingCircularProgress}
                  size={24}
                />
              ) : (
                messages.messages.map((item, index, { length }) => {
                  var textCreated =
                    new highlightSearchIncludes().getSearchContentText(
                      props.chatBoxSearchText,
                      item.text
                    );
                  if (textCreated.containsSearch) searchCount++;
                  return item.type == "outgoing" ? (
                    <div className={classes.outgoingMessageContainer}>
                      {item.loading && (
                        <CircularProgress
                          className={classes.chatMessageProgress}
                        ></CircularProgress>
                      )}
                      {item.error && (
                        <Tooltip
                          arrow={true}
                          placement={"left"}
                          title={item.error}
                          className={classes.errorMessageContainer}
                        >
                          <ErrorIcon className={classes.errorMessage} />
                        </Tooltip>
                      )}
                      <Tooltip
                        arrow={true}
                        placement={"left"}
                        title={moment
                          .unix(item.timestamp / 1000)
                          .format("DD MMM YYYY hh:mm a") }
                        className={classes.outgoingMessage}
                      >
                        <span
                          data-search={
                            textCreated.containsSearch
                              ? "Search" + searchCount
                              : undefined
                          }
                          dangerouslySetInnerHTML={{
                            __html: textCreated.text,
                          }}
                        ></span>
                      </Tooltip>
                      {!item.loading &&
                        outgoingMessageSeenLastItem &&
                        outgoingMessageSeenLastItem.messageId ==
                          item.messageId && (
                          <Tooltip
                            arrow={true}
                            placement={"left"}
                            title={
                              "Seen at " +
                              moment
                                .unix(item.receiptreadtimestamp / 1000)
                                .format("DD MMM YYYY hh:mm a")
                            }
                          >
                            <span className={classes.seenMessageIconContainer}>
                              <FacebookAvatar
                                key={props.itemData.customerId}
                                className={classes.seenMessageIcon}
                                type="customer"
                                item={props.itemData}
                              ></FacebookAvatar>
                            </span>
                          </Tooltip>
                        )}
                      {!item.loading &&
                        !(
                          outgoingMessageSeenLastItem &&
                          outgoingMessageSeenLastItem.messageId ==
                            item.messageId
                        ) &&
                        outgoingMessageDeliveredLastItem &&
                        outgoingMessageDeliveredLastItem.messageId ==
                          item.messageId && (
                          <Tooltip
                            arrow={true}
                            placement={"left"}
                            title={
                              "Delivered at " +
                              moment
                                .unix(item.deliverytimestamp / 1000)
                                .format("DD MMM YYYY hh:mm a")
                            }
                          >
                            <span
                              className={classes.deliveredMessageIconContainer}
                            >
                              <CheckIcon
                                className={classes.deliveredMessageIcon}
                              />
                            </span>
                          </Tooltip>
                        )}
                    </div>
                  ) : item.type == "incoming" ? (
                    <div>
                      <Tooltip
                        arrow={true}
                        placement={"right"}
                        title={moment
                          .unix(item.timestamp / 1000)
                          .format("DD MMM YYYY hh:mm a") }
                        className={classes.incomingMessage}
                      >
                        <span
                          data-search={
                            textCreated.containsSearch
                              ? "Search" + searchCount
                              : undefined
                          }
                          dangerouslySetInnerHTML={{
                            __html: textCreated.text,
                          }}
                        ></span>
                      </Tooltip>
                    </div>
                  ) : (
                    <div>
                      <Tooltip
                        arrow={true}
                        placement={"top"}
                        title={moment
                          .unix(item.timestamp / 1000)
                          .format("DD MMM YYYY hh:mm a") }
                        className={classes.userLabel}
                      >
                        <span
                          data-search={
                            textCreated.containsSearch
                              ? "Search" + searchCount
                              : undefined
                          }
                          dangerouslySetInnerHTML={{
                            __html: textCreated.text,
                          }}
                        ></span>
                      </Tooltip>
                    </div>
                  );
                })
              )}
            </Container>
            <Box className={classes.messageTextAndSendContainer}>
              <Button
                disabled={!props.chatBoxSubscriptionStatus}
                aria-describedby={
                  Boolean(props.chatBoxLabelsPopoverAnchorEl)
                    ? "addLabelButton"
                    : undefined
                }
                variant="contained"
                color="primary"
                onClick={(event) => {
                  props.setChatBoxLabelsPopoverAnchorEl(event.currentTarget);
                }}
                className={classes.labelAddButton}
              >
                Labels
              </Button>
              <Popover
                action={popoverActions}
                container={mainContainerRef.current}
                PaperProps={{ square: true }}
                id={"addLabelButton"}
                open={Boolean(props.chatBoxLabelsPopoverAnchorEl)}
                anchorEl={props.chatBoxLabelsPopoverAnchorEl}
                onClose={() => {
                  props.setChatBoxLabelsPopoverAnchorEl(null);
                }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <LabelsList
                  marknottoaddinchatcircle={
                    props.chatBoxMarkNotToAddInChatCircleForLabel
                  }
                  usedLabels={allLabelsUsed}
                  onItemClick={(item) => {
                    if (item.id == 0) {
                      props.setFollowUpDialogToggle(true);
                    } else {
                      addChatDetail({
                        variables: {
                          customerId: props.itemData.customerId,
                          pageId: props.itemData.pageId,
                          messageId: null,
                          messagetext: item.text,
                          messagetimestamp: (moment().unix() * 1000).toString(),
                          messagetype: item.id == 1 ? "closelabel" : "label",
                          agentId: userIdForChatContainerQuery,
                          alternateagentId: props.authUserId,
                          read: 1,
                        },
                      });
                    }
                  }}
                  update={() => {
                    if (popoverActions.current) {
                      popoverActions.current.updatePosition();
                    }
                  }}
                />
              </Popover>
              <TextareaAutosize
                onKeyUp={() => {
                  setChatBoxMessageTextInput();
                }}
                ref={chatBoxMessageTextInputRef}
                disabled={!props.chatBoxSubscriptionStatus}
                onKeyPress={(e) => {
                  if (e.keyCode == 13 && !e.shiftKey) {
                    e.preventDefault();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.keyCode == 13 && !e.shiftKey) {
                    addMessageInputText();
                    e.preventDefault();
                  }
                }}
                value={props.chatBoxMessageTextInput}
                onInput={(e) =>
                  props.setChatBoxMessageTextInput(e.target.value)
                }
                InputProps={{
                  classes: {
                    input: classes.messageInput,
                  },
                }}
                classes={{
                  root: classes.messageInputRoot,
                }}
                placeholder={"Type message"}
                autoFocus
                className={classes.messageTextBox}
              />

              <IconButton
                disabled={!props.chatBoxSubscriptionStatus}
                onClick={() => {
                  addMessageInputText();
                }}
                className={classes.sendMessageButton}
              >
                <SendIcon />
              </IconButton>
              <ChatContainerTypingMessageStatus />
            </Box>
          </Container>
        </>
      )}
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    ...state.ChatBoxReducer,
    ...state.UserPanelReducer,
    ...state.AuthReducer,
    ...state.FollowUpDialogReducer,
    ...state.UsersListReducer,
  };
};
export default connect(mapStateToProps, {
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxLabelsPopoverAnchorEl,
  setChatBoxCustomerFormData,
  setChatBoxMessageData,
  setFollowUpDialogToggle,
  setFollowUpDialogDateTime,
  setChatBoxWindowSize,
  setChatBoxMessageTextInput,
  setChatBoxMessageTextBoxHeight,
  setChatBoxContainerChatSearchToggle,
  setChatBoxSearchText,
  setChatBoxContainerChatSearchCount,
  setChatBoxContainerChatSearchUpButtonToggle,
  setChatBoxContainerChatSearchDownButtonToggle,
  setChatBoxTypingMessageDetails,
})(ChatContainer);
