import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = { 
  title: "Admin Login - Abadan Haly", 
  description: "Admin Login" 
};

// Login layout - bypasses parent admin layout auth check
// This layout is nested under /admin/layout.tsx but we need it to work without auth
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
