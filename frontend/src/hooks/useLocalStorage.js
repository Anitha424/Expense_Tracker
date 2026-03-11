import { useState, useEffect } from 'react';

/**
 * Custom hook to manage localStorage with automatic persistence
 * @param {string} key - localStorage key
 * @param {any} initialValue - initial value if key doesn't exist
 * @returns {[any, Function]} - current value and setter function
 */
export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage, or use initialValue if not found
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Clear specific localStorage key
 * @param {string} key - localStorage key to remove
 */
export const clearLocalStorage = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing localStorage (${key}):`, error);
  }
};

/**
 * Get all transactions from localStorage
 * @returns {Array} - array of transactions
 */
export const getStoredTransactions = () => {
  try {
    const item = window.localStorage.getItem('transactions');
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error reading transactions from localStorage:', error);
    return [];
  }
};

/**
 * Save transactions to localStorage
 * @param {Array} transactions - array of transactions to save
 */
export const saveTransactions = (transactions) => {
  try {
    window.localStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to localStorage:', error);
  }
};

/**
 * Get all categories from localStorage
 * @returns {Array} - array of categories
 */
export const getStoredCategories = () => {
  try {
    const item = window.localStorage.getItem('categories');
    return item ? JSON.parse(item) : getDefaultCategories();
  } catch (error) {
    console.error('Error reading categories from localStorage:', error);
    return getDefaultCategories();
  }
};

/**
 * Save categories to localStorage
 * @param {Array} categories - array of categories to save
 */
export const saveCategories = (categories) => {
  try {
    window.localStorage.setItem('categories', JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories to localStorage:', error);
  }
};

/**
 * Get default expense categories
 * @returns {Array} - array of default categories
 */
export const getDefaultCategories = () => [
  { id: 1, name: 'Food & Dining', color: '#FF6B6B', icon: '🍔' },
  { id: 2, name: 'Shopping', color: '#4ECDC4', icon: '🛍️' },
  { id: 3, name: 'Transport', color: '#45B7D1', icon: '🚗' },
  { id: 4, name: 'Utilities', color: '#F7DC6F', icon: '💡' },
  { id: 5, name: 'Entertainment', color: '#BB8FCE', icon: '🎬' },
  { id: 6, name: 'Healthcare', color: '#85C1E2', icon: '⚕️' },
  { id: 7, name: 'Education', color: '#82E0AA', icon: '📚' },
  { id: 8, name: 'Other', color: '#BDC3C7', icon: '📌' },
];

/**
 * Get or generate unique ID for new items
 * @returns {string} - unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
