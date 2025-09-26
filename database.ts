import { User } from './App';

const DB_NAME = 'SikkimDigitalDB';
const DB_VERSION = 1;
const STORE_NAME = 'users';

let db: IDBDatabase;

export function initDB(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const dbInstance = request.result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'phone' });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      console.log("Database initialized successfully");
      resolve(true);
    };

    request.onerror = () => {
      console.error('Database initialization error:', request.error);
      reject(request.error);
    };
  });
}

export function getUser(phone: string): Promise<User | undefined> {
  return new Promise((resolve, reject) => {
    if (!db) {
        return reject("DB is not initialized.");
    }
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(phone);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error fetching user:', request.error);
      reject(request.error);
    };
  });
}

export function saveUser(user: User): Promise<void> {
  return new Promise((resolve, reject) => {
     if (!db) {
        return reject("DB is not initialized.");
    }
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(user);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      console.error('Error saving user:', request.error);
      reject(request.error);
    };
  });
}
