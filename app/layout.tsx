import "./globals.css";

// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Airtek Warranty",
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
      <body>{children}</body>
    </html>
  );
}
