import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "change-me-in-production-please"
)

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }

  const token = request.cookies.get("admin-token")?.value
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  try {
    await jwtVerify(token, SECRET)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
}

export const config = {
  matcher: "/admin/:path*",
}
