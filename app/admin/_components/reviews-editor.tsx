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
import { Trash2, Plus, Pencil, Star, ArrowLeft, ThumbsUp } from "lucide-react"

interface ReviewsEditorProps {
  content: SiteContent
  onChange: (content: SiteContent) => void
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="focus:outline-none p-0.5"
        >
          <Star
            className={`h-7 w-7 ${
              n <= value ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export function ReviewsEditor({ content, onChange }: ReviewsEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  function updateReview(index: number, field: string, value: unknown) {
    const reviews = [...content.reviews]
    reviews[index] = { ...reviews[index], [field]: value }
    onChange({ ...content, reviews })
  }

  function addReview() {
    const maxId = content.reviews.reduce((max, r) => Math.max(max, r.id), 0)
    onChange({
      ...content,
      reviews: [
        ...content.reviews,
        { id: maxId + 1, author: "", rating: 5, date: "Recently", content: "", helpful: 0, reviewCount: "1 review", visible: true },
      ],
    })
    setEditingIndex(content.reviews.length)
  }

  function removeReview(index: number) {
    onChange({ ...content, reviews: content.reviews.filter((_, i) => i !== index) })
    if (editingIndex === index) setEditingIndex(null)
  }

  // ──── Edit view ────
  if (editingIndex !== null && content.reviews[editingIndex]) {
    const review = content.reviews[editingIndex]

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
              {review.author ? `Edit: ${review.author}` : "New Review"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
            <div className="space-y-2">
              <Label>Reviewer Name *</Label>
              <Input
                value={review.author}
                onChange={(e) => updateReview(editingIndex, "author", e.target.value)}
                placeholder="Full name"
              />
            </div>

            <div className="space-y-2">
              <Label>Star Rating *</Label>
              <StarRating value={review.rating} onChange={(v) => updateReview(editingIndex, "rating", v)} />
            </div>

            <div className="space-y-2">
              <Label>Review Text *</Label>
              <Textarea
                value={review.content}
                onChange={(e) => updateReview(editingIndex, "content", e.target.value)}
                rows={4}
                placeholder="Write the review text..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Date Posted</Label>
                <Input
                  value={review.date}
                  onChange={(e) => updateReview(editingIndex, "date", e.target.value)}
                  placeholder="a month ago"
                />
              </div>
              <div className="space-y-2">
                <Label>Helpful Count</Label>
                <Input
                  type="number"
                  value={review.helpful}
                  onChange={(e) => updateReview(editingIndex, "helpful", parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Review Count</Label>
              <Input
                value={review.reviewCount}
                onChange={(e) => updateReview(editingIndex, "reviewCount", e.target.value)}
                placeholder="1 review"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={review.visible}
                onCheckedChange={(checked) => updateReview(editingIndex, "visible", checked)}
              />
              <Label>Show on website</Label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Review
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete review?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Remove review by &quot;{review.author || "this reviewer"}&quot;?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removeReview(editingIndex)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" onClick={() => setEditingIndex(null)} className="w-full sm:w-auto">Done</Button>
            </div>
          </CardContent>
        </Card>

        {/* Inline preview */}
        <Card>
          <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Preview</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="rounded-lg border p-4 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold">{review.author?.[0] || "?"}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{review.author || "Name"}</p>
                  <p className="text-xs text-muted-foreground">{review.reviewCount}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{review.date}</span>
              </div>
              <div className="flex">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <Star key={`e${i}`} className="h-3.5 w-3.5 text-gray-200" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.content || "Review text..."}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <ThumbsUp className="h-3 w-3 mr-1" /> {review.helpful}
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
          {content.reviews.length} review{content.reviews.length !== 1 ? "s" : ""}
          {" · "}
          {content.reviews.filter((r) => r.visible).length} visible
        </p>
        <Button onClick={addReview} size="sm" className="h-8 text-xs sm:text-sm">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {content.reviews.map((review, i) => (
        <Card key={review.id} className={!review.visible ? "opacity-60" : ""}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold">{review.author?.[0] || "?"}</span>
              </div>

              <div className="flex-1 min-w-0" onClick={() => setEditingIndex(i)}>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-medium text-sm truncate">{review.author || "Unnamed"}</h3>
                  {!review.visible && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Hidden</Badge>}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
              </div>

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
                      <AlertDialogTitle>Delete review?</AlertDialogTitle>
                      <AlertDialogDescription>Remove review by &quot;{review.author || "this reviewer"}&quot;?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => removeReview(i)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {content.reviews.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed rounded-xl">
          <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No reviews yet</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={addReview}>
            <Plus className="h-4 w-4 mr-1" /> Add Review
          </Button>
        </div>
      )}
    </div>
  )
}
