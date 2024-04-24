import React, { Component, useEffect, useRef } from "react";

import {
  IconButton,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Paper,
  Popover,
  Grow,
  Menu,
  Divider,
} from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { setUsersListContextMenuPosAndObjectDetails } from "../../store/actions/UsersListActions";
import {
  setAddEditUserModalSelectedRowData,
  setAddEditUserModalToggle,
} from "../../store/actions/AddEditUserModalActions";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useSnackbar } from "notistack";
import AddEditUserModal from "../adminPanel/addUsers/AddEditUserModal";
const useStyles = makeStyles((theme) => ({
  usersListMenuPaper: {
    background: "rgb(26 39 51 / 73%)",
    borderRadius: 0,
    zIndex: 1000,
    top: "-10px!important",
  },
  usersListMenuItem: {
    color: "white",
    cursor: "pointer",
    pointerEvents: "auto",
  },
  popover: {
    pointerEvents: "none",
  },
  usersListMenuItemDivider: {
    background: "white",
  },
}));

const UsersListContextMenu = (props) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  let SwitchLoginMutation = gql`
    mutation SwitchLogin($id: String!) {
      switchlogin(id: $id) {
        name
        designation {
          name
          paneltype
        }
      }
    }
  `;

  const [
    switchLogin,
    {
      loading: switchLoginMutationLoading,
      error: switchLoginMutationError,
      data: switchLoginMutationResult,
    },
  ] = useMutation(SwitchLoginMutation);

  useEffect(() => {
    if (switchLoginMutationError) {
      switchLoginMutationError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [switchLoginMutationError]);

  useEffect(() => {
    if (switchLoginMutationResult && switchLoginMutationResult.switchlogin) {
      if (
        switchLoginMutationResult.switchlogin.designation.paneltype ==
          "SUPERADMIN" ||
        switchLoginMutationResult.switchlogin.designation.paneltype == "ADMIN"
      ) {
        window.location = "/admin";
      } else {
        window.location = "/user";
      }
    }
  }, [switchLoginMutationResult]);

  const GetUser = gql`
    query User($id: ID!) {
      user(id: $id) {
        id
        picture
        name
        pseudonym
        username
        email
        number
        designation {
          id
          name
          paneltype
        }
        status
        comments
        managerId {
          id
          name
        }
        settings
        agentlimitchatassign
        pages
      }
    }
  `;

  let [
    getUser,
    {
      loading: getUserQueryLoading,
      error: getUserQueryError,
      data: getUserQueryResult,
    },
  ] = useLazyQuery(GetUser, {
    fetchPolicy: "network-only",
  });

  const handleUsersListMenuClose = () => {
    props.setUsersListContextMenuPosAndObjectDetails(null);
  };


  useEffect(()=>{
    if (getUserQueryResult && getUserQueryResult.user) {

    
      props.setAddEditUserModalSelectedRowData(getUserQueryResult.user);
    setTimeout(() => {
      props.setAddEditUserModalToggle(true);
    }, 500);
    
  }
 },[getUserQueryResult]);
  

  const mainContainerRef = useRef(null);
  return (
    <div ref={mainContainerRef}>
      <AddEditUserModal mainContainerRef={mainContainerRef} filterForManager={true} disableManager={true}/>
      <Popover
        container={mainContainerRef.current}
        classes={{ root: classes.popover }}
        disableEnforceFocus={true}
        open={props.usersListContextMenuPosAndObjectDetails != null}
        anchorEl={
          props.usersListContextMenuPosAndObjectDetails != null
            ? props.usersListContextMenuPosAndObjectDetails.anchorEl
            : undefined
        }
        anchorReference="anchorPosition"
        anchorPosition={
          props.usersListContextMenuPosAndObjectDetails != null
            ? {
                top: props.usersListContextMenuPosAndObjectDetails.mouseY,
                left: props.usersListContextMenuPosAndObjectDetails.mouseX,
              }
            : undefined
        }
      >
        <Paper className={classes.usersListMenuPaper}>
          <ClickAwayListener onClickAway={handleUsersListMenuClose}>
            <MenuList
              autoFocusItem={Boolean(props.usersListContextMenuPos)}
              id="menu-list-grow"
              keepMounted
            >
              <MenuItem
                className={classes.usersListMenuItem}
                onClick={async (event) => {
                  event.preventDefault();
                  handleUsersListMenuClose();

                  switchLogin({
                    variables: {
                      id: props.usersListContextMenuPosAndObjectDetails.userId,
                    },
                  });
                }}
              >
                LoginAs
              </MenuItem>
              <Divider className={classes.usersListMenuItemDivider} />
              <MenuItem
                className={classes.usersListMenuItem}
                onClick={async (event) => {
                  event.preventDefault();
                  getUser({
                    variables: {
                      id: props.usersListContextMenuPosAndObjectDetails.userId,
                    },
                  });    
               
                 // props.setAddEditUserModalToggle(true);
                  handleUsersListMenuClose();
                }}
              >
                Edit
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popover>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { ...state.UsersListReducer, ...state.AddEditUserModalReducer };
};
export default connect(mapStateToProps, {
  setUsersListContextMenuPosAndObjectDetails,
  setAddEditUserModalSelectedRowData,
  setAddEditUserModalToggle,
})(UsersListContextMenu);
