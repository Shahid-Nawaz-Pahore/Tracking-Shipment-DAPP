"use client";
import { Inter } from "next/font/google";

import { TrackingProvider } from "../context/tracking";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TrackingProvider>
          <NavBar />
          {children}
        </TrackingProvider>
        <Footer />
      </body>
    </html>
  );
}
