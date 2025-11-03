import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abadan Haly Admin",
  description: "Admin Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tk">
      <body>
        {children}
      </body>
    </html>
  );
}
