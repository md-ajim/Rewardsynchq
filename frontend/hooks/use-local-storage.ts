import { useState, useEffect, useRef } from "react";

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(defaultValue);
  const initialReadDone = useRef(false);

  useEffect(() => {
    // 1. Initial read from localStorage on mount
    if (!initialReadDone.current) {
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setValue(JSON.parse(item) as T);
        }
      } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
      }
      initialReadDone.current = true;
      return;
    }

    // 2. Subsequent writes to localStorage
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}