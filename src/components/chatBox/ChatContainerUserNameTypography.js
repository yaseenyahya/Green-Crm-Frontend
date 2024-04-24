import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, CircularProgress } from "@material-ui/core";
import { useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useSnackbar } from "notistack";
const useStyles = makeStyles((theme) => ({
  userNameTypography: {
    color: "white",
    marginRight: 5,
    display: "flex",
    alignItems: "center"
  },
  loadingCircularProgress: {
    margin: "auto",
    display: "block",
    color: "white",
    marginRight: 5

  },
}));

const ChatContainerUserNameTypography = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const UserQuery = gql`
    query User($id: ID!) {
      user(id: $id) {
        id
        name
        username
      }
    }
  `;
  let [
    getUser,
    { loading: userLoading, error: userQueryError, data: userQueryResult },
  ] = useLazyQuery(UserQuery, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (userQueryError) {
        userQueryError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
      getUser({
        variables: {
          id: props.agentId,
        },
      });
    }
  }, [userQueryError]);
  useEffect(() => {
 
      getUser({
        variables: {
          id: props.agentId,
        },
      });
    
  }, [props.agentId]);

  return (
    <>
      {userLoading ? (
        <CircularProgress
          className={classes.loadingCircularProgress}
          size={24}
        />
      ) : (
        <Typography className={classes.userNameTypography}>
          {userQueryResult && userQueryResult.user && `${userQueryResult.user.username}`}
        </Typography>
      )}
    </>
  );
};

export default ChatContainerUserNameTypography;
