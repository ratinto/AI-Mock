export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const browserLocalStorage: KeyValueStorage = {
  getItem: (k) => localStorage.getItem(k),
  setItem: (k, v) => localStorage.setItem(k, v),
  removeItem: (k) => localStorage.removeItem(k),
};

export const browserSessionStorage: KeyValueStorage = {
  getItem: (k) => sessionStorage.getItem(k),
  setItem: (k, v) => sessionStorage.setItem(k, v),
  removeItem: (k) => sessionStorage.removeItem(k),
};

