// /app/layout.tsx o /app/layout.js (dependiendo de si usas TypeScript o JavaScript)
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aplicativo Sistema Gastronomico - Restaurante con Nextjs y App Router - Prisma",
  description: "Aplicativo Sistema Gastronomico - Restaurante con Nextjs y App Router - Prisma",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <ClerkProvider>
        <html lang="en">
        <body className={`${inter.className} bg-gray-100`}>{children}</body>
        </html>
      </ClerkProvider>
  );
}
