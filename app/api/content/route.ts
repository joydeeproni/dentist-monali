import { NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"
import { getContent, saveContent } from "@/lib/content"

export async function GET() {
  const content = await getContent()
  return NextResponse.json(content)
}

export async function PUT(request: Request) {
  const isAuthed = await verifySession()
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const content = await request.json()
  if (!content.doctor || !content.clinics || !content.reviews) {
    return NextResponse.json({ error: "Invalid content structure" }, { status: 400 })
  }
  try {
    await saveContent(content)
  } catch (err) {
    console.error("Failed to save content:", err)
    const message = err instanceof Error ? err.message : "Unknown error while saving"
    return NextResponse.json({ error: message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
