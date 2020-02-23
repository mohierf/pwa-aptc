/*
 * Browser local storage abstraction
 * Avoid using the local storage directy!
 * -------------------------
 * read, write and delete values
 */
const readFromStorage = key => {
  if (localStorage.getItem(key)) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      localStorage.removeItem(key);
      throw e;
    }
  }
};

const writeToStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

const removeFromStorage = key => localStorage.removeItem(key);

export { readFromStorage, writeToStorage, removeFromStorage };
