import React, { useEffect, useState } from 'react';
import { getCurrencyRates } from '../../service/currencyService';

const CurrencyRates = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCurrencyRates();
        setRates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Currency Rates</h2>
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

export default CurrencyRates;
