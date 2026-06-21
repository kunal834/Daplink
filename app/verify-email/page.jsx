"use client";

import Link from "next/link";

export default function VerifySuccessPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10 text-center">

          <img
            src="/innovate.png"
            alt="Daplink"
            className="w-20 h-20 mx-auto mb-6"
          />

          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Email Verified
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Your email has been verified successfully.
            You can now access your Daplink account and
            start building your digital identity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link
              href="/login"
              className="px-8 py-4 rounded-xl bg-[#1d5f8c] text-white font-semibold hover:opacity-90 transition"
            >
              Continue to Login
            </Link>

            <Link
              href="/"
              className="px-8 py-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Go Home
            </Link>

          </div>

        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Daplink. All rights reserved.
        </p>
      </div>
    </main>
  );
}
