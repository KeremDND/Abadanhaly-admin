import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abadan Haly Admin",
  description: "Admin panel for Abadan Haly website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

