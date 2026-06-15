"use client"

import type { SiteContent } from "@/lib/content"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe } from "lucide-react"

interface SeoEditorProps {
  content: SiteContent
  onChange: (content: SiteContent) => void
}

export function SeoEditor({ content, onChange }: SeoEditorProps) {
  const { seo } = content

  function update(field: string, value: string) {
    onChange({ ...content, seo: { ...seo, [field]: value } })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base">Page Metadata</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo-title">Page Title *</Label>
            <Input
              id="seo-title"
              value={seo.pageTitle}
              onChange={(e) => update("pageTitle", e.target.value)}
              placeholder="Dr. Monali Sengupta - Pediatric Dental Surgeon"
            />
            <p className="text-xs text-muted-foreground">
              Browser tab & search results. {seo.pageTitle.length}/60
              {seo.pageTitle.length > 60 && " (over recommended)"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-desc">Meta Description *</Label>
            <Textarea
              id="seo-desc"
              value={seo.metaDescription}
              onChange={(e) => update("metaDescription", e.target.value)}
              rows={3}
              placeholder="Find and contact Dr. Monali Sengupta's dental clinics..."
            />
            <p className="text-xs text-muted-foreground">
              Google search results. {seo.metaDescription.length}/160
              {seo.metaDescription.length > 160 && " (over recommended)"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-og">OG Image URL</Label>
            <Input
              id="seo-og"
              value={seo.ogImageUrl}
              onChange={(e) => update("ogImageUrl", e.target.value)}
              placeholder="/og-image.png or https://..."
            />
            <p className="text-xs text-muted-foreground">Social share image. Best at 1200x630px.</p>
          </div>
        </CardContent>
      </Card>

      {/* Google preview */}
      <Card>
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Google Search Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="rounded-lg border p-3 sm:p-4 bg-white space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span className="text-xs text-gray-500 truncate">dentistmonali.com</span>
            </div>
            <h3 className="text-[#1a0dab] text-sm sm:text-base font-medium leading-snug line-clamp-2">
              {seo.pageTitle || "Page Title"}
            </h3>
            <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-2">
              {seo.metaDescription || "Meta description..."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo-email">Contact Email</Label>
            <Input
              id="seo-email"
              type="email"
              value={seo.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              placeholder="doctor@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-phone">Contact Phone</Label>
            <Input
              id="seo-phone"
              value={seo.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
              placeholder="+91 XXXX XXXXXX"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
