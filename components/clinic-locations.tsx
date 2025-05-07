"use client"

import { useState } from "react"
import { ClinicCard } from "@/components/clinic-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { clinicData } from "@/lib/clinic-data"

// Group clinics by area
const areas = {
  north: ["Dumdum cantonment", "New Town"],
  south: ["Kasba", "Mukundapur", "Beleghata", "Rawdon Street"],
}

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
      <Tabs defaultValue="all" onValueChange={setSelectedArea}>
        <TabsList className="mb-6 w-full grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="north">North/Central</TabsTrigger>
          <TabsTrigger value="south">South</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedArea} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClinics.map((clinic, index) => (
              <ClinicCard key={index} clinic={clinic} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
