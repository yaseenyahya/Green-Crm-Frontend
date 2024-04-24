import React, { useEffect, useRef, useState } from "react";

import {
  Container,
  CircularProgress,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  TextField,
  IconButton,
  Badge,
} from "@material-ui/core";
import { List, AutoSizer } from "react-virtualized";
import { useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ClearIcon from "@material-ui/icons/Clear";
import {
  setUsersListSearchInputText,
  setUsersListSearchText,
  setUsersListData,
  setUsersListSubscriptionData,
  setUsersListContextMenuPosAndObjectDetails,
  setUsersListSelectedUser,
} from "../../store/actions/UsersListActions";
import { setChatBoxRecentChatListShowAllListToggle } from "../../store/actions/ChatBoxActions";
import includes from "./includes";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import _ from "lodash";
import { connect } from "react-redux";
import "../../otherComponents/react-responsive-tabs/styles.css";
import { useSnackbar } from "notistack";
import ErrorIcon from "@material-ui/icons/Error";
import LensIcon from "@material-ui/icons/Lens";
import UsersListContextMenu from "./UsersListContextMenu";

const useStyles = makeStyles((theme) => ({
  textFieldInputRoot: {
    width: "100%",
    background: "white",
  },
  textFieldInput: {
    height: 41,

    padding: "0px 4px",
    borderBottom: 0,
  },
  listItemPrimaryText: {
    fontWeight: "bolder",
    flex: 1,
    wordBreak: "break-all",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "break-spaces",
    maxHeight: 24,
    marginTop: 4,
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
    borderLeft: "7px solid #9ac2ff",
  },
  listItemContainer: {
    display: "flex",
    flexDirection: "column",
    cursor: "context-menu",
  },

  listItemAvatarAndTextContainer: {
    display: "flex",
  },
  listItemSecondaryText: {
    whiteSpace: "nowrap",
    fontSize: 12,
    marginTop: 3,
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
  listItemBottomContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listNoRows: {
    padding: 10,
  },
  userList: {
    overflowY: "auto",
    overflowX: "hidden",
  },
  disconnectedIcon: {
    marginRight: 3,
    color: "#f50057",
  },
  primaryTextContainer: {
    display: "flex",
  },
  onlineStatusIcon: {
    marginRight: 3,
    color: "green",
  },
  offlineStatusIcon: {
    marginRight: 3,
    color: "red",
  },
  userAvatar: {
    marginTop: 7,
  },
  userAvatarChatsCountBadge: {
    background: "#267dff",
    marginTop: 14,
    color: "white",
  },
}));

const UsersList = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const [filterData, setfilterData] = useState(null);

  const GetSubscriptionDataQuery = gql`
  query GetSubscriptionData {
    getsubscriptiondata {
      id: ID!
    data: String
    }
  }
`;

  let [
    getSubscriptionData,
    {
      loading: getSubscriptionDataQueryLoading,
      error: getSubscriptionDataQueryError,
      data: getSubscriptionDataQueryResult,
    },
  ] = useLazyQuery(GetSubscriptionDataQuery, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (
      getSubscriptionDataQueryResult &&
      getSubscriptionDataQueryResult.getsubscriptiondata
    ) {
      props.setUsersListSubscriptionData(
        getSubscriptionDataQueryResult.getsubscriptiondata.data
      );
    }
  });
  const GetUsersByManagerQuery = gql`
    query UsersByManager($managerId: String) {
      users(managerId: $managerId) {
        id
        picture
        name
        username
      }
    }
  `;

  let [
    getUsersByManager,
    {
      loading: getUsersByManagerQueryLoading,
      error: getUsersByManagerQueryError,
      data: getUsersByManagerQueryResult,
    },
  ] = useLazyQuery(GetUsersByManagerQuery, {
    fetchPolicy: "network-only",
  });
  const userListItemHandleClick = (event, userId) => {
    event.preventDefault();

    props.setUsersListContextMenuPosAndObjectDetails({
      anchorEl: event.currentTarget,
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      userId: userId,
    });
  };
  useEffect(() => {
    if (props.managerId) {
      getSubscriptionData();
      getUsersByManager({
        variables: {
          managerId: props.managerId,
        },
      });
    }
  }, [props.managerId]);

  useEffect(() => {
    if (getUsersByManagerQueryError) {
      getUsersByManagerQueryError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [getUsersByManagerQueryError]);

  useEffect(() => {
    if (getUsersByManagerQueryResult && getUsersByManagerQueryResult.users) {
      var usersListData = [];
      getUsersByManagerQueryResult.users.map((user) => {
        const findCurrentSubUserData = _.find(
          props.usersListSubscriptionData,
          (dataSub) => dataSub.agentId == user.id
        );
        usersListData.push({
          id: user.id,
          name: user.name,
          picture: user.picture,
          isOnline: findCurrentSubUserData
            ? findCurrentSubUserData.isOnline
            : false,
          loggedIn: findCurrentSubUserData
            ? findCurrentSubUserData.loggedIn
            : false,
          isConnected: findCurrentSubUserData
            ? findCurrentSubUserData.isConnected
            : false,
          chatsAssignedCount: findCurrentSubUserData
            ? findCurrentSubUserData.chats.length
            : 0,
        });
      });
      usersListData = _.sortBy(usersListData, [
        (item) => item.isOnline && item.isConnected,
        (item) => item.loggedIn,
      ]);
      props.setUsersListData(_.reverse(usersListData));
    }
  }, [getUsersByManagerQueryResult, props.usersListSubscriptionData]);

  var searchUsersTextFieldTimeOut = null;
  useEffect(() => {
    if (searchUsersTextFieldTimeOut) searchUsersTextFieldTimeOut.clear();

    searchUsersTextFieldTimeOut = setTimeout(() => {
      props.setUsersListSearchText(props.usersListSearchInputText);
    }, 500);
  }, [props.usersListSearchInputText]);

  useEffect(() => {
    if (props.usersListSearchText.length > 0) {
      setfilterData(
        _.filter(props.usersListData, (itm) => {
          var searchValue_ = props.usersListSearchText.toLowerCase();
          if (!itm.name) {
            return [];
          } else {
            return itm.name.toLowerCase().indexOf(searchValue_) != -1;
          }
        })
      );
    } else {
      setfilterData(null);
    }
  }, [props.usersListSearchText, props.usersListData]);

  var dataArray = filterData != null ? filterData : props.usersListData;

  return (
    <>
      <TextField
        value={props.usersListSearchInputText}
        onInput={(e) => {
          props.setUsersListSearchInputText(e.target.value);
        }}
        InputProps={{
          endAdornment:
            props.usersListSearchText == "" ? null : (
              <IconButton
                className={classes.clearSearchButton}
                onClick={() => {
                  props.setUsersListSearchText("");
                  props.setUsersListSearchInputText("");
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
        placeholder="Search by name"
      ></TextField>
      <UsersListContextMenu />
      {getUsersByManagerQueryLoading ? (
        <CircularProgress
          className={classes.loadingCircularProgress}
          size={24}
        />
      ) : (
        <div disableGutters={true} style={{ height: props.containerHeight }}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                overscanRowsCount={5}
                rowHeight={({ index }) => {
                  return 60;
                }}
                className={classes.userList}
                rowRenderer={({ index, isScrolling, key, style }) => {
                  var item = dataArray[index];

                  return (
                    <ListItem
                      style={style}
                      classes={{
                        root: clsx(classes.listItem, {
                          [classes.selectedListItem]: item.selected,
                        }),
                      }}
                      onClick={() => {
                        props.setChatBoxRecentChatListShowAllListToggle(false);
                        new includes().bindItemToRecentChatByUser(
                          item,
                          props.usersListData,
                          props.setUsersListData,
                          props.setUsersListSelectedUser
                        );
                        props.onItemClick && props.onItemClick(item);
                      }}
                      button
                      className={classes.listItemButton}
                    >
                      <Container
                        onContextMenu={(event) => {
                          userListItemHandleClick(event, item.id);
                        }}
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
                            <Badge
                              badgeContent={item.chatsAssignedCount}
                              classes={{
                                badge: classes.userAvatarChatsCountBadge,
                              }}
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                            >
                              <Avatar
                                className={classes.userAvatar}
                                key={item.picture}
                                src={item.picture}
                              ></Avatar>
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            classes={{
                              primary: classes.listItemPrimaryText,
                              secondary: clsx(classes.listItemSecondaryText),
                            }}
                            primary={
                              <div className={classes.primaryTextContainer}>
                                {item.isOnline && !item.isConnected && (
                                  <Tooltip
                                    arrow={true}
                                    placement={"top"}
                                    title={"Not connected"}
                                  >
                                    <ErrorIcon
                                      className={classes.disconnectedIcon}
                                    />
                                  </Tooltip>
                                )}

                                <Tooltip
                                  arrow={true}
                                  placement={"top"}
                                  title={item.isOnline ? "Online" : "Offline"}
                                >
                                  <LensIcon
                                    className={clsx({
                                      [classes.onlineStatusIcon]: item.isOnline,
                                      [classes.offlineStatusIcon]:
                                        !item.isOnline,
                                    })}
                                  />
                                </Tooltip>

                                <span>{item.name}</span>
                              </div>
                            }
                            secondary={
                              item.loggedIn
                                ? "User is logged in"
                                : "User is logged out"
                            }
                          />
                        </Container>
                      </Container>
                    </ListItem>
                  );
                }}
                rowCount={dataArray.length}
                height={height}
                width={width}
                noRowsRenderer={() => {
                  return (
                    <div className={classes.listNoRows}>
                      {new includes().getEmptyUsersListMessage(
                        props.authPanelType,
                        props.managersListSelectedManager
                      )}
                    </div>
                  );
                }}
              ></List>
            )}
          </AutoSizer>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.UsersListReducer,
    ...state.AuthReducer,
    ...state.ManagersListReducer,
  };
};
export default connect(mapStateToProps, {
  setUsersListSearchInputText,
  setUsersListSearchText,
  setUsersListData,
  setUsersListSubscriptionData,
  setUsersListContextMenuPosAndObjectDetails,
  setUsersListSelectedUser,
  setChatBoxRecentChatListShowAllListToggle,
})(UsersList);
