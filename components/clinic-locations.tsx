"use client"

import { useState } from "react"
import { ClinicCard } from "@/components/clinic-card"
import { clinicData } from "@/lib/clinic-data"

const areas = {
  north: ["Dumdum cantonment", "New Town"],
  south: ["Kasba", "Mukundapur", "Beleghata", "Rawdon Street"],
}

const tabs = [
  { value: "all", label: "All" },
  { value: "north", label: "North/Central" },
  { value: "south", label: "South" },
]

export function ClinicLocations() {
  const [selectedArea, setSelectedArea] = useState("all")

  const filterClinicsByArea = (area: string) => {
    if (area === "all") return clinicData

    return clinicData.filter((clinic) => {
      const location = clinic.gpsLabel
      if (area === "north") return areas.north.some((a) => location.includes(a))
      if (area === "south") return areas.south.some((a) => location.includes(a))
      return false
    })
  }

  const filteredClinics = filterClinicsByArea(selectedArea)

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedArea(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedArea === tab.value
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredClinics.map((clinic, index) => (
          <ClinicCard key={index} clinic={clinic} />
        ))}
      </div>
    </div>
  )
}
