import "./globals.css";

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['vietnamese'] })

export const metadata = {
  title: "Admin",
  description:
    "Airtek Warranty offers comprehensive coverage and peace of mind for HVAC products, providing hassle-free repairs, genuine parts, flexible duration options, and transferable coverage, ensuring a worry-free ownership experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
