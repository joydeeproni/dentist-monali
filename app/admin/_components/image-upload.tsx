"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ExternalLink, Upload, Loader2, X, ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
  id?: string
}

export function ImageUpload({ label, value, onChange, hint, id }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!allowed.includes(file.type)) {
      toast.error("Invalid file type. Use JPG, PNG, WebP, or SVG.")
      return
    }
    if (file.size > 4.5 * 1024 * 1024) {
      toast.error("File too large (max 4.5 MB)")
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      if (res.status === 401) {
        toast.error("Session expired. Please log in again.")
        return
      }
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Upload failed")
        return
      }
      const { url } = await res.json()
      onChange(url)
      toast.success("Image uploaded")
    } catch {
      toast.error("Upload failed. Check your connection.")
    } finally {
      setUploading(false)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {/* URL input row */}
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload below"
          className="flex-1"
          disabled={uploading}
        />
        {value && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(value, "_blank")}
            title="Preview image"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragOver
            ? "border-black bg-gray-50"
            : "border-gray-200 hover:border-gray-300"
        } ${uploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="flex items-center justify-center gap-2 py-1">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            <span className="text-sm text-gray-500">Uploading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-1">
            <Upload className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              Click to upload or drag & drop
            </span>
            <span className="text-xs text-gray-400">JPG, PNG, WebP, SVG (max 4.5 MB)</span>
          </div>
        )}
      </div>

      {/* Thumbnail preview */}
      {value && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border">
          <div className="w-10 h-10 rounded border overflow-hidden bg-white shrink-0 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground truncate flex-1">{value}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-gray-400 hover:text-red-500"
            onClick={(e) => { e.stopPropagation(); onChange("") }}
            title="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
