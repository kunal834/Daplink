"use client";
import React from "react";

export default function GenerateFormSkeleton() {
  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Header */}
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>

      {/* Tabs */}
      <div className="flex gap-2 justify-center mt-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        ))}
      </div>

      {/* Form Container */}
      <div className="border rounded-3xl p-6 space-y-4 bg-gray-100 dark:bg-[#111]">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        ))}
        <div className="h-10 bg-gray-400 dark:bg-gray-600 rounded w-1/2 mt-4 mx-auto"></div>
      </div>

      {/* Preview Column */}
      <div className="w-full h-[650px] bg-gray-200 dark:bg-gray-800 rounded-3xl mx-auto"></div>
    </div>
  );
}
