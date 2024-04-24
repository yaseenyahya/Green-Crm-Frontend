import React, { useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { setChatBoxTypingMessageDetails } from "../../store/actions/ChatBoxActions";
const useStyles = makeStyles((theme) => ({
  chatBoxMessageTypingStatusContainer: {
    position: "absolute",
    background: "#e14079",
    padding: 3,
    right: 42,
    color: "white",
    bottom: 40,
    fontSize: 14
  },
}));

const ChatContainerTypingMessageStatus = (props) => {
  const classes = useStyles();

  var chatBoxTypingMessageStatusToggleTimeOut = null;
  useEffect(() => {
    if (props.chatBoxTypingMessageDetails) {
      if (chatBoxTypingMessageStatusToggleTimeOut)
        chatBoxTypingMessageStatusToggleTimeOut.clear();

      chatBoxTypingMessageStatusToggleTimeOut = setTimeout(() => {
        props.setChatBoxTypingMessageDetails(null);
      }, 1800);
    }
  }, [props.chatBoxTypingMessageDetails]);

  return props.chatBoxTypingMessageDetails ? (
    <span className={classes.chatBoxMessageTypingStatusContainer}>
      {`${props.chatBoxTypingMessageDetails} is typing...`} 
    </span>
  ) : null;
};

const mapStateToProps = (state) => {
  return { ...state.ChatBoxReducer };
};
export default connect(mapStateToProps, {
  setChatBoxTypingMessageDetails,
})(ChatContainerTypingMessageStatus);
