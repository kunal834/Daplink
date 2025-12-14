'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Link as LinkIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTheme } from '@/context/ThemeContext'; // Ensure this path matches your project
import { useAuth } from "@/context/Authenticate";
import axios from "axios";
import Navbar from "@/Components/Navbar";

export default function Login() {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const isFormValid = email.trim() !== "" && password.trim() !== "" && (isLogin || name.trim() !== "");


  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();

  // Auth Check
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!user.isProfileComplete) {
      router.replace("/Generate");
      return;
    }

    router.replace("/Dashboard");
  }, [authLoading, user]);


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`/api/auth/login`, {
        email,
        password
      })

      const data = response.data;

      if (data.user) {
        toast.success("Login Successful!");
        login(data.user);
        router.replace("/Dashboard");
      }
      else {
        console.log("Login Failed:", data.message);
        toast.error(data.message);
      }
      setLoading(false);

    } catch (error) {
      console.error("Login Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      const data = response.data;

      if (data.user) {
        toast.success("Signup Successful! please login to continue.");
        router.replace("/login");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };


  // Dynamic Styles based on theme
  const styles = {
    pageBg: theme === 'dark' ? 'bg-[#020202]' : 'bg-white',
    cardBg: theme === 'dark' ? 'bg-[#141414]/60 border-white/10' : 'bg-white/80 border-gray-100',
    textColor: theme === 'dark' ? 'text-white' : 'text-slate-900',
    subTextColor: theme === 'dark' ? 'text-gray-400' : 'text-slate-500',
    inputBase: `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border`,
    inputTheme: theme === 'dark'
      ? 'bg-black/30 border-white/10 text-white focus:border-teal-500/50'
      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-teal-500',
    btnBase: `w-full rounded-xl py-3 text-sm font-bold transition-transform active:scale-[0.98] shadow-lg`,
    btnTheme: theme === 'dark'
      ? 'bg-white text-black hover:bg-gray-100'
      : 'bg-black text-white hover:bg-gray-800',
    socialBtn: `w-full flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-medium transition-colors ${theme === 'dark' ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`
  };


  return (
    <>
      <Navbar />
      <div className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans pt-12 transition-colors duration-500 ${styles.pageBg}`}>

        {/* Background Effects */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-purple-900/20 top-[-10%] left-[-10%] rounded-full blur-[100px] animate-aurora"></div>
          <div className="absolute w-[500px] h-[500px] bg-teal-900/20 bottom-[-10%] right-[-10%] rounded-full blur-[100px] animate-aurora" style={{ animationDelay: '-5s' }}></div>
          {theme === 'light' && <div className="absolute inset-0 bg-white/40 z-[-1]"></div>}
        </div>


        <div className="z-10 w-full max-w-md px-4">
          {/* Login Card */}
          <div className={`rounded-3xl shadow-2xl backdrop-blur-xl p-8 border transition-all duration-300 ${styles.cardBg}`}>

            <div className="text-center mb-8">
              <h1 className={`text-2xl font-bold ${styles.textColor}`}>
                {isLogin ? "Welcome back" : "Create an account"}
              </h1>
              <p className={`text-sm mt-2 ${styles.subTextColor}`}>
                {isLogin ? "Sign in to your DapLink account" : "Sign up for a new DapLink account"}
              </p>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button className={styles.socialBtn}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.087 0 12 0 7.31 0 3.256 2.74 1.307 6.704l3.959 3.06z" />
                  <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-3.96 3.066C4.257 21.26 7.847 24 12 24c3.314 0 6.213-1.207 8.302-3.239l-4.262-2.748z" />
                  <path fill="#4A90E2" d="M19.834 20.762c2.069-2.032 3.272-4.779 3.272-8.065 0-1.023-.113-1.994-.312-2.915H12v5.408h6.302c-.452 2.277-2.289 3.944-4.262 2.748L19.834 20.762z" />
                  <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.307 6.704C.463 8.28 0 10.086 0 12c0 1.916.462 3.72 1.307 5.296l3.97-3.028z" />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className={`w-full border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 rounded ${theme === 'dark' ? 'bg-[#141414] text-gray-400' : 'bg-white text-gray-400'}`}>Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${styles.inputBase} ${styles.inputTheme}`}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${styles.inputBase} ${styles.inputTheme}`}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>Password</label>
                  <a href="#" className="text-xs font-medium text-teal-500 hover:underline">Forgot password?</a>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${styles.inputBase} ${styles.inputTheme}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                onClick={isLogin ? handleLoginSubmit : handleSignupSubmit}
                disabled={loading || !isFormValid}
                className={`${styles.btnBase} ${styles.btnTheme} flex items-center justify-center gap-2 ${(!isFormValid || loading) ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    {isLogin ? "Logging in..." : "Signing up..."}
                  </>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            <div className={`mt-6 text-center text-sm ${styles.subTextColor}`}>
              {isLogin ? "Don't have an account? " : "Have an account? "}
              <button
                className="font-medium text-teal-500 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up for free" : "Sign in"}
              </button>
            </div>
          </div>

          <p className={`text-center text-xs mt-8 ${styles.subTextColor}`}>
            {"By continuing, you agree to DapLink's "}
            <a href="#" className="underline hover:text-teal-500">Terms of Service</a>
            {" and "}
            <a href="#" className="underline hover:text-teal-500">Privacy Policy</a>.
          </p>

        </div>
      </div >
    </>
  );
}