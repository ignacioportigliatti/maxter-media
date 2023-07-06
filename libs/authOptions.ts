import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

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
        try {
          const res = await fetch("http://127.0.0.1:3000/api/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });
          console.log(`res: ${JSON.stringify(res)}`);
          const data = await res.json();
          console.log(`data: ${JSON.stringify(data)}`);
          if (res.ok && data.success) {
            // Construct the user object to return
            const user = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              image: data.user.image,
            };

            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          console.error(`Error tratando de ingresar: ${error}`);
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.user;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.role = user.role;
      }

      return token;
    },
  },
};
