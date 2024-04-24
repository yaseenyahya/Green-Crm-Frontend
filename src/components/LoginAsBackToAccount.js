import React, { Component, useEffect, useRef } from "react";

import { IconButton, Button } from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { setLoginAsModalToggle } from "../store/actions/LoginAsModalActions";
import { useMutation } from "@apollo/react-hooks";
import { useSnackbar } from "notistack";
import _ from "lodash";
import LoginAsModal from "./LoginAsModal";
import gql from "graphql-tag";
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    marginLeft: 5,
    marginRight: 25,
  },
  loginAsButton: {
    color: "white",
    background: "#f50057",
    marginRight: 5,
    "&:hover": {
      background: "#e14079",
    },
  },
  switchBackToAccountButtonIcon: {
    fontSize:40
  },
}));

const LoginAsBackToAccount = (props) => {
  const classes = useStyles();
  const mainContainerRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  let BackToAccountSwitchLoginMutation = gql`
  mutation BackToAccountSwitchLogin($id: String!) {
    backtoaccountswitchlogin(id: $id) {
      name
      designation {
        name
        paneltype
      }
    }
  }
`;

const [
  backToAccountSwitchLogin,
  {
    loading: backToAccountSwitchLoginMutationLoading,
    error: backToAccountSwitchLoginMutationError,
    data: backToAccountSwitchLoginMutationResult,
  },
] = useMutation(BackToAccountSwitchLoginMutation);

useEffect(() => {
  if (backToAccountSwitchLoginMutationError) {
    backToAccountSwitchLoginMutationError.graphQLErrors.map(({ message }, i) => {
      enqueueSnackbar(message, { variant: "error" });
    });
  }
}, [backToAccountSwitchLoginMutationError]);

useEffect(() => {
  if (backToAccountSwitchLoginMutationResult && backToAccountSwitchLoginMutationResult.backtoaccountswitchlogin) {
    if (
      backToAccountSwitchLoginMutationResult.backtoaccountswitchlogin.designation.paneltype == "SUPERADMIN" ||
      backToAccountSwitchLoginMutationResult.backtoaccountswitchlogin.designation.paneltype == "ADMIN"
    ) {
      window.location =  "/admin";
    } else {
      window.location = "/user";
    }
  }
}, [backToAccountSwitchLoginMutationResult]);

  return (
    <div ref={mainContainerRef} className={classes.mainContainer}>
      <IconButton
       onClick={async ()=>{
        try {
          await backToAccountSwitchLogin({
            variables: {
              id: props.authUserSwitchAccountSettings,
            },
          });
        } catch (e) {}
        
       }}
       
      >
        <ChevronLeftIcon className={classes.switchBackToAccountButtonIcon} />
      </IconButton>
      <Button   onClick={() => {
          props.setLoginAsModalToggle(true);
        }} className={classes.loginAsButton}>LoginAs</Button>
      <LoginAsModal mainContainerRef={mainContainerRef}/>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {...state.AuthReducer };
};
export default connect(mapStateToProps, {
  setLoginAsModalToggle,
})(LoginAsBackToAccount);
