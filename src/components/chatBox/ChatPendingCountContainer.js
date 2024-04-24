import React, { Component, useEffect, useRef } from "react";

import { IconButton, Popover, Container } from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import {
  setChatBoxPendingChatCount,
  setChatBoxPendingChatCountDetailContainerAncherEl,
  setChatBoxPendingChatCountDetails,
} from "../../store/actions/ChatBoxActions";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import QueueIcon from "@material-ui/icons/Queue";
import _ from "lodash";
import PanelType from "../../auth/PanelType";
import FacebookList from "../adminPanel/addPages/FacebookList";
const useStyles = makeStyles((theme) => ({
  notificationIcon: {
    fontSize: 30,
    color: "gray",
  },

  notificationCountIcon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    position: "absolute",
    top: -2,
    right: -2,
    background: "#ff000082",
    fontSize: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    color: "white",
  },
  facebookPageImg: {
    width: 30,
    height: 30,
    marginTop: 3,
    marginBottom: 5,
    borderRadius: "50%",
  },
  facebookPageName: {
    marginLeft: 20,
    display: "flex",
    alignItems: "center",
    fontSize: 15,
  },
  facebookListMainContainer: {
    border: "1px solid #cccccc",
  },
  facebookListContainer: {
    display: "flex",
  },
  facebookListInnerContainer: {
    padding: "4px 0 4px 0",
    borderBottom: "1px solid #cccccc",
  },
  facebookListCountSpan: {
    display: "flex",
    background: "#ff000082",
    width: 30,
    height: 30,
    justifyContent: "center",
    borderRadius: 25,
    fontSize: 14,
    alignItems: "center",
    color: "white",
    marginTop: 3,
    borderRadius: "50%",
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
  },
}));

const ChatPendingCountContainer = (props) => {
  const classes = useStyles();

  const GetPendingChatCountQuery = gql`
    query GetPendingChatCount {
      getpendingchatcount {
        success
        error
        result
      }
    }
  `;

  let [
    getPendingChatCount,
    {
      loading: getPendingChatCountQueryLoading,
      error: getPendingChatCountQueryError,
      data: getPendingChatCountQueryResult,
    },
  ] = useLazyQuery(GetPendingChatCountQuery, {
    fetchPolicy: "network-only",
  });



  useEffect(() => {
    if (
      getPendingChatCountQueryResult &&
      getPendingChatCountQueryResult.getpendingchatcount 
    ) {
      var pendingChatCount = JSON.parse(
        getPendingChatCountQueryResult.getpendingchatcount.result
      );
      if (
        props.authPanelType != PanelType.MANAGER &&
        props.authPanelType != PanelType.SUPERADMIN
      ) {
        _.remove(
          pendingChatCount,
          (item) => !props.authUserPagesAssigned.includes(item.pageId)
        );

        var userPagesAdded = props.authPagesData;
        _.remove(
          userPagesAdded,
          (item) => !props.authUserPagesAssigned.includes(item.pageId)
        );
        props.setChatBoxPendingChatCountDetails(userPagesAdded);
      } else {
        var userPagesAllAdded = _.map(
          props.authPagesData,
          (item) => item.pageId
        );
        _.remove(
          pendingChatCount,
          (item) => !userPagesAllAdded.includes(item.pageId)
        );
        props.setChatBoxPendingChatCountDetails(props.authPagesData);
      }

      props.setChatBoxPendingChatCount(pendingChatCount.length);
    }
  }, [getPendingChatCountQueryResult, props.authPagesData]);

  useEffect(() => {
    if(props.chatBoxPendingChatCountDetailContainerAncherEl){
    getPendingChatCount();
    }
  }, [props.chatBoxPendingChatCountDetailContainerAncherEl]);

  useEffect(() => {
   
    getPendingChatCount();
    
  }, []);
  const handleClose = () => {
    props.setChatBoxPendingChatCountDetailContainerAncherEl(null);
  };
  return (
    <div>
      <IconButton
        onClick={(event) => {
          props.setChatBoxPendingChatCountDetailContainerAncherEl(
            event.currentTarget
          );
        }}
        id={"ChatPendingCountContainerPopOver"}
      >
        {props.chatBoxPendingChatCount != 0 && (
          <span className={classes.notificationCountIcon}>
            {props.chatBoxPendingChatCount}
          </span>
        )}
        <QueueIcon className={classes.notificationIcon} />
      </IconButton>
      <Popover
      container={props.mainContainerRef.current}
        id={"ChatPendingCountContainerPopOver"}
        open={props.chatBoxPendingChatCountDetailContainerAncherEl != null}
        anchorEl={props.chatBoxPendingChatCountDetailContainerAncherEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Container
          disableGutters={true}
          className={classes.facebookListMainContainer}
        >
          {props.chatBoxPendingChatCountDetails.map((item) => {
            var addEditUserModalFacebookPages =
              props.addEditUserModalFacebookPages
                ? props.addEditUserModalFacebookPages
                : [];
            var isChecked = addEditUserModalFacebookPages.includes(item.pageId);

            var pageCount =
              getPendingChatCountQueryResult &&
              getPendingChatCountQueryResult.getpendingchatcount
                ? _.filter(
                    JSON.parse(
                      getPendingChatCountQueryResult.getpendingchatcount.result
                    ),
                    (pendingChatitem) => pendingChatitem.pageId == item.pageId
                  ).length
                : 0;
            return (
              <Container
                disableGutters={true}
                className={classes.facebookListInnerContainer}
              >
                <Container
                  disableGutters={true}
                  className={classes.facebookListContainer}
                >
                  <span className={classes.facebookListCountSpan}>
                    {pageCount}
                  </span>
                  <FacebookList
                    facebookPageImgClass={classes.facebookPageImg}
                    facebookPageNameClass={classes.facebookPageName}
                    checkBox={false}
                    facebookPageId={item.pageId}
                    facebookPageName={item.name}
                  />
                </Container>
              </Container>
            );
          })}
        </Container>
      </Popover>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { ...state.ChatBoxReducer, ...state.AuthReducer };
};
export default connect(mapStateToProps, {
  setChatBoxPendingChatCount,
  setChatBoxPendingChatCountDetailContainerAncherEl,
  setChatBoxPendingChatCountDetails,
})(ChatPendingCountContainer);
