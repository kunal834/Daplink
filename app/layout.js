import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ToastContainer } from "react-toastify";


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
    <html lang="en">            
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <SessionWrapper>
        </SessionWrapper> */}
        <Navbar/>
      

        {children}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          theme="light"
        />
      
       <Analytics />
       <SpeedInsights/>
      </body>
    </html>
  );
}
