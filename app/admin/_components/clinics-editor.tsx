"use client"

import { useState } from "react"
import type { SiteContent } from "@/lib/content"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Plus, Pencil, MapPin, Phone, Clock, ChevronUp, ChevronDown, X, ArrowLeft, Building2 } from "lucide-react"

interface ClinicsEditorProps {
  content: SiteContent
  onChange: (content: SiteContent) => void
}

export function ClinicsEditor({ content, onChange }: ClinicsEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  function updateClinic(index: number, field: string, value: unknown) {
    const clinics = [...content.clinics]
    clinics[index] = { ...clinics[index], [field]: value }
    onChange({ ...content, clinics })
  }

  function addClinic() {
    const newClinic = {
      name: "",
      availability: "",
      address: "",
      gpsLabel: "",
      gpsLink: "",
      phoneNumbers: [""],
      region: "south" as const,
      active: true,
    }
    onChange({ ...content, clinics: [...content.clinics, newClinic] })
    setEditingIndex(content.clinics.length)
  }

  function removeClinic(index: number) {
    onChange({ ...content, clinics: content.clinics.filter((_, i) => i !== index) })
    if (editingIndex === index) setEditingIndex(null)
  }

  function moveClinic(index: number, direction: -1 | 1) {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= content.clinics.length) return
    const clinics = [...content.clinics]
    ;[clinics[index], clinics[newIndex]] = [clinics[newIndex], clinics[index]]
    onChange({ ...content, clinics })
    if (editingIndex === index) setEditingIndex(newIndex)
  }

  // ──── Edit view ────
  if (editingIndex !== null && content.clinics[editingIndex]) {
    const clinic = content.clinics[editingIndex]

    return (
      <div className="space-y-4">
        <button
          onClick={() => setEditingIndex(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gray-900 transition-colors -mb-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to list
        </button>

        <Card>
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-base truncate">
              {clinic.name ? `Edit: ${clinic.name}` : "New Clinic"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
            <div className="space-y-2">
              <Label>Clinic Name *</Label>
              <Input
                value={clinic.name}
                onChange={(e) => updateClinic(editingIndex, "name", e.target.value)}
                placeholder="Theism Dental"
              />
            </div>

            <div className="space-y-2">
              <Label>Location / Address *</Label>
              <Input
                value={clinic.address}
                onChange={(e) => updateClinic(editingIndex, "address", e.target.value)}
                placeholder="Theism Dental, Dumdum cantonment, Kolkata"
              />
            </div>

            <div className="space-y-2">
              <Label>Days & Hours *</Label>
              <Textarea
                value={clinic.availability}
                onChange={(e) => updateClinic(editingIndex, "availability", e.target.value)}
                placeholder='Mon (4pm to 8pm); Wed (4pm to 8pm)'
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                &quot;Day (start to end)&quot; separated by semicolons
              </p>
            </div>

            <div className="space-y-2">
              <Label>GPS Label</Label>
              <Input
                value={clinic.gpsLabel}
                onChange={(e) => updateClinic(editingIndex, "gpsLabel", e.target.value)}
                placeholder="Dumdum cantonment"
              />
            </div>

            <div className="space-y-2">
              <Label>Google Maps Link</Label>
              <Input
                value={clinic.gpsLink}
                onChange={(e) => updateClinic(editingIndex, "gpsLink", e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Numbers</Label>
              {clinic.phoneNumbers.map((phone, j) => (
                <div key={j} className="flex gap-2">
                  <Input
                    value={phone}
                    onChange={(e) => {
                      const phones = [...clinic.phoneNumbers]
                      phones[j] = e.target.value
                      updateClinic(editingIndex, "phoneNumbers", phones)
                    }}
                    placeholder="+91 XXXX XXXXXX"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 shrink-0 h-9 w-9"
                    onClick={() => {
                      const phones = clinic.phoneNumbers.filter((_, k) => k !== j)
                      updateClinic(editingIndex, "phoneNumbers", phones.length ? phones : [""])
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateClinic(editingIndex, "phoneNumbers", [...clinic.phoneNumbers, ""])
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add Phone
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Region *</Label>
              <div className="flex flex-wrap gap-2">
                {(["north", "south", "other"] as const).map((region) => (
                  <Button
                    key={region}
                    variant={clinic.region === region ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateClinic(editingIndex, "region", region)}
                  >
                    {region === "north" ? "North/Central" : region === "south" ? "South" : "Other"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={clinic.active}
                onCheckedChange={(checked) => updateClinic(editingIndex, "active", checked)}
              />
              <Label>Active (visible on website)</Label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Clinic
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete clinic?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove &quot;{clinic.name || "this clinic"}&quot;. Undo with Discard before saving.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => removeClinic(editingIndex)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" onClick={() => setEditingIndex(null)} className="w-full sm:w-auto">
                Done
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inline preview */}
        <Card>
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Card Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="rounded-lg border p-4 bg-white space-y-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono uppercase ${
                  clinic.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${clinic.active ? "bg-green-500" : "bg-gray-400"}`} />
                {clinic.active ? "Active" : "Inactive"}
              </span>
              <h3 className="text-base font-medium">{clinic.name || "Clinic Name"}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 shrink-0" />
                <span className="line-clamp-1">{clinic.availability || "Schedule..."}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span>{clinic.gpsLabel || "Location..."}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-[#ec4319] text-white text-xs font-medium">Call</span>
                <span className="px-3 py-1 rounded-full border text-xs font-medium">Map</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ──── List view ────
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {content.clinics.length} clinic{content.clinics.length !== 1 ? "s" : ""}
          {" · "}
          {content.clinics.filter((c) => c.active).length} active
        </p>
        <Button onClick={addClinic} size="sm" className="h-8 text-xs sm:text-sm">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {content.clinics.map((clinic, i) => (
        <Card
          key={i}
          className={`transition-colors ${!clinic.active ? "opacity-60" : ""}`}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Reorder - hidden on smallest screens */}
              <div className="hidden sm:flex flex-col gap-0.5">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveClinic(i, -1)} disabled={i === 0}>
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveClinic(i, 1)} disabled={i === content.clinics.length - 1}>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0" onClick={() => setEditingIndex(i)}>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-medium text-sm truncate">{clinic.name || "Untitled"}</h3>
                  {!clinic.active && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Off</Badge>}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {clinic.gpsLabel || "No location"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3 text-xs" onClick={() => setEditingIndex(i)}>
                  <Pencil className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete clinic?</AlertDialogTitle>
                      <AlertDialogDescription>Remove &quot;{clinic.name || "this clinic"}&quot;?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => removeClinic(i)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {content.clinics.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed rounded-xl">
          <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No clinics yet</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={addClinic}>
            <Plus className="h-4 w-4 mr-1" /> Add Clinic
          </Button>
        </div>
      )}
    </div>
  )
}
