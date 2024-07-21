// self.addEventListener('message', function (e) {
//   const url = `https://api.exchangerate-api.com/v4/${process.env.REACT_APP_EXCHANGE_API_KEY}/latest/${e.data.baseCurrency}`;
//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       self.postMessage(data);
//     })
//     .catch((error) => {
//       self.postMessage({ error: error.message });
//     });
// });

const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = `https://api.exchangerate-api.com/v4/${process.env.REACT_APP_EXCHANGE_API_KEY}.latest/`;

self.addEventListener('message', function (e) {
  const baseCurrency = e.data.baseCurrency;
  const url = `${corsProxy}${apiUrl}${baseCurrency}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      self.postMessage(data);
    })
    .catch((error) => {
      self.postMessage({ error: error.message });
    });
});
