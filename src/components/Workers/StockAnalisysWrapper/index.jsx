import React, { useEffect, useState } from 'react';
import { string } from 'prop-types';
const StockAnalysis = ({ symbol, apiKey }) => {
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const worker = new Worker(
      new URL(
        '../../../service/workers/stockAnalisysWorker.js',
        import.meta.url
      )
    );

    worker.postMessage({ symbol, apiKey });

    worker.addEventListener('message', function (e) {
      if (e.data.error) {
        setError(e.data.error);
      } else {
        setStockData(e.data.processedData);
      }
    });

    return () => {
      worker.terminate();
    };
  }, [symbol, apiKey]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stockData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Historical Data for {symbol}</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map(({ date, open, high, low, close, volume }) => (
            <tr key={date}>
              <td>{date}</td>
              <td>{open}</td>
              <td>{high}</td>
              <td>{low}</td>
              <td>{close}</td>
              <td>{volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockAnalysis;

StockAnalysis.propTypes = {
  symbol: string.isRequired,
  apiKey: string,
};

StockAnalysis.defaultProps = {
  apiKey: '',
};
