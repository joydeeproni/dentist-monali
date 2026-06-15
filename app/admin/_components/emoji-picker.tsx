"use client"

import { useState, useRef, useEffect } from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smile, Link, X } from "lucide-react"

interface EmojiIconPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

function isUrl(str: string) {
  return str.startsWith("http://") || str.startsWith("https://")
}

export function EmojiIconPicker({ value, onChange, label }: EmojiIconPickerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [mode, setMode] = useState<"emoji" | "url">(isUrl(value) ? "url" : "emoji")
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    if (showPicker) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showPicker])

  return (
    <div className="space-y-1.5">
      {label && <Label className="text-xs">{label}</Label>}

      {/* Mode toggle */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setMode("emoji")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            mode === "emoji"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Smile className="h-3 w-3" /> Emoji
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            mode === "url"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Link className="h-3 w-3" /> URL
        </button>
      </div>

      {mode === "emoji" ? (
        <div className="relative" ref={pickerRef}>
          {/* Emoji display / trigger */}
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="w-full flex items-center gap-3 px-3 py-2 border rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            {value && !isUrl(value) ? (
              <span className="text-2xl leading-none">{value}</span>
            ) : (
              <span className="text-2xl leading-none opacity-30">😀</span>
            )}
            <span className="text-sm text-muted-foreground flex-1">
              {value && !isUrl(value) ? "Tap to change" : "Pick an emoji"}
            </span>
            {value && !isUrl(value) && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange("")
                }}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
          </button>

          {/* Picker dropdown */}
          {showPicker && (
            <div className="absolute z-50 mt-1 left-0 right-0 sm:left-auto sm:right-auto">
              <Picker
                data={data}
                onEmojiSelect={(emoji: { native: string }) => {
                  onChange(emoji.native)
                  setShowPicker(false)
                }}
                theme="light"
                previewPosition="none"
                skinTonePosition="search"
                maxFrequentRows={2}
                perLine={7}
                set="native"
              />
            </div>
          )}
        </div>
      ) : (
        <Input
          value={isUrl(value) ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="text-sm"
        />
      )}
    </div>
  )
}
