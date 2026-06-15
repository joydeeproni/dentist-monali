import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const DATA_PATH = join(process.cwd(), "data", "site-content.json")

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

export function getContent(): SiteContent {
  const raw = readFileSync(DATA_PATH, "utf-8")
  return JSON.parse(raw)
}

export function saveContent(content: SiteContent): void {
  writeFileSync(DATA_PATH, JSON.stringify(content, null, 2))
}
