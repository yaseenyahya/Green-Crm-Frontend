import React, { useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { setChatBoxRecentChatListData } from "../../store/actions/ChatBoxActions";
import _ from "lodash";
const useStyles = makeStyles((theme) => ({
  messageTypingStatusContainer: {
    color: "#7e7e7e",
    fontSize: 10,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    marginRight: 5,
    textAlign: "left",
    fontWeight:"bold"
  },
}));

const ChatListTypingMessageStatus = (props) => {
  const classes = useStyles();

  var typingMessageStatusToggleTimeOut = null;
  useEffect(() => {
    if (typingMessageStatusToggleTimeOut)
      typingMessageStatusToggleTimeOut.clear();

    typingMessageStatusToggleTimeOut = setTimeout(() => {
      var prevChatData = _.find(
        props.chatBoxRecentChatListData,
        (itm) =>
          props.customerId == itm.customerId && props.pageId == itm.pageId
      );

      if (prevChatData)
        prevChatData.typingMessageDetails = undefined;

      props.setChatBoxRecentChatListData(
        _.cloneDeep(props.chatBoxRecentChatListData)
      );
    }, 1800);
  }, []);

  return (
    <span className={classes.messageTypingStatusContainer}>
      {`${props.typingMessageDetails} is typing...`}
    </span>
  );
};

const mapStateToProps = (state) => {
  return { ...state.ChatBoxReducer };
};
export default connect(mapStateToProps, {
  setChatBoxRecentChatListData,
})(ChatListTypingMessageStatus);
