import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { verifySession } from "@/lib/auth"

export async function POST(request: Request) {
  const isAuthed = await verifySession()
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const form = await request.formData()
  const file = form.get("file") as File | null
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const maxSize = 4.5 * 1024 * 1024
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File too large (max 4.5 MB)" }, { status: 400 })
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Use JPG, PNG, WebP, or SVG." },
      { status: 400 }
    )
  }

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  })

  return NextResponse.json({ url: blob.url })
}
