import React, { useRef,useEffect } from "react";

import {
  IconButton,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Paper,
  Popover,
  Grow,
  Divider,
} from "@material-ui/core";
import { connect } from "react-redux";
import LoginAsModal from "../LoginAsModal";
import { makeStyles } from "@material-ui/core/styles";
import { setAdminPanelProfilePicMenuAnchorEl } from "../../store/actions/AdminpanelActions";
import { setLoginAsModalToggle } from "../../store/actions/LoginAsModalActions";
import LazyLoad from "react-lazyload";
import Auth from "../../auth/auth";
import { setRedirectToPath } from "../../store/actions/RedirectToPathActions";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const useStyles = makeStyles((theme) => ({
  profilePicture: {
    width: 55,
    border: "1px solid #beb7b7",
    borderRadius: "50%",
    height: 55
  },
  profilePicMenuPaper: {
    background: "rgb(26 39 51 / 73%)",
    borderRadius: 0,
  },
  profilePicMenuItem: {
    color: "white",
    cursor: "pointer",
    pointerEvents: "auto",
  },

  popover: {
    pointerEvents: "none",
  },
  profilePicMenuItemDivider:{
    background:"white"
  }
}));

const ProfilePictureMenu = (props) => {
  const classes = useStyles();

  const handleProfilePicMenuClick = (event) => {
    props.setAdminPanelProfilePicMenuAnchorEl(event.currentTarget);
  };

  const handleProfilePicMenuClose = () => {
    props.setAdminPanelProfilePicMenuAnchorEl(null);
  };
  const LogoutQuery = gql`
    mutation {
      logout {
        success
        error
      }
    }
  `;

  let [
    logout,
    {
      loading: logoutQueryLoading,
      error: logoutQueryError,
      data: logoutQueryResult,
    },
  ] = useMutation(LogoutQuery);
  useEffect(() => {
    if (logoutQueryResult && logoutQueryResult.logout) {
      window.location = "/login";
    }
  }, [logoutQueryResult]);


  return (
    <div >
      <IconButton
       className={props.profilePicClassName}
        onClick={handleProfilePicMenuClick}
        aria-controls={
          Boolean(props.adminPanelProfilePicMenuAnchorEl)
            ? "menu-list-grow"
            : undefined
        }
        aria-haspopup="true"
      >
        <LazyLoad height={200}>
          {props.profilePicture ? (
            <img src={props.profilePicture}  className={classes.profilePicture}/>
          ) : (
            <img
              className={classes.profilePicture}
              src={process.env.PUBLIC_URL + "/noprofileimagesmall.jpg"}
            />
          )}
        </LazyLoad>
      </IconButton>
      <LoginAsModal mainContainerRef={props.mainContainerRef}/>
      <Popover
        container={props.mainContainerRef.current}
        classes={{ root: classes.popover }}
        disableEnforceFocus={true}
        open={Boolean(props.adminPanelProfilePicMenuAnchorEl)}
        anchorEl={
          props.adminPanelProfilePicMenuAnchorEl
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        
            <Paper className={classes.profilePicMenuPaper}>
              <ClickAwayListener onClickAway={handleProfilePicMenuClose}>
                <MenuList
                  autoFocusItem={Boolean(
                    props.adminPanelProfilePicMenuAnchorEl
                  )}
                  id="menu-list-grow"
                  keepMounted
                >
                  <MenuItem
                    className={classes.profilePicMenuItem}
                    onClick={async () => {
                      logout();
                      handleProfilePicMenuClose();
                    }}
                  >
                    Logout
                  </MenuItem>
              
                <Divider className={classes.profilePicMenuItemDivider}/>
                  <MenuItem
                    className={classes.profilePicMenuItem}
                    onClick={async () => {
                      props.setLoginAsModalToggle(true);
                      handleProfilePicMenuClose();
                    }}
                  >
                    Login As
                  </MenuItem>
                  </MenuList>
                 
              </ClickAwayListener>
            </Paper>
     
        
      </Popover>
     
    </div>
  );
};

const mapStateToProps = (state) => {
  return { ...state.AdminPanelReducer };
};
export default connect(mapStateToProps, {
  setAdminPanelProfilePicMenuAnchorEl,
  setRedirectToPath,
  setLoginAsModalToggle
})(ProfilePictureMenu);
