import NextAuth, { type NextAuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { redirect } from "next/navigation";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/signin" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        // Dev-only: env-based user until DB users are added
        if (
          email === (process.env.ADMIN_EMAIL || "admin@abadanhaly.com") &&
          password === (process.env.ADMIN_PASSWORD || "Abadanhaly2016")
        ) {
          return { id: "admin", email, name: "Admin", role: "admin" } as any;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role || "editor";
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role || "editor";
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;
      } catch {}
      return baseUrl;
    },
  },
};

export async function requireRole(role: "admin" | "editor") {
  const s = await getServerSession(authOptions);
  const currentRole = (s?.user as any)?.role;
  if (!s || (role === "admin" && currentRole !== "admin")) redirect("/signin");
}


