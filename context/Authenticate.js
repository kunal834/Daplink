// context/Authenticate.js
"use client";

import React, { createContext, useContext } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const queryClient = useQueryClient();
    const authQueryKey = ["auth", "me"];

    const {
        data: authData,
        isLoading: loading,
        refetch: refreshAuth,
    } = useQuery({
        queryKey: authQueryKey,
        refetchOnWindowFocus: false,
        retry: false,
        queryFn: async () => {
            try {
                const res = await axios.get("/api/auth/me");
                return { user: res.data?.user || null };
            } catch (error) {
                console.error("Auth check failed:", error);
                return { user: null };
            }
        },
    });

    const user = authData?.user || null;
    const isAuthenticated = Boolean(user);

    // Login function (set user in query cache)
    const login = (userData) => {
        queryClient.setQueryData(authQueryKey, { user: userData || null });
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.get("/api/auth/logout");
        } catch (err) {
            console.error("Logout error:", err);
        }
        queryClient.setQueryData(authQueryKey, { user: null });
        await queryClient.invalidateQueries({ queryKey: authQueryKey });
    };

    // Compatibility setters for existing consumers
    const setUser = (userData) => {
        queryClient.setQueryData(authQueryKey, { user: userData || null });
    };
    const setIsAuthenticated = (value) => {
        if (!value) {
            queryClient.setQueryData(authQueryKey, { user: null });
        }
    };
    const setLoading = () => { };

    const contextValue = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        setUser,
        setIsAuthenticated,
        setLoading,
        refreshAuth,
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
