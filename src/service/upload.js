import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { openDB } from 'idb';

export function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    const arrayBuffer = e.target.result;
    try {
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip);
      const text = doc.getFullText();
      await saveToIndexedDB(text);
    } catch (err) {
      console.error('Error processing DOCX file:', err);
    }
  };

  reader.readAsArrayBuffer(file);
}

async function saveToIndexedDB(text) {
  const dbName = 'docStorage';

  const db = await openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('docs')) {
        db.createObjectStore('docs', { keyPath: 'id', autoIncrement: true });
      }
    },
  });

  await db.add('docs', { content: text });

  console.log('DOCX content saved to IndexedDB');
}
