"use client"

import { useState } from "react"
import { Star, ExternalLink, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Real reviews from Google
const reviews = [
  {
    id: 1,
    author: "Archi Dam",
    rating: 5,
    date: "a year ago",
    content:
      "Dr. Monali is an excellent dentist for children. She takes immense care of her patients, considering kids can be difficult at times to be treated. She understands them and interact with them patiently, giving ample amount of time for treatment. Definitely recommended!",
    helpful: 1,
    reviewCount: "1 review",
  },
  {
    id: 2,
    author: "Nupur Nayak Sardar",
    rating: 5,
    date: "4 months ago",
    content:
      "Dr. Monali is an outstanding pediatric dentist who truly understands how to handle children during their treatment. She shows exceptional care and patience, recognizing the unique challenges that come with treating young patients. With her expertise, children feel comfortable and at ease during dental procedures.",
    helpful: 2,
    reviewCount: "2 reviews",
  },
  {
    id: 3,
    author: "Ankur Agrawal",
    rating: 5,
    date: "a month ago",
    content:
      "Dr. Monali is a very good doctor. We have been taking her consultation since last 5 years for my son and its always helpful. Procedures are also very smooth as she engages well with kids. Special Thanks!",
    helpful: 3,
    reviewCount: "8 reviews",
  },
]

export function GoogleReviews() {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Google Reviews</CardTitle>
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium">5.0 (5 reviews)</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-2">
        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <h4 className="font-medium">{review.author}</h4>
                  <span className="text-xs text-gray-500 ml-2">({review.reviewCount})</span>
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
              <div className="flex mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700">{review.content}</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <ThumbsUp className="h-3 w-3 mr-1" /> {review.helpful}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-6 py-4">
        {reviews.length > 2 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-black hover:bg-gray-100"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" /> Show More
              </>
            )}
          </Button>
        )}

        <Button
          className="w-full bg-black hover:bg-gray-800 text-white"
          onClick={() => window.open("https://g.co/kgs/XexjHqw", "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" /> View & Leave Reviews on Google
        </Button>
      </CardFooter>
    </Card>
  )
}
