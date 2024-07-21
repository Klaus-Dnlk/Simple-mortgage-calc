import React from 'react';

const CalculatorIframe = () => {
  return (
    <div>
      <h1>Financial Calculator (js)</h1>
      <iframe
        src={`${process.env.PUBLIC_URL}/calculator.html`}
        title="Loan Interest Calculator"
        style={{ width: '100%', height: '600px', border: 'none' }}
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
    </div>
  );
};

export default CalculatorIframe;
