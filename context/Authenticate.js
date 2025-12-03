// context/Authenticate.js
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Export the Context Object
export const AuthContext = createContext(); 

// Export the Provider function
export function AuthContextProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Placeholder functions for login/logout (Add your real logic later)
    const login = (userData) => { 
        setIsAuthenticated(true);
        setUser(userData);
    };
    const logout = () => {
        // Here you would typically clear the token and redirect
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        // Simulate an authentication check (replace with real logic)
        const checkAuth = async () => {
            setLoading(true);
            try {
                // Simulate an API call
             const res = await axios.get('/api/auth/me');;
        //    console.log(res.data.user);

            const authenticated = true; // <--- CHANGE THIS
                const userData = authenticated ? res.data : null; // Use a simple object

                setIsAuthenticated(authenticated);
                setUser(userData);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    const contextValue = {
        isAuthenticated, 
        user, 
        loading,
        setIsAuthenticated, 
        setUser, 
        setLoading,
        login, 
        logout 
    };

    return (
        // Pass the state and functions down in the value prop
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// 2. Export the custom hook for consuming the context
export function useAuth() {
    // This hook allows any child component to access the contextValue
   const ctx = useContext(AuthContext); 
     if (!ctx) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return ctx;
}