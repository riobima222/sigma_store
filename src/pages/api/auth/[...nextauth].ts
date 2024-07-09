import { loginGoogle, signUp, signUpGoogle, userLogin } from "@/lib/firebase/services";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import jwt from "jsonwebtoken";

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account?.provider === "credentials") {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.gender = user.gender;
        token.role = user.role;
      }
      if (account?.provider === "google") {
        const userGoogle = {
          username: user.name || "",
          email: user.email || "",
          image: user.image || "",
          role: "member",
          login: "google",
        };
        const googleUser: any = await signUpGoogle(userGoogle);
        token.id = googleUser.id;
        token.username = googleUser.username;
        token.email = googleUser.email;
        token.image = googleUser.image;
        token.role = googleUser.role;
        token.login = googleUser.login;
      }
      return token;
    },
    async session({ session, token }: any) {
      (session.id = token.id || ""),
      (session.user.username = token.username || ""),
        (session.user.email = token.email || ""),
        (session.user.role = token.role || ""),
        (session.user.phone = token.phone || ""),
        (session.user.login = token.login || "credentials");
      const accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || "", {
        algorithm: "HS256",
      });
      session.accessToken = accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOption);
