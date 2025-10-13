import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = { 
  title: "Admin Login - Abadan Haly", 
  description: "Admin Login" 
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-gray-50">
      {children}
    </div>
  );
}
