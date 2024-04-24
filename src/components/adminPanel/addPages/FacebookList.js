import React, { useState, useEffect } from "react";

import { Checkbox, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
  },
 
}));
const FacebookList = (props) => {
  const classes = useStyles();
  const [facebookPageImg, setFacebookPageImg] = useState("");
  useEffect(() => {
    window.FB.api(
      `/${props.facebookPageId}/picture`,
      {
        redirect: "0",
      },
      function (responsePicture) {
        if (responsePicture && !responsePicture.error) {

          setFacebookPageImg(responsePicture.data.url);
        }
      }
    );
  }, [props.facebookPageId]);

  return (
    <Container disableGutters={true} className={classes.mainContainer}>
      {props.checkBox && (
        <Checkbox
      checked={props.isChecked}
          onChange={(event) => {
            props.onChange(event.target.checked,props.facebookPageId);
          }}
        ></Checkbox>
      )}
      <img className={props.facebookPageImgClass} src={facebookPageImg}></img>
      <Typography className={props.facebookPageNameClass}>
        {props.facebookPageName}
      </Typography>
    </Container>
  );
};

export default FacebookList;
