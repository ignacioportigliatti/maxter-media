import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Maxter Admin",
      credentials: {
        email: {
          label: "Email/Username",
          type: "text",
          placeholder: "ejemplo@maxterproducciones.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;
        
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
    session: ({ session, token }: {session: any, token: any}) => {
      const sessionCallback = {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      }
      return sessionCallback
    },
    jwt: ({ token, user }: { token:any, user:any }) => {
      if (user) {
        const u = user as unknown as User;
        return {
          ...token,
          id: u.id,
          role: u.role,
        }
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: "/auth/signin",
  },
};
