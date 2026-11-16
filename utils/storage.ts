export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : fallback;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }
};
