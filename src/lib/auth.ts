import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email atau Username", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        quickSwitchUserId: { label: "Quick Switch User ID", type: "text" },
      },
      async authorize(credentials) {
        const quickId = credentials?.quickSwitchUserId as string | undefined;
        if (quickId) {
          const quickUser = await prisma.user.findUnique({
            where: { id: quickId },
          });
          if (!quickUser) return null;
          return {
            id: quickUser.id,
            name: quickUser.name,
            email: quickUser.email,
            role: quickUser.role,
          };
        }

        const rawId =
          (credentials?.identifier as string | undefined) ??
          (credentials?.email as string | undefined);
        const password = credentials?.password as string | undefined;
        if (!rawId || !password) return null;

        const clean = rawId.toLowerCase().trim().replace(/^@/, "");
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: clean }, { username: clean }],
          },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "STUDENT";
      }
      return session;
    },
  },
});

/**
 * Mengambil user yang sedang login dari database.
 * Mengembalikan null jika belum login (TIDAK ada fallback ke akun demo).
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
}

/**
 * Wajib login: jika belum login, otomatis diarahkan ke halaman /login.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
