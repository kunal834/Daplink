'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize theme from localStorage if available, otherwise default to 'dark'
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('daplink-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme class/attribute to the HTML tag
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('daplink-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}