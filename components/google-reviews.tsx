"use client"

import { useState } from "react"
import { Star, ExternalLink, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react"

interface Review {
  id: number
  author: string
  rating: number
  date: string
  content: string
  helpful: number
  reviewCount: string
}

interface GoogleReviewsProps {
  reviews: Review[]
  googleReviewsLink: string
}

export function GoogleReviews({ reviews, googleReviewsLink }: GoogleReviewsProps) {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2)
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Google Reviews</h2>
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#FACC15] text-[#FACC15]" />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">{avgRating}</span>
          <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-card border border-border rounded-lg p-5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-semibold text-foreground">{review.author[0]}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{review.author}</h4>
                  <span className="text-xs text-muted-foreground">{review.reviewCount}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{review.date}</span>
            </div>
            <div className="flex mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-[#FACC15] text-[#FACC15]" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
            <div className="flex items-center mt-3 text-xs text-muted-foreground">
              <ThumbsUp className="h-3 w-3 mr-1" /> {review.helpful}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {reviews.length > 2 && (
          <button
            className="flex items-center justify-center gap-1 w-full py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? (
              <>
                <ChevronUp className="h-4 w-4" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" /> Show More Reviews
              </>
            )}
          </button>
        )}

        <button
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          onClick={() => window.open(googleReviewsLink, "_blank")}
        >
          <ExternalLink className="h-4 w-4" /> View & Leave Reviews on Google
        </button>
      </div>
    </div>
  )
}
