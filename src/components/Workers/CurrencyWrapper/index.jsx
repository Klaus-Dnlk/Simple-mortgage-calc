import React, { useEffect, useState } from 'react';
import { string } from 'prop-types';

const CurrencyRatesWrapper = ({ baseCurrency }) => {
  const [rates, setRates] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const worker = new Worker(
      new URL('../../../service/workers/currencyWorker.js', import.meta.url)
    );

    worker.postMessage({ baseCurrency });

    worker.addEventListener('message', function (e) {
      if (e.data.error) {
        setError(e.data.error);
      } else {
        setRates(e.data.rates);
      }
    });

    return () => {
      worker.terminate();
    };
  }, [baseCurrency]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!rates) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Exchange Rates for {baseCurrency}</h1>
      <ul>
        {Object.keys(rates).map((currency) => (
          <li key={currency}>
            {currency}: {rates[currency]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrencyRatesWrapper;

CurrencyRatesWrapper.propTypes = {
  baseCurrency: string,
};

CurrencyRatesWrapper.defaultProps = {
  baseCurrency: '',
};
