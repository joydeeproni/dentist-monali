import { Suspense } from "react"
import { HeroSection } from "@/components/hero-section"
import { ClinicLocations } from "@/components/clinic-locations"
import { GoogleReviews } from "@/components/google-reviews"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Appointments Section */}
      <section id="appointments" className="px-6 md:px-12 lg:px-16 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-6">Appointments</h2>
        <Suspense
          fallback={
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          }
        >
          <ClinicLocations />
        </Suspense>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="px-6 md:px-12 lg:px-16 py-10 border-t border-border">
        <Suspense
          fallback={
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
          }
        >
          <GoogleReviews />
        </Suspense>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 lg:px-16 py-8 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          Dr. Monali Sengupta - Pediatric Dental Surgeon, Kolkata
        </p>
      </footer>
    </main>
  )
}
