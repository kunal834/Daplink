
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthContextProvider } from "@/context/Authenticate";
import ClientLayout from "@/Components/ClientLayout";
import ClientAnalytics from "@/Components/ClientAnalytics";
import QueryProvider from "@/lib/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://daplink.online'), // THIS IS THE MAGIC LINE
  title: 'DapLink - One Link To Rule Them All',
  description: 'Your digital identity hub...',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: "./innovate.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* UI-level provider */}
        <ThemeProvider>

          {/* Auth-level provider */}
          <AuthContextProvider>

            {/* Data-fetching provider */}
            <QueryProvider>

              {/* Client-only UI shell */}
              <ClientLayout>
                {children}
              </ClientLayout>

            </QueryProvider>
          </AuthContextProvider>
        </ThemeProvider>

        <ClientAnalytics />
      </body>
    </html>
  );
}
