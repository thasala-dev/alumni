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
  // ปิด PrismaAdapter เพื่อให้จัดการ OAuth เอง
  // adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // ค้นหา user ที่มี email ตรงกัน และมี password_hash
        const user = await prisma.user.findFirst({
          where: {
            AND: [
              { email: credentials.email },
              {
                password_hash: {
                  not: null, // ต้องมี password_hash เท่านั้น
                },
              },
            ],
          },
        });

        if (!user) {
          throw new Error("ไม่พบผู้ใช้งาน หรือบัญชีนี้ไม่ได้ตั้งรหัสผ่าน");
        }

        if (!user.password_hash) {
          // บัญชีนี้สมัครด้วย OAuth - ไม่ควรเกิดขึ้นเพราะเรา filter แล้ว
          throw new Error(
            "บัญชีนี้สมัครด้วย Google/Facebook กรุณาเข้าสู่ระบบด้วยปุ่ม Social Login"
          );
        }

        const isValid = await compare(credentials.password, user.password_hash);
        if (!isValid) {
          throw new Error("รหัสผ่านไม่ถูกต้อง");
        }

        // Return only required fields for NextAuth session/jwt
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role ?? undefined, // ensure role is string | undefined
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
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
        // domain: ".yourdomain.com", // ถ้า deploy จริงให้ใส่ domain
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[signIn] Starting signIn callback", {
        provider: account?.provider,
        email: user.email,
      });

      // For OAuth providers (Google, Facebook, Apple) - ให้ login ได้ทุกกรณีตาม email
      if (
        account?.provider === "google" ||
        account?.provider === "facebook" ||
        account?.provider === "apple"
      ) {
        if (!user.email) {
          console.log("[signIn] ERROR: No email provided for OAuth");
          // Return true แทน false เพื่อไม่ให้ Access Denied
          return true;
        }

        try {
          // ค้นหา user ที่มี email เดียวกัน (ไม่สนใจว่ามี password_hash หรือไม่)
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          });

          console.log("[signIn] Existing user found:", existingUser);

          if (existingUser) {
            // ตรวจสอบว่ามี account สำหรับ provider นี้แล้วหรือไม่
            const existingAccount = existingUser.accounts.find(
              (acc) => acc.provider === account.provider
            );

            console.log("[signIn] Existing account:", existingAccount);

            if (!existingAccount) {
              // สร้าง account ใหม่เชื่อมกับ user เดิม
              console.log("[signIn] Creating new account for existing user");
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
              console.log("[signIn] Account created successfully");
            }

            // อัปเดตข้อมูลผู้ใช้
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
              },
            });

            console.log("[signIn] User updated successfully");
          } else {
            // สร้าง user ใหม่
            console.log("[signIn] Creating new user");

            // Generate unique username
            let usernameToSet =
              user.name || user.email?.split("@")[0] || "user";
            let candidate = usernameToSet;
            let counter = 1;

            while (
              await prisma.user.findUnique({ where: { username: candidate } })
            ) {
              candidate = `${usernameToSet}${counter}`;
              counter++;
            }

            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                username: candidate,
                name: user.name || undefined,
                image: user.image || undefined,
                role: "alumni",
                status: "UNREGISTERED",
              },
            });

            // สร้าง account สำหรับ user ใหม่
            await prisma.account.create({
              data: {
                userId: newUser.id,
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

            console.log("[signIn] New user and account created successfully");
          }

          return true;
        } catch (error) {
          console.error("[signIn] ERROR in OAuth signIn:", error);
          // Return true แทน false เพื่อไม่ให้เกิด Access Denied
          // แต่ user อาจไม่สามารถใช้งานได้จนกว่าจะแก้ปัญหา
          return true;
        }
      }

      // สำหรับ credentials login - ได้ผ่าน authorize แล้ว
      return true;
    },
    async session({ session, token }: any) {
      console.log("[session] Building session", {
        tokenSub: token.sub,
        sessionEmail: session.user.email,
      });

      if (token && session.user) {
        try {
          let userInDb;

          // ตรวจสอบว่า token มี id ที่เป็น UUID ที่ถูกต้องหรือไม่
          if (token.id && (token.id.length === 36 || token.id.length === 32)) {
            // ใช้ token.id สำหรับ credentials login
            userInDb = await prisma.user.findFirst({ where: { id: token.id } });
          }

          // ถ้าไม่พบ user จาก id ให้ใช้ email (สำหรับ OAuth)
          if (!userInDb && session.user.email) {
            userInDb = await prisma.user.findFirst({
              where: { email: session.user.email },
            });
          }

          if (userInDb) {
            session.user.id = userInDb.id;
            session.user.role = userInDb.role;
            session.user.status = userInDb.status;
            session.user.image =
              userInDb.image || session.user.image || "/placeholder-user.jpg";
            session.user.name = userInDb.name || session.user.name;

            console.log(
              "[session] Session built successfully for user:",
              userInDb.id
            );
          }
        } catch (error) {
          console.error("[session] Error building session:", error);
        }
      }

      return session;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        // สำหรับ credentials login user.id จะเป็น UUID
        // สำหรับ OAuth login user.id อาจไม่ใช่ UUID หรือไม่มี
        if (account?.provider === "credentials") {
          token.id = user.id;
        }
        // เก็บข้อมูลอื่นๆ ที่ไม่เกี่ยวกับ database ID
        token.role = user.role;
        token.status = user.status;
        token.email = user.email;
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
