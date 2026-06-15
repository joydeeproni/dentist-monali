import { NextResponse } from "next/server"
import { verifyPassword, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  const { password } = await request.json()

  if (!await verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const token = await createSession()
  const response = NextResponse.json({ success: true })
  response.cookies.set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("admin-token")
  return response
}
