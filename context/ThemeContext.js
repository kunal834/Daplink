'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // default remains the same
  const [theme, setTheme] = useState('light');

  // READ once on mount (same as before)
  useEffect(() => {
    const savedTheme = Cookies.get('daplink-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    Cookies.set('daplink-theme', theme, {
      expires: 365,
      sameSite: 'lax',
      path: '/',
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
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
