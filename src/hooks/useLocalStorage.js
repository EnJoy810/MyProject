import { useState, useEffect } from 'react';

/**
 * 本地存储 Hook - 自动同步 state 和 localStorage
 * @param {string} key - localStorage 的键名
 * @param {any} initialValue - 初始值
 * @returns {[value, setValue, removeValue]} - 值、设置函数、删除函数
 */
const useLocalStorage = (key, initialValue) => {
  // 从 localStorage 读取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 设置值到 state 和 localStorage
  const setValue = (value) => {
    try {
      // 支持函数式更新
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // 立即更新状态
      setStoredValue(valueToStore);
      // 同步更新localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 删除值
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;