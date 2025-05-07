import { Suspense } from "react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ClinicLocations } from "@/components/clinic-locations"
import { DoctorProfile } from "@/components/doctor-profile"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 md:mb-0">Dr. Monali Sengupta</h1>
            <LanguageSwitcher />
          </div>
          <p className="text-lg font-medium text-black">Pediatric Dental Surgeon</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>}>
              <DoctorProfile />
            </Suspense>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-black mb-6">Find a Clinic Near You</h2>
            <Suspense fallback={<div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>}>
              <ClinicLocations />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
