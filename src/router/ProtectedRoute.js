import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { auth } from "../auth/auth";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import PanelType from "../auth/PanelType";
import AdminPanel from "../components/adminPanel";
import UserPanel from "../components/userPanel";
import ManagerUserPanel from "../components/managerUserPanel";
import {
  setAuthSettings,
  setAuthUserId,
  setAuthPanelType,
  setAuthPagesData,
  setAuthUserPagesAssigned,
  setAuthUserSwitchAccountSettings,
  setAuthUserName
} from "../store/actions/AuthActions";
import { setUserPanelChatOnline } from "../store/actions/UserPanelActions";
import { connect } from "react-redux";
import resolveSettings from "../auth/resolveSettings";
import { Container } from "@material-ui/core";


const ProtectedRoute = (props, { ...rest }) => {
  const MeQuery = gql`
    query Me($accessToken: String) {
      me(accessToken: $accessToken) {
        id
        settings
        name
        designation {
          paneltype
        }
        pagesData
        pages
        switchaccountsettings
        onlineStatus
      }
    }
  `;

  let {
    loading: meQueryLoading,
    error: meQueryQueryError,
    data: meQueryResult,
  } = useQuery(MeQuery, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (meQueryResult && meQueryResult.me) {
      props.setUserPanelChatOnline(JSON.parse(meQueryResult.me.onlineStatus));
      props.setAuthUserId(meQueryResult.me.id);
      props.setAuthUserName(meQueryResult.me.name);
      props.setAuthUserSwitchAccountSettings(meQueryResult.me.switchaccountsettings);
     
      props.setAuthPanelType(meQueryResult.me.designation.paneltype);
      props.setAuthUserPagesAssigned(meQueryResult.me.pages != null ? JSON.parse(meQueryResult.me.pages):[]);
     
      var parsedPagesData = [];
      try {
        parsedPagesData = JSON.parse(meQueryResult.me.pagesData);
      } catch (e) {}
      props.setAuthPagesData(parsedPagesData);
      var parsedSettings = meQueryResult.me.settings;
      try {
        parsedSettings = JSON.parse(parsedSettings);
      } catch (e) {}
      props.setAuthSettings(
        new resolveSettings().resolveSettings(
          parsedSettings,
          meQueryResult.me.designation.paneltype
        )
      );
    }
  }, [meQueryResult]);
  const getPanelTypeComponent = (panelType, props_) => {
    switch (panelType) {
      case PanelType.SUPERADMIN:
        return (
          <AdminPanel
            wsLink={props.wsLink}
    
            {...props_}
          />
        );
      case PanelType.ADMIN:
        return (
          <AdminPanel
            wsLink={props.wsLink}
        
            {...props_}
          />
        );
      case PanelType.AGENT:
        return (
          <UserPanel
            wsLink={props.wsLink}

          />
        );
        case PanelType.MANAGER:
        return (
          <ManagerUserPanel
            wsLink={props.wsLink}

          />
        );
      default:
        return null;
    }
  };

  return meQueryLoading ? (
    <Container
      maxWidth={false}
      style={{ background: "#1a2733", width: "100%", height: "100vh" }}
    ></Container>
  ) : (
    <Route
      {...rest}
      render={(props) =>
        meQueryResult && meQueryResult.me ? (
          getPanelTypeComponent(meQueryResult.me.designation.paneltype, props)
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    ></Route>
  );
};
export default connect(null, {
  setAuthSettings,
  setAuthUserId,
  setAuthPanelType,
  setAuthPagesData,
  setAuthUserPagesAssigned,
  setAuthUserSwitchAccountSettings,
  setUserPanelChatOnline,
  setAuthUserName
})(ProtectedRoute);
