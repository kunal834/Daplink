'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useTheme } from '@/context/ThemeContext';
import axios from "axios";
import Navbar from "@/Components/Navbar";

export default function ResetPassword() {
    const { theme } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset token.");
            router.push("/login");
        }
    }, [token, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        setLoading(true);
        try {
            const response = await axios.post("/api/auth/reset-password", {
                token,
                newPassword: password
            });

            toast.success(response.data.message);
            router.push("/login"); // Send them back to login
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        pageBg: theme === 'dark' ? 'bg-[#020202]' : 'bg-white',
        cardBg: theme === 'dark' ? 'bg-[#141414]/60 border-white/10' : 'bg-white/80 border-gray-100',
        textColor: theme === 'dark' ? 'text-white' : 'text-slate-900',
        subTextColor: theme === 'dark' ? 'text-gray-400' : 'text-slate-500',
        inputBase: `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border`,
        inputTheme: theme === 'dark'
          ? 'bg-black/30 border-white/10 text-white focus:border-teal-500/50'
          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-teal-500',
        btnBase: `w-full rounded-xl py-3 text-sm font-bold transition-transform active:scale-[0.98] shadow-lg cursor-pointer`,
        btnTheme: theme === 'dark'
          ? 'bg-white text-black hover:bg-gray-100'
          : 'bg-black text-white hover:bg-gray-800',
    };

    return (
        <>
            <Navbar />
            <div className={`relative min-h-screen w-full flex flex-col items-center justify-center font-sans transition-colors duration-500 ${styles.pageBg}`}>
                <div className="z-10 w-full max-w-md px-4">
                    <div className={`rounded-3xl shadow-2xl backdrop-blur-xl p-8 border transition-all duration-300 ${styles.cardBg}`}>
                        <div className="text-center mb-8">
                            <h1 className={`text-2xl font-bold ${styles.textColor}`}>Create New Password</h1>
                            <p className={`text-sm mt-2 ${styles.subTextColor}`}>Enter your new password below to regain access to your account.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`${styles.inputBase} ${styles.inputTheme}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>Confirm Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`${styles.inputBase} ${styles.inputTheme}`}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !password || !confirmPassword}
                                className={`${styles.btnBase} ${styles.btnTheme} flex items-center justify-center gap-2 mt-6`}
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Reset Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}