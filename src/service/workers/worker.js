const worker = new Worker('worker.js');

worker.onmessage = function (event) {
  const { type, data } = event.data;
  if (type === 'updateUI') {
    updateUI(data);
  }
};

function updateUI(data) {
  const container = document.getElementById('data-container');
  container.innerHTML = `
        <h2>Котировки</h2>
        <ul>
            ${data
              .map(
                (item) => `
                <li>${item.symbol}: ${item.current} (${item.change > 0 ? '+' : ''}${item.change}%)</li>
            `
              )
              .join('')}
        </ul>
    `;
}
self.onmessage = function (event) {
  const { action } = event.data;
  if (action === 'start') {
    fetchDataAndStore();
  }
};

const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB'];
const apiUrls = [
  'https://api.example.com/stock/AAPL',
  'https://api.example.com/stock/GOOGL',
  'https://api.example.com/stock/MSFT',
  'https://api.example.com/stock/AMZN',
  'https://api.example.com/stock/FB',
];

const dbName = 'stockDB';
const storeName = 'quotes';

function openDb() {
  return new Promise((res, rej) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore(storeName, { keyPath: 'symbol' });
    };

    request.onsuccess = function (event) {
      res(event.target.result);
    };

    request.onerror = function (event) {
      rej(event.target.error);
    };
  });
}

async function fetchDataAndStore() {
  const db = await openDb();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  const fetchPromises = apiUrls.map((url) =>
    fetch(url).then((response) => response.json())
  );
  const results = await Promise.all(fetchPromises);

  results.forEach((data) => {
    store.put({
      symbol: data.symbol,
      current: data.price,
      timestamp: new Date().toISOString(),
    });
  });

  tx.complete.then(() => {
    setTimeout(
      () => {
        checkForUpdates();
      },
      15 * 60 * 1000
    );
  });

  async function checkForUpdates() {
    const db = await openDb();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);

    const allData = [];
    const request = store.openCursor();

    request.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        allData.push(cursor.value);
        cursor.continue();
      } else {
        console.log('on success fails');
      }
    };
  }
}
