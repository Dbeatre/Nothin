const prefix = 'studypulse:';

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(prefix + key, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
};

export const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(prefix + key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const removeFromStorage = (key) => {
  localStorage.removeItem(prefix + key);
};
