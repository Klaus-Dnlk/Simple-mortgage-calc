import React, { useEffect } from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import DOMPurify from 'dompurify';

import ContentDisplay from './components/ContentDisplay';
import AppRoutes from './routes';
import './App.css';
import CookiesBanner from './components/CookiesBanner';

const cookies = document.cookie;
console.log('cookies', cookies);
function App() {
  useEffect(() => {
    if (!document.cookie.includes('userConsent=accepted')) {
      new CookiesBanner();
    }
  }, []);

  const sanitizeHtml = (htmlContent) => {
    const sanitized = DOMPurify.sanitize(htmlContent);
    return sanitized.trim() !== '' ? sanitized : null;
  };

  const potentiallyUnsafeHtml = "<img src='x' onerror='alert(1)' />";
  const sanitizedHtml = sanitizeHtml(potentiallyUnsafeHtml);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Button color="inherit" sx={{ mr: 2 }} component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={NavLink} to="/banks">
            Banks
          </Button>
          <Button color="inherit" component={NavLink} to="/calc">
            Calculator
          </Button>
        </Toolbar>
      </AppBar>
      {sanitizedHtml && (
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>
      )}
      <ContentDisplay html={potentiallyUnsafeHtml} />
      <AppRoutes />
    </Box>
  );
}

export default App;
