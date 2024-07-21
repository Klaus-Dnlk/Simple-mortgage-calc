import React, { useState, Fragment } from 'react';
import { Snackbar, Button, Slide } from '@mui/material';
import moment from 'moment';

const TransitionUp = (props) => {
  return <Slide {...props} direction="up" />;
};

const CookiesBanner = () => {
  const [open, setOpen] = useState(true);

  const setCookies = (name, value, days) => {
    const date = moment().add(days, 'days').toDate();
    const expires = 'expires=' + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  };

  const handleAccept = () => {
    setCookies('userConsent', 'accepted', 365);
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={TransitionUp}
      message="This website uses cookies to enhance the user experience."
      action={
        <Fragment>
          <Button color="secondary" size="small" onClick={handleAccept}>
            Accept
          </Button>
        </Fragment>
      }
    />
  );
};

export default CookiesBanner;
