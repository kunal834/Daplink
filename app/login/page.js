"use client";

import React, { useEffect, useState } from "react";
import { Link as LinkIcon, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { set } from "mongoose";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      console.log("Auth Check:", data);
      setLoggedIn(data.user ? true : false);
    }
    check();
  }, []);
  useEffect(() => {
    console.log("Logged In Status:", loggedIn);
    if (loggedIn) {
      router.replace("/Generate");
    } else {
      setLoading(false);
    }
  }, [loggedIn, router]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid credentials");
        return;
      }

      if (data.user) {
        alert("Login Successful!");
        router.replace("/Generate");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed");
        return;
      }
      if (data.user) {
        alert("Signup Successful!");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  // Prevent UI flash while checking auth
  if (loading) return null;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden font-sans text-slate-900">

      {/* --- Background Effects (Aurora Blurs) --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[120px]" />
      <div className="absolute top-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-purple-200/40 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-200/40 blur-[120px]" />

      <div className="z-10 w-full max-w-md px-4">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-black text-white p-1 rounded-md">
            <LinkIcon size={20} className="rotate-45" />
          </div>
          <span className="text-xl font-semibold tracking-tight">DapLink</span>
        </div>

        {/* --- Login Card --- */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">

          {/* Header */}
          {isLogin ? (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
              <p className="text-slate-500 text-sm mt-2">Sign in to your DapLink account</p>
            </div>
          ) : (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
              <p className="text-slate-500 text-sm mt-2">Sign up for a new DapLink account</p>
            </div>
          )}
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.087 0 12 0 7.31 0 3.256 2.74 1.307 6.704l3.959 3.06z" />
                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-3.96 3.066C4.257 21.26 7.847 24 12 24c3.314 0 6.213-1.207 8.302-3.239l-4.262-2.748z" />
                <path fill="#4A90E2" d="M19.834 20.762c2.069-2.032 3.272-4.779 3.272-8.065 0-1.023-.113-1.994-.312-2.915H12v5.408h6.302c-.452 2.277-2.289 3.944-4.262 2.748L19.834 20.762z" />
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.307 6.704C.463 8.28 0 10.086 0 12c0 1.916.462 3.72 1.307 5.296l3.97-3.028z" />
              </svg>
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.05-.015-2.055-3.33.72-4.035-1.605-4.035-1.605-.54-1.38-1.335-1.755-1.335-1.755-1.095-.75.09-.735.09-.735 1.2.09 1.83 1.23 1.83 1.23 1.08 1.83 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or continue with email</span>
            </div>
          </div>

          {/* Email + Password Form */}
          <form className="space-y-4">
            {!isLogin ? (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>
            ) : null}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link href="#" className="text-xs font-medium text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              className="w-full bg-slate-950 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              onClick={isLogin ? handleLoginSubmit : handleSignupSubmit}
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? ("Don't have an account? ") : "Have an account? "}
            <button className="font-medium text-blue-600 hover:underline" onClick={() => isLogin? setIsLogin(false) : setIsLogin(true)}>
              {isLogin ? "Sign up for free" : "Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          By continuing, you agree to DapLink's{" "}
          <Link href="#" className="underline hover:text-slate-500">Terms of Service</Link> and{" "}
          <Link href="#" className="underline hover:text-slate-500">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
