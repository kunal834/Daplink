"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifySuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Extracts token from url (?token=xyz)

  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token found in the link.");
      return;
    }

    async function triggerVerification() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(data.message || "Verification failed.");
        }
      } catch (err) {
        console.error("Network Error:", err);
        setStatus("error");
        setErrorMessage("A network server error occurred. Please try again.");
      }
    }

    triggerVerification();
  }, [token]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10 text-center">
          
          <img
            src="/innovate.png"
            alt="Daplink"
            className="w-20 h-20 mx-auto mb-6"
          />

          {/* ⏳ LOADING STATE */}
          {status === "verifying" && (
            <div>
              <div className="w-16 h-16 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Verifying your email...</h1>
              <p className="text-gray-600">Please wait while we update your secure digital profile.</p>
            </div>
          )}

          {/* ✅ SUCCESS STATE */}
          {status === "success" && (
            <div>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Email Verified</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Your email has been verified successfully. You can now access your Daplink account and start building your digital identity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login" className="px-8 py-4 rounded-xl bg-[#1d5f8c] text-white font-semibold hover:opacity-90 transition">
                  Continue to Login
                </Link>
                <Link href="/" className="px-8 py-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition">
                  Go Home
                </Link>
              </div>
            </div>
          )}

          {/* ❌ ERROR STATE */}
          {status === "error" && (
            <div>
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-red-600 mb-4">Verification Failed</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">{errorMessage}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login" className="px-8 py-4 rounded-xl bg-gray-900 text-white font-semibold hover:opacity-90 transition">
                  Back to Sign Up
                </Link>
              </div>
            </div>
          )}

        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Daplink. All rights reserved.
        </p>
      </div>
    </main>
  );
}