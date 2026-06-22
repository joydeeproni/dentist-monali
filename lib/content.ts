import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { put, list } from "@vercel/blob"

const DATA_PATH = join(process.cwd(), "data", "site-content.json")
const BLOB_PATH = "site-content.json"

// On Vercel the filesystem is read-only, so writes go to Vercel Blob.
// Locally (no token) we read/write the bundled JSON file instead.
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN

export interface SiteContent {
  doctor: {
    name: string
    title: string
    shortDescription: string
    longDescription: string[]
    profileImage: string
    coverImage: string
    bookingPhone: string
    googleReviewsLink: string
  }
  badges: {
    icon: string
    value: string
    label: string
  }[]
  clinics: {
    name: string
    availability: string
    address: string
    gpsLabel: string
    gpsLink: string
    phoneNumbers: string[]
    region: "north" | "south" | "other"
    active: boolean
  }[]
  reviews: {
    id: number
    author: string
    rating: number
    date: string
    content: string
    helpful: number
    reviewCount: string
    visible: boolean
  }[]
  seo: {
    pageTitle: string
    metaDescription: string
    ogImageUrl: string
    contactEmail: string
    contactPhone: string
  }
}

function getDefaultContent(): SiteContent {
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"))
}

export async function getContent(): Promise<SiteContent> {
  if (!useBlob) return getDefaultContent()

  try {
    const { blobs } = await list({ prefix: BLOB_PATH })
    const match = blobs.find((b) => b.pathname === BLOB_PATH)
    if (!match) return getDefaultContent()
    const res = await fetch(match.url, { cache: "no-store" })
    if (!res.ok) return getDefaultContent()
    return (await res.json()) as SiteContent
  } catch {
    // Fall back to the bundled defaults if Blob is unreachable.
    return getDefaultContent()
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  if (!useBlob) {
    writeFileSync(DATA_PATH, JSON.stringify(content, null, 2))
    return
  }

  await put(BLOB_PATH, JSON.stringify(content, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  })
}
