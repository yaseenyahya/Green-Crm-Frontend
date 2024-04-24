import React, { useState, useEffect, useRef } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  Dialog,
  DialogContent,
  Typography,
  DialogTitle,
  CircularProgress,
  IconButton,
  Container,
  Button,
} from "@material-ui/core";
import { connect } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { SimpleDataGrid } from "./SimpleDataGrid";
import { setLoginAsModalToggle } from "../store/actions/LoginAsModalActions";
import { setRedirectToPath } from "../store/actions/RedirectToPathActions";
import { useSnackbar } from "notistack";
import clsx from "clsx";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "white",
  },

  dialogTitle: {
    background: "rgb(46 62 78)",
  },
  dialogTitleText: {
    color: "white",
  },
  dialogActions: {
    padding: 0,
  },

  dialogContent: {
    padding: 0,
  },
  switchAccountButton: {
    color: "white",
    background: "#f50057",
    marginRight: 5,
    "&:hover": {
      background: "#e14079",
    },
  },
  circularProgress: {
    width: 54,
    height: 54,
    margin: "20px auto",
    display: "block",
  },
  ActionButtonContainer: {
    display: "flex",
  },
  logoutButton: {
    background: "pink",
    marginLeft: 12,
    marginRight:0,
    color: "white",
    "&:hover": {
      background: "#e14079",
    },
  },
}));

const LoginAsModal = (props) => {
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


  let ForceLogoutMutation = gql`
    mutation forcelogout($id: ID!,$username:String!) {
      forcelogout(id: $id,username:$username) {
        success
        error
      }
    }
  `;

  const [
    forceLogout,
    {
      loading: forceLogoutMutationLoading,
      error: forceLogoutMutationError,
      data: forceLogoutMutationResult,
    },
  ] = useMutation(ForceLogoutMutation);

  useEffect(() => {
    if (forceLogoutMutationError) {
      forceLogoutMutationError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [forceLogoutMutationError]);

  useEffect(() => {
    if (forceLogoutMutationResult && forceLogoutMutationResult.forcelogout) {
      //refreshing users
      if (props.loginAsModalToggle) {
        getLoginAsUsers();
      }
    }
  }, [forceLogoutMutationResult]);

  const handleClose = () => {
    props.setLoginAsModalToggle(false);
  };
  const GetLoginAsUsersQuery = gql`
    query LoginAsUsers {
      loginasusers {
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
        isUserLoggedIn
      }
    }
  `;

  let [
    getLoginAsUsers,
    {
      loading: getLoginAsUsersQueryLoading,
      error: getLoginAsUsersQueryError,
      data: getLoginAsUsersQueryResult,
    },
  ] = useLazyQuery(GetLoginAsUsersQuery, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (props.loginAsModalToggle) {
      getLoginAsUsers();
    }
  }, [props.loginAsModalToggle]);

  const gridColumns = [
    {
      title: "",
      field: "loginasbutton",
      render: (rowData) => {
        return (
          <Container className={classes.ActionButtonContainer}>
            <Button
              className={classes.switchAccountButton}
              onClick={async () => {
                try {
                  await switchLogin({
                    variables: {
                      id: rowData.id,
                    },
                  });
                } catch (e) {}
                //alert(props.authUserId);
              }}
            >
              Switch
            </Button>
            {rowData.isUserLoggedIn && (
              <IconButton onClick={()=>{
                forceLogout({
                  variables: {
                    id: rowData.id,
                    username:props.authUserName
                  },
                });
              }} className={classes.logoutButton}>
                <PowerSettingsNewIcon />
              </IconButton>
            )}
          </Container>
        );
      },
      export: false,
    },
    { title: "Name", field: "name" },
    { title: "Pseudonym", field: "pseudonym" },
    { title: "Username", field: "username" },
    { title: "Email", field: "email" },
    { title: "Mobile Number", field: "number" },
    { title: "Designation", field: "designation.name" },
    { title: "Manager", field: "managerId.name" },
    { title: "Status", field: "status" },
    { title: "comments", field: "comments" },
  ];

  return (
    <Dialog
      fullScreen
      container={props.mainContainerRef.current}
      aria-labelledby="customized-dialog-title"
      open={props.loginAsModalToggle}
      onClose={handleClose}
    >
      <DialogTitle
        onClose={handleClose}
        id="customized-dialog-title"
        className={classes.dialogTitle}
      >
        <Typography variant="h6" className={classes.dialogTitleText}>
          Login As
        </Typography>

        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={false} className={classes.dialogContent}>
        {getLoginAsUsersQueryLoading ? (
          <div className={classes.circularProgress}>
            <CircularProgress size={24} />
          </div>
        ) : (
          <Container maxWidth={false} disableGutters={true}>
            <SimpleDataGrid
              disableExport={true}
              notAllowEdit={true}
              onRowDelete={null}
              onRowUpdateInline={null}
              inlineEdit={false}
              title={"Users"}
              onActionAddClick={null}
              columns={gridColumns}
              data={
                getLoginAsUsersQueryLoading
                  ? null
                  : getLoginAsUsersQueryResult &&
                    getLoginAsUsersQueryResult.loginasusers
              }
            />
          </Container>
        )}
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return { ...state.LoginAsModalReducer, ...state.AuthReducer };
};
export default connect(mapStateToProps, {
  setLoginAsModalToggle,
  setRedirectToPath,
})(LoginAsModal);
