import { getToken } from "next-auth/jwt"
import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/dashboard", "/users", "/jobs", "/post-job", "/settings"]

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // If accessing protected route without token
  // if (protectedRoutes.some((route) => pathname.startsWith(route))) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/login", request.url))
  //   }

  //   // Check role-based access
  //   if (token.role !== "admin" && pathname.startsWith("/dashboard")) {
  //     return NextResponse.redirect(new URL("/unauthorized", request.url))
  //   }
  // }

  // If already logged in and trying to access auth pages
  if (pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
