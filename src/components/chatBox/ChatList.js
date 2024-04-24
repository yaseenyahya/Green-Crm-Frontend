import React, { useEffect, useRef, useState } from "react";

import {
  Container,
  CircularProgress,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@material-ui/core";
import { List, AutoSizer, InfiniteLoader } from "react-virtualized";
import {
  setChatBoxRecentChatListData,
  setChatBoxRecentSearchText,
  setChatBoxRecentSearchChatIds,
  setChatBoxRecentSearchInputText,
  setChatBoxRecentChatListDataTotalCount,
} from "../../store/actions/ChatBoxActions";
import {
  setUsersListSelectedUser,
  setUsersListData,
} from "../../store/actions/UsersListActions";
import includes from "./includes";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useSnackbar } from "notistack";
import FacebookAvatar from "./FacebookAvatar";
import FacebookTypography from "./FacebookTypography";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ReactTimeAgo from "react-timeago";
import _ from "lodash";
import moment from "moment";
import { connect } from "react-redux";
import ChatListTypingMessageStatus from "./ChatListTypingMessageStatus";
import Tabs from "../../otherComponents/react-responsive-tabs";
import "../../otherComponents/react-responsive-tabs/styles.css";
import ContentLoader, { Facebook } from "react-content-loader";

const useStyles = makeStyles((theme) => ({
  pageIcon: {
    position: "absolute",
    left: 1,
    background: "#737272",
  },
  customerIcon: {
    marginLeft: 10,
  },
  listItemPrimaryText: {
    fontWeight: "bolder",
    flex: 1,
    wordBreak: "break-all",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "break-spaces",
    maxHeight: 24,
  },
  listItemButton: {
    overflow: "hidden!important",
    borderBottom: "1px solid #d0cfcf",
    paddingRight: 4,
  },
  loadingCircularProgress: {
    margin: "auto",
    display: "block",
    marginTop: 20,
  },
  selectedListItem: {
    background: "#eaeaea",
    borderLeft: "7px solid #c9c8c8",
  },
  listItemContainer: {
    display: "flex",
    flexDirection: "column",
  },
  timeStamp: {
    textAlign: "right",
    fontSize: 10,
    color: "#7e7e7e",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  listItemAvatarAndTextContainer: {
    display: "flex",
  },
  listItemSecondaryText: {
    whiteSpace: "nowrap",
  },
  listItemMarkUnread: {
    background: "red",
  },
  listItemInnerContainer: {
    paddingLeft: 16,
    paddingRight: 4,
    paddingTop: 8,
    paddingBottom: 8,
  },
  listItem: {
    padding: 0,
  },
  listItemPrimaryTextMarkUnread: {
    fontWeight: "bold",
  },
  listItemSecondaryTextMarkUnread: {
    fontWeight: "bold",
    color: "#64a4ca",
  },
  markNotToAddInChatCircleContainer: {
    width: "55%",
    height: 5,
  },
  markNotToAddInChatCircleSpan: {
    width: "calc(100% - 5px)",
    background: "#f50057",
    height: 5,
    display: "block",
  },
  listItemBottomContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listNoRows: {
    padding: 10,
  },
}));

const ChatList = (props) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [filterData, setfilterData] = useState(null);

  const [currentCursor, setCurrentCursor] = useState("");

  const [onResquestFetching, setOnResquestFetching] = useState(false);


  const onResquestFetching_ = useRef(null);
  onResquestFetching_.current = onResquestFetching; 

  const [hasNextPage, setHasNextPage] = useState(true);

  const hasNextPage_ = useRef(null);
  hasNextPage_.current = hasNextPage; 

  var lastFetchCursor = null; 

  const [lastRowIndex, setLastRowIndex] = useState(0);

  const chatBoxRecentChatListFetchNumber = 20;

  var userIdForRecentsChatQuery = new includes().getUserIdForRecentsChatQuery(
    props.authUserId,
    props.authPanelType,
    props.usersListSelectedUser,
    props.chatBoxRecentChatListShowAllListToggle
  );
  var managerIdForRecentsChatQuery =
    new includes().getManagerIdForRecentsChatQuery(
      props.authUserId,
      props.authPanelType,
      props.managersListSelectedManager,
      props.chatBoxRecentChatListShowAllListByManagerToggle,
      props.chatBoxRecentChatListShowAllListToggle
    );

  const ChatLastDetailsByIdWithPaginationQuery = gql`
    query ChatLastDetailsByIdWithPagination(
      $userID: ID
      $first: Int
      $after: String
      $managerId: ID
    ) {
      chatlastdetailsbyidwithpagination(
        userID: $userID
        first: $first
        after: $after
        managerId: $managerId
      ) {
        id
        chatDetails {
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
          labels
          marknottoaddinchatcircle
        }
        totalCount
        endCursor
        hasNextPage
        currentCursur
        managerId
        userID
      }
    }
  `;
  const [
    chatLastDetailsByIdWithPagination,
    {
      data: chatLastDetailsByIdWithPaginationQueryResult,
      loading:chatLastDetailsByIdWithPaginationQueryLoading,
      error: chatLastDetailsByIdWithPaginationQueryError,
    },
  ] = useLazyQuery(ChatLastDetailsByIdWithPaginationQuery, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (props.chatBoxSubscriptionStatus) {
      props.setChatBoxRecentChatListData([]);
      onResquestFetching_.current = false;
      setOnResquestFetching(false);
      setLastRowIndex(0);
      var endCursor = "";
      setCurrentCursor(endCursor);
      props.setChatBoxRecentChatListDataTotalCount(null);
      if (props.chatBoxRecentChatListShowAllListToggle) {
        props.setUsersListSelectedUser(null);
        var findPreviousSelectedItem = _.find(
          props.usersListData,
          (itm) => itm.selected == true
        );

        if (findPreviousSelectedItem) {
          findPreviousSelectedItem.selected = false;
          props.setUsersListData(_.cloneDeep(props.usersListData));
        }
      }
      if (userIdForRecentsChatQuery != "") {
        chatLastDetailsByIdWithPagination({
          variables: {
            userID: userIdForRecentsChatQuery,
            after: endCursor,
            first: chatBoxRecentChatListFetchNumber,
            managerId: managerIdForRecentsChatQuery,
          },
        });
      }
    }
  }, [
    props.chatBoxSubscriptionStatus,
    userIdForRecentsChatQuery,
    props.chatBoxRecentChatListShowAllListToggle,
  ]);
  const formatChatDetails = (chatDetails) => {
    var chatBoxRecentChatListData = [];
    chatDetails.map((item) => {
      var messageText =
        item.messagetype == "followuplabel"
          ? JSON.parse(item.messagetext)
          : item.messagetext;

      messageText =
        item.messagetype == "followuplabel"
          ? `${messageText[0]} at ${moment
              .unix(messageText[1] / 1000)
              .format("yyyy-MM-DD hh:mm A")}`
          : messageText;

      chatBoxRecentChatListData.push({
        agentId: item.agentId,
        pageId: item.pageId,
        customerId: item.customerId,
        pageName: "",
        customerName: "",
        lastMessage: messageText,
        lastMessageTimeStamp: item.messagetimestamp,
        selected: false,
        messageId: item.messageId,
        read: item.read,
        labels: JSON.parse(item.labels),
        loading: false,
        marknottoaddinchatcircle: item.marknottoaddinchatcircle,
      });
    });
    return chatBoxRecentChatListData;
  };
  
  var fetchMe = (chatBoxRecentChatListData,userIdForRecentsChatQuery,currentCursor,chatBoxRecentChatListFetchNumber,managerIdForRecentsChatQuery)=>{
  
    if(!chatLastDetailsByIdWithPaginationQueryLoading 
    && !onResquestFetching_.current && lastFetchCursor != currentCursor){
    if(lastRowIndex > chatBoxRecentChatListData.length &&  hasNextPage_.current){
      console.log("hello lastRowIndex",lastRowIndex)
      console.log("hello props.chatBoxRecentChatListData.length",props.chatBoxRecentChatListData.length)
      console.log("hello result",lastRowIndex > props.chatBoxRecentChatListData.length)
      console.log("hello onResquestFetching_",onResquestFetching_.current)
      console.log("hello currentCursor",currentCursor)
      onResquestFetching_.current = true;
      setOnResquestFetching(true);
    chatLastDetailsByIdWithPagination({
      variables: {
        userID: userIdForRecentsChatQuery,
        after: currentCursor,
        first: chatBoxRecentChatListFetchNumber,
        managerId: managerIdForRecentsChatQuery,
      },
    });
  }
  }
  }
  useEffect(() => {
    if (
      chatLastDetailsByIdWithPaginationQueryResult &&
      chatLastDetailsByIdWithPaginationQueryResult.chatlastdetailsbyidwithpagination
    ) {
      var currentCursurFromServer =
        chatLastDetailsByIdWithPaginationQueryResult
          .chatlastdetailsbyidwithpagination.currentCursur;

      if (
        currentCursurFromServer == currentCursor &&
        chatLastDetailsByIdWithPaginationQueryResult
          .chatlastdetailsbyidwithpagination.userID ==
          userIdForRecentsChatQuery &&
        chatLastDetailsByIdWithPaginationQueryResult
          .chatlastdetailsbyidwithpagination.managerId ==
          managerIdForRecentsChatQuery
      ) {
        var endCursor =
          chatLastDetailsByIdWithPaginationQueryResult
            .chatlastdetailsbyidwithpagination.endCursor;

        setCurrentCursor(endCursor);

        props.setChatBoxRecentChatListDataTotalCount(
          chatLastDetailsByIdWithPaginationQueryResult
            .chatlastdetailsbyidwithpagination.totalCount
        );

        if (
          chatLastDetailsByIdWithPaginationQueryResult
            .chatlastdetailsbyidwithpagination.chatDetails.length > 0
        ) {
          var chatBoxRecentChatListData = null;
          if (props.chatBoxRecentChatListData.length > 0) {
            chatBoxRecentChatListData = [
              ...props.chatBoxRecentChatListData,
              ...formatChatDetails(
                chatLastDetailsByIdWithPaginationQueryResult
                  .chatlastdetailsbyidwithpagination.chatDetails
              ),
            ];
          } else
            chatBoxRecentChatListData = formatChatDetails(
              chatLastDetailsByIdWithPaginationQueryResult
                .chatlastdetailsbyidwithpagination.chatDetails
            );

          props.setChatBoxRecentChatListData(
            _.cloneDeep(chatBoxRecentChatListData)
          );
          setHasNextPage(chatLastDetailsByIdWithPaginationQueryResult
            .chatlastdetailsbyidwithpagination.hasNextPage);
          hasNextPage_.current = chatLastDetailsByIdWithPaginationQueryResult
          .chatlastdetailsbyidwithpagination.hasNextPage;
          if (
            chatLastDetailsByIdWithPaginationQueryResult
              .chatlastdetailsbyidwithpagination.hasNextPage
          ) {
            hasNextPage_.current = chatLastDetailsByIdWithPaginationQueryResult
            .chatlastdetailsbyidwithpagination.hasNextPage;
            fetchMe( 
              chatBoxRecentChatListData,
                userIdForRecentsChatQuery,
                endCursor,
                 chatBoxRecentChatListFetchNumber,
               managerIdForRecentsChatQuery,
              )
          }
          onResquestFetching_.current = false;
          setOnResquestFetching(false);
        }
      }
    }
  }, [chatLastDetailsByIdWithPaginationQueryResult]);

  useEffect(() => {
    if (chatLastDetailsByIdWithPaginationQueryError) {
      chatLastDetailsByIdWithPaginationQueryError.graphQLErrors.map(
        ({ message }, i) => {
          enqueueSnackbar(message, { variant: "error" });
        }
      );
      if (userIdForRecentsChatQuery != "") {
        chatLastDetailsByIdWithPagination({
          variables: {
            userID: userIdForRecentsChatQuery,
            after: currentCursor,
            first: chatBoxRecentChatListFetchNumber,
            managerId: managerIdForRecentsChatQuery,
          },
        });
      }
    }
  }, [chatLastDetailsByIdWithPaginationQueryError]);

  useEffect(() => {
    if (props.searchText.length > 0) {
      if (!new includes().isLabelSearch(props.chatBoxRecentSearchInputText)) {
        setfilterData(
          _.filter(props.chatBoxRecentChatListData, (itm) => {
            var haveInCustomerName = itm.customerName
              .toLowerCase()
              .includes(props.searchText.toLowerCase());

            var haveInPageName = itm.pageName
              .toLowerCase()
              .includes(props.searchText.toLowerCase());

            var haveInSearchIds =
              _.find(
                props.searchIds,
                (id) =>
                  id.customerId == itm.customerId && id.pageId == itm.pageId
              ) != undefined;

            return haveInCustomerName || haveInPageName || haveInSearchIds;
          })
        );
      } else {
        setfilterData(
          _.filter(props.chatBoxRecentChatListData, (itm) => {
            var searchValue_ = props.searchText.toLowerCase();
            searchValue_ = searchValue_.slice(2);

            if (!itm.labels) {
              return false;
            } else {
            
              return (
                _.findIndex(itm.labels,(item) => {

                  return searchValue_.toLowerCase() == item.toLowerCase();
                }) != -1
              );
            }
          })
        );
      }
    } else {
      setfilterData(null);
    }
  }, [props.searchText, props.chatBoxRecentChatListData, props.searchIds]);

  var dataArray =
    filterData != null ? filterData : props.chatBoxRecentChatListData;

  function getLabels(labelsData) {
    if (!labelsData) {
      return [];
    }
    return labelsData.map((label, index) => ({
      title: label,
      getContent: () => "",
      /* Optional parameters */
      key: index,
    }));
  }

  const isRowLoaded = ({ index }) => {
    return !!dataArray[index];
  };
  
  const chatListRef = useRef(null);
  return (
    <div disableGutters={true} style={{ height: props.containerHeight }}>
      {!new includes().showRecentListIsLoadingAccordingToPanelType(
        props.chatBoxSubscriptionStatus,
        props.authPanelType,
        props.usersListSelectedUser,
        props.chatBoxRecentChatListDataTotalCount,
        props.chatBoxRecentChatListShowAllListToggle
      ) ? (
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={chatListRef}
              className={props.className}
              rowHeight={({ index }) => {
                var item = dataArray[index];
                if (item) {
                
                  var labelsCount = getLabels(item.labels).length;
                  return labelsCount > 0 ? 116 : 86;
                } else return 86;
              }}
              rowCount={
                filterData != null
                  ? filterData.length
                  : props.chatBoxRecentChatListDataTotalCount
              }
              height={height}
              width={width}
              noRowsRenderer={() => {
                return (
                  <div className={classes.listNoRows}>
                    {new includes().getEmptyRecentListMessage(
                      props.authPanelType,
                      props.usersListSelectedUser,
                      props.chatBoxRecentChatListShowAllListToggle
                    )}
                  </div>
                );
              }}
              rowRenderer={({ index, isScrolling, key, style }) => {
                if(lastRowIndex < index)
                setLastRowIndex(index);

                if (isRowLoaded({ index })) {
                  var item = dataArray[index];

                  return (
                    <ListItem
                      key={item.customerId}
                      style={style}
                      classes={{
                        root: clsx(classes.listItem, {
                          [classes.selectedListItem]: item && item.selected,
                        }),
                      }}
                      onClick={() => {
                        props.onItemClick(item);
                      }}
                      button
                      className={classes.listItemButton}
                    >
                      <Container
                        disableGutters={true}
                        className={clsx(
                          classes.listItemContainer,
                          classes.listItemInnerContainer
                        )}
                      >
                        <Container
                          disableGutters={true}
                          className={classes.listItemAvatarAndTextContainer}
                        >
                          <ListItemAvatar>
                            <FacebookAvatar
                              key={item.pageId}
                              className={classes.pageIcon}
                              item={item}
                              type="page"
                            ></FacebookAvatar>
                            <FacebookAvatar
                              key={item.customerId}
                              className={classes.customerIcon}
                              type="customer"
                              item={item}
                            ></FacebookAvatar>
                          </ListItemAvatar>
                          <ListItemText
                            classes={{
                              primary: classes.listItemPrimaryText,
                              secondary: clsx(classes.listItemSecondaryText, {
                                [classes.listItemSecondaryTextMarkUnread]:
                                  !item.read,
                              }),
                            }}
                            primary={
                              <FacebookTypography
                                className={clsx({
                                  [classes.listItemPrimaryTextMarkUnread]:
                                    !item.read,
                                })}
                                key={item.customerId}
                                pageNameChange={(name) => {
                                  var findItem = _.find(
                                    props.chatBoxRecentChatListData,
                                    (list) =>
                                      list.pageId == item.pageId &&
                                      list.customerId == item.customerId
                                  );
                                  if (findItem) {
                                    if (findItem.pageName != name) {
                                      findItem.pageName = name;

                                      props.setChatBoxRecentChatListData(
                                        _.cloneDeep(
                                          props.chatBoxRecentChatListData
                                        )
                                      );
                                    }
                                  }
                                }}
                                customerNameChange={(name) => {
                                  var findItem = _.find(
                                    props.chatBoxRecentChatListData,
                                    (list) =>
                                      list.pageId == item.pageId &&
                                      list.customerId == item.customerId
                                  );

                                  if (findItem) {
                                    if (findItem.customerName != name) {
                                      findItem.customerName = name;
                                      props.setChatBoxRecentChatListData(
                                        _.cloneDeep(
                                          props.chatBoxRecentChatListData
                                        )
                                      );
                                    }
                                  }
                                }}
                                item={item}
                              />
                            }
                            secondary={item.lastMessage}
                          />
                        </Container>
                        <div style={{ flexGrow: 1 }} className="basic__tabs">
                          <Tabs
                            allowRemove={true}
                            key={item.labels}
                            showMore={true}
                            showMoreLabel={"more"}
                            showInkBar={false}
                            transform={false}
                            unmountOnExit={true}
                            selectedTabKey={0}
                            onChildrenClick={(key, text) => {
                              props.setChatBoxRecentSearchText("");
                              props.setChatBoxRecentSearchChatIds([]);
                              props.setChatBoxRecentSearchInputText(
                                "l:" + text
                              );
                            }}
                            onRemove={(key, text) => {
                              props.onLabelRemove(
                                text,
                                item.pageId,
                                item.customerId
                              );
                            }}
                            items={getLabels(item.labels)}
                          />
                        </div>
                        <div className={classes.listItemBottomContainer}>
                          {!item.typingMessageDetails && (
                            <div
                              className={
                                classes.markNotToAddInChatCircleContainer
                              }
                            >
                              {item.marknottoaddinchatcircle ? (
                                <Tooltip title={"Closed"}>
                                  <span
                                    className={
                                      classes.markNotToAddInChatCircleSpan
                                    }
                                  ></span>
                                </Tooltip>
                              ) : null}
                            </div>
                          )}
                          {item.typingMessageDetails ? (
                            <ChatListTypingMessageStatus
                              pageId={item.pageId}
                              customerId={item.customerId}
                              typingMessageDetails={item.typingMessageDetails}
                            ></ChatListTypingMessageStatus>
                          ) : null}
                          <ReactTimeAgo
                            className={classes.timeStamp}
                            date={moment.unix(item.lastMessageTimeStamp / 1000)}
                            locale="en-US"
                          />
                        </div>
                      </Container>
                    </ListItem>
                  );
                } else {
                  if(!chatLastDetailsByIdWithPaginationQueryLoading 
                    && !onResquestFetching_.current
                    ){
                      fetchMe(props.chatBoxRecentChatListData,userIdForRecentsChatQuery,currentCursor,chatBoxRecentChatListFetchNumber,managerIdForRecentsChatQuery);
               
                   
                
                  }
                  return (
                    <div
                      style={style}
                      className={classes.listItemBottomContainer}
                    >
                      <ContentLoader
                        speed={4}
                        width={width}
                        height={86}
                        viewBox={`0 0 ${width} ${86}`}
                        backgroundColor="#bfbfbf"
                        foregroundColor="#dedede"
                      >
                        <circle cx="53" cy="20" r="20" />
                        <circle cx="29" cy="19" r="20" />
                        <rect
                          x="86"
                          y="6"
                          rx="3"
                          ry="3"
                          width={width}
                          height="8"
                        />
                        <rect
                          x="87"
                          y="25"
                          rx="3"
                          ry="3"
                          width="90"
                          height="8"
                        />
                        <rect
                          x="1"
                          y="57"
                          rx="3"
                          ry="3"
                          width={width}
                          height="2"
                        />
                      </ContentLoader>
                    </div>
                  );
                }
              }}
            ></List>
          )}
        </AutoSizer>
      ) : (
        <CircularProgress
          className={classes.loadingCircularProgress}
          size={24}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.ChatBoxReducer,
    ...state.AuthReducer,
    ...state.UsersListReducer,
    ...state.ManagersListReducer,
  };
};
export default connect(mapStateToProps, {
  setChatBoxRecentChatListData,
  setChatBoxRecentSearchText,
  setChatBoxRecentSearchChatIds,
  setChatBoxRecentSearchInputText,
  setChatBoxRecentChatListDataTotalCount,
  setUsersListSelectedUser,
  setUsersListData,
})(ChatList);
