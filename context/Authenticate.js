// context/Authenticate.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Login function (set user manually)
    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.get("/api/auth/logout"); // if you create logout API
        } catch (err) {
            console.error("Logout error:", err);
        }
        setIsAuthenticated(false);
        setUser(null);
    };

    // Check user session
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/auth/me");

                if (res.data?.user) {
                    setIsAuthenticated(true);
                    setUser(res.data.user); // Store only user object
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const contextValue = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        setUser,
        setIsAuthenticated,
        setLoading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return ctx;
}
