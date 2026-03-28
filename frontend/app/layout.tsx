import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // High-end geometric sans
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { PageWrapper } from "@/components/PageWrapper";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HopeBridge | Verified Medical Help",
  description: "Share verified medical needs and allow the world to support safely.",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased selection:bg-emerald-100 selection:text-emerald-900`}>
        <AuthProvider>
          <Navbar />
          <main className="bg-slate-50/30">
            <PageWrapper>
              {children}
            </PageWrapper>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
