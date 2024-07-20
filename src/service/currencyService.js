export const getCurrencyRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.rates;
    } catch (error) {
      throw new Error(`Fetching currency rates failed: ${error.message}`);
    }
  };