const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'https://api.exchangerate-api.com/v4/latest/';

export const fetchCurrencyRates = async (baseCurrency) => {
  try {
    const response = await fetch(`${corsProxy}${apiUrl}${baseCurrency}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    throw error;
  }
};
