import { userLogin } from "@/lib/firebase/services";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";

const authOption: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(
        credentials: Record<"username" | "password", string> | undefined
      ) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        const data = {
          username,
          password,
        };
        const user: any = await userLogin(data);
        if (!user) {
          throw new Error("not account, register first");
        } else {
          const passwordValid = await bcrypt.compare(password, user.password);
          if (passwordValid) {
            return user;
          }
          throw new Error("Wrong password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account?.provider === "credentials") {
        (token.email = user.email),
          (token.username = user.username),
          (token.role = user.role),
          (token.phone = user.phone);
      }
      return token;
    },
    async session({ session, token }: any) {
      (session.user.username = token.username),
        (session.user.email = token.email),
        (session.user.role = token.role),
        (session.user.phone = token.phone);
      return session;
    },
  },
};

export default NextAuth(authOption);
