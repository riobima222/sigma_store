import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export const withAdmin = async (req: NextRequest) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (token) {
    if (token.role === "admin" || token.role === "super") {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
};
