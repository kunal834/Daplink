
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthContextProvider } from "@/context/Authenticate";
import ClientLayout from "@/Components/ClientLayout";
import ClientAnalytics from "@/Components/ClientAnalytics";
import PostHogProviderWrapper from "@/Components/PostHogProvider";
import QueryProvider from "@/lib/QueryProvider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://daplink.online'),
  
  // SEO TITLE: Distinct from "ARM DAPLink"
  title: {
    default: 'DapLink.online | Smart Link-in-Bio & Digital Identity SaaS',
    template: '%s | DapLink.online' // This adds branding to inner pages automatically
  },
  
  // DESCRIPTION: Explains exactly what you do (No firmware!)
  description: 'The ultimate SaaS platform for creators and developers. Consolidate your social links, generate QR codes, and manage your digital identity with DapLink.',
  
  // KEYWORDS: Crucial for separating you from embedded systems
  keywords: ['link in bio', 'digital business card', 'social profile', 'DapLink app', 'creator tools', 'portfolio builder', 'SaaS'],
  
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: "./innovate.png",
    apple: "./innovate.png", // Good to add for iPhones
  },

  // OPEN GRAPH: This controls how your link looks on WhatsApp, LinkedIn, Twitter/X
  openGraph: {
    title: 'DapLink - Your Digital Identity Hub',
    description: 'One link to connect your audience to everything you do. Build your professional profile in seconds.',
    url: 'https://daplink.online',
    siteName: 'DapLink',
    images: [
      {
        url: './innovate.png', // Or a larger banner image (1200x630px is best)
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProviderWrapper>
          {/* UI-level provider */}
          <ThemeProvider>

            {/* Auth-level provider */}
            <AuthContextProvider>

              {/* Data-fetching provider */}
              <QueryProvider>

                {/* Client-only UI shell */}

                <ClientLayout>
                  <Suspense fallback={null}>
                    {children}
                  </Suspense>
                </ClientLayout>
             <Suspense fallback={null}>
                  <ClientAnalytics />
                </Suspense>
               
              </QueryProvider>
            </AuthContextProvider>
          </ThemeProvider>
        </PostHogProviderWrapper>
      </body>
    </html>
  );
}
