// context/Authenticate.js
"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext();
const AUTH_QUERY_KEY = ["auth", "me"];

async function fetchAuthState() {
    try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        return { user: res?.data?.user || null };
    } catch (error) {
        console.error("Auth check failed:", error);
        return { user: null };
    }
}

export function AuthContextProvider({ children }) {
    const queryClient = useQueryClient();

    const {
        data: authData,
        isLoading: loading,
        refetch: rawRefetch,
        isFetching,
    } = useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: fetchAuthState,
        staleTime: 2 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 1,
    });

    const user = authData?.user || null;
    const isAuthenticated = Boolean(user);

    // Force server revalidation when caller needs immediate freshness.
    const refreshAuth = useCallback(async () => {
        const result = await rawRefetch();
        return result.data || { user: null };
    }, [rawRefetch]);

    const login = useCallback((userData) => {
        queryClient.setQueryData(AUTH_QUERY_KEY, { user: userData || null });
        void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY, exact: true, refetchType: "active" });
    }, [queryClient]);

    const logout = useCallback(async () => {
        try {
            await axios.get("/api/auth/logout", { withCredentials: true });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            queryClient.setQueryData(AUTH_QUERY_KEY, { user: null });
            await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY, exact: true });
        }
    }, [queryClient]);

    const setUser = useCallback((userData) => {
        queryClient.setQueryData(AUTH_QUERY_KEY, { user: userData || null });
    }, [queryClient]);

    const setIsAuthenticated = useCallback((value) => {
        if (!value) {
            queryClient.setQueryData(AUTH_QUERY_KEY, { user: null });
            return;
        }
        void refreshAuth();
    }, [queryClient, refreshAuth]);

    const setLoading = useCallback(() => {
        // Kept for backward compatibility with existing consumers.
    }, []);

    const contextValue = useMemo(() => ({
        isAuthenticated,
        user,
        loading: loading || isFetching,
        login,
        logout,
        setUser,
        setIsAuthenticated,
        setLoading,
        refreshAuth,
    }), [
        isAuthenticated,
        user,
        loading,
        isFetching,
        login,
        logout,
        setUser,
        setIsAuthenticated,
        setLoading,
        refreshAuth,
    ]);

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
