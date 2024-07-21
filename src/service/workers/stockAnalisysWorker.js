self.addEventListener('message', function (e) {
  const { symbol, apiKey } = e.data;
  process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const timeSeries = data['Time Series (Daily)'];
      if (timeSeries) {
        const processedData = Object.keys(timeSeries).map((date) => ({
          date,
          open: parseFloat(timeSeries[date]['1. open']),
          high: parseFloat(timeSeries[date]['2. high']),
          low: parseFloat(timeSeries[date]['3. low']),
          close: parseFloat(timeSeries[date]['4. close']),
          volume: parseInt(timeSeries[date]['5. volume'], 10),
        }));
        self.postMessage({ symbol, processedData });
      } else {
        self.postMessage({ error: 'No data found' });
      }
    })
    .catch((error) => {
      self.postMessage({ error: error.message });
    });
});
