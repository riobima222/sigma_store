import {getToken} from "next-auth/jwt"
import {NextRequest, NextResponse} from "next/server"

export const authAccess = async (req: NextRequest) => {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });
    if(!token) {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/admin', req.url))
}