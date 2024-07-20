import React from "react";


const CalculatorIframe = () => {
    return (
        <div>
            <h1>Financial Calculator (js)</h1>
            <iframe 
                src={`${process.env.PUBLIC_URL}/calculator.html`} 
                frameborder="0" 
                title="Loan Interest Calculator" 
                style={{ width: '100%', height: '600px', border: 'none' }}
            ></iframe>
        </div>
    )
}

export default CalculatorIframe;