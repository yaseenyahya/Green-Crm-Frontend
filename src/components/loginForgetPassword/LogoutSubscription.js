import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { setForceLogoutUser } from "../../store/actions/LoginForgetPasswordActions";
import { setRedirectToPath } from "../../store/actions/RedirectToPathActions";
import _ from "lodash";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const LogoutSubscription = (props) => {
  const ForceLogoutSubscription = gql`
    subscription ForceLogout {
      forcelogout {
        id
        username
      }
    }
  `;

  const { data: forceLogoutSubscriptionResult } = useSubscription(
    ForceLogoutSubscription
  );

  useEffect(() => {
    if (
      forceLogoutSubscriptionResult &&
      forceLogoutSubscriptionResult.forcelogout
    ) {
      if (props.authUserId == forceLogoutSubscriptionResult.forcelogout.id) {
        props.setForceLogoutUser(
          forceLogoutSubscriptionResult.forcelogout.username
        );
        props.setRedirectToPath("/login");
      }
    }
  }, [forceLogoutSubscriptionResult]);

  return null;
};

const mapStateToProps = (state) => {
  return {
    ...state.LoginForgetPasswordReducer,
    ...state.AuthReducer,
  };
};
export default connect(mapStateToProps, {
  setRedirectToPath,
  setForceLogoutUser,
})(LogoutSubscription);
