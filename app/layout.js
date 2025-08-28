import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";


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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">            
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <SessionWrapper>
        </SessionWrapper> */}
        {/* <Navbar/> */}
        {children}
       
      </body>
    </html>
  );
}
