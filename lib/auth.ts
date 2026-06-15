import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "change-me-in-production-please"
)

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "M0nali$Dent@l-2024!xK9"

export async function verifyPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(SECRET)
  return token
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin-token")?.value
  if (!token) return false
  try {
    await jwtVerify(token, SECRET)
    return true
  } catch {
    return false
  }
}
