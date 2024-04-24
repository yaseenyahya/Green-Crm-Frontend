import _ from "lodash";
export default class highlightSearchIncludes {
  splitInObject(text, highlightText) {
    var paragraphObject = [];
    var re = new RegExp(highlightText, "i");
    var res = text.split(re);
    var incLength = 1;
    res.forEach(function (val) {
      if (val.toLowerCase() == highlightText.toLowerCase())
        paragraphObject.push({ highlightp: highlightText });
      else paragraphObject.push({ ordinaryp: val });
      if (incLength < res.length)
        paragraphObject.push({ highlightp: highlightText });
      incLength++;
    });

    return paragraphObject;
  }
  showPrevSearch = (
    chatBoxContainerChatSearchCount,
    messageContainerRef,
    setChatBoxContainerChatSearchCount,
    setChatBoxContainerChatSearchUpButtonToggle,
    setChatBoxContainerChatSearchDownButtonToggle
  ) => {
    var chatBoxContainerChatSearchCount_ = chatBoxContainerChatSearchCount - 1;

    var findElement = this.getElementByDataCount(
      messageContainerRef,
      chatBoxContainerChatSearchCount_
    );

    if (findElement) {
      findElement.scrollIntoView();
    }
    setChatBoxContainerChatSearchCount(chatBoxContainerChatSearchCount_);

    var findNextElement = this.getElementByDataCount(
      messageContainerRef,
      chatBoxContainerChatSearchCount_ - 1
    );
    if (!findNextElement) {
      setChatBoxContainerChatSearchUpButtonToggle(false);
    } else {
      setChatBoxContainerChatSearchUpButtonToggle(true);
    }
    var findNextElement = this.getElementByDataCount(
      messageContainerRef,
      chatBoxContainerChatSearchCount_ + 1
    );
    if (!findNextElement) {
      setChatBoxContainerChatSearchDownButtonToggle(false);
    } else {
      setChatBoxContainerChatSearchDownButtonToggle(true);
    }
  };
  showNextSearch = (
    chatBoxContainerChatSearchCount,
    messageContainerRef,
    setChatBoxContainerChatSearchCount,
    setChatBoxContainerChatSearchUpButtonToggle,
    setChatBoxContainerChatSearchDownButtonToggle
  ) => {
    var chatBoxContainerChatSearchCount_ = chatBoxContainerChatSearchCount + 1;

    var findElement = this.getElementByDataCount(
      messageContainerRef,
      chatBoxContainerChatSearchCount_
    );

    if (findElement) {
      findElement.scrollIntoView();
    }
    setChatBoxContainerChatSearchCount(chatBoxContainerChatSearchCount_);
    var findNextElement = this.getElementByDataCount(
      messageContainerRef,
      chatBoxContainerChatSearchCount_ + 1
    );
    if (!findNextElement) {
      setChatBoxContainerChatSearchDownButtonToggle(false);
    } else {
      setChatBoxContainerChatSearchDownButtonToggle(true);
    }
    var findNextElement = this.getElementByDataCount(
      messageContainerRef,
      chatBoxContainerChatSearchCount_ - 1
    );
    if (!findNextElement) {
      setChatBoxContainerChatSearchUpButtonToggle(false);
    } else {
      setChatBoxContainerChatSearchUpButtonToggle(true);
    }
  };
  getElementByDataCount = (
    messageContainerRef,
    chatBoxContainerChatSearchCount
  ) => {
    var currentDataValueToSearch = "Search" + chatBoxContainerChatSearchCount;
    var allMessagesElement = messageContainerRef.getElementsByTagName("span");
    var findElement = null;
    for (var i = 0; i < allMessagesElement.length; i++) {
      if (
        allMessagesElement[i].getAttribute("data-search") ==
        currentDataValueToSearch
      ) {
        findElement = allMessagesElement[i];
        break;
      }
    }
    return findElement;
  };
  getSearchContentText = (searchText, slugText) => {
    if (searchText != "") {
      var textArray = this.splitInObject(slugText, searchText);
      var textHTML = "";
      var containsSearch = false;
      textArray.map((text) => {
        if (text.highlightp != undefined) {
          containsSearch = true;
          textHTML += '<mark style="color:red">' + text.highlightp + "</mark>";
        } else textHTML += "<span>" + text.ordinaryp + "</span>";
      });

      return { text: textHTML, containsSearch: containsSearch };
    }
    return { text: slugText, containsSearch: false };
  };
}
