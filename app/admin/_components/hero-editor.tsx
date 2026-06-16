"use client"

import Image from "next/image"
import type { SiteContent } from "@/lib/content"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { EmojiIconPicker } from "./emoji-picker"

interface HeroEditorProps {
  content: SiteContent
  onChange: (content: SiteContent) => void
}

export function HeroEditor({ content, onChange }: HeroEditorProps) {
  const { doctor, badges } = content

  function updateDoctor(field: string, value: string) {
    onChange({ ...content, doctor: { ...doctor, [field]: value } })
  }

  function updateBadge(index: number, field: string, value: string) {
    const updated = [...badges]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...content, badges: updated })
  }

  function addBadge() {
    onChange({ ...content, badges: [...badges, { icon: "", value: "", label: "" }] })
  }

  function removeBadge(index: number) {
    onChange({ ...content, badges: badges.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base">Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-name">Headline *</Label>
            <Input
              id="hero-name"
              value={doctor.name}
              onChange={(e) => updateDoctor("name", e.target.value)}
              maxLength={100}
              placeholder="Dr. Monali Sengupta"
            />
            <p className="text-xs text-muted-foreground">{doctor.name.length}/100</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subtitle *</Label>
            <Textarea
              id="hero-subtitle"
              value={doctor.shortDescription}
              onChange={(e) => updateDoctor("shortDescription", e.target.value)}
              maxLength={200}
              rows={2}
              placeholder="Pediatric dental surgeon practising in Kolkata since 2014."
            />
            <p className="text-xs text-muted-foreground">{doctor.shortDescription.length}/200</p>
          </div>

          <ImageUpload
            label="Hero Image *"
            id="hero-cover"
            value={doctor.coverImage}
            onChange={(url) => updateDoctor("coverImage", url)}
            hint="Works best at 1200x630px"
          />

          <div className="space-y-2">
            <Label htmlFor="hero-title">Title / Specialty</Label>
            <Input
              id="hero-title"
              value={doctor.title}
              onChange={(e) => updateDoctor("title", e.target.value)}
              placeholder="Pediatric Dental Surgeon"
            />
          </div>
        </CardContent>
      </Card>

      {/* Live Preview - Hero */}
      <Card className="overflow-hidden">
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="relative h-40 sm:h-52 bg-black">
            {doctor.coverImage && (
              <Image
                src={doctor.coverImage}
                alt="Cover preview"
                fill
                className="object-cover opacity-60"
                unoptimized
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
            <div className="relative z-10 p-4 flex flex-col justify-end h-full">
              <div className="flex items-end gap-3">
                {doctor.profileImage && (
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-[#ec4319] overflow-hidden relative shrink-0">
                    <Image
                      src={doctor.profileImage}
                      alt="Profile"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm leading-tight truncate">
                    {doctor.name || "Doctor Name"}
                  </p>
                  <p className="text-gray-300 text-xs mt-0.5 line-clamp-1">
                    {doctor.shortDescription || "Description..."}
                  </p>
                </div>
              </div>
              {badges.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {badges.map((badge, i) => (
                    <div
                      key={i}
                      className="bg-white/10 backdrop-blur-sm rounded-full px-2 py-1.5 text-center shrink-0"
                    >
                      {badge.icon && (
                        <span className="text-base leading-none block">
                          {badge.icon.startsWith("http") ? (
                            <Image src={badge.icon} alt="" width={16} height={16} unoptimized className="mx-auto" />
                          ) : (
                            badge.icon
                          )}
                        </span>
                      )}
                      <p className="text-[10px] text-white font-medium leading-tight mt-0.5">
                        {badge.value}
                      </p>
                      <p className="text-[9px] text-gray-300 leading-tight">{badge.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base">About / Bio</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
          <ImageUpload
            label="Profile Image *"
            id="profile-img"
            value={doctor.profileImage}
            onChange={(url) => updateDoctor("profileImage", url)}
            hint="Square image works best (e.g. 400x400px)"
          />

          <div className="space-y-2">
            <Label htmlFor="bio-text">Bio Text (one paragraph per blank line)</Label>
            <Textarea
              id="bio-text"
              value={doctor.longDescription.join("\n\n")}
              onChange={(e) =>
                onChange({
                  ...content,
                  doctor: {
                    ...doctor,
                    longDescription: e.target.value.split("\n\n").filter(Boolean),
                  },
                })
              }
              rows={5}
              placeholder="Write the doctor's bio here..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-phone">Booking Phone</Label>
              <Input
                id="booking-phone"
                value={doctor.bookingPhone}
                onChange={(e) => updateDoctor("bookingPhone", e.target.value)}
                placeholder="+91..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google-link">Google Reviews Link</Label>
              <Input
                id="google-link"
                value={doctor.googleReviewsLink}
                onChange={(e) => updateDoctor("googleReviewsLink", e.target.value)}
                placeholder="https://g.co/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Credentials / Badges</CardTitle>
          <Button variant="outline" size="sm" onClick={addBadge}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-3">
          {badges.map((badge, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg border space-y-3">
              <div className="flex items-start justify-between">
                <EmojiIconPicker
                  label="Icon"
                  value={badge.icon}
                  onChange={(v) => updateBadge(i, "icon", v)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 h-8 w-8"
                  onClick={() => removeBadge(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Value</Label>
                  <Input
                    value={badge.value}
                    onChange={(e) => updateBadge(i, "value", e.target.value)}
                    placeholder="10+ years of"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={badge.label}
                    onChange={(e) => updateBadge(i, "label", e.target.value)}
                    placeholder="experience"
                  />
                </div>
              </div>
            </div>
          ))}
          {badges.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No badges yet. Tap &quot;Add&quot; to create one.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
