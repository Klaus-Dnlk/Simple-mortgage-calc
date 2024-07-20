export const openDB = (dbName, version, upgradeCallback) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);
  
      request.onupgradeneeded = (event) => {
        if (upgradeCallback) {
          upgradeCallback(event.target.result);
        }
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
    });
  };
  
  export const getAllBanks = (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['banks'], 'readonly');
      const objectStore = transaction.objectStore('banks');
      const request = objectStore.getAll();
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
    });
  };
  