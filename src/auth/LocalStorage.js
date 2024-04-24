export const LocalStorage =  {
  getAdminPanelChatOnline() {
    //console.log("Asdasdahina",localStorage.getItem("adminPanelChatOnline"));
    return JSON.parse(localStorage.getItem("adminPanelChatOnline"));
  },
  setAdminPanelChatOnline(value) {

    localStorage.setItem("userPanelChatOnline", value);
  },
  getChatBoxFacebookIDsWithProfileDetails() {
   
    return localStorage.getItem("chatBoxFacebookIDsWithProfileDetails") ? 
    JSON.parse(localStorage.getItem("chatBoxFacebookIDsWithProfileDetails")) : null;
  },
  setChatBoxFacebookIDsWithProfileDetails(value) {

    localStorage.setItem("chatBoxFacebookIDsWithProfileDetails", JSON.stringify(value));
  }
}
