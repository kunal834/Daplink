// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLayout from "@/Components/ClientLayout";
import { AuthContextProvider } from "@/context/Authenticate";
import ClientAnalytics from "@/Components/ClientAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Daplink",
  description: "connect by Daplink",
  icons: {
    icon: "./innovate.png",
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* 1. Provider wraps everything */}
        <ThemeProvider>
          <AuthContextProvider>
            {/* 2. ClientLayout handles the UI that needs useTheme() */}
            <ClientLayout>

              {children}
            </ClientLayout>
          </AuthContextProvider>
        </ThemeProvider>

        <ClientAnalytics />
      </body>
    </html>
  );
}