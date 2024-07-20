import React from 'react';
import DOMPurify from 'dompurify';

const ContentDisplay = () => {
    
    const potentiallyUnsafeHtml = "<img src='x' onerror='alert(1)' />"
    const sanitizedHtml = DOMPurify.sanitize(potentiallyUnsafeHtml);

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>
  );
};

export default ContentDisplay;
