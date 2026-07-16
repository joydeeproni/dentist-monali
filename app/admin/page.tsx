"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import type { SiteContent } from "@/lib/content"
import { toast } from "sonner"
import {
  Image as ImageIcon,
  Building2,
  Star,
  Search,
  LogOut,
  Save,
  ExternalLink,
  Loader2,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroEditor } from "./_components/hero-editor"
import { ClinicsEditor } from "./_components/clinics-editor"
import { ReviewsEditor } from "./_components/reviews-editor"
import { SeoEditor } from "./_components/seo-editor"

type Section = "hero" | "clinics" | "reviews" | "seo"

const sections: { key: Section; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { key: "hero", label: "Hero & About", shortLabel: "Hero", icon: <ImageIcon className="h-5 w-5" /> },
  { key: "clinics", label: "Clinics", shortLabel: "Clinics", icon: <Building2 className="h-5 w-5" /> },
  { key: "reviews", label: "Reviews", shortLabel: "Reviews", icon: <Star className="h-5 w-5" /> },
  { key: "seo", label: "SEO & Settings", shortLabel: "SEO", icon: <Search className="h-5 w-5" /> },
]

export default function AdminDashboard() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [savedContent, setSavedContent] = useState<SiteContent | null>(null)
  const [activeSection, setActiveSection] = useState<Section>("hero")
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/content")
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((data) => {
        setContent(data)
        setSavedContent(data)
      })
      .catch(() => router.push("/admin/login"))
  }, [router])

  const isDirty = content && savedContent && JSON.stringify(content) !== JSON.stringify(savedContent)

  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isDirty])

  const save = useCallback(async () => {
    if (!content) return
    setSaving(true)
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      if (res.status === 401) { router.push("/admin/login"); return }
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || `Save failed (HTTP ${res.status})`)
      }
      setSavedContent(structuredClone(content))
      setLastSaved(new Date())
      toast.success("Saved!")
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Failed to save", {
        duration: 10000,
      })
    } finally {
      setSaving(false)
    }
  }, [content, router])

  const discard = useCallback(() => {
    if (savedContent) {
      setContent(structuredClone(savedContent))
      toast.info("Changes discarded")
    }
  }, [savedContent])

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" })
    router.push("/admin/login")
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* ========== SIDEBAR (desktop only) ========== */}
      <aside className="hidden lg:flex w-60 bg-white border-r flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-4 border-b">
          <h1 className="font-semibold text-sm">Dr. Monali</h1>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === s.key
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors w-full"
          >
            <ExternalLink className="h-4 w-4" /> View Site
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ========== MAIN AREA ========== */}
      <div className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0">
        {/* Top bar */}
        <header className="bg-white border-b sticky top-0 z-40 px-4 py-2.5 sm:px-6 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Left: title + mobile menu */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                className="lg:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-semibold truncate">
                  {sections.find((s) => s.key === activeSection)?.label}
                </h2>
                {lastSaved && (
                  <p className="text-[11px] text-muted-foreground hidden sm:block">
                    Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={discard}
                disabled={!isDirty}
                className="h-8 px-2.5 sm:px-3 text-xs sm:text-sm"
              >
                Discard
              </Button>
              <Button
                size="sm"
                onClick={save}
                disabled={saving || !isDirty}
                className="h-8 px-2.5 sm:px-3 text-xs sm:text-sm"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {menuOpen && (
            <div className="lg:hidden mt-2 pt-2 border-t space-y-1">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <ExternalLink className="h-4 w-4" /> View Live Site
              </a>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </header>

        {/* Editor area */}
        <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {activeSection === "hero" && <HeroEditor content={content} onChange={setContent} />}
            {activeSection === "clinics" && <ClinicsEditor content={content} onChange={setContent} />}
            {activeSection === "reviews" && <ReviewsEditor content={content} onChange={setContent} />}
            {activeSection === "seo" && <SeoEditor content={content} onChange={setContent} />}
          </div>
        </main>
      </div>

      {/* ========== BOTTOM NAV (mobile/tablet only) ========== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 safe-bottom">
        <div className="flex">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => { setActiveSection(s.key); setMenuOpen(false) }}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 pt-2.5 transition-colors ${
                activeSection === s.key
                  ? "text-gray-900"
                  : "text-gray-400"
              }`}
            >
              {s.icon}
              <span className="text-[10px] font-medium">{s.shortLabel}</span>
              {activeSection === s.key && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-900 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <style jsx global>{`
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </div>
  )
}
