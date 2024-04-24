import React, { useEffect, useState, useRef } from "react";

import {
  Container,
  IconButton,
  Tabs,
  Tab,
  TextField,
  FormControlLabel,
  Tooltip,
  Typography,
  Button,
  Checkbox,
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  setChatBoxRecentSearchInputText,
  setChatBoxRecentSearchText,
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxFacebookIDsWithProfileDetails,
  setChatBoxMarkNotToAddInChatCircleForLabel,
  setChatBoxRecentSearchChatIds,
  setChatBoxRecentChatListShowAllListToggle,
  setChatBoxRecentChatListShowAllListByManagerToggle,
} from "../../store/actions/ChatBoxActions";
import { setUserPanelChatOnline } from "../../store/actions/UserPanelActions";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ClearIcon from "@material-ui/icons/Clear";
import ChatList from "./ChatList";
import _ from "lodash";
import CloseIcon from "@material-ui/icons/Close";
import ChatTabPanel from "./ChatTabPanel";
import SplitterLayout from "../../otherComponents/react-splitter-layout/components/SplitterLayout";
import "../../otherComponents/react-splitter-layout/stylesheets/index.css";
import ChatContainer from "./ChatContainer";
import ChatSubscription from "./ChatSubscription";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useSnackbar } from "notistack";
import { Facebook } from "../../auth/Facebook";
import moment from "moment";
import includes from "./includes";
import FacebookAvatar from "./FacebookAvatar";
import FacebookTypography from "./FacebookTypography";
import UsersList from "./UsersList";
import ManagersListTabContainer from "./ManagersListTabContainer";
const useStyles = makeStyles((theme) => ({
  searchTodayChatsTextField: { width: "100%" },

  textFieldInputRoot: {
    width: "100%",
    background: "white",
  },
  textFieldInput: {
    height: 41,

    padding: "0px 4px",
    borderBottom: 0,
  },
  recentPagesLeftPane: {
    borderRight: "1px solid #dedede",
    flex: 0.26,
    margin: 0,
  },
  clearSearchButton: {
    padding: 0,
    marginRight: 9,
    order: 1,
  },
  bottomChatsTabs: {
    position: "fixed",
    bottom: 0,
    zIndex: 1000,
    height: 52,
    maxWidth: "100%",
  },
  bottomChatsTab: {
    background: "#1a2733",
    maxWidth: 300,

    marginRight: 6,
  },
  bottomChatsTabText: {
    display: "inline",
    color: "white",
    marginLeft: 5,
    width: 150,
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  bottomChatsTabContainer: {
    display: "flex",
    alignItems: "center",
  },
  bottomChatsCloseButton: {
    color: "white",
    marginLeft: 15,
  },
  bottomChatsTabPageImage: {
    marginRight: 2,
    background: "#737272",
  },
  bottomChatsTabPanel: {
    zIndex: 1000,
    background: "#1a2733",
    position: "fixed",
    bottom: 0,
    right: 0,
    width: 400,
  },
  bottomChatsTabScrollButtons: {
    background: "#66c047",
    color: "white",
  },
  chatMainContainer: {},
  chatTabHeader: {
    padding: 5,
    background: "#1a2733",
  },
  chatBoxRecentSearchList: {
    overflowY: "auto",
    overflowX: "hidden",
    marginTop: 4,
  },
  totalRecentChatsLoadText: {
    background: "#bdbdbd",
    color: "white",
    padding: "0 5px",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
  },
  chatBoxSerachTextBoxContainer: {
    display: "flex",
  },
  chatBoxRecentShowAllChatListToggleButton: {
    color: "white",
    background: "#f50057",
    borderRadius: 0,
    minWidth: 0,
    "&:hover": {
      background: "#e14079",
    },
  },
  chatBoxRecentShowAllChatListToggleButtonDisabled: {
    background: "#b7b3b3",
  },
  chatBoxRecentChatListShowAllListByManagerCheckbox: {
    borderBottom: "1px solid #949494",
    borderRadius: 0,
    paddingBottom: 0,
    paddingTop: 1,
  },
}));

const ChatBox = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  var splitterLayoutRef = React.useRef(null);
  var splitterLayoutRef2 = React.useRef(null);

  var selectedChatsOnFloatingTabpanelItem = _.find(
    props.chatBoxSelectedChatsOnFloating,
    (itm) => itm.selected == true
  );

  ///////////////
  const classes = useStyles();
  var searchTodayChatsTextFieldTimeOut = null;

  const SearchDataQuery = gql`
    query GetSearchData($searchText: String!, $userID: ID, $managerId: ID) {
      getsearchdata(
        searchText: $searchText
        userID: $userID
        managerId: $managerId
      ) {
        details {
          customerId
          pageId
        }
        searchText
        userID
        managerId
      }
    }
  `;
  let [
    getSearchData,
    {
      loading: searchDataQueryLoading,
      error: searchDataQueryError,
      data: searchDataQueryResult,
    },
  ] = useLazyQuery(SearchDataQuery, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (searchDataQueryError) {
      searchDataQueryError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [searchDataQueryError]);
  let userIdForRecentsChatQuery = new includes().getUserIdForRecentsChatQuery(
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

  useEffect(() => {
    if (searchDataQueryResult && searchDataQueryResult.getsearchdata) {
      if (
        props.chatBoxRecentSearchInputText ==
        searchDataQueryResult.getsearchdata.searchText
        && searchDataQueryResult.getsearchdata.userID == userIdForRecentsChatQuery
        && searchDataQueryResult.getsearchdata.managerId == managerIdForRecentsChatQuery
      ) {
        props.setChatBoxRecentSearchChatIds(
          searchDataQueryResult.getsearchdata.details
        );
      }
    }
  }, [searchDataQueryResult]);
  useEffect(() => {
    if (searchTodayChatsTextFieldTimeOut)
      searchTodayChatsTextFieldTimeOut.clear();

    searchTodayChatsTextFieldTimeOut = setTimeout(() => {
      props.setChatBoxRecentSearchText(props.chatBoxRecentSearchInputText);
      if (props.chatBoxRecentSearchInputText != "") {
        if (!new includes().isLabelSearch(props.chatBoxRecentSearchInputText)) {
          if (userIdForRecentsChatQuery != "") {
            getSearchData({
              variables: {
                searchText: props.chatBoxRecentSearchInputText.toLowerCase(),
                userID: userIdForRecentsChatQuery,
                managerId: managerIdForRecentsChatQuery,
              },
            });
          }
        }
      } else {
        props.setChatBoxRecentSearchChatIds([]);
      }
    }, 500);
  }, [props.chatBoxRecentSearchInputText]);

  useEffect(() => {
    Facebook.fbInt();
  }, []);

  const RemoveChatLabelMutation = gql`
    mutation RemoveChatLabel(
      $customerId: String!
      $pageId: String!
      $messagetext: String!
    ) {
      removechatlabel(
        customerId: $customerId
        pageId: $pageId
        messagetext: $messagetext
      ) {
        success
        error
        result
      }
    }
  `;

  let [
    removeChatLabel,
    {
      loading: removeChatLabelMutationLoading,
      error: removeChatLabelMutationError,
      data: removeChatLabelMutationResult,
    },
  ] = useMutation(RemoveChatLabelMutation);

  useEffect(() => {
    if (
      removeChatLabelMutationResult &&
      removeChatLabelMutationResult.removechatlabel
    ) {
    }
  }, [removeChatLabelMutationResult]);

  var includesObj = new includes();

  var otherHeightDeduction = 0;
  if (new includes().showChatBoxManagersList(props.authPanelType)) {
    otherHeightDeduction = 52;
  }

  var layoutHeightOfMiddleContent =
    props.chatBoxSelectedChatsOnFloating.length > 1
      ? `calc(100vh - ${props.authMainAppBarHeight}px - 52px - ${otherHeightDeduction}px)`
      : `calc(100vh - ${props.authMainAppBarHeight}px - ${otherHeightDeduction}px)`;

  var heightOfListSearch = 41;
  var layoutHeightOfLists =
    props.chatBoxSelectedChatsOnFloating.length > 1
      ? `calc(100vh - ${props.authMainAppBarHeight}px - 52px - ${heightOfListSearch}px - ${otherHeightDeduction}px)`
      : `calc(100vh - ${props.authMainAppBarHeight}px - ${heightOfListSearch}px - ${otherHeightDeduction}px)`;

  const bottomChatsTab = (
    <Tabs
      classes={{ scrollButtons: classes.bottomChatsTabScrollButtons }}
      value={_.findIndex(
        props.chatBoxSelectedChatsOnFloating,
        (itm) => itm.selected == true
      )}
      onChange={(event, newValue) => {
        var isCloseButtonClick = false;
        var el = event.target;
        while ((el = el.parentElement)) {
          if (el.id == "closeButton") {
            isCloseButtonClick = true;
            break;
          }
        }
        if (!isCloseButtonClick) {
          var findPreviousChatsOnFloatingSelectedItem = _.find(
            props.chatBoxSelectedChatsOnFloating,
            (itm) => itm.selected == true
          );

          if (findPreviousChatsOnFloatingSelectedItem) {
            findPreviousChatsOnFloatingSelectedItem.selected = false;
          }
          var findItem = _.find(
            props.chatBoxSelectedChatsOnFloating,
            (itm) => itm.customerId == newValue
          );
          if (findItem) findItem.selected = true;

          props.setChatBoxSelectedChatsOnFloating(
            _.cloneDeep(props.chatBoxSelectedChatsOnFloating)
          );
        }
      }}
      className={classes.bottomChatsTabs}
      variant="scrollable"
      aria-label="chat tabs"
    >
      {_.filter(
        props.chatBoxSelectedChatsOnFloating,
        (itm) => !itm.selected
      ).map((item) => {
        return (
          <Tab
            key={`simple-tab-${item.customerId}`}
            value={item.customerId}
            aria-controls={`simple-tabpanel-${item.customerId}`}
            className={classes.bottomChatsTab}
            label={
              <Tooltip
                title={`${item.customerName}  @${item.pageName}`}
                aria-label={`${item.customerName}  @${item.pageName}`}
              >
                <span className={classes.bottomChatsTabContainer}>
                  <FacebookAvatar
                    item={item}
                    type="page"
                    variant={"rounded"}
                    className={classes.bottomChatsTabPageImage}
                  ></FacebookAvatar>
                  <FacebookAvatar
                    item={item}
                    type="customer"
                    variant={"rounded"}
                    className={classes.bottomChatsTabCustomerImage}
                  ></FacebookAvatar>
                  <FacebookTypography
                    item={item}
                    className={classes.bottomChatsTabText}
                  ></FacebookTypography>
                  <IconButton
                    id={"closeButton"}
                    className={classes.bottomChatsCloseButton}
                    size="small"
                    onClick={() => {
                      _.remove(
                        props.chatBoxSelectedChatsOnFloating,
                        (itm) => itm.customerId == item.customerId
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
            }
          />
        );
      })}
    </Tabs>
  );
  const chatListContainer = (
    <Container disableGutters={true}>
      <Container
        disableGutters={true}
        className={classes.chatBoxSerachTextBoxContainer}
      >
        {props.chatBoxRecentChatListDataTotalCount != null && (
          <Typography className={classes.totalRecentChatsLoadText}>
            {`${props.chatBoxRecentChatListData.length}/${props.chatBoxRecentChatListDataTotalCount}`}
          </Typography>
        )}
        <TextField
          value={props.chatBoxRecentSearchInputText}
          onInput={(e) => {
            props.setChatBoxRecentSearchInputText(e.target.value);
          }}
          InputProps={{
            startAdornment:
              props.chatBoxRecentSearchText == "" ? null : (
                <IconButton
                  className={classes.clearSearchButton}
                  onClick={() => {
                    props.setChatBoxRecentSearchText("");
                    props.setChatBoxRecentSearchChatIds([]);
                    props.setChatBoxRecentSearchInputText("");
                  }}
                >
                  <ClearIcon color="disabled" fontSize="small" />
                </IconButton>
              ),
            classes: {
              input: classes.textFieldInput,
            },
          }}
          classes={{
            root: classes.textFieldInputRoot,
          }}
          InputAdornmentProps={{
            position: "end",
            style: { order: 2, marginLeft: 0 },
          }}
          placeholder="Search by customer or page name"
        ></TextField>
        {new includes().chatBoxRecentShowAllChatListToggleButtonToPanelType(
          props.authPanelType
        ) && (
          <>
            {props.chatBoxRecentChatListShowAllListByManagerButtonToggle && (
              <Tooltip title={"Show all chats by manager"}>
                <Checkbox
                  classes={{
                    root: classes.chatBoxRecentChatListShowAllListByManagerCheckbox,
                  }}
                  checked={
                    props.chatBoxRecentChatListShowAllListByManagerToggle
                  }
                  onChange={(event) => {
                    props.setChatBoxRecentChatListShowAllListToggle(false);
                    props.setChatBoxRecentChatListShowAllListByManagerToggle(
                      event.target.checked
                    );
                  }}
                  name="checkedA"
                />
              </Tooltip>
            )}
            <Button
              disabled={props.chatBoxRecentChatListShowAllListToggle}
              onClick={() => {
                if (props.chatBoxRecentChatListShowAllListToggle) {
                  props.setChatBoxRecentChatListShowAllListToggle(false);
                } else {
                  props.setChatBoxRecentChatListShowAllListToggle(true);
                }
              }}
              className={clsx(
                classes.chatBoxRecentShowAllChatListToggleButton,
                {
                  [classes.chatBoxRecentShowAllChatListToggleButtonDisabled]:
                    props.chatBoxRecentChatListShowAllListToggle,
                }
              )}
            >
              {"ALL"}
            </Button>
          </>
        )}
      </Container>
      <ChatList
        className={classes.chatBoxRecentSearchList}
        containerHeight={layoutHeightOfLists}
        searchText={props.chatBoxRecentSearchText}
        searchIds={props.chatBoxRecentSearchChatIds}
        onItemClick={(item) => {
          includesObj.bindItemToMainChat(
            item,
            props.chatBoxRecentChatListData,
            props.setChatBoxRecentChatListData,
            props.chatBoxSelectedChatsOnFloating,
            props.setChatBoxSelectedChatsOnFloating,
            props.setChatBoxMarkNotToAddInChatCircleForLabel
          );
        }}
        onLabelRemove={(text, pageId, customerId) => {
          removeChatLabel({
            variables: {
              customerId: customerId,
              pageId: pageId,
              messagetext: text,
            },
          });
        }}
      />

      {!new includes().showChatBoxUsersList(props.authPanelType) &&
        bottomChatsTab}
    </Container>
  );
  return (
    <>
      {new includes().showChatBoxManagersList(props.authPanelType) && (
        <ManagersListTabContainer />
      )}
      <SplitterLayout
        ref={splitterLayoutRef}
        percentage={true}
        secondaryInitialSize={67}
        layoutHeight={layoutHeightOfMiddleContent}
      >
        <Container
          disableGutters={true}
          className={classes.recentPagesLeftPane}
        >
          {props.authUserWsSubscriptionReady && <ChatSubscription />}
          {new includes().showChatBoxUsersList(props.authPanelType) ? (
            <SplitterLayout
              splitterSeperatorWidth={3}
              hideCollapseButton={true}
              ref={splitterLayoutRef2}
              percentage={true}
              secondaryInitialSize={50}
              layoutHeight={layoutHeightOfMiddleContent}
            >
              <Container disableGutters={true} className={classes.userListPane}>
                <UsersList
                  managerId={new includes().getUserIdForUserListQuery(
                    props.authUserId,
                    props.authPanelType,
                    props.managersListSelectedManager
                  )}
                  containerHeight={layoutHeightOfLists}
                />
              </Container>
              {chatListContainer}
            </SplitterLayout>
          ) : (
            chatListContainer
          )}
          {new includes().showChatBoxUsersList(props.authPanelType) &&
            bottomChatsTab}
        </Container>
        <Container
          maxWidth={false}
          disableGutters={true}
          className={classes.mainChatBox}
        >
          {selectedChatsOnFloatingTabpanelItem && (
            <ChatContainer
              chatBoxMessageBoxDynamicHeight={true}
              chatTabHeaderStyles={classes.chatTabHeader}
              chatMainContainerStyles={classes.chatMainContainer}
              itemData={selectedChatsOnFloatingTabpanelItem}
            ></ChatContainer>
          )}
        </Container>
      </SplitterLayout>
    </>
  );
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
  setChatBoxRecentSearchInputText,
  setChatBoxRecentSearchText,
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxFacebookIDsWithProfileDetails,
  setUserPanelChatOnline,
  setChatBoxMarkNotToAddInChatCircleForLabel,
  setChatBoxRecentSearchChatIds,
  setChatBoxRecentChatListShowAllListToggle,
  setChatBoxRecentChatListShowAllListByManagerToggle,
})(ChatBox);
