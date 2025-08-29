import NextAuth, {
  type NextAuthOptions,
  type SessionStrategy,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await prisma.User.findFirst({
          where: {
            OR: [
              { username: credentials.username },
              { email: credentials.username },
            ],
          },
        });
        if (!user) return null;

        const isValid = await compare(credentials.password, user.password_hash);
        if (!isValid) return null;
        // Return only required fields for NextAuth session/jwt
        return {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only run for OAuth (Google, Facebook)
      if (account?.provider === "google" || account?.provider === "facebook") {
        if (!user?.email) {
          return false;
        }

        // ค้นหา user ที่ email ตรงกัน
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          // เช็คว่ามี account record สำหรับ provider นี้หรือยัง
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: String(account.providerAccountId),
              },
            },
          });
          if (!existingAccount) {
            // สร้าง account record เชื่อมกับ user เดิม
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: String(account.providerAccountId),
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
          }
          // อัปเดตข้อมูล user (optional)
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              username: user.name || undefined,
              name: user.name || undefined,
              image: user.image || undefined,
            },
          });
        } else {
          // ถ้าไม่มี user เดิม สร้างใหม่
          await prisma.user.create({
            data: {
              email: user.email,
              username: user.name || undefined,
              name: user.name || undefined,
              image: user.image || undefined,
              role: "alumni",
              status: "UNREGISTERED",
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: String(account.providerAccountId),
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                },
              },
            },
          });
        }
      }
      // ให้ PrismaAdapter จัดการ linking user/account อัตโนมัติ
      return true;
    },
    async session({ session, token, user }: any) {
      const userInDb = await prisma.user.findFirst({
        where: { id: token.sub },
      });
      // Attach user id and role to session
      if (token && session.user) {
        session.user.id = token.sub;
        session.user.role = userInDb?.role || token.role;
        session.user.status = userInDb?.status;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
