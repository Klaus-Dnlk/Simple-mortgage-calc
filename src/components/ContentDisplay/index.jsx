import React from 'react';
import { string } from 'prop-types';
import DOMPurify from 'dompurify';

const sanitizeHtml = (html) => {
  return DOMPurify.sanitize(html);
};

const ContentDisplay = ({ html }) => {
  const sanitizedHtml = sanitizeHtml(html);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>;
};

export default ContentDisplay;

ContentDisplay.propTypes = {
  html: string,
};

ContentDisplay.defaultProps = {
  html: '',
};
