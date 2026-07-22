import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import DbInitializer from "@/components/DbInitializer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Transfer CRM",
  description: "VIP Transfer and Fleet Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${dmSans.variable} font-sans min-h-full flex flex-col antialiased bg-background text-foreground`}>
        <DbInitializer />
        {children}
      </body>
    </html>
  );
}
