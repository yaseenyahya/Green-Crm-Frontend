import React, { Component, useRef } from "react";

import {
  IconButton,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Paper,
  Popover,
  Grow,
} from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import { setAdminPanelSettingsMenuAnchorEl } from "../../store/actions/AdminpanelActions";
import { setAccountUserInfoSettingsModalToggle } from "../../store/actions/AccountUserInfoSettingsModalActions";
import AccountUserInfoSettingsModal from "../AccountUserInfoSettingsModal";
const useStyles = makeStyles((theme) => ({
  settingsIcon: {
    fontSize: 30,
    color: "gray",
  },
  settingsMenuPaper: {
    background: "rgb(26 39 51 / 73%)",
    borderRadius: 0,
  },
  settingsMenuItem: {
    color: "white",
    cursor: "pointer",
    pointerEvents: "auto",
  },

  popover: {
    pointerEvents: "none",
  },
}));

const SettingsMenu = (props) => {
  const classes = useStyles();

  const handleSettingsMenuClick = (event) => {
    props.setAdminPanelSettingsMenuAnchorEl(event.currentTarget);
  };

  const handleSettingsPicMenuClose = () => {
    props.setAdminPanelSettingsMenuAnchorEl(null);
  };
 
  return (
    <div >
      <IconButton
        onClick={handleSettingsMenuClick}
        aria-controls={
          Boolean(props.adminPanelSettingsMenuAnchorEl)
            ? "menu-list-grow"
            : undefined
        }
        aria-haspopup="true"
      >
        <SettingsIcon className={classes.settingsIcon} />
      </IconButton>
      <AccountUserInfoSettingsModal mainContainerRef={props.mainContainerRef} />
      <Popover
        container={props.mainContainerRef.current}
        classes={{ root: classes.popover }}
        disableEnforceFocus={true}
        open={Boolean(props.adminPanelSettingsMenuAnchorEl)}
        anchorEl={
          props.adminPanelSettingsMenuAnchorEl
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
   
            <Paper className={classes.settingsMenuPaper}>
              <ClickAwayListener onClickAway={handleSettingsPicMenuClose}>
                <MenuList
                  autoFocusItem={Boolean(props.adminPanelSettingsMenuAnchorEl)}
                  id="menu-list-grow"
                  keepMounted
                >
                  <MenuItem
                    className={classes.settingsMenuItem}
                    onClick={async () => {
                      handleSettingsPicMenuClose();
                      props.setAccountUserInfoSettingsModalToggle(true);
            
                    }}
                  >
                    Account Settings
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
  setAccountUserInfoSettingsModalToggle,
  setAdminPanelSettingsMenuAnchorEl,
})(SettingsMenu);
