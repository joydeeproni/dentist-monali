import { Suspense } from "react"
import type { Metadata } from "next"
import { HeroSection } from "@/components/hero-section"
import { ClinicLocations } from "@/components/clinic-locations"
import { GoogleReviews } from "@/components/google-reviews"
import { getContent } from "@/lib/content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent()
  return {
    title: content.seo.pageTitle,
    description: content.seo.metaDescription,
    icons: { icon: "/favicon.png", apple: "/favicon.png" },
    openGraph: {
      title: content.seo.pageTitle,
      description: content.seo.metaDescription,
      images: [{ url: content.seo.ogImageUrl, width: 1200, height: 630, alt: content.seo.pageTitle }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.pageTitle,
      description: content.seo.metaDescription,
      images: [content.seo.ogImageUrl],
    },
  }
}

export default async function Home() {
  const content = await getContent()
  const activeClinics = content.clinics.filter((c) => c.active)
  const visibleReviews = content.reviews.filter((r) => r.visible)

  return (
    <main className="min-h-screen bg-background">
      <HeroSection doctor={content.doctor} badges={content.badges} />

      <section id="appointments" className="px-6 md:px-12 lg:px-16 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-6">Appointments</h2>
        <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
          <ClinicLocations clinics={activeClinics} />
        </Suspense>
      </section>

      <section id="reviews" className="px-6 md:px-12 lg:px-16 py-10 border-t border-border">
        <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
          <GoogleReviews reviews={visibleReviews} googleReviewsLink={content.doctor.googleReviewsLink} />
        </Suspense>
      </section>

      <footer className="px-6 md:px-12 lg:px-16 py-8 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          {content.doctor.name} - {content.doctor.title}, Kolkata
        </p>
      </footer>
    </main>
  )
}
