"use client"

import { useState } from "react"
import { Star, ExternalLink, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react"

const reviews = [
  {
    id: 1,
    author: "Sulagna Ghosh",
    rating: 5,
    date: "5 months ago",
    content:
      "Dr. Monali is an outstanding doctor! The entire experience was fantastic. Dr. Monali was incredibly knowledgeable and took the time to explain everything clearly. I\u2019m so grateful for the excellent care my son had received! Great doctor!",
    helpful: 0,
    reviewCount: "2 reviews",
    images: [] as string[],
  },
  {
    id: 2,
    author: "Adrija Roy",
    rating: 5,
    date: "9 months ago",
    content:
      "Dr. Monali Sengupta made my 3-year-old daughter\u2019s first dental visit incredibly smooth and stress-free. She\u2019s truly a specialist\u2014professional, patient, and always ready to help. Her positive approach, smiling nature, and reassuring presence made my child feel completely at ease. She\u2019s extremely skilled and knowledgable. I highly recommend Dr. Monali for paediatric dental care!! She\u2019s the only dentist I trust for my little one.",
    helpful: 1,
    reviewCount: "3 reviews",
    images: ["/images/reviews/adrija-before-after.png"],
  },
  {
    id: 3,
    author: "Sohail Aslam",
    rating: 5,
    date: "9 months ago",
    content:
      "Best pediatric dentist in Kolkata. Dr Monali is awesome with her work. My daughter love to visit her. It\u2019s been years I\u2019m showing my daughter from her. Dr Monali takes really good care of patients. I must say if ur child having dental issues then u must visit her once",
    helpful: 1,
    reviewCount: "20 reviews",
    images: [] as string[],
  },
]

export function GoogleReviews() {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Google Reviews</h2>
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#FACC15] text-[#FACC15]" />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">5.0</span>
          <span className="text-sm text-muted-foreground">(3 reviews)</span>
        </div>
      </div>

      {/* Review Cards */}
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
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Photo shared by ${review.author}`}
                    className="rounded-md object-cover max-h-32 w-auto border border-border"
                  />
                ))}
              </div>
            )}
            <div className="flex items-center mt-3 text-xs text-muted-foreground">
              <ThumbsUp className="h-3 w-3 mr-1" /> {review.helpful}
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Less */}
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
          onClick={() => window.open("https://g.co/kgs/XexjHqw", "_blank")}
        >
          <ExternalLink className="h-4 w-4" /> View & Leave Reviews on Google
        </button>
      </div>
    </div>
  )
}
