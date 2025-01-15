import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletProvider"; // Import WalletProvider
import { Toaster } from "react-hot-toast"; // Import Toaster
import { PoolProvider } from "@/context/PoolContext";

const inter_serif = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swap  | Jupyter",
  description: "Jupyter Swap Clone ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter_serif.className} antialiased`}>
        {/* Wrap the entire application with WalletProvider */}
        <PoolProvider>
        <WalletProvider>
          {children}
          <Toaster position="top-right" />
        </WalletProvider>
        </PoolProvider>
          
      </body>
    </html>
  );
}
